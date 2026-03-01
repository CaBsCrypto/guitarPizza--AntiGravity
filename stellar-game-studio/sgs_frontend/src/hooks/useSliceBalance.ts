import { useState, useEffect, useCallback } from 'react';
import { useWalletStore } from '../store/walletSlice';
import { StellarContractService } from '../services/StellarContractService';

const POLL_INTERVAL_MS = 30_000; // refresh every 30s

export function useSliceBalance() {
  const { publicKey, isConnected } = useWalletStore();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!isConnected || !publicKey || publicKey === 'G_DEMO_USER') {
      setBalance(null);
      return;
    }
    setLoading(true);
    try {
      const b = await StellarContractService.getSliceBalance(publicKey);
      setBalance(b);
    } catch {
      // keep previous value on error
    } finally {
      setLoading(false);
    }
  }, [isConnected, publicKey]);

  // Fetch on mount and when wallet changes
  useEffect(() => {
    fetch();
  }, [fetch]);

  // Poll every 30s
  useEffect(() => {
    if (!isConnected || !publicKey) return;
    const id = setInterval(fetch, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isConnected, publicKey, fetch]);

  return { balance, loading, refresh: fetch };
}
