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

        {/* Brand — left */}
        <button className="rs-brand" onClick={() => onNavigate('home')} type="button" title="Volver al Inicio">
          <span className="rs-brand-title">RHYTHM SLICE</span>
          <span className="rs-brand-tagline">VERIFICHIAMO. NON FIDIAMO.</span>
        </button>

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
