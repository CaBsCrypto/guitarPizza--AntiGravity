import { useState } from 'react';
import { GuitarPizzaGame } from '../games/guitar-pizza/GuitarPizzaGame';
import { useWallet } from '@/hooks/useWallet';
import './GamesCatalog.css';

interface GamesCatalogProps {
  onBack?: () => void;
}

export function GamesCatalog({ onBack }: GamesCatalogProps) {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const { publicKey, isConnected, isConnecting, error } = useWallet();

  const userAddress = publicKey ?? '';

  const handleBackToLibrary = () => {
    setSelectedGame(null);
  };

  if (selectedGame === 'guitar-pizza') {
    return (
      <GuitarPizzaGame
        userAddress={userAddress}
        onGameComplete={(score) => console.log('Rhythm Slice score:', score)}
        onBack={handleBackToLibrary}
      />
    );
  }

  return (
    <div className="library-page">
      <div className="library-header">
        {onBack ? (
          <button className="btn-secondary" onClick={onBack}>
            Back to Studio
          </button>
        ) : null}
        <div className="library-intro">
          <h2>Games Library</h2>
          <p>Play Rhythm Slice — ZK-verified on Stellar Testnet.</p>
        </div>
      </div>

      {!isConnected && (
        <div className="card wallet-banner">
          {error ? (
            <>
              <h3>Wallet Connection Error</h3>
              <p>{error}</p>
            </>
          ) : (
            <>
              <h3>{isConnecting ? 'Connecting...' : 'Connect Freighter Wallet'}</h3>
              <p>Connect your Freighter wallet (Testnet) to submit scores on-chain.</p>
            </>
          )}
        </div>
      )}

      <div className="games-grid">
        <button
          key="guitar-pizza"
          className="game-card featured-game"
          type="button"
          onClick={() => setSelectedGame('guitar-pizza')}
        >
          <div className="game-card-header">
            <span className="game-emoji">🍕</span>
            <span className="game-title">Rhythm Slice</span>
          </div>
          <p className="game-description">
            ZK-verified rhythm game — hit notes, complete pizzas, seal your score on Stellar.
          </p>
          <div className="game-tags">
            <span className="game-tag">Single player</span>
            <span className="game-tag">Rhythm</span>
            <span className="game-tag">ZK</span>
          </div>
          <div className="game-cta">Launch Game</div>
        </button>
      </div>
    </div>
  );
}
