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
        spender.require_auth();
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

    // Deploy mock NFT contract
    let nft_id = env.register(MockNFTContract, ());
    let nft_client = MockNFTContractClient::new(&env, &nft_id);

    // Deploy baking contract
    let baking_id = env.register(PizzaBakingContract, ());
    let baking_client = PizzaBakingContractClient::new(&env, &baking_id);

    // Initialize baking contract
    baking_client.initialize(&admin, &token_id, &Some(nft_id.clone()));

    // Mint some SLICE to player and to the baking contract for payouts
    token_client.mint(&player, &10_000_000); // 1.0 SLICE raw units
    token_client.mint(&baking_id, &100_000_000); // 10.0 SLICE raw units

    TestContext {
        env,
        admin,
        player,
        baking_client,
        token_client,
        nft_client,
    }
}

// ── Test Cases ───────────────────────────────────────────────────────────

#[test]
fn test_initialize() {
    let ctx = setup();
    // Re-initialization should fail
    let res = ctx.baking_client.try_initialize(&ctx.admin, &Address::generate(&ctx.env), &None);
    assert!(res.is_err());
}

#[test]
fn test_start_bake_no_nft() {
    let ctx = setup();
    
    // Start baking recipe 42 with duration of 3600 seconds, and base payout of 5_000_000 raw SLICE
    ctx.baking_client.start_bake(&ctx.player, &0, &42, &3600, &5_000_000, &None);

    let slot = ctx.baking_client.get_slot(&ctx.player, &0).unwrap();
    assert!(slot.locked);
    assert_eq!(slot.recipe_id, 42);
    assert_eq!(slot.duration, 3600);
    assert_eq!(slot.base_payout, 5_000_000);
    assert_eq!(slot.oven_nft_id, None);

    // Try starting another bake in the same active locked slot - should fail
    let res = ctx.baking_client.try_start_bake(&ctx.player, &0, &43, &3600, &5_000_000, &None);
    assert!(res.is_err());
}

#[test]
fn test_start_bake_with_nft() {
    let ctx = setup();
    
    // Equip Oven NFT 8 (Don de la Masa Oven style: 2.0x speed, 2.0x payout)
    ctx.nft_client.set_owner(&8, &ctx.player);

    // Start baking with NFT 8, base duration 7200 seconds should be halved to 3600
    ctx.baking_client.start_bake(&ctx.player, &1, &100, &7200, &10_000_000, &Some(8));

    let slot = ctx.baking_client.get_slot(&ctx.player, &1).unwrap();
    assert!(slot.locked);
    assert_eq!(slot.duration, 3600); // 7200 / 2.0
    assert_eq!(slot.oven_nft_id, Some(8));

    // Try baking with NFT 9 which player does not own - should fail
    ctx.nft_client.set_owner(&9, &Address::generate(&ctx.env));
    let res = ctx.baking_client.try_start_bake(&ctx.player, &2, &100, &7200, &10_000_000, &Some(9));
    assert!(res.is_err());
}

#[test]
fn test_speed_up() {
    let ctx = setup();
    
    // Start bake with 7200 seconds duration
    ctx.baking_client.start_bake(&ctx.player, &0, &42, &7200, &5_000_000, &None);

    let initial_balance = ctx.token_client.balance(&ctx.player);

    // Perform speed-up (costs 0.1 SLICE = 1_000_000 raw units, reduces remaining duration by 3600s)
    ctx.baking_client.speed_up(&ctx.player, &0);

    let new_balance = ctx.token_client.balance(&ctx.player);
    assert_eq!(initial_balance - new_balance, 1_000_000); // 0.1 SLICE deduction

    let slot = ctx.baking_client.get_slot(&ctx.player, &0).unwrap();
    assert_eq!(slot.duration, 3600); // 7200 - 3600 = 3600

    // Speed up again, remaining duration is 3600s, should become 0 (finishes instantly)
    ctx.baking_client.speed_up(&ctx.player, &0);
    let slot_after = ctx.baking_client.get_slot(&ctx.player, &0).unwrap();
    assert_eq!(slot_after.duration, 0);
}

#[test]
fn test_claim_bake_countdown_validators() {
    let mut ctx = setup();
    
    // Set current ledger timestamp to 1000
    ctx.env.ledger().set_timestamp(1000);

    // Start bake with 3600 seconds duration (target timestamp is 4600)
    ctx.baking_client.start_bake(&ctx.player, &0, &42, &3600, &5_000_000, &None);

    // Try claiming immediately - should fail since ledger timestamp is still 1000 (< 4600)
    let res = ctx.baking_client.try_claim_bake(&ctx.player, &0);
    assert!(res.is_err());

    // Advance ledger timestamp to 4599 - still fails
    ctx.env.ledger().set_timestamp(4599);
    let res2 = ctx.baking_client.try_claim_bake(&ctx.player, &0);
    assert!(res2.is_err());

    // Advance ledger timestamp to 4600 - succeeds!
    ctx.env.ledger().set_timestamp(4600);
    
    let initial_balance = ctx.token_client.balance(&ctx.player);
    let payout = ctx.baking_client.claim_bake(&ctx.player, &0);
    let new_balance = ctx.token_client.balance(&ctx.player);

    assert_eq!(payout, 5_000_000);
    assert_eq!(new_balance - initial_balance, 5_000_000);

    // The slot lock is now unlocked
    let slot = ctx.baking_client.get_slot(&ctx.player, &0).unwrap();
    assert!(!slot.locked);
}

#[test]
fn test_claim_bake_with_nft_multiplier() {
    let mut ctx = setup();
    ctx.env.ledger().set_timestamp(1000);
    
    // Equip Oven NFT 8 (Don de la Masa style: 2.0x payout, 2.0x speed)
    ctx.nft_client.set_owner(&8, &ctx.player);

    // Start baking: base duration is 3600s, base payout is 5_000_000
    ctx.baking_client.start_bake(&ctx.player, &0, &42, &3600, &5_000_000, &Some(8));

    let slot = ctx.baking_client.get_slot(&ctx.player, &0).unwrap();
    assert_eq!(slot.duration, 1800); // 3600 / 2.0

    // Advance timestamp by 1800s to 2800
    ctx.env.ledger().set_timestamp(2800);

    let initial_balance = ctx.token_client.balance(&ctx.player);
    let payout = ctx.baking_client.claim_bake(&ctx.player, &0);
    let new_balance = ctx.token_client.balance(&ctx.player);

    // Don de la Masa Oven style gives 2.0x payout: 5_000_000 * 2.0 = 10_000_000
    assert_eq!(payout, 10_000_000);
    assert_eq!(new_balance - initial_balance, 10_000_000);
}
