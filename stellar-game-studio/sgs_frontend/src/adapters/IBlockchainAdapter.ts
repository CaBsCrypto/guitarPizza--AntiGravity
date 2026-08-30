export type SupportedChainId = 'avalanche' | 'stellar';

export interface ChainCapabilities {
  chainId: SupportedChainId;
  chainName: string;
  nativeCurrency: string;
  explorerUrl: string;
  hasDefindex: boolean;
  hasDailyCheckIn: boolean;
  hasPasskeys: boolean;
  hasPrivySocialAuth: boolean;
  hasZkLeaderboardOnChain: boolean;
}

export interface IngredientBalances {
  cheese: number;
  pepperoni: number;
  bacon: number;
  onion: number;
}

export interface OvenItem {
  tokenId: number;
  styleId: number;
  name?: string;
  multiplierBps?: number;
}

export interface BakeSlot {
  slotId: number;
  recipeId: number;
  wood: number;
  startTime: number;
  duration: number;
  baseReward: number;
  isBaking: boolean;
  remainingSeconds: number;
  isReady: boolean;
  isUnlocked?: boolean;
}

export interface StakeInfo {
  stakedSlice: number;
  tier: number; // 0=Piccolino, 1=Soldato, 2=Caporegime, 3=Don
  tierName?: string;
  pendingRewards: number;
}

export interface RefrigeratorBalances {
  cheese: number;
  pepperoni: number;
  bacon: number;
  onion: number;
}

export interface IBlockchainAdapter {
  readonly chainId: SupportedChainId;
  getCapabilities(): ChainCapabilities;

  // Tokens & Balances
  getSliceBalance(address: string): Promise<number>;
  getIngredientBalances(address: string): Promise<IngredientBalances>;
  requestSliceAirdrop(address: string, amount?: number): Promise<{ success: boolean; txHash?: string }>;

  // Oven Collectibles (NFT)
  getUserOvens(address: string): Promise<OvenItem[]>;
  getPlayerMultiplierBps(address: string): Promise<number>;
  equipOven(signerContext: any, address: string, tokenId: number): Promise<{ success: boolean; txHash?: string }>;

  // Timed Baking (El Horno)
  getUserSlots(address: string): Promise<BakeSlot[]>;
  startBaking(
    signerContext: any,
    address: string,
    slotIndex: number,
    recipeId: number,
    woodOrBoost: number
  ): Promise<{ success: boolean; txHash?: string }>;
  claimPizza(
    signerContext: any,
    address: string,
    slotIndex: number
  ): Promise<{ success: boolean; txHash?: string; reward?: number }>;
  unlockSlot?(
    signerContext: any,
    address: string,
    slotIndex: number
  ): Promise<{ success: boolean; txHash?: string }>;

  // Staking Vault
  getStakeInfo(address: string): Promise<StakeInfo>;
  stakeSlice(signerContext: any, address: string, amount: number): Promise<{ success: boolean; txHash?: string }>;
  unstakeSlice(signerContext: any, address: string, amount: number): Promise<{ success: boolean; txHash?: string }>;
  claimStakingRewards?(signerContext: any, address: string): Promise<{ success: boolean; txHash?: string }>;

  // Refrigerator Vault
  getRefrigeratorBalances(address: string): Promise<RefrigeratorBalances>;
  depositToRefrigerator(
    signerContext: any,
    address: string,
    ingredient: string,
    amount: number
  ): Promise<{ success: boolean; txHash?: string }>;
  withdrawFromRefrigerator(
    signerContext: any,
    address: string,
    ingredient: string,
    amount: number
  ): Promise<{ success: boolean; txHash?: string }>;

  // Game Session & Leaderboard
  submitGameSession?(
    signerContext: any,
    address: string,
    stats: any,
    proofHex?: string
  ): Promise<{ success: boolean; txHash?: string; score?: number }>;
}
