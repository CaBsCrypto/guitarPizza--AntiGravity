import { useWallet } from '@/hooks/useWallet';
import type { Page } from '../types/navigation';
import './HomePage.css';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const BADGES = [
  { icon: '🎯', name: 'Perfect Run', desc: 'Zero misses — proven by ZK' },
  { icon: '🪤', name: 'Trap Master', desc: 'Every trap dodged — proven by ZK' },
  { icon: '🔥', name: 'Fever God', desc: '30s+ Fever Mode — proven by ZK' },
  { icon: '🍕', name: 'Iron Chef', desc: '5 full pizzas — proven by ZK' },
];

const ZK_FACTS = [
  { label: 'Score', detail: 'Mathematically derived from every input' },
  { label: 'Trap Avoidance', detail: 'Proves you didn\'t press — novel mechanic' },
  { label: 'Fever Time', detail: 'Circuit-verified, not server-trusted' },
  { label: 'Pizza Count', detail: 'Ingredient hits audited in the proof' },
];

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

        <div className="rs-hero-cta">
          <button
            type="button"
            className="rs-cta-primary"
            onClick={() => onNavigate('games')}
          >
            ▶ PLAY NOW
          </button>
          <a
            className="rs-cta-secondary"
            href="https://github.com/CaBsCrypto/guitarPizza--AntiGravity"
            target="_blank"
            rel="noreferrer"
          >
            VIEW SOURCE
          </a>
        </div>

        {!isConnected && (
          <p className="rs-hero-hint">↑ Connect your Freighter wallet (Testnet) to submit scores on-chain</p>
        )}
      </section>

      {/* ── HOW ZK WORKS ── */}
      <section className="rs-section">
        <h2 className="rs-section-title">How the Zero-Knowledge Proof Works</h2>
        <p className="rs-section-sub">
          Every game session generates a RISC Zero receipt. The smart contract verifies it before touching the blockchain.
          No proof → no score. No exceptions.
        </p>

        <div className="rs-flow">
          <div className="rs-flow-step">
            <span className="rs-flow-num">01</span>
            <strong>Play the game</strong>
            <span>Every key press and timing delta is logged client-side</span>
          </div>
          <div className="rs-flow-arrow">→</div>
          <div className="rs-flow-step">
            <span className="rs-flow-num">02</span>
            <strong>zkVM runs</strong>
            <span>RISC Zero processes the log deterministically, produces a receipt</span>
          </div>
          <div className="rs-flow-arrow">→</div>
          <div className="rs-flow-step">
            <span className="rs-flow-num">03</span>
            <strong>Contract verifies</strong>
            <span>Soroban checks the receipt, reads the journal, stores the score</span>
          </div>
          <div className="rs-flow-arrow">→</div>
          <div className="rs-flow-step">
            <span className="rs-flow-num">04</span>
            <strong>Trusted on-chain</strong>
            <span>Leaderboard, badges, and weekly challenge — all ZK-gated</span>
          </div>
        </div>

        <div className="rs-zk-facts">
          {ZK_FACTS.map(f => (
            <div key={f.label} className="rs-zk-fact">
              <span className="rs-zk-label">{f.label}</span>
              <span className="rs-zk-detail">{f.detail}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── BADGES ── */}
      <section className="rs-section">
        <h2 className="rs-section-title">ZK-Proven Badges</h2>
        <p className="rs-section-sub">
          Minted on-chain only when the ZK circuit confirms you earned it. Immutable forever.
        </p>
        <div className="rs-badges">
          {BADGES.map(b => (
            <div key={b.name} className="rs-badge-card">
              <span className="rs-badge-icon">{b.icon}</span>
              <strong className="rs-badge-name">{b.name}</strong>
              <span className="rs-badge-desc">{b.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTRACTS ── */}
      <section className="rs-section rs-contracts-section">
        <h2 className="rs-section-title">Live on Stellar Testnet</h2>
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
            <span className="rs-contract-name">game-hub ✓</span>
            <code className="rs-contract-addr">CB4VZAT2U3UC6XFK3N23SKRF2NDCMP3QHJYMCHHFMZO7MRQO6DQ2EMYG</code>
          </div>
        </div>
      </section>

      {/* ── LORE CLOSER ── */}
      <section className="rs-lore">
        <blockquote className="rs-lore-quote">
          "New York, 1984. The Five Families control the cheese.<br />
          To earn your rank in the kitchen, you must <em>prove</em> your rhythm — not just claim it."
        </blockquote>
        <button
          type="button"
          className="rs-cta-primary rs-lore-cta"
          onClick={() => onNavigate('games')}
        >
          ▶ SHOW THE RECEIPT
        </button>
      </section>

    </div>
  );
}
