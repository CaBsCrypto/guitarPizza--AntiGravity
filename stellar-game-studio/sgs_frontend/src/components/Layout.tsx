import { WalletStandalone } from './WalletStandalone';
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
        <button className="rs-brand" onClick={() => onNavigate('home')} type="button">
          <span className="rs-brand-title">RHYTHM SLICE</span>
          <span className="rs-brand-tagline">VERIFICHIAMO. NON FIDIAMO.</span>
        </button>

        {/* Right controls */}
        <div className="rs-header-right">
          <span className="rs-network-pill">● TESTNET</span>

          <WalletStandalone />
          <button
            type="button"
            className={`rs-play-btn ${currentPage === 'game' ? 'active' : ''}`}
            onClick={() => onNavigate('game')}
          >
            {currentPage === 'game' ? '🍕 IN KITCHEN' : '🔥 PLAY NOW'}
          </button>
        </div>

      </header>

      <main className={`rs-main ${currentPage === 'game' ? 'rs-game-mode' : ''}`}>{children}</main>

      <footer className="rs-footer">
        <span>Rhythm Slice · Stellar Hacks: ZK Gaming 2026</span>
        <span className="rs-footer-quote">"The Don doesn't take your word for it. Show the receipt."</span>
      </footer>
    </div>
  );
}
