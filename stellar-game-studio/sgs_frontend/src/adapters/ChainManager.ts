import { IBlockchainAdapter, SupportedChainId, ChainCapabilities } from './IBlockchainAdapter';
import { SolanaAdapter } from './SolanaAdapter';
import { StellarAdapter } from './StellarAdapter';
import { AvalancheAdapter } from './AvalancheAdapter';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'gp_active_chain';

class ChainManagerService {
  private static instance: ChainManagerService;
  private currentChain: SupportedChainId = 'solana';
  private solanaAdapter = new SolanaAdapter();
  private stellarAdapter = new StellarAdapter();
  private avalancheAdapter = new AvalancheAdapter();
  private listeners: Set<(chain: SupportedChainId) => void> = new Set();

  private constructor() {
    this.currentChain = this.resolveInitialChain();
  }

  static getInstance(): ChainManagerService {
    if (!ChainManagerService.instance) {
      ChainManagerService.instance = new ChainManagerService();
    }
    return ChainManagerService.instance;
  }

  private resolveInitialChain(): SupportedChainId {
    if (typeof window !== 'undefined') {
      // 1. URL Query Parameter ?chain=solana | ?chain=stellar
      const urlParams = new URLSearchParams(window.location.search);
      const chainParam = urlParams.get('chain')?.toLowerCase();
      if (chainParam === 'solana' || chainParam === 'stellar') {
        localStorage.setItem(STORAGE_KEY, chainParam);
        return chainParam;
      }

      // 2. LocalStorage selection
      const saved = localStorage.getItem(STORAGE_KEY)?.toLowerCase();
      if (saved === 'solana' || saved === 'stellar') {
        return saved as SupportedChainId;
      }

      // Migrate legacy 'avalanche' or set default
      localStorage.setItem(STORAGE_KEY, 'solana');
      return 'solana';
    }

    // 3. Environment Variable fallback (default: solana)
    const envChain = (import.meta.env.VITE_ACTIVE_CHAIN || 'solana').toLowerCase();
    if (envChain === 'stellar') return 'stellar';
    return 'solana';
  }

  getActiveChain(): SupportedChainId {
    return this.currentChain;
  }

  getAdapter(): IBlockchainAdapter {
    if (this.currentChain === 'stellar') return this.stellarAdapter;
    if (this.currentChain === 'avalanche') return this.avalancheAdapter;
    return this.solanaAdapter;
  }

  getCapabilities(): ChainCapabilities {
    return this.getAdapter().getCapabilities();
  }

  setActiveChain(chain: SupportedChainId, reload = false) {
    if (this.currentChain === chain && !reload) return;
    this.currentChain = chain;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, chain);
      const url = new URL(window.location.href);
      url.searchParams.set('chain', chain);
      window.history.replaceState({}, '', url.toString());
    }

    this.listeners.forEach(cb => cb(chain));

    if (reload && typeof window !== 'undefined') {
      window.location.reload();
    }
  }

  subscribe(callback: (chain: SupportedChainId) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
}

export const ChainManager = ChainManagerService.getInstance();

export function useActiveChain() {
  const [activeChain, setActiveChainState] = useState<SupportedChainId>(ChainManager.getActiveChain());

  useEffect(() => {
    return ChainManager.subscribe((chain) => {
      setActiveChainState(chain);
    });
  }, []);

  return {
    activeChain,
    adapter: ChainManager.getAdapter(),
    capabilities: ChainManager.getCapabilities(),
    setActiveChain: (chain: SupportedChainId, reload = false) => ChainManager.setActiveChain(chain, reload),
  };
}
