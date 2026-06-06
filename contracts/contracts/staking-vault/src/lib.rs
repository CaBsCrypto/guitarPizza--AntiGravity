#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env};

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    SliceToken,
    CheeseToken,
    PepperoniToken,
    BaconToken,
    OnionToken,
    Stake(Address),
    LastHarvest(Address),
    Initialized,
}

#[contract]
pub struct StakingVault;

#[contractimpl]
impl StakingVault {
    pub fn initialize(
        env: Env,
        slice: Address,
        cheese: Address,
        pepperoni: Address,
        bacon: Address,
        onion: Address,
    ) {
        if env.storage().persistent().has(&DataKey::Initialized) {
            panic!("Already initialized");
        }
        env.storage().persistent().set(&DataKey::SliceToken, &slice);
        env.storage().persistent().set(&DataKey::CheeseToken, &cheese);
        env.storage().persistent().set(&DataKey::PepperoniToken, &pepperoni);
        env.storage().persistent().set(&DataKey::BaconToken, &bacon);
        env.storage().persistent().set(&DataKey::OnionToken, &onion);
        env.storage().persistent().set(&DataKey::Initialized, &true);
    }

    pub fn stake_slice(env: Env, user: Address, amount: i128) {
        user.require_auth();
        if amount <= 0 {
            panic!("Amount must be positive");
        }

        // Calculate and claim rewards first (based on old stake and updates last harvest time)
        Self::claim_rewards_internal(&env, &user);

        // Get the current stake
        let current_stake: i128 = env
            .storage()
            .persistent()
            .get(&DataKey::Stake(user.clone()))
            .unwrap_or(0);

        // Transfer slice from user to contract
        let slice_token: Address = env
            .storage()
            .persistent()
            .get(&DataKey::SliceToken)
            .unwrap();
        let slice_client = token::Client::new(&env, &slice_token);
        slice_client.transfer(&user, &env.current_contract_address(), &amount);

        // Update user's stake
        let new_stake = current_stake + amount;
        env.storage()
            .persistent()
            .set(&DataKey::Stake(user.clone()), &new_stake);

        // Set the last harvest time to the current ledger timestamp
        env.storage()
            .persistent()
            .set(&DataKey::LastHarvest(user.clone()), &env.ledger().timestamp());
    }

    pub fn unstake_slice(env: Env, user: Address, amount: i128) {
        user.require_auth();
        if amount <= 0 {
            panic!("Amount must be positive");
        }

        // Get the current stake
        let current_stake: i128 = env
            .storage()
            .persistent()
            .get(&DataKey::Stake(user.clone()))
            .unwrap_or(0);

        if current_stake < amount {
            panic!("Insufficient stake balance");
        }

        // Calculate and claim rewards first
        Self::claim_rewards_internal(&env, &user);

        // Update user's stake
        let new_stake = current_stake - amount;
        env.storage()
            .persistent()
            .set(&DataKey::Stake(user.clone()), &new_stake);

        // Transfer slice from contract to user
        let slice_token: Address = env
            .storage()
            .persistent()
            .get(&DataKey::SliceToken)
            .unwrap();
        let slice_client = token::Client::new(&env, &slice_token);
        slice_client.transfer(&env.current_contract_address(), &user, &amount);

        // Set the last harvest time to the current ledger timestamp
        env.storage()
            .persistent()
            .set(&DataKey::LastHarvest(user.clone()), &env.ledger().timestamp());
    }

    pub fn claim_rewards(env: Env, user: Address) {
        user.require_auth();
        Self::claim_rewards_internal(&env, &user);
    }

    pub fn get_stake(env: Env, user: Address) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::Stake(user))
            .unwrap_or(0)
    }

    pub fn get_last_harvest(env: Env, user: Address) -> u64 {
        env.storage()
            .persistent()
            .get(&DataKey::LastHarvest(user))
            .unwrap_or(0)
    }
}

impl StakingVault {
    fn claim_rewards_internal(env: &Env, user: &Address) {
        let stake: i128 = env
            .storage()
            .persistent()
            .get(&DataKey::Stake(user.clone()))
            .unwrap_or(0);

        let now = env.ledger().timestamp();
        let last_harvest = env
            .storage()
            .persistent()
            .get(&DataKey::LastHarvest(user.clone()))
            .unwrap_or(now);

        if stake > 0 && now > last_harvest {
            let elapsed = (now - last_harvest) as i128;
            // rate is 1 ingredient per minute per 100 $SLICE staked.
            // reward_amount = (stake * elapsed) / (60 * 100)
            let reward = (stake * elapsed) / 6000;

            if reward > 0 {
                let cheese_token: Address = env
                    .storage()
                    .persistent()
                    .get(&DataKey::CheeseToken)
                    .unwrap();
                let pepperoni_token: Address = env
                    .storage()
                    .persistent()
                    .get(&DataKey::PepperoniToken)
                    .unwrap();
                let bacon_token: Address = env
                    .storage()
                    .persistent()
                    .get(&DataKey::BaconToken)
                    .unwrap();
                let onion_token: Address = env
                    .storage()
                    .persistent()
                    .get(&DataKey::OnionToken)
                    .unwrap();

                token::Client::new(env, &cheese_token).transfer(
                    &env.current_contract_address(),
                    user,
                    &reward,
                );
                token::Client::new(env, &pepperoni_token).transfer(
                    &env.current_contract_address(),
                    user,
                    &reward,
                );
                token::Client::new(env, &bacon_token).transfer(
                    &env.current_contract_address(),
                    user,
                    &reward,
                );
                token::Client::new(env, &onion_token).transfer(
                    &env.current_contract_address(),
                    user,
                    &reward,
                );
            }
        }

        // Update last harvest time to now
        env.storage()
            .persistent()
            .set(&DataKey::LastHarvest(user.clone()), &now);
    }
}

mod test;
