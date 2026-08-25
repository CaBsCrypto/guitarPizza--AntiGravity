// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title PvPEscrow ("Pizzería Clashes — Escrow")
 * @notice 1v1 duel wager escrow in $SLICE tokens with verifiable score resolution.
 */
contract PvPEscrow is ReentrancyGuard, AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

    IERC20 public immutable sliceToken;
    address public treasury;

    uint256 public protocolFeeBps = 250; // 2.5% fee on pool

    enum MatchStatus { Pending, Active, Settled, Cancelled }

    struct Match {
        bytes32 matchId;
        address player1;
        address player2;
        uint256 wagerAmount;
        string songId;
        MatchStatus status;
        address winner;
        uint256 createdAt;
    }

    mapping(bytes32 => Match) public matches;

    error MatchNotFound();
    error MatchNotPending();
    error MatchNotActive();
    error NotPlayer1();
    error CannotPlaySelf();
    error ZeroAmount();
    error ZeroAddress();

    event MatchCreated(bytes32 indexed matchId, address indexed player1, uint256 wagerAmount, string songId);
    event MatchJoined(bytes32 indexed matchId, address indexed player2);
    event MatchCancelled(bytes32 indexed matchId);
    event MatchSettled(bytes32 indexed matchId, address indexed winner, uint256 payout, uint256 fee);

    constructor(address _sliceToken, address _treasury, address initialAdmin) {
        if (_sliceToken == address(0) || _treasury == address(0) || initialAdmin == address(0)) {
            revert ZeroAddress();
        }

        sliceToken = IERC20(_sliceToken);
        treasury = _treasury;

        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin);
        _grantRole(ORACLE_ROLE, initialAdmin);
    }

    /**
     * @notice Create a new PvP match with a wager in $SLICE.
     */
    function createMatch(bytes32 matchId, uint256 wagerAmount, string calldata songId) external nonReentrant {
        if (wagerAmount == 0) revert ZeroAmount();
        if (matches[matchId].player1 != address(0)) revert MatchNotPending();

        sliceToken.safeTransferFrom(msg.sender, address(this), wagerAmount);

        matches[matchId] = Match({
            matchId: matchId,
            player1: msg.sender,
            player2: address(0),
            wagerAmount: wagerAmount,
            songId: songId,
            status: MatchStatus.Pending,
            winner: address(0),
            createdAt: block.timestamp
        });

        emit MatchCreated(matchId, msg.sender, wagerAmount, songId);
    }

    /**
     * @notice Join an existing pending match by matching the wager.
     */
    function joinMatch(bytes32 matchId) external nonReentrant {
        Match storage m = matches[matchId];
        if (m.status != MatchStatus.Pending) revert MatchNotPending();
        if (m.player1 == msg.sender) revert CannotPlaySelf();

        sliceToken.safeTransferFrom(msg.sender, address(this), m.wagerAmount);

        m.player2 = msg.sender;
        m.status = MatchStatus.Active;

        emit MatchJoined(matchId, msg.sender);
    }

    /**
     * @notice Cancel a pending match before anyone joins and refund player1.
     */
    function cancelMatch(bytes32 matchId) external nonReentrant {
        Match storage m = matches[matchId];
        if (m.status != MatchStatus.Pending) revert MatchNotPending();
        if (m.player1 != msg.sender && !hasRole(DEFAULT_ADMIN_ROLE, msg.sender)) {
            revert NotPlayer1();
        }

        m.status = MatchStatus.Cancelled;
        sliceToken.safeTransfer(m.player1, m.wagerAmount);

        emit MatchCancelled(matchId);
    }

    /**
     * @notice Settle a match and distribute pool to winner.
     */
    function settleMatch(bytes32 matchId, address winner) external onlyRole(ORACLE_ROLE) nonReentrant {
        Match storage m = matches[matchId];
        if (m.status != MatchStatus.Active) revert MatchNotActive();
        if (winner != m.player1 && winner != m.player2 && winner != address(0)) {
            revert ZeroAddress();
        }

        m.status = MatchStatus.Settled;
        m.winner = winner;

        uint256 totalPool = m.wagerAmount * 2;

        if (winner == address(0)) {
            // Draw: Refund both players
            sliceToken.safeTransfer(m.player1, m.wagerAmount);
            sliceToken.safeTransfer(m.player2, m.wagerAmount);
            emit MatchSettled(matchId, address(0), m.wagerAmount, 0);
        } else {
            uint256 fee = (totalPool * protocolFeeBps) / 10000;
            uint256 payout = totalPool - fee;

            if (fee > 0) {
                sliceToken.safeTransfer(treasury, fee);
            }
            sliceToken.safeTransfer(winner, payout);

            emit MatchSettled(matchId, winner, payout, fee);
        }
    }

    function setTreasury(address newTreasury) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (newTreasury == address(0)) revert ZeroAddress();
        treasury = newTreasury;
    }

    function setProtocolFeeBps(uint256 newFeeBps) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newFeeBps <= 1000, "Max 10% fee");
        protocolFeeBps = newFeeBps;
    }
}
