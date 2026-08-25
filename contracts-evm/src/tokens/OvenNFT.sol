// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title OvenNFT
 * @notice Rhythm Slice Oven NFTs (888 Limited Edition Mafia Ovens).
 * @dev Equipping ovens provides baking yield multipliers and cosmetic prestige in La Famiglia.
 */
contract OvenNFT is ERC721, ERC721Enumerable, ERC721URIStorage, ERC2981, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 public constant MAX_SUPPLY = 888;
    uint256 private _nextTokenId = 1;

    string public baseTokenURI;

    // Token ID -> Oven Style ID (1..8)
    mapping(uint256 => uint8) public tokenOvenStyle;
    // User Address -> Equipped Token ID (0 = none)
    mapping(address => uint256) public equippedOven;

    error MaxSupplyReached();
    error NotOwnerOfToken();
    error InvalidStyleId();
    error ZeroAddress();

    event OvenMinted(address indexed to, uint256 indexed tokenId, uint8 styleId);
    event OvenEquipped(address indexed player, uint256 indexed tokenId, uint8 styleId);
    event OvenUnequipped(address indexed player, uint256 indexed tokenId);

    constructor(
        address initialAdmin,
        string memory initialBaseURI,
        address royaltyReceiver,
        uint96 royaltyFeeBps
    ) ERC721("Rhythm Slice Oven", "OVEN") {
        if (initialAdmin == address(0)) revert ZeroAddress();

        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin);
        _grantRole(MINTER_ROLE, initialAdmin);

        baseTokenURI = initialBaseURI;

        if (royaltyReceiver != address(0) && royaltyFeeBps > 0) {
            _setDefaultRoyalty(royaltyReceiver, royaltyFeeBps);
        }
    }

    /**
     * @notice Mint a new Oven NFT to a specific address with a style ID (1..8).
     */
    function mint(address to, uint8 styleId) external onlyRole(MINTER_ROLE) returns (uint256) {
        if (to == address(0)) revert ZeroAddress();
        if (_nextTokenId > MAX_SUPPLY) revert MaxSupplyReached();
        if (styleId < 1 || styleId > 8) revert InvalidStyleId();

        uint256 tokenId = _nextTokenId++;
        tokenOvenStyle[tokenId] = styleId;

        _safeMint(to, tokenId);

        emit OvenMinted(to, tokenId, styleId);
        return tokenId;
    }

    /**
     * @notice Equip an owned Oven NFT to activate its baking multiplier.
     */
    function equipOven(uint256 tokenId) external {
        if (ownerOf(tokenId) != msg.sender) revert NotOwnerOfToken();

        equippedOven[msg.sender] = tokenId;
        emit OvenEquipped(msg.sender, tokenId, tokenOvenStyle[tokenId]);
    }

    /**
     * @notice Unequip the currently active Oven NFT.
     */
    function unequipOven() external {
        uint256 current = equippedOven[msg.sender];
        equippedOven[msg.sender] = 0;
        emit OvenUnequipped(msg.sender, current);
    }

    /**
     * @notice Get the active multiplier basis points (e.g. 12000 = 1.2x, 30000 = 3.0x) for a player.
     * @return multiplierBps 10000 = 1.0x (default if no oven is equipped).
     */
    function getPlayerMultiplierBps(address player) external view returns (uint256 multiplierBps) {
        uint256 tokenId = equippedOven[player];
        if (tokenId == 0 || ownerOf(tokenId) != player) {
            return 10000; // 1.0x baseline
        }

        uint8 style = tokenOvenStyle[tokenId];
        // Multiplier progression based on style ID:
        // Style 1-2: 1.2x | Style 3-4: 1.5x | Style 5-6: 2.0x | Style 7: 2.5x | Style 8 (Don): 3.0x
        if (style <= 2) return 12000;
        if (style <= 4) return 15000;
        if (style <= 6) return 20000;
        if (style == 7) return 25000;
        return 30000;
    }

    /**
     * @notice Update base token URI.
     */
    function setBaseURI(string memory newBaseURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
        baseTokenURI = newBaseURI;
    }

    /**
     * @notice Update default royalty info.
     */
    function setDefaultRoyalty(address receiver, uint96 feeNumerator) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    // ── Overrides required by Solidity ──────────────────────────────────────────

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        address from = super._update(to, tokenId, auth);
        if (from != address(0) && equippedOven[from] == tokenId) {
            equippedOven[from] = 0;
            emit OvenUnequipped(from, tokenId);
        }
        return from;
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage, ERC2981, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
