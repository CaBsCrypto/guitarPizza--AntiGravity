// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";

/**
 * @title NeveraVault ("La Nevera")
 * @notice Ingredient cold storage preventing 7-day decay/spoilage.
 * @dev Requires a 0.5 $SLICE fee per freeze action (50% treasury, 50% burn/admin).
 */
contract NeveraVault is ReentrancyGuard, Ownable2Step {
    using SafeERC20 for IERC20;

    IERC20 public immutable sliceToken;
    address public adminTreasury;

    uint256 public constant FREEZE_FEE = 5 * 10 ** 17; // 0.5 $SLICE (18 decimals)

    // User Address -> Ingredient Token Address -> Frozen Balance
    mapping(address => mapping(address => uint256)) public frozenBalances;

    error ZeroAmount();
    error InsufficientFrozenBalance();
    error ZeroAddress();

    event IngredientsFrozen(address indexed player, address indexed token, uint256 amount);
    event IngredientsWithdrawn(address indexed player, address indexed token, uint256 amount);
    event AdminTreasuryUpdated(address indexed newTreasury);

    constructor(address _sliceToken, address _adminTreasury, address initialOwner)
        Ownable(initialOwner)
    {
        if (_sliceToken == address(0) || _adminTreasury == address(0)) revert ZeroAddress();

        sliceToken = IERC20(_sliceToken);
        adminTreasury = _adminTreasury;
    }

    /**
     * @notice Deposit and freeze ingredients into the vault by paying the 0.5 $SLICE fee.
     */
    function freezeIngredients(address ingredientToken, uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        if (ingredientToken == address(0)) revert ZeroAddress();

        // 1. Collect fee: 50% contract pool, 50% admin treasury
        uint256 poolShare = FREEZE_FEE / 2;
        uint256 treasuryShare = FREEZE_FEE - poolShare;

        sliceToken.safeTransferFrom(msg.sender, address(this), poolShare);
        sliceToken.safeTransferFrom(msg.sender, adminTreasury, treasuryShare);

        // 2. Transfer ingredient tokens to this vault
        IERC20(ingredientToken).safeTransferFrom(msg.sender, address(this), amount);

        // 3. Update frozen balance
        frozenBalances[msg.sender][ingredientToken] += amount;

        emit IngredientsFrozen(msg.sender, ingredientToken, amount);
    }

    /**
     * @notice Withdraw frozen ingredients back to user's wallet.
     */
    function withdrawIngredients(address ingredientToken, uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        uint256 currentBalance = frozenBalances[msg.sender][ingredientToken];
        if (currentBalance < amount) revert InsufficientFrozenBalance();

        frozenBalances[msg.sender][ingredientToken] = currentBalance - amount;

        IERC20(ingredientToken).safeTransfer(msg.sender, amount);

        emit IngredientsWithdrawn(msg.sender, ingredientToken, amount);
    }

    /**
     * @notice Set new admin treasury address.
     */
    function setAdminTreasury(address newTreasury) external onlyOwner {
        if (newTreasury == address(0)) revert ZeroAddress();
        adminTreasury = newTreasury;
        emit AdminTreasuryUpdated(newTreasury);
    }
}
