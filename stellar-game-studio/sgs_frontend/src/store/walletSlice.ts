import { create } from 'zustand';
import { NETWORK, NETWORK_PASSPHRASE } from '../utils/constants';

function getWalletCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )stellar_wallet=([^;]+)'));
  return match ? match[2] : null;
}

export interface WalletState {
  // Wallet connection
  publicKey: string | null;
  walletId: string | null; // ID of the connected wallet
  walletType: 'dev' | 'wallet' | 'passkey' | null; // Track if dev wallet, real wallet, or passkey
  isConnected: boolean;
  isConnecting: boolean;

  // Network info
  network: string | null;
  networkPassphrase: string | null;

  // Error handling
  error: string | null;

  // Actions
  setWallet: (publicKey: string, walletId: string, walletType: 'dev' | 'wallet' | 'passkey') => void;
  setPublicKey: (publicKey: string) => void;
  setConnected: (connected: boolean) => void;
  setConnecting: (connecting: boolean) => void;
  setNetwork: (network: string, networkPassphrase: string) => void;
  setError: (error: string | null) => void;
  disconnect: () => void;
  reset: () => void;
}

const activeAddress = getWalletCookie();

const initialState = {
  publicKey: activeAddress || null,
  walletId: activeAddress ? 'shared-cookie' : null,
  walletType: activeAddress ? 'wallet' : (null as 'dev' | 'wallet' | 'passkey' | null),
  isConnected: !!activeAddress,
  isConnecting: false,
  network: activeAddress ? NETWORK : null,
  networkPassphrase: activeAddress ? NETWORK_PASSPHRASE : null,
  error: null,
};

export const useWalletStore = create<WalletState>()((set) => ({
  ...initialState,

  setWallet: (publicKey, walletId, walletType) =>
    set({
      publicKey,
      walletId,
      walletType,
      isConnected: true,
      isConnecting: false,
      error: null,
    }),

  setPublicKey: (publicKey) =>
    set({
      publicKey,
      isConnected: true,
      isConnecting: false,
      error: null,
    }),

  setConnected: (connected) =>
    set({
      isConnected: connected,
      isConnecting: false,
    }),

  setConnecting: (connecting) =>
    set({
      isConnecting: connecting,
      error: null,
    }),

  setNetwork: (network, networkPassphrase) =>
    set({
      network,
      networkPassphrase,
    }),

  setError: (error) =>
    set({
      error,
      isConnecting: false,
    }),

  disconnect: () =>
    set({
      ...initialState,
    }),

  reset: () => set(initialState),
}));
