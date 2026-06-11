import React, { useEffect, useState } from 'react';
import { StellarContractService } from '../services/StellarContractService';

interface CollectionTabProps {
    language: 'es' | 'en';
    userAddress?: string;
    onBack: () => void;
    isEmbedded?: boolean;
}

export function CollectionTab({ language, userAddress, onBack, isEmbedded = false }: CollectionTabProps) {
    const [ownedNFTs, setOwnedNFTs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [equippedId, setEquippedId] = useState<number | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cardsToShow, setCardsToShow] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 650) {
                setCardsToShow(1);
            } else if (window.innerWidth < 950) {
                setCardsToShow(2);
            } else {
                setCardsToShow(3);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const maxIndex = Math.max(0, ownedNFTs.length - cardsToShow);

    // Safety check to keep currentIndex in bounds when cards count or screen width changes
    useEffect(() => {
        if (ownedNFTs.length > 0) {
            if (currentIndex > maxIndex) {
                setCurrentIndex(maxIndex);
            }
        }
    }, [ownedNFTs.length, cardsToShow, currentIndex, maxIndex]);

    const nextSlide = () => {
        if (ownedNFTs.length <= cardsToShow) return;
        setCurrentIndex((prev) => {
            if (prev >= maxIndex) {
                return 0; // Wrap back to start
            }
            return prev + 1;
        });
    };

    const prevSlide = () => {
        if (ownedNFTs.length <= cardsToShow) return;
        setCurrentIndex((prev) => {
            if (prev <= 0) {
                return maxIndex; // Wrap to end
            }
            return prev - 1;
        });
    };

    const visibleNFTs = ownedNFTs.slice(currentIndex, currentIndex + cardsToShow);

    const fetchCollection = async () => {
        if (!userAddress) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const tokenIds = await StellarContractService.getNftCollection(userAddress);
            
            // Fetch the metadata map to know which token ID gets which style
            let metadataMap: number[] = [];
            try {
                const res = await fetch('/game/assets/metadata_map.json');
                if (res.ok) metadataMap = await res.json();
            } catch(e) { console.error("Could not load metadata map", e); }

            // Construct the NFT objects based on the token IDs returned from Soroban
            const nfts = tokenIds.map((id: number) => {
                // ID is 1-indexed (1 to 888), array is 0-indexed
                const styleId = metadataMap.length >= id ? metadataMap[id - 1] : 6; // fallback to Common Brick

                let name = '';
                let image = '';
                let bonus = '';
                let rarity = '';
                let multiplierValue = 1.0;

                // 1: Golden, 2: Il Capo, 3: Punk, 4: Neon, 5: Arcade, 6: Brick, 7: Steel, 8: Vintage
                switch (styleId) {
                    case 1:
                        name = language === 'es' ? "Horno Dorado OG" : "Golden OG Oven";
                        image = '/game/assets/nfts/golden_oven_pixel.png?v=2';
                        bonus = '+3.0x Multiplier'; rarity = 'Legendary'; multiplierValue = 3.0;
                        break;
                    case 2:
                        name = language === 'es' ? "Horno Il Capo OG" : "Il Capo OG Oven";
                        image = '/game/assets/nfts/capo_oven_pixel.png?v=2';
                        bonus = '+2.0x Multiplier'; rarity = 'Epic'; multiplierValue = 2.0;
                        break;
                    case 3:
                        name = language === 'es' ? "Horno Punk OG" : "Crypto Punk Oven";
                        image = '/game/assets/nfts/punk_oven_pixel.png?v=2';
                        bonus = '+2.0x Multiplier'; rarity = 'Epic'; multiplierValue = 2.0;
                        break;
                    case 4:
                        name = language === 'es' ? "Horno Neón OG" : "Neon OG Oven";
                        image = '/game/assets/nfts/neon_oven_pixel.png?v=2';
                        bonus = '+1.8x Multiplier'; rarity = 'Rare'; multiplierValue = 1.8;
                        break;
                    case 5:
                        name = language === 'es' ? "Horno Arcade OG" : "Arcade OG Oven";
                        image = '/game/assets/nfts/arcade_oven_pixel.png?v=2';
                        bonus = '+1.8x Multiplier'; rarity = 'Rare'; multiplierValue = 1.8;
                        break;
                    case 6:
                        name = language === 'es' ? "Horno Ladrillo OG" : "Brick OG Oven";
                        image = '/game/assets/nfts/brick_oven_pixel.png?v=2';
                        bonus = '+1.5x Multiplier'; rarity = 'Common'; multiplierValue = 1.5;
                        break;
                    case 7:
                        name = language === 'es' ? "Horno Acero OG" : "Steel OG Oven";
                        image = '/game/assets/nfts/steel_oven_pixel.png?v=2';
                        bonus = '+1.5x Multiplier'; rarity = 'Common'; multiplierValue = 1.5;
                        break;
                    case 8:
                    default:
                        name = language === 'es' ? "Horno Vintage OG" : "Vintage OG Oven";
                        image = '/game/assets/nfts/vintage_oven_pixel.png?v=2';
                        bonus = '+1.5x Multiplier'; rarity = 'Common'; multiplierValue = 1.5;
                        break;
                }

                return { id, name, image, bonus, rarity, multiplierValue };
            });
            
            setOwnedNFTs(nfts);

            // Auto-unequip if the user no longer owns the equipped NFT
            const saved = localStorage.getItem('equippedOvenId');
            if (saved && !tokenIds.includes(parseInt(saved, 10))) {
                setEquippedId(null);
                localStorage.removeItem('equippedOvenId');
                localStorage.removeItem('equippedOvenMultiplier');
            }

        } catch (err) {
            console.error("Failed to fetch collection", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Load equipped NFT from local storage
        const saved = localStorage.getItem('equippedOvenId');
        if (saved) {
            setEquippedId(parseInt(saved, 10));
        }
        
        fetchCollection();
    }, [userAddress, language]);

    useEffect(() => {
        const handleCollectionUpdated = () => {
            fetchCollection();
        };
        window.addEventListener('collection-updated', handleCollectionUpdated);
        return () => window.removeEventListener('collection-updated', handleCollectionUpdated);
    }, [userAddress, language]);

    const handleEquip = (nft: any) => {
        setEquippedId(nft.id);
        localStorage.setItem('equippedOvenId', nft.id.toString());
        localStorage.setItem('equippedOvenMultiplier', nft.multiplierValue.toString());
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: isEmbedded ? '1rem 0' : '2rem',
            color: '#FFF8E7',
            background: isEmbedded ? 'transparent' : 'rgba(20, 5, 5, 0.95)',
            border: isEmbedded ? 'none' : '4px solid #8B0000',
            borderRadius: isEmbedded ? '0' : '20px',
            width: '100%',
            margin: '0 auto',
            boxShadow: isEmbedded ? 'none' : '0 10px 40px rgba(0,0,0,0.8)',
            maxHeight: isEmbedded ? 'none' : '80vh',
            overflowY: isEmbedded ? 'visible' : 'auto'
        }}>
            {!isEmbedded && (
                <h1 style={{ fontFamily: 'var(--font-display)', color: '#FFD700', marginBottom: '1rem', textShadow: '2px 2px 5px rgba(0,0,0,0.8)' }}>
                    {language === 'es' ? 'Mi Colección' : 'My Collection'}
                </h1>
            )}
            <p style={{ textAlign: 'center', marginBottom: '1.5rem', opacity: 0.8 }}>
                {language === 'es' ? 'Tus NFTs exclusivos. ¡Equipa tu mejor Horno para multiplicar tus recompensas en el juego!' : 'Your exclusive NFTs. Equip your best Oven to multiply your in-game rewards!'}
            </p>

            {userAddress && (
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.8rem' }}>
                    <a 
                        href={`https://stellar.expert/explorer/testnet/account/${userAddress}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                            padding: '0.5rem 1rem',
                            background: 'rgba(255, 215, 0, 0.08)',
                            border: '1.5px solid #FFD700',
                            borderRadius: '20px',
                            color: '#FFD700',
                            fontWeight: 'bold',
                            textDecoration: 'none',
                            fontSize: '0.8rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            transition: 'all 0.2s',
                            boxShadow: '0 2px 8px rgba(255,215,0,0.05)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 215, 0, 0.2)';
                            e.currentTarget.style.boxShadow = '0 2px 12px rgba(255,215,0,0.25)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 215, 0, 0.08)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(255,215,0,0.05)';
                        }}
                    >
                        👤 {language === 'es' ? 'Ver Mi Cartera en Explorer' : 'View My Wallet in Explorer'}
                    </a>
                    <a 
                        href={`https://stellar.expert/explorer/testnet/contract/CBC3AGOZTWKEII45VBRWLOGMBNGBJ6ABPP6MOFAZM2HFHP2NKPXXEWXB`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                            padding: '0.5rem 1rem',
                            background: 'rgba(212, 175, 55, 0.08)',
                            border: '1.5px solid #d4af37',
                            borderRadius: '20px',
                            color: '#d4af37',
                            fontWeight: 'bold',
                            textDecoration: 'none',
                            fontSize: '0.8rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            transition: 'all 0.2s',
                            boxShadow: '0 2px 8px rgba(212,175,55,0.05)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)';
                            e.currentTarget.style.boxShadow = '0 2px 12px rgba(212,175,55,0.25)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(212, 175, 55, 0.08)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(212,175,55,0.05)';
                        }}
                    >
                        📜 {language === 'es' ? 'Ver Contrato NFT' : 'View NFT Contract'}
                    </a>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', color: '#FFD700', padding: '2rem' }}>
                    {language === 'es' ? 'Cargando colección on-chain...' : 'Loading on-chain collection...'}
                </div>
            ) : ownedNFTs.length === 0 ? (
                <div style={{ textAlign: 'center', opacity: 0.6, padding: '2rem' }}>
                    {language === 'es' ? 'Aún no tienes Hornos. ¡Saca un 100% para ganar uno!' : "You don't have any Ovens yet. Get 100% to win one!"}
                </div>
            ) : (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    gap: '1rem',
                    padding: '0.5rem 0'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        position: 'relative',
                        gap: cardsToShow === 1 ? '0.4rem' : '1rem'
                    }}>
                        {/* Left Arrow Button */}
                        {ownedNFTs.length > cardsToShow && (
                            <button
                                onClick={prevSlide}
                                style={{
                                    background: 'rgba(26, 5, 5, 0.85)',
                                    color: '#FFD700',
                                    border: '2px solid #FFD700',
                                    borderRadius: '50%',
                                    width: cardsToShow === 1 ? '36px' : '45px',
                                    height: cardsToShow === 1 ? '36px' : '45px',
                                    fontSize: cardsToShow === 1 ? '1.1rem' : '1.5rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                                    zIndex: 10,
                                    userSelect: 'none',
                                    transition: 'all 0.2s ease-in-out',
                                    flexShrink: 0
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#FFD700';
                                    e.currentTarget.style.color = '#000';
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                    e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.6)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(26, 5, 5, 0.85)';
                                    e.currentTarget.style.color = '#FFD700';
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.5)';
                                }}
                            >
                                ◀
                            </button>
                        )}

                        {/* Cards Container */}
                        <div style={{
                            display: 'flex',
                            gap: '1.5rem',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                            overflow: 'hidden',
                            padding: '1.2rem 0.5rem',
                            minHeight: '380px',
                            minWidth: cardsToShow === 1 ? '200px' : (cardsToShow === 2 ? '440px' : '660px'),
                            maxWidth: '100%',
                            transition: 'all 0.3s ease'
                        }}>
                             {visibleNFTs.map(nft => {
                                const isEquipped = equippedId === nft.id;
                                return (
                                    <div key={nft.id} style={{
                                        position: 'relative',
                                        background: isEquipped ? 'linear-gradient(145deg, #4a1818, #2a0505)' : 'linear-gradient(145deg, #2a0808, #1a0505)',
                                        border: `2px solid ${isEquipped ? '#00FF00' : '#FFD700'}`,
                                        borderRadius: '12px',
                                        padding: '1rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        width: '200px',
                                        height: '380px',
                                        flexShrink: 0,
                                        boxShadow: isEquipped ? '0 0 20px rgba(0,255,0,0.4)' : '0 5px 15px rgba(0,0,0,0.5)',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        cursor: 'pointer',
                                        boxSizing: 'border-box'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                        e.currentTarget.style.boxShadow = isEquipped ? '0 0 25px rgba(0,255,0,0.6)' : '0 8px 20px rgba(255,215,0,0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.boxShadow = isEquipped ? '0 0 20px rgba(0,255,0,0.4)' : '0 5px 15px rgba(0,0,0,0.5)';
                                    }}
                                    onClick={() => handleEquip(nft)}
                                    >
                                        {/* Top details group */}
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            width: '100%'
                                        }}>
                                            {/* Image container */}
                                            <div style={{
                                                width: '100%',
                                                height: '130px',
                                                background: '#1a0505',
                                                borderRadius: '8px',
                                                marginBottom: '0.8rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                overflow: 'hidden'
                                            }}>
                                                <img src={nft.image} alt={nft.name} style={{ width: '100%', height: '100%', objectFit: 'cover', imageRendering: 'pixelated' }} />
                                            </div>

                                            {/* Title */}
                                            <h3 style={{ margin: '0 0 0.4rem 0', textAlign: 'center', fontSize: '1.05rem', color: '#FFF8E7', fontWeight: 'bold' }}>
                                                {nft.name}
                                            </h3>

                                            {/* Rarity & Token ID Row */}
                                            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem', alignItems: 'center' }}>
                                                <span style={{ background: '#FFD700', color: '#000', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                                    {nft.rarity}
                                                </span>
                                                <span style={{ background: 'rgba(255, 215, 0, 0.08)', color: '#FFD700', border: '1px solid #FFD700', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
                                                    #{nft.id}
                                                </span>
                                            </div>

                                            {/* Multiplier Bonus */}
                                            <p style={{ margin: '0 0 0.3rem 0', color: '#4CAF50', fontWeight: 'bold', fontSize: '0.85rem' }}>
                                                {nft.bonus}
                                            </p>

                                            {/* Testnet details link */}
                                            <a 
                                                href={`https://stellar.expert/explorer/testnet/contract/CBC3AGOZTWKEII45VBRWLOGMBNGBJ6ABPP6MOFAZM2HFHP2NKPXXEWXB`}
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                style={{
                                                    color: '#FFD700',
                                                    fontSize: '0.7rem',
                                                    textDecoration: 'underline',
                                                    marginBottom: '0.5rem',
                                                    opacity: 0.8,
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.2rem'
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                🔗 {language === 'es' ? 'Detalles en Testnet' : 'Testnet Details'}
                                            </a>
                                        </div>

                                        {/* Action Button at the bottom */}
                                        {isEquipped ? (
                                            <button 
                                                disabled
                                                style={{
                                                    background: 'rgba(0, 255, 0, 0.08)',
                                                    color: '#00FF00',
                                                    border: '1.5px solid #00FF00',
                                                    padding: '0.45rem 1rem',
                                                    borderRadius: '8px',
                                                    fontWeight: 'bold',
                                                    width: '100%',
                                                    cursor: 'default',
                                                    fontSize: '0.8rem',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em'
                                                }}
                                            >
                                                {language === 'es' ? 'EQUIPADO' : 'EQUIPPED'}
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEquip(nft);
                                                }}
                                                style={{
                                                    background: '#FFD700',
                                                    color: '#000',
                                                    border: 'none',
                                                    padding: '0.45rem 1rem',
                                                    borderRadius: '8px',
                                                    fontWeight: 'bold',
                                                    cursor: 'pointer',
                                                    width: '100%',
                                                    fontSize: '0.8rem',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#FFF'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = '#FFD700'}
                                            >
                                                {language === 'es' ? 'EQUIPAR' : 'EQUIP'}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Right Arrow Button */}
                        {ownedNFTs.length > cardsToShow && (
                            <button
                                onClick={nextSlide}
                                style={{
                                    background: 'rgba(26, 5, 5, 0.85)',
                                    color: '#FFD700',
                                    border: '2px solid #FFD700',
                                    borderRadius: '50%',
                                    width: cardsToShow === 1 ? '36px' : '45px',
                                    height: cardsToShow === 1 ? '36px' : '45px',
                                    fontSize: cardsToShow === 1 ? '1.1rem' : '1.5rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                                    zIndex: 10,
                                    userSelect: 'none',
                                    transition: 'all 0.2s ease-in-out',
                                    flexShrink: 0
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#FFD700';
                                    e.currentTarget.style.color = '#000';
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                    e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.6)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(26, 5, 5, 0.85)';
                                    e.currentTarget.style.color = '#FFD700';
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.5)';
                                }}
                            >
                                ▶
                            </button>
                        )}
                    </div>

                    {/* Pagination Indicator Dots */}
                    {ownedNFTs.length > cardsToShow && (
                        <div style={{
                            display: 'flex',
                            gap: '0.5rem',
                            justifyContent: 'center',
                            marginTop: '0.5rem'
                        }}>
                            {Array.from({ length: maxIndex + 1 }).map((_, idx) => {
                                const isActive = currentIndex === idx;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        style={{
                                            width: '10px',
                                            height: '10px',
                                            borderRadius: '50%',
                                            border: 'none',
                                            background: isActive ? '#FFD700' : 'rgba(255,215,0,0.2)',
                                            boxShadow: isActive ? '0 0 8px #FFD700' : 'none',
                                            cursor: 'pointer',
                                            padding: 0,
                                            transition: 'all 0.2s'
                                        }}
                                        title={`Page ${idx + 1}`}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
            
            {/* Dev Tools Panel */}
            <div style={{ marginTop: '2rem', padding: '1rem', border: '1px dashed #FFD700', borderRadius: '8px', background: '#330000', width: '100%', textAlign: 'center' }}>
                <h4 style={{ color: '#FFD700', margin: '0 0 1rem 0' }}>{language === 'es' ? '🛠️ Panel Dev (Sólo Testnet)' : '🛠️ Dev Panel (Testnet Only)'}</h4>
                <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button 
                        onClick={async () => {
                            try {
                                setLoading(true);
                                const res = await fetch('/api/drop-oven', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ playerAddress: userAddress, isDevMint: true })
                                });
                                const responseText = await res.text();
                                let data: any = {};
                                try {
                                    data = JSON.parse(responseText);
                                } catch (e) {}

                                if (!res.ok) {
                                    throw new Error(data.error || data.message || `HTTP ${res.status}: ${responseText.slice(0, 100)}`);
                                }
                                alert("Dev Mint successful!");
                                window.dispatchEvent(new Event('collection-updated'));
                            } catch(e: any) {
                                console.error(e);
                                alert("⚠️ Error: " + (e.message || e));
                            }
                            finally { setLoading(false); }
                        }}
                        style={{
                            background: '#8B0000', color: '#FFF', border: '1px solid #FFD700', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
                        }}
                    >
                        {language === 'es' ? '+ Forzar Dev Mint' : '+ Force Dev Mint'}
                    </button>
                    <button 
                        onClick={async (e) => {
                            const btn = e.currentTarget;
                            btn.disabled = true;
                            btn.textContent = 'AIRDROPPING...';
                            try {
                                const res = await fetch('/api/drop-slice', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ playerAddress: userAddress, amount: 8 })
                                });
                                const responseText = await res.text();
                                let data: any = {};
                                try {
                                    data = JSON.parse(responseText);
                                } catch (e) {}

                                if (!res.ok) {
                                    throw new Error(data.error || data.message || `HTTP ${res.status}: ${responseText.slice(0, 100)}`);
                                }
                                alert(`🎉 ¡Dev Airdrop Exitoso!\n\nSe han transferido 8 $SLICE a la wallet.`);
                                window.dispatchEvent(new Event('balance-updated'));
                                window.dispatchEvent(new Event('collection-updated'));
                            } catch(err: any) { 
                                console.error(err); 
                                alert("⚠️ Error: " + (err.message || err));
                            } finally { 
                                btn.disabled = false;
                                btn.textContent = language === 'es' ? '+ Forzar Dev Airdrop (8 $SLICE)' : '+ Force Dev Airdrop (8 $SLICE)';
                            }
                        }}
                        style={{
                            background: '#005f73', color: '#FFF', border: '1px solid #00f0ff', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
                        }}
                    >
                        {language === 'es' ? '+ Forzar Dev Airdrop (8 $SLICE)' : '+ Force Dev Airdrop (8 $SLICE)'}
                    </button>
                </div>
            </div>

            {!isEmbedded && (
                <button style={{ marginTop: '2rem' }} className="primary-btn" onClick={onBack}>
                    {language === 'es' ? 'Volver al Lobby' : 'Back to Lobby'}
                </button>
            )}
        </div>
    );
}
