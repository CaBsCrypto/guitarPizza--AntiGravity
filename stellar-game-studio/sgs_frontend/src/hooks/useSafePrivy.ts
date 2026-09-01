import { usePrivy, useWallets, type ConnectedWallet } from '@privy-io/react-auth';

/**
 * useSafePrivy: Wrapper defensivo sobre usePrivy de @privy-io/react-auth.
 * Previene caídas o white screen en entornos donde Privy no esté inicializado o no haya appId válido.
 */
export function useSafePrivy() {
  try {
    const privy = usePrivy();
    return {
      ready: privy?.ready ?? false,
      authenticated: privy?.authenticated ?? false,
      user: privy?.user ?? null,
      login: privy?.login ?? (() => console.warn('Privy login no disponible')),
      logout: privy?.logout ?? (async () => console.warn('Privy logout no disponible')),
      getAccessToken: privy?.getAccessToken ?? (async () => null),
      linkWallet: privy?.linkWallet ?? (() => {}),
      unlinkWallet: privy?.unlinkWallet ?? (async () => {}),
    };
  } catch (err) {
    console.warn('[useSafePrivy] No se pudo acceder al contexto de Privy:', err);
    return {
      ready: true,
      authenticated: false,
      user: null,
      login: () => console.warn('Privy no inicializado'),
      logout: async () => {},
      getAccessToken: async () => null,
      linkWallet: () => {},
      unlinkWallet: async () => {},
    };
  }
}

/**
 * useSafeWallets: Wrapper defensivo sobre useWallets de @privy-io/react-auth.
 */
export function useSafeWallets() {
  try {
    const walletsHook = useWallets();
    return {
      ready: walletsHook?.ready ?? false,
      wallets: (walletsHook?.wallets || []) as ConnectedWallet[],
    };
  } catch (err) {
    console.warn('[useSafeWallets] No se pudo acceder al contexto de wallets de Privy:', err);
    return {
      ready: true,
      wallets: [] as ConnectedWallet[],
    };
  }
}
