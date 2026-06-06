import fs from 'fs';
import path from 'path';

const filePath = 'd:/00 PROGRAMANDO/guitarPizza--AntiGravity/stellar-game-studio/sgs_frontend/src/games/guitar-pizza/GuitarPizzaGame.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// We search for the leaderboard modal opening block
const normalizedContent = content.replace(/\r\n/g, '\n');

const leaderboardBlock = `                        {(view === 'leaderboard' || closingView === 'leaderboard') && (`;

const bakeryBlock = `                        {(view === 'bakery' || closingView === 'bakery') && (
                            <div className={\`modal-backdrop \${closingView === 'bakery' ? 'closing' : ''}\`} onClick={() => closeModalWithAnimation('lobby')}>
                                <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ background: '#FFF8E7', border: '6px solid #8B0000', borderRadius: '16px' }}>
                                    <div className="modal-header" style={{ borderBottom: '3px dashed #8B0000', paddingBottom: '1rem', marginBottom: '1rem' }}>
                                        <div className="back-btn-circle" onClick={() => closeModalWithAnimation('lobby')} style={{ background: '#8B0000', color: 'white' }}>
                                            <ArrowLeft size={20} />
                                        </div>
                                        <h2 className="modal-title" style={{ color: '#8B0000', fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
                                            {language === 'es' ? '🍕 PANADERÍA DE SLICE' : '🍕 SLICE PIZZA BAKERY'}
                                        </h2>
                                        <div style={{ width: 40 }}></div>
                                    </div>

                                    {/* Ingredient Inventory Display */}
                                    <div style={{ padding: '0.5rem 1rem', background: 'rgba(139, 0, 0, 0.05)', borderRadius: '12px', border: '1px solid rgba(139, 0, 0, 0.15)', marginBottom: '1.2rem' }}>
                                        <h4 style={{ margin: '0 0 0.6rem 0', textTransform: 'uppercase', fontSize: '0.8rem', color: '#8B0000', letterSpacing: '0.05em' }}>
                                            {language === 'es' ? '🧑‍🍳 TUS INGREDIENTES RECOLECTADOS' : '🧑‍🍳 YOUR HARVESTED INGREDIENTS'}
                                        </h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                                            {[
                                                { name: language === 'es' ? 'Queso' : 'Cheese', icon: '🧀', val: ingredients.cheese },
                                                { name: language === 'es' ? 'Pep.' : 'Pep.', icon: '🍕', val: ingredients.pepperoni },
                                                { name: language === 'es' ? 'Tocin.' : 'Bacon', icon: '🥓', val: ingredients.bacon },
                                                { name: language === 'es' ? 'Ceb.' : 'Onion', icon: '🧅', val: ingredients.onion },
                                            ].map(ing => (
                                                <div key={ing.name} style={{ background: 'white', padding: '0.4rem', borderRadius: '8px', border: '1px solid #D0B488', textAlign: 'center' }}>
                                                    <span style={{ fontSize: '1.4rem', display: 'block' }}>{ing.icon}</span>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#666', display: 'block', margin: '0.2rem 0' }}>{ing.name}</span>
                                                    <span style={{ fontSize: '1.1rem', fontWeight: 'black', color: '#8B0000' }}>{ing.val}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Bakery Faucet Section */}
                                    {passkeyService.isPasskeyAccount(userAddress) && (
                                        <div style={{ padding: '1rem', background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(218, 165, 32, 0.05))', borderRadius: '12px', border: '2px solid #DAA520', marginBottom: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#8B0000', fontWeight: 'bold' }}>
                                                        {language === 'es' ? '💧 Faucet de Bienvenida' : '💧 Welcome $SLICE Faucet'}
                                                    </h3>
                                                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: '#666' }}>
                                                        {language === 'es' ? 'Acuña 5 $SLICE de cortesía para activar tu cuenta inteligente gasless.' : 'Mint 5 complimentary $SLICE to initialize your gasless smart account.'}
                                                    </p>
                                                </div>
                                                <button
                                                    className="secondary-btn"
                                                    style={{
                                                        background: '#DAA520',
                                                        borderColor: '#DAA520',
                                                        color: 'black',
                                                        fontWeight: 'bold',
                                                        padding: '0.4rem 0.8rem',
                                                        fontSize: '0.8rem',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={async () => {
                                                        try {
                                                            setStatus(language === 'es' ? 'Reclamando faucet...' : 'Claiming faucet...');
                                                            const result = await StellarContractService.claimSlice(userAddress, 0, {
                                                                signTransaction: async (xdr: string) => {
                                                                    const secret = passkeyService.getSecretKey(userAddress);
                                                                    if (!secret) throw new Error('Secret not found');
                                                                    const keypair = Keypair.fromSecret(secret);
                                                                    const tx = TransactionBuilder.fromXDR(xdr, NETWORK_PASS);
                                                                    tx.sign(keypair);
                                                                    return { signedTxXdr: tx.toXDR() };
                                                                }
                                                            } as any);
                                                            if (result.success) {
                                                                addLog(\`[Faucet] Successfully claimed 5 $SLICE on-chain!\`);
                                                                setStatus(language === 'es' ? '✨ ¡5 $SLICE Acuñados!' : '✨ 5 $SLICE Minted!');
                                                            } else {
                                                                setStatus(language === 'es' ? '❌ Ya reclamado o no disponible' : '❌ Already claimed or unavailable');
                                                            }
                                                        } catch (err: any) {
                                                            setStatus(\`Error: \${err?.message ?? 'Faucet failed'}\`);
                                                        } finally {
                                                            setTimeout(() => setStatus(''), 4000);
                                                        }
                                                    }}
                                                >
                                                    {language === 'es' ? '💦 RECLAMAR' : '💦 CLAIM'}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Bakery Oven / Recipes Section */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '35vh', overflowY: 'auto', paddingRight: '0.3rem' }}>
                                        {[
                                            {
                                                id: 'pep_pizza',
                                                icon: '🍕',
                                                name: language === 'es' ? 'Hornear Pizza de Pepperoni' : 'Bake Pepperoni Pizza',
                                                desc: language === 'es' ? 'Consume 10 Queso + 10 Pepperoni. Rinde 5 $SLICE.' : 'Consumes 10 Cheese + 10 Pepperoni. Yields 5 $SLICE.',
                                                req: { cheese: 10, pepperoni: 10, bacon: 0, onion: 0 },
                                                reward: 5
                                            },
                                            {
                                                id: 'supreme_pizza',
                                                icon: '🍄',
                                                name: language === 'es' ? 'Hornear Pizza Suprema' : 'Bake Supreme Pizza',
                                                desc: language === 'es' ? 'Consume 8 Queso + 8 Pepperoni + 8 Tocino + 8 Cebolla. Rinde 10 $SLICE.' : 'Consumes 8 Cheese + 8 Pepperoni + 8 Bacon + 8 Onion. Yields 10 $SLICE.',
                                                req: { cheese: 8, pepperoni: 8, bacon: 8, onion: 8 },
                                                reward: 10
                                            }
                                        ].map(recipe => {
                                            const hasCheese = ingredients.cheese >= recipe.req.cheese;
                                            const hasPep = ingredients.pepperoni >= recipe.req.pepperoni;
                                            const hasBacon = ingredients.bacon >= recipe.req.bacon;
                                            const hasOnion = ingredients.onion >= recipe.req.onion;
                                            const canBake = hasCheese && hasPep && hasBacon && hasOnion;

                                            const handleBake = async () => {
                                                if (!canBake) return;
                                                const storageKey = \`gp_ingredients_\${userAddress || 'offline'}\`;
                                                const updated = {
                                                    cheese: ingredients.cheese - recipe.req.cheese,
                                                    pepperoni: ingredients.pepperoni - recipe.req.pepperoni,
                                                    bacon: ingredients.bacon - recipe.req.bacon,
                                                    onion: ingredients.onion - recipe.req.onion
                                                };
                                                localStorage.setItem(storageKey, JSON.stringify(updated));
                                                setIngredients(updated);

                                                setStatus(language === 'es' ? '🔥 HORNEANDO PIZZA A 450°C...' : '🔥 BAKING PIZZA AT 450°F...');
                                                
                                                setTimeout(async () => {
                                                    try {
                                                        setPizzaBalance(prev => prev + (recipe.reward * 100));
                                                        
                                                        if (passkeyService.isPasskeyAccount(userAddress)) {
                                                            await StellarContractService.claimSlice(userAddress, Math.floor(Math.random() * 100000), {
                                                                signTransaction: async (xdr: string) => {
                                                                    const secret = passkeyService.getSecretKey(userAddress);
                                                                    if (!secret) throw new Error('Secret not found');
                                                                    const keypair = Keypair.fromSecret(secret);
                                                                    const tx = TransactionBuilder.fromXDR(xdr, NETWORK_PASS);
                                                                    tx.sign(keypair);
                                                                    return { signedTxXdr: tx.toXDR() };
                                                                }
                                                            } as any);
                                                        }
                                                        
                                                        setStatus(language === 'es' ? \`✨ ¡PIZZA COMPLETADA! + \${recipe.reward} \$SLICE\` : \`✨ PIZZA BAKED! +\${recipe.reward} \$SLICE\`);
                                                        addLog(\`🍕 Baked a Masterpiece! Earned +\${recipe.reward} \$SLICE tokens!\`);
                                                    } catch (err: any) {
                                                        console.error("Baking contract claim failed:", err);
                                                        setStatus(\`Bake claim error: \${err?.message ?? 'Unknown'}\`);
                                                    } finally {
                                                        setTimeout(() => setStatus(''), 4000);
                                                    }
                                                }, 2000);
                                            };

                                            return (
                                                <div key={recipe.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '0.8rem', borderRadius: '12px', border: '2px solid #8B0000', gap: '0.8rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                                        <span style={{ fontSize: '2.5rem' }}>{recipe.icon}</span>
                                                        <div style={{ textAlign: 'left' }}>
                                                            <h4 style={{ margin: 0, color: '#8B0000', fontSize: '0.9rem', fontWeight: 'bold' }}>{recipe.name}</h4>
                                                            <p style={{ margin: '0.2rem 0 0 0', color: '#666', fontSize: '0.75rem' }}>{recipe.desc}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        style={{
                                                            background: canBake ? 'linear-gradient(135deg, #d4af37, #b8860b)' : '#ccc',
                                                            borderColor: canBake ? '#b8860b' : '#999',
                                                            color: canBake ? 'black' : '#666',
                                                            padding: '0.5rem 0.8rem',
                                                            borderRadius: '8px',
                                                            fontSize: '0.8rem',
                                                            fontWeight: 'bold',
                                                            cursor: canBake ? 'pointer' : 'not-allowed',
                                                            flexShrink: 0
                                                        }}
                                                        disabled={!canBake}
                                                        onClick={handleBake}
                                                    >
                                                        {language === 'es' ? '🔥 HORNEAR' : '🔥 BAKE'}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    
                                    {status && (
                                        <div style={{
                                            marginTop: '1.2rem',
                                            padding: '0.6rem',
                                            borderRadius: '8px',
                                            background: '#8B0000',
                                            color: 'white',
                                            textAlign: 'center',
                                            fontWeight: 'bold',
                                            fontSize: '0.85rem',
                                            animation: 'pulse 1.5s infinite'
                                        }}>
                                            {status}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

`;

if (normalizedContent.includes(leaderboardBlock)) {
    console.log("Found leaderboard trigger! Prepending bakery modal...");
    const updatedNormalized = normalizedContent.replace(leaderboardBlock, bakeryBlock + leaderboardBlock);
    const finalContent = updatedNormalized.replace(/\n/g, '\r\n');
    fs.writeFileSync(filePath, finalContent, 'utf-8');
    console.log("Bakery modal successfully inserted!");
} else {
    console.log("Error: Could not find leaderboard trigger in file.");
}
