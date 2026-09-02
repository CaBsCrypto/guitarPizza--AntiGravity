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
            <div className="ws-chip-balance">
              🍕 {balance !== null ? (balance % 1 === 0 ? balance.toFixed(0) : balance.toFixed(2)) : '50'} $SLICE
            </div>
            <button 
              className="ws-btn ws-btn-airdrop"
              onClick={async (e) => {
                const target = e.currentTarget;
                target.disabled = true;
                target.textContent = 'AIRDROPPING...';
                try {
                  const adapter = ChainManager.getInstance().getAdapter();
                  const airdropResult = await adapter.requestSliceAirdrop(publicKey, 8);
                  
                  try {
                    let token: string | null = null;
                    if (typeof getAccessToken === 'function') token = await getAccessToken();
                    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
                    if (token) headers['Authorization'] = `Bearer ${token}`;
                    await fetch('/api/drop-slice', {
                      method: 'POST',
                      headers,
                      body: JSON.stringify({ playerAddress: publicKey, amount: 8, network: 'solana' }),
                    }).catch(() => {});
                  } catch (e) {}

                  alert(`🎉 ¡AIRDROP DE TOKENS EXITOSO!\n\nSe han transferido +8 $SLICE y SOL en Solana Devnet.\n\nTx: ${airdropResult.txHash || 'Confirmada'}`);
                  window.dispatchEvent(new Event('balance-updated'));
                } catch (err: any) {
                  alert("⚠️ Error en airdrop: " + (err.message || err));
                } finally {
                  target.disabled = false;
                  target.innerHTML = '<span>🍕</span> <span>+8 $SLICE</span>';
                }
              }}
              title="Airdrop free $SLICE tokens on Solana Devnet!"
            >
              <span>🍕</span>
              <span>+8 $SLICE</span>
            </button>
            <a 
              href="https://faucet.solana.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="ws-btn ws-btn-faucet"
              title="Obtener SOL de prueba gratis en el Faucet oficial de Solana Devnet"
            >
              <span>💧 FAUCET</span>
            </a>
            <button className="ws-btn ws-btn-address" onClick={disconnect} title="Click para desconectar wallet">
              <span className="ws-dot-connected"></span>
              <span>{shortAddress}</span>
            </button>
          </div>
        ) : (
          <div className="wallet-standalone-actions">
            {/* Clean Solana Connect Button */}
            <button
              className="ws-btn ws-btn-phantom"
              onClick={() => connectSolana()}
              disabled={isConnecting}
              title="Conectar billetera Solana (Phantom, Solflare, etc.)"
            >
              <span className="ws-phantom-icon">🟣</span>
              <span>{isConnecting ? 'CONECTANDO...' : 'CONECTAR WALLET'}</span>
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
