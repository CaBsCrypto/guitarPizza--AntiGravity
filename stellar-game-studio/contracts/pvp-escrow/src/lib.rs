#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env};

#[derive(Clone)]
#[contracttype]
pub struct MatchInfo {
    pub player_a: Address,
    pub player_b: Option<Address>,
    pub wager: i128,
    pub status: u32, // 0 = Created, 1 = Active, 2 = Resolved
    pub winner: Option<Address>,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    SliceToken,
    NextMatchId,
    Match(u64),
    Initialized,
}

#[contract]
pub struct PvpEscrow;

#[contractimpl]
impl PvpEscrow {
    pub fn initialize(env: Env, admin: Address, slice_token: Address) {
        if env.storage().persistent().has(&DataKey::Initialized) {
            panic!("Already initialized");
        }
        env.storage().persistent().set(&DataKey::Admin, &admin);
        env.storage().persistent().set(&DataKey::SliceToken, &slice_token);
        env.storage().persistent().set(&DataKey::NextMatchId, &1u64);
        env.storage().persistent().set(&DataKey::Initialized, &true);
    }

    pub fn create_match(env: Env, player_a: Address, wager: i128) -> u64 {
        player_a.require_auth();
        if wager <= 0 {
            panic!("Wager must be positive");
        }

        let slice_token: Address = env.storage().persistent().get(&DataKey::SliceToken).unwrap();
        let slice_client = token::Client::new(&env, &slice_token);

        // Lock player A's wager in the contract
        slice_client.transfer(&player_a, &env.current_contract_address(), &wager);

        let match_id_key = DataKey::NextMatchId;
        let match_id: u64 = env.storage().persistent().get(&match_id_key).unwrap_or(1);
        env.storage().persistent().set(&match_id_key, &(match_id + 1));

        let match_info = MatchInfo {
            player_a,
            player_b: None,
            wager,
            status: 0, // Created
            winner: None,
        };

        env.storage().persistent().set(&DataKey::Match(match_id), &match_info);
        match_id
    }

    pub fn join_match(env: Env, player_b: Address, match_id: u64) {
        player_b.require_auth();

        let match_key = DataKey::Match(match_id);
        if !env.storage().persistent().has(&match_key) {
            panic!("Match not found");
        }

        let mut match_info: MatchInfo = env.storage().persistent().get(&match_key).unwrap();
        if match_info.status != 0 {
            panic!("Match is not open for joining");
        }

        if match_info.player_a == player_b {
            panic!("Cannot play against yourself");
        }

        let slice_token: Address = env.storage().persistent().get(&DataKey::SliceToken).unwrap();
        let slice_client = token::Client::new(&env, &slice_token);

        // Lock player B's wager in the contract (must match player A's wager amount)
        slice_client.transfer(&player_b, &env.current_contract_address(), &match_info.wager);

        match_info.player_b = Some(player_b);
        match_info.status = 1; // Active

        env.storage().persistent().set(&match_key, &match_info);
    }

    pub fn resolve_match(env: Env, match_id: u64, winner: Address) {
        let admin: Address = env.storage().persistent().get(&DataKey::Admin).unwrap();
        admin.require_auth(); // Only admin / server can resolve matches with validated ZK-proofs

        let match_key = DataKey::Match(match_id);
        if !env.storage().persistent().has(&match_key) {
            panic!("Match not found");
        }

        let mut match_info: MatchInfo = env.storage().persistent().get(&match_key).unwrap();
        if match_info.status != 1 {
            panic!("Match is not active");
        }

        let player_b_addr = match_info.player_b.clone().unwrap();
        if winner != match_info.player_a && winner != player_b_addr {
            panic!("Winner must be a player in this match");
        }

        let total_pool = match_info.wager * 2;
        
        // Fee calculation: 5% fee for PizzaDAO treasury
        let fee = total_pool * 5 / 100;
        let winner_share = total_pool - fee;

        let slice_token: Address = env.storage().persistent().get(&DataKey::SliceToken).unwrap();
        let slice_client = token::Client::new(&env, &slice_token);

        // Disburse winner share
        slice_client.transfer(&env.current_contract_address(), &winner, &winner_share);
        
        // Disburse fee to admin treasury
        if fee > 0 {
            slice_client.transfer(&env.current_contract_address(), &admin, &fee);
        }

        match_info.status = 2; // Resolved
        match_info.winner = Some(winner);

        env.storage().persistent().set(&match_key, &match_info);
    }

    pub fn get_match(env: Env, match_id: u64) -> Option<MatchInfo> {
        let match_key = DataKey::Match(match_id);
        if env.storage().persistent().has(&match_key) {
            Some(env.storage().persistent().get(&match_key).unwrap())
        } else {
            None
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address, Env};

    #[test]
    fn test_pvp_flow() {
        let env = Env::default();
        env.mock_all_auths();

        let admin = Address::generate(&env);
        let player_a = Address::generate(&env);
        let player_b = Address::generate(&env);

        // 1. Deploy mock token
        let slice_token_addr = env.register_stellar_asset_contract(admin.clone());
        let slice_admin = token::StellarAssetClient::new(&env, &slice_token_addr);
        let slice_client = token::Client::new(&env, &slice_token_addr);

        // Mint starting balance to players
        slice_admin.mint(&player_a, &100);
        slice_admin.mint(&player_b, &100);

        // 2. Deploy PVP Escrow
        let escrow_id = env.register(PvpEscrow, ());
        let escrow_client = PvpEscrowClient::new(&env, &escrow_id);

        escrow_client.initialize(&admin, &slice_token_addr);

        // 3. Player A creates match (wager 10 $SLICE)
        let match_id = escrow_client.create_match(&player_a, &10);
        assert_eq!(match_id, 1);
        assert_eq!(slice_client.balance(&player_a), 90);
        assert_eq!(slice_client.balance(&escrow_id), 10);

        let match_info = escrow_client.get_match(&match_id).unwrap();
        assert_eq!(match_info.wager, 10);
        assert_eq!(match_info.status, 0); // Created

        // 4. Player B joins match
        escrow_client.join_match(&player_b, &match_id);
        assert_eq!(slice_client.balance(&player_b), 90);
        assert_eq!(slice_client.balance(&escrow_id), 20); // total 20 $SLICE locked

        let active_info = escrow_client.get_match(&match_id).unwrap();
        assert_eq!(active_info.status, 1); // Active
        assert_eq!(active_info.player_b.unwrap(), player_b);

        // 5. Admin resolves match (Winner: Player B)
        // Pool = 20. Fee = 5% = 1. Winner share = 19.
        escrow_client.resolve_match(&match_id, &player_b);
        assert_eq!(slice_client.balance(&player_b), 109); // 90 + 19 = 109
        assert_eq!(slice_client.balance(&admin), 1); // 1 $SLICE fee
        assert_eq!(slice_client.balance(&escrow_id), 0);

        let resolved_info = escrow_client.get_match(&match_id).unwrap();
        assert_eq!(resolved_info.status, 2); // Resolved
        assert_eq!(resolved_info.winner.unwrap(), player_b);
    }
}
