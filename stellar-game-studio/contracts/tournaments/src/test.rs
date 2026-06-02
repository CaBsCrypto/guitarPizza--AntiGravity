#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::{Address as _, Ledger}, Address, Bytes, Env};

mod mock_staking_vault_impl {
    use soroban_sdk::{contract, contractimpl, Address, Env};
    #[contract]
    pub struct MockStakingVault;
    #[contractimpl]
    impl MockStakingVault {
        pub fn get_stake(_env: Env, _user: Address) -> i128 {
            5000_0000000 // Don tier (10 tickets)
        }
    }
}
use mock_staking_vault_impl::MockStakingVault;

#[test]
fn test_tournaments_full_lifecycle() {
    let env = Env::default();
    env.mock_all_auths();

    // 1. Setup accounts
    let admin = Address::generate(&env);
    let player1 = Address::generate(&env);
    let player2 = Address::generate(&env);
    let player3 = Address::generate(&env);
    let player4 = Address::generate(&env);

    // 2. Setup mock SLICE token
    let slice_token_addr = env.register_stellar_asset_contract(admin.clone());
    let slice_admin = token::StellarAssetClient::new(&env, &slice_token_addr);
    let slice_client = token::Client::new(&env, &slice_token_addr);

    // 3. Register and initialize Tournaments contract
    let tourney_id = env.register(TournamentsContract, ());
    let tourney_client = TournamentsContractClient::new(&env, &tourney_id);

    // Initial config: 10 SLICE fee, 3600 seconds (1 hour) duration
    let wager_fee = 10_0000000; // 10 * 1e7
    let duration = 3600u64;
    tourney_client.initialize(&admin, &slice_token_addr, &wager_fee, &duration);

    // 4. Mint SLICE to players
    slice_admin.mint(&player1, &100_0000000);
    slice_admin.mint(&player2, &100_0000000);
    slice_admin.mint(&player3, &100_0000000);
    slice_admin.mint(&player4, &100_0000000);

    // Verify initial state
    let info = tourney_client.get_tournament_info();
    assert_eq!(info.id, 1);
    assert_eq!(info.is_active, true);
    assert_eq!(info.wager_fee, wager_fee);
    assert_eq!(info.pool, 0);

    // 5. Buy tickets and submit scores
    let mock_receipt = Bytes::new(&env);

    // Player 1 buys 2 tickets (costs 20 SLICE, 50% split -> 10 to pool, 10 to admin treasury)
    tourney_client.buy_tickets(&player1, &2);
    assert_eq!(tourney_client.get_tickets(&player1), 2);
    assert_eq!(slice_client.balance(&player1), 80_0000000);
    assert_eq!(tourney_client.get_tournament_info().pool, 10_0000000);

    // Player 1 submits (9500 score) - registers and consumes 1 ticket
    tourney_client.submit_tournament_score(&player1, &9500, &mock_receipt);
    assert_eq!(tourney_client.get_tickets(&player1), 1);
    assert_eq!(tourney_client.is_registered(&player1, &1), true);

    // Player 1 submits again with higher score (9800) - does not consume ticket again!
    tourney_client.submit_tournament_score(&player1, &9800, &mock_receipt);
    assert_eq!(tourney_client.get_tickets(&player1), 1);

    // Player 2 buys 1 ticket and submits (9200 score) (costs 10 SLICE -> 5 pool, 5 admin)
    tourney_client.buy_tickets(&player2, &1);
    tourney_client.submit_tournament_score(&player2, &9200, &mock_receipt);

    // Player 3 buys 1 ticket and submits (9600 score)
    tourney_client.buy_tickets(&player3, &1);
    tourney_client.submit_tournament_score(&player3, &9600, &mock_receipt);

    // Player 4 buys 1 ticket and submits (8000 score)
    tourney_client.buy_tickets(&player4, &1);
    tourney_client.submit_tournament_score(&player4, &8000, &mock_receipt);

    // Total pool should be 25 SLICE (10 from P1 + 5 from P2 + 5 from P3 + 5 from P4)
    let info_after_submits = tourney_client.get_tournament_info();
    assert_eq!(info_after_submits.pool, 25_0000000);

    // 6. Verify Leaderboard Sorting and Capping (top-3 only)
    let leaderboard = tourney_client.get_leaderboard();
    assert_eq!(leaderboard.len(), 3);

    // 1st place: Player 1 (9800)
    assert_eq!(leaderboard.get(0).unwrap().player, player1);
    assert_eq!(leaderboard.get(0).unwrap().score, 9800);

    // 2nd place: Player 3 (9600)
    assert_eq!(leaderboard.get(1).unwrap().player, player3);
    assert_eq!(leaderboard.get(1).unwrap().score, 9600);

    // 3rd place: Player 2 (9200)
    assert_eq!(leaderboard.get(2).unwrap().player, player2);
    assert_eq!(leaderboard.get(2).unwrap().score, 9200);

    // 7. Verify resolve fails if duration has not elapsed yet
    let result = tourney_client.try_resolve_tournament();
    assert!(result.is_err());

    // 8. Fast-forward ledger clock past duration (duration = 3600 seconds)
    env.ledger().set_timestamp(env.ledger().timestamp() + 3601);

    // Submissions should now fail as tournament is expired
    let result_sub = tourney_client.try_submit_tournament_score(&player1, &9900, &mock_receipt);
    assert!(result_sub.is_err());

    // 9. Resolve tournament autonomously
    tourney_client.resolve_tournament();

    // Verify pool distribution splits:
    // Pool = 25 SLICE.
    // 1st (Player 1 - 60%): 15 SLICE -> Ending balance: 80 + 15 = 95 SLICE
    // 2nd (Player 3 - 30%): 7.5 SLICE -> Ending balance: 90 + 7.5 = 97.5 SLICE
    // 3rd (Player 2 - 10%):  2.5 SLICE -> Ending balance: 90 + 2.5 = 92.5 SLICE
    assert_eq!(slice_client.balance(&player1), 95_0000000);
    assert_eq!(slice_client.balance(&player3), 97_5000000);
    assert_eq!(slice_client.balance(&player2), 92_5000000);
    assert_eq!(slice_client.balance(&tourney_id), 0);

    // 10. Start a new tournament session
    let new_id = tourney_client.start_new_tournament();
    assert_eq!(new_id, 2);

    let info_new = tourney_client.get_tournament_info();
    assert_eq!(info_new.id, 2);
    assert_eq!(info_new.is_active, true);
    assert_eq!(info_new.pool, 0);

    let leaderboard_new = tourney_client.get_leaderboard();
    assert_eq!(leaderboard_new.len(), 0);
}

#[test]
fn test_staking_tickets_claim() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let player = Address::generate(&env);

    let slice_token_addr = env.register_stellar_asset_contract(admin.clone());
    let tourney_id = env.register(TournamentsContract, ());
    let tourney_client = TournamentsContractClient::new(&env, &tourney_id);

    let wager_fee = 10_0000000;
    let duration = 3600u64;
    tourney_client.initialize(&admin, &slice_token_addr, &wager_fee, &duration);

    // Register mock staking vault
    let vault_id = env.register(MockStakingVault, ());
    tourney_client.set_staking_vault(&vault_id);

    // Claim staking tickets: player gets 10 tickets since mock returns 5000 SLICE (Don tier)
    assert_eq!(tourney_client.get_tickets(&player), 0);
    let claimed = tourney_client.claim_staking_tickets(&player);
    assert_eq!(claimed, 10);
    assert_eq!(tourney_client.get_tickets(&player), 10);

    // Trying to claim again in the same tournament should panic
    let result = tourney_client.try_claim_staking_tickets(&player);
    assert!(result.is_err());
}

#[test]
fn test_daily_specials_ledgers() {
    let env = Env::default();
    
    // Set ledger timestamp deterministically
    // Day 0: timestamp = 0 -> day = 0 (Sunday: cheese 1.5x)
    env.ledger().set_timestamp(0);
    let (ing, mult) = TournamentsContract::get_daily_special_multiplier(env.clone());
    assert_eq!(ing, symbol_short!("cheese"));
    assert_eq!(mult, 150);

    // Day 2 (Tuesday: bacon 1.5x) -> 2 days * 86400 seconds = 172800 seconds
    env.ledger().set_timestamp(172800);
    let (ing, mult) = TournamentsContract::get_daily_special_multiplier(env.clone());
    assert_eq!(ing, symbol_short!("bacon"));
    assert_eq!(mult, 150);

    // Day 6 (Saturday: bacon 2.0x weekend special!) -> 6 days * 86400 seconds = 518400 seconds
    env.ledger().set_timestamp(518400);
    let (ing, mult) = TournamentsContract::get_daily_special_multiplier(env.clone());
    assert_eq!(ing, symbol_short!("bacon"));
    assert_eq!(mult, 200);
}

