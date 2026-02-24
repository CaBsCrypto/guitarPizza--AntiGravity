import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import type { Page } from '../types/navigation';
import { ChevronLeft, ChevronRight, Pin } from 'lucide-react';
import './HomePage.css';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const SYNDICATES = [
  { icon: '🔥', name: 'Ignis Nitro', genre: 'Industrial Metal', perk: '+10% Health Regen', color: '#ff4d4d' },
  { icon: '🌊', name: 'Velvet Vinili', genre: 'Acid Jazz', perk: '-15% Decay Rate', color: '#9b59b6' },
  { icon: '👾', name: 'Neon-Nduja', genre: 'Synth-wave', perk: '+5% Base Score', color: '#00f2ff' },
  { icon: '🌑', name: 'Deep-Dish Abyss', genre: 'Dark Dub', perk: '-20% Damage Taken', color: '#1a1a1a' },
  { icon: '🎭', name: 'Aria Artisan', genre: 'Grand Opera', perk: '2x Secret Sauce', color: '#ffd700' },
  { icon: '⚡', name: 'Techno-Truffle', genre: 'Hard Techno', perk: '+25% Fever Score', color: '#00ffaa' },
  { icon: '🍋', name: 'Lo-Fi Limoncello', genre: 'Chillhop', perk: 'Combo Shield', color: '#e6ff00' },
];

export function HomePage({ onNavigate }: HomePageProps) {
  const { isConnected } = useWallet();
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragMoved, setDragMoved] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const nextSlide = () => setCarouselIdx((prev) => (prev + 1) % SYNDICATES.length);
  const prevSlide = () => setCarouselIdx((prev) => (prev - 1 + SYNDICATES.length) % SYNDICATES.length);

  // Drag Handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setDragMoved(false);
    setDragOffset(0);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (startX === 0) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const delta = clientX - startX;

    setDragOffset(delta);

    if (Math.abs(delta) > 10) {
      if (!isDragging) setIsDragging(true);
      setDragMoved(true);
    }
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (startX === 0) return;
    const threshold = 50;

    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset < 0) nextSlide();
      else prevSlide();
    }

    setIsDragging(false);
    setStartX(0);
    setDragOffset(0);

    // Small delay to prevent "click" from firing if we were dragging
    setTimeout(() => {
      setDragMoved(false);
    }, 50);
  };

  return (
    <div className="hp-active">
      {/* Global atmospheric effects */}
      <div className="hp-smoke-overlay" />

      <div className="hp-root">

        {/* ══════════════════════════════════════
            HERO — Full pizzeria scene
        ══════════════════════════════════════ */}
        <section className="hp-hero">

          {/* Layer 1: Pizzeria background scene */}
          <div className="hp-scene-bg" />

          {/* Layer 2: Noir Spotlight Overlay */}
          <div className="hp-spotlight-over" />

          {/* Layer 3: Pizza Rain (Cartoon Animation) */}
          <div className="hp-pizza-rain-wrap">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="hp-falling-pizza"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`
                }}
              >
                {['🍕', '🍅', '🧀', '🌶️', '🍄', '🥓'][i % 6]}
              </div>
            ))}
          </div>

          {/* Layer 3: Dark vignette overlay so text pops */}
          <div className="hp-vignette hp-halftone" />

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
                src={`${import.meta.env.BASE_URL}game/assets/don_transparent.png`.replace('//', '/')}
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
            THE DOSSIER — Secret Recipe Files
        ══════════════════════════════════════ */}
        <section className="hp-intel hp-dossier-desk">
          <div className="hp-intel-inner hp-manila-folder">
            <div className="hp-intel-header">
              <span className="hp-intel-stamp">TOP SECRET</span>
              <h2 className="hp-intel-title">THE SECRET RECIPE FILES</h2>
              <p className="hp-intel-subtitle">FOR YOUR EYES ONLY: SYNDICATE CLEARANCE REQUIRED</p>
            </div>

            <div className="hp-intel-cards">
              <div className="hp-intel-card hp-paper-clip">
                <div className="hp-intel-card-num">RECIPE STEP 01</div>
                <div className="hp-intel-card-icon">🍕</div>
                <h3 className="hp-intel-card-title">THE PREPARATION</h3>
                <p className="hp-intel-card-desc">Master the rhythm. Every slice is an ingredient, every beat a ritual. Precision is the dough of champions.</p>
              </div>

              <div className="hp-intel-card hp-paper-clip hp-card-tilted">
                <div className="hp-intel-card-num">RECIPE STEP 02</div>
                <div className="hp-intel-card-icon">📎</div>
                <h3 className="hp-intel-card-title">THE INGREDIENTS</h3>
                <p className="hp-intel-card-desc">RISC Zero acts as the "Silent Witness"—verifying that your recipe is authentic without revealing the secret sauce.</p>
              </div>

              <div className="hp-intel-card hp-paper-clip">
                <div className="hp-intel-card-num">RECIPE STEP 03</div>
                <div className="hp-intel-card-icon">📜</div>
                <h3 className="hp-intel-card-title">THE FINAL BAKE</h3>
                <p className="hp-intel-card-desc">Your masterpiece is etched onto the Stellar Ledger. Immutable, witnessed, and served hot to the world.</p>
              </div>
            </div>

            <div className="hp-intel-footer-stamp">STELLAR BUREAU · THE SEVEN SLICES</div>
          </div>
          {/* Organic decorators */}
          <div className="hp-ornament hp-garlic-string" />
        </section>

        {/* ══════════════════════════════════════
            THE SOVEREIGN SYNDICATES — Carousel
        ══════════════════════════════════════ */}
        <section className="hp-families hp-checkered-floor">
          <div className="hp-families-inner hp-carousel-stage">
            <h2 className="hp-families-title">THE SOVEREIGN SYNDICATES</h2>
            <p className="hp-families-sub">Guardians of the Seven Slices. Rulers of the Rhythm.</p>

            <div className="hp-carousel-nav">
              <button onClick={prevSlide} className="hp-nav-btn hp-nav-prev"><ChevronLeft /></button>
              <button onClick={nextSlide} className="hp-nav-btn hp-nav-next"><ChevronRight /></button>
            </div>

            <div
              className="hp-carousel-track-wrap"
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
              <div
                className="hp-carousel-track"
                style={{
                  transform: `translateX(calc(-${carouselIdx * 25}% + 37.5% + ${dragOffset}px))`,
                  transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                {SYNDICATES.map((s, i) => (
                  <div
                    key={s.name}
                    className={`hp-family-card ${i === carouselIdx ? 'hp-card-active' : 'hp-card-dim'}`}
                    style={{ '--syndicate-color': s.color } as React.CSSProperties}
                    onClick={() => !dragMoved && setCarouselIdx(i)}
                  >
                    <Pin className="hp-card-pin" />
                    <div className="hp-family-icon">{s.icon}</div>
                    <div className="hp-family-name">{s.name}</div>
                    <div className="hp-family-genre">{s.genre}</div>
                    <div className="hp-family-perk">
                      <span className="hp-perk-label">BOOST:</span> {s.perk}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="hp-ornament hp-flour-bag" />
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
    </div>
  );
}
