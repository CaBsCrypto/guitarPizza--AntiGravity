#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env};

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    SliceToken,
    FrozenBalance(Address, Address), // (Player, IngredientTokenAddress)
    Initialized,
}

#[contract]
pub struct RefrigeratorVault;

#[contractimpl]
impl RefrigeratorVault {
    pub fn initialize(env: Env, admin: Address, slice_token: Address) {
        if env.storage().persistent().has(&DataKey::Initialized) {
            panic!("Already initialized");
        }
        env.storage().persistent().set(&DataKey::Admin, &admin);
        env.storage().persistent().set(&DataKey::SliceToken, &slice_token);
        env.storage().persistent().set(&DataKey::Initialized, &true);
    }

    pub fn deposit_ingredients(env: Env, player: Address, token: Address, amount: i128) {
        player.require_auth();
        if amount <= 0 {
            panic!("Amount must be positive");
        }

        // Fee is fixed at 0.5 $SLICE (5_000_000 in 1e7 decimals)
        let fee: i128 = 5_000_000;
        let slice_token: Address = env.storage().persistent().get(&DataKey::SliceToken).unwrap();
        let slice_client = token::Client::new(&env, &slice_token);

        // Split fee: 50% to contract treasury, 50% to admin treasury
        let pool_share = fee / 2;
        let burn_share = fee - pool_share;

        slice_client.transfer(&player, &env.current_contract_address(), &pool_share);
        let admin: Address = env.storage().persistent().get(&DataKey::Admin).unwrap();
        slice_client.transfer(&player, &admin, &burn_share);

        // Transfer ingredient from player to contract
        let ingredient_client = token::Client::new(&env, &token);
        ingredient_client.transfer(&player, &env.current_contract_address(), &amount);

        // Update frozen balance
        let balance_key = DataKey::FrozenBalance(player.clone(), token.clone());
        let current_balance: i128 = env
            .storage()
            .persistent()
            .get(&balance_key)
            .unwrap_or(0);

        env.storage()
            .persistent()
            .set(&balance_key, &(current_balance + amount));
    }

    pub fn withdraw_ingredients(env: Env, player: Address, token: Address, amount: i128) {
        player.require_auth();
        if amount <= 0 {
            panic!("Amount must be positive");
        }

        let balance_key = DataKey::FrozenBalance(player.clone(), token.clone());
        let current_balance: i128 = env
            .storage()
            .persistent()
            .get(&balance_key)
            .unwrap_or(0);

        if current_balance < amount {
            panic!("Insufficient frozen balance");
        }

        // Update balance
        env.storage()
            .persistent()
            .set(&balance_key, &(current_balance - amount));

        // Transfer ingredient back to player
        let ingredient_client = token::Client::new(&env, &token);
        ingredient_client.transfer(&env.current_contract_address(), &player, &amount);
    }

    pub fn get_frozen_balance(env: Env, player: Address, token: Address) -> i128 {
        let balance_key = DataKey::FrozenBalance(player, token);
        env.storage()
            .persistent()
            .get(&balance_key)
            .unwrap_or(0)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address, Env};

    #[test]
    fn test_refrigerator_lifecycle() {
        let env = Env::default();
        env.mock_all_auths();

        let admin = Address::generate(&env);
        let player = Address::generate(&env);

        // 1. Deploy mock tokens
        let slice_token_addr = env.register_stellar_asset_contract(admin.clone());
        let cheese_token_addr = env.register_stellar_asset_contract(admin.clone());

        let slice_admin = token::StellarAssetClient::new(&env, &slice_token_addr);
        let cheese_admin = token::StellarAssetClient::new(&env, &cheese_token_addr);

        let slice_client = token::Client::new(&env, &slice_token_addr);
        let cheese_client = token::Client::new(&env, &cheese_token_addr);

        // Mint balances
        slice_admin.mint(&player, &10_0000000);
        cheese_admin.mint(&player, &100);

        // 2. Register Refrigerator Vault
        let vault_id = env.register(RefrigeratorVault, ());
        let vault_client = RefrigeratorVaultClient::new(&env, &vault_id);

        vault_client.initialize(&admin, &slice_token_addr);

        // 3. Deposit ingredients (takes 0.5 $SLICE fee)
        vault_client.deposit_ingredients(&player, &cheese_token_addr, &10);

        // Verify balance updates
        // 0.5 $SLICE = 5_000_000. 10 $SLICE = 100_000_000. Balance = 95_000_000 (9.5 $SLICE)
        assert_eq!(slice_client.balance(&player), 9_5000000);
        assert_eq!(cheese_client.balance(&player), 90);
        assert_eq!(vault_client.get_frozen_balance(&player, &cheese_token_addr), 10);

        // 4. Withdraw ingredients (no fee)
        vault_client.withdraw_ingredients(&player, &cheese_token_addr, &4);
        assert_eq!(cheese_client.balance(&player), 94);
        assert_eq!(vault_client.get_frozen_balance(&player, &cheese_token_addr), 6);
        assert_eq!(slice_client.balance(&player), 9_5000000); // balance remains 9.5 SLICE
    }
}
