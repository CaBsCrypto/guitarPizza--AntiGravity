#![cfg(test)]
extern crate std;
use super::*;
use soroban_sdk::{testutils::{Address as _, Events}, Env, Symbol, Bytes, BytesN};

#[test]
fn test_solve_recipe() {
    let env = Env::default();
    let contract_id = env.register_contract(None, SecretRecipeContract);
    let client = SecretRecipeContractClient::new(&env, &contract_id);

    let player = Address::generate(&env);
    let target_hash = BytesN::from_array(&env, &[1u8; 32]);
    let reward = 1000;

    // 1. Setup Daily Recipe
    client.set_daily_recipe(&target_hash, &reward);

    // 2. Check initial status
    let status = client.get_recipe_status();
    assert_eq!(status.is_solved, false);
    assert_eq!(status.target_hash, target_hash);
    assert_eq!(status.reward_amount, reward);

    // 3. Solve with valid proof (mock)
    let proof = Bytes::from_array(&env, &[1, 2, 3]);
    client.solve_recipe(&player, &proof);

    // 4. Verify completion
    let status = client.get_recipe_status();
    assert_eq!(status.is_solved, true);
    assert_eq!(status.winner, Some(player.clone()));

    // 5. Try to solve again (should fail)
    let result = client.try_solve_recipe(&player, &proof);
    assert!(result.is_err());
}

#[test]
#[should_panic(expected = "Invalid ZK Proof!")]
fn test_solve_invalid_proof() {
    let env = Env::default();
    let contract_id = env.register_contract(None, SecretRecipeContract);
    let client = SecretRecipeContractClient::new(&env, &contract_id);

    let player = Address::generate(&env);
    client.set_daily_recipe(&BytesN::from_array(&env, &[0u8; 32]), &500);

    // Solve with empty proof
    client.solve_recipe(&player, &Bytes::new(&env));
}
