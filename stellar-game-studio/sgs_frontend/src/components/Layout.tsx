import { WalletStandalone } from './WalletStandalone';
import { ChainSwitcher } from './ChainSwitcher';
import type { Page } from '../types/navigation';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  return (
    <div className={`rs-shell ${currentPage === 'game' ? 'rs-game-mode' : ''}`}>
      <header className="rs-header">

        {/* Brand & SpicyCrust Portal Link — left */}
        <div className="rs-header-left">
          <a
            href="https://spicycrust.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rs-spicycrust-btn"
            title="Volver a SpicyCrust.com / Ver más juegos"
          >
            <span className="rs-spicycrust-icon">🍕</span>
            <span className="rs-spicycrust-text">Volver a SpicyCrust</span>
            <span className="rs-spicycrust-arrow">↗</span>
          </a>

          <button className="rs-brand" onClick={() => onNavigate('home')} type="button" title="Volver al Inicio">
            <span className="rs-brand-title">RHYTHM SLICE</span>
            <span className="rs-brand-tagline">VERIFICHIAMO. NON FIDIAMO.</span>
          </button>
        </div>

        {/* Right controls */}
        <div className="rs-header-right">
          <ChainSwitcher />
          <WalletStandalone />
          {currentPage !== 'game' && (
            <button
              type="button"
              className="rs-play-btn"
              onClick={() => onNavigate('game')}
            >
              🔥 PLAY NOW
            </button>
          )}
        </div>

      </header>

      <main className={`rs-main ${currentPage === 'game' ? 'rs-game-mode' : ''}`}>{children}</main>

      {currentPage !== 'game' && (
        <footer className="rs-footer">
          <span>Rhythm Slice · Stellar Hacks: ZK Gaming 2026</span>
          <span className="rs-footer-quote">"The Don doesn't take your word for it. Show the receipt."</span>
        </footer>
      )}
    </div>
  );
}
