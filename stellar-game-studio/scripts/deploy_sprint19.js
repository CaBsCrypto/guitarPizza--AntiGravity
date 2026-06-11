import { Keypair } from '@stellar/stellar-sdk';
import { execSync } from 'child_process';
import fs from 'fs';

console.log("🚀 Running Sprint 19 Deployment & Configuration Script (v2)...\n");

const NETWORK = 'testnet';
const RPC_URL = 'https://soroban-testnet.stellar.org';
const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015';

// Dev keys (using player1 as admin/sponsor)
const sponsorSecret = 'SBL476C4C7ZTSWUWWNPFNCFWEW2JIPPWJMZMTCI3QZFVSRQWSTQDVIFN';
const sponsorKeypair = Keypair.fromSecret(sponsorSecret);
const adminAddress = sponsorKeypair.publicKey();
const adminSecret = sponsorSecret;

const player2Secret = 'SDJARY5LVGCPOY74IXZLQTIW6MJOOYAJFS5RANFPCNQMZCELBFCM2R7B';
const player2Keypair = Keypair.fromSecret(player2Secret);
const player2Address = player2Keypair.publicKey();

console.log(`Admin/Deployer Address: ${adminAddress}`);
console.log(`Player2 Address: ${player2Address}`);

const run = (cmd) => {
  console.log(`Running: ${cmd}`);
  return execSync(cmd, { encoding: 'utf-8' }).trim();
};

try {
  // 1. Deploy mock-game-hub
  console.log('\n--- 1. Deploying mock-game-hub ---');
  const mockHubId = run(`stellar contract deploy --wasm target\\wasm32v1-none\\release\\mock_game_hub.wasm --source-account ${adminSecret} --network ${NETWORK}`);
  console.log(`mock-game-hub ID: ${mockHubId}`);

  // 2. Deploy guitar-pizza
  console.log('\n--- 2. Deploying guitar-pizza ---');
  const guitarPizzaId = run(`stellar contract deploy --wasm target\\wasm32v1-none\\release\\guitar_pizza.wasm --source-account ${adminSecret} --network ${NETWORK} -- --admin ${adminAddress} --game-hub ${mockHubId}`);
  console.log(`guitar-pizza ID: ${guitarPizzaId}`);

  // 3. Deploy zk-leaderboard
  console.log('\n--- 3. Deploying zk-leaderboard ---');
  const zkLeaderboardId = run(`stellar contract deploy --wasm target\\wasm32v1-none\\release\\zk_leaderboard.wasm --source-account ${adminSecret} --network ${NETWORK} -- --admin ${adminAddress} --game-hub ${mockHubId}`);
  console.log(`zk-leaderboard ID: ${zkLeaderboardId}`);

  // 4. Deploy slice-token
  console.log('\n--- 4. Deploying slice-token ---');
  const sliceTokenId = run(`stellar contract deploy --wasm target\\wasm32v1-none\\release\\slice_token.wasm --source-account ${adminSecret} --network ${NETWORK} -- --admin ${adminAddress} --minter ${guitarPizzaId}`);
  console.log(`slice-token ID: ${sliceTokenId}`);

  // 5. Deploy staking-vault
  console.log('\n--- 5. Deploying staking-vault ---');
  const stakingVaultId = run(`stellar contract deploy --wasm target\\wasm32v1-none\\release\\staking_vault.wasm --source-account ${adminSecret} --network ${NETWORK}`);
  console.log(`staking-vault ID: ${stakingVaultId}`);

  // 6. Initialize Staking Vault
  console.log('\n--- 6. Initializing Staking Vault ---');
  const cheeseToken = 'CBFQYO2ML6ITTZLO46Z6WXUCOV4FLCRYHUBLC7RLERF5OM2G4Q324UGM';
  const pepperoniToken = 'CBE5ZVJPGYORQYZ5ZCLBGKX2HUQVCL2HKGR2T5D4SLFGS73VJYVLPNUW';
  const baconToken = 'CB4DPSEWXQJHVLIZ3GABBAWNLMKKNZND3KIXPVGAXT6A63DPQMHDK3U5';
  const onionToken = 'CBUE7F2FEVMUH4AX5VJ777EOXN7QCIQEIDZ36622YGLYSOCE6IRXCQEU';
  run(`stellar contract invoke --id ${stakingVaultId} --source-account ${adminSecret} --network ${NETWORK} -- initialize --slice ${sliceTokenId} --cheese ${cheeseToken} --pepperoni ${pepperoniToken} --bacon ${baconToken} --onion ${onionToken}`);
  console.log('Staking Vault initialized successfully!');

  // 7. Deploy pvp-escrow
  console.log('\n--- 7. Deploying pvp-escrow ---');
  const pvpEscrowId = run(`stellar contract deploy --wasm target\\wasm32v1-none\\release\\pvp_escrow.wasm --source-account ${adminSecret} --network ${NETWORK}`);
  console.log(`pvp-escrow ID: ${pvpEscrowId}`);

  // 8. Initialize PvP Escrow
  console.log('\n--- 8. Initializing PvP Escrow ---');
  run(`stellar contract invoke --id ${pvpEscrowId} --source-account ${adminSecret} --network ${NETWORK} -- initialize --admin ${adminAddress} --slice_token ${sliceTokenId}`);
  console.log('PvP Escrow initialized successfully!');

  // 8.5. Deploy Refrigerator Vault
  console.log('\n--- 8.5. Deploying Refrigerator Vault ---');
  const refrigeratorVaultId = run(`stellar contract deploy --wasm target\\wasm32v1-none\\release\\refrigerator_vault.wasm --source-account ${adminSecret} --network ${NETWORK}`);
  console.log(`refrigerator-vault ID: ${refrigeratorVaultId}`);

  // 8.6. Initialize Refrigerator Vault
  console.log('\n--- 8.6. Initializing Refrigerator Vault ---');
  run(`stellar contract invoke --id ${refrigeratorVaultId} --source-account ${adminSecret} --network ${NETWORK} -- initialize --admin ${adminAddress} --slice_token ${sliceTokenId}`);
  console.log('Refrigerator Vault initialized successfully!');

  // 8.7. Deploy Tournaments
  console.log('\n--- 8.7. Deploying Tournaments ---');
  const tournamentsId = run(`stellar contract deploy --wasm target\\wasm32v1-none\\release\\tournaments.wasm --source-account ${adminSecret} --network ${NETWORK}`);
  console.log(`tournaments ID: ${tournamentsId}`);

  // 8.8. Initialize Tournaments
  console.log('\n--- 8.8. Initializing Tournaments ---');
  // Wager fee: 10 SLICE = 100_000_000 raw. Duration: 7 days = 604800 sec.
  run(`stellar contract invoke --id ${tournamentsId} --source-account ${adminSecret} --network ${NETWORK} -- initialize --admin ${adminAddress} --slice_token ${sliceTokenId} --wager_fee 100000000 --duration 604800`);
  run(`stellar contract invoke --id ${tournamentsId} --source-account ${adminSecret} --network ${NETWORK} -- set_staking_vault --address ${stakingVaultId}`);
  console.log('Tournaments contract initialized and linked successfully!');

  // 9. Deploy RISC Zero Verifier
  console.log('\n--- 9. Deploying RISC Zero Verifier ---');
  const risc0VerifierId = run(`stellar contract deploy --wasm target\\wasm32v1-none\\release\\risc0_verifier.wasm --source-account ${adminSecret} --network ${NETWORK}`);
  console.log(`risc0-verifier ID: ${risc0VerifierId}`);

  // 9.1. Initialize RISC Zero Verifier
  console.log('\n--- 9.1. Initializing RISC Zero Verifier ---');
  run(`stellar contract invoke --id ${risc0VerifierId} --source-account ${adminSecret} --network ${NETWORK} -- initialize --admin ${adminAddress}`);
  console.log('RISC Zero Verifier initialized successfully!');

  // 9.2. Configure Guitar Pizza to link to $SLICE and RISC Zero Verifier
  console.log('\n--- 9.2. Configuring Guitar Pizza ---');
  run(`stellar contract invoke --id ${guitarPizzaId} --source-account ${adminSecret} --network ${NETWORK} -- set_slice_token --slice_token ${sliceTokenId}`);
  run(`stellar contract invoke --id ${guitarPizzaId} --source-account ${adminSecret} --network ${NETWORK} -- set_slice_config --slice_per_win 1`);
  // image_id = 32 bytes placeholder (all 1s)
  const placeholderImageId = '0101010101010101010101010101010101010101010101010101010101010101';
  run(`stellar contract invoke --id ${guitarPizzaId} --source-account ${adminSecret} --network ${NETWORK} -- set_verifier --verifier ${risc0VerifierId} --image_id ${placeholderImageId}`);
  console.log('Guitar Pizza configured successfully!');

  // 9.3. Configure zk-leaderboard to link to RISC Zero Verifier
  console.log('\n--- 9.3. Configuring zk-leaderboard ---');
  run(`stellar contract invoke --id ${zkLeaderboardId} --source-account ${adminSecret} --network ${NETWORK} -- set_verifier --verifier ${risc0VerifierId} --image_id ${placeholderImageId}`);
  console.log('zk-leaderboard configured successfully!');

  // 9.4. Deploy pizza-baking
  console.log('\n--- 9.4. Deploying pizza-baking ---');
  const pizzaBakingId = run(`stellar contract deploy --wasm target\\wasm32v1-none\\release\\pizza_baking.wasm --source-account ${adminSecret} --network ${NETWORK}`);
  console.log(`pizza-baking ID: ${pizzaBakingId}`);

  // 9.5. Initialize pizza-baking
  console.log('\n--- 9.5. Initializing pizza-baking ---');
  const nftContractId = 'CBC3AGOZTWKEII45VBRWLOGMBNGBJ6ABPP6MOFAZM2HFHP2NKPXXEWXB';
  run(`stellar contract invoke --id ${pizzaBakingId} --source-account ${adminSecret} --network ${NETWORK} -- initialize --admin ${adminAddress} --slice_token ${sliceTokenId} --nft_contract ${nftContractId}`);
  run(`stellar contract invoke --id ${pizzaBakingId} --source-account ${adminSecret} --network ${NETWORK} -- set_ingredients --cheese ${cheeseToken} --pepperoni ${pepperoniToken} --bacon ${baconToken} --onion ${onionToken}`);
  console.log('pizza-baking initialized and ingredients configured successfully!');

  // 10. Update deployment.json
  console.log('\n--- 10. Updating deployment.json ---');
  const deploymentInfo = {
    mockGameHubId: mockHubId,
    contracts: {
      "mock-game-hub": mockHubId,
      "guitar-pizza": guitarPizzaId,
      "zk-leaderboard": zkLeaderboardId,
      "slice-token": sliceTokenId,
      "staking-vault": stakingVaultId,
      "pvp-escrow": pvpEscrowId,
      "refrigerator-vault": refrigeratorVaultId,
      "tournaments": tournamentsId,
      "risc0-verifier": risc0VerifierId,
      "pizza-baking": pizzaBakingId
    },
    network: NETWORK,
    rpcUrl: RPC_URL,
    networkPassphrase: NETWORK_PASSPHRASE,
    wallets: {
      admin: adminAddress,
      player1: adminAddress,
      player2: player2Address
    },
    deployedAt: new Date().toISOString()
  };
  fs.writeFileSync('deployment.json', JSON.stringify(deploymentInfo, null, 2) + '\n');
  console.log("deployment.json updated.");

  // 11. Update .env
  console.log('\n--- 11. Updating .env ---');
  const envContent = `# Auto-generated by Node deploy script
VITE_SOROBAN_RPC_URL=${RPC_URL}
VITE_NETWORK_PASSPHRASE=${NETWORK_PASSPHRASE}
VITE_MOCK_GAME_HUB_CONTRACT_ID=${mockHubId}
VITE_GUITAR_PIZZA_CONTRACT_ID=${guitarPizzaId}
VITE_ZK_LEADERBOARD_CONTRACT_ID=${zkLeaderboardId}
VITE_SLICE_TOKEN_CONTRACT_ID=${sliceTokenId}
VITE_STAKING_VAULT_CONTRACT_ID=${stakingVaultId}
VITE_PVP_ESCROW_CONTRACT_ID=${pvpEscrowId}
VITE_REFRIGERATOR_VAULT_CONTRACT_ID=${refrigeratorVaultId}
VITE_TOURNAMENTS_CONTRACT_ID=${tournamentsId}
VITE_RISC0_VERIFIER_CONTRACT_ID=${risc0VerifierId}
VITE_PIZZA_BAKING_CONTRACT_ID=${pizzaBakingId}

# Dev wallet addresses for testing
VITE_DEV_ADMIN_ADDRESS=${adminAddress}
VITE_DEV_PLAYER1_ADDRESS=${adminAddress}
VITE_DEV_PLAYER2_ADDRESS=${player2Address}

# Dev wallet secret keys (WARNING: Never commit this file!)
VITE_DEV_PLAYER1_SECRET=${adminSecret}
VITE_DEV_PLAYER2_SECRET=${player2Secret}
`;
  fs.writeFileSync('.env', envContent + '\n');
  console.log(".env updated.");

  // 12. Update sgs_frontend/src/utils/constants.ts hardcoded values
  console.log('\n--- 12. Updating constants.ts ---');
  const constantsPath = 'sgs_frontend/src/utils/constants.ts';
  let constants = fs.readFileSync(constantsPath, 'utf8');

  // Replace hardcoded values inside TESTNET_CONTRACT_IDS
  constants = constants.replace(/'guitar-pizza':\s*'.*?',?/, `'guitar-pizza':      '${guitarPizzaId}',`);
  constants = constants.replace(/'slice-token':\s*'.*?',?/, `'slice-token':       '${sliceTokenId}',`);
  constants = constants.replace(/'zk-leaderboard':\s*'.*?',?/, `'zk-leaderboard':    '${zkLeaderboardId}',`);
  constants = constants.replace(/'staking-vault':\s*'.*?',?/, `'staking-vault':      '${stakingVaultId}',`);
  constants = constants.replace(/'pvp-escrow':\s*'.*?',?/, `'pvp-escrow':         '${pvpEscrowId}',`);
  constants = constants.replace(/'mock-game-hub':\s*'.*?',?/, `'mock-game-hub':     '${mockHubId}',`);
  constants = constants.replace(/'refrigerator-vault':\s*'.*?',?/, `'refrigerator-vault': '${refrigeratorVaultId}',`);
  constants = constants.replace(/'tournaments':\s*'.*?',?/, `'tournaments':        '${tournamentsId}',`);
  constants = constants.replace(/'risc0-verifier':\s*'.*?',?/, `'risc0-verifier':    '${risc0VerifierId}',`);
  constants = constants.replace(/'pizza-baking':\s*'.*?',?/, `'pizza-baking':       '${pizzaBakingId}',`);

  fs.writeFileSync(constantsPath, constants);
  console.log("constants.ts updated.");

  console.log("\n🎉 Sprint 19 Deployment & Configuration Completed Successfully!");

} catch (err) {
  console.error("❌ Deployment failed:", err);
  process.exit(1);
}
