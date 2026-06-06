import { useCallback } from 'react';
import { useWalletStore } from '../store/walletSlice';
import { devWalletService, DevWalletService } from '../services/devWalletService';
import { NETWORK, NETWORK_PASSPHRASE } from '../utils/constants';
import type { ContractSigner } from '../types/signer';
import { StellarWalletsKit } from '@creit-tech/stellar-wallets-kit/sdk';
import { defaultModules } from '@creit-tech/stellar-wallets-kit/modules/utils';
import { Networks } from '@creit-tech/stellar-wallets-kit/types';
import { passkeyService } from '../services/PasskeyService';
import { Keypair, TransactionBuilder, hash } from '@stellar/stellar-sdk';
import { Buffer } from 'buffer';
import type { WalletError } from '@stellar/stellar-sdk/contract';

const WALLET_ID = 'stellar-wallets-kit';
let kitInitialized = false;

function ensureKitInitialized(passphrase?: string) {
  if (typeof window === 'undefined') return;

  if (!kitInitialized) {
    StellarWalletsKit.init({
      modules: defaultModules(),
      network: resolveNetwork(passphrase),
    });
    kitInitialized = true;
    return;
  }

  if (passphrase) {
    StellarWalletsKit.setNetwork(resolveNetwork(passphrase));
  }
}

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
   * Connect real wallet (e.g. Freighter, Lobstr, xBull)
   */
  const connect = useCallback(async () => {
    if (typeof window === 'undefined') {
      setError('Wallet connection is only available in the browser.');
      return;
    }

    try {
      setConnecting(true);
      setError(null);

      ensureKitInitialized(NETWORK_PASSPHRASE);
      const { address } = await StellarWalletsKit.authModal();
      if (typeof address !== 'string' || !address) {
        throw new Error('No wallet address returned');
      }

      setWallet(address, WALLET_ID, 'wallet');
      setNetwork(NETWORK, NETWORK_PASSPHRASE);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(message);
      throw err;
    } finally {
      setConnecting(false);
    }
  }, [setWallet, setConnecting, setError, setNetwork]);

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
   * Register a new Stellar Passkey Smart Account
   */
  const registerPasskey = useCallback(
    async (username: string, existingSecretKey?: string) => {
      try {
        setConnecting(true);
        setError(null);
        const account = await passkeyService.register(username, existingSecretKey);
        setWallet(account.publicKey, 'passkey-wallet', 'passkey');
        setNetwork(NETWORK, NETWORK_PASSPHRASE);
        return account;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to register Passkey';
        setError(errorMessage);
        console.error('Passkey registration error:', err);
        throw err;
      } finally {
        setConnecting(false);
      }
    },
    [setWallet, setConnecting, setNetwork, setError]
  );

  /**
   * Login with an existing Stellar Passkey Smart Account
   */
  const loginPasskey = useCallback(
    async () => {
      try {
        setConnecting(true);
        setError(null);
        const account = await passkeyService.login();
        setWallet(account.publicKey, 'passkey-wallet', 'passkey');
        setNetwork(NETWORK, NETWORK_PASSPHRASE);
        return account;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to login with Passkey';
        setError(errorMessage);
        console.error('Passkey login error:', err);
        throw err;
      } finally {
        setConnecting(false);
      }
    },
    [setWallet, setConnecting, setNetwork, setError]
  );

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
    } else if (walletType === 'passkey') {
      // Passkey smart account signing
      const toWalletError = (message: string): WalletError => ({ message, code: -1 });
      return {
        signTransaction: async (txXdr: string, opts?: any) => {
          try {
            const currentPassphrase = opts?.networkPassphrase || networkPassphrase || NETWORK_PASSPHRASE;
            const secretKey = passkeyService.getSecretKey(publicKey);
            if (!secretKey) {
              throw new Error('Passkey credential not found on this device');
            }
            const keypair = Keypair.fromSecret(secretKey);
            const transaction = TransactionBuilder.fromXDR(txXdr, currentPassphrase);
            transaction.sign(keypair);
            const signedTxXdr = transaction.toXDR();

            return {
              signedTxXdr,
              signerAddress: publicKey,
            };
          } catch (error) {
            console.error('Passkey failed to sign transaction:', error);
            return {
              signedTxXdr: txXdr,
              signerAddress: publicKey,
              error: toWalletError(
                error instanceof Error ? error.message : 'Failed to sign transaction'
              ),
            };
          }
        },

        signAuthEntry: async (preimageXdr: string, _opts?: any) => {
          try {
            const secretKey = passkeyService.getSecretKey(publicKey);
            if (!secretKey) {
              throw new Error('Passkey credential not found on this device');
            }
            const keypair = Keypair.fromSecret(secretKey);
            const preimageBytes = Buffer.from(preimageXdr, 'base64');
            const payload = hash(preimageBytes);
            const signatureBytes = keypair.sign(payload);

            return {
              signedAuthEntry: Buffer.from(signatureBytes).toString('base64'),
              signerAddress: publicKey,
            };
          } catch (error) {
            console.error('Passkey failed to sign auth entry:', error);
            return {
              signedAuthEntry: preimageXdr,
              signerAddress: publicKey,
              error: toWalletError(
                error instanceof Error ? error.message : 'Failed to sign auth entry'
              ),
            };
          }
        },
      };
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
    connect,
    connectDev,
    switchPlayer,
    disconnect,
    getContractSigner,
    isDevModeAvailable,
    isDevPlayerAvailable,
    getCurrentDevPlayer,
    registerPasskey,
    loginPasskey,
  };
}
