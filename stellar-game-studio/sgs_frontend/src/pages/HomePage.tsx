import { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import type { Page } from '../types/navigation';
import { ChevronLeft, ChevronRight, Pin } from 'lucide-react';
import { getContractId } from '../utils/constants';
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

  // Preload the game engine while the player is still on the landing page so
  // "Enter the Kitchen" lands on an already-initialized engine (no loader stall).
  useEffect(() => {
    if ((window as any).initGuitarPizza) return;
    (window as any).GP_BASE_PATH = import.meta.env.BASE_URL;
    const src = `${import.meta.env.BASE_URL}game/guitar-pizza-engine.js?v=6`.replace('//', '/');
    if (document.querySelector(`script[src="${src}"]`)) return;
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleEnterKitchen = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      onNavigate('game');
    }, 350);
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
    <div
      className="hp-active"
      style={{
        '--mouse-x': mousePos.x,
        '--mouse-y': mousePos.y
      } as React.CSSProperties}
    >
      {/* Layer 1: Pizzeria background scene */}
      <div className="hp-scene-bg" />

      {/* Cinematic Transition Overlay */}
      <div className={`hp-cinematic-overlay ${isTransitioning ? 'hp-fade-to-black' : ''}`} />

      {/* Global atmospheric effects */}
      <div className="hp-smoke-overlay" />

      <div className="hp-root">

        {/* ══════════════════════════════════════
            HERO — Full pizzeria scene
        ══════════════════════════════════════ */}
        <section className="hp-hero">

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
          </div>

        </section>

      </div>
    </div>
  );
}
