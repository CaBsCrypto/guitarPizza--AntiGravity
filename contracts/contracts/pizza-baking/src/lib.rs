#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, Symbol,
};

// ── Client Definitions ───────────────────────────────────────────────────

#[soroban_sdk::contractclient(name = "SliceTokenClient")]
pub trait SliceTokenTrait {
    fn transfer(env: Env, from: Address, to: Address, amount: i128);
    fn transfer_from(env: Env, spender: Address, from: Address, to: Address, amount: i128);
    fn balance(env: Env, id: Address) -> i128;
}

#[soroban_sdk::contractclient(name = "NFTClient")]
pub trait NFTTrait {
    fn owner_of(env: Env, token_id: u32) -> Address;
}

// ── Storage and Types ────────────────────────────────────────────────────

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BakingSlot {
    pub locked: bool,
    pub recipe_id: u32,
    pub start_time: u64,
    pub duration: u64,
    pub oven_nft_id: Option<u32>,
    pub base_payout: u64,
}

#[contracttype]
pub enum DataKey {
    Admin,
    SliceToken,
    NFTContract,
    BakingSlot(Address, u32), // (player, slot_id)
}

// ── Contract Definition ──────────────────────────────────────────────────

#[contract]
pub struct PizzaBakingContract;

#[contractimpl]
impl PizzaBakingContract {
    /// Initialize the contract with admin, slice token, and optional NFT contract.
    pub fn initialize(
        env: Env,
        admin: Address,
        slice_token: Address,
        nft_contract: Option<Address>,
    ) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::SliceToken, &slice_token);
        if let Some(nft) = nft_contract {
            env.storage().instance().set(&DataKey::NFTContract, &nft);
        }
    }

    /// Start baking a pizza in a specific slot.
    /// Requires active slot lock checks and speed/payout calculations from Equipped Oven NFT.
    pub fn start_bake(
        env: Env,
        player: Address,
        slot_id: u32,
        recipe_id: u32,
        duration: u64,
        base_payout: u64,
        oven_nft_id: Option<u32>,
    ) {
        player.require_auth();

        // 1. Check active slot lock
        let key = DataKey::BakingSlot(player.clone(), slot_id);
        let existing: Option<BakingSlot> = env.storage().persistent().get(&key);
        if let Some(ref slot) = existing {
            if slot.locked {
                panic!("Slot is locked: bake already active in this slot");
            }
        }

        // 2. Validate Oven NFT ownership and get multipliers if present
        let mut speed_multiplier_bps = 10000; // 1.0x default
        let mut payout_multiplier_bps = 10000; // 1.0x default

        if let Some(nft_id) = oven_nft_id {
            let nft_contract_opt: Option<Address> = env
                .storage()
                .instance()
                .get(&DataKey::NFTContract);
            
            if let Some(nft_contract) = nft_contract_opt {
                let nft_client = NFTClient::new(&env, &nft_contract);
                let owner = nft_client.owner_of(&nft_id);
                if owner != player {
                    panic!("Player does not own Equipped Oven NFT");
                }
                
                // Fetch multipliers based on style
                let (speed, payout) = Self::get_nft_multipliers(nft_id);
                speed_multiplier_bps = speed;
                payout_multiplier_bps = payout;
            } else {
                panic!("NFT contract address not configured");
            }
        }

        // 3. Compute speed multiplier effect (reduces duration)
        // actual_duration = base_duration * 10000 / speed_multiplier_bps
        let actual_duration = if speed_multiplier_bps > 0 {
            (duration * 10000) / speed_multiplier_bps
        } else {
            duration
        };

        // 4. Save new locked baking slot status
        let new_slot = BakingSlot {
            locked: true,
            recipe_id,
            start_time: env.ledger().timestamp(),
            duration: actual_duration,
            oven_nft_id,
            base_payout,
        };

        env.storage().persistent().set(&key, &new_slot);

        // Publish start event
        env.events().publish(
            (symbol_short!("start"), player, slot_id),
            (recipe_id, actual_duration, oven_nft_id),
        );
    }

    /// Speed up active bake by deducting 0.1 $SLICE (1,000,000 raw units) and reducing countdown by 1 hour (3600 seconds).
    pub fn speed_up(env: Env, player: Address, slot_id: u32) {
        player.require_auth();

        let key = DataKey::BakingSlot(player.clone(), slot_id);
        let mut slot: BakingSlot = env
            .storage()
            .persistent()
            .get(&key)
            .expect("No active bake in slot");

        if !slot.locked {
            panic!("Slot is not locked");
        }

        // Deduct 0.1 $SLICE (10^7 scale means 0.1 is 1_000_000 raw units)
        let slice_token: Address = env
            .storage()
            .instance()
            .get(&DataKey::SliceToken)
            .expect("Slice token not configured");

        let slice_client = SliceTokenClient::new(&env, &slice_token);
        
        // Transfer 0.1 $SLICE (1,000_000 raw units) from player to this baking contract (permanent sink or pool)
        slice_client.transfer(&player, &env.current_contract_address(), &1_000_000_i128);

        // Speed up deduction: Reduce remaining duration by 1 hour (3600 seconds)
        let elapsed = env.ledger().timestamp().saturating_sub(slot.start_time);
        let remaining = slot.duration.saturating_sub(elapsed);
        
        if remaining > 3600 {
            // Subtract 3600 seconds from duration
            slot.duration = slot.duration.saturating_sub(3600);
        } else {
            // Finishes it immediately by setting duration to the elapsed time
            slot.duration = elapsed;
        }

        env.storage().persistent().set(&key, &slot);

        // Publish speed up event
        env.events().publish(
            (symbol_short!("speedup"), player, slot_id),
            (slot.duration,),
        );
    }

    /// Claim the baked pizza. Validates countdown timer, calculates equipped oven payout bonuses, cashing out.
    pub fn claim_bake(env: Env, player: Address, slot_id: u32) -> u64 {
        player.require_auth();

        let key = DataKey::BakingSlot(player.clone(), slot_id);
        let mut slot: BakingSlot = env
            .storage()
            .persistent()
            .get(&key)
            .expect("No active bake in slot");

        if !slot.locked {
            panic!("Slot is not locked / already claimed");
        }

        // Ledger timestamp countdown validator
        let current_time = env.ledger().timestamp();
        let target_time = slot.start_time.saturating_add(slot.duration);
        if current_time < target_time {
            panic!("Ledger timestamp countdown validator failed: bake in progress");
        }

        // Calculate Equipped Oven NFT payout multiplier bonus
        let mut payout_multiplier_bps = 10000; // 1.0x default
        if let Some(nft_id) = slot.oven_nft_id {
            let (_, payout) = Self::get_nft_multipliers(nft_id);
            payout_multiplier_bps = payout;
        }

        let actual_payout = (slot.base_payout * payout_multiplier_bps) / 10000;

        // Unlock active slot lock
        slot.locked = false;
        env.storage().persistent().set(&key, &slot);

        // Pay the reward to the player
        let slice_token: Address = env
            .storage()
            .instance()
            .get(&DataKey::SliceToken)
            .expect("Slice token not configured");
        let slice_client = SliceTokenClient::new(&env, &slice_token);

        // Transfer raw reward units from this contract to the player
        slice_client.transfer(
            &env.current_contract_address(),
            &player,
            &(actual_payout as i128),
        );

        // Publish claim event
        env.events().publish(
            (symbol_short!("claim"), player, slot_id),
            (slot.recipe_id, actual_payout),
        );

        actual_payout
    }

    /// Get baking slot details.
    pub fn get_slot(env: Env, player: Address, slot_id: u32) -> Option<BakingSlot> {
        env.storage().persistent().get(&DataKey::BakingSlot(player, slot_id))
    }

    /// Helper function to retrieve the equipped oven speed and payout multipliers in basis points (10000 = 1.0x).
    pub fn get_nft_multipliers(nft_id: u32) -> (u64, u64) {
        // 8 pixel-art styles mapping
        let style = ((nft_id - 1) % 8) + 1;
        match style {
            1 => (10000, 10000), // Standard: 1x speed, 1x payout
            2 => (11000, 10500), // Piccolino: 1.1x speed (10% faster), 1.05x payout
            3 => (12000, 11000), // Soldato: 1.2x speed, 1.10x payout
            4 => (13000, 12000), // Caporegime: 1.3x speed, 1.20x payout
            5 => (14000, 13000), // Consigliere: 1.4x speed, 1.30x payout
            6 => (15000, 14000), // Underboss: 1.5x speed, 1.40x payout
            7 => (18000, 16000), // Boss: 1.8x speed, 1.60x payout
            8 => (20000, 20000), // Don de la Masa: 2.0x speed, 2.0x payout
            _ => (10000, 10000),
        }
    }
}

mod test;
