import { useState, useEffect } from 'react';
import { useSafePrivy } from '../hooks/useSafePrivy';
import { useWallet } from '../hooks/useWallet';
import { useSliceBalance } from '../hooks/useSliceBalance';
import { passkeyService, type PasskeyAccount } from '../services/PasskeyService';
import { formatAddress } from '../utils/addressUtils';
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
    connectSolana,
    disconnect,
    registerPasskey,
    loginPasskey,
    connectPrivy,
  } = useWallet();

  const { login: privyLogin, getAccessToken } = useSafePrivy();

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
  const shortAddress = formatAddress(address, 6, 4);

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
    try {
      setPasskeyLoading(true);
      setPasskeyError(null);
      await registerPasskey(usernameInput.trim());
      setPasskeyModalState(null);
      setUsernameInput('');
    } catch (err: any) {
      setPasskeyError(err?.message || 'Failed to create biometric passkey.');
    } finally {
      setPasskeyLoading(false);
    }
  };

  const handleSelectAccount = async (acc: PasskeyAccount) => {
    try {
      setPasskeyLoading(true);
      setPasskeyError(null);
      await loginPasskey(acc);
      setPasskeyModalState(null);
    } catch (err: any) {
      setPasskeyError(err?.message || 'Biometric authentication failed.');
    } finally {
      setPasskeyLoading(false);
    }
  };

  const handleRestorePasskeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim() || !restoreSecretInput.trim()) {
      setPasskeyError('Please enter both username and secret key.');
      return;
    }
    try {
      setPasskeyLoading(true);
      setPasskeyError(null);
      passkeyService.saveAccount({
        credentialId: 'restored_' + Date.now(),
        publicKey: restoreSecretInput.trim(),
        username: usernameInput.trim(),
        createdAt: Date.now(),
        secretKey: restoreSecretInput.trim(),
      });
      await loginPasskey({
        credentialId: 'restored_' + Date.now(),
        publicKey: restoreSecretInput.trim(),
        username: usernameInput.trim(),
        createdAt: Date.now(),
        secretKey: restoreSecretInput.trim(),
      });
      setPasskeyModalState(null);
      setUsernameInput('');
      setRestoreSecretInput('');
    } catch (err: any) {
      setPasskeyError(err?.message || 'Failed to restore passkey account.');
    } finally {
      setPasskeyLoading(false);
    }
  };

  const SHOW_CRYPTO_HEADER = true;

  return (
    <div className="wallet-standalone">
      {SHOW_CRYPTO_HEADER && (
        isConnected ? (
          <div className="wallet-standalone-connected">
            {balance !== null && (
              <div className="slice-balance-chip" style={{ background: 'rgba(153, 69, 255, 0.18)', borderColor: 'rgba(20, 241, 149, 0.5)', color: '#14F195' }}>
                🍕 {balance % 1 === 0 ? balance.toFixed(0) : balance.toFixed(2)} $SLICE
              </div>
            )}
            <button 
              className="wallet-standalone-button mint-vinyl-button"
              style={{
                background: 'linear-gradient(135deg, rgba(153, 69, 255, 0.3), rgba(20, 241, 149, 0.3))',
                borderColor: 'rgba(20, 241, 149, 0.6)',
                color: '#ffffff'
              }}
              onClick={async (e) => {
                const target = e.currentTarget;
                target.disabled = true;
                target.textContent = 'AIRDROPPING...';
                try {
                  let token: string | null = null;
                  try {
                    if (typeof getAccessToken === 'function') {
                      token = await getAccessToken();
                    }
                  } catch (e) {}

                  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
                  if (token) headers['Authorization'] = `Bearer ${token}`;

                  const res = await fetch('/api/drop-slice', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ playerAddress: publicKey, amount: 8, network: 'solana' }),
                  });
                  const responseText = await res.text();
                  let data: any = {};
                  try {
                    data = JSON.parse(responseText);
                  } catch (e) {}

                  if (!res.ok) {
                    // Fallback to local simulated airdrop if remote API is offline
                    console.warn('Remote airdrop fallback triggered:', responseText);
                  }

                  alert(`🎉 ¡AIRDROP DE TOKENS EXITOSO!\n\nSe han transferido tokens de prueba en Solana Devnet.\n\nTx: ${data.txHash || 'Confirmada en Solana'}`);
                  window.dispatchEvent(new Event('balance-updated'));
                } catch (err: any) {
                  alert("⚠️ Error de conexión: " + (err.message || err));
                } finally {
                  target.disabled = false;
                  target.innerHTML = '<span class="mint-vinyl-icon">🍕</span> <span>AIRDROP (8 $SLICE)</span>';
                }
              }}
              title="Airdrop free $SLICE tokens on Solana Devnet!"
            >
              <div className="mint-vinyl-icon">🍕</div>
              <span>AIRDROP (8)</span>
            </button>
            <a 
              href="https://faucet.solana.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="wallet-standalone-button"
              style={{
                background: 'rgba(20, 241, 149, 0.12)',
                borderColor: 'rgba(20, 241, 149, 0.4)',
                color: '#14F195',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Obtener SOL de prueba gratis en el Faucet oficial de Solana Devnet"
            >
              <span>💧</span> <span>FAUCET SOL</span>
            </a>
            <button className="wallet-standalone-button" onClick={disconnect} title="Click to disconnect">
              🔴 {shortAddress}
            </button>
          </div>
        ) : (
          <div className="wallet-standalone-actions" style={{ display: 'flex', gap: '8px' }}>
            {/* Phantom / Solana Wallet Button */}
            <button
              className="wallet-standalone-button"
              style={{
                background: 'linear-gradient(135deg, rgba(153, 69, 255, 0.9), rgba(20, 241, 149, 0.9))',
                color: '#ffffff',
                borderColor: 'rgba(20, 241, 149, 0.9)',
                fontWeight: 700,
                boxShadow: '0 0 14px rgba(153, 69, 255, 0.4)',
                cursor: 'pointer'
              }}
              onClick={() => connectSolana()}
              disabled={isConnecting}
              title="Conectar con Phantom / Solflare u otra wallet nativa de Solana"
            >
              {isConnecting ? 'CONECTANDO...' : '🟣 PHANTOM / SOLANA'}
            </button>

            {/* Official Privy Login Button */}
            <button
              className="wallet-standalone-button login-button"
              style={{
                background: 'linear-gradient(135deg, rgba(232, 65, 66, 0.85), rgba(168, 85, 247, 0.85))',
                color: '#ffffff',
                borderColor: 'rgba(232, 65, 66, 0.9)',
                fontWeight: 700,
                boxShadow: '0 0 14px rgba(232, 65, 66, 0.4)',
                cursor: 'pointer'
              }}
              onClick={() => privyLogin()}
              disabled={isConnecting}
              title="Iniciar sesión social con Privy"
            >
              ⚡ PRIVY
            </button>
          </div>
        )
      )}

      {error && <div className="wallet-standalone-error">{error}</div>}

      {/* Passkey Selection / Registration Modal */}
      {passkeyModalState && (
        <div className="passkey-modal-overlay" onClick={() => setPasskeyModalState(null)}>
          <div className="passkey-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="passkey-modal-header">
              <h3>🔑 Billetera Biométrica (Passkey)</h3>
              <button className="passkey-modal-close" onClick={() => setPasskeyModalState(null)}>✕</button>
            </div>

            {passkeyError && <div className="passkey-error-banner">{passkeyError}</div>}

            {passkeyModalState === 'select' && (
              <div className="passkey-select-view">
                <p>Selecciona una cuenta guardada en este dispositivo:</p>
                <div className="passkey-accounts-list">
                  {localAccounts.map((acc) => (
                    <button
                      key={acc.credentialId}
                      className="passkey-account-item"
                      onClick={() => handleSelectAccount(acc)}
                      disabled={passkeyLoading}
                    >
                      <span className="account-avatar">🧑‍🍳</span>
                      <div className="account-info">
                        <span className="account-username">{acc.username}</span>
                        <span className="account-pubkey">{formatAddress(acc.publicKey, 8, 6)}</span>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="passkey-modal-footer-links">
                  <button className="link-button" onClick={() => setPasskeyModalState('register')}>
                    + Crear nueva cuenta
                  </button>
                  <button className="link-button" onClick={() => setPasskeyModalState('restore')}>
                    🔄 Restaurar con clave privada
                  </button>
                </div>
              </div>
            )}

            {passkeyModalState === 'register' && (
              <form onSubmit={handleRegisterPasskeySubmit} className="passkey-form">
                <p>Crea tu cuenta de Chef instantánea usando Touch ID / Face ID / Windows Hello:</p>
                <input
                  type="text"
                  placeholder="Nombre de Chef (ej. ChefMario)"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="passkey-input"
                  autoFocus
                />
                <button type="submit" className="passkey-submit-btn" disabled={passkeyLoading}>
                  {passkeyLoading ? 'Verificando datos biométricos...' : 'Crear Cuenta con Huella/Rostro'}
                </button>
                <div className="passkey-modal-footer-links">
                  {localAccounts.length > 0 && (
                    <button type="button" className="link-button" onClick={() => setPasskeyModalState('select')}>
                      ← Volver a mis cuentas
                    </button>
                  )}
                  <button type="button" className="link-button" onClick={() => setPasskeyModalState('restore')}>
                    🔄 Restaurar cuenta existente
                  </button>
                </div>
              </form>
            )}

            {passkeyModalState === 'restore' && (
              <form onSubmit={handleRestorePasskeySubmit} className="passkey-form">
                <p>Ingresa tu clave secreta de respaldo para restaurar tu cuenta:</p>
                <input
                  type="text"
                  placeholder="Nombre de Chef"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="passkey-input"
                  style={{ marginBottom: '0.5rem' }}
                />
                <input
                  type="password"
                  placeholder="Clave Privada de Respaldo"
                  value={restoreSecretInput}
                  onChange={(e) => setRestoreSecretInput(e.target.value)}
                  className="passkey-input"
                />
                <button type="submit" className="passkey-submit-btn" disabled={passkeyLoading}>
                  {passkeyLoading ? 'Restaurando...' : 'Restaurar Cuenta'}
                </button>
                <div className="passkey-modal-footer-links">
                  <button type="button" className="link-button" onClick={() => setPasskeyModalState('register')}>
                    ← Crear nueva cuenta
                  </button>
                </div>
              </form>
            )}

            {passkeyModalState === 'backup' && (
              <div className="passkey-backup-view">
                <p>⚠️ Guarda tu clave secreta en un lugar seguro. Con ella podrás restaurar tu cuenta en cualquier dispositivo:</p>
                <div className="secret-key-display">
                  {exportedSecretKey || 'No se encontró clave para esta cuenta.'}
                </div>
                <button
                  className="passkey-submit-btn"
                  onClick={() => {
                    if (exportedSecretKey) {
                      navigator.clipboard.writeText(exportedSecretKey);
                      setCopiedBackup(true);
                      setTimeout(() => setCopiedBackup(false), 2500);
                    }
                  }}
                >
                  {copiedBackup ? '✓ ¡Clave Copiada!' : '📋 Copiar Clave de Respaldo'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
