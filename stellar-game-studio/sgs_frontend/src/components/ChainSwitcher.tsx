import React, { useState } from 'react';
import { useActiveChain } from '../adapters/ChainManager';
import './ChainSwitcher.css';

export function ChainSwitcher() {
  const { activeChain, capabilities, setActiveChain } = useActiveChain();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectChain = (chain: 'avalanche' | 'stellar') => {
    if (chain !== activeChain) {
      setActiveChain(chain, true); // reload to re-init providers cleanly
    }
    setIsOpen(false);
  };

  return (
    <div className="chain-switcher-container">
      <button
        type="button"
        className={`chain-switcher-pill chain-${activeChain}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Cambiar red Blockchain activa (Avalanche / Stellar)"
      >
        <span className="chain-indicator-dot"></span>
        <span className="chain-name-text">
          {activeChain === 'avalanche' ? '🔺 AVAX FUJI' : '🚀 STELLAR'}
        </span>
        <span className="chain-arrow">▾</span>
      </button>

      {isOpen && (
        <>
          <div className="chain-backdrop" onClick={() => setIsOpen(false)} />
          <div className="chain-dropdown-menu">
            <div className="chain-dropdown-header">
              <span>Seleccionar Red Multichain</span>
            </div>

            <div
              className={`chain-option-card ${activeChain === 'avalanche' ? 'selected' : ''}`}
              onClick={() => handleSelectChain('avalanche')}
            >
              <div className="chain-option-icon">🔺</div>
              <div className="chain-option-info">
                <div className="chain-option-title">
                  Avalanche Fuji
                  {activeChain === 'avalanche' && <span className="active-tag">ACTIVO</span>}
                </div>
                <div className="chain-option-desc">EVM · 7 Solidity Smart Contracts · Privy Wallets</div>
              </div>
            </div>

            <div
              className={`chain-option-card ${activeChain === 'stellar' ? 'selected' : ''}`}
              onClick={() => handleSelectChain('stellar')}
            >
              <div className="chain-option-icon">🚀</div>
              <div className="chain-option-info">
                <div className="chain-option-title">
                  Stellar Testnet
                  {activeChain === 'stellar' && <span className="active-tag">ACTIVO</span>}
                </div>
                <div className="chain-option-desc">Soroban Rust · 10 Contratos · Passkeys · Defindex</div>
              </div>
            </div>

            <div className="chain-dropdown-footer">
              <small>Demostración para Evaluadores & Grants</small>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
