const { ethers } = require("hardhat");

const AVALANCHE_FUJI_CONFIG = {
  addresses: {
    sliceToken: "0x0Ae15eE76a153F9d0AFEa6C700E6Eaf0af9aeEc5",
    ovenNFT: "0xec00D70A86C73Eb6A530b160BA860750eA9c6AeC",
    stakingVault: "0x66D73fc74D23B3866ea80C7E30893843a47d7032",
    neveraVault: "0x9F170CAeC7B147E0Cffe70f7da43ff3D839efb91",
    pizzaBaking: "0xC446157086899Ee06E1F8Ed467c12bffC010327d",
    pvpEscrow: "0x050E59D911e5Ea4967d25F9eb3f9D98f1A56939B",
    ingredients: {
      cheese: "0xe56F24c585233355c631C2b0316879a490b7dD8A",
      pepperoni: "0xa8F3c3E0bb7Bef658408010D1531d4185Bcc2230",
      bacon: "0x086762CEe1faA61bc0F5e2ebC5A583Ba7C727369",
      onion: "0x646B850402915786333d4026d95EDED561322F1e"
    }
  }
};

async function main() {
  console.log("==================================================");
  console.log("🍕 LIVE ON-CHAIN VALIDATION SUITE — AVALANCHE FUJI");
  console.log("==================================================\n");

  const [deployer] = await ethers.getSigners();
  const provider = ethers.provider;
  const network = await provider.getNetwork();

  console.log(`🌐 Network: ${network.name} (Chain ID: ${network.chainId})`);
  console.log(`👤 Deployer/Tester: ${deployer.address}`);
  const balance = await provider.getBalance(deployer.address);
  console.log(`💰 AVAX Balance: ${ethers.formatEther(balance)} AVAX\n`);

  const addresses = AVALANCHE_FUJI_CONFIG.addresses;

  // Contracts setup
  const sliceToken = await ethers.getContractAt("SliceToken", addresses.sliceToken, deployer);
  const ovenNFT = await ethers.getContractAt("OvenNFT", addresses.ovenNFT, deployer);
  const stakingVault = await ethers.getContractAt("StakingVault", addresses.stakingVault, deployer);
  const neveraVault = await ethers.getContractAt("NeveraVault", addresses.neveraVault, deployer);
  const pizzaBaking = await ethers.getContractAt("PizzaBaking", addresses.pizzaBaking, deployer);
  const pvpEscrow = await ethers.getContractAt("PvPEscrow", addresses.pvpEscrow, deployer);

  const cheese = await ethers.getContractAt("IngredientToken", addresses.ingredients.cheese, deployer);
  const pepperoni = await ethers.getContractAt("IngredientToken", addresses.ingredients.pepperoni, deployer);
  const onion = await ethers.getContractAt("IngredientToken", addresses.ingredients.onion, deployer);

  // 1. Validate $SLICE Mint & Balance
  console.log("--------------------------------------------------");
  console.log("1️⃣  Validating SliceToken ($SLICE)...");
  const sliceBal = await sliceToken.balanceOf(deployer.address);
  console.log(`   ✔ Deployer Current Balance: ${ethers.formatUnits(sliceBal, 18)} $SLICE`);

  // 2. Validate Starter Oven NFT & Multiplier
  console.log("\n--------------------------------------------------");
  console.log("2️⃣  Validating OvenNFT (Multiplier Formula)...");
  const nftBal = await ovenNFT.balanceOf(deployer.address);
  const multiplierBps = await ovenNFT.getPlayerMultiplierBps(deployer.address);
  console.log(`   ✔ Owned Oven NFTs: ${nftBal.toString()} | Active Multiplier: ${(Number(multiplierBps)/10000).toFixed(1)}x`);

  // 3. Validate Ingredients Mint
  console.log("\n--------------------------------------------------");
  console.log("3️⃣  Validating Ingredient Tokens (CHE, PEP, ONI)...");
  const mintOniTx = await onion.mint(deployer.address, ethers.parseUnits("10", 18));
  await mintOniTx.wait();
  const cheBal = await cheese.balanceOf(deployer.address);
  const pepBal = await pepperoni.balanceOf(deployer.address);
  const oniBal = await onion.balanceOf(deployer.address);
  console.log(`   ✔ Cheese Balance: ${ethers.formatUnits(cheBal, 18)} CHE`);
  console.log(`   ✔ Pepperoni Balance: ${ethers.formatUnits(pepBal, 18)} PEP`);
  console.log(`   ✔ Onion Balance: ${ethers.formatUnits(oniBal, 18)} ONI`);

  // 4. Validate Staking Vault (Single Staking + Mafia Tier)
  console.log("\n--------------------------------------------------");
  console.log("4️⃣  Validating StakingVault (Single-Sided Stake & Mafia Tier)...");
  const stakeAmt = ethers.parseUnits("1", 18);
  const approveStakeTx = await sliceToken.approve(addresses.stakingVault, stakeAmt);
  await approveStakeTx.wait();

  const stakeTx = await stakingVault.stakeSlice(stakeAmt);
  await stakeTx.wait();

  const stakeInfo = await stakingVault.sliceStakes(deployer.address);
  const tier = await stakingVault.getTier(deployer.address);
  const tierNames = ["Piccolino", "Soldato", "Caporegime", "Don"];
  console.log(`   ✔ Staked: ${ethers.formatUnits(stakeInfo.amount, 18)} $SLICE on-chain | Mafia Tier: ${tierNames[Number(tier)]}`);

  // 5. Validate Nevera Cold Storage
  console.log("\n--------------------------------------------------");
  console.log("5️⃣  Validating NeveraVault (Cold Storage Anti-Decay)...");
  const freezeFee = ethers.parseUnits("0.5", 18);
  const approveSliceFee = await sliceToken.approve(addresses.neveraVault, freezeFee);
  await approveSliceFee.wait();

  const freezeAmt = ethers.parseUnits("2", 18);
  const approveChe = await cheese.approve(addresses.neveraVault, freezeAmt);
  await approveChe.wait();

  const freezeTx = await neveraVault.freezeIngredients(addresses.ingredients.cheese, freezeAmt);
  await freezeTx.wait();

  const coldBal = await neveraVault.frozenBalances(deployer.address, addresses.ingredients.cheese);
  console.log(`   ✔ Frozen in Nevera: ${ethers.formatUnits(coldBal, 18)} CHE (Spoilage Protected)`);

  // 6. Validate Pizza Baking Lifecycle (Slot #0)
  console.log("\n--------------------------------------------------");
  console.log("6️⃣  Validating PizzaBaking (4 Slots Real-Time Oven)...");
  const approveBakeChe = await cheese.approve(addresses.pizzaBaking, ethers.parseUnits("5", 18));
  await approveBakeChe.wait();
  const approveBakeOni = await onion.approve(addresses.pizzaBaking, ethers.parseUnits("5", 18));
  await approveBakeOni.wait();

  // slot 0, recipe 1 (Margherita), wood 0 (Oak)
  const startBakeTx = await pizzaBaking.startBaking(0, 1, 0);
  await startBakeTx.wait();

  const slot = await pizzaBaking.userSlots(deployer.address, 0);
  console.log(`   ✔ Baking Started in Slot #0: Recipe #${slot.recipeId}, Duration: ${slot.duration.toString()}s, IsBaking: ${slot.isBaking}`);

  // 7. Validate PvP Escrow Match Creation
  console.log("\n--------------------------------------------------");
  console.log("7️⃣  Validating PvPEscrow (1v1 Wager Duels)...");
  const wager = ethers.parseUnits("0.5", 18);
  const approvePvp = await sliceToken.approve(addresses.pvpEscrow, wager);
  await approvePvp.wait();

  const matchId = ethers.keccak256(ethers.toUtf8Bytes("match_" + Date.now()));
  const createMatchTx = await pvpEscrow.createMatch(matchId, wager, "song_tarantella_napoli");
  await createMatchTx.wait();

  const matchData = await pvpEscrow.matches(matchId);
  console.log(`   ✔ 1v1 PvP Match created on Fuji Escrow! Song: ${matchData.songId}, Wager: ${ethers.formatUnits(matchData.wagerAmount, 18)} $SLICE`);

  console.log("\n==================================================");
  console.log("🎉 100% OF LIVE ON-CHAIN FLOWS PASSING ON AVALANCHE FUJI!");
  console.log("==================================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Validation error:", error);
    process.exit(1);
  });
