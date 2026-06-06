#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, testutils::Ledger, Address, Env};

#[test]
fn test_staking_vault() {
    let env = Env::default();
    env.mock_all_auths();

    // 1. Create admins and users
    let admin = Address::generate(&env);
    let user = Address::generate(&env);

    // 2. Register mock tokens
    let slice_token_addr = env.register_stellar_asset_contract(&admin);
    let cheese_token_addr = env.register_stellar_asset_contract(&admin);
    let pepperoni_token_addr = env.register_stellar_asset_contract(&admin);
    let bacon_token_addr = env.register_stellar_asset_contract(&admin);
    let onion_token_addr = env.register_stellar_asset_contract(&admin);

    // Setup clients for tokens to mint
    let slice_admin = token::StellarAssetClient::new(&env, &slice_token_addr);
    let cheese_admin = token::StellarAssetClient::new(&env, &cheese_token_addr);
    let pepperoni_admin = token::StellarAssetClient::new(&env, &pepperoni_token_addr);
    let bacon_admin = token::StellarAssetClient::new(&env, &bacon_token_addr);
    let onion_admin = token::StellarAssetClient::new(&env, &onion_token_addr);

    // 3. Register Staking Vault contract
    let vault_id = env.register(StakingVault, ());
    let vault_client = StakingVaultClient::new(&env, &vault_id);

    // 4. Initialize the Staking Vault
    vault_client.initialize(
        &slice_token_addr,
        &cheese_token_addr,
        &pepperoni_token_addr,
        &bacon_token_addr,
        &onion_token_addr,
    );

    // Fund the staking vault with rewards tokens
    // We want each ingredient token to be available in the contract for payouts
    let reward_funding = 1_000_000_000i128;
    cheese_admin.mint(&vault_id, &reward_funding);
    pepperoni_admin.mint(&vault_id, &reward_funding);
    bacon_admin.mint(&vault_id, &reward_funding);
    onion_admin.mint(&vault_id, &reward_funding);

    // Mint SLICE to user
    let user_slice_balance = 10_000i128;
    slice_admin.mint(&user, &user_slice_balance);

    // Verify initial state
    assert_eq!(vault_client.get_stake(&user), 0);
    assert_eq!(vault_client.get_last_harvest(&user), 0);

    // Set initial ledger timestamp
    env.ledger().set_timestamp(1000);

    // 5. Stake SLICE
    let stake_amount = 1000i128; // 1000 SLICE (which at 1 per minute per 100 SLICE should earn 10 ingredients per minute)
    vault_client.stake_slice(&user, &stake_amount);

    // Check balances after stake
    let slice_client = token::Client::new(&env, &slice_token_addr);
    assert_eq!(slice_client.balance(&user), user_slice_balance - stake_amount);
    assert_eq!(slice_client.balance(&vault_id), stake_amount);
    assert_eq!(vault_client.get_stake(&user), stake_amount);
    assert_eq!(vault_client.get_last_harvest(&user), 1000);

    // 6. Fast forward time by 10 minutes (600 seconds)
    // 10 minutes * 10 ingredients (since we have 1000 SLICE staked, and rate is 1 per minute per 100 SLICE)
    // So 10 * (1000 / 100) = 100 ingredients of each type
    env.ledger().set_timestamp(1600);

    // Claim rewards
    vault_client.claim_rewards(&user);

    // Check last harvest and reward balances
    assert_eq!(vault_client.get_last_harvest(&user), 1600);
    
    let cheese_client = token::Client::new(&env, &cheese_token_addr);
    let pepperoni_client = token::Client::new(&env, &pepperoni_token_addr);
    let bacon_client = token::Client::new(&env, &bacon_token_addr);
    let onion_client = token::Client::new(&env, &onion_token_addr);

    assert_eq!(cheese_client.balance(&user), 100);
    assert_eq!(pepperoni_client.balance(&user), 100);
    assert_eq!(bacon_client.balance(&user), 100);
    assert_eq!(onion_client.balance(&user), 100);

    // 7. Stake more SLICE (e.g. 500 more) after another 5 minutes (300 seconds)
    // 5 minutes elapsed on 1000 SLICE: reward should be 5 * (1000 / 100) = 50 ingredients
    // After staking, the rewards are claimed automatically, so user's reward balance should increase by 50
    env.ledger().set_timestamp(1900);
    vault_client.stake_slice(&user, &500);

    assert_eq!(vault_client.get_stake(&user), 1500);
    assert_eq!(vault_client.get_last_harvest(&user), 1900);
    assert_eq!(cheese_client.balance(&user), 150);

    // 8. Wait another 12 minutes (720 seconds) and unstake 500 SLICE
    // 12 minutes elapsed on 1500 SLICE: reward should be 12 * (1500 / 100) = 180 ingredients
    // Unstaking should claim rewards automatically.
    env.ledger().set_timestamp(2620);
    vault_client.unstake_slice(&user, &500);

    assert_eq!(vault_client.get_stake(&user), 1000);
    assert_eq!(vault_client.get_last_harvest(&user), 2620);
    assert_eq!(cheese_client.balance(&user), 150 + 180);
    assert_eq!(slice_client.balance(&user), user_slice_balance - 1000);
}
