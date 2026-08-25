// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title SliceToken ($SLICE)
 * @notice Native utility and reward token for Rhythm Slice on Avalanche.
 * @dev SEP-41 parity migrated to ERC-20 with fixed max supply and daily emission caps.
 */
contract SliceToken is ERC20, ERC20Burnable, ERC20Pausable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    uint256 public constant TOTAL_CAP = 8_888_888 * 10 ** 18;
    uint256 public constant DAILY_GLOBAL_CAP = 8_888 * 10 ** 18;
    uint256 public constant DAILY_WALLET_CAP = 8 * 10 ** 18;

    uint256 public totalLifetimeMinted;

    // Day ID (timestamp / 86400) -> Amount minted globally that day
    mapping(uint256 => uint256) public dayGlobalMinted;
    // Day ID -> Wallet Address -> Amount minted for that wallet that day
    mapping(uint256 => mapping(address => uint256)) public dayWalletMinted;

    error TotalCapExceeded(uint256 requested, uint256 remaining);
    error DailyGlobalCapExceeded(uint256 requested, uint256 remaining);
    error DailyWalletCapExceeded(uint256 requested, uint256 remaining);
    error ZeroAddress();
    error ZeroAmount();

    event SliceMinted(address indexed to, uint256 amount, uint256 dayId);

    constructor(address initialAdmin) ERC20("Rhythm Slice Token", "SLICE") {
        if (initialAdmin == address(0)) revert ZeroAddress();

        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin);
        _grantRole(PAUSER_ROLE, initialAdmin);
        _grantRole(MINTER_ROLE, initialAdmin);
    }

    /**
     * @notice Mint new $SLICE tokens subject to global and daily wallet limits.
     * @param to Recipient address
     * @param amount Amount in wei (18 decimals)
     */
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) whenNotPaused {
        if (to == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();

        if (totalLifetimeMinted + amount > TOTAL_CAP) {
            revert TotalCapExceeded(amount, TOTAL_CAP - totalLifetimeMinted);
        }

        uint256 currentDay = block.timestamp / 86400;

        uint256 currentDayGlobal = dayGlobalMinted[currentDay];
        if (currentDayGlobal + amount > DAILY_GLOBAL_CAP) {
            revert DailyGlobalCapExceeded(amount, DAILY_GLOBAL_CAP - currentDayGlobal);
        }

        uint256 currentDayWallet = dayWalletMinted[currentDay][to];
        if (currentDayWallet + amount > DAILY_WALLET_CAP) {
            revert DailyWalletCapExceeded(amount, DAILY_WALLET_CAP - currentDayWallet);
        }

        dayGlobalMinted[currentDay] = currentDayGlobal + amount;
        dayWalletMinted[currentDay][to] = currentDayWallet + amount;
        totalLifetimeMinted += amount;

        _mint(to, amount);

        emit SliceMinted(to, amount, currentDay);
    }

    /**
     * @notice Pause token transfers in emergency.
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @notice Unpause token transfers.
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /**
     * @dev Overrides required by Solidity for multiple inheritance.
     */
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable)
    {
        super._update(from, to, value);
    }
}
