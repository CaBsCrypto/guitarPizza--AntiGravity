import { usePrivy as useOfficialPrivy, useWallets as useOfficialWallets } from '@privy-io/react-auth';

const fallbackPrivy = {
  login: () => console.warn('[Privy] Login disabled on non-secure LAN connection (HTTP)'),
  logout: async () => {},
  authenticated: false,
  user: null,
  ready: true,
  createWallet: async () => { throw new Error('Privy requires HTTPS or localhost'); },
};

const fallbackWallets = {
  wallets: [],
  ready: true,
};

export function useSafePrivy() {
  try {
    return useOfficialPrivy();
  } catch (_e) {
    return fallbackPrivy;
  }
}

export function useSafeWallets() {
  try {
    return useOfficialWallets();
  } catch (_e) {
    return fallbackWallets;
  }
}
