// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title IngredientToken
 * @notice Standard ERC-20 token representing harvestable kitchen ingredients (CHE, PEP, BAC, ONI).
 */
contract IngredientToken is ERC20, ERC20Burnable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    error ZeroAddress();
    error ZeroAmount();

    constructor(
        string memory name,
        string memory symbol,
        address initialAdmin
    ) ERC20(name, symbol) {
        if (initialAdmin == address(0)) revert ZeroAddress();

        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin);
        _grantRole(MINTER_ROLE, initialAdmin);
    }

    /**
     * @notice Mint ingredient tokens to player.
     */
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        if (to == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();

        _mint(to, amount);
    }
}
