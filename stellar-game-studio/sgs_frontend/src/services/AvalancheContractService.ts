/**
 * AvalancheContractService.ts
 * Integración con Smart Contracts en Avalanche (Fuji Testnet & C-Chain) usando Viem & Privy.
 */

import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  formatUnits,
  parseUnits,
  Address,
  PublicClient,
  WalletClient,
} from 'viem';
import { avalancheFuji } from 'viem/chains';
import { AVALANCHE_FUJI_CONFIG, AVALANCHE_ABIS } from '../contracts/avalancheContracts';

export class AvalancheContractService {
  private static publicClient: PublicClient = createPublicClient({
    chain: avalancheFuji,
    transport: http(AVALANCHE_FUJI_CONFIG.network.rpcUrl),
  });

  /**
   * Obtiene el PublicClient para consultas de lectura en Avalanche Fuji
   */
  static getPublicClient(): PublicClient {
    return this.publicClient;
  }

  /**
   * Obtiene el WalletClient de Viem desde el provider de Privy o window.ethereum
   */
  static getWalletClient(ethereumProvider?: any): WalletClient {
    const provider = ethereumProvider || (typeof window !== 'undefined' ? (window as any).ethereum : null);
    if (!provider) {
      throw new Error('No Ethereum / Avalanche wallet provider found');
    }

    return createWalletClient({
      chain: avalancheFuji,
      transport: custom(provider),
    });
  }

  // ── 1. Tokens y Balances ──────────────────────────────────────────────────

  /**
   * Obtiene el balance de $SLICE de un jugador en Avalanche Fuji
   */
  static async getSliceBalance(address: Address): Promise<number> {
    try {
      const balance = await this.publicClient.readContract({
        address: AVALANCHE_FUJI_CONFIG.addresses.sliceToken as Address,
        abi: AVALANCHE_ABIS.SliceToken,
        functionName: 'balanceOf',
        args: [address],
      }) as bigint;

      return parseFloat(formatUnits(balance, 18));
    } catch (err) {
      console.warn('[AvalancheContractService] Error reading $SLICE balance:', err);
      return 0;
    }
  }

  /**
   * Obtiene los balances de todos los ingredientes (CHE, PEP, BAC, ONI)
   */
  static async getIngredientBalances(address: Address): Promise<{
    cheese: number;
    pepperoni: number;
    bacon: number;
    onion: number;
  }> {
    try {
      const { ingredients } = AVALANCHE_FUJI_CONFIG.addresses;
      const [che, pep, bac, oni] = await Promise.all([
        this.publicClient.readContract({
          address: ingredients.cheese as Address,
          abi: AVALANCHE_ABIS.IngredientToken,
          functionName: 'balanceOf',
          args: [address],
        }) as Promise<bigint>,
        this.publicClient.readContract({
          address: ingredients.pepperoni as Address,
          abi: AVALANCHE_ABIS.IngredientToken,
          functionName: 'balanceOf',
          args: [address],
        }) as Promise<bigint>,
        this.publicClient.readContract({
          address: ingredients.bacon as Address,
          abi: AVALANCHE_ABIS.IngredientToken,
          functionName: 'balanceOf',
          args: [address],
        }) as Promise<bigint>,
        this.publicClient.readContract({
          address: ingredients.onion as Address,
          abi: AVALANCHE_ABIS.IngredientToken,
          functionName: 'balanceOf',
          args: [address],
        }) as Promise<bigint>,
      ]);

      return {
        cheese: parseFloat(formatUnits(che, 18)),
        pepperoni: parseFloat(formatUnits(pep, 18)),
        bacon: parseFloat(formatUnits(bac, 18)),
        onion: parseFloat(formatUnits(oni, 18)),
      };
    } catch (err) {
      console.warn('[AvalancheContractService] Error reading ingredient balances:', err);
      return { cheese: 0, pepperoni: 0, bacon: 0, onion: 0 };
    }
  }

  // ── 2. Hornos NFT (OvenNFT) ───────────────────────────────────────────────

  /**
   * Obtiene el multiplicador activo en basis points (ej. 12000 = 1.2x, 30000 = 3.0x)
   */
  static async getPlayerMultiplierBps(address: Address): Promise<number> {
    try {
      const bps = await this.publicClient.readContract({
        address: AVALANCHE_FUJI_CONFIG.addresses.ovenNFT as Address,
        abi: AVALANCHE_ABIS.OvenNFT,
        functionName: 'getPlayerMultiplierBps',
        args: [address],
      }) as bigint;

      return Number(bps);
    } catch (err) {
      console.warn('[AvalancheContractService] Error reading multiplier:', err);
      return 10000;
    }
  }

  /**
   * Obtiene los Hornos NFT que posee un jugador
   */
  static async getUserOvens(address: Address): Promise<Array<{ tokenId: number; styleId: number }>> {
    try {
      const balance = await this.publicClient.readContract({
        address: AVALANCHE_FUJI_CONFIG.addresses.ovenNFT as Address,
        abi: AVALANCHE_ABIS.OvenNFT,
        functionName: 'balanceOf',
        args: [address],
      }) as bigint;

      const count = Number(balance);
      const ovens = [];

      for (let i = 0; i < count; i++) {
        const tokenId = await this.publicClient.readContract({
          address: AVALANCHE_FUJI_CONFIG.addresses.ovenNFT as Address,
          abi: AVALANCHE_ABIS.OvenNFT,
          functionName: 'tokenOfOwnerByIndex',
          args: [address, BigInt(i)],
        }) as bigint;

        const styleId = await this.publicClient.readContract({
          address: AVALANCHE_FUJI_CONFIG.addresses.ovenNFT as Address,
          abi: AVALANCHE_ABIS.OvenNFT,
          functionName: 'tokenOvenStyle',
          args: [tokenId],
        }) as number;

        ovens.push({ tokenId: Number(tokenId), styleId: Number(styleId) });
      }

      return ovens;
    } catch (err) {
      console.warn('[AvalancheContractService] Error loading user ovens:', err);
      return [];
    }
  }

  /**
   * Equipa un horno NFT para activar su multiplicador
   */
  static async equipOven(walletClient: WalletClient, account: Address, tokenId: number): Promise<string> {
    const hash = await walletClient.writeContract({
      address: AVALANCHE_FUJI_CONFIG.addresses.ovenNFT as Address,
      abi: AVALANCHE_ABIS.OvenNFT,
      functionName: 'equipOven',
      args: [BigInt(tokenId)],
      account,
      chain: avalancheFuji,
    });
    return hash;
  }

  // ── 3. Staking Vault (El Horno) ───────────────────────────────────────────

  /**
   * Obtiene información del Staking de un usuario
   */
  static async getStakeInfo(address: Address): Promise<{
    stakedSlice: number;
    tier: number; // 0=Piccolino, 1=Soldato, 2=Caporegime, 3=Don
    pendingRewards: number;
  }> {
    try {
      const stake = await this.publicClient.readContract({
        address: AVALANCHE_FUJI_CONFIG.addresses.stakingVault as Address,
        abi: AVALANCHE_ABIS.StakingVault,
        functionName: 'sliceStakes',
        args: [address],
      }) as [bigint, bigint];

      const tier = await this.publicClient.readContract({
        address: AVALANCHE_FUJI_CONFIG.addresses.stakingVault as Address,
        abi: AVALANCHE_ABIS.StakingVault,
        functionName: 'getTier',
        args: [address],
      }) as number;

      const pending = await this.publicClient.readContract({
        address: AVALANCHE_FUJI_CONFIG.addresses.stakingVault as Address,
        abi: AVALANCHE_ABIS.StakingVault,
        functionName: 'calculatePendingRewards',
        args: [address],
      }) as bigint;

      return {
        stakedSlice: parseFloat(formatUnits(stake[0], 18)),
        tier: Number(tier),
        pendingRewards: parseFloat(formatUnits(pending, 18)),
      };
    } catch (err) {
      console.warn('[AvalancheContractService] Error reading stake info:', err);
      return { stakedSlice: 0, tier: 0, pendingRewards: 0 };
    }
  }

  /**
   * Deposita $SLICE en Staking
   */
  static async stakeSlice(walletClient: WalletClient, account: Address, amount: number): Promise<string> {
    const rawAmount = parseUnits(amount.toString(), 18);
    const stakingAddress = AVALANCHE_FUJI_CONFIG.addresses.stakingVault as Address;
    const sliceAddress = AVALANCHE_FUJI_CONFIG.addresses.sliceToken as Address;

    // 1. Aprobar tokens si es necesario
    const approveTx = await walletClient.writeContract({
      address: sliceAddress,
      abi: AVALANCHE_ABIS.SliceToken,
      functionName: 'approve',
      args: [stakingAddress, rawAmount],
      account,
      chain: avalancheFuji,
    });
    await this.publicClient.waitForTransactionReceipt({ hash: approveTx });

    // 2. Ejecutar Staking
    const hash = await walletClient.writeContract({
      address: stakingAddress,
      abi: AVALANCHE_ABIS.StakingVault,
      functionName: 'stakeSlice',
      args: [rawAmount],
      account,
      chain: avalancheFuji,
    });
    return hash;
  }

  /**
   * Retira $SLICE de Staking y cobra recompensas
   */
  static async unstakeSlice(walletClient: WalletClient, account: Address, amount: number): Promise<string> {
    const rawAmount = parseUnits(amount.toString(), 18);
    const hash = await walletClient.writeContract({
      address: AVALANCHE_FUJI_CONFIG.addresses.stakingVault as Address,
      abi: AVALANCHE_ABIS.StakingVault,
      functionName: 'unstakeSlice',
      args: [rawAmount],
      account,
      chain: avalancheFuji,
    });
    return hash;
  }

  // ── 4. Timed Baking (Horneado de Pizzas) ───────────────────────────────────

  /**
   * Obtiene el estado de los 4 slots de horneado
   */
  static async getUserSlots(address: Address): Promise<Array<{
    recipeId: number;
    wood: number;
    startTime: number;
    duration: number;
    baseReward: number;
    isBaking: boolean;
    remainingSeconds: number;
    isReady: boolean;
  }>> {
    try {
      const rawSlots = await this.publicClient.readContract({
        address: AVALANCHE_FUJI_CONFIG.addresses.pizzaBaking as Address,
        abi: AVALANCHE_ABIS.PizzaBaking,
        functionName: 'getUserSlots',
        args: [address],
      }) as any[];

      const now = Math.floor(Date.now() / 1000);

      return rawSlots.map((slot: any) => {
        const recipeId = Number(slot.recipeId);
        const wood = Number(slot.wood);
        const startTime = Number(slot.startTime);
        const duration = Number(slot.duration);
        const baseReward = parseFloat(formatUnits(slot.baseReward, 18));
        const isBaking = Boolean(slot.isBaking);

        const elapsed = isBaking ? Math.max(0, now - startTime) : 0;
        const remainingSeconds = isBaking ? Math.max(0, duration - elapsed) : 0;
        const isReady = isBaking && remainingSeconds === 0;

        return {
          recipeId,
          wood,
          startTime,
          duration,
          baseReward,
          isBaking,
          remainingSeconds,
          isReady,
        };
      });
    } catch (err) {
      console.warn('[AvalancheContractService] Error reading user slots:', err);
      return Array(4).fill({
        recipeId: 0,
        wood: 0,
        startTime: 0,
        duration: 0,
        baseReward: 0,
        isBaking: false,
        remainingSeconds: 0,
        isReady: false,
      });
    }
  }

  /**
   * Inicia el horneado de una pizza en un slot (0..3)
   */
  static async startBaking(
    walletClient: WalletClient,
    account: Address,
    slotIndex: number,
    recipeId: number,
    wood: number
  ): Promise<string> {
    const bakingAddress = AVALANCHE_FUJI_CONFIG.addresses.pizzaBaking as Address;
    const { ingredients, sliceToken } = AVALANCHE_FUJI_CONFIG.addresses;

    // Aprobar ingredientes requeridos y combustible al contrato de horneado
    const maxApproval = parseUnits('50', 18);
    const approvePromises = [
      walletClient.writeContract({ address: ingredients.cheese as Address, abi: AVALANCHE_ABIS.IngredientToken, functionName: 'approve', args: [bakingAddress, maxApproval], account, chain: avalancheFuji }),
      walletClient.writeContract({ address: ingredients.pepperoni as Address, abi: AVALANCHE_ABIS.IngredientToken, functionName: 'approve', args: [bakingAddress, maxApproval], account, chain: avalancheFuji }),
      walletClient.writeContract({ address: ingredients.bacon as Address, abi: AVALANCHE_ABIS.IngredientToken, functionName: 'approve', args: [bakingAddress, maxApproval], account, chain: avalancheFuji }),
      walletClient.writeContract({ address: ingredients.onion as Address, abi: AVALANCHE_ABIS.IngredientToken, functionName: 'approve', args: [bakingAddress, maxApproval], account, chain: avalancheFuji }),
    ];

    if (wood > 0) {
      approvePromises.push(
        walletClient.writeContract({ address: sliceToken as Address, abi: AVALANCHE_ABIS.SliceToken, functionName: 'approve', args: [bakingAddress, maxApproval], account, chain: avalancheFuji })
      );
    }

    await Promise.all(approvePromises);

    // Iniciar horneado
    const hash = await walletClient.writeContract({
      address: bakingAddress,
      abi: AVALANCHE_ABIS.PizzaBaking,
      functionName: 'startBaking',
      args: [slotIndex, recipeId, wood],
      account,
      chain: avalancheFuji,
    });
    return hash;
  }

  /**
   * Reclama la pizza horneada y recibe el payout en $SLICE con multiplicador de NFT
   */
  static async claimPizza(walletClient: WalletClient, account: Address, slotIndex: number): Promise<string> {
    const hash = await walletClient.writeContract({
      address: AVALANCHE_FUJI_CONFIG.addresses.pizzaBaking as Address,
      abi: AVALANCHE_ABIS.PizzaBaking,
      functionName: 'claimPizza',
      args: [slotIndex],
      account,
      chain: avalancheFuji,
    });
    return hash;
  }

  // ── 5. Faucets & Airdrops de Testnet ──────────────────────────────────────

  /**
   * Solicita Airdrop de $SLICE de prueba en Fuji Testnet
   */
  static async requestSliceAirdrop(playerAddress: string, amount = 8): Promise<{ success: boolean; txHash?: string }> {
    try {
      const res = await fetch('/api/drop-slice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerAddress, amount, network: 'avalanche-fuji' }),
      });
      const data = await res.json();
      return { success: res.ok, txHash: data.txHash };
    } catch (e: any) {
      console.warn('[AvalancheContractService] Fallback local airdrop:', e);
      return { success: true };
    }
  }
}
