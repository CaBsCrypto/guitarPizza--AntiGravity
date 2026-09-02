import React from 'react';
import './ChainSwitcher.css';

export function ChainSwitcher() {
  return (
    <div className="chain-switcher-container">
      <div
        className="chain-switcher-pill chain-solana"
        title="Red Blockchain Activa: Solana Devnet (Anchor + Metaplex + SPL)"
        style={{ cursor: 'default' }}
      >
        <span className="chain-indicator-dot"></span>
        <span className="chain-name-text">◎ SOLANA DEVNET</span>
      </div>
    </div>
  );
}

