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
    pub payout_multiplier_bps: u64,
}

#[contracttype]
pub enum DataKey {
    Admin,
    SliceToken,
    NFTContract,
    BakingSlot(Address, u32), // (player, slot_id)
    SlotUnlocked(Address, u32), // (player, slot_id)
    CheeseToken,
    PepperoniToken,
    BaconToken,
    OnionToken,
    Initialized,
}

// ── Contract Definition ──────────────────────────────────────────────────

#[contract]
pub struct PizzaBakingContract;

#[contractimpl]
impl PizzaBakingContract {
    /// Initialize the contract with admin, slice token, and NFT contract.
    pub fn initialize(
        env: Env,
        admin: Address,
        slice_token: Address,
        nft_contract: Address,
    ) {
        if env.storage().instance().has(&DataKey::Initialized) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::SliceToken, &slice_token);
        env.storage().instance().set(&DataKey::NFTContract, &nft_contract);
        env.storage().instance().set(&DataKey::Initialized, &true);
    }

    /// Set standard ingredient token addresses.
    pub fn set_ingredients(
        env: Env,
        cheese: Address,
        pepperoni: Address,
        bacon: Address,
        onion: Address,
    ) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).expect("Not initialized");
        admin.require_auth();

        env.storage().instance().set(&DataKey::CheeseToken, &cheese);
        env.storage().instance().set(&DataKey::PepperoniToken, &pepperoni);
        env.storage().instance().set(&DataKey::BaconToken, &bacon);
        env.storage().instance().set(&DataKey::OnionToken, &onion);
    }

    /// Unlock permanently locked slot 3 or 4 by paying $SLICE.
    pub fn unlock_slot(env: Env, player: Address, slot_id: u32) {
        player.require_auth();

        if slot_id != 3 && slot_id != 4 {
            panic!("Only slots 3 and 4 can be unlocked");
        }

        let key = DataKey::SlotUnlocked(player.clone(), slot_id);
        if env.storage().persistent().has(&key) {
            panic!("Slot already unlocked");
        }

        let cost: i128 = if slot_id == 3 {
            50 * 10_000_000 // 50 $SLICE scaled by 1e7
        } else {
            100 * 10_000_000 // 100 $SLICE scaled by 1e7
        };

        let slice_token: Address = env
            .storage()
            .instance()
            .get(&DataKey::SliceToken)
            .expect("Slice token not configured");

        let slice_client = SliceTokenClient::new(&env, &slice_token);
        let admin: Address = env.storage().instance().get(&DataKey::Admin).expect("Admin not configured");

        // Transfer unlock cost from player to admin
        slice_client.transfer(&player, &admin, &cost);

        env.storage().persistent().set(&key, &true);

        env.events().publish(
            (symbol_short!("unlock"), player, slot_id),
            (cost,),
        );
    }

    /// Query whether a specific slot is unlocked for a player.
    pub fn is_slot_unlocked(env: Env, player: Address, slot_id: u32) -> bool {
        if slot_id == 1 || slot_id == 2 {
            return true;
        }
        let key = DataKey::SlotUnlocked(player, slot_id);
        env.storage().persistent().has(&key)
    }

    /// Start baking a pizza in a specific slot.
    /// Deducts ingredients directly from the player's wallet and charges wood fuel fees if selected.
    pub fn start_bake(
        env: Env,
        player: Address,
        slot_id: u32,
        recipe_id: u32,
        duration: u64,
        base_payout: u64,
        oven_nft_id: Option<u32>,
        fuel_type: u32, // 0 = None, 1 = Cherry, 2 = Mesquite
    ) {
        player.require_auth();

        // 1. Verify slot is unlocked
        if slot_id != 1 && slot_id != 2 {
            let unlock_key = DataKey::SlotUnlocked(player.clone(), slot_id);
            if !env.storage().persistent().has(&unlock_key) {
                panic!("Slot is permanently locked. Unlock it first.");
            }
        }

        // 2. Check active slot lock
        let key = DataKey::BakingSlot(player.clone(), slot_id);
        let existing: Option<BakingSlot> = env.storage().persistent().get(&key);
        if let Some(ref slot) = existing {
            if slot.locked {
                panic!("Slot is locked: bake already active in this slot");
            }
        }

        let slice_token: Address = env
            .storage()
            .instance()
            .get(&DataKey::SliceToken)
            .expect("Slice token not configured");
        let slice_client = SliceTokenClient::new(&env, &slice_token);

        // 3. Deduct wood fuel fee
        let mut wood_speed_bps = 10000;
        let mut wood_payout_bps = 10000;
        if fuel_type > 0 {
            let fuel_cost: i128 = if fuel_type == 1 {
                5_000_000 // 0.5 $SLICE (scaled by 1e7)
            } else if fuel_type == 2 {
                12_000_000 // 1.2 $SLICE
            } else {
                panic!("Invalid fuel type");
            };
            
            // Transfer fuel fee to the contract treasury (permanent sink)
            slice_client.transfer(&player, &env.current_contract_address(), &fuel_cost);

            if fuel_type == 1 {
                wood_speed_bps = 13000;  // 1.3x speed
                wood_payout_bps = 11000; // 1.1x payout
            } else if fuel_type == 2 {
                wood_speed_bps = 18000;  // 1.8x speed
                wood_payout_bps = 13000; // 1.3x payout
            }
        }

        // 4. Validate Oven NFT ownership and get multipliers if present
        let mut nft_speed_bps = 10000; // 1.0x default
        let mut nft_payout_bps = 10000; // 1.0x default

        if let Some(nft_id) = oven_nft_id {
            let nft_contract: Address = env
                .storage()
                .instance()
                .get(&DataKey::NFTContract)
                .expect("NFT contract address not configured");
            
            let nft_client = NFTClient::new(&env, &nft_contract);
            let owner = nft_client.owner_of(&nft_id);
            if owner != player {
                panic!("Player does not own Equipped Oven NFT");
            }
            
            // Fetch multipliers based on style
            let (speed, payout) = Self::get_nft_multipliers(nft_id);
            nft_speed_bps = speed;
            nft_payout_bps = payout;
        }

        // 5. Compute combined speed and payout multipliers
        let combined_speed_bps = (wood_speed_bps * nft_speed_bps) / 10000;
        let combined_payout_multiplier_bps = (wood_payout_bps * nft_payout_bps) / 10000;

        let actual_duration = if combined_speed_bps > 0 {
            (duration * 10000) / combined_speed_bps
        } else {
            duration
        };

        // 6. Deduct required ingredients from player's wallet via transfer_from
        let (cheese_cost, pepperoni_cost, bacon_cost, onion_cost) = match recipe_id {
            1 => (1, 0, 0, 0), // Margherita
            2 => (1, 1, 0, 0), // Pepperoni
            3 => (1, 1, 1, 0), // Special
            4 => (2, 1, 0, 0), // Tartufo (rare truffle ignored on-chain)
            5 => (2, 0, 0, 1), // Dolce (rare fig ignored)
            6 => (2, 0, 2, 0), // Mafia (rare caviar/gold ignored)
            _ => panic!("Invalid recipe_id"),
        };

        let deduct_ingredient = |token_key: DataKey, cost: i128| {
            if cost > 0 {
                let token_addr: Address = env
                    .storage()
                    .instance()
                    .get(&token_key)
                    .expect("Ingredient token not configured");
                let client = SliceTokenClient::new(&env, &token_addr);
                // Transfer from player to contract treasury/burn
                client.transfer_from(&env.current_contract_address(), &player, &env.current_contract_address(), &cost);
            }
        };

        deduct_ingredient(DataKey::CheeseToken, cheese_cost);
        deduct_ingredient(DataKey::PepperoniToken, pepperoni_cost);
        deduct_ingredient(DataKey::BaconToken, bacon_cost);
        deduct_ingredient(DataKey::OnionToken, onion_cost);

        // 7. Save new locked baking slot status
        let new_slot = BakingSlot {
            locked: true,
            recipe_id,
            start_time: env.ledger().timestamp(),
            duration: actual_duration,
            oven_nft_id,
            base_payout,
            payout_multiplier_bps: combined_payout_multiplier_bps,
        };

        env.storage().persistent().set(&key, &new_slot);

        // Publish start event
        env.events().publish(
            (symbol_short!("start"), player, slot_id),
            (recipe_id, actual_duration, oven_nft_id, fuel_type),
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

        // Combined payout multiplier bonus computed at start_bake
        let actual_payout = (slot.base_payout * slot.payout_multiplier_bps) / 10000;

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
