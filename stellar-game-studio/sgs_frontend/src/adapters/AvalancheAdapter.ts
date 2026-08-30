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
import { AvalancheContractService } from '../services/AvalancheContractService';
import { AVALANCHE_FUJI_CONFIG } from '../contracts/avalancheContracts';
import type { Address, WalletClient } from 'viem';

export class AvalancheAdapter implements IBlockchainAdapter {
  readonly chainId: SupportedChainId = 'avalanche';

  private resolveWalletClient(signerContext: any): WalletClient {
    if (signerContext && typeof signerContext.writeContract === 'function') {
      return signerContext as WalletClient;
    }
    return AvalancheContractService.getWalletClient(signerContext);
  }

  getCapabilities(): ChainCapabilities {
    return {
      chainId: 'avalanche',
      chainName: 'Avalanche Fuji Testnet',
      nativeCurrency: 'AVAX',
      explorerUrl: AVALANCHE_FUJI_CONFIG.network.explorerUrl,
      hasDefindex: false,
      hasDailyCheckIn: false,
      hasPasskeys: false,
      hasPrivySocialAuth: true,
      hasZkLeaderboardOnChain: true,
    };
  }

  // ── 1. Tokens & Balances ──────────────────────────────────────────────────
  async getSliceBalance(address: string): Promise<number> {
    if (!address || !address.startsWith('0x')) return 0;
    return AvalancheContractService.getSliceBalance(address as Address);
  }

  async getIngredientBalances(address: string): Promise<IngredientBalances> {
    if (!address || !address.startsWith('0x')) {
      return { cheese: 0, pepperoni: 0, bacon: 0, onion: 0 };
    }
    return AvalancheContractService.getIngredientBalances(address as Address);
  }

  async requestSliceAirdrop(address: string, amount = 8): Promise<{ success: boolean; txHash?: string }> {
    return AvalancheContractService.requestSliceAirdrop(address, amount);
  }

  // ── 2. Hornos NFT ─────────────────────────────────────────────────────────
  async getUserOvens(address: string): Promise<OvenItem[]> {
    if (!address || !address.startsWith('0x')) return [];
    const ovens = await AvalancheContractService.getUserOvens(address as Address);
    return ovens.map(o => ({
      tokenId: o.tokenId,
      styleId: o.styleId,
      name: `Forno Style #${o.styleId}`,
    }));
  }

  async getPlayerMultiplierBps(address: string): Promise<number> {
    if (!address || !address.startsWith('0x')) return 10000;
    return AvalancheContractService.getPlayerMultiplierBps(address as Address);
  }

  async equipOven(signerContext: any, address: string, tokenId: number): Promise<{ success: boolean; txHash?: string }> {
    try {
      const client = this.resolveWalletClient(signerContext);
      const txHash = await AvalancheContractService.equipOven(client, address as Address, tokenId);
      return { success: true, txHash };
    } catch (err: any) {
      console.error('[AvalancheAdapter] Error equipping oven:', err);
      return { success: false };
    }
  }

  // ── 3. Timed Baking ───────────────────────────────────────────────────────
  async getUserSlots(address: string): Promise<BakeSlot[]> {
    if (!address || !address.startsWith('0x')) {
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
        isUnlocked: true,
      }));
    }

    const slots = await AvalancheContractService.getUserSlots(address as Address);
    return slots.map((s, idx) => ({
      slotId: idx,
      recipeId: s.recipeId,
      wood: s.wood,
      startTime: s.startTime,
      duration: s.duration,
      baseReward: s.baseReward,
      isBaking: s.isBaking,
      remainingSeconds: s.remainingSeconds,
      isReady: s.isReady,
      isUnlocked: true,
    }));
  }

  async startBaking(
    signerContext: any,
    address: string,
    slotIndex: number,
    recipeId: number,
    woodOrBoost: number
  ): Promise<{ success: boolean; txHash?: string }> {
    try {
      const client = this.resolveWalletClient(signerContext);
      const txHash = await AvalancheContractService.startBaking(
        client,
        address as Address,
        slotIndex,
        recipeId,
        woodOrBoost
      );
      return { success: true, txHash };
    } catch (err: any) {
      console.error('[AvalancheAdapter] Error starting bake:', err);
      return { success: false };
    }
  }

  async claimPizza(
    signerContext: any,
    address: string,
    slotIndex: number
  ): Promise<{ success: boolean; txHash?: string; reward?: number }> {
    try {
      const client = this.resolveWalletClient(signerContext);
      const txHash = await AvalancheContractService.claimPizza(client, address as Address, slotIndex);
      return { success: true, txHash };
    } catch (err: any) {
      console.error('[AvalancheAdapter] Error claiming pizza:', err);
      return { success: false };
    }
  }

  async unlockSlot(
    signerContext: any,
    address: string,
    slotIndex: number
  ): Promise<{ success: boolean; txHash?: string }> {
    // En Avalanche todos los 4 slots están desbloqueados por defecto
    return { success: true };
  }

  // ── 4. Staking Vault ──────────────────────────────────────────────────────
  async getStakeInfo(address: string): Promise<StakeInfo> {
    if (!address || !address.startsWith('0x')) {
      return { stakedSlice: 0, tier: 0, tierName: 'Piccolino', pendingRewards: 0 };
    }

    const info = await AvalancheContractService.getStakeInfo(address as Address);
    const tierNames = ['Piccolino', 'Soldato', 'Caporegime', 'Don'];
    return {
      ...info,
      tierName: tierNames[info.tier] || 'Piccolino',
    };
  }

  async stakeSlice(signerContext: any, address: string, amount: number): Promise<{ success: boolean; txHash?: string }> {
    try {
      const client = this.resolveWalletClient(signerContext);
      const txHash = await AvalancheContractService.stakeSlice(client, address as Address, amount);
      return { success: true, txHash };
    } catch (err: any) {
      console.error('[AvalancheAdapter] Error staking $SLICE:', err);
      return { success: false };
    }
  }

  async unstakeSlice(signerContext: any, address: string, amount: number): Promise<{ success: boolean; txHash?: string }> {
    try {
      const client = this.resolveWalletClient(signerContext);
      const txHash = await AvalancheContractService.unstakeSlice(client, address as Address, amount);
      return { success: true, txHash };
    } catch (err: any) {
      console.error('[AvalancheAdapter] Error unstaking $SLICE:', err);
      return { success: false };
    }
  }

  // ── 5. Refrigerator Vault ─────────────────────────────────────────────────
  async getRefrigeratorBalances(address: string): Promise<RefrigeratorBalances> {
    // Avalanche Refrigerator vault placeholder / query
    return { cheese: 0, pepperoni: 0, bacon: 0, onion: 0 };
  }

  async depositToRefrigerator(
    signerContext: any,
    address: string,
    ingredient: string,
    amount: number
  ): Promise<{ success: boolean; txHash?: string }> {
    return { success: true };
  }

  async withdrawFromRefrigerator(
    signerContext: any,
    address: string,
    ingredient: string,
    amount: number
  ): Promise<{ success: boolean; txHash?: string }> {
    return { success: true };
  }
}
