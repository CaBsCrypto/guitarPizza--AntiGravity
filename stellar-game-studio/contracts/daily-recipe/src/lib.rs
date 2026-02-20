#![no_std]

//! # Daily Recipe Contract — Weekly Pizza Challenge
//!
//! Each week has a randomly-derived target: complete N pizzas in a single session.
//! N is pseudo-randomly derived from the week number so it changes every 7 days
//! without requiring admin intervention.
//!
//! Week ID  = ledger_timestamp / (7 * 24 * 3600)
//! Target   = keccak256(week_id_be_bytes)[0] % 6 + 3  → always 3..=8 pizzas
//!
//! Flow:
//!   1. Player completes a guitar-pizza session off-chain.
//!   2. Player calls claim_weekly(player, pizzas_completed, receipt).
//!   3. Contract verifies receipt (RISC Zero placeholder).
//!   4. If pizzas_completed >= target → mark achievement, emit event.
//!   5. One completion per player per week (anti-replay).
//!
//! TODO: Replace verify_receipt with real RISC Zero verifier:
//!   https://github.com/NethermindEth/stellar-risc0-verifier/

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype,
    Address, Bytes, Env, Symbol,
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const WEEK_SECS: u64 = 7 * 24 * 3600; // 604 800 seconds
const PIZZA_MIN: u32 = 3;
const PIZZA_RANGE: u32 = 6; // target = [3, 8]
const RECEIPT_MIN_LEN: u32 = 64;

const ENTRY_TTL: u32 = 518_400; // ~30 days in ledgers
const ENTRY_TTL_THRESHOLD: u32 = 120_960; // ~7 days

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    NotInitialized = 1,
    AlreadyCompleted = 2,
    InvalidReceipt = 3,
    NotEnoughPizzas = 4,
    AdminRequired = 5,
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct WeeklyChallenge {
    pub week_id: u64,
    pub target_pizzas: u32,
    pub total_completions: u32,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PlayerProgress {
    pub week_id: u64,
    pub best_pizzas: u32,
    pub completed: bool,
    pub claimed_at: u64,
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    TrustedGame,
    /// Challenge metadata stored per week_id
    Challenge(u64),
    /// Player progress stored per (player, week_id)
    Progress(Address, u64),
}

// ---------------------------------------------------------------------------
// Contract
// ---------------------------------------------------------------------------
#[contract]
pub struct DailyRecipe;

#[contractimpl]
impl DailyRecipe {
    // -----------------------------------------------------------------------
    // Constructor
    // -----------------------------------------------------------------------
    pub fn __constructor(env: Env, admin: Address, game_hub: Address) {
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::TrustedGame, &game_hub);
        env.storage().instance().extend_ttl(ENTRY_TTL_THRESHOLD, ENTRY_TTL);
    }

    // -----------------------------------------------------------------------
    // Core: Claim weekly achievement
    // -----------------------------------------------------------------------
    /// Submit a session result to claim the weekly pizza challenge.
    ///
    /// # Arguments
    /// * `player`           - The player claiming the achievement
    /// * `pizzas_completed` - Number of pizzas completed in the session (from receipt journal)
    /// * `receipt`          - RISC Zero receipt bytes proving the session result
    pub fn claim_weekly(
        env: Env,
        player: Address,
        pizzas_completed: u32,
        receipt: Bytes,
    ) -> Result<WeeklyChallenge, Error> {
        player.require_auth();

        // Verify receipt
        if !Self::verify_receipt(&env, &receipt) {
            return Err(Error::InvalidReceipt);
        }

        // Compute current week
        let now = env.ledger().timestamp();
        let week_id = now / WEEK_SECS;

        // Compute target for this week
        let target_pizzas = Self::week_target(&env, week_id);

        // Check player hasn't already completed this week
        let prog_key = DataKey::Progress(player.clone(), week_id);
        if let Some(prog) = env.storage().instance().get::<DataKey, PlayerProgress>(&prog_key) {
            if prog.completed {
                return Err(Error::AlreadyCompleted);
            }
            // Update best even if not completed yet
            if pizzas_completed < target_pizzas {
                let updated = PlayerProgress {
                    week_id,
                    best_pizzas: pizzas_completed.max(prog.best_pizzas),
                    completed: false,
                    claimed_at: now,
                };
                env.storage().instance().set(&prog_key, &updated);
                env.storage().instance().extend_ttl(ENTRY_TTL_THRESHOLD, ENTRY_TTL);
                return Err(Error::NotEnoughPizzas);
            }
        } else if pizzas_completed < target_pizzas {
            // First attempt, not enough pizzas — store progress anyway
            let prog = PlayerProgress {
                week_id,
                best_pizzas: pizzas_completed,
                completed: false,
                claimed_at: now,
            };
            env.storage().instance().set(&prog_key, &prog);
            env.storage().instance().extend_ttl(ENTRY_TTL_THRESHOLD, ENTRY_TTL);
            return Err(Error::NotEnoughPizzas);
        }

        // Player has enough pizzas — mark as completed
        let completed_prog = PlayerProgress {
            week_id,
            best_pizzas: pizzas_completed,
            completed: true,
            claimed_at: now,
        };
        env.storage().instance().set(&prog_key, &completed_prog);
        env.storage().instance().extend_ttl(ENTRY_TTL_THRESHOLD, ENTRY_TTL);

        // Update challenge stats
        let challenge_key = DataKey::Challenge(week_id);
        let mut challenge: WeeklyChallenge = env
            .storage()
            .instance()
            .get(&challenge_key)
            .unwrap_or(WeeklyChallenge {
                week_id,
                target_pizzas,
                total_completions: 0,
            });
        challenge.total_completions += 1;
        env.storage().instance().set(&challenge_key, &challenge);
        env.storage().instance().extend_ttl(ENTRY_TTL_THRESHOLD, ENTRY_TTL);

        // Emit event
        env.events().publish(
            (Symbol::new(&env, "recipe_unlocked"), player.clone()),
            (week_id, pizzas_completed, target_pizzas),
        );

        Ok(challenge)
    }

    // -----------------------------------------------------------------------
    // Queries
    // -----------------------------------------------------------------------
    /// Get current week's challenge (target + completions so far).
    pub fn get_current_challenge(env: Env) -> WeeklyChallenge {
        let now = env.ledger().timestamp();
        let week_id = now / WEEK_SECS;
        let target_pizzas = Self::week_target(&env, week_id);
        let challenge_key = DataKey::Challenge(week_id);
        env.storage()
            .instance()
            .get(&challenge_key)
            .unwrap_or(WeeklyChallenge {
                week_id,
                target_pizzas,
                total_completions: 0,
            })
    }

    /// Get a player's progress for the current week.
    pub fn get_player_progress(env: Env, player: Address) -> Option<PlayerProgress> {
        let now = env.ledger().timestamp();
        let week_id = now / WEEK_SECS;
        let prog_key = DataKey::Progress(player, week_id);
        env.storage().instance().get(&prog_key)
    }

    /// Get a player's progress for a specific week.
    pub fn get_player_progress_week(
        env: Env,
        player: Address,
        week_id: u64,
    ) -> Option<PlayerProgress> {
        let prog_key = DataKey::Progress(player, week_id);
        env.storage().instance().get(&prog_key)
    }

    /// Get the current week ID.
    pub fn current_week_id(env: Env) -> u64 {
        env.ledger().timestamp() / WEEK_SECS
    }

    // -----------------------------------------------------------------------
    // Admin
    // -----------------------------------------------------------------------
    pub fn set_admin(env: Env, new_admin: Address) -> Result<(), Error> {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .ok_or(Error::NotInitialized)?;
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &new_admin);
        Ok(())
    }

    pub fn set_trusted_game(env: Env, new_game: Address) -> Result<(), Error> {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .ok_or(Error::NotInitialized)?;
        admin.require_auth();
        env.storage().instance().set(&DataKey::TrustedGame, &new_game);
        Ok(())
    }

    pub fn get_admin(env: Env) -> Option<Address> {
        env.storage().instance().get(&DataKey::Admin)
    }

    // -----------------------------------------------------------------------
    // Internal helpers
    // -----------------------------------------------------------------------
    /// Derive the pizza target for a given week using on-chain keccak256.
    /// Result is in range [PIZZA_MIN, PIZZA_MIN + PIZZA_RANGE - 1] = [3, 8].
    fn week_target(env: &Env, week_id: u64) -> u32 {
        let week_bytes = week_id.to_be_bytes();
        let hash = env.crypto().keccak256(
            &soroban_sdk::Bytes::from_array(env, &week_bytes),
        );
        // Convert BytesN<32> → [u8; 32] to read first byte
        let hash_arr: [u8; 32] = hash.into();
        let first_byte = hash_arr[0];
        PIZZA_MIN + (first_byte as u32 % PIZZA_RANGE)
    }

    /// RISC Zero receipt placeholder verifier.
    ///
    /// TODO: Replace with actual on-chain RISC Zero verification:
    ///   https://github.com/NethermindEth/stellar-risc0-verifier/
    fn verify_receipt(_env: &Env, receipt: &Bytes) -> bool {
        receipt.len() >= RECEIPT_MIN_LEN
    }
}
