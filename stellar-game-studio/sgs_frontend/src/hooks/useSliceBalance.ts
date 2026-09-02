import { useState, useEffect, useCallback } from 'react';
import { useWalletStore } from '../store/walletSlice';
import { ChainManager } from '../adapters/ChainManager';

const POLL_INTERVAL_MS = 15_000; // refresh every 15s

export function useSliceBalance() {
  const { publicKey, isConnected } = useWalletStore();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!isConnected || !publicKey || publicKey === 'G_DEMO_USER') {
      setBalance(null);
      return;
    }
    setLoading(true);
    try {
      const adapter = ChainManager.getInstance().getAdapter();
      const b = await adapter.getSliceBalance(publicKey);
      setBalance(b);
    } catch (err) {
      console.warn('useSliceBalance error fetching balance:', err);
    } finally {
      setLoading(false);
    }
  }, [isConnected, publicKey]);

  // Fetch on mount and when wallet changes
  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Listen to 'balance-updated' custom event
  useEffect(() => {
    const handleUpdate = () => {
      fetchBalance();
    };
    window.addEventListener('balance-updated', handleUpdate);
    return () => window.removeEventListener('balance-updated', handleUpdate);
  }, [fetchBalance]);

  // Poll periodically
  useEffect(() => {
    if (!isConnected || !publicKey) return;
    const id = setInterval(fetchBalance, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isConnected, publicKey, fetchBalance]);

  return { balance, loading, refresh: fetchBalance };
}
