const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("🍕 Rhythm Slice — Avalanche Suite", function () {
  let admin, player1, player2, treasury;
  let sliceToken, cheese, pepperoni, bacon, onion;
  let ovenNFT, stakingVault, neveraVault, pizzaBaking, pvpEscrow;

  const parseSlice = (val) => ethers.parseUnits(val.toString(), 18);

  beforeEach(async function () {
    [admin, player1, player2, treasury] = await ethers.getSigners();

    // 1. Deploy SliceToken
    const SliceTokenFactory = await ethers.getContractFactory("SliceToken");
    sliceToken = await SliceTokenFactory.deploy(admin.address);
    await sliceToken.waitForDeployment();

    // 2. Deploy Ingredients
    const IngredientFactory = await ethers.getContractFactory("IngredientToken");
    cheese = await IngredientFactory.deploy("Cheese", "CHE", admin.address);
    pepperoni = await IngredientFactory.deploy("Pepperoni", "PEP", admin.address);
    bacon = await IngredientFactory.deploy("Bacon", "BAC", admin.address);
    onion = await IngredientFactory.deploy("Onion", "ONI", admin.address);

    // 3. Deploy OvenNFT
    const OvenNFTFactory = await ethers.getContractFactory("OvenNFT");
    ovenNFT = await OvenNFTFactory.deploy(admin.address, "https://rhythmslice.spicycrust.com/api/oven/", treasury.address, 500);
    await ovenNFT.waitForDeployment();

    // 4. Deploy StakingVault
    const StakingVaultFactory = await ethers.getContractFactory("StakingVault");
    stakingVault = await StakingVaultFactory.deploy(
      await sliceToken.getAddress(),
      ethers.ZeroAddress, // LP mock
      await cheese.getAddress(),
      await pepperoni.getAddress(),
      await bacon.getAddress(),
      await onion.getAddress(),
      admin.address
    );

    // 5. Deploy NeveraVault
    const NeveraVaultFactory = await ethers.getContractFactory("NeveraVault");
    neveraVault = await NeveraVaultFactory.deploy(
      await sliceToken.getAddress(),
      treasury.address,
      admin.address
    );

    // 6. Deploy PizzaBaking
    const PizzaBakingFactory = await ethers.getContractFactory("PizzaBaking");
    pizzaBaking = await PizzaBakingFactory.deploy(
      await sliceToken.getAddress(),
      await ovenNFT.getAddress(),
      await cheese.getAddress(),
      await pepperoni.getAddress(),
      await bacon.getAddress(),
      await onion.getAddress(),
      admin.address
    );

    // 7. Deploy PvPEscrow
    const PvPEscrowFactory = await ethers.getContractFactory("PvPEscrow");
    pvpEscrow = await PvPEscrowFactory.deploy(
      await sliceToken.getAddress(),
      treasury.address,
      admin.address
    );

    // Grant MINTER_ROLE to PizzaBaking and StakingVault
    const MINTER_ROLE = await sliceToken.MINTER_ROLE();
    await sliceToken.grantRole(MINTER_ROLE, await pizzaBaking.getAddress());
    await cheese.grantRole(MINTER_ROLE, await stakingVault.getAddress());
    await pepperoni.grantRole(MINTER_ROLE, await stakingVault.getAddress());
    await bacon.grantRole(MINTER_ROLE, await stakingVault.getAddress());
    await onion.grantRole(MINTER_ROLE, await stakingVault.getAddress());
    await ovenNFT.grantRole(MINTER_ROLE, admin.address);
  });

  describe("1. SliceToken ($SLICE)", function () {
    it("Enforces daily caps and total supply limits", async function () {
      expect(await sliceToken.TOTAL_CAP()).to.equal(parseSlice(8888888));
      expect(await sliceToken.DAILY_WALLET_CAP()).to.equal(parseSlice(8));

      // Mint 8 $SLICE to player1
      await sliceToken.mint(player1.address, parseSlice(8));
      expect(await sliceToken.balanceOf(player1.address)).to.equal(parseSlice(8));

      // Exceeding daily cap must revert
      await expect(
        sliceToken.mint(player1.address, parseSlice(1))
      ).to.be.revertedWithCustomError(sliceToken, "DailyWalletCapExceeded");
    });
  });

  describe("2. OvenNFT (ERC-721)", function () {
    it("Mints with style and applies active baking multipliers", async function () {
      await ovenNFT.mint(player1.address, 8); // Style 8 = Don (3.0x multiplier)
      expect(await ovenNFT.ownerOf(1)).to.equal(player1.address);

      // Baseline multiplier before equipping is 1.0x (10000 bps)
      expect(await ovenNFT.getPlayerMultiplierBps(player1.address)).to.equal(10000);

      // Equip oven
      await ovenNFT.connect(player1).equipOven(1);
      expect(await ovenNFT.equippedOven(player1.address)).to.equal(1);
      expect(await ovenNFT.getPlayerMultiplierBps(player1.address)).to.equal(30000); // 3.0x
    });
  });

  describe("3. StakingVault & Tiers", function () {
    it("Calculates correct Mafia Tier based on staked $SLICE", async function () {
      await sliceToken.mint(player1.address, parseSlice(8));
      await sliceToken.connect(player1).approve(await stakingVault.getAddress(), parseSlice(8));

      // Tier before stake: Piccolino (0)
      expect(await stakingVault.getTier(player1.address)).to.equal(0);

      await stakingVault.connect(player1).stakeSlice(parseSlice(5));
      expect(await stakingVault.getTier(player1.address)).to.equal(0); // < 100 is Piccolino
    });
  });

  describe("4. PizzaBaking (Timed Oven & Wood Fuels)", function () {
    it("Starts baking a recipe and burns required ingredients", async function () {
      // Mint ingredients to player1
      await cheese.mint(player1.address, parseSlice(5));
      await onion.mint(player1.address, parseSlice(5));

      await cheese.connect(player1).approve(await pizzaBaking.getAddress(), parseSlice(5));
      await onion.connect(player1).approve(await pizzaBaking.getAddress(), parseSlice(5));

      // Start baking recipe 1 (Margherita) in slot 0 with normal wood (0)
      await pizzaBaking.connect(player1).startBaking(0, 1, 0);

      const slots = await pizzaBaking.getUserSlots(player1.address);
      expect(slots[0].isBaking).to.be.true;
      expect(slots[0].recipeId).to.equal(1);
      expect(slots[0].duration).to.equal(300); // 300 seconds
    });
  });

  describe("5. NeveraVault & Cold Storage", function () {
    it("Freezes ingredients by paying 0.5 $SLICE fee", async function () {
      // Mint tokens to player1
      await sliceToken.mint(player1.address, parseSlice(8));
      await cheese.mint(player1.address, parseSlice(10));

      // Approvals
      await sliceToken.connect(player1).approve(await neveraVault.getAddress(), parseSlice(1));
      await cheese.connect(player1).approve(await neveraVault.getAddress(), parseSlice(10));

      // Freeze 5 cheese
      await neveraVault.connect(player1).freezeIngredients(await cheese.getAddress(), parseSlice(5));
      expect(await neveraVault.frozenBalances(player1.address, await cheese.getAddress())).to.equal(parseSlice(5));

      // Withdraw 2 cheese
      await neveraVault.connect(player1).withdrawIngredients(await cheese.getAddress(), parseSlice(2));
      expect(await neveraVault.frozenBalances(player1.address, await cheese.getAddress())).to.equal(parseSlice(3));
    });
  });

  describe("6. PvP Escrow (Clashes)", function () {
    it("Creates, joins and settles a 1v1 match cleanly", async function () {
      await sliceToken.mint(player1.address, parseSlice(5));
      await sliceToken.mint(player2.address, parseSlice(5));

      await sliceToken.connect(player1).approve(await pvpEscrow.getAddress(), parseSlice(5));
      await sliceToken.connect(player2).approve(await pvpEscrow.getAddress(), parseSlice(5));

      const matchId = ethers.keccak256(ethers.toUtf8Bytes("duel_001"));

      // Player 1 creates match
      await pvpEscrow.connect(player1).createMatch(matchId, parseSlice(5), "song_rare_pizzas");

      // Player 2 joins
      await pvpEscrow.connect(player2).joinMatch(matchId);

      // Settle match with Player 1 as winner
      await pvpEscrow.connect(admin).settleMatch(matchId, player1.address);

      // Total pool = 10 $SLICE, 2.5% fee = 0.25 $SLICE -> Payout = 9.75 $SLICE
      expect(await sliceToken.balanceOf(player1.address)).to.equal(parseSlice(9.75));
      expect(await sliceToken.balanceOf(treasury.address)).to.equal(parseSlice(0.25));
    });
  });
});
