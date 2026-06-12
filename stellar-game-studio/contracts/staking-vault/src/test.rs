#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::{Address as _, Ledger}, Address, Env};

#[test]
fn test_staking_vault() {
    let env = Env::default();
    env.mock_all_auths();

    // 1. Create admins and users
    let admin = Address::generate(&env);
    let user = Address::generate(&env);

    // 2. Register mock tokens using the environment's built-in token contract
    let slice_token_addr = env.register_stellar_asset_contract(admin.clone());
    let cheese_token_addr = env.register_stellar_asset_contract(admin.clone());
    let pepperoni_token_addr = env.register_stellar_asset_contract(admin.clone());
    let bacon_token_addr = env.register_stellar_asset_contract(admin.clone());
    let onion_token_addr = env.register_stellar_asset_contract(admin.clone());
    let lp_token_addr = env.register_stellar_asset_contract(admin.clone());

    // Setup clients for tokens to mint
    let slice_admin = token::StellarAssetClient::new(&env, &slice_token_addr);
    let cheese_admin = token::StellarAssetClient::new(&env, &cheese_token_addr);
    let pepperoni_admin = token::StellarAssetClient::new(&env, &pepperoni_token_addr);
    let bacon_admin = token::StellarAssetClient::new(&env, &bacon_token_addr);
    let onion_admin = token::StellarAssetClient::new(&env, &onion_token_addr);
    let lp_admin = token::StellarAssetClient::new(&env, &lp_token_addr);

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
        &lp_token_addr,
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

    // Mint LP to user
    let user_lp_balance = 5_000i128;
    lp_admin.mint(&user, &user_lp_balance);

    // Verify initial state
    assert_eq!(vault_client.get_stake(&user), 0);
    assert_eq!(vault_client.get_last_harvest(&user), 0);
    assert_eq!(vault_client.get_lp_stake(&user), 0);
    assert_eq!(vault_client.get_lp_last_harvest(&user), 0);

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

    // 7. Test LP Staking
    // Stake 500 LP at timestamp 1600
    let lp_stake_amount = 500i128;
    vault_client.stake_lp(&user, &lp_stake_amount);

    let lp_client = token::Client::new(&env, &lp_token_addr);
    assert_eq!(lp_client.balance(&user), user_lp_balance - lp_stake_amount);
    assert_eq!(lp_client.balance(&vault_id), lp_stake_amount);
    assert_eq!(vault_client.get_lp_stake(&user), lp_stake_amount);
    assert_eq!(vault_client.get_lp_last_harvest(&user), 1600);

    // Fast forward by 5 minutes (300 seconds) to timestamp 1900
    // SLICE stake: 1000 SLICE -> 5 mins * 10 = 50 ingredients.
    // LP stake: 500 LP. Rate is 4x -> 4 ingredients per minute per 100 LP.
    // LP Reward rate: 500 / 100 * 4 = 20 ingredients per minute.
    // LP Reward for 5 mins: 5 * 20 = 100 ingredients.
    env.ledger().set_timestamp(1900);

    // Stake more LP (100 LP) which triggers claim_lp_rewards_internal automatically
    vault_client.stake_lp(&user, &100);

    // Check that user got 100 ingredients from LP staking (plus whatever they already had)
    // Cheese from SLICE stake is not claimed automatically by stake_lp, only LP rewards are.
    // Previous cheese: 100. New cheese from LP: 100. Total cheese should be 200.
    assert_eq!(cheese_client.balance(&user), 200);
    assert_eq!(vault_client.get_lp_stake(&user), 600);
    assert_eq!(vault_client.get_lp_last_harvest(&user), 1900);

    // Now claim standard SLICE rewards too (5 mins elapsed on 1000 SLICE -> 50 ingredients)
    vault_client.claim_rewards(&user);
    // Total cheese should now be 200 + 50 = 250
    assert_eq!(cheese_client.balance(&user), 250);

    // Fast forward by 10 minutes (600 seconds) to timestamp 2500
    // LP stake: 600 LP -> 600/100 * 4 = 24 ingredients/min -> 10 mins * 24 = 240 ingredients.
    env.ledger().set_timestamp(2500);
    vault_client.unstake_lp(&user, &200);

    // Unstaking LP claims LP rewards automatically. Total cheese should be 250 + 240 = 490
    assert_eq!(cheese_client.balance(&user), 490);
    assert_eq!(vault_client.get_lp_stake(&user), 400);
    assert_eq!(lp_client.balance(&user), user_lp_balance - 400);
}
