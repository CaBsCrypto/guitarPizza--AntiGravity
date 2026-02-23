import { useWallet } from '@/hooks/useWallet';
import type { Page } from '../types/navigation';
import './HomePage.css';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { isConnected } = useWallet();

  return (
    <div className="rs-home">

      {/* ── HERO ── */}
      <section className="rs-hero">
        <div className="rs-hero-eyebrow">NEW YORK · 1984 · THE FIVE FAMILIES CONTROL THE CHEESE</div>
        <h1 className="rs-hero-title">
          <span className="rs-title-main">RHYTHM</span>
          <span className="rs-title-accent">SLICE</span>
        </h1>
        <p className="rs-hero-tagline">
          A ZK-verified rhythm game where every score is <em>proven</em>, not just recorded.<br />
          Hit notes. Complete pizzas. Show the receipt.
        </p>

        <button
          type="button"
          className="rs-cta-play"
          onClick={() => onNavigate('game')}
        >
          ▶ PLAY NOW
        </button>

        {!isConnected && (
          <p className="rs-hero-hint">↑ Connect your Freighter wallet (Testnet) to submit scores on-chain</p>
        )}
      </section>

      {/* ── ZK FLOW ── */}
      <section className="rs-zk-flow">
        <div className="rs-zk-step">
          <div className="rs-zk-num">01</div>
          <div className="rs-zk-icon">🎵</div>
          <div className="rs-zk-label">PLAY</div>
          <div className="rs-zk-desc">Hit notes & bake pizzas to the beat</div>
        </div>

        <div className="rs-zk-arrow">→</div>

        <div className="rs-zk-step">
          <div className="rs-zk-num">02</div>
          <div className="rs-zk-icon">🔐</div>
          <div className="rs-zk-label">PROVE</div>
          <div className="rs-zk-desc">RISC Zero circuit verifies every input</div>
        </div>

        <div className="rs-zk-arrow">→</div>

        <div className="rs-zk-step">
          <div className="rs-zk-num">03</div>
          <div className="rs-zk-icon">⛓️</div>
          <div className="rs-zk-label">SEAL</div>
          <div className="rs-zk-desc">Score sealed on Stellar Soroban — forever</div>
        </div>
      </section>

      {/* ── CONTRACTS ── */}
      <section className="rs-contracts-section">
        <h2 className="rs-contracts-title">Live Contracts on Testnet</h2>
        <div className="rs-contracts">
          <div className="rs-contract-row">
            <span className="rs-contract-name">guitar-pizza</span>
            <code className="rs-contract-addr">CADIKXHE6RAW4LDGV6MNTSDEK5JKCNFWUQLCYUZA7DDTOIMF6PTVAMTH</code>
          </div>
          <div className="rs-contract-row">
            <span className="rs-contract-name">zk-leaderboard</span>
            <code className="rs-contract-addr">CAFKIEE76S5LHA2QJ3PYU7WW2VSCYCW2FDLCC2RTQLBTZRYTL5UL5PYV</code>
          </div>
          <div className="rs-contract-row">
            <span className="rs-contract-name">achievement-vault</span>
            <code className="rs-contract-addr">CCGVC6WRVP5BNFVBQRZ3KNGTSMR37QHGAZ76NB7FXUT4LSGORTPAERVC</code>
          </div>
          <div className="rs-contract-row">
            <span className="rs-contract-name">daily-recipe</span>
            <code className="rs-contract-addr">CBWPTLNG5BZQUWQYRBTRGUARM7XUEUASASWMGLPIRKSNNVO7R4K3HOVN</code>
          </div>
          <div className="rs-contract-row rs-contract-hub">
            <span className="rs-contract-name">game-hub</span>
            <code className="rs-contract-addr">CB4VZAT2U3UC6XFK3N23SKRF2NDCMP3QHJYMCHHFMZO7MRQO6DQ2EMYG</code>
          </div>
        </div>
      </section>

    </div>
  );
}
