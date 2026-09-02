import React, { useState, useEffect } from 'react';
import { ChainManager } from '../adapters/ChainManager';
import { useWalletStore } from '../store/walletSlice';
import './NftGalleryModal.css';

export interface OvenShowcaseItem {
  tokenId: number;
  styleId: number;
  name: string;
  rarity: 'LEGENDARY' | 'EPIC' | 'RARE' | 'UNCOMMON' | 'COMMON';
  multiplierDisplay: string;
  multiplierBps: number;
  filename: string;
  lore: string;
  woodBonus: string;
  speedBonus: string;
  cost: number;
  colorTheme: string;
}

export function getOvenImageUrl(filename: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return `${prefix}game/assets/nfts/${filename}`;
}

export const SHOWCASE_OVENS: OvenShowcaseItem[] = [
  {
    tokenId: 1,
    styleId: 1,
    name: 'Horno Dorado OG (Metaplex)',
    rarity: 'LEGENDARY',
    multiplierDisplay: '+3.0x',
    multiplierBps: 30000,
    filename: 'golden_oven_pixel.png',
    lore: 'Forjado con incrustaciones de oro puro de 24k por orden directa de Don Salieri. Otorga el máximo prestigio en la cocina.',
    woodBonus: '+100% Madera Élite',
    speedBonus: '+50% Velocidad',
    cost: 10,
    colorTheme: '#FFD700'
  },
  {
    tokenId: 2,
    styleId: 2,
    name: 'Capo Wood Oven',
    rarity: 'EPIC',
    multiplierDisplay: '+2.5x',
    multiplierBps: 25000,
    filename: 'capo_oven_pixel.png',
    lore: 'Alimentado con leña de roble siciliano curada. Utilizado por los lugartenientes para pizzas de alta velocidad.',
    woodBonus: '+75% Madera Mesquite',
    speedBonus: '+35% Velocidad',
    cost: 10,
    colorTheme: '#A855F7'
  },
  {
    tokenId: 3,
    styleId: 3,
    name: 'Cyber Neon Pizza Oven',
    rarity: 'EPIC',
    multiplierDisplay: '+2.2x',
    multiplierBps: 22000,
    filename: 'neon_oven_pixel.png',
    lore: 'Circuitos fluorescentes overclockeados. Hornea a temperaturas ultra-precisas con pulsos lumínicos.',
    woodBonus: '+50% Energía Cuántica',
    speedBonus: '+30% Velocidad',
    cost: 10,
    colorTheme: '#06B6D4'
  },
  {
    tokenId: 4,
    styleId: 4,
    name: 'Retro Arcade Oven 1984',
    rarity: 'RARE',
    multiplierDisplay: '+2.0x',
    multiplierBps: 20000,
    filename: 'arcade_oven_pixel.png',
    lore: 'Modificado con una placa arcade vintage. Cada acierto en la canción genera calor retro acumulativo.',
    woodBonus: '+40% Bonus Combo',
    speedBonus: '+25% Velocidad',
    cost: 10,
    colorTheme: '#EC4899'
  },
  {
    tokenId: 5,
    styleId: 5,
    name: 'Cyberpunk Industrial Forge',
    rarity: 'RARE',
    multiplierDisplay: '+1.8x',
    multiplierBps: 18000,
    filename: 'punk_oven_pixel.png',
    lore: 'Construido con placas de aleación pesada. Resiste las recetas más ardientes sin perder rendimiento.',
    woodBonus: '+30% Resistencia',
    speedBonus: '+20% Velocidad',
    cost: 10,
    colorTheme: '#F97316'
  },
  {
    tokenId: 6,
    styleId: 6,
    name: 'Vintage Italian Stone Oven',
    rarity: 'UNCOMMON',
    multiplierDisplay: '+1.5x',
    multiplierBps: 15000,
    filename: 'vintage_oven_pixel.png',
    lore: 'Piedra volcánica tradicional traída de Nápoles. El secreto del crujiente perfecto de la nonna.',
    woodBonus: '+20% Aroma Clásico',
    speedBonus: '+15% Velocidad',
    cost: 10,
    colorTheme: '#10B981'
  },
  {
    tokenId: 7,
    styleId: 7,
    name: 'Industrial Steel Oven',
    rarity: 'COMMON',
    multiplierDisplay: '+1.3x',
    multiplierBps: 13000,
    filename: 'steel_oven_pixel.png',
    lore: 'Acero reforzado de alta durabilidad para producción en masa durante los fines de semana más ajetreados.',
    woodBonus: '+15% Capacidad',
    speedBonus: '+10% Velocidad',
    cost: 10,
    colorTheme: '#94A3B8'
  },
  {
    tokenId: 8,
    styleId: 0,
    name: 'Standard Brick Oven',
    rarity: 'COMMON',
    multiplierDisplay: '+1.0x',
    multiplierBps: 10000,
    filename: 'brick_oven_pixel.png',
    lore: 'El clásico horno de ladrillo artesanal. Tu compañero leal desde el primer día en la cocina.',
    woodBonus: 'Estándar',
    speedBonus: 'Base',
    cost: 10,
    colorTheme: '#64748B'
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
          <button className="nft-modal-close-icon" onClick={onClose} title="Cerrar">✕</button>
        </div>

        {/* Feedback Banner */}
        {feedbackBanner && (
          <div className="nft-hero-feedback">
            <span>{feedbackBanner}</span>
          </div>
        )}

        {/* Hero Showcase Main Area */}
        <div className="nft-hero-stage">
          
          {/* Left / Center: Large Oven Sprite Stage with Ambient Glow */}
          <div className="nft-hero-visual-box" style={{ '--oven-glow': selectedOven.colorTheme } as React.CSSProperties}>
            <div className="nft-stage-ambient-glow"></div>
            <div className="nft-stage-pedestal"></div>
            <img 
              src={getOvenImageUrl(selectedOven.filename)} 
              alt={selectedOven.name} 
              className="nft-hero-sprite"
              onError={(e) => {
                const img = e.currentTarget;
                if (!img.dataset.failedOnce) {
                  img.dataset.failedOnce = 'true';
                  img.src = `./game/assets/nfts/${selectedOven.filename}`;
                } else if (!img.dataset.failedTwice) {
                  img.dataset.failedTwice = 'true';
                  img.src = `/game/assets/nfts/${selectedOven.filename}`;
                }
              }}
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

            {/* Performance Stats */}
            <div className="nft-specs-grid">
              <div className="nft-spec-item">
                <span className="spec-label">Multiplicador On-Chain</span>
                <span className="spec-val" style={{ color: selectedOven.colorTheme }}>{selectedOven.multiplierDisplay}</span>
              </div>
              <div className="nft-spec-item">
                <span className="spec-label">Bonus Combustible</span>
                <span className="spec-val">🔥 {selectedOven.woodBonus}</span>
              </div>
              <div className="nft-spec-item">
                <span className="spec-label">Velocidad Cocción</span>
                <span className="spec-val">⏱️ {selectedOven.speedBonus}</span>
              </div>
              <div className="nft-spec-item">
                <span className="spec-label">Estado de Posesión</span>
                <span className="spec-val" style={{ color: isSelectedEquipped ? '#14F195' : isSelectedOwned ? '#60A5FA' : '#E2E8F0' }}>
                  {isSelectedEquipped ? '🌟 EQUIPADO' : isSelectedOwned ? '✅ EN TU PODER' : '🔒 POR MINTEAR'}
                </span>
              </div>
            </div>

            {/* Main Action Button */}
            <div className="nft-hero-action-box">
              {isSelectedEquipped ? (
                <button className="nft-hero-btn btn-hero-equipped" disabled>
                  <span>🌟 HORNO EQUIPADO Y ACTIVO</span>
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
                  onClick={() => setSelectedOven(oven)}
                  style={{ '--card-theme': oven.colorTheme } as React.CSSProperties}
                >
                  <div className="mini-card-tags">
                    <span className="mini-mult">{oven.multiplierDisplay}</span>
                    {isItemEquipped && <span className="mini-equipped-tag">★</span>}
                  </div>
                  <div className="mini-img-box">
                    <img 
                      src={getOvenImageUrl(oven.filename)} 
                      alt={oven.name} 
                      className="mini-sprite" 
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (!img.dataset.failedOnce) {
                          img.dataset.failedOnce = 'true';
                          img.src = `./game/assets/nfts/${oven.filename}`;
                        } else if (!img.dataset.failedTwice) {
                          img.dataset.failedTwice = 'true';
                          img.src = `/game/assets/nfts/${oven.filename}`;
                        }
                      }}
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
