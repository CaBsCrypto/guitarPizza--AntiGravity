const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();

  console.log("==================================================");
  console.log("🍕 Deploying Rhythm Slice Contracts to Avalanche");
  console.log("   Network:", network.name, "(Chain ID:", network.chainId.toString() + ")");
  console.log("   Deployer Address:", deployer.address);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("   Deployer Balance:", ethers.formatEther(balance), "AVAX");
  console.log("==================================================\n");

  const treasuryAddress = deployer.address; // For testnet, treasury is deployer

  // 1. Deploy SliceToken ($SLICE)
  console.log("1. Deploying SliceToken ($SLICE)...");
  const SliceToken = await ethers.getContractFactory("SliceToken");
  const sliceToken = await SliceToken.deploy(deployer.address);
  await sliceToken.waitForDeployment();
  const sliceTokenAddress = await sliceToken.getAddress();
  console.log("   ✔ SliceToken deployed at:", sliceTokenAddress);

  // 2. Deploy Ingredient Tokens
  console.log("2. Deploying Ingredient Tokens (CHE, PEP, BAC, ONI)...");
  const IngredientToken = await ethers.getContractFactory("IngredientToken");
  
  const cheese = await IngredientToken.deploy("Cheese", "CHE", deployer.address);
  await cheese.waitForDeployment();
  const cheeseAddress = await cheese.getAddress();
  console.log("   ✔ Cheese (CHE) deployed at:", cheeseAddress);

  const pepperoni = await IngredientToken.deploy("Pepperoni", "PEP", deployer.address);
  await pepperoni.waitForDeployment();
  const pepperoniAddress = await pepperoni.getAddress();
  console.log("   ✔ Pepperoni (PEP) deployed at:", pepperoniAddress);

  const bacon = await IngredientToken.deploy("Bacon", "BAC", deployer.address);
  await bacon.waitForDeployment();
  const baconAddress = await bacon.getAddress();
  console.log("   ✔ Bacon (BAC) deployed at:", baconAddress);

  const onion = await IngredientToken.deploy("Onion", "ONI", deployer.address);
  await onion.waitForDeployment();
  const onionAddress = await onion.getAddress();
  console.log("   ✔ Onion (ONI) deployed at:", onionAddress);

  // 3. Deploy OvenNFT (ERC-721)
  console.log("3. Deploying OvenNFT (888 Limited Edition Ovens)...");
  const OvenNFT = await ethers.getContractFactory("OvenNFT");
  const ovenNFT = await OvenNFT.deploy(
    deployer.address,
    "https://rhythmslice.spicycrust.com/api/oven/",
    treasuryAddress,
    500 // 5% royalty
  );
  await ovenNFT.waitForDeployment();
  const ovenNFTAddress = await ovenNFT.getAddress();
  console.log("   ✔ OvenNFT deployed at:", ovenNFTAddress);

  // 4. Deploy StakingVault ("El Horno de la Famiglia")
  console.log("4. Deploying StakingVault...");
  const StakingVault = await ethers.getContractFactory("StakingVault");
  const stakingVault = await StakingVault.deploy(
    sliceTokenAddress,
    ethers.ZeroAddress, // LP Token (can be updated when LP pool is created)
    cheeseAddress,
    pepperoniAddress,
    baconAddress,
    onionAddress,
    deployer.address
  );
  await stakingVault.waitForDeployment();
  const stakingVaultAddress = await stakingVault.getAddress();
  console.log("   ✔ StakingVault deployed at:", stakingVaultAddress);

  // 5. Deploy NeveraVault ("La Nevera")
  console.log("5. Deploying NeveraVault...");
  const NeveraVault = await ethers.getContractFactory("NeveraVault");
  const neveraVault = await NeveraVault.deploy(
    sliceTokenAddress,
    treasuryAddress,
    deployer.address
  );
  await neveraVault.waitForDeployment();
  const neveraVaultAddress = await neveraVault.getAddress();
  console.log("   ✔ NeveraVault deployed at:", neveraVaultAddress);

  // 6. Deploy PizzaBaking ("Timed Baking Dashboard")
  console.log("6. Deploying PizzaBaking...");
  const PizzaBaking = await ethers.getContractFactory("PizzaBaking");
  const pizzaBaking = await PizzaBaking.deploy(
    sliceTokenAddress,
    ovenNFTAddress,
    cheeseAddress,
    pepperoniAddress,
    baconAddress,
    onionAddress,
    deployer.address
  );
  await pizzaBaking.waitForDeployment();
  const pizzaBakingAddress = await pizzaBaking.getAddress();
  console.log("   ✔ PizzaBaking deployed at:", pizzaBakingAddress);

  // 7. Deploy PvPEscrow ("Pizzería Clashes")
  console.log("7. Deploying PvPEscrow...");
  const PvPEscrow = await ethers.getContractFactory("PvPEscrow");
  const pvpEscrow = await PvPEscrow.deploy(
    sliceTokenAddress,
    treasuryAddress,
    deployer.address
  );
  await pvpEscrow.waitForDeployment();
  const pvpEscrowAddress = await pvpEscrow.getAddress();
  console.log("   ✔ PvPEscrow deployed at:", pvpEscrowAddress);

  // ── Role Configuration ────────────────────────────────────────────────────────
  console.log("\n🔑 Setting up contract roles and permissions...");
  const MINTER_ROLE = await sliceToken.MINTER_ROLE();

  // Allow PizzaBaking and deployer to mint $SLICE rewards
  await (await sliceToken.grantRole(MINTER_ROLE, pizzaBakingAddress)).wait();
  console.log("   ✔ SliceToken MINTER_ROLE granted to PizzaBaking");

  // Allow StakingVault to mint ingredients for stakers
  await (await cheese.grantRole(MINTER_ROLE, stakingVaultAddress)).wait();
  await (await pepperoni.grantRole(MINTER_ROLE, stakingVaultAddress)).wait();
  await (await bacon.grantRole(MINTER_ROLE, stakingVaultAddress)).wait();
  await (await onion.grantRole(MINTER_ROLE, stakingVaultAddress)).wait();
  console.log("   ✔ Ingredient MINTER_ROLE granted to StakingVault");

  // ── Export Frontend Configuration ──────────────────────────────────────────
  console.log("\n📦 Generating typed frontend configuration...");

  const contractsData = {
    network: {
      name: network.name === "unknown" ? "Avalanche Fuji Testnet" : network.name,
      chainId: Number(network.chainId),
      rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
      explorerUrl: "https://testnet.snowtrace.io",
    },
    addresses: {
      sliceToken: sliceTokenAddress,
      ovenNFT: ovenNFTAddress,
      stakingVault: stakingVaultAddress,
      neveraVault: neveraVaultAddress,
      pizzaBaking: pizzaBakingAddress,
      pvpEscrow: pvpEscrowAddress,
      ingredients: {
        cheese: cheeseAddress,
        pepperoni: pepperoniAddress,
        bacon: baconAddress,
        onion: onionAddress,
      }
    },
    deployedAt: new Date().toISOString()
  };

  // Extract ABIs from artifacts
  const readAbi = (contractName) => {
    const artifactPath = path.join(__dirname, `../artifacts/src/${contractName}.sol/${contractName.split('/').pop()}.json`);
    const data = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    return data.abi;
  };

  const abis = {
    SliceToken: readAbi("tokens/SliceToken"),
    IngredientToken: readAbi("tokens/IngredientToken"),
    OvenNFT: readAbi("tokens/OvenNFT"),
    StakingVault: readAbi("vaults/StakingVault"),
    NeveraVault: readAbi("vaults/NeveraVault"),
    PizzaBaking: readAbi("vaults/PizzaBaking"),
    PvPEscrow: readAbi("pvp/PvPEscrow")
  };

  const tsContent = `// Auto-generated by contracts-evm/scripts/deploy.js at ${contractsData.deployedAt}
// DO NOT EDIT MANUALLY

export const AVALANCHE_FUJI_CONFIG = ${JSON.stringify(contractsData, null, 2)} as const;

export const AVALANCHE_ABIS = ${JSON.stringify(abis, null, 2)} as const;
`;

  const frontendOutDir = path.join(__dirname, "../../stellar-game-studio/sgs_frontend/src/contracts");
  if (!fs.existsSync(frontendOutDir)) {
    fs.mkdirSync(frontendOutDir, { recursive: true });
  }

  const frontendFilePath = path.join(frontendOutDir, "avalancheContracts.ts");
  fs.writeFileSync(frontendFilePath, tsContent, "utf8");
  console.log("   ✔ Exported configuration to:", frontendFilePath);

  console.log("\n==================================================");
  console.log("🎉 ALL CONTRACTS DEPLOYED & CONFIGURED SUCCESSFULLY!");
  console.log("==================================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
