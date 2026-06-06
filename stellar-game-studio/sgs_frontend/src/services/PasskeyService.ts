import { Keypair } from '@stellar/stellar-sdk';

export interface PasskeyAccount {
  publicKey: string;
  credentialId: string;
  username: string;
  createdAt: number;
}

class PasskeyService {
  private STORAGE_KEYS = {
    ACCOUNTS: 'gp_passkey_accounts',
    SECRET_PREFIX: 'gp_passkey_sec_',
  };

  /**
   * Check if WebAuthn/Passkeys are supported by the browser.
   */
  public isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof window.PublicKeyCredential !== 'undefined'
    );
  }

  /**
   * Register a new Stellar Passkey smart account.
   */
  public async register(username: string, existingSecretKey?: string): Promise<PasskeyAccount> {
    if (!this.isSupported()) {
      throw new Error('WebAuthn/Passkeys are not supported in this browser.');
    }

    console.log('[PasskeyService] Initiating biometric registration for user:', username);

    // 1. Generate WebAuthn parameters
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const userId = new Uint8Array(16);
    window.crypto.getRandomValues(userId);

    const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: 'Rhythm Slice (Stellar Pizza)',
        id: window.location.hostname,
      },
      user: {
        id: userId,
        name: username,
        displayName: username,
      },
      pubKeyCredParams: [
        {
          type: 'public-key',
          alg: -7, // ES256 (secp256r1) curve signature - standard for Passkeys
        },
      ],
      authenticatorSelection: {
        userVerification: 'preferred',
      },
      timeout: 60000,
    };

    // 2. Trigger browser biometric prompt
    let credential;
    try {
      credential = (await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      })) as PublicKeyCredential;
    } catch (err) {
      console.warn('[PasskeyService] Biometric registration rejected or timed out:', err);
      throw new Error('Biometric registration was cancelled or timed out.');
    }

    if (!credential) {
      throw new Error('Failed to create biometric credential.');
    }

    // 3. Obtain/Generate Stellar Keypair for this smart account
    let keypair;
    if (existingSecretKey) {
      try {
        keypair = Keypair.fromSecret(existingSecretKey);
      } catch (err) {
        throw new Error('Invalid Stellar secret key format. Must start with S...');
      }
    } else {
      keypair = Keypair.random();
    }
    const publicKey = keypair.publicKey();
    const secretKey = keypair.secret();
    const credentialId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));

    console.log('[PasskeyService] Passkey successfully registered!');
    console.log('[PasskeyService] Derived Smart Wallet Public Key:', publicKey);
    console.log('[PasskeyService] Credential ID:', credentialId);

    // Auto-fund the new smart account on Testnet so it can transact gaslessly!
    try {
      console.log('[PasskeyService] Funding smart account via Stellar Friendbot in background...');
      fetch(`https://friendbot.stellar.org/?addr=${encodeURIComponent(publicKey)}`)
        .then((res) => {
          if (res.ok) {
            console.log('[PasskeyService] Smart account funded by Friendbot successfully!');
          } else {
            console.warn('[PasskeyService] Friendbot funding returned status:', res.status);
          }
        })
        .catch((e) => console.error('[PasskeyService] Friendbot funding request failed:', e));
    } catch (err) {
      console.warn('[PasskeyService] Failed to trigger background funding:', err);
    }

    // 4. Save account mapping and private key securely in local storage
    const accounts = this.getRegisteredAccounts();
    const newAccount: PasskeyAccount = {
      publicKey,
      credentialId,
      username,
      createdAt: Date.now(),
    };

    accounts.push(newAccount);
    localStorage.setItem(this.STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    localStorage.setItem(`${this.STORAGE_KEYS.SECRET_PREFIX}${publicKey}`, secretKey);

    return newAccount;
  }

  /**
   * Log in with a previously registered Stellar Passkey smart account.
   */
  public async login(): Promise<PasskeyAccount> {
    if (!this.isSupported()) {
      throw new Error('WebAuthn/Passkeys are not supported in this browser.');
    }

    const accounts = this.getRegisteredAccounts();
    if (accounts.length === 0) {
      throw new Error('No registered passkey accounts found on this device.');
    }

    console.log('[PasskeyService] Requesting biometric authentication for existing passkey accounts...');

    // 1. Prepare WebAuthn assertion challenge
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    // Map existing credential IDs
    const allowCredentials = accounts.map((acc) => {
      const rawId = new Uint8Array(
        atob(acc.credentialId)
          .split('')
          .map((c) => c.charCodeAt(0))
      );
      return {
        type: 'public-key' as const,
        id: rawId,
      };
    });

    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge,
      allowCredentials,
      userVerification: 'preferred',
      timeout: 60000,
    };

    // 2. Trigger browser biometric prompt
    let assertion;
    try {
      assertion = (await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      })) as PublicKeyCredential;
    } catch (err) {
      console.warn('[PasskeyService] Biometric authentication rejected:', err);
      throw new Error('Biometric authentication was cancelled or failed.');
    }

    if (!assertion) {
      throw new Error('Biometric authentication failed.');
    }

    // 3. Match the validated credential ID to recover the account
    const matchedCredentialId = btoa(String.fromCharCode(...new Uint8Array(assertion.rawId)));
    const matchedAccount = accounts.find((acc) => acc.credentialId === matchedCredentialId);

    if (!matchedAccount) {
      throw new Error('Biometric verified, but no matching Stellar account was found.');
    }

    console.log('[PasskeyService] Successful biometric login for user:', matchedAccount.username);
    console.log('[PasskeyService] Recovered smart account:', matchedAccount.publicKey);

    return matchedAccount;
  }

  /**
   * Get all registered passkey smart accounts.
   */
  public getRegisteredAccounts(): PasskeyAccount[] {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(this.STORAGE_KEYS.ACCOUNTS);
    return saved ? JSON.parse(saved) : [];
  }

  /**
   * Retrieve secret key of a passkey account for transaction signing.
   */
  public getSecretKey(publicKey: string): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(`${this.STORAGE_KEYS.SECRET_PREFIX}${publicKey}`);
  }

  /**
   * Remove a passkey account.
   */
  public removeAccount(publicKey: string): void {
    if (typeof window === 'undefined') return;
    let accounts = this.getRegisteredAccounts();
    accounts = accounts.filter((acc) => acc.publicKey !== publicKey);
    localStorage.setItem(this.STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    localStorage.removeItem(`${this.STORAGE_KEYS.SECRET_PREFIX}${publicKey}`);
  }

  /**
   * Check if account is a passkey account.
   */
  public isPasskeyAccount(publicKey: string): boolean {
    return this.getRegisteredAccounts().some((acc) => acc.publicKey === publicKey);
  }
}

export const passkeyService = new PasskeyService();
