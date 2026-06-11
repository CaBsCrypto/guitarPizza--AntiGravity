#![cfg(test)]

use super::*;
use soroban_sdk::{
    contract, contractimpl, contracttype, testutils::{Address as _, Ledger}, Address, Env,
};

// ── Mock Slice Token ─────────────────────────────────────────────────────

#[contracttype]
pub enum MockTokenKey {
    Balance(Address),
}

#[contract]
pub struct MockSliceToken;

#[contractimpl]
impl MockSliceToken {
    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        from.require_auth();
        let from_key = MockTokenKey::Balance(from.clone());
        let to_key = MockTokenKey::Balance(to.clone());
        let from_bal: i128 = env.storage().instance().get(&from_key).unwrap_or(0);
        let to_bal: i128 = env.storage().instance().get(&to_key).unwrap_or(0);
        if from_bal < amount {
            panic!("insufficient balance");
        }
        env.storage().instance().set(&from_key, &(from_bal - amount));
        env.storage().instance().set(&to_key, &(to_bal + amount));
    }

    pub fn transfer_from(env: Env, spender: Address, from: Address, to: Address, amount: i128) {
        // Mock transfer_from allows anyone to transfer
        let from_key = MockTokenKey::Balance(from.clone());
        let to_key = MockTokenKey::Balance(to.clone());
        let from_bal: i128 = env.storage().instance().get(&from_key).unwrap_or(0);
        let to_bal: i128 = env.storage().instance().get(&to_key).unwrap_or(0);
        if from_bal < amount {
            panic!("insufficient balance");
        }
        env.storage().instance().set(&from_key, &(from_bal - amount));
        env.storage().instance().set(&to_key, &(to_bal + amount));
    }

    pub fn balance(env: Env, id: Address) -> i128 {
        env.storage().instance().get(&MockTokenKey::Balance(id)).unwrap_or(0)
    }

    pub fn mint(env: Env, to: Address, amount: i128) {
        let to_key = MockTokenKey::Balance(to.clone());
        let to_bal: i128 = env.storage().instance().get(&to_key).unwrap_or(0);
        env.storage().instance().set(&to_key, &(to_bal + amount));
    }
}

// ── Mock NFT Contract ────────────────────────────────────────────────────

#[contract]
pub struct MockNFTContract;

#[contractimpl]
impl MockNFTContract {
    pub fn owner_of(env: Env, token_id: u32) -> Address {
        env.storage().instance().get(&token_id).expect("NFT not owned")
    }

    pub fn set_owner(env: Env, token_id: u32, owner: Address) {
        env.storage().instance().set(&token_id, &owner);
    }
}

// ── Test Setup ───────────────────────────────────────────────────────────

struct TestContext {
    env: Env,
    admin: Address,
    player: Address,
    baking_client: PizzaBakingContractClient<'static>,
    token_client: MockSliceTokenClient<'static>,
    cheese_client: MockSliceTokenClient<'static>,
    pepperoni_client: MockSliceTokenClient<'static>,
    bacon_client: MockSliceTokenClient<'static>,
    onion_client: MockSliceTokenClient<'static>,
    nft_client: MockNFTContractClient<'static>,
}

fn setup() -> TestContext {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let player = Address::generate(&env);

    // Deploy mock token
    let token_id = env.register(MockSliceToken, ());
    let token_client = MockSliceTokenClient::new(&env, &token_id);

    // Deploy mock ingredients
    let cheese_id = env.register(MockSliceToken, ());
    let cheese_client = MockSliceTokenClient::new(&env, &cheese_id);

    let pepperoni_id = env.register(MockSliceToken, ());
    let pepperoni_client = MockSliceTokenClient::new(&env, &pepperoni_id);

    let bacon_id = env.register(MockSliceToken, ());
    let bacon_client = MockSliceTokenClient::new(&env, &bacon_id);

    let onion_id = env.register(MockSliceToken, ());
    let onion_client = MockSliceTokenClient::new(&env, &onion_id);

    // Deploy mock NFT contract
    let nft_id = env.register(MockNFTContract, ());
    let nft_client = MockNFTContractClient::new(&env, &nft_id);

    // Deploy baking contract
    let baking_id = env.register(PizzaBakingContract, ());
    let baking_client = PizzaBakingContractClient::new(&env, &baking_id);

    // Initialize baking contract
    baking_client.initialize(&admin, &token_id, &nft_id);
    
    // Set ingredients
    baking_client.set_ingredients(&cheese_id, &pepperoni_id, &bacon_id, &onion_id);

    // Mint some SLICE and ingredients to player
    token_client.mint(&player, &200_000_000); // 20.0 SLICE raw units
    cheese_client.mint(&player, &100);
    pepperoni_client.mint(&player, &100);
    bacon_client.mint(&player, &100);
    onion_client.mint(&player, &100);

    // Mint SLICE to the baking contract for payouts
    token_client.mint(&baking_id, &100_000_000); // 10.0 SLICE raw units

    TestContext {
        env,
        admin,
        player,
        baking_client,
        token_client,
        cheese_client,
        pepperoni_client,
        bacon_client,
        onion_client,
        nft_client,
    }
}

// ── Test Cases ───────────────────────────────────────────────────────────

#[test]
fn test_initialize() {
    let ctx = setup();
    // Re-initialization should fail
    let res = ctx.baking_client.try_initialize(&ctx.admin, &Address::generate(&ctx.env), &Address::generate(&ctx.env));
    assert!(res.is_err());
}

#[test]
fn test_slot_unlocking() {
    let ctx = setup();

    // Slots 1 & 2 are unlocked by default
    assert!(ctx.baking_client.is_slot_unlocked(&ctx.player, &1));
    assert!(ctx.baking_client.is_slot_unlocked(&ctx.player, &2));

    // Slots 3 & 4 are locked by default
    assert!(!ctx.baking_client.is_slot_unlocked(&ctx.player, &3));
    assert!(!ctx.baking_client.is_slot_unlocked(&ctx.player, &4));

    // Try baking in slot 3 before unlocking - should panic
    let res = ctx.baking_client.try_start_bake(&ctx.player, &3, &1, &3600, &5_000_000, &None, &0);
    assert!(res.is_err());

    // Unlock slot 3 (costs 50 $SLICE = 500_000_000 raw, let's mint more to player to cover)
    ctx.token_client.mint(&ctx.player, &500_000_000);
    ctx.baking_client.unlock_slot(&ctx.player, &3);

    // Now slot 3 is unlocked
    assert!(ctx.baking_client.is_slot_unlocked(&ctx.player, &3));

    // Try unlocking slot 3 again - should fail
    let res_double = ctx.baking_client.try_unlock_slot(&ctx.player, &3);
    assert!(res_double.is_err());

    // Can start baking in slot 3 now
    ctx.baking_client.start_bake(&ctx.player, &3, &1, &3600, &5_000_000, &None, &0);
    let slot = ctx.baking_client.get_slot(&ctx.player, &3).unwrap();
    assert!(slot.locked);
}

#[test]
fn test_start_bake_no_nft_no_fuel() {
    let ctx = setup();
    
    // Start baking recipe 1 (Margherita: 1 Cheese) with duration of 3600 seconds, and base payout of 5_000_000 raw SLICE
    let init_cheese = ctx.cheese_client.balance(&ctx.player);
    ctx.baking_client.start_bake(&ctx.player, &1, &1, &3600, &5_000_000, &None, &0);

    // 1 Cheese was deducted
    assert_eq!(init_cheese - ctx.cheese_client.balance(&ctx.player), 1);

    let slot = ctx.baking_client.get_slot(&ctx.player, &1).unwrap();
    assert!(slot.locked);
    assert_eq!(slot.recipe_id, 1);
    assert_eq!(slot.duration, 3600);
    assert_eq!(slot.base_payout, 5_000_000);
    assert_eq!(slot.oven_nft_id, None);
    assert_eq!(slot.payout_multiplier_bps, 10000);
}

#[test]
fn test_start_bake_with_fuel() {
    let ctx = setup();

    // Cherry fuel (fuel_type = 1): costs 0.5 $SLICE (5_000_000 raw), speed 1.3x, payout 1.1x
    let init_slice = ctx.token_client.balance(&ctx.player);
    ctx.baking_client.start_bake(&ctx.player, &1, &1, &3600, &5_000_000, &None, &1);

    // 0.5 $SLICE was deducted
    assert_eq!(init_slice - ctx.token_client.balance(&ctx.player), 5_000_000);

    let slot = ctx.baking_client.get_slot(&ctx.player, &1).unwrap();
    assert!(slot.locked);
    // duration reduced: 3600 * 10000 / 13000 = 2769
    assert_eq!(slot.duration, 2769);
    assert_eq!(slot.payout_multiplier_bps, 11000); // 1.1x
}

#[test]
fn test_start_bake_with_nft_and_fuel() {
    let ctx = setup();
    
    // Equip Oven NFT 8 (Don de la Masa Oven style: 2.0x speed, 2.0x payout)
    ctx.nft_client.set_owner(&8, &ctx.player);

    // Mesquite fuel (fuel_type = 2): costs 1.2 $SLICE (12_000_000 raw), speed 1.8x, payout 1.3x
    // Combined speed: 1.8 * 2.0 = 3.6x (36000 bps)
    // Combined payout: 1.3 * 2.0 = 2.6x (26000 bps)
    ctx.baking_client.start_bake(&ctx.player, &1, &2, &7200, &10_000_000, &Some(8), &2);

    let slot = ctx.baking_client.get_slot(&ctx.player, &1).unwrap();
    assert!(slot.locked);
    // duration reduced: 7200 * 10000 / 36000 = 2000
    assert_eq!(slot.duration, 2000);
    assert_eq!(slot.payout_multiplier_bps, 26000); // 2.6x
}

#[test]
fn test_ingredient_deductions() {
    let ctx = setup();

    // Recipe 3 (Special): 1 cheese, 1 pepperoni, 1 bacon
    let init_cheese = ctx.cheese_client.balance(&ctx.player);
    let init_pep = ctx.pepperoni_client.balance(&ctx.player);
    let init_bac = ctx.bacon_client.balance(&ctx.player);

    ctx.baking_client.start_bake(&ctx.player, &1, &3, &3600, &5_000_000, &None, &0);

    assert_eq!(init_cheese - ctx.cheese_client.balance(&ctx.player), 1);
    assert_eq!(init_pep - ctx.pepperoni_client.balance(&ctx.player), 1);
    assert_eq!(init_bac - ctx.bacon_client.balance(&ctx.player), 1);
}

#[test]
fn test_speed_up() {
    let ctx = setup();
    
    // Start bake
    ctx.baking_client.start_bake(&ctx.player, &1, &1, &7200, &5_000_000, &None, &0);

    let initial_balance = ctx.token_client.balance(&ctx.player);

    // Perform speed-up (costs 0.1 SLICE = 1_000_000 raw units, reduces remaining duration by 3600s)
    ctx.baking_client.speed_up(&ctx.player, &1);

    let new_balance = ctx.token_client.balance(&ctx.player);
    assert_eq!(initial_balance - new_balance, 1_000_000); // 0.1 SLICE deduction

    let slot = ctx.baking_client.get_slot(&ctx.player, &1).unwrap();
    assert_eq!(slot.duration, 3600); // 7200 - 3600 = 3600
}

#[test]
fn test_claim_bake_countdown_validators() {
    let mut ctx = setup();
    ctx.env.ledger().set_timestamp(1000);

    // Start bake with 3600 seconds duration (target timestamp is 4600)
    ctx.baking_client.start_bake(&ctx.player, &1, &1, &3600, &5_000_000, &None, &0);

    // Try claiming immediately - should fail since ledger timestamp is still 1000 (< 4600)
    let res = ctx.baking_client.try_claim_bake(&ctx.player, &1);
    assert!(res.is_err());

    // Advance ledger timestamp to 4600 - succeeds!
    ctx.env.ledger().set_timestamp(4600);
    
    let initial_balance = ctx.token_client.balance(&ctx.player);
    let payout = ctx.baking_client.claim_bake(&ctx.player, &1);
    let new_balance = ctx.token_client.balance(&ctx.player);

    assert_eq!(payout, 5_000_000);
    assert_eq!(new_balance - initial_balance, 5_000_000);
}
