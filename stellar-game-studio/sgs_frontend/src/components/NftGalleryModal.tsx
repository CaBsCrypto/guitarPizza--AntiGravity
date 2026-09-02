import React, { useState, useEffect } from 'react';
import { ChainManager } from '../adapters/ChainManager';
import { useWalletStore } from '../store/walletSlice';
import { SOLANA_OVEN_COLLECTION } from '../contracts/solanaContracts';
import './NftGalleryModal.css';

interface NftGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NftGalleryModal({ isOpen, onClose }: NftGalleryModalProps) {
  const { publicKey, isConnected } = useWalletStore();
  const [activeTab, setActiveTab] = useState<'mint' | 'collection'>('mint');
  const [ownedOvens, setOwnedOvens] = useState<number[]>([1]);
  const [equippedOvenId, setEquippedOvenId] = useState<number>(1);
  const [mintingId, setMintingId] = useState<number | null>(null);
  const [equippingId, setEquippingId] = useState<number | null>(null);
  const [txMessage, setTxMessage] = useState<string | null>(null);

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
      console.warn('Error loading ovens:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadOvens();
    }
  }, [isOpen, publicKey]);

  useEffect(() => {
    const handleOvenUpdate = () => {
      loadOvens();
    };
    window.addEventListener('ovens-updated', handleOvenUpdate);
    return () => window.removeEventListener('ovens-updated', handleOvenUpdate);
  }, [publicKey]);

  if (!isOpen) return null;

  const handleMint = async (oven: typeof SOLANA_OVEN_COLLECTION[0]) => {
    if (!isConnected || !publicKey) {
      alert('⚠️ Por favor conecta tu billetera Phantom o Solana primero.');
      return;
    }

    setMintingId(oven.tokenId);
    setTxMessage(`Firmando y minteando ${oven.name} en Solana Devnet...`);

    try {
      const adapter = ChainManager.getInstance().getAdapter();
      if (adapter.mintOven) {
        await adapter.mintOven(null, publicKey, oven.tokenId);
        setTxMessage(`🎉 ¡Minteo exitoso! Horno #${oven.tokenId} añadido a tu colección.`);
        await loadOvens();
      }
    } catch (err: any) {
      alert('⚠️ Error en minteo: ' + (err.message || err));
    } finally {
      setMintingId(null);
      setTimeout(() => setTxMessage(null), 4000);
    }
  };

  const handleEquip = async (ovenId: number) => {
    if (!publicKey) return;
    setEquippingId(ovenId);
    try {
      const adapter = ChainManager.getInstance().getAdapter();
      await adapter.equipOven(null, publicKey, ovenId);
      setEquippedOvenId(ovenId);
      setTxMessage(`⚡ ¡Horno equipado! Multiplicador activo en tus partidas.`);
      await loadOvens();
    } catch (err: any) {
      alert('⚠️ Error al equipar: ' + (err.message || err));
    } finally {
      setEquippingId(null);
      setTimeout(() => setTxMessage(null), 3000);
    }
  };

  return (
    <div className="nft-modal-overlay" onClick={onClose}>
      <div className="nft-modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="nft-modal-header">
          <div className="nft-header-title-box">
            <span className="nft-badge-solana">◎ SOLANA METAPLEX DEVNET</span>
            <h2>🎨 HORNOS PIXEL-ART NFT</h2>
            <p>Mintea y equipa tus hornos para multiplicar tu puntuación y cosechar más $SLICE en el juego.</p>
          </div>
          <button className="nft-close-btn" onClick={onClose} title="Cerrar">✕</button>
        </div>

        {/* Tab Controls */}
        <div className="nft-tabs-bar">
          <button 
            className={`nft-tab-btn ${activeTab === 'mint' ? 'active' : ''}`}
            onClick={() => setActiveTab('mint')}
          >
            🏪 TIENDA & MINT (8 MODELOS)
          </button>
          <button 
            className={`nft-tab-btn ${activeTab === 'collection' ? 'active' : ''}`}
            onClick={() => setActiveTab('collection')}
          >
            🎒 MI COLECCIÓN ({ownedOvens.length} HORNOS)
          </button>
        </div>

        {/* Status Message Banner */}
        {txMessage && (
          <div className="nft-status-banner">
            <span>{txMessage}</span>
          </div>
        )}

        {/* Oven Cards Grid */}
        <div className="nft-grid-container">
          {SOLANA_OVEN_COLLECTION.filter(oven => activeTab === 'mint' || ownedOvens.includes(oven.tokenId)).map((oven) => {
            const isOwned = ownedOvens.includes(oven.tokenId);
            const isEquipped = equippedOvenId === oven.tokenId;
            const multDisplay = (oven.multiplierBps / 10000).toFixed(1) + 'x';

            return (
              <div key={oven.tokenId} className={`nft-oven-card ${isEquipped ? 'equipped-card' : ''}`}>
                <div className="nft-card-top-tags">
                  <span className="nft-rarity-tag">{oven.rarity}</span>
                  <span className="nft-mult-tag">+{multDisplay} MULT</span>
                </div>

                <div className="nft-image-frame">
                  <img src={oven.image} alt={oven.name} className="nft-oven-img" />
                </div>

                <div className="nft-card-info">
                  <h3>{oven.name}</h3>
                  <p className="nft-desc">{oven.description}</p>
                  <div className="nft-traits">
                    <span>🔥 {oven.woodBonus}</span>
                    <span>⏱️ {oven.speedBonus}</span>
                  </div>
                </div>

                <div className="nft-card-actions">
                  {isOwned ? (
                    <button
                      className={`nft-action-btn ${isEquipped ? 'btn-equipped' : 'btn-equip'}`}
                      onClick={() => handleEquip(oven.tokenId)}
                      disabled={isEquipped || equippingId === oven.tokenId}
                    >
                      {isEquipped ? '🌟 EQUIPADO' : equippingId === oven.tokenId ? 'EQUIPANDO...' : '⚡ EQUIPAR HORNO'}
                    </button>
                  ) : (
                    <button
                      className="nft-action-btn btn-mint"
                      onClick={() => handleMint(oven)}
                      disabled={mintingId === oven.tokenId}
                    >
                      {mintingId === oven.tokenId ? 'MINTEANDO...' : '🔥 MINT (10 $SLICE)'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="nft-modal-footer">
          <span>Metaplex Standard · Program ID: <code>piz...NFT11</code> · Solana Devnet</span>
          <button className="nft-footer-close-btn" onClick={onClose}>Listo</button>
        </div>

      </div>
    </div>
  );
}
