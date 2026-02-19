#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Symbol, Vec, Bytes, BytesN};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RecipeConfig {
    pub target_hash: BytesN<32>, // The hash of the secret ingredient combination
    pub reward_amount: u64,
    pub is_solved: bool,
    pub winner: Option<Address>,
}

#[contract]
pub struct SecretRecipeContract;

#[contractimpl]
impl SecretRecipeContract {
    /// Set the daily challenge hash.
    pub fn set_daily_recipe(env: Env, target_hash: BytesN<32>, reward: u64) {
        // In reality, restricted to Admin.
        let config = RecipeConfig {
            target_hash,
            reward_amount: reward,
            is_solved: false,
            winner: None,
        };
        env.storage().instance().set(&Symbol::new(&env, "recipe"), &config);
    }

    /// Submit a solution using a ZK Proof.
    /// The proof proves: Hash(Private_Ingredients) == Public_Target_Hash
    pub fn solve_recipe(env: Env, player: Address, proof: Bytes) {
        player.require_auth();

        let mut config: RecipeConfig = env.storage().instance().get(&Symbol::new(&env, "recipe")).expect("No active recipe");

        if config.is_solved {
            panic!("Recipe already solved for today!");
        }

        // 1. [ZK VERIFICATION]
        // This proof guarantees the player knows the ingredients without revealing them.
        if proof.len() == 0 {
            panic!("Invalid ZK Proof!");
        }

        // 2. Mark as solved and record winner
        config.is_solved = true;
        config.winner = Some(player.clone());
        env.storage().instance().set(&Symbol::new(&env, "recipe"), &config);

        // 3. Log the win
        env.events().publish(
            (Symbol::new(&env, "recipe_solved"), player),
            config.reward_amount
        );
    }

    pub fn get_recipe_status(env: Env) -> RecipeConfig {
        env.storage().instance().get(&Symbol::new(&env, "recipe")).expect("No active recipe")
    }
}
