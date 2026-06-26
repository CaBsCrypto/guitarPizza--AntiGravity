import { useState, useEffect, useCallback } from 'react';
import { WalletStandalone } from './WalletStandalone';
import type { Page } from '../types/navigation';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Keep state in sync with actual fullscreen changes (e.g. user presses Escape)
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Fullscreen API not supported or denied — silently ignore
    }
  }, []);

  return (
    <div className={`rs-shell ${currentPage === 'game' ? 'rs-game-mode' : ''}`}>
      {currentPage !== 'game' && (
        <header className="rs-header">

          {/* Brand — left */}
          <button className="rs-brand" onClick={() => onNavigate('home')} type="button">
            <span className="rs-brand-title">RHYTHM SLICE</span>
            <span className="rs-brand-tagline">VERIFICHIAMO. NON FIDIAMO.</span>
          </button>

          {/* Right controls */}
          <div className="rs-header-right">
            <span className="rs-network-pill">● TESTNET</span>
            <WalletStandalone />
            {/* Fullscreen button — solo mobile */}
            <button
              type="button"
              className="rs-fullscreen-btn"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
              title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            >
              {isFullscreen ? '⊠' : '⛶'}
            </button>
            <button
              type="button"
              className="rs-play-btn"
              onClick={() => onNavigate('game')}
            >
              🔥 PLAY NOW
            </button>
          </div>

        </header>
      )}

      <main className={`rs-main ${currentPage === 'game' ? 'rs-game-mode' : ''}`}>{children}</main>

      {/* Floating fullscreen button in game mode — solo mobile */}
      {currentPage === 'game' && (
        <button
          type="button"
          className="rs-fullscreen-fab"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
        >
          {isFullscreen ? '⊠' : '⛶'}
        </button>
      )}

      {currentPage !== 'game' && (
        <footer className="rs-footer">
          <span>Rhythm Slice · Stellar Hacks: ZK Gaming 2026</span>
          <span className="rs-footer-quote">"The Don doesn't take your word for it. Show the receipt."</span>
        </footer>
      )}
    </div>
  );
}
