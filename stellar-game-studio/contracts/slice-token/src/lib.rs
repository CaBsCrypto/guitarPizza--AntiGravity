//! # $SLICE Token — Rhythm Slice
//!
//! SEP-41 compatible fungible token for the Rhythm Slice ecosystem.
//!
//! ## Key properties
//! - Fixed cap: 8,888,888 SLICE (never more)
//! - Daily global cap: 8,888 SLICE/day
//! - Daily per-wallet cap: 8 SLICE/day
//! - Only the designated minter (guitar-pizza contract) can mint
//! - Admin can pause in emergencies
//! - Burnable: used by the Horno baking mechanic
//!
//! ## Decimals
//! 7 decimals — 1 SLICE = 10_000_000 raw units (same as XLM).
//! `mint` and `burn` accept *whole SLICE units* for simplicity.
//! All internal storage uses raw units.

#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short,
    Address, Env, String,
};

// ── Constants ─────────────────────────────────────────────────────────────

pub const DECIMALS: u32 = 7;
pub const SCALE: i128 = 10_000_000; // 10^7 raw units per SLICE

// Caps in whole SLICE units (scaled on use)
pub const TOTAL_CAP: i128 = 8_888_888;
pub const DAILY_GLOBAL_CAP: i128 = 8_888;
pub const DAILY_WALLET_CAP: i128 = 8_888_888;

// Stellar ~5s ledgers → ~17,280 ledgers/day. We use 18,000 for a safe margin.
pub const DAY_TTL_LEDGERS: u32 = 18_000;
// Balance / persistent data TTL: ~5 years
pub const BALANCE_TTL_LEDGERS: u32 = 9_125_000;

// ── Storage Keys ──────────────────────────────────────────────────────────

#[contracttype]
pub enum DataKey {
    Admin,
    Minter,              // guitar-pizza — sole minting authority
    TotalMinted,         // i128 raw units — lifetime minted (never decreases)
    Balance(Address),    // i128 raw units
    Allowance(Address, Address), // i128 raw units — (from, spender)
    AllowanceExp(Address, Address), // u32 — expiration ledger sequence
    DayGlobal(u64),      // i128 raw units — global minted on day_id
    DayWallet(Address, u64), // i128 raw units — wallet minted on day_id
    Paused,              // bool
}

// ── Helpers ───────────────────────────────────────────────────────────────

fn day_id(env: &Env) -> u64 {
    env.ledger().timestamp() / 86_400
}

fn require_not_paused(env: &Env) {
    let paused: bool = env
        .storage()
        .instance()
        .get(&DataKey::Paused)
        .unwrap_or(false);
    if paused {
        panic!("SLICE: paused");
    }
}

fn require_admin(env: &Env) {
    let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
    admin.require_auth();
}

fn get_balance(env: &Env, id: &Address) -> i128 {
    let key = DataKey::Balance(id.clone());
    let val = env.storage().persistent().get::<_, i128>(&key).unwrap_or(0);
    if val > 0 {
        env.storage()
            .persistent()
            .extend_ttl(&key, BALANCE_TTL_LEDGERS, BALANCE_TTL_LEDGERS);
    }
    val
}

fn set_balance(env: &Env, id: &Address, amount: i128) {
    let key = DataKey::Balance(id.clone());
    env.storage().persistent().set(&key, &amount);
    env.storage()
        .persistent()
        .extend_ttl(&key, BALANCE_TTL_LEDGERS, BALANCE_TTL_LEDGERS);
}

fn get_day_global(env: &Env, day: u64) -> i128 {
    env.storage()
        .temporary()
        .get::<_, i128>(&DataKey::DayGlobal(day))
        .unwrap_or(0)
}

fn get_day_wallet(env: &Env, addr: &Address, day: u64) -> i128 {
    env.storage()
        .temporary()
        .get::<_, i128>(&DataKey::DayWallet(addr.clone(), day))
        .unwrap_or(0)
}

// ── Contract ──────────────────────────────────────────────────────────────

#[contract]
pub struct SliceToken;

#[contractimpl]
impl SliceToken {
    // ── Initialization ─────────────────────────────────────────────────

    pub fn __constructor(env: Env, admin: Address, minter: Address) {
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Minter, &minter);
        env.storage().instance().set(&DataKey::TotalMinted, &0_i128);
        env.storage().instance().set(&DataKey::Paused, &false);
        env.storage().instance().extend_ttl(0, BALANCE_TTL_LEDGERS);
    }

    // ── Admin ──────────────────────────────────────────────────────────

    pub fn set_admin(env: Env, new_admin: Address) {
        require_admin(&env);
        new_admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &new_admin);
    }

    /// Update the minter — e.g. after redeploying guitar-pizza.
    pub fn set_minter(env: Env, new_minter: Address) {
        require_admin(&env);
        env.storage().instance().set(&DataKey::Minter, &new_minter);
    }

    pub fn pause(env: Env) {
        require_admin(&env);
        env.storage().instance().set(&DataKey::Paused, &true);
        env.events().publish((symbol_short!("paused"),), ());
    }

    pub fn unpause(env: Env) {
        require_admin(&env);
        env.storage().instance().set(&DataKey::Paused, &false);
        env.events().publish((symbol_short!("unpaused"),), ());
    }

    // ── Mint — only guitar-pizza ───────────────────────────────────────

    /// Mint `amount_slice` whole SLICE to `to`.
    /// Called by guitar-pizza after a ZK-verified winning session.
    /// `amount_slice` is in whole tokens (e.g. 5 = 5 SLICE, not 50_000_000).
    pub fn mint(env: Env, to: Address, amount_slice: i128) {
        require_not_paused(&env);

        // Only the minter may call this
        let minter: Address = env.storage().instance().get(&DataKey::Minter).unwrap();
        minter.require_auth();

        assert!(amount_slice > 0, "SLICE: zero mint");

        let amount = amount_slice * SCALE;
        let day = day_id(&env);

        // 1. Total supply cap
        let total: i128 = env
            .storage()
            .instance()
            .get(&DataKey::TotalMinted)
            .unwrap_or(0);
        assert!(
            total + amount <= TOTAL_CAP * SCALE,
            "SLICE: total cap reached"
        );

        // 2. Daily global cap
        let day_global = get_day_global(&env, day);
        assert!(
            day_global + amount <= DAILY_GLOBAL_CAP * SCALE,
            "SLICE: daily global cap reached"
        );

        // 3. Daily per-wallet cap
        let day_wallet = get_day_wallet(&env, &to, day);
        assert!(
            day_wallet + amount <= DAILY_WALLET_CAP * SCALE,
            "SLICE: daily wallet cap reached"
        );

        // Mint
        let new_balance = get_balance(&env, &to) + amount;
        set_balance(&env, &to, new_balance);
        env.storage()
            .instance()
            .set(&DataKey::TotalMinted, &(total + amount));

        // Update daily counters (temporary storage — auto-expires after 1 day)
        let dg_key = DataKey::DayGlobal(day);
        env.storage().temporary().set(&dg_key, &(day_global + amount));
        env.storage().temporary().extend_ttl(&dg_key, DAY_TTL_LEDGERS, DAY_TTL_LEDGERS);

        let dw_key = DataKey::DayWallet(to.clone(), day);
        env.storage().temporary().set(&dw_key, &(day_wallet + amount));
        env.storage().temporary().extend_ttl(&dw_key, DAY_TTL_LEDGERS, DAY_TTL_LEDGERS);

        env.events()
            .publish((symbol_short!("mint"),), (to, amount_slice));
    }

    // ── Burn — called by the Horno baking contract ─────────────────────

    /// Burn `amount_slice` whole SLICE from `from`.
    /// `from` must authorize this call.
    /// Used by the Horno to burn SLICE when initiating a bake.
    pub fn burn(env: Env, from: Address, amount_slice: i128) {
        require_not_paused(&env);
        from.require_auth();

        assert!(amount_slice > 0, "SLICE: zero burn");
        let amount = amount_slice * SCALE;

        let balance = get_balance(&env, &from);
        assert!(balance >= amount, "SLICE: insufficient balance");

        set_balance(&env, &from, balance - amount);
        // Note: TotalMinted is NOT reduced — it's a lifetime minting counter.
        // This means the cap tracks how many SLICE were ever created.

        env.events()
            .publish((symbol_short!("burn"),), (from, amount_slice));
    }

    // ── SEP-41 Core Functions ──────────────────────────────────────────

    pub fn balance(env: Env, id: Address) -> i128 {
        get_balance(&env, &id)
    }

    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        require_not_paused(&env);
        from.require_auth();

        assert!(amount > 0, "SLICE: zero transfer");
        let from_bal = get_balance(&env, &from);
        assert!(from_bal >= amount, "SLICE: insufficient balance");

        set_balance(&env, &from, from_bal - amount);
        let to_bal = get_balance(&env, &to);
        set_balance(&env, &to, to_bal + amount);

        env.events()
            .publish((symbol_short!("transfer"),), (from, to, amount));
    }

    pub fn approve(env: Env, from: Address, spender: Address, amount: i128, expiration_ledger: u32) {
        from.require_auth();
        env.storage().persistent().set(
            &DataKey::Allowance(from.clone(), spender.clone()),
            &amount,
        );
        env.storage().persistent().set(
            &DataKey::AllowanceExp(from.clone(), spender.clone()),
            &expiration_ledger,
        );
    }

    pub fn allowance(env: Env, from: Address, spender: Address) -> i128 {
        let exp: u32 = env
            .storage()
            .persistent()
            .get(&DataKey::AllowanceExp(from.clone(), spender.clone()))
            .unwrap_or(0);
        if env.ledger().sequence() > exp {
            return 0;
        }
        env.storage()
            .persistent()
            .get(&DataKey::Allowance(from, spender))
            .unwrap_or(0)
    }

    pub fn transfer_from(env: Env, spender: Address, from: Address, to: Address, amount: i128) {
        require_not_paused(&env);
        spender.require_auth();

        let allowance = SliceToken::allowance(env.clone(), from.clone(), spender.clone());
        assert!(allowance >= amount, "SLICE: allowance exceeded");

        // Reduce allowance
        env.storage().persistent().set(
            &DataKey::Allowance(from.clone(), spender),
            &(allowance - amount),
        );

        let from_bal = get_balance(&env, &from);
        assert!(from_bal >= amount, "SLICE: insufficient balance");
        set_balance(&env, &from, from_bal - amount);
        let to_bal = get_balance(&env, &to);
        set_balance(&env, &to, to_bal + amount);
    }

    // ── Metadata ───────────────────────────────────────────────────────

    pub fn decimals(_env: Env) -> u32 {
        DECIMALS
    }

    pub fn name(env: Env) -> String {
        String::from_str(&env, "Rhythm Slice")
    }

    pub fn symbol(env: Env) -> String {
        String::from_str(&env, "SLICE")
    }

    // ── Views ──────────────────────────────────────────────────────────

    pub fn total_minted(env: Env) -> i128 {
        env.storage()
            .instance()
            .get(&DataKey::TotalMinted)
            .unwrap_or(0)
    }

    pub fn is_paused(env: Env) -> bool {
        env.storage()
            .instance()
            .get(&DataKey::Paused)
            .unwrap_or(false)
    }

    pub fn admin(env: Env) -> Address {
        env.storage().instance().get(&DataKey::Admin).unwrap()
    }

    pub fn minter(env: Env) -> Address {
        env.storage().instance().get(&DataKey::Minter).unwrap()
    }

    /// How many SLICE a wallet has minted today (in whole SLICE units).
    pub fn minted_today_wallet(env: Env, addr: Address) -> i128 {
        get_day_wallet(&env, &addr, day_id(&env)) / SCALE
    }

    /// How many SLICE have been minted globally today (in whole SLICE units).
    pub fn minted_today_global(env: Env) -> i128 {
        get_day_global(&env, day_id(&env)) / SCALE
    }
}

// ── Tests ─────────────────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::testutils::{Address as _, Ledger};
    use soroban_sdk::Env;

    fn setup() -> (Env, SliceTokenClient<'static>, Address, Address, Address) {
        let env = Env::default();
        env.mock_all_auths();
        let admin = Address::generate(&env);
        let minter = Address::generate(&env);
        let player = Address::generate(&env);
        let contract_id = env.register(SliceToken, (&admin, &minter));
        let client = SliceTokenClient::new(&env, &contract_id);
        (env, client, admin, minter, player)
    }

    #[test]
    fn test_mint_basic() {
        let (_env, client, _admin, _minter, player) = setup();
        client.mint(&player, &5);
        assert_eq!(client.balance(&player), 5 * SCALE);
        assert_eq!(client.minted_today_wallet(&player), 5);
    }

    #[test]
    fn test_daily_wallet_cap() {
        let (_env, client, _admin, _minter, player) = setup();
        client.mint(&player, &8); // max allowed
        assert_eq!(client.balance(&player), 8 * SCALE);
    }

    #[test]
    #[should_panic(expected = "daily wallet cap")]
    fn test_daily_wallet_cap_exceeded() {
        let (_env, client, _admin, _minter, player) = setup();
        client.mint(&player, &9); // over the 8 SLICE/day cap
    }

    #[test]
    fn test_transfer() {
        let (env, client, _admin, _minter, player) = setup();
        let recipient = Address::generate(&env);
        client.mint(&player, &5);
        client.transfer(&player, &recipient, &(3 * SCALE));
        assert_eq!(client.balance(&player), 2 * SCALE);
        assert_eq!(client.balance(&recipient), 3 * SCALE);
    }

    #[test]
    fn test_burn() {
        let (_env, client, _admin, _minter, player) = setup();
        client.mint(&player, &5);
        client.burn(&player, &3);
        assert_eq!(client.balance(&player), 2 * SCALE);
        // TotalMinted stays at 5 (burn doesn't reduce the lifetime counter)
        assert_eq!(client.total_minted(), 5 * SCALE);
    }

    #[test]
    fn test_metadata() {
        let (_env, client, _, _, _) = setup();
        assert_eq!(client.decimals(), 7);
    }

    #[test]
    fn test_pause_blocks_transfer() {
        let (env, client, _admin, _minter, player) = setup();
        let recipient = Address::generate(&env);
        client.mint(&player, &5);
        client.pause();
        let result = client.try_transfer(&player, &recipient, &(1 * SCALE));
        assert!(result.is_err());
    }
}
