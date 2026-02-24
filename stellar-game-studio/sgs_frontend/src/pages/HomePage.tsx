import { useWallet } from '@/hooks/useWallet';
import type { Page } from '../types/navigation';
import './HomePage.css';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { isConnected } = useWallet();

  return (
    <div className="hp-root">

      {/* ══════════════════════════════════════
          HERO — Full pizzeria scene
      ══════════════════════════════════════ */}
      <section className="hp-hero">

        {/* Layer 1: Pizzeria background scene */}
        <div className="hp-scene-bg" />

        {/* Layer 2: Dark vignette overlay so text pops */}
        <div className="hp-vignette" />

        {/* Layer 3: Floating musical notes */}
        <div className="hp-notes" aria-hidden="true">
          <span className="hp-note hp-n1">🎵</span>
          <span className="hp-note hp-n2">♪</span>
          <span className="hp-note hp-n3">🎶</span>
          <span className="hp-note hp-n4">♩</span>
          <span className="hp-note hp-n5">🎵</span>
        </div>

        {/* Layer 4: Content */}
        <div className="hp-hero-inner">

          {/* Title block */}
          <div className="hp-title-block">
            <div className="hp-eyebrow">NEW YORK · 1984</div>
            <h1 className="hp-title">
              <span className="hp-title-line1">RHYTHM</span>
              <span className="hp-title-line2">SLICE</span>
            </h1>
            <p className="hp-tagline">
              "The Five Families control the cheese.<br />
              Only <em>rhythm</em> can break their crust."
            </p>
            <p className="hp-attribution">— Il Don della Massa</p>
          </div>

          {/* Don character */}
          <div className="hp-don-wrap">
            <img
              className="hp-don-img"
              src="game/assets/don_transparent.png"
              alt="Il Don della Massa"
            />
          </div>
        </div>

        {/* Layer 5: CTA at bottom of hero */}
        <div className="hp-hero-footer">
          <button
            type="button"
            className="hp-cta"
            onClick={() => onNavigate('game')}
          >
            🔥 ENTER THE KITCHEN
          </button>
          {!isConnected && (
            <p className="hp-wallet-hint">
              Connect your Freighter wallet (Testnet) to submit scores on-chain
            </p>
          )}
        </div>

      </section>

      {/* ══════════════════════════════════════
          LORE BANNER — Full width strip
      ══════════════════════════════════════ */}
      <section className="hp-lore-banner">
        <div className="hp-lore-banner-inner">
          <div className="hp-lore-quote">
            <span className="hp-lore-quote-mark">"</span>
            <p>
              New York, 1984. Five criminal families carved this city like a pizza —
              each one claiming a slice. The <strong>Russos</strong> own the flour.
              The <strong>Calabreses</strong> run the sauce. The <strong>Marinos</strong> control the ovens.
              Nobody cooks without their blessing. Nobody wins without a receipt.
            </p>
            <span className="hp-lore-quote-mark closing">"</span>
          </div>
          <div className="hp-lore-attribution">
            — From the case files of Detective Sal Fontana, NYPD
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS — Big visual cards
      ══════════════════════════════════════ */}
      <section className="hp-flow">
        <div className="hp-flow-inner">
          <div className="hp-flow-header">
            <h2 className="hp-flow-title-line">VERIFICHIAMO.</h2>
            <p className="hp-flow-title-sub">NON FIDIAMO. — We Verify. We Don't Trust.</p>
          </div>
          <div className="hp-flow-cards">
            <div className="hp-flow-card">
              <div className="hp-flow-card-num">01</div>
              <div className="hp-flow-card-icon">🎵</div>
              <h3 className="hp-flow-card-title">PLAY</h3>
              <p className="hp-flow-card-desc">Hit notes, slice ingredients, bake pizzas to the beat. Every keypress is recorded.</p>
            </div>
            <div className="hp-flow-connector">→</div>
            <div className="hp-flow-card hp-flow-card--mid">
              <div className="hp-flow-card-num">02</div>
              <div className="hp-flow-card-icon">🔐</div>
              <h3 className="hp-flow-card-title">PROVE</h3>
              <p className="hp-flow-card-desc">RISC Zero ZK circuit verifies your inputs. No cheating. No lying. The math doesn't lie.</p>
            </div>
            <div className="hp-flow-connector">→</div>
            <div className="hp-flow-card">
              <div className="hp-flow-card-num">03</div>
              <div className="hp-flow-card-icon">⛓️</div>
              <h3 className="hp-flow-card-title">SEAL</h3>
              <p className="hp-flow-card-desc">Your score lives on Stellar Soroban forever. On-chain, immutable, undeniable.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          THE FIVE FAMILIES — Faction cards
      ══════════════════════════════════════ */}
      <section className="hp-families">
        <div className="hp-families-inner">
          <h2 className="hp-families-title">⚠️ KNOWN ORGANIZATIONS ⚠️</h2>
          <p className="hp-families-sub">Intelligence gathered by the ZK Bureau of Investigation</p>
          <div className="hp-families-grid">
            {[
              { icon: '🌾', name: 'The Russos', territory: 'Controls the Dough', threat: 'HIGH', color: '#8B2020' },
              { icon: '🍅', name: 'The Calabreses', territory: 'Controls the Sauce', threat: 'HIGH', color: '#8B2020' },
              { icon: '🔥', name: 'The Marinos', territory: 'Controls the Ovens', threat: 'EXTREME', color: '#CC2929' },
              { icon: '🧀', name: 'The Contes', territory: 'Controls the Cheese', threat: 'HIGH', color: '#8B2020' },
              { icon: '🎵', name: '??? The Cook', territory: 'Controls the Beat', threat: '???', color: '#2D7A2D' },
            ].map((f) => (
              <div key={f.name} className="hp-family-card" style={{ '--family-color': f.color } as React.CSSProperties}>
                <div className="hp-family-icon">{f.icon}</div>
                <div className="hp-family-name">{f.name}</div>
                <div className="hp-family-territory">{f.territory}</div>
                <div className="hp-family-threat" data-level={f.threat === 'EXTREME' ? 'extreme' : f.threat === '???' ? 'unknown' : 'high'}>
                  ▲ {f.threat}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CONTRACTS — Secret dossier
      ══════════════════════════════════════ */}
      <section className="hp-contracts">
        <div className="hp-contracts-inner">
          <div className="hp-dossier-header">
            <span className="hp-dossier-stamp">LIVE</span>
            <h2 className="hp-contracts-title">CLASSIFIED / ON-CHAIN ASSETS</h2>
            <p className="hp-dossier-sub">Stellar Testnet · Verified by the Bureau</p>
          </div>
          <div className="hp-contracts-list">
            {[
              { name: 'guitar-pizza', addr: 'CADIKXHE6RAW4LDGV6MNTSDEK5JKCNFWUQLCYUZA7DDTOIMF6PTVAMTH', icon: '🍕' },
              { name: 'zk-leaderboard', addr: 'CAFKIEE76S5LHA2QJ3PYU7WW2VSCYCW2FDLCC2RTQLBTZRYTL5UL5PYV', icon: '🏆' },
              { name: 'achievement-vault', addr: 'CCGVC6WRVP5BNFVBQRZ3KNGTSMR37QHGAZ76NB7FXUT4LSGORTPAERVC', icon: '🎖️' },
              { name: 'daily-recipe', addr: 'CBWPTLNG5BZQUWQYRBTRGUARM7XUEUASASWMGLPIRKSNNVO7R4K3HOVN', icon: '📋' },
              { name: 'game-hub', addr: 'CB4VZAT2U3UC6XFK3N23SKRF2NDCMP3QHJYMCHHFMZO7MRQO6DQ2EMYG', icon: '🌐', isHub: true },
            ].map((c) => (
              <div key={c.name} className={`hp-contract-row${c.isHub ? ' hp-contract-hub' : ''}`}>
                <span className="hp-contract-icon">{c.icon}</span>
                <span className="hp-contract-name">{c.name}</span>
                <code className="hp-contract-addr">{c.addr}</code>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
