import {
  IBlockchainAdapter,
  SupportedChainId,
  ChainCapabilities,
  IngredientBalances,
  OvenItem,
  BakeSlot,
  StakeInfo,
  RefrigeratorBalances,
} from './IBlockchainAdapter';
import { StellarContractService, CONTRACT_IDS } from '../services/StellarContractService';
import { INGREDIENT_TOKENS } from '../utils/constants';

export class StellarAdapter implements IBlockchainAdapter {
  readonly chainId: SupportedChainId = 'stellar';

  getCapabilities(): ChainCapabilities {
    return {
      chainId: 'stellar',
      chainName: 'Stellar Soroban Testnet',
      nativeCurrency: 'XLM',
      explorerUrl: 'https://stellar.expert/explorer/testnet',
      hasDefindex: true,
      hasDailyCheckIn: true,
      hasPasskeys: true,
      hasPrivySocialAuth: false,
      hasZkLeaderboardOnChain: true,
    };
  }

  // ── 1. Tokens & Balances ──────────────────────────────────────────────────
  async getSliceBalance(address: string): Promise<number> {
    if (!address || !address.startsWith('G')) return 0;
    try {
      return await StellarContractService.getSliceBalance(address);
    } catch (err) {
      console.warn('[StellarAdapter] Error fetching $SLICE balance:', err);
      return 0;
    }
  }

  async getIngredientBalances(address: string): Promise<IngredientBalances> {
    if (!address || !address.startsWith('G')) {
      return { cheese: 0, pepperoni: 0, bacon: 0, onion: 0 };
    }
    try {
      const [cheese, pepperoni, bacon, onion] = await Promise.all([
        StellarContractService.getRefrigeratorBalance(address, INGREDIENT_TOKENS.cheese).catch(() => 0),
        StellarContractService.getRefrigeratorBalance(address, INGREDIENT_TOKENS.pepperoni).catch(() => 0),
        StellarContractService.getRefrigeratorBalance(address, INGREDIENT_TOKENS.bacon).catch(() => 0),
        StellarContractService.getRefrigeratorBalance(address, INGREDIENT_TOKENS.onion).catch(() => 0),
      ]);
      return { cheese, pepperoni, bacon, onion };
    } catch (err) {
      console.warn('[StellarAdapter] Error reading ingredient balances:', err);
      return { cheese: 0, pepperoni: 0, bacon: 0, onion: 0 };
    }
  }

  async requestSliceAirdrop(address: string, amount = 8): Promise<{ success: boolean; txHash?: string }> {
    try {
      const res = await (StellarContractService as any).requestSliceAirdrop?.(address, amount) || { success: true };
      return { success: res.success ?? true, txHash: res.txHash };
    } catch (err) {
      return { success: false };
    }
  }

  // ── 2. Hornos NFT ─────────────────────────────────────────────────────────
  async getUserOvens(address: string): Promise<OvenItem[]> {
    if (!address || !address.startsWith('G')) return [];
    try {
      // Mock / Contract query for Stellar NFTs
      return [
        { tokenId: 1, styleId: 1, name: 'Soroban Brick Oven #1', multiplierBps: 12000 },
      ];
    } catch (err) {
      return [];
    }
  }

  async getPlayerMultiplierBps(address: string): Promise<number> {
    return 10000;
  }

  async equipOven(signerContext: any, address: string, tokenId: number): Promise<{ success: boolean; txHash?: string }> {
    return { success: true };
  }

  // ── 3. Timed Baking ───────────────────────────────────────────────────────
  async getUserSlots(address: string): Promise<BakeSlot[]> {
    if (!address || !address.startsWith('G')) {
      return Array(4).fill(null).map((_, i) => ({
        slotId: i,
        recipeId: 0,
        wood: 0,
        startTime: 0,
        duration: 0,
        baseReward: 0,
        isBaking: false,
        remainingSeconds: 0,
        isReady: false,
        isUnlocked: i === 0,
      }));
    }

    try {
      const slots = await (StellarContractService as any).getBakingSlots?.(address) || [];
      const now = Math.floor(Date.now() / 1000);

      return slots.map((s: any, idx: number) => {
        const isBaking = Boolean(s.is_baking);
        const startTime = Number(s.start_time || 0);
        const duration = Number(s.duration || 0);
        const elapsed = isBaking ? Math.max(0, now - startTime) : 0;
        const remainingSeconds = isBaking ? Math.max(0, duration - elapsed) : 0;

        return {
          slotId: idx,
          recipeId: Number(s.recipe_id || 0),
          wood: Number(s.wood || 0),
          startTime,
          duration,
          baseReward: Number(s.base_reward || 0) / 10_000_000,
          isBaking,
          remainingSeconds,
          isReady: isBaking && remainingSeconds === 0,
          isUnlocked: Boolean(s.is_unlocked ?? (idx === 0)),
        };
      });
    } catch (err) {
      console.warn('[StellarAdapter] Error loading bake slots:', err);
      return Array(4).fill(null).map((_, i) => ({
        slotId: i,
        recipeId: 0,
        wood: 0,
        startTime: 0,
        duration: 0,
        baseReward: 0,
        isBaking: false,
        remainingSeconds: 0,
        isReady: false,
        isUnlocked: i === 0,
      }));
    }
  }

  async startBaking(
    signerContext: any,
    address: string,
    slotIndex: number,
    recipeId: number,
    woodOrBoost: number
  ): Promise<{ success: boolean; txHash?: string }> {
    try {
      const res = await (StellarContractService as any).startBake(
        address,
        slotIndex,
        recipeId,
        30,
        50,
        null,
        woodOrBoost,
        signerContext
      );
      return { success: res.success, txHash: res.txHash };
    } catch (err: any) {
      console.error('[StellarAdapter] Error starting bake:', err);
      return { success: false };
    }
  }

  async claimPizza(
    signerContext: any,
    address: string,
    slotIndex: number
  ): Promise<{ success: boolean; txHash?: string; reward?: number }> {
    try {
      const res = await StellarContractService.claimBake(address, slotIndex, signerContext);
      return { success: res.success, txHash: res.txHash };
    } catch (err: any) {
      console.error('[StellarAdapter] Error claiming bake:', err);
      return { success: false };
    }
  }

  async unlockSlot(
    signerContext: any,
    address: string,
    slotIndex: number
  ): Promise<{ success: boolean; txHash?: string }> {
    try {
      const res = await StellarContractService.unlockBakingSlot(address, slotIndex, signerContext);
      return { success: res.success, txHash: res.txHash };
    } catch (err: any) {
      console.error('[StellarAdapter] Error unlocking slot:', err);
      return { success: false };
    }
  }

  // ── 4. Staking Vault ──────────────────────────────────────────────────────
  async getStakeInfo(address: string): Promise<StakeInfo> {
    if (!address || !address.startsWith('G')) {
      return { stakedSlice: 0, tier: 0, tierName: 'Piccolino', pendingRewards: 0 };
    }

    try {
      const stakedSlice = await StellarContractService.getStakedBalance(address);
      let tier = 0;
      let tierName = 'Piccolino';
      if (stakedSlice >= 1000) { tier = 3; tierName = 'Don'; }
      else if (stakedSlice >= 500) { tier = 2; tierName = 'Caporegime'; }
      else if (stakedSlice >= 100) { tier = 1; tierName = 'Soldato'; }

      return {
        stakedSlice,
        tier,
        tierName,
        pendingRewards: 0,
      };
    } catch (err) {
      return { stakedSlice: 0, tier: 0, tierName: 'Piccolino', pendingRewards: 0 };
    }
  }

  async stakeSlice(signerContext: any, address: string, amount: number): Promise<{ success: boolean; txHash?: string }> {
    try {
      const res = await StellarContractService.stakeSlice(address, amount, signerContext);
      return { success: res.success, txHash: res.txHash };
    } catch (err: any) {
      console.error('[StellarAdapter] Error staking $SLICE:', err);
      return { success: false };
    }
  }

  async unstakeSlice(signerContext: any, address: string, amount: number): Promise<{ success: boolean; txHash?: string }> {
    try {
      const res = await StellarContractService.unstakeSlice(address, amount, signerContext);
      return { success: res.success, txHash: res.txHash };
    } catch (err: any) {
      console.error('[StellarAdapter] Error unstaking $SLICE:', err);
      return { success: false };
    }
  }

  // ── 5. Refrigerator Vault ─────────────────────────────────────────────────
  async getRefrigeratorBalances(address: string): Promise<RefrigeratorBalances> {
    return this.getIngredientBalances(address);
  }

  async depositToRefrigerator(
    signerContext: any,
    address: string,
    ingredient: string,
    amount: number
  ): Promise<{ success: boolean; txHash?: string }> {
    try {
      const tokenAddr = (INGREDIENT_TOKENS as any)[ingredient] || ingredient;
      const res = await StellarContractService.depositToRefrigerator(address, tokenAddr, amount, signerContext);
      return { success: res.success, txHash: res.txHash };
    } catch (err: any) {
      console.error('[StellarAdapter] Error depositing to Refrigerator:', err);
      return { success: false };
    }
  }

  async withdrawFromRefrigerator(
    signerContext: any,
    address: string,
    ingredient: string,
    amount: number
  ): Promise<{ success: boolean; txHash?: string }> {
    try {
      const tokenAddr = (INGREDIENT_TOKENS as any)[ingredient] || ingredient;
      const res = await StellarContractService.withdrawFromRefrigerator(address, tokenAddr, amount, signerContext);
      return { success: res.success, txHash: res.txHash };
    } catch (err: any) {
      console.error('[StellarAdapter] Error withdrawing from Refrigerator:', err);
      return { success: false };
    }
  }
}
