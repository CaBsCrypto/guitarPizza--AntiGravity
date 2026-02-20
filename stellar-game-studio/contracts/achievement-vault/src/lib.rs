#![no_std]

//! # Achievement Vault Contract
//!
//! On-chain badges earned by proving specific gameplay accomplishments via
//! a RISC Zero receipt. Each badge is unique per player per achievement type
//! and cannot be re-minted once earned.
//!
//! Achievement types (encoded as u32):
//!   0 = PerfectRun   — perfect_hits == total_hits AND total_hits > 0 (0 misses)
//!   1 = TrapMaster   — traps_avoided == total_traps AND total_traps > 0
//!   2 = FeverGod     — fever_seconds >= 30
//!   3 = IronChef     — pizzas_completed >= 5
//!
//! Proof data layout (40 bytes, big-endian u32/u64):
//!   [0..4]   perfect_hits     u32
//!   [4..8]   total_hits       u32
//!   [8..12]  traps_avoided    u32
//!   [12..16] total_traps      u32
//!   [16..20] fever_seconds    u32
//!   [20..24] pizzas_completed u32
//!   [24..32] score            u64
//!   [32..36] level_id         u32
//!   [36..40] reserved         u32 (set to 0)
//!
//! TODO: Replace verify_receipt with real RISC Zero verifier:
//!   https://github.com/NethermindEth/stellar-risc0-verifier/

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype,
    Address, Bytes, Env, Symbol, Vec,
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const PROOF_DATA_LEN: u32 = 40;
const RECEIPT_MIN_LEN: u32 = 64;

const ENTRY_TTL: u32 = 518_400;        // ~30 days
const ENTRY_TTL_THRESHOLD: u32 = 120_960; // ~7 days

// Achievement IDs
pub const ACHIEVEMENT_PERFECT_RUN: u32 = 0;
pub const ACHIEVEMENT_TRAP_MASTER: u32 = 1;
pub const ACHIEVEMENT_FEVER_GOD: u32 = 2;
pub const ACHIEVEMENT_IRON_CHEF: u32 = 3;
pub const ACHIEVEMENT_COUNT: u32 = 4;

// Thresholds
const FEVER_GOD_MIN_SECONDS: u32 = 30;
const IRON_CHEF_MIN_PIZZAS: u32 = 5;

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    NotInitialized = 1,
    AlreadyEarned = 2,
    InvalidProofData = 3,
    InvalidReceipt = 4,
    ConditionNotMet = 5,
    InvalidAchievementType = 6,
    AdminRequired = 7,
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Badge {
    pub achievement_type: u32,
    pub player: Address,
    pub level_id: u32,
    pub earned_at: u64,
    pub score: u64,
    /// Snapshot of the proof stats for display purposes
    pub perfect_hits: u32,
    pub total_hits: u32,
    pub traps_avoided: u32,
    pub total_traps: u32,
    pub fever_seconds: u32,
    pub pizzas_completed: u32,
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    TrustedGame,
    /// Badge keyed by (player, achievement_type)
    Badge(Address, u32),
    /// Total badge count per player (for quick summary)
    BadgeCount(Address),
}

// ---------------------------------------------------------------------------
// Contract
// ---------------------------------------------------------------------------
#[contract]
pub struct AchievementVault;

#[contractimpl]
impl AchievementVault {
    // -----------------------------------------------------------------------
    // Constructor
    // -----------------------------------------------------------------------
    pub fn __constructor(env: Env, admin: Address, game_hub: Address) {
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::TrustedGame, &game_hub);
        env.storage().instance().extend_ttl(ENTRY_TTL_THRESHOLD, ENTRY_TTL);
    }

    // -----------------------------------------------------------------------
    // Core: Claim achievement
    // -----------------------------------------------------------------------
    /// Claim a badge by submitting proof data and a RISC Zero receipt.
    ///
    /// # Arguments
    /// * `player`           - The player claiming the badge
    /// * `achievement_type` - 0=PerfectRun, 1=TrapMaster, 2=FeverGod, 3=IronChef
    /// * `level_id`         - Level where the achievement was earned
    /// * `proof_data`       - 40-byte stats blob parsed from the ZK journal
    /// * `receipt`          - Full RISC Zero receipt bytes (journal + seal)
    pub fn claim_achievement(
        env: Env,
        player: Address,
        achievement_type: u32,
        level_id: u32,
        proof_data: Bytes,
        receipt: Bytes,
    ) -> Result<Badge, Error> {
        player.require_auth();

        // Validate achievement type
        if achievement_type >= ACHIEVEMENT_COUNT {
            return Err(Error::InvalidAchievementType);
        }

        // Check not already earned
        let badge_key = DataKey::Badge(player.clone(), achievement_type);
        if env.storage().instance().has(&badge_key) {
            return Err(Error::AlreadyEarned);
        }

        // Validate receipt
        if !Self::verify_receipt(&env, &receipt) {
            return Err(Error::InvalidReceipt);
        }

        // Validate proof_data length
        if proof_data.len() < PROOF_DATA_LEN {
            return Err(Error::InvalidProofData);
        }

        // Parse proof_data fields
        let perfect_hits     = Self::read_u32(&proof_data, 0);
        let total_hits       = Self::read_u32(&proof_data, 4);
        let traps_avoided    = Self::read_u32(&proof_data, 8);
        let total_traps      = Self::read_u32(&proof_data, 12);
        let fever_seconds    = Self::read_u32(&proof_data, 16);
        let pizzas_completed = Self::read_u32(&proof_data, 20);
        let score            = Self::read_u64(&proof_data, 24);
        let _level_from_proof = Self::read_u32(&proof_data, 32);

        // Verify achievement conditions
        let condition_met = match achievement_type {
            ACHIEVEMENT_PERFECT_RUN => {
                // 0 misses: every hit was perfect, and player actually played
                total_hits > 0 && perfect_hits == total_hits
            }
            ACHIEVEMENT_TRAP_MASTER => {
                // Avoided all trap items (hotdogs / hamburgers)
                total_traps > 0 && traps_avoided == total_traps
            }
            ACHIEVEMENT_FEVER_GOD => {
                // Maintained fever mode for 30+ continuous seconds
                fever_seconds >= FEVER_GOD_MIN_SECONDS
            }
            ACHIEVEMENT_IRON_CHEF => {
                // Completed 5 or more pizzas in a single session
                pizzas_completed >= IRON_CHEF_MIN_PIZZAS
            }
            _ => false,
        };

        if !condition_met {
            return Err(Error::ConditionNotMet);
        }

        // Mint the badge
        let badge = Badge {
            achievement_type,
            player: player.clone(),
            level_id,
            earned_at: env.ledger().timestamp(),
            score,
            perfect_hits,
            total_hits,
            traps_avoided,
            total_traps,
            fever_seconds,
            pizzas_completed,
        };

        env.storage().instance().set(&badge_key, &badge);
        env.storage().instance().extend_ttl(ENTRY_TTL_THRESHOLD, ENTRY_TTL);

        // Update badge count
        let count_key = DataKey::BadgeCount(player.clone());
        let count: u32 = env.storage().instance().get(&count_key).unwrap_or(0);
        env.storage().instance().set(&count_key, &(count + 1));
        env.storage().instance().extend_ttl(ENTRY_TTL_THRESHOLD, ENTRY_TTL);

        // Emit event
        env.events().publish(
            (Symbol::new(&env, "achievement_earned"), player.clone()),
            (achievement_type, level_id, score),
        );

        Ok(badge)
    }

    // -----------------------------------------------------------------------
    // Queries
    // -----------------------------------------------------------------------
    /// Get a specific badge for a player.
    pub fn get_badge(env: Env, player: Address, achievement_type: u32) -> Option<Badge> {
        let badge_key = DataKey::Badge(player, achievement_type);
        env.storage().instance().get(&badge_key)
    }

    /// Get all badges for a player (returns only earned ones, up to 4).
    pub fn get_all_badges(env: Env, player: Address) -> Vec<Badge> {
        let mut badges = Vec::new(&env);
        for achievement_type in 0..ACHIEVEMENT_COUNT {
            let badge_key = DataKey::Badge(player.clone(), achievement_type);
            if let Some(badge) = env.storage().instance().get::<DataKey, Badge>(&badge_key) {
                badges.push_back(badge);
            }
        }
        badges
    }

    /// Get how many badges a player has earned.
    pub fn get_badge_count(env: Env, player: Address) -> u32 {
        env.storage()
            .instance()
            .get(&DataKey::BadgeCount(player))
            .unwrap_or(0)
    }

    /// Check if a player has earned a specific achievement.
    pub fn has_achievement(env: Env, player: Address, achievement_type: u32) -> bool {
        let badge_key = DataKey::Badge(player, achievement_type);
        env.storage().instance().has(&badge_key)
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
    // Internal
    // -----------------------------------------------------------------------
    /// Read a big-endian u32 from a Bytes slice at a given byte offset.
    fn read_u32(data: &Bytes, offset: u32) -> u32 {
        let b0 = data.get(offset).unwrap_or(0) as u32;
        let b1 = data.get(offset + 1).unwrap_or(0) as u32;
        let b2 = data.get(offset + 2).unwrap_or(0) as u32;
        let b3 = data.get(offset + 3).unwrap_or(0) as u32;
        (b0 << 24) | (b1 << 16) | (b2 << 8) | b3
    }

    /// Read a big-endian u64 from a Bytes slice at a given byte offset.
    fn read_u64(data: &Bytes, offset: u32) -> u64 {
        let hi = Self::read_u32(data, offset) as u64;
        let lo = Self::read_u32(data, offset + 4) as u64;
        (hi << 32) | lo
    }

    /// RISC Zero receipt placeholder verifier.
    ///
    /// TODO: Replace with actual on-chain RISC Zero verification:
    ///   https://github.com/NethermindEth/stellar-risc0-verifier/
    fn verify_receipt(_env: &Env, receipt: &Bytes) -> bool {
        receipt.len() >= RECEIPT_MIN_LEN
    }
}
