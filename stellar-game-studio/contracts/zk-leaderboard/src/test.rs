#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::Address as _,
    Address, Bytes, Env,
};

fn deploy(env: &Env) -> (ZkLeaderboardClient<'_>, Address, Address) {
    let admin = Address::generate(env);
    let trusted_game = Address::generate(env);
    let cid = env.register(ZkLeaderboard, (&admin, &trusted_game));
    (ZkLeaderboardClient::new(env, &cid), admin, trusted_game)
}

fn make_receipt(
    env: &Env,
    player: &Address,
    level_id: u32,
    score: u64,
    perfect_hits: u32,
    pizzas_completed: u32,
) -> Bytes {
    let mut j = [0u8; 100];
    j[0..4].copy_from_slice(&level_id.to_be_bytes());
    j[4..8].copy_from_slice(&(score as u32).to_be_bytes());
    j[40..44].copy_from_slice(&perfect_hits.to_be_bytes());
    j[60..64].copy_from_slice(&pizzas_completed.to_be_bytes());
    
    // Hash player address string
    let hash: BytesN<32> = env.crypto().keccak256(&player.to_string().to_bytes()).into();
    j[64..96].copy_from_slice(&hash.to_array());
    
    let mut r = Bytes::from_slice(env, &j);
    
    // Generate valid seal: keccak256 of the journal
    let seal_hash = env.crypto().keccak256(&r);
    r.append(&seal_hash.into());
    // Append another 32 bytes of zero to make the seal 64 bytes total
    r.append(&Bytes::from_slice(env, &[0u8; 32]));
    r
}

#[test]
fn test_constructor() {
    let env = Env::default();
    let (client, admin, trusted_game) = deploy(&env);

    assert_eq!(client.get_admin(), Some(admin));
    assert_eq!(client.get_trusted_game(), Some(trusted_game));
    assert_eq!(client.get_epoch(&1), 0);
}

#[test]
fn test_submit_score_trusted_game() {
    let env = Env::default();
    env.mock_all_auths();
    let (client, _, trusted_game) = deploy(&env);

    let player = Address::generate(&env);
    let level_id = 1;
    let score = 8500u64;
    let perfect_hits = 15;
    let pizzas_completed = 3;
    let empty_receipt = Bytes::new(&env); // Trusted caller doesn't need standalone verification

    // Submit as trusted game contract
    let rank = client.submit_score(
        &trusted_game,
        &player,
        &level_id,
        &score,
        &perfect_hits,
        &pizzas_completed,
        &empty_receipt,
    );

    assert_eq!(rank, 1);

    // Verify personal best
    let pb = client.get_personal_best(&player, &level_id).unwrap();
    assert_eq!(pb.player, player);
    assert_eq!(pb.score, score);
    assert_eq!(pb.perfect_hits, perfect_hits);
    assert_eq!(pb.pizzas_completed, pizzas_completed);

    // Verify board contents
    let board = client.get_leaderboard(&level_id);
    assert_eq!(board.len(), 1);
    assert_eq!(board.get(0).unwrap().player, player);
    assert_eq!(board.get(0).unwrap().score, score);
}

#[test]
fn test_submit_score_untrusted_valid_receipt() {
    let env = Env::default();
    env.mock_all_auths();
    let (client, _, _) = deploy(&env);

    let player = Address::generate(&env);
    let level_id = 1;
    let score = 9000u64;
    let perfect_hits = 25;
    let pizzas_completed = 5;
    
    // Standalone verification checks: construct valid cryptographic receipt
    let valid_receipt = make_receipt(&env, &player, level_id, score, perfect_hits, pizzas_completed);

    // Submit score directly as player (untrusted caller)
    let rank = client.submit_score(
        &player, // caller = player
        &player, // player record
        &level_id,
        &score,
        &perfect_hits,
        &pizzas_completed,
        &valid_receipt,
    );

    assert_eq!(rank, 1);

    // Verify board updated
    let board = client.get_leaderboard(&level_id);
    assert_eq!(board.len(), 1);
    assert_eq!(board.get(0).unwrap().score, score);
}

#[test]
fn test_submit_score_untrusted_invalid_receipt() {
    let env = Env::default();
    env.mock_all_auths();
    let (client, _, _) = deploy(&env);

    let player = Address::generate(&env);
    let level_id = 1;
    let score = 9000u64;
    let perfect_hits = 25;
    let pizzas_completed = 5;
    
    // Invalid receipt: too short (len < 64)
    let invalid_receipt = Bytes::from_slice(&env, &[0u8; 63]);

    // Submit score directly as player - should return InvalidReceipt error
    let result = client.try_submit_score(
        &player,
        &player,
        &level_id,
        &score,
        &perfect_hits,
        &pizzas_completed,
        &invalid_receipt,
    );

    assert!(result.is_err());
    let err = result.err().unwrap();
    // Verify it is Error::InvalidReceipt which has representation 3
    assert_eq!(err, Ok(Error::InvalidReceipt));
}

#[test]
fn test_leaderboard_sorting_and_capping() {
    let env = Env::default();
    env.mock_all_auths();
    let (client, _, trusted_game) = deploy(&env);

    let level_id = 1;
    let empty_receipt = Bytes::new(&env);

    // Submit 12 scores from different players
    for i in 1..=12 {
        let player = Address::generate(&env);
        let score = (i * 1000) as u64; // Scores: 1000, 2000, ..., 12000
        client.submit_score(
            &trusted_game,
            &player,
            &level_id,
            &score,
            &0,
            &0,
            &empty_receipt,
        );
    }

    // Leaderboard must be capped at exactly 10 entries
    let board = client.get_leaderboard(&level_id);
    assert_eq!(board.len(), 10);

    // Leaderboard must be sorted in descending order (highest score first)
    // Top score should be 12000 (from player 12), lowest should be 3000 (from player 3)
    assert_eq!(board.get(0).unwrap().score, 12000);
    assert_eq!(board.get(9).unwrap().score, 3000);
}

#[test]
fn test_leaderboard_updates_existing_player() {
    let env = Env::default();
    env.mock_all_auths();
    let (client, _, trusted_game) = deploy(&env);

    let player = Address::generate(&env);
    let level_id = 1;
    let empty_receipt = Bytes::new(&env);

    // Submit initial low score
    client.submit_score(
        &trusted_game,
        &player,
        &level_id,
        &5000u64,
        &10,
        &2,
        &empty_receipt,
    );

    // Submit higher score
    client.submit_score(
        &trusted_game,
        &player,
        &level_id,
        &7500u64,
        &20,
        &4,
        &empty_receipt,
    );

    // Leaderboard should have exactly 1 entry for this player with the updated high score
    let board = client.get_leaderboard(&level_id);
    assert_eq!(board.len(), 1);
    assert_eq!(board.get(0).unwrap().score, 7500);

    // Submit a lower score - should NOT update high score on board
    client.submit_score(
        &trusted_game,
        &player,
        &level_id,
        &4000u64,
        &5,
        &1,
        &empty_receipt,
    );

    let board2 = client.get_leaderboard(&level_id);
    assert_eq!(board2.len(), 1);
    assert_eq!(board2.get(0).unwrap().score, 7500);
}

#[test]
fn test_admin_reset_leaderboard() {
    let env = Env::default();
    env.mock_all_auths();
    let (client, _admin, trusted_game) = deploy(&env);

    let player = Address::generate(&env);
    let level_id = 1;
    let empty_receipt = Bytes::new(&env);

    client.submit_score(
        &trusted_game,
        &player,
        &level_id,
        &5000u64,
        &10,
        &2,
        &empty_receipt,
    );

    // Reset board as admin
    assert_eq!(client.get_epoch(&level_id), 0);
    client.reset_leaderboard(&level_id);

    // Board must be empty and epoch incremented
    let board = client.get_leaderboard(&level_id);
    assert_eq!(board.len(), 0);
    assert_eq!(client.get_epoch(&level_id), 1);
}

#[test]
fn test_admin_auth_setters() {
    let env = Env::default();
    env.mock_all_auths();
    let (client, _admin, _) = deploy(&env);

    let new_admin = Address::generate(&env);
    let new_trusted_game = Address::generate(&env);

    // Set new trusted game and admin using admin auth
    client.set_trusted_game(&new_trusted_game);
    client.set_admin(&new_admin);

    assert_eq!(client.get_admin(), Some(new_admin));
    assert_eq!(client.get_trusted_game(), Some(new_trusted_game));
}

mod mock_verifier_impl {
    use soroban_sdk::{contract, contractimpl, Bytes, BytesN, Env};
    #[contract]
    pub struct MockVerifier;
    #[contractimpl]
    impl MockVerifier {
        pub fn verify(
            env: Env,
            journal: Bytes,
            _image_id: BytesN<32>,
            seal: Bytes,
        ) {
            let expected_hash: Bytes = env.crypto().keccak256(&journal).into();
            let seal_hash = seal.slice(0..32);
            if seal_hash != expected_hash {
                panic!("invalid proof");
            }
        }
    }
}
use mock_verifier_impl::MockVerifier;

#[test]
fn test_verifier_integration() {
    let env = Env::default();
    env.mock_all_auths();
    let (client, _, _) = deploy(&env);

    let player = Address::generate(&env);
    let level_id = 1;
    let score = 9000u64;
    let perfect_hits = 25;
    let pizzas_completed = 5;

    let verifier_id = env.register(MockVerifier, ());
    let image_id = BytesN::from_array(&env, &[1u8; 32]);

    client.set_verifier(&verifier_id, &image_id);

    assert_eq!(client.get_verifier(), Some(verifier_id.clone()));
    assert_eq!(client.get_image_id(), Some(image_id.clone()));

    // Submit with a valid receipt (matches mock verifier's keccak256 check)
    let valid_receipt = make_receipt(&env, &player, level_id, score, perfect_hits, pizzas_completed);
    let rank = client.submit_score(
        &player,
        &player,
        &level_id,
        &score,
        &perfect_hits,
        &pizzas_completed,
        &valid_receipt,
    );
    assert_eq!(rank, 1);

    // Submit with an invalid receipt (which the mock verifier will reject)
    let mut bad_receipt = make_receipt(&env, &player, level_id, score, perfect_hits, pizzas_completed);
    bad_receipt.set(100, 0); // corrupt seal
    
    let result = client.try_submit_score(
        &player,
        &player,
        &level_id,
        &score,
        &perfect_hits,
        &pizzas_completed,
        &bad_receipt,
    );
    assert!(result.is_err());
}
