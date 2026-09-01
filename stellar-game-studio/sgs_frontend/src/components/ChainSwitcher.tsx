import React, { useState } from 'react';
import { useActiveChain } from '../adapters/ChainManager';
import type { SupportedChainId } from '../adapters/IBlockchainAdapter';
import './ChainSwitcher.css';

export function ChainSwitcher() {
  const { activeChain, capabilities, setActiveChain } = useActiveChain();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectChain = (chain: SupportedChainId) => {
    if (chain !== activeChain) {
      setActiveChain(chain, true); // reload to re-init providers cleanly
    }
    setIsOpen(false);
  };

  const getPillLabel = () => {
    switch (activeChain) {
      case 'solana':
        return '◎ SOLANA DEVNET';
      case 'stellar':
        return '🚀 STELLAR';
      default:
        return '◎ SOLANA DEVNET';
    }
  };

  return (
    <div className="chain-switcher-container">
      <button
        type="button"
        className={`chain-switcher-pill chain-${activeChain}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Red Blockchain Activa (Solana Devnet)"
      >
        <span className="chain-indicator-dot"></span>
        <span className="chain-name-text">{getPillLabel()}</span>
        <span className="chain-arrow">▾</span>
      </button>

      {isOpen && (
        <>
          <div className="chain-backdrop" onClick={() => setIsOpen(false)} />
          <div className="chain-dropdown-menu">
            <div className="chain-dropdown-header">
              <span>Seleccionar Red Blockchain</span>
            </div>

            <div
              className={`chain-option-card ${activeChain === 'solana' ? 'selected' : ''}`}
              onClick={() => handleSelectChain('solana')}
            >
              <div className="chain-option-icon">◎</div>
              <div className="chain-option-info">
                <div className="chain-option-title">
                  Solana Devnet
                  {activeChain === 'solana' && <span className="active-tag">ACTIVO</span>}
                </div>
                <div className="chain-option-desc">SPL Tokens · Anchor PDAs · Metaplex NFTs · Phantom / Privy</div>
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
              <small>Rhythm Slice · Solana Ecosystem 2026</small>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
