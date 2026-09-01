/**
 * ═══════════════════════════════════════════════════════════════
 *  SOLANA CONTRACTS & CONSTANTS — Rhythm Slice
 *  Network: Solana Devnet / Mainnet-beta
 * ═══════════════════════════════════════════════════════════════
 */

export const SOLANA_DEVNET_RPC = 'https://api.devnet.solana.com';
export const SOLANA_MAINNET_RPC = 'https://api.mainnet-beta.solana.com';

export interface SolanaProgramConfig {
  programId: string;
  name: string;
  description: string;
}

export const SOLANA_PROGRAMS = {
  // SPL Token Mint & Reward Distribution Program
  SLICE_TOKEN: {
    programId: 'SLicE11111111111111111111111111111111111111',
    mintAddress: 'SLICEvU1Lz1xWdK9yQ97bU84Df8C3Bf7dDevnetMint',
    name: 'SliceTokenProgram',
    description: 'SPL Token mint, player reward distribution & burn for $SLICE'
  },

  // Metaplex / Anchor NFT Program for Ovens and Pizza Masters
  PIZZA_NFT: {
    programId: 'OVEN111111111111111111111111111111111111111',
    collectionMint: 'OVENc11111111111111111111111111111111111111',
    name: 'PizzaNftProgram',
    description: 'Metaplex Core / Anchor program managing Oven NFTs and Chef multipliers'
  },

  // 1v1 PvP Wager Escrow Vault
  PVP_ESCROW: {
    programId: 'PvPEscrow11111111111111111111111111111111111',
    name: 'PvPEscrowProgram',
    description: 'Decentralized match escrow with PDA vault for 1v1 rhythm battles'
  },

  // Global On-Chain Leaderboard & Score Verification
  LEADERBOARD: {
    programId: 'LEAD111111111111111111111111111111111111111',
    name: 'RhythmLeaderboardProgram',
    description: 'Verifies zk-proofs/hashes and records scores permanently on Solana PDAs'
  },

  // Staking Vault for $SLICE / LP Tokens
  STAKING_VAULT: {
    programId: 'STAK111111111111111111111111111111111111111',
    name: 'StakingVaultProgram',
    description: 'Lock $SLICE tokens to generate ingredient yields and VIP oven perks'
  }
} as const;

export interface SolanaNFTMetadata {
  mint: string;
  name: string;
  symbol: string;
  uri: string;
  attributes: Array<{ trait_type: string; value: string | number }>;
  multiplier: number;
}
