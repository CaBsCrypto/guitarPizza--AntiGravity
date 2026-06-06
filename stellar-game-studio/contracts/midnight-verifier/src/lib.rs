#![no_std]

use soroban_sdk::{contract, contractimpl, contracterror, Address, Bytes, BytesN, Env, Symbol, vec};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    InvalidSignature = 1,
    NullifierAlreadyUsed = 2,
    CommitteeNotConfigured = 3,
    Unauthorized = 4,
}

#[contract]
pub struct MidnightVerifierContract;

#[contractimpl]
impl MidnightVerifierContract {
    /// Initialize the verifier with the public key of the Midnight validator committee.
    pub fn initialize(env: Env, admin: Address, committee_pubkey: BytesN<32>) {
        admin.require_auth();
        env.storage().instance().set(&Symbol::new(&env, "admin"), &admin);
        env.storage().instance().set(&Symbol::new(&env, "committee"), &committee_pubkey);
    }

    /// Verifies a blind signature ticket issued by Midnight.
    ///
    /// The ticket is signed by Midnight validators to authorize a score claim for a specific
    /// recipient wallet on Stellar, without revealing the player's private gaming trace or Midnight address.
    ///
    /// # Parameters
    /// - `nullifier`: The anonymous transaction nullifier registered on Midnight to prevent double spending.
    /// - `recipient`: The Stellar address that will receive the $SLICE prize.
    /// - `signature`: The Ed25519 signature certifying `hash(nullifier + recipient)`.
    pub fn verify_ticket(
        env: Env,
        nullifier: BytesN<32>,
        recipient: Address,
        signature: Bytes,
    ) -> Result<(), Error> {
        // 1. Resolve official Midnight validator committee public key
        let committee_pubkey: BytesN<32> = env
            .storage()
            .instance()
            .get(&Symbol::new(&env, "committee"))
            .ok_or(Error::CommitteeNotConfigured)?;

        // 2. Prevent replay attacks: ensure this nullifier hasn't been claimed on Stellar
        let nullifier_key = Symbol::new(&env, "nullifier");
        let registered_key = (nullifier_key, nullifier.clone());
        if env.storage().temporary().has(&registered_key) {
            return Err(Error::NullifierAlreadyUsed);
        }

        // 3. Reconstruct signature payload: hash(nullifier + recipient_address_string)
        let mut payload = Bytes::new(&env);
        payload.append(&nullifier.to_bytes());
        payload.append(&recipient.to_string().to_bytes());
        let payload_hash = env.crypto().keccak256(&payload);

        // 4. Cryptographically verify the Ed25519 signature against Midnight's committee public key
        // In Soroban, ed25519_verify takes: public_key (BytesN<32>), payload (Bytes), signature (BytesN<64>)
        let sig_bytes_n = BytesN::<64>::try_from(&signature).map_err(|_| Error::InvalidSignature)?;
        
        env.crypto()
            .ed25519_verify(&committee_pubkey, &payload_hash.into(), &sig_bytes_n);

        // 5. Store nullifier to prevent double claiming (TTL = 1 week or matching session parameters)
        env.storage().temporary().set(&registered_key, &true);
        env.storage().temporary().extend_ttl(&registered_key, 120_960, 518_400);

        // Emit verification event
        env.events().publish(
            (Symbol::new(&env, "midnight_verify"), recipient),
            nullifier,
        );

        Ok(())
    }

    /// Update the official Midnight validator committee public key (admin only).
    pub fn update_committee(env: Env, new_pubkey: BytesN<32>) -> Result<(), Error> {
        let admin: Address = env
            .storage()
            .instance()
            .get(&Symbol::new(&env, "admin"))
            .ok_or(Error::Unauthorized)?;
        admin.require_auth();

        env.storage().instance().set(&Symbol::new(&env, "committee"), &new_pubkey);
        Ok(())
    }
}
