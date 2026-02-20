import { useCallback } from 'react';
import { useWalletStore } from '../store/walletSlice';
import { devWalletService, DevWalletService } from '../services/devWalletService';
import { NETWORK, NETWORK_PASSPHRASE } from '../utils/constants';
import type { ContractSigner } from '../types/signer';
import { StellarWalletsKit } from '@creit-tech/stellar-wallets-kit/sdk';
import { defaultModules } from '@creit-tech/stellar-wallets-kit/modules/utils';
import { Networks } from '@creit-tech/stellar-wallets-kit/types';

// Helper to ensure kit is initialized if needed (though usually initialized by WalletConnect)
function resolveNetwork(passphrase?: string): Networks {
  if (passphrase && Object.values(Networks).includes(passphrase as Networks)) {
    return passphrase as Networks;
  }
  return NETWORK === 'mainnet' ? Networks.PUBLIC : Networks.TESTNET;
}

export function useWallet() {
  const {
    publicKey,
    walletId,
    walletType,
    isConnected,
    isConnecting,
    network,
    networkPassphrase,
    error,
    setWallet,
    setConnecting,
    setNetwork,
    setError,
    disconnect: storeDisconnect,
  } = useWalletStore();

  /**
   * Connect as a dev player (for testing)
   * DEV MODE ONLY - Not used in production
   */
  const connectDev = useCallback(
    async (playerNumber: 1 | 2) => {
      try {
        setConnecting(true);
        setError(null);

        await devWalletService.initPlayer(playerNumber);
        const address = devWalletService.getPublicKey();

        // Update store with dev wallet
        setWallet(address, `dev-player${playerNumber}`, 'dev');
        setNetwork(NETWORK, NETWORK_PASSPHRASE);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to connect dev wallet';
        setError(errorMessage);
        console.error('Dev wallet connection error:', err);
        throw err;
      } finally {
        setConnecting(false);
      }
    },
    [setWallet, setConnecting, setNetwork, setError]
  );

  /**
   * Switch between dev players
   * DEV MODE ONLY - Not used in production
   */
  const switchPlayer = useCallback(
    async (playerNumber: 1 | 2) => {
      if (walletType !== 'dev') {
        throw new Error('Can only switch players in dev mode');
      }

      try {
        setConnecting(true);
        setError(null);

        await devWalletService.switchPlayer(playerNumber);
        const address = devWalletService.getPublicKey();

        // Update store with new player
        setWallet(address, `dev-player${playerNumber}`, 'dev');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to switch player';
        setError(errorMessage);
        console.error('Player switch error:', err);
        throw err;
      } finally {
        setConnecting(false);
      }
    },
    [walletType, setWallet, setConnecting, setError]
  );

  /**
   * Disconnect wallet
   */
  const disconnect = useCallback(async () => {
    if (walletType === 'dev') {
      devWalletService.disconnect();
    }
    storeDisconnect();
  }, [walletType, storeDisconnect]);

  /**
   * Get a signer for contract interactions
   * Returns functions that the Stellar SDK TS bindings can use for signing
   */
  const getContractSigner = useCallback((): ContractSigner => {
    if (!isConnected || !publicKey) {
      throw new Error('Wallet not connected');
    }

    if (walletType === 'dev') {
      // Dev wallet uses the dev wallet service's signer
      return devWalletService.getSigner();
    } else {
      // Real wallet signing using StellarWalletsKit
      return {
        signTransaction: async (
          xdr: string,
          opts?: { networkPassphrase?: string; address?: string; submit?: boolean; submitUrl?: string }
        ) => {
          // Ensure kit uses current network
          const currentPassphrase = opts?.networkPassphrase || networkPassphrase || NETWORK_PASSPHRASE;
          // Best effort init in case it wasn't
          StellarWalletsKit.init({
            modules: defaultModules(),
            network: resolveNetwork(currentPassphrase)
          });

          const result = await StellarWalletsKit.signTransaction(xdr, {
            networkPassphrase: currentPassphrase,
            address: opts?.address || publicKey,
            submit: opts?.submit,
            submitUrl: opts?.submitUrl,
          });

          return {
            signedTxXdr: result.signedTxXdr || xdr,
            signerAddress: result.signerAddress || publicKey,
          };
        },
        signAuthEntry: async (authEntry: string, opts?: { networkPassphrase?: string; address?: string }) => {
          const currentPassphrase = opts?.networkPassphrase || networkPassphrase || NETWORK_PASSPHRASE;
          StellarWalletsKit.init({
            modules: defaultModules(),
            network: resolveNetwork(currentPassphrase)
          });

          const result = await StellarWalletsKit.signAuthEntry(authEntry, {
            networkPassphrase: currentPassphrase,
            address: opts?.address || publicKey,
          });

          return {
            signedAuthEntry: result.signedAuthEntry || authEntry,
            signerAddress: result.signerAddress || publicKey,
          };
        }
      };
    }
  }, [isConnected, publicKey, walletType, networkPassphrase]);

  /**
   * Check if dev mode is available
   */
  const isDevModeAvailable = useCallback(() => {
    return DevWalletService.isDevModeAvailable();
  }, []);

  /**
   * Check if a specific dev player is available
   */
  const isDevPlayerAvailable = useCallback((playerNumber: 1 | 2) => {
    return DevWalletService.isPlayerAvailable(playerNumber);
  }, []);

  /**
   * Get current dev player number
   */
  const getCurrentDevPlayer = useCallback(() => {
    if (walletType !== 'dev') {
      return null;
    }
    return devWalletService.getCurrentPlayer();
  }, [walletType]);

  return {
    // State
    publicKey,
    walletId,
    walletType,
    isConnected,
    isConnecting,
    network,
    networkPassphrase,
    error,

    // Actions
    connectDev,
    switchPlayer,
    disconnect,
    getContractSigner,
    isDevModeAvailable,
    isDevPlayerAvailable,
    getCurrentDevPlayer,
  };
}
