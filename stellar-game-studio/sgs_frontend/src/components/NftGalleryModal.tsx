import React, { useState, useEffect } from 'react';
import { ChainManager } from '../adapters/ChainManager';
import { useWalletStore } from '../store/walletSlice';
import { arcadeAudio } from '../utils/arcadeAudio';
import './NftGalleryModal.css';

// Direct ESM asset imports — guaranteed to resolve correctly across all environments
import goldenOvenImg from '../assets/nfts/golden_oven_pixel.png';
import capoOvenImg from '../assets/nfts/capo_oven_pixel.png';
import neonOvenImg from '../assets/nfts/neon_oven_pixel.png';
import arcadeOvenImg from '../assets/nfts/arcade_oven_pixel.png';
import punkOvenImg from '../assets/nfts/punk_oven_pixel.png';
import vintageOvenImg from '../assets/nfts/vintage_oven_pixel.png';
import steelOvenImg from '../assets/nfts/steel_oven_pixel.png';
import brickOvenImg from '../assets/nfts/brick_oven_pixel.png';

export interface OvenShowcaseItem {
  tokenId: number;
  styleId: number;
  name: string;
  rarity: 'LEGENDARY' | 'EPIC' | 'RARE' | 'UNCOMMON' | 'COMMON';
  multiplierDisplay: string;
  multiplierBps: number;
  image: string;
  lore: string;
  woodBonus: string;
  speedBonus: string;
  cost: number;
  colorTheme: string;
  stats: {
    multiplierPct: number;
    speedPct: number;
    fuelPct: number;
    crustPct: number;
  };
}

export const SHOWCASE_OVENS: OvenShowcaseItem[] = [
  {
    tokenId: 1,
    styleId: 1,
    name: 'Horno Dorado OG (Metaplex)',
    rarity: 'LEGENDARY',
    multiplierDisplay: '+3.0x',
    multiplierBps: 30000,
    image: goldenOvenImg,
    lore: 'Forjado con incrustaciones de oro puro de 24k por orden directa de Don Salieri. Otorga el máximo prestigio en la cocina.',
    woodBonus: '+100% Madera Élite',
    speedBonus: '+50% Velocidad',
    cost: 10,
    colorTheme: '#FFD700',
    stats: {
      multiplierPct: 100,
      speedPct: 95,
      fuelPct: 98,
      crustPct: 100
    }
  },
  {
    tokenId: 2,
    styleId: 2,
    name: 'Capo Wood Oven',
    rarity: 'EPIC',
    multiplierDisplay: '+2.5x',
    multiplierBps: 25000,
    image: capoOvenImg,
    lore: 'Alimentado con leña de roble siciliano curada. Utilizado por los lugartenientes para pizzas de alta velocidad.',
    woodBonus: '+75% Madera Mesquite',
    speedBonus: '+35% Velocidad',
    cost: 10,
    colorTheme: '#A855F7',
    stats: {
      multiplierPct: 83,
      speedPct: 80,
      fuelPct: 90,
      crustPct: 85
    }
  },
  {
    tokenId: 3,
    styleId: 3,
    name: 'Cyber Neon Pizza Oven',
    rarity: 'EPIC',
    multiplierDisplay: '+2.2x',
    multiplierBps: 22000,
    image: neonOvenImg,
    lore: 'Circuitos fluorescentes overclockeados. Hornea a temperaturas ultra-precisas con pulsos lumínicos cuánticos.',
    woodBonus: '+50% Energía Cuántica',
    speedBonus: '+30% Velocidad',
    cost: 10,
    colorTheme: '#06B6D4',
    stats: {
      multiplierPct: 73,
      speedPct: 85,
      fuelPct: 70,
      crustPct: 80
    }
  },
  {
    tokenId: 4,
    styleId: 4,
    name: 'Retro Arcade Oven 1984',
    rarity: 'RARE',
    multiplierDisplay: '+2.0x',
    multiplierBps: 20000,
    image: arcadeOvenImg,
    lore: 'Modificado con una placa arcade vintage. Cada acierto rítmico en la canción genera calor retro acumulativo.',
    woodBonus: '+40% Bonus Combo',
    speedBonus: '+25% Velocidad',
    cost: 10,
    colorTheme: '#EC4899',
    stats: {
      multiplierPct: 66,
      speedPct: 70,
      fuelPct: 65,
      crustPct: 75
    }
  },
  {
    tokenId: 5,
    styleId: 5,
    name: 'Cyberpunk Industrial Forge',
    rarity: 'RARE',
    multiplierDisplay: '+1.8x',
    multiplierBps: 18000,
    image: punkOvenImg,
    lore: 'Construido con placas de aleación pesada. Resiste las recetas más ardientes sin perder rendimiento.',
    woodBonus: '+30% Resistencia',
    speedBonus: '+20% Velocidad',
    cost: 10,
    colorTheme: '#F97316',
    stats: {
      multiplierPct: 60,
      speedPct: 60,
      fuelPct: 75,
      crustPct: 70
    }
  },
  {
    tokenId: 6,
    styleId: 6,
    name: 'Vintage Italian Stone Oven',
    rarity: 'UNCOMMON',
    multiplierDisplay: '+1.5x',
    multiplierBps: 15000,
    image: vintageOvenImg,
    lore: 'Piedra volcánica tradicional traída de Nápoles. El secreto del crujiente perfecto de la nonna.',
    woodBonus: '+20% Aroma Clásico',
    speedBonus: '+15% Velocidad',
    cost: 10,
    colorTheme: '#10B981',
    stats: {
      multiplierPct: 50,
      speedPct: 45,
      fuelPct: 60,
      crustPct: 65
    }
  },
  {
    tokenId: 7,
    styleId: 7,
    name: 'Industrial Steel Oven',
    rarity: 'COMMON',
    multiplierDisplay: '+1.3x',
    multiplierBps: 13000,
    image: steelOvenImg,
    lore: 'Acero reforzado de alta durabilidad para producción en masa durante los fines de semana más ajetreados.',
    woodBonus: '+15% Capacidad',
    speedBonus: '+10% Velocidad',
    cost: 10,
    colorTheme: '#94A3B8',
    stats: {
      multiplierPct: 43,
      speedPct: 35,
      fuelPct: 45,
      crustPct: 50
    }
  },
  {
    tokenId: 8,
    styleId: 0,
    name: 'Standard Brick Oven',
    rarity: 'COMMON',
    multiplierDisplay: '+1.0x',
    multiplierBps: 10000,
    image: brickOvenImg,
    lore: 'El clásico horno de ladrillo artesanal. Tu compañero leal desde el primer día en la cocina.',
    woodBonus: 'Estándar',
    speedBonus: 'Base',
    cost: 10,
    colorTheme: '#64748B',
    stats: {
      multiplierPct: 33,
      speedPct: 25,
      fuelPct: 35,
      crustPct: 40
    }
  }
];

interface NftGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NftGalleryModal({ isOpen, onClose }: NftGalleryModalProps) {
  const { publicKey, isConnected } = useWalletStore();
  const [selectedOven, setSelectedOven] = useState<OvenShowcaseItem>(SHOWCASE_OVENS[0]);
  const [ownedOvens, setOwnedOvens] = useState<number[]>([1]);
  const [equippedOvenId, setEquippedOvenId] = useState<number>(1);
  const [isMinting, setIsMinting] = useState(false);
  const [isEquipping, setIsEquipping] = useState(false);
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const loadOvens = async () => {
    if (!publicKey) return;
    try {
      const adapter = ChainManager.getInstance().getAdapter();
      const ovens = await adapter.getUserOvens(publicKey);
      setOwnedOvens(ovens.map(o => o.tokenId));

      const savedEquipped = localStorage.getItem('sgs_equipped_oven_solana');
      if (savedEquipped) {
        setEquippedOvenId(parseInt(savedEquipped, 10));
      }
    } catch (err) {
      console.warn('Error al cargar hornos:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadOvens();
    }
  }, [isOpen, publicKey]);

  useEffect(() => {
    const handleOvenUpdate = () => loadOvens();
    window.addEventListener('ovens-updated', handleOvenUpdate);
    return () => window.removeEventListener('ovens-updated', handleOvenUpdate);
  }, [publicKey]);

  if (!isOpen) return null;

  const isSelectedOwned = ownedOvens.includes(selectedOven.tokenId);
  const isSelectedEquipped = equippedOvenId === selectedOven.tokenId;

  const handleSelectOven = (oven: OvenShowcaseItem) => {
    setSelectedOven(oven);
    arcadeAudio.playSelect();
  };

  const toggleSound = () => {
    arcadeAudio.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) arcadeAudio.playSelect();
  };

  const handleMint = async () => {
    if (!isConnected || !publicKey) {
      alert('⚠️ Por favor conecta tu billetera Phantom o Solana primero.');
      return;
    }

    setIsMinting(true);
    setFeedbackBanner(`Solicitando firma en Phantom para mintear ${selectedOven.name}...`);

    try {
      const adapter = ChainManager.getInstance().getAdapter();
      if (adapter.mintOven) {
        await adapter.mintOven(null, publicKey, selectedOven.tokenId);
        arcadeAudio.playMintSuccess();
        setFeedbackBanner(`🎉 ¡Minteo Confirmado en Solana Devnet! Horno agregado a tu colección.`);
        await loadOvens();
      }
    } catch (err: any) {
      alert('⚠️ ' + (err.message || 'Error en minteo'));
    } finally {
      setIsMinting(false);
      setTimeout(() => setFeedbackBanner(null), 4000);
    }
  };

  const handleEquip = async () => {
    if (!publicKey) return;
    setIsEquipping(true);
    try {
      const adapter = ChainManager.getInstance().getAdapter();
      await adapter.equipOven(null, publicKey, selectedOven.tokenId);
      arcadeAudio.playEquip();
      setEquippedOvenId(selectedOven.tokenId);
      setFeedbackBanner(`⚡ ¡Horno ${selectedOven.name} equipado! Multiplicador ${selectedOven.multiplierDisplay} activo.`);
      await loadOvens();
    } catch (err: any) {
      alert('⚠️ ' + (err.message || 'Error al equipar'));
    } finally {
      setIsEquipping(false);
      setTimeout(() => setFeedbackBanner(null), 3500);
    }
  };

  return (
    <div className="nft-showcase-overlay" onClick={onClose}>
      <div className="nft-showcase-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Top Bar */}
        <div className="nft-top-bar">
          <div className="nft-top-brand">
            <span className="nft-sol-badge">◎ SOLANA DEVNET METAPLEX</span>
            <h2>🍕 SHOWROOM DE HORNOS NFT</h2>
          </div>
          <div className="nft-top-controls">
            <button 
              className="nft-sound-toggle-btn" 
              onClick={toggleSound}
              title={soundEnabled ? 'Silenciar Efectos Arcade' : 'Activar Efectos Arcade'}
            >
              {soundEnabled ? '🔊 SONIDO ON' : '🔇 SONIDO OFF'}
            </button>
            <button className="nft-modal-close-icon" onClick={onClose} title="Cerrar">✕</button>
          </div>
        </div>

        {/* Feedback Banner */}
        {feedbackBanner && (
          <div className="nft-hero-feedback">
            <span>{feedbackBanner}</span>
          </div>
        )}

        {/* Hero Showcase Main Area */}
        <div className="nft-hero-stage">
          
          {/* Left / Center: Large Oven Sprite Stage with Ambient Glow and Floating Sparks */}
          <div className="nft-hero-visual-box" style={{ '--oven-glow': selectedOven.colorTheme } as React.CSSProperties}>
            <div className="nft-stage-ambient-glow"></div>
            
            {/* Animated Floating Fire Sparks */}
            <div className="nft-spark-particle spark-1"></div>
            <div className="nft-spark-particle spark-2"></div>
            <div className="nft-spark-particle spark-3"></div>
            <div className="nft-spark-particle spark-4"></div>
            <div className="nft-spark-particle spark-5"></div>

            <div className="nft-stage-pedestal"></div>
            <img 
              src={selectedOven.image} 
              alt={selectedOven.name} 
              className="nft-hero-sprite" 
            />
            <div className="nft-hero-rarity-pill" style={{ borderColor: selectedOven.colorTheme, color: selectedOven.colorTheme }}>
              ★ {selectedOven.rarity}
            </div>
          </div>

          {/* Right: Technical Mafia Spec Sheet */}
          <div className="nft-hero-spec-sheet">
            <div className="nft-spec-header">
              <span className="nft-mult-hero-badge" style={{ background: `${selectedOven.colorTheme}20`, borderColor: selectedOven.colorTheme, color: selectedOven.colorTheme }}>
                {selectedOven.multiplierDisplay} SCORE BOOST
              </span>
              <h3 className="nft-hero-title">{selectedOven.name}</h3>
              <p className="nft-hero-lore">{selectedOven.lore}</p>
            </div>

            {/* Neon Power Progress Bars */}
            <div className="nft-neon-power-bars">
              
              <div className="nft-power-bar-row">
                <div className="bar-info">
                  <span className="bar-title">Score Multiplier</span>
                  <span className="bar-num" style={{ color: selectedOven.colorTheme }}>{selectedOven.multiplierDisplay}</span>
                </div>
                <div className="bar-track">
                  <div 
                    className="bar-fill" 
                    style={{ 
                      width: `${selectedOven.stats.multiplierPct}%`,
                      background: `linear-gradient(90deg, ${selectedOven.colorTheme}80, ${selectedOven.colorTheme})`,
                      boxShadow: `0 0 10px ${selectedOven.colorTheme}`
                    }}
                  ></div>
                </div>
              </div>

              <div className="nft-power-bar-row">
                <div className="bar-info">
                  <span className="bar-title">Aceleración de Horneado</span>
                  <span className="bar-num">{selectedOven.speedBonus}</span>
                </div>
                <div className="bar-track">
                  <div 
                    className="bar-fill" 
                    style={{ 
                      width: `${selectedOven.stats.speedPct}%`,
                      background: 'linear-gradient(90deg, #3B82F6, #60A5FA)',
                      boxShadow: '0 0 10px rgba(96, 165, 250, 0.6)'
                    }}
                  ></div>
                </div>
              </div>

              <div className="nft-power-bar-row">
                <div className="bar-info">
                  <span className="bar-title">Retención de Leña / Combustible</span>
                  <span className="bar-num">{selectedOven.woodBonus}</span>
                </div>
                <div className="bar-track">
                  <div 
                    className="bar-fill" 
                    style={{ 
                      width: `${selectedOven.stats.fuelPct}%`,
                      background: 'linear-gradient(90deg, #F97316, #FB923C)',
                      boxShadow: '0 0 10px rgba(249, 115, 22, 0.6)'
                    }}
                  ></div>
                </div>
              </div>

              <div className="nft-power-bar-row">
                <div className="bar-info">
                  <span className="bar-title">Potencia de Masa Crujiente</span>
                  <span className="bar-num">{selectedOven.stats.crustPct}% Max</span>
                </div>
                <div className="bar-track">
                  <div 
                    className="bar-fill" 
                    style={{ 
                      width: `${selectedOven.stats.crustPct}%`,
                      background: 'linear-gradient(90deg, #10B981, #34D399)',
                      boxShadow: '0 0 10px rgba(16, 185, 129, 0.6)'
                    }}
                  ></div>
                </div>
              </div>

            </div>

            {/* State and Main Action Button */}
            <div className="nft-hero-action-box">
              {isSelectedEquipped ? (
                <button className="nft-hero-btn btn-hero-equipped" disabled>
                  <span>🌟 HORNO EQUIPADO Y ACTIVO EN SOLANA</span>
                </button>
              ) : isSelectedOwned ? (
                <button 
                  className="nft-hero-btn btn-hero-equip" 
                  onClick={handleEquip}
                  disabled={isEquipping}
                >
                  <span>⚡ {isEquipping ? 'EQUIPANDO EN SOLANA...' : 'EQUIPAR EN EL JUEGO'}</span>
                </button>
              ) : (
                <button 
                  className="nft-hero-btn btn-hero-mint" 
                  onClick={handleMint}
                  disabled={isMinting}
                  style={{ '--btn-glow': selectedOven.colorTheme } as React.CSSProperties}
                >
                  <span>🔥 {isMinting ? 'FIRMANDO EN PHANTOM...' : `MINT HORNO (${selectedOven.cost} $SLICE)`}</span>
                </button>
              )}
            </div>

          </div>

        </div>

        {/* Bottom: Carousel / Selector of the 8 Ovens */}
        <div className="nft-carousel-section">
          <div className="nft-carousel-header">
            <span>SELECCIONA UN HORNO PARA INSPECCIONAR ({SHOWCASE_OVENS.length} MODELOS METAPLEX)</span>
          </div>
          <div className="nft-carousel-track">
            {SHOWCASE_OVENS.map((oven) => {
              const isItemOwned = ownedOvens.includes(oven.tokenId);
              const isItemEquipped = equippedOvenId === oven.tokenId;
              const isSelected = selectedOven.tokenId === oven.tokenId;

              return (
                <div 
                  key={oven.tokenId}
                  className={`nft-mini-card ${isSelected ? 'selected' : ''} ${isItemEquipped ? 'equipped' : ''}`}
                  onClick={() => handleSelectOven(oven)}
                  style={{ '--card-theme': oven.colorTheme } as React.CSSProperties}
                >
                  <div className="mini-card-tags">
                    <span className="mini-mult">{oven.multiplierDisplay}</span>
                    {isItemEquipped && <span className="mini-equipped-tag">★</span>}
                  </div>
                  <div className="mini-img-box">
                    <img 
                      src={oven.image} 
                      alt={oven.name} 
                      className="mini-sprite" 
                    />
                  </div>
                  <span className="mini-name">{oven.name.split(' ')[0]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="nft-showcase-footer">
          <span>Metaplex Core Standard · Anchor PDA Program: <code>OVEN11...111</code></span>
          <button className="nft-done-btn" onClick={onClose}>Volver a la Cocina</button>
        </div>

      </div>
    </div>
  );
}
