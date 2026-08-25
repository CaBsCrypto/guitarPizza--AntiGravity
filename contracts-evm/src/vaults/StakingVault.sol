// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "./../tokens/IngredientToken.sol";

/**
 * @title StakingVault ("El Horno de la Famiglia")
 * @notice Staking vault for $SLICE tokens and LP tokens on Avalanche.
 * @dev Distributes ingredient rewards based on staked tiers and time elapsed.
 */
contract StakingVault is ReentrancyGuard, Pausable, Ownable2Step {
    using SafeERC20 for IERC20;

    IERC20 public immutable sliceToken;
    IERC20 public immutable lpToken;

    IngredientToken public immutable cheeseToken;
    IngredientToken public immutable pepperoniToken;
    IngredientToken public immutable baconToken;
    IngredientToken public immutable onionToken;

    enum MafiaTier { Piccolino, Soldato, Caporegime, Don }

    struct UserStake {
        uint256 amount;
        uint256 lastHarvestTime;
    }

    // Player address -> Single Staking details
    mapping(address => UserStake) public sliceStakes;
    // Player address -> LP Staking details
    mapping(address => UserStake) public lpStakes;

    // Daily reward rate per whole staked token (scaled by 1e18)
    uint256 public rewardRatePerDay = 1 * 10 ** 18; // 1 ingredient token per 100 $SLICE per day
    uint256 public constant LP_REWARD_MULTIPLIER = 4; // 4x for LP Stakers

    error ZeroAmount();
    error InsufficientStake();
    error ZeroAddress();

    event Staked(address indexed user, uint256 amount, bool isLP);
    event Unstaked(address indexed user, uint256 amount, bool isLP);
    event RewardsClaimed(address indexed user, uint256 amountEach);

    constructor(
        address _sliceToken,
        address _lpToken,
        address _cheeseToken,
        address _pepperoniToken,
        address _baconToken,
        address _onionToken,
        address initialOwner
    ) Ownable(initialOwner) {
        if (_sliceToken == address(0) || _cheeseToken == address(0)) revert ZeroAddress();

        sliceToken = IERC20(_sliceToken);
        lpToken = IERC20(_lpToken);
        cheeseToken = IngredientToken(_cheeseToken);
        pepperoniToken = IngredientToken(_pepperoniToken);
        baconToken = IngredientToken(_baconToken);
        onionToken = IngredientToken(_onionToken);
    }

    /**
     * @notice Stake $SLICE tokens to earn ingredients and tier status.
     */
    function stakeSlice(uint256 amount) external nonReentrant whenNotPaused {
        if (amount == 0) revert ZeroAmount();

        _claimSliceRewards(msg.sender);

        UserStake storage user = sliceStakes[msg.sender];
        user.amount += amount;
        user.lastHarvestTime = block.timestamp;

        sliceToken.safeTransferFrom(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount, false);
    }

    /**
     * @notice Unstake $SLICE tokens and claim pending ingredient rewards.
     */
    function unstakeSlice(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        UserStake storage user = sliceStakes[msg.sender];
        if (user.amount < amount) revert InsufficientStake();

        _claimSliceRewards(msg.sender);

        user.amount -= amount;
        user.lastHarvestTime = block.timestamp;

        sliceToken.safeTransfer(msg.sender, amount);
        emit Unstaked(msg.sender, amount, false);
    }

    /**
     * @notice Stake LP tokens (e.g. SLICE/AVAX) for 4x ingredient yield.
     */
    function stakeLP(uint256 amount) external nonReentrant whenNotPaused {
        if (amount == 0) revert ZeroAmount();

        _claimLPRewards(msg.sender);

        UserStake storage user = lpStakes[msg.sender];
        user.amount += amount;
        user.lastHarvestTime = block.timestamp;

        lpToken.safeTransferFrom(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount, true);
    }

    /**
     * @notice Unstake LP tokens and claim pending ingredient rewards.
     */
    function unstakeLP(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        UserStake storage user = lpStakes[msg.sender];
        if (user.amount < amount) revert InsufficientStake();

        _claimLPRewards(msg.sender);

        user.amount -= amount;
        user.lastHarvestTime = block.timestamp;

        lpToken.safeTransfer(msg.sender, amount);
        emit Unstaked(msg.sender, amount, true);
    }

    /**
     * @notice Explicitly claim accumulated ingredient rewards from both single-sided and LP stakes.
     */
    function claimRewards() external nonReentrant {
        _claimSliceRewards(msg.sender);
        if (address(lpToken) != address(0)) {
            _claimLPRewards(msg.sender);
        }
    }

    /**
     * @notice Get current mafia tier for a user based on staked $SLICE amount.
     */
    function getTier(address user) public view returns (MafiaTier) {
        uint256 staked = sliceStakes[user].amount;
        if (staked >= 2000 * 10 ** 18) return MafiaTier.Don;
        if (staked >= 500 * 10 ** 18) return MafiaTier.Caporegime;
        if (staked >= 100 * 10 ** 18) return MafiaTier.Soldato;
        return MafiaTier.Piccolino;
    }

    /**
     * @notice Calculate pending rewards for a user.
     */
    function calculatePendingRewards(address user) public view returns (uint256 totalEach) {
        uint256 slicePending = 0;
        UserStake memory sStake = sliceStakes[user];
        if (sStake.amount > 0 && sStake.lastHarvestTime < block.timestamp) {
            uint256 elapsed = block.timestamp - sStake.lastHarvestTime;
            slicePending = (sStake.amount * elapsed * rewardRatePerDay) / (100 * 10 ** 18 * 86400);
        }

        uint256 lpPending = 0;
        UserStake memory lStake = lpStakes[user];
        if (lStake.amount > 0 && lStake.lastHarvestTime < block.timestamp) {
            uint256 elapsed = block.timestamp - lStake.lastHarvestTime;
            lpPending = (lStake.amount * elapsed * rewardRatePerDay * LP_REWARD_MULTIPLIER) / (100 * 10 ** 18 * 86400);
        }

        return slicePending + lpPending;
    }

    function _claimSliceRewards(address user) internal {
        UserStake storage sStake = sliceStakes[user];
        if (sStake.amount == 0 || sStake.lastHarvestTime >= block.timestamp) return;

        uint256 elapsed = block.timestamp - sStake.lastHarvestTime;
        uint256 rewardAmount = (sStake.amount * elapsed * rewardRatePerDay) / (100 * 10 ** 18 * 86400);
        sStake.lastHarvestTime = block.timestamp;

        if (rewardAmount > 0) {
            _mintIngredients(user, rewardAmount);
        }
    }

    function _claimLPRewards(address user) internal {
        UserStake storage lStake = lpStakes[user];
        if (lStake.amount == 0 || lStake.lastHarvestTime >= block.timestamp) return;

        uint256 elapsed = block.timestamp - lStake.lastHarvestTime;
        uint256 rewardAmount = (lStake.amount * elapsed * rewardRatePerDay * LP_REWARD_MULTIPLIER) / (100 * 10 ** 18 * 86400);
        lStake.lastHarvestTime = block.timestamp;

        if (rewardAmount > 0) {
            _mintIngredients(user, rewardAmount);
        }
    }

    function _mintIngredients(address to, uint256 amount) internal {
        cheeseToken.mint(to, amount);
        pepperoniToken.mint(to, amount);
        baconToken.mint(to, amount);
        onionToken.mint(to, amount);

        emit RewardsClaimed(to, amount);
    }

    function setRewardRate(uint256 newRate) external onlyOwner {
        rewardRatePerDay = newRate;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
