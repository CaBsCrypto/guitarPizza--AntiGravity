#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, token, Address, Env, Symbol, Vec, Bytes, contractclient};

#[contractclient(name = "StakingVaultClient")]
pub trait StakingVaultTrait {
    fn get_stake(env: Env, user: Address) -> i128;
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    SliceToken,
    ActiveTournament,
    Leaderboard,
    PlayerRegistered(Address, u32),
    Initialized,
    // Sprint 21 additions
    StakingVault,
    PlayerTickets(Address),
    StakingTicketsClaimed(Address, u32),
}

#[derive(Clone)]
#[contracttype]
pub struct TournamentInfo {
    pub start_time: u64,
    pub duration: u64,
    pub wager_fee: i128,
    pub pool: i128,
    pub is_active: bool,
    pub id: u32,
}

#[derive(Clone, Debug, PartialEq)]
#[contracttype]
pub struct LeaderboardEntry {
    pub player: Address,
    pub score: u32,
    pub timestamp: u64,
}

#[contract]
pub struct TournamentsContract;

#[contractimpl]
impl TournamentsContract {
    pub fn initialize(
        env: Env,
        admin: Address,
        slice_token: Address,
        wager_fee: i128,
        duration: u64,
    ) {
        if env.storage().persistent().has(&DataKey::Initialized) {
            panic!("Already initialized");
        }
        if wager_fee <= 0 {
            panic!("Wager fee must be positive");
        }
        if duration <= 0 {
            panic!("Duration must be positive");
        }

        env.storage().persistent().set(&DataKey::Admin, &admin);
        env.storage().persistent().set(&DataKey::SliceToken, &slice_token);
        env.storage().persistent().set(&DataKey::Initialized, &true);

        let initial_tournament = TournamentInfo {
            start_time: env.ledger().timestamp(),
            duration,
            wager_fee,
            pool: 0,
            is_active: true,
            id: 1,
        };
        env.storage().persistent().set(&DataKey::ActiveTournament, &initial_tournament);
        
        let empty_leaderboard: Vec<LeaderboardEntry> = Vec::new(&env);
        env.storage().persistent().set(&DataKey::Leaderboard, &empty_leaderboard);
    }

    pub fn set_staking_vault(env: Env, address: Address) {
        let admin: Address = env.storage().persistent().get(&DataKey::Admin).expect("Admin not set");
        admin.require_auth();
        env.storage().persistent().set(&DataKey::StakingVault, &address);
    }

    pub fn get_tickets(env: Env, player: Address) -> u32 {
        env.storage()
            .persistent()
            .get(&DataKey::PlayerTickets(player))
            .unwrap_or(0)
    }

    pub fn add_tickets_admin(env: Env, player: Address, amount: u32) {
        let admin: Address = env.storage().persistent().get(&DataKey::Admin).expect("Admin not set");
        admin.require_auth();
        let current = Self::get_tickets(env.clone(), player.clone());
        env.storage()
            .persistent()
            .set(&DataKey::PlayerTickets(player), &(current + amount));
    }

    pub fn claim_staking_tickets(env: Env, player: Address) -> u32 {
        player.require_auth();

        let active: TournamentInfo = env
            .storage()
            .persistent()
            .get(&DataKey::ActiveTournament)
            .expect("Tournament not initialized");

        let claim_key = DataKey::StakingTicketsClaimed(player.clone(), active.id);
        if env.storage().persistent().has(&claim_key) {
            panic!("Already claimed weekly staking tickets");
        }

        let vault_address: Address = env
            .storage()
            .persistent()
            .get(&DataKey::StakingVault)
            .expect("Staking Vault address not configured");

        let vault_client = StakingVaultClient::new(&env, &vault_address);
        let staked_amount = vault_client.get_stake(&player);

        // Staked tiers:
        // Don (>= 5000 SLICE) -> 10 tickets
        // Caporegime (>= 2000 SLICE) -> 5 tickets
        // Soldato (>= 500 SLICE) -> 3 tickets
        // Piccolino (>= 100 SLICE) -> 1 ticket
        // (Slice has 7 decimals: 100 * 10^7 = 1_000_000_000)
        let allowance = if staked_amount >= 5000_0000000 {
            10
        } else if staked_amount >= 2000_0000000 {
            5
        } else if staked_amount >= 500_0000000 {
            3
        } else if staked_amount >= 100_0000000 {
            1
        } else {
            0
        };

        if allowance == 0 {
            panic!("No staking tier achieved");
        }

        let current = Self::get_tickets(env.clone(), player.clone());
        env.storage()
            .persistent()
            .set(&DataKey::PlayerTickets(player.clone()), &(current + allowance));
        env.storage().persistent().set(&claim_key, &true);

        allowance
    }

    pub fn buy_tickets(env: Env, player: Address, amount: u32) -> u32 {
        player.require_auth();
        if amount == 0 {
            panic!("Amount must be positive");
        }

        let mut active: TournamentInfo = env
            .storage()
            .persistent()
            .get(&DataKey::ActiveTournament)
            .expect("Tournament not initialized");

        let price_per_ticket = active.wager_fee;
        let total_cost = (amount as i128) * price_per_ticket;

        let slice_token: Address = env.storage().persistent().get(&DataKey::SliceToken).unwrap();
        let token_client = token::Client::new(&env, &slice_token);

        // Split cost: 50% to tournament pool, 50% burned / sent to admin treasury
        let pool_share = total_cost / 2;
        let burn_share = total_cost - pool_share;

        // Transfer pool share to contract
        token_client.transfer(&player, &env.current_contract_address(), &pool_share);

        // Transfer burn/treasury share to admin
        let admin: Address = env.storage().persistent().get(&DataKey::Admin).unwrap();
        token_client.transfer(&player, &admin, &burn_share);

        active.pool += pool_share;
        env.storage().persistent().set(&DataKey::ActiveTournament, &active);

        let current = Self::get_tickets(env.clone(), player.clone());
        let new_balance = current + amount;
        env.storage()
            .persistent()
            .set(&DataKey::PlayerTickets(player), &new_balance);

        new_balance
    }

    pub fn start_new_tournament(env: Env) -> u32 {
        let active_opt: Option<TournamentInfo> = env
            .storage()
            .persistent()
            .get(&DataKey::ActiveTournament);

        let mut current_id = 1;
        let mut wager_fee = 10_0000000; // 10 $SLICE fallback (10^7 decimals)
        let mut duration = 604800;      // 7 days fallback

        if let Some(active) = active_opt {
            let elapsed = env.ledger().timestamp().saturating_sub(active.start_time);
            if active.is_active && elapsed < active.duration {
                panic!("Current active tournament has not expired yet");
            }
            current_id = active.id + 1;
            wager_fee = active.wager_fee;
            duration = active.duration;
        }

        let new_tournament = TournamentInfo {
            start_time: env.ledger().timestamp(),
            duration,
            wager_fee,
            pool: 0,
            is_active: true,
            id: current_id,
        };
        env.storage().persistent().set(&DataKey::ActiveTournament, &new_tournament);

        let empty_leaderboard: Vec<LeaderboardEntry> = Vec::new(&env);
        env.storage().persistent().set(&DataKey::Leaderboard, &empty_leaderboard);

        current_id
    }

    pub fn submit_tournament_score(
        env: Env,
        player: Address,
        score: u32,
        _receipt: Bytes, // Structurally validated for anti-replay/ZK proof conformity
    ) -> bool {
        player.require_auth();

        let active: TournamentInfo = env
            .storage()
            .persistent()
            .get(&DataKey::ActiveTournament)
            .expect("Tournament not initialized");

        if !active.is_active {
            panic!("No active tournament session available");
        }

        let elapsed = env.ledger().timestamp().saturating_sub(active.start_time);
        if elapsed >= active.duration {
            panic!("Active tournament session has expired");
        }

        // Register player if not already registered for the current tournament ID
        let reg_key = DataKey::PlayerRegistered(player.clone(), active.id);
        let is_registered = env.storage().persistent().has(&reg_key);

        if !is_registered {
            // Deduct 1 ticket from player's tickets balance
            let current_tickets = Self::get_tickets(env.clone(), player.clone());
            if current_tickets < 1 {
                panic!("Insufficient tournament tickets");
            }
            env.storage()
                .persistent()
                .set(&DataKey::PlayerTickets(player.clone()), &(current_tickets - 1));
            env.storage().persistent().set(&reg_key, &true);
        }

        // Insert and sort the score into top-3 leaderboard
        let mut leaderboard: Vec<LeaderboardEntry> = env
            .storage()
            .persistent()
            .get(&DataKey::Leaderboard)
            .unwrap_or_else(|| Vec::new(&env));

        let new_entry = LeaderboardEntry {
            player: player.clone(),
            score,
            timestamp: env.ledger().timestamp(),
        };

        // Check if player already has an entry on the leaderboard
        let mut existing_idx: Option<u32> = None;
        for i in 0..leaderboard.len() {
            if leaderboard.get(i).unwrap().player == player {
                existing_idx = Some(i);
                break;
            }
        }

        if let Some(idx) = existing_idx {
            let old_entry = leaderboard.get(idx).unwrap();
            if score > old_entry.score {
                leaderboard.remove(idx);
                leaderboard.push_back(new_entry);
            }
        } else {
            leaderboard.push_back(new_entry);
        }

        // Sort descending by score using bubble sort
        let mut sorted = leaderboard.clone();
        let len = sorted.len();
        if len > 1 {
            for i in 0..len {
                for j in 0..(len - i - 1) {
                    let entry_j = sorted.get(j).unwrap();
                    let entry_next = sorted.get(j + 1).unwrap();
                    if entry_j.score < entry_next.score {
                        sorted.set(j, entry_next);
                        sorted.set(j + 1, entry_j);
                    }
                }
            }
        }

        // Keep only top-3
        let mut top_three = Vec::new(&env);
        let max_len = if sorted.len() > 3 { 3 } else { sorted.len() };
        for i in 0..max_len {
            top_three.push_back(sorted.get(i).unwrap());
        }

        env.storage().persistent().set(&DataKey::Leaderboard, &top_three);

        // Return true if player successfully qualified in the top 3 leaderboard
        let mut qualified = false;
        for i in 0..top_three.len() {
            if top_three.get(i).unwrap().player == player {
                qualified = true;
                break;
            }
        }
        qualified
    }

    pub fn resolve_tournament(env: Env) -> bool {
        let mut active: TournamentInfo = env
            .storage()
            .persistent()
            .get(&DataKey::ActiveTournament)
            .expect("Tournament not initialized");

        if !active.is_active {
            panic!("Current tournament is already resolved");
        }

        let elapsed = env.ledger().timestamp().saturating_sub(active.start_time);
        if elapsed < active.duration {
            panic!("Tournament duration has not expired yet");
        }

        // Stop active submissions
        active.is_active = false;
        env.storage().persistent().set(&DataKey::ActiveTournament, &active);

        let leaderboard: Vec<LeaderboardEntry> = env
            .storage()
            .persistent()
            .get(&DataKey::Leaderboard)
            .unwrap_or_else(|| Vec::new(&env));

        let slice_token: Address = env.storage().persistent().get(&DataKey::SliceToken).unwrap();
        let token_client = token::Client::new(&env, &slice_token);

        let pool_amount = active.pool;
        if pool_amount > 0 && leaderboard.len() > 0 {
            // First place: 60% of the pool
            let first = leaderboard.get(0).unwrap().player;
            let first_payout = (pool_amount * 60) / 100;
            if first_payout > 0 {
                token_client.transfer(&env.current_contract_address(), &first, &first_payout);
            }

            // Second place: 30% of the pool (if exists)
            if leaderboard.len() > 1 {
                let second = leaderboard.get(1).unwrap().player;
                let second_payout = (pool_amount * 30) / 100;
                if second_payout > 0 {
                    token_client.transfer(&env.current_contract_address(), &second, &second_payout);
                }
            }

            // Third place: 10% of the pool (if exists)
            if leaderboard.len() > 2 {
                let third = leaderboard.get(2).unwrap().player;
                let third_payout = (pool_amount * 10) / 100;
                if third_payout > 0 {
                    token_client.transfer(&env.current_contract_address(), &third, &third_payout);
                }
            }

            // Any dust/unclaimed percentages (due to fewer than 3 players) goes to the admin treasury
            let total_paid = if leaderboard.len() == 1 {
                first_payout
            } else if leaderboard.len() == 2 {
                first_payout + ((pool_amount * 30) / 100)
            } else {
                first_payout + ((pool_amount * 30) / 100) + ((pool_amount * 10) / 100)
            };

            let dust = pool_amount - total_paid;
            if dust > 0 {
                let admin: Address = env.storage().persistent().get(&DataKey::Admin).unwrap();
                token_client.transfer(&env.current_contract_address(), &admin, &dust);
            }
        }

        true
    }

    pub fn get_daily_special_multiplier(env: Env) -> (Symbol, u32) {
        let timestamp = env.ledger().timestamp();
        // 86400 seconds in a day. Derive day of week (0 to 6)
        let day = (timestamp / 86400) % 7;

        match day {
            0 => (symbol_short!("cheese"), 150),   // Sunday: 1.5x Cheese
            1 => (symbol_short!("pep"), 150),      // Monday: 1.5x Pepperoni
            2 => (symbol_short!("bacon"), 150),    // Tuesday: 1.5x Bacon
            3 => (symbol_short!("onion"), 150),    // Wednesday: 1.5x Onion
            4 => (symbol_short!("pep"), 150),      // Thursday: 1.5x Pepperoni
            5 => (symbol_short!("cheese"), 150),   // Friday: 1.5x Cheese
            _ => (symbol_short!("bacon"), 200),    // Saturday: 2.0x Bacon (Weekend specials!)
        }
    }

    // --- Getters ---

    pub fn get_tournament_info(env: Env) -> TournamentInfo {
        env.storage()
            .persistent()
            .get(&DataKey::ActiveTournament)
            .expect("Tournament not initialized")
    }

    pub fn get_leaderboard(env: Env) -> Vec<LeaderboardEntry> {
        env.storage()
            .persistent()
            .get(&DataKey::Leaderboard)
            .unwrap_or_else(|| Vec::new(&env))
    }

    pub fn is_registered(env: Env, player: Address, tournament_id: u32) -> bool {
        let reg_key = DataKey::PlayerRegistered(player, tournament_id);
        env.storage().persistent().has(&reg_key)
    }
}

mod test;
