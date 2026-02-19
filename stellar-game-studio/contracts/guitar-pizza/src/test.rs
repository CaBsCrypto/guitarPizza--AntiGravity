#![cfg(test)]
extern crate std;
use super::*;
use soroban_sdk::{testutils::{Address as _, Events}, Env, Symbol, Bytes, BytesN};

#[test]
fn test_submit_verified_score() {
    let env = Env::default();
    let contract_id = env.register_contract(None, LevelContract);
    let client = LevelContractClient::new(&env, &contract_id);

    let player = Address::generate(&env);
    let song_hash = BytesN::from_array(&env, &[0u8; 32]);
    let level_id = 1;

    // 1. Setup Level
    client.set_level_config(&level_id, &song_hash);

    // 2. Submit a verified score
    let proof = Bytes::from_array(&env, &[1, 2, 3]); // Mock proof
    client.submit_verified_score(&player, &level_id, &5000, &proof);

    // 3. Verify Stats
    let stats = client.get_level_stats(&level_id);
    assert_eq!(stats.total_plays, 1);
    assert_eq!(stats.total_score, 5000);
    assert_eq!(stats.high_score, 5000);
    assert_eq!(stats.song_hash, song_hash);

    // 4. Test failure with empty proof (simplified verifier logic)
    let empty_proof = Bytes::new(&env);
    let result = client.try_submit_verified_score(&player, &level_id, &6000, &empty_proof);
    assert!(result.is_err());
}
