#![no_std]
use soroban_sdk::{contract, contractimpl, contracterror, contracttype, Address, Env, String, Symbol, Vec};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    NotAuthorized = 3,
    MaxSupplyReached = 4,
    TokenDoesNotExist = 5,
    NotOwner = 6,
    InvalidRoyalty = 7,
}

#[contracttype]
pub enum DataKey {
    Admin,
    BaseURI,
    TotalSupply,
    Treasury,
    RoyaltyBps,
    Balance(Address),
    Owner(u32),
    Approved(u32),
}

const MAX_SUPPLY: u32 = 888;

#[contract]
pub struct NFTCollectiblesContract;

#[contractimpl]
impl NFTCollectiblesContract {
    /// Initialize the contract with an admin, base URI, treasury address, and royalties in basis points (e.g. 500 = 5%)
    pub fn initialize(env: Env, admin: Address, base_uri: String, treasury: Address, royalty_bps: u32) -> Result<(), Error> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(Error::AlreadyInitialized);
        }
        if royalty_bps > 10000 {
            return Err(Error::InvalidRoyalty); // Max 100%
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::BaseURI, &base_uri);
        env.storage().instance().set(&DataKey::Treasury, &treasury);
        env.storage().instance().set(&DataKey::RoyaltyBps, &royalty_bps);
        env.storage().instance().set(&DataKey::TotalSupply, &0u32);
        Ok(())
    }

    /// Admin only: Change the Base URI
    pub fn set_base_uri(env: Env, new_uri: String) -> Result<(), Error> {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).ok_or(Error::NotInitialized)?;
        admin.require_auth();
        env.storage().instance().set(&DataKey::BaseURI, &new_uri);
        Ok(())
    }

    /// Mint a new NFT to a specific address. Returns the new Token ID.
    pub fn mint(env: Env, to: Address) -> Result<u32, Error> {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).ok_or(Error::NotInitialized)?;
        admin.require_auth();

        let mut current_supply: u32 = env.storage().instance().get(&DataKey::TotalSupply).unwrap_or(0);
        
        if current_supply >= MAX_SUPPLY {
            return Err(Error::MaxSupplyReached);
        }

        current_supply += 1;
        let token_id = current_supply;

        env.storage().persistent().set(&DataKey::Owner(token_id), &to);

        let mut user_balance: Vec<u32> = env.storage().persistent().get(&DataKey::Balance(to.clone())).unwrap_or_else(|| Vec::new(&env));
        user_balance.push_back(token_id);
        env.storage().persistent().set(&DataKey::Balance(to.clone()), &user_balance);

        env.storage().instance().set(&DataKey::TotalSupply, &current_supply);

        env.events().publish((Symbol::new(&env, "mint"), to.clone()), token_id);

        Ok(token_id)
    }

    /// Transfer a token to a new owner
    pub fn transfer(env: Env, caller: Address, from: Address, to: Address, token_id: u32) -> Result<(), Error> {
        caller.require_auth();
        let owner = Self::owner_of(env.clone(), token_id)?;
        
        if owner != from {
            return Err(Error::NotOwner);
        }
        
        // Caller must be owner OR approved
        if caller != owner {
            let approved: Option<Address> = env.storage().persistent().get(&DataKey::Approved(token_id));
            if let Some(approved_addr) = approved {
                if caller != approved_addr {
                    return Err(Error::NotAuthorized);
                }
            } else {
                return Err(Error::NotAuthorized);
            }
        }

        // Update ownership
        env.storage().persistent().set(&DataKey::Owner(token_id), &to);
        env.storage().persistent().remove(&DataKey::Approved(token_id)); // Clear approval on transfer

        // Update balances
        let mut from_balance: Vec<u32> = env.storage().persistent().get(&DataKey::Balance(from.clone())).unwrap();
        if let Some(index) = from_balance.first_index_of(token_id) {
            from_balance.remove(index);
            env.storage().persistent().set(&DataKey::Balance(from.clone()), &from_balance);
        }

        let mut to_balance: Vec<u32> = env.storage().persistent().get(&DataKey::Balance(to.clone())).unwrap_or_else(|| Vec::new(&env));
        to_balance.push_back(token_id);
        env.storage().persistent().set(&DataKey::Balance(to.clone()), &to_balance);

        env.events().publish((Symbol::new(&env, "transfer"), from, to), token_id);

        Ok(())
    }

    /// Approve another address to transfer this token
    pub fn approve(env: Env, caller: Address, operator: Address, token_id: u32) -> Result<(), Error> {
        caller.require_auth();
        let owner = Self::owner_of(env.clone(), token_id)?;
        
        if caller != owner {
            return Err(Error::NotOwner);
        }

        env.storage().persistent().set(&DataKey::Approved(token_id), &operator);
        env.events().publish((Symbol::new(&env, "approve"), owner, operator), token_id);
        Ok(())
    }

    /// Burn (destroy) a token
    pub fn burn(env: Env, caller: Address, token_id: u32) -> Result<(), Error> {
        caller.require_auth();
        let owner = Self::owner_of(env.clone(), token_id)?;
        
        if caller != owner {
            return Err(Error::NotOwner);
        }

        // Remove ownership and approvals
        env.storage().persistent().remove(&DataKey::Owner(token_id));
        env.storage().persistent().remove(&DataKey::Approved(token_id));

        // Update balance
        let mut owner_balance: Vec<u32> = env.storage().persistent().get(&DataKey::Balance(owner.clone())).unwrap();
        if let Some(index) = owner_balance.first_index_of(token_id) {
            owner_balance.remove(index);
            env.storage().persistent().set(&DataKey::Balance(owner.clone()), &owner_balance);
        }

        env.events().publish((Symbol::new(&env, "burn"), owner), token_id);
        Ok(())
    }

    /// Calculate Royalties for a given sale price
    pub fn get_royalty_info(env: Env, sale_price: u32) -> Result<(Address, u32), Error> {
        let treasury: Address = env.storage().instance().get(&DataKey::Treasury).ok_or(Error::NotInitialized)?;
        let bps: u32 = env.storage().instance().get(&DataKey::RoyaltyBps).unwrap_or(0);
        
        let royalty_amount = (sale_price * bps) / 10000;
        Ok((treasury, royalty_amount))
    }

    // --- GETTERS ---

    pub fn balance_of(env: Env, owner: Address) -> Vec<u32> {
        env.storage().persistent().get(&DataKey::Balance(owner)).unwrap_or_else(|| Vec::new(&env))
    }

    pub fn owner_of(env: Env, token_id: u32) -> Result<Address, Error> {
        env.storage().persistent().get(&DataKey::Owner(token_id)).ok_or(Error::TokenDoesNotExist)
    }

    pub fn total_supply(env: Env) -> u32 {
        env.storage().instance().get(&DataKey::TotalSupply).unwrap_or(0)
    }

    pub fn base_uri(env: Env) -> Result<String, Error> {
        env.storage().instance().get(&DataKey::BaseURI).ok_or(Error::NotInitialized)
    }
}
