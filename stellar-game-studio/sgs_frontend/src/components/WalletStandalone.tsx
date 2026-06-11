import { useState, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useSliceBalance } from '../hooks/useSliceBalance';
import { passkeyService, type PasskeyAccount } from '../services/PasskeyService';
import { useWalletStore } from '../store/walletSlice';
import './WalletStandalone.css';

export function WalletStandalone() {
  const {
    publicKey,
    walletType,
    isConnected,
    isConnecting,
    error,
    network,
    connect,
    disconnect,
    registerPasskey,
    loginPasskey,
  } = useWallet();

  const { balance, refresh: refreshBalance } = useSliceBalance();

  // Local state for Passkey UI Modal flow
  const [passkeyModalState, setPasskeyModalState] = useState<'select' | 'register' | 'restore' | 'backup' | null>(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [restoreSecretInput, setRestoreSecretInput] = useState('');
  const [exportedSecretKey, setExportedSecretKey] = useState<string | null>(null);
  const [localAccounts, setLocalAccounts] = useState<PasskeyAccount[]>([]);
  const [passkeyLoading, setPasskeyLoading] = useState(false);
  const [passkeyError, setPasskeyError] = useState<string | null>(null);
  const [copiedBackup, setCopiedBackup] = useState(false);
  const [minting, setMinting] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLocalAccounts(passkeyService.getRegisteredAccounts());
    }
  }, [isConnected, passkeyModalState]);

  useEffect(() => {
    const handleBalanceUpdated = () => {
      refreshBalance();
    };
    window.addEventListener('balance-updated', handleBalanceUpdated);
    return () => window.removeEventListener('balance-updated', handleBalanceUpdated);
  }, [refreshBalance]);

  const address = typeof publicKey === 'string' ? publicKey : '';
  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  const handleOpenPasskey = () => {
    setPasskeyError(null);
    const saved = passkeyService.getRegisteredAccounts();
    if (saved.length > 0) {
      setPasskeyModalState('select');
    } else {
      setPasskeyModalState('register');
    }
  };

  const handleRegisterPasskeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) {
      setPasskeyError('Please enter a username.');
      return;
    }
    setPasskeyLoading(true);
    setPasskeyError(null);
    try {
      await registerPasskey(usernameInput.trim());
      setPasskeyModalState(null);
      setUsernameInput('');
    } catch (err: any) {
      setPasskeyError(err?.message || 'Biometric registration failed.');
    } finally {
      setPasskeyLoading(false);
    }
  };

  const handleRestorePasskeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) {
      setPasskeyError('Please enter a username.');
      return;
    }
    if (!restoreSecretInput.trim()) {
      setPasskeyError('Please enter your secret key.');
      return;
    }
    setPasskeyLoading(true);
    setPasskeyError(null);
    try {
      await registerPasskey(usernameInput.trim(), restoreSecretInput.trim());
      setPasskeyModalState(null);
      setUsernameInput('');
      setRestoreSecretInput('');
    } catch (err: any) {
      setPasskeyError(err?.message || 'Account restoration failed.');
    } finally {
      setPasskeyLoading(false);
    }
  };

  const handleLoginPasskeySelect = async () => {
    setPasskeyLoading(true);
    setPasskeyError(null);
    try {
      await loginPasskey();
      setPasskeyModalState(null);
    } catch (err: any) {
      setPasskeyError(err?.message || 'Biometric authentication failed.');
    } finally {
      setPasskeyLoading(false);
    }
  };



  return (
    <div className="wallet-standalone">
      {isConnected ? (
        <div className="wallet-standalone-connected">
          {balance !== null && (
            <div className="slice-balance-chip">
              🍕 {balance % 1 === 0 ? balance.toFixed(0) : balance.toFixed(2)} $SLICE
            </div>
          )}
          <button 
            className={`wallet-standalone-button mint-vinyl-button ${minting ? 'minting' : ''}`}
            onClick={async () => {
              if (minting) return;
              setMinting(true);
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 12000);
              try {
                const res = await fetch('/api/drop-oven', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ playerAddress: publicKey, isDevMint: true }),
                  signal: controller.signal
                });
                clearTimeout(timeoutId);
                const responseText = await res.text();
                let data: any = {};
                try {
                  data = JSON.parse(responseText);
                } catch (e) {}

                if (!res.ok) {
                  throw new Error(data.error || data.message || `HTTP ${res.status}: ${responseText.slice(0, 100)}`);
                }

                alert(
                  "🎉 ¡HORNO ACUÑADO EXITOSAMENTE!\n\n" +
                  "Se ha minteado tu nuevo NFT en Soroban Testnet.\n\n" +
                  (data.txHash ? `Tx Hash: ${data.txHash}\n\n` : '') +
                  "Dirígete a 'EL HORNO (VAULT)' -> 'Mi Colección' para equiparlo y multiplicar tus drops."
                );
                // Dispatch update to refresh lists on-screen
                window.dispatchEvent(new Event('collection-updated'));
              } catch (err: any) {
                clearTimeout(timeoutId);
                const errorMsg = err.name === 'AbortError' 
                  ? 'El servidor de Soroban o Vercel tardó demasiado en responder (Timeout). ¡Por favor intenta de nuevo!' 
                  : (err.message || err);
                alert("⚠️ Error de conexión: " + errorMsg);
              } finally {
                setMinting(false);
              }
            }}
            disabled={minting}
            title="Mint a free Oven NFT on Soroban Testnet!"
          >
            <div className="mint-vinyl-icon">💿</div>
            <span>{minting ? 'MINTING...' : 'MINT'}</span>
          </button>
          <button 
            className="wallet-standalone-button mint-vinyl-button"
            style={{
              background: 'rgba(0, 240, 255, 0.15)',
              borderColor: 'rgba(0, 240, 255, 0.4)',
              color: '#00f0ff'
            }}
            onClick={async (e) => {
              const target = e.currentTarget;
              target.disabled = true;
              target.textContent = 'AIRDROPPING...';
              try {
                const res = await fetch('/api/drop-slice', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ playerAddress: publicKey, amount: 8 }),
                });
                const responseText = await res.text();
                let data: any = {};
                try {
                  data = JSON.parse(responseText);
                } catch (e) {}

                if (!res.ok) {
                  throw new Error(data.error || data.message || `HTTP ${res.status}: ${responseText.slice(0, 100)}`);
                }

                alert(`🎉 ¡AIRDROP DE TOKENS EXITOSO!\n\nSe han transferido 8 $SLICE a tu wallet.\n\nTx Hash: ${data.txHash || 'Confirmada'}`);
                // Refresh balance chip visually using event dispatch
                window.dispatchEvent(new Event('balance-updated'));
              } catch (err: any) {
                alert("⚠️ Error de conexión: " + (err.message || err));
              } finally {
                target.disabled = false;
                target.innerHTML = '<span class="mint-vinyl-icon">🍕</span> <span>AIRDROP (8)</span>';
              }
            }}
            title="Airdrop 8 free $SLICE on Stellar Testnet!"
          >
            <div className="mint-vinyl-icon">🍕</div>
            <span>AIRDROP (8)</span>
          </button>
          <button className="wallet-standalone-button" onClick={disconnect}>
            {walletType === 'passkey' ? '🧑‍🍳 ' : ''}
            {shortAddress}
          </button>
          {walletType === 'passkey' && (
            <button
              className="wallet-standalone-button backup-button"
              style={{
                background: 'rgba(212, 175, 55, 0.15)',
                borderColor: 'rgba(212, 175, 55, 0.4)',
                color: '#DAA520',
                padding: '0.5rem 0.6rem',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
              onClick={() => {
                const sec = passkeyService.getSecretKey(publicKey || '');
                setExportedSecretKey(sec);
                setCopiedBackup(false);
                setPasskeyModalState('backup');
              }}
              title="Backup your Passkey Smart Wallet key"
            >
              <span className="backup-icon">🔑</span>
              <span className="backup-text">Backup</span>
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Main Wallet Connection Button (e.g. Freighter, Kit) */}
          <button
            className="wallet-standalone-button"
            onClick={() => connect().catch(() => undefined)}
            disabled={isConnecting}
          >
            {isConnecting && walletType === 'wallet' ? 'Connecting...' : 'Connect Wallet'}
          </button>

          {/* Passkey Biometric Smart Accounts Button */}
          {passkeyService.isSupported() && (
            <button
              className="wallet-standalone-button wallet-passkey-button"
              onClick={handleOpenPasskey}
              disabled={isConnecting}
            >
              🔑 Passkey
            </button>
          )}

          {/* Demo Mode Button */}
          <button
            className="wallet-standalone-button"
            style={{
              background: 'rgba(100, 80, 20, 0.25)',
              color: 'rgba(245, 220, 100, 0.85)',
              borderColor: 'rgba(180, 150, 30, 0.5)'
            }}
            onClick={() => {
              useWalletStore.getState().setWallet('G_DEMO_USER', 'dev-demo', 'dev');
            }}
            title="Play without connecting a real wallet"
          >
            🎭 Demo
          </button>
        </>
      )}

      {network && <div className="wallet-standalone-network">{network}</div>}
      {error && <div className="wallet-standalone-error">{error}</div>}

      {/* ── Passkey Selection & Creation Modals ── */}
      {passkeyModalState === 'select' && (
        <div className="passkey-modal-overlay">
          <div className="passkey-modal">
            <h3>Select Passkey Profile</h3>
            <p>Choose an existing biometric profile on this device to sign in instantly.</p>
            
            <div className="passkey-account-list">
              {localAccounts.map((acc) => (
                <div
                  key={acc.publicKey}
                  className="passkey-account-item"
                  onClick={handleLoginPasskeySelect}
                >
                  <div>
                    <div className="passkey-account-name">🧑‍🍳 {acc.username}</div>
                    <div className="passkey-account-address">
                      {acc.publicKey.slice(0, 8)}...{acc.publicKey.slice(-8)}
                    </div>
                  </div>
                  <span>⚡</span>
                </div>
              ))}
            </div>

            {passkeyError && <div className="wallet-standalone-error" style={{ marginBottom: '1rem', textAlign: 'left', maxWidth: 'none' }}>⚠️ {passkeyError}</div>}

            <div className="passkey-actions" style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button
                className="passkey-btn passkey-btn-secondary"
                onClick={() => setPasskeyModalState(null)}
                disabled={passkeyLoading}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                className="passkey-btn passkey-btn-secondary"
                onClick={() => {
                  setPasskeyError(null);
                  setUsernameInput('');
                  setRestoreSecretInput('');
                  setPasskeyModalState('restore');
                }}
                disabled={passkeyLoading}
                style={{ flex: 1, background: 'rgba(212,175,55,0.1)', color: '#DAA520', borderColor: 'rgba(212,175,55,0.3)' }}
              >
                🔄 Restore
              </button>
              <button
                className="passkey-btn passkey-btn-primary"
                onClick={() => setPasskeyModalState('register')}
                disabled={passkeyLoading}
                style={{ flex: 1 }}
              >
                + New Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {passkeyModalState === 'register' && (
        <div className="passkey-modal-overlay">
          <form className="passkey-modal" onSubmit={handleRegisterPasskeySubmit}>
            <h3>Create Passkey Smart Account</h3>
            <p>Register a local secure credential using your device's biometrics (TouchID/FaceID) to sign transactions completely gaslessly.</p>
            
            <input
              type="text"
              placeholder="Enter kitchen username (e.g. Tony)"
              className="passkey-input"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              disabled={passkeyLoading}
              autoFocus
            />

            {passkeyError && <div className="wallet-standalone-error" style={{ marginBottom: '1rem', textAlign: 'left', maxWidth: 'none' }}>⚠️ {passkeyError}</div>}

            <div className="passkey-actions">
              <button
                type="button"
                className="passkey-btn passkey-btn-secondary"
                onClick={() => {
                  setPasskeyModalState(localAccounts.length > 0 ? 'select' : null);
                  setUsernameInput('');
                }}
                disabled={passkeyLoading}
              >
                Back
              </button>
              <button
                type="submit"
                className="passkey-btn passkey-btn-primary"
                disabled={passkeyLoading}
              >
                {passkeyLoading ? 'Authenticating...' : '🔐 Create Passkey'}
              </button>
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => {
                  setPasskeyError(null);
                  setUsernameInput('');
                  setRestoreSecretInput('');
                  setPasskeyModalState('restore');
                }}>
              Already have an account? Import Backup
            </div>
          </form>
        </div>
      )}

      {passkeyModalState === 'restore' && (
        <div className="passkey-modal-overlay">
          <form className="passkey-modal" onSubmit={handleRestorePasskeySubmit}>
            <h3>Restore Smart Account</h3>
            <p>Input your kitchen username and your exported Stellar Secret Key (starts with 'S') to biometrically link it to this device.</p>
            
            <input
              type="text"
              placeholder="Enter kitchen username (e.g. Tony)"
              className="passkey-input"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              disabled={passkeyLoading}
              style={{ marginBottom: '0.6rem' }}
              autoFocus
            />

            <input
              type="password"
              placeholder="Enter Stellar Secret Key (starts with S...)"
              className="passkey-input"
              value={restoreSecretInput}
              onChange={(e) => setRestoreSecretInput(e.target.value)}
              disabled={passkeyLoading}
            />

            {passkeyError && <div className="wallet-standalone-error" style={{ marginBottom: '1rem', textAlign: 'left', maxWidth: 'none' }}>⚠️ {passkeyError}</div>}

            <div className="passkey-actions">
              <button
                type="button"
                className="passkey-btn passkey-btn-secondary"
                onClick={() => {
                  setPasskeyModalState(localAccounts.length > 0 ? 'select' : null);
                  setUsernameInput('');
                  setRestoreSecretInput('');
                }}
                disabled={passkeyLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="passkey-btn passkey-btn-primary"
                disabled={passkeyLoading}
                style={{ background: 'linear-gradient(135deg, #d4af37, #b8860b)', borderColor: '#b8860b' }}
              >
                {passkeyLoading ? 'Restoring...' : '🔄 Restore & Link'}
              </button>
            </div>
          </form>
        </div>
      )}

      {passkeyModalState === 'backup' && (
        <div className="passkey-modal-overlay">
          <div className="passkey-modal" style={{ maxWidth: '400px' }}>
            <h3>🔑 Passkey Backup Credentials</h3>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1.2rem' }}>
              Below is the raw secret key for your smart wallet. Store it in a highly secure, private location. Anyone with this key can access your assets!
            </p>

            <div style={{
              background: '#222',
              color: '#39FF14',
              fontFamily: 'monospace',
              padding: '0.8rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              wordBreak: 'break-all',
              textAlign: 'center',
              userSelect: 'all',
              border: '1px solid #333',
              marginBottom: '1rem'
            }}>
              {exportedSecretKey || 'ERROR: No key found'}
            </div>

            <div className="passkey-actions">
              <button
                className="passkey-btn passkey-btn-secondary"
                onClick={() => setPasskeyModalState(null)}
                style={{ flex: 1 }}
              >
                Close
              </button>
              <button
                className="passkey-btn passkey-btn-primary"
                onClick={() => {
                  if (exportedSecretKey) {
                    navigator.clipboard.writeText(exportedSecretKey);
                    setCopiedBackup(true);
                    setTimeout(() => setCopiedBackup(false), 2000);
                  }
                }}
                style={{ flex: 1, background: '#DAA520', borderColor: '#DAA520' }}
              >
                {copiedBackup ? '✓ Copied!' : '📋 Copy Key'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
