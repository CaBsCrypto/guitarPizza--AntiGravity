#![no_std]

//! # ZK Leaderboard Contract
//!
//! Global per-level leaderboard. Only accepts scores backed by a RISC Zero receipt.
//! Maintains top-10 entries per level, sorted by score descending.
//! Tracks personal best per player per level.
//!
//! Score submission flow:
//!   1. guitar-pizza contract submits score on behalf of player after verifying receipt.
//!   2. OR player submits directly with a valid receipt (same RISC Zero placeholder).
//!
//! TODO: Replace verify_receipt with real RISC Zero verifier call:
//!   https://github.com/NethermindEth/stellar-risc0-verifier/

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype,
    Address, Bytes, BytesN, Env, Symbol, Vec,
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const BOARD_SIZE: u32 = 10;
const ENTRY_TTL: u32 = 518_400; // ~30 days
const ENTRY_TTL_THRESHOLD: u32 = 120_960; // ~7 days
const RECEIPT_MIN_LEN: u32 = 64;

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    NotInitialized = 1,
    Unauthorized = 2,
    InvalidReceipt = 3,
    AdminRequired = 4,
}

// ---------------------------------------------------------------------------
// Data Types
// ---------------------------------------------------------------------------
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct LeaderboardEntry {
    pub player: Address,
    pub score: u64,
    pub perfect_hits: u32,
    pub pizzas_completed: u32,
    pub timestamp: u64,
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    TrustedGame,
    /// Top-10 board for a given level_id
    Board(u32),
    /// Personal best for (player, level_id)
    PersonalBest(Address, u32),
    /// Reset epoch per level (incremented on admin reset)
    Epoch(u32),
}

// ---------------------------------------------------------------------------
// Contract
// ---------------------------------------------------------------------------
#[contract]
pub struct ZkLeaderboard;

#[contractimpl]
impl ZkLeaderboard {
    // -----------------------------------------------------------------------
    // Constructor
    // -----------------------------------------------------------------------
    /// Initialize the leaderboard with an admin and the trusted game contract address.
    pub fn __constructor(env: Env, admin: Address, game_hub: Address) {
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::TrustedGame, &game_hub);
        env.storage().instance().extend_ttl(ENTRY_TTL_THRESHOLD, ENTRY_TTL);
    }

    // -----------------------------------------------------------------------
    // Score Submission
    // -----------------------------------------------------------------------
    /// Submit a verified score to the leaderboard.
    ///
    /// Can be called by:
    ///   - The trusted guitar-pizza contract (no extra receipt needed, already verified)
    ///   - A player directly (receipt required for standalone verification)
    ///
    /// # Arguments
    /// * `caller`           - Address of the caller (game contract or player)
    /// * `player`           - The player whose score is being recorded
    /// * `level_id`         - Level identifier
    /// * `score`            - Final verified score
    /// * `perfect_hits`     - Perfect hit count from journal
    /// * `pizzas_completed` - Pizzas completed from journal
    /// * `receipt`          - RISC Zero receipt bytes (required if caller != trusted_game)
    pub fn submit_score(
        env: Env,
        caller: Address,
        player: Address,
        level_id: u32,
        score: u64,
        perfect_hits: u32,
        pizzas_completed: u32,
        receipt: Bytes,
    ) -> Result<u32, Error> {
        caller.require_auth();

        // Determine if caller is the trusted game contract
        let trusted: Address = env
            .storage()
            .instance()
            .get(&DataKey::TrustedGame)
            .ok_or(Error::NotInitialized)?;

        if caller != trusted {
            // Direct player submission: validate receipt independently
            if !Self::verify_receipt(&env, &receipt) {
                return Err(Error::InvalidReceipt);
            }
        }

        // Build new entry
        let new_entry = LeaderboardEntry {
            player: player.clone(),
            score,
            perfect_hits,
            pizzas_completed,
            timestamp: env.ledger().timestamp(),
        };

        // Update personal best
        let pb_key = DataKey::PersonalBest(player.clone(), level_id);
        let current_pb: Option<LeaderboardEntry> = env.storage().instance().get(&pb_key);
        let pb_beaten = match &current_pb {
            None => true,
            Some(pb) => score > pb.score,
        };
        if pb_beaten {
            env.storage().instance().set(&pb_key, &new_entry);
            env.storage().instance().extend_ttl(ENTRY_TTL_THRESHOLD, ENTRY_TTL);
        }

        // Update top-10 board
        let board_key = DataKey::Board(level_id);
        let mut board: Vec<LeaderboardEntry> = env
            .storage()
            .instance()
            .get(&board_key)
            .unwrap_or_else(|| Vec::new(&env));

        // Check if player is already on the board
        let mut player_board_idx: Option<u32> = None;
        for i in 0..board.len() {
            if board.get(i).unwrap().player == player {
                player_board_idx = Some(i);
                break;
            }
        }

        // Determine whether to insert/update
        let should_insert = if let Some(idx) = player_board_idx {
            // Player already on board — update if score improved
            if score > board.get(idx).unwrap().score {
                board.remove(idx);
                true
            } else {
                false
            }
        } else {
            // New player: insert if board not full or score beats last entry
            board.len() < BOARD_SIZE
                || (board.len() == BOARD_SIZE
                    && score > board.get(BOARD_SIZE - 1).unwrap().score)
        };

        let rank;
        if should_insert {
            // If board is at capacity, drop the last (lowest) entry
            if board.len() == BOARD_SIZE {
                board.remove(BOARD_SIZE - 1);
            }

            // Insert at correct sorted position
            let mut insert_pos = board.len();
            for i in 0..board.len() {
                if score > board.get(i).unwrap().score {
                    insert_pos = i;
                    break;
                }
            }
            board.insert(insert_pos, new_entry.clone());
            rank = insert_pos + 1;

            env.storage().instance().set(&board_key, &board);
            env.storage().instance().extend_ttl(ENTRY_TTL_THRESHOLD, ENTRY_TTL);

            // Emit event
            env.events().publish(
                (Symbol::new(&env, "leaderboard_updated"), player.clone()),
                (level_id, score, rank),
            );
        } else {
            // Score didn't make the board; find current rank or use BOARD_SIZE+1
            rank = player_board_idx
                .map(|i| i + 1)
                .unwrap_or(BOARD_SIZE + 1);
        }

        Ok(rank)
    }

    // -----------------------------------------------------------------------
    // Queries
    // -----------------------------------------------------------------------
    /// Get top-10 leaderboard for a level.
    pub fn get_leaderboard(env: Env, level_id: u32) -> Vec<LeaderboardEntry> {
        let board_key = DataKey::Board(level_id);
        env.storage()
            .instance()
            .get(&board_key)
            .unwrap_or_else(|| Vec::new(&env))
    }

    /// Get personal best for a player on a level.
    pub fn get_personal_best(
        env: Env,
        player: Address,
        level_id: u32,
    ) -> Option<LeaderboardEntry> {
        let pb_key = DataKey::PersonalBest(player, level_id);
        env.storage().instance().get(&pb_key)
    }

    // -----------------------------------------------------------------------
    // Admin
    // -----------------------------------------------------------------------
    /// Reset the leaderboard for a level (admin only).
    pub fn reset_leaderboard(env: Env, level_id: u32) -> Result<(), Error> {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .ok_or(Error::NotInitialized)?;
        admin.require_auth();

        let board_key = DataKey::Board(level_id);
        env.storage().instance().remove(&board_key);

        // Bump epoch so clients know board was reset
        let epoch_key = DataKey::Epoch(level_id);
        let epoch: u32 = env.storage().instance().get(&epoch_key).unwrap_or(0);
        env.storage().instance().set(&epoch_key, &(epoch + 1));
        env.storage().instance().extend_ttl(ENTRY_TTL_THRESHOLD, ENTRY_TTL);

        env.events().publish(
            (Symbol::new(&env, "board_reset"), level_id),
            epoch + 1,
        );
        Ok(())
    }

    /// Update the trusted game contract address (admin only).
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

    /// Update admin address.
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

    pub fn get_admin(env: Env) -> Option<Address> {
        env.storage().instance().get(&DataKey::Admin)
    }

    pub fn get_trusted_game(env: Env) -> Option<Address> {
        env.storage().instance().get(&DataKey::TrustedGame)
    }

    pub fn get_epoch(env: Env, level_id: u32) -> u32 {
        env.storage()
            .instance()
            .get(&DataKey::Epoch(level_id))
            .unwrap_or(0)
    }

    // -----------------------------------------------------------------------
    // Internal
    // -----------------------------------------------------------------------
    /// RISC Zero receipt placeholder verifier.
    ///
    /// TODO: Replace with actual RISC Zero on-chain verification:
    ///   https://github.com/NethermindEth/stellar-risc0-verifier/
    fn verify_receipt(_env: &Env, receipt: &Bytes) -> bool {
        receipt.len() >= RECEIPT_MIN_LEN
    }
}
