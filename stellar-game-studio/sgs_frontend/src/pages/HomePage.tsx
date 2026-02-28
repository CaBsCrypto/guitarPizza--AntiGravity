import { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import type { Page } from '../types/navigation';
import { ChevronLeft, ChevronRight, Pin } from 'lucide-react';
import './HomePage.css';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const SYNDICATES = [
  { icon: '🥩', name: 'The Pepperoni Cartel', genre: 'Heavy Metal', perk: '+10% Health Regen', color: '#ff4d4d' },
  { icon: '🧀', name: 'La Famiglia Mozzarella', genre: 'Smooth Jazz', perk: '-15% Decay Rate', color: '#f1c40f' },
  { icon: '🌿', name: 'The Basil Syndicate', genre: 'Fast Swing', perk: '+5% Base Score', color: '#2ecc71' },
  { icon: '🌙', name: 'The Midnight Dough', genre: 'Dark Blues', perk: '-20% Damage Taken', color: '#8e44ad' },
  { icon: '👑', name: 'The Golden Crust Society', genre: 'Grand Opera', perk: '2x Secret Sauce', color: '#e67e22' },
  { icon: '🌶️', name: 'The Spicy Sausage Crew', genre: 'Frenetic Bebop', perk: '+25% Fever Score', color: '#e74c3c' },
  { icon: '🐟', name: 'The Anchovy Outcasts', genre: 'Lo-Fi/Street', perk: 'Combo Shield', color: '#3498db' },
];

export function HomePage({ onNavigate }: HomePageProps) {
  const { isConnected } = useWallet();
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragMoved, setDragMoved] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty('--bg-pizzeria', `url(${import.meta.env.BASE_URL}game/assets/FONDOJUEGO.png)`);
  }, []);

  const handleEnterKitchen = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      onNavigate('game');
    }, 1200);
  };

  const nextSlide = () => setCarouselIdx((prev) => (prev + 1) % SYNDICATES.length);
  const prevSlide = () => setCarouselIdx((prev) => (prev - 1 + SYNDICATES.length) % SYNDICATES.length);

  // Parallax state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse position from -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
      {/* Cinematic Transition Overlay */}
      <div className={`hp-cinematic-overlay ${isTransitioning ? 'hp-fade-to-black' : ''}`} />

      {/* Global atmospheric effects */}
      <div className="hp-smoke-overlay" />

      <div
        className="hp-root"
        style={{
          '--mouse-x': mousePos.x,
          '--mouse-y': mousePos.y
        } as React.CSSProperties}
      >

        {/* ══════════════════════════════════════
            HERO — Full pizzeria scene
        ══════════════════════════════════════ */}
        <section className="hp-hero">

          {/* Layer 1: Pizzeria background scene */}
          <div className="hp-scene-bg" />

          {/* Layer 2: Noir Spotlight Overlay */}
          <div className="hp-spotlight-over" />

          {/* Layer 3: Dark vignette overlay so text pops */}
          <div className="hp-vignette" />

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
                "The Dons think they own the oven.<br />
                Show 'em who really rules the kitchen.<br />
                Just keep the rhythm, <em>capisce</em>?"
              </p>
              <p className="hp-attribution">— Benny</p>
            </div>

            {/* Benny character */}
            <div className="hp-don-wrap">
              <img
                className="hp-don-img"
                src={`${import.meta.env.BASE_URL}game/assets/benny_transparent.png`.replace('//', '/')}
                alt="Benny"
              />
            </div>
          </div>

          {/* Layer 5: CTA at bottom of hero */}
          <div className="hp-hero-footer">
            <button
              type="button"
              className="hp-cta"
              onClick={handleEnterKitchen}
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
            LOWER PANELS — Glassmorphism Grid
        ══════════════════════════════════════ */}
        <div className="hp-lower-container">
          <div className="hp-panels-grid">

            {/* PANEL 1: RECIPE FILES */}
            <section className="hp-glass-panel hp-panel-intel">
              <div className="hp-panel-inner">
                <div className="hp-intel-header">
                  <span className="hp-intel-stamp">TOP SECRET</span>
                  <h2 className="hp-intel-title">THE RECIPE FILES</h2>
                  <p className="hp-intel-subtitle">SYNDICATE CLEARANCE REQUIRED</p>
                </div>

                <div className="hp-intel-cards">
                  <div className="hp-intel-card">
                    <div className="hp-intel-card-num">PHASE 01</div>
                    <div className="hp-intel-card-content">
                      <div className="hp-intel-card-icon">🔪</div>
                      <div>
                        <h3 className="hp-intel-card-title">THE HIT</h3>
                        <p className="hp-intel-card-desc">Slice to the beat. Every perfect note is a fresh ingredient for the Family. Miss, and the Don will be displeased. Your rhythm is your weapon.</p>
                      </div>
                    </div>
                  </div>

                  <div className="hp-intel-card">
                    <div className="hp-intel-card-num">PHASE 02</div>
                    <div className="hp-intel-card-content">
                      <div className="hp-intel-card-icon">🤫</div>
                      <div>
                        <h3 className="hp-intel-card-title">THE ALIBI</h3>
                        <p className="hp-intel-card-desc">No one needs to know the family recipe. RISC Zero acts as our "Silent Witness", proving your high score is legit without exposing the secret sauce.</p>
                      </div>
                    </div>
                  </div>

                  <div className="hp-intel-card">
                    <div className="hp-intel-card-num">PHASE 03</div>
                    <div className="hp-intel-card-content">
                      <div className="hp-intel-card-icon">💎</div>
                      <div>
                        <h3 className="hp-intel-card-title">THE PAYOFF</h3>
                        <p className="hp-intel-card-desc">Your reputation is eternal. The contract is sealed and your verified score is etched onto the Stellar Ledger. Immutable, bulletproof, and served piping hot.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* PANEL 2: FAMILIES CAROUSEL (3D COVERFLOW) */}
            <section
              className="hp-glass-panel hp-panel-families"
              style={{ '--active-glow': SYNDICATES[carouselIdx].color } as React.CSSProperties}
            >
              <div className="hp-panel-inner hp-carousel-stage">
                <div className="hp-families-header">
                  <h2 className="hp-families-title">THE SOVEREIGN SYNDICATES</h2>
                  <p className="hp-families-sub">Guardians of the Seven Slices.</p>
                </div>

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
                  <div className="hp-carousel-track-3d">
                    {SYNDICATES.map((s, i) => {
                      // Calculate shortest distance on a circle
                      const total = SYNDICATES.length;
                      let diff = i - carouselIdx;
                      if (diff > total / 2) diff -= total;
                      if (diff < -total / 2) diff += total;

                      const absDiff = Math.abs(diff);
                      const zIndex = 100 - absDiff;
                      const isActive = diff === 0;

                      // 3D positioning
                      const translateX = diff * 110 + dragOffset * 0.5; // Spread cards horizontally
                      const translateZ = isActive ? 0 : -absDiff * 80;
                      const rotateY = isActive ? 0 : -Math.sign(diff) * 20;
                      const scale = isActive ? 1.15 : 0.85;

                      return (
                        <div
                          key={s.name}
                          className={`hp-family-card-3d ${isActive ? 'hp-card-active' : 'hp-card-dim'}`}
                          style={{
                            '--syndicate-color': s.color,
                            zIndex,
                            transform: `translateX(calc(-50% + ${translateX}px)) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                            transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), filter 0.5s',
                          } as React.CSSProperties}
                          onClick={() => !dragMoved && setCarouselIdx(i)}
                        >
                          <Pin className="hp-card-pin" />
                          <div className="hp-family-icon">{s.icon}</div>
                          <div className="hp-family-name">{s.name}</div>
                          {isActive && (
                            <div className="hp-family-details">
                              <div className="hp-family-genre">{s.genre}</div>
                              <div className="hp-family-perk">
                                <span className="hp-perk-label">BOOST:</span> {s.perk}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* PANEL 3: CONTRACTS FULL WIDTH */}
            <section className="hp-glass-panel hp-panel-contracts">
              <div className="hp-panel-inner">
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

      </div>
    </div>
  );
}
