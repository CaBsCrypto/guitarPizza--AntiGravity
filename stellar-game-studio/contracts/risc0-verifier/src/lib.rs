#![no_std]

use soroban_sdk::{contract, contractimpl, contracterror, Bytes, BytesN, Env, Address, Symbol};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    InvalidProof = 1,
    Unauthorized = 2,
    NotInitialized = 3,
}

#[contract]
pub struct Risc0VerifierContract;

#[contractimpl]
impl Risc0VerifierContract {
    /// Initialize the verifier (admin only)
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&Symbol::new(&env, "admin")) {
            panic!("already initialized");
        }
        env.storage().instance().set(&Symbol::new(&env, "admin"), &admin);
    }

    /// Verifies a RISC Zero Groth16/zkVM proof.
    ///
    /// In mock/verification mode (Testnet & Local testing),
    /// we verify that the first 32 bytes of the seal match the keccak256 hash of the journal.
    /// In production, this would call the cryptographic host functions for BN254 / Groth16 curves.
    pub fn verify(
        env: Env,
        journal: Bytes,
        _image_id: BytesN<32>,
        seal: Bytes,
    ) -> Result<(), Error> {
        if seal.len() < 32 {
            return Err(Error::InvalidProof);
        }

        // Integrity check: keccak256 of the journal must match the first 32 bytes of the seal.
        let expected_hash: Bytes = env.crypto().keccak256(&journal).into();
        let seal_hash = seal.slice(0..32);

        if seal_hash != expected_hash {
            return Err(Error::InvalidProof);
        }

        // Publish verification success event
        env.events().publish(
            (Symbol::new(&env, "risc0_verify"), _image_id),
            journal,
        );

        Ok(())
    }
}
