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
  tokenId: number;
  styleId: number;
  name: string;
  symbol: string;
  uri: string;
  multiplierBps: number;
  multiplierDisplay: string;
  description: string;
  attributes: Array<{ trait_type: string; value: string | number }>;
}

export const SOLANA_OVEN_COLLECTION: SolanaNFTMetadata[] = [
  {
    tokenId: 1,
    styleId: 0,
    name: 'Standard Brick Oven',
    symbol: 'OVEN-STD',
    uri: 'https://arweave.net/oven_standard_brick.json',
    multiplierBps: 10000,
    multiplierDisplay: '1.00x',
    description: 'The classic stone oven of Little Italy. Sturdy and reliable.',
    attributes: [
      { trait_type: 'Material', value: 'Brick' },
      { trait_type: 'Multiplier', value: '1.00x' },
      { trait_type: 'Slots', value: 4 }
    ]
  },
  {
    tokenId: 2,
    styleId: 1,
    name: 'Golden Mob Oven (Metaplex)',
    symbol: 'OVEN-GLD',
    uri: 'https://arweave.net/oven_golden_mob.json',
    multiplierBps: 12500,
    multiplierDisplay: '1.25x',
    description: 'Forged with 24k gold trim for the high-ranking Caporegimes.',
    attributes: [
      { trait_type: 'Material', value: 'Solid Gold' },
      { trait_type: 'Multiplier', value: '1.25x' },
      { trait_type: 'Slots', value: 4 }
    ]
  },
  {
    tokenId: 3,
    styleId: 2,
    name: 'Diamond Crust Vault',
    symbol: 'OVEN-DMD',
    uri: 'https://arweave.net/oven_diamond_crust.json',
    multiplierBps: 15000,
    multiplierDisplay: '1.50x',
    description: 'Encased in diamond shards that retain extreme thermal intensity.',
    attributes: [
      { trait_type: 'Material', value: 'Diamond Crust' },
      { trait_type: 'Multiplier', value: '1.50x' },
      { trait_type: 'Slots', value: 4 }
    ]
  },
  {
    tokenId: 4,
    styleId: 3,
    name: 'Neon Cyber Slice Oven',
    symbol: 'OVEN-CYBER',
    uri: 'https://arweave.net/oven_neon_cyber.json',
    multiplierBps: 17500,
    multiplierDisplay: '1.75x',
    description: 'High-frequency laser heating powered by Solana blockchain sub-second slots.',
    attributes: [
      { trait_type: 'Material', value: 'Cyberpunk Neon' },
      { trait_type: 'Multiplier', value: '1.75x' },
      { trait_type: 'Slots', value: 4 }
    ]
  },
  {
    tokenId: 5,
    styleId: 4,
    name: 'Volcanic Stone Oven',
    symbol: 'OVEN-VOLC',
    uri: 'https://arweave.net/oven_volcanic_stone.json',
    multiplierBps: 20000,
    multiplierDisplay: '2.00x',
    description: 'Carved from Mount Vesuvius lava rocks for blistering 900-degree bakes.',
    attributes: [
      { trait_type: 'Material', value: 'Obsidian Magma' },
      { trait_type: 'Multiplier', value: '2.00x' },
      { trait_type: 'Slots', value: 4 }
    ]
  },
  {
    tokenId: 6,
    styleId: 5,
    name: 'Cosmic Starlight Oven',
    symbol: 'OVEN-STAR',
    uri: 'https://arweave.net/oven_cosmic_star.json',
    multiplierBps: 22500,
    multiplierDisplay: '2.25x',
    description: 'Harnesses stellar radiation to cook interdimensional truffle pizzas.',
    attributes: [
      { trait_type: 'Material', value: 'Cosmic Dust' },
      { trait_type: 'Multiplier', value: '2.25x' },
      { trait_type: 'Slots', value: 4 }
    ]
  },
  {
    tokenId: 7,
    styleId: 6,
    name: "Godfather's Gold Oven",
    symbol: 'OVEN-DON',
    uri: 'https://arweave.net/oven_godfather_gold.json',
    multiplierBps: 25000,
    multiplierDisplay: '2.50x',
    description: 'Reserved exclusively for the Don of the Rhythm Slice syndicate.',
    attributes: [
      { trait_type: 'Material', value: 'Pure Don Gold' },
      { trait_type: 'Multiplier', value: '2.50x' },
      { trait_type: 'Slots', value: 4 }
    ]
  },
  {
    tokenId: 8,
    styleId: 7,
    name: 'Inferno Dragon Oven',
    symbol: 'OVEN-DRG',
    uri: 'https://arweave.net/oven_inferno_dragon.json',
    multiplierBps: 30000,
    multiplierDisplay: '3.00x',
    description: 'Mythical dragon-breath flames delivering triple $SLICE yields.',
    attributes: [
      { trait_type: 'Material', value: 'Dragon Scale' },
      { trait_type: 'Multiplier', value: '3.00x' },
      { trait_type: 'Slots', value: 4 }
    ]
  }
];
