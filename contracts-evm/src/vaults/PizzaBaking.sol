// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "./../tokens/SliceToken.sol";
import "./../tokens/IngredientToken.sol";
import "./../tokens/OvenNFT.sol";

/**
 * @title PizzaBaking ("El Horno — Timed Baking")
 * @notice 4-slot oven baking dashboard with fuel boosts, NFT multipliers, and $SLICE payouts.
 */
contract PizzaBaking is ReentrancyGuard, Pausable, Ownable2Step {
    using SafeERC20 for IERC20;

    SliceToken public immutable sliceToken;
    OvenNFT public immutable ovenNFT;

    IngredientToken public immutable cheeseToken;
    IngredientToken public immutable pepperoniToken;
    IngredientToken public immutable baconToken;
    IngredientToken public immutable onionToken;

    enum WoodType { Normal, Cherry, Mesquite }

    struct BakingSlot {
        uint8 recipeId;
        WoodType wood;
        uint256 startTime;
        uint256 duration;
        uint256 baseReward;
        bool isBaking;
    }

    struct Recipe {
        string name;
        uint256 cheeseCost;
        uint256 pepperoniCost;
        uint256 baconCost;
        uint256 onionCost;
        uint256 duration;
        uint256 baseSliceReward;
    }

    // User Address -> Slot Index (0..3) -> Baking Slot
    mapping(address => mapping(uint8 => BakingSlot)) public userSlots;
    // Recipe ID (1..4) -> Recipe details
    mapping(uint8 => Recipe) public recipes;

    uint256 public constant CHERRY_FUEL_FEE = 1 * 10 ** 18; // 1 $SLICE
    uint256 public constant MESQUITE_FUEL_FEE = 2 * 10 ** 18; // 2 $SLICE
    uint256 public constant SPEEDUP_FEE = 1 * 10 ** 18; // 1 $SLICE

    error InvalidSlot();
    error SlotAlreadyBaking();
    error SlotNotBaking();
    error BakingInProgress(uint256 remainingSeconds);
    error InvalidRecipe();
    error ZeroAddress();

    event BakingStarted(address indexed player, uint8 indexed slotIndex, uint8 recipeId, WoodType wood, uint256 duration);
    event BakingSpedUp(address indexed player, uint8 indexed slotIndex, uint256 newRemaining);
    event PizzaClaimed(address indexed player, uint8 indexed slotIndex, uint256 payoutSlice, uint256 multiplierBps);

    constructor(
        address _sliceToken,
        address _ovenNFT,
        address _cheeseToken,
        address _pepperoniToken,
        address _baconToken,
        address _onionToken,
        address initialOwner
    ) Ownable(initialOwner) {
        if (_sliceToken == address(0) || _ovenNFT == address(0)) revert ZeroAddress();

        sliceToken = SliceToken(_sliceToken);
        ovenNFT = OvenNFT(_ovenNFT);
        cheeseToken = IngredientToken(_cheeseToken);
        pepperoniToken = IngredientToken(_pepperoniToken);
        baconToken = IngredientToken(_baconToken);
        onionToken = IngredientToken(_onionToken);

        // Standard Italian Mafia Recipes:
        // 1. Margherita (Fast: 300s, 2 CHE, 2 ONI -> 4 $SLICE)
        recipes[1] = Recipe("Margherita Clasica", 2 * 10**18, 0, 0, 2 * 10**18, 300, 4 * 10**18);
        // 2. Pepperoni Piccante (Medium: 600s, 3 CHE, 3 PEP -> 7 $SLICE)
        recipes[2] = Recipe("Pepperoni Piccante", 3 * 10**18, 3 * 10**18, 0, 0, 600, 7 * 10**18);
        // 3. Meat Lovers Don (Heavy: 1200s, 3 CHE, 4 PEP, 3 BAC -> 15 $SLICE)
        recipes[3] = Recipe("Meat Lovers Don", 3 * 10**18, 4 * 10**18, 3 * 10**18, 0, 1200, 15 * 10**18);
        // 4. Capo Suprema (Master: 1800s, 4 CHE, 4 PEP, 4 BAC, 4 ONI -> 25 $SLICE)
        recipes[4] = Recipe("Capo Suprema", 4 * 10**18, 4 * 10**18, 4 * 10**18, 4 * 10**18, 1800, 25 * 10**18);
    }

    /**
     * @notice Start baking in one of the 4 available oven slots.
     */
    function startBaking(uint8 slotIndex, uint8 recipeId, WoodType wood) external nonReentrant whenNotPaused {
        if (slotIndex >= 4) revert InvalidSlot();
        if (recipeId < 1 || recipeId > 4) revert InvalidRecipe();

        BakingSlot storage slot = userSlots[msg.sender][slotIndex];
        if (slot.isBaking) revert SlotAlreadyBaking();

        Recipe memory r = recipes[recipeId];

        // 1. Burn required ingredients
        if (r.cheeseCost > 0) cheeseToken.burnFrom(msg.sender, r.cheeseCost);
        if (r.pepperoniCost > 0) pepperoniToken.burnFrom(msg.sender, r.pepperoniCost);
        if (r.baconCost > 0) baconToken.burnFrom(msg.sender, r.baconCost);
        if (r.onionCost > 0) onionToken.burnFrom(msg.sender, r.onionCost);

        // 2. Handle premium wood fuels
        uint256 duration = r.duration;
        uint256 baseReward = r.baseSliceReward;

        if (wood == WoodType.Cherry) {
            sliceToken.burnFrom(msg.sender, CHERRY_FUEL_FEE);
            duration = (duration * 2) / 3; // 1.5x speed (takes 66% of time)
        } else if (wood == WoodType.Mesquite) {
            sliceToken.burnFrom(msg.sender, MESQUITE_FUEL_FEE);
            baseReward = baseReward * 2; // 2.0x yield boost
        }

        slot.recipeId = recipeId;
        slot.wood = wood;
        slot.startTime = block.timestamp;
        slot.duration = duration;
        slot.baseReward = baseReward;
        slot.isBaking = true;

        emit BakingStarted(msg.sender, slotIndex, recipeId, wood, duration);
    }

    /**
     * @notice Pay 1 $SLICE to cut remaining baking time in half.
     */
    function speedUpBake(uint8 slotIndex) external nonReentrant whenNotPaused {
        if (slotIndex >= 4) revert InvalidSlot();
        BakingSlot storage slot = userSlots[msg.sender][slotIndex];
        if (!slot.isBaking) revert SlotNotBaking();

        sliceToken.burnFrom(msg.sender, SPEEDUP_FEE);

        uint256 elapsed = block.timestamp - slot.startTime;
        if (elapsed < slot.duration) {
            uint256 remaining = slot.duration - elapsed;
            uint256 reduction = remaining / 2;
            slot.duration -= reduction;
            emit BakingSpedUp(msg.sender, slotIndex, slot.duration - elapsed);
        }
    }

    /**
     * @notice Claim a finished pizza and receive $SLICE with active NFT multipliers.
     */
    function claimPizza(uint8 slotIndex) external nonReentrant {
        if (slotIndex >= 4) revert InvalidSlot();
        BakingSlot storage slot = userSlots[msg.sender][slotIndex];
        if (!slot.isBaking) revert SlotNotBaking();

        if (block.timestamp < slot.startTime + slot.duration) {
            revert BakingInProgress((slot.startTime + slot.duration) - block.timestamp);
        }

        uint256 baseReward = slot.baseReward;

        // Fetch multiplier from equipped Oven NFT (e.g. 10000 = 1.0x, 20000 = 2.0x, 30000 = 3.0x)
        uint256 multiplierBps = ovenNFT.getPlayerMultiplierBps(msg.sender);
        uint256 finalPayout = (baseReward * multiplierBps) / 10000;

        // Reset slot
        delete userSlots[msg.sender][slotIndex];

        // Mint $SLICE reward to player
        sliceToken.mint(msg.sender, finalPayout);

        emit PizzaClaimed(msg.sender, slotIndex, finalPayout, multiplierBps);
    }

    /**
     * @notice View all 4 slots for a player dashboard.
     */
    function getUserSlots(address player) external view returns (BakingSlot[4] memory slots) {
        for (uint8 i = 0; i < 4; i++) {
            slots[i] = userSlots[player][i];
        }
    }

    function setRecipe(
        uint8 recipeId,
        string memory name,
        uint256 cheeseCost,
        uint256 pepperoniCost,
        uint256 baconCost,
        uint256 onionCost,
        uint256 duration,
        uint256 baseSliceReward
    ) external onlyOwner {
        recipes[recipeId] = Recipe(name, cheeseCost, pepperoniCost, baconCost, onionCost, duration, baseSliceReward);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
