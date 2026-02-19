
import { useEffect, useRef, useState } from 'react';
import { Settings, Volume2, VolumeX, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';
import { ProofGenerator } from '../../zk/ProofGenerator';
import { SimulatedZKCircuit } from './SimulatedZKCircuit';
import { MockStellarService } from '../../services/MockStellarService';

// We'll import the game logic from a separate file or inline it here if feasible
// For now, we assume the game logic is exposed globally via window.GuitarPizza or similar after loading scripts

declare global {
    interface Window {
        initGuitarPizza: (canvas: HTMLCanvasElement | null, userAddress: string, onComplete: (score: number, inputLog?: any[]) => void) => () => void;
        BASE64_ASSETS: Record<string, string>;
    }
}

interface GuitarPizzaGameProps {
    userAddress: string;
    onGameComplete: (score: number) => void;
    onBack?: () => void;
}

export function GuitarPizzaGame({ userAddress, onGameComplete, onBack }: GuitarPizzaGameProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    // Cleanup ref now holds the engine interface or null
    const engineRef = useRef<{ cleanup: () => void, setVolume: (v: number) => void, startGame?: () => void } | null>(null);

    const [status, setStatus] = useState<string>('Initializing...');
    const [error, setError] = useState<string | null>(null);

    // UI State
    const [showSettings, setShowSettings] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [view, setView] = useState<'lobby' | 'story' | 'howto' | 'store' | 'friends'>('lobby');
    const [isVerifying, setIsVerifying] = useState(false);
    const [proofStatus, setProofStatus] = useState<'none' | 'generating' | 'success' | 'failed'>('none');

    // Profile State (Persist to local storage later)
    const [chefName, setChefName] = useState("Chef Anon");
    const [xHandle, setXHandle] = useState("@");

    // Audio Toggle Handler
    const toggleAudio = () => {
        const newMuteState = !isMuted;
        setIsMuted(newMuteState);
        if (engineRef.current) {
            engineRef.current.setVolume(newMuteState ? 0 : 1);
        }
    };

    const handleStartGame = () => {
        if (engineRef.current && engineRef.current.startGame) {
            console.log("[GuitarPizza] Calling engine.startGame()");
            engineRef.current.startGame();
        } else {
            console.warn("[GuitarPizza] Engine not ready yet.");
        }
    };

    useEffect(() => {
        console.log("[GuitarPizza] Component mounted.");

        // Load game scripts dynamically
        const loadScript = (src: string) => {
            return new Promise((resolve, reject) => {
                if (document.querySelector(`script[src="${src}"]`)) {
                    console.log(`[GuitarPizza] Script already loaded: ${src}`);
                    resolve(true);
                    return;
                }

                console.log(`[GuitarPizza] Loading script: ${src}`);
                const script = document.createElement('script');
                script.src = src;
                script.onload = () => {
                    console.log(`[GuitarPizza] Script loaded successfully: ${src}`);
                    resolve(true);
                };
                script.onerror = (e) => {
                    console.error(`[GuitarPizza] Script load error: ${src}`, e);
                    reject(e);
                };
                document.body.appendChild(script);
            });
        };

        const initGame = async () => {
            if (!canvasRef.current) {
                console.error("[GuitarPizza] Canvas ref is null");
                setError("Canvas not found");
                return;
            }

            setStatus('Loading Assets (this may take a moment)...');

            // Load scripts
            try {
                // Load assets first (large file)
                if (typeof window.BASE64_ASSETS === 'undefined') {
                    console.log("[GuitarPizza] BASE64_ASSETS undefined, loading assets.js...");
                    await loadScript('/game/assets.js');
                } else {
                    console.log("[GuitarPizza] BASE64_ASSETS already defined.");
                }

                // Then load engine
                if (!window.initGuitarPizza) {
                    console.log("[GuitarPizza] initGuitarPizza undefined, loading engine...");
                    setStatus('Loading Game Engine...');
                    await loadScript('/game/guitar-pizza-engine.js');
                } else {
                    console.log("[GuitarPizza] initGuitarPizza already defined.");
                }

            } catch (err) {
                console.error("[GuitarPizza] Failed to load game scripts:", err);
                setError("Failed to load game scripts. Check console.");
                return;
            }

            // Load CSS
            if (!document.getElementById('mafia-theme-css')) {
                const link = document.createElement('link');
                link.id = 'mafia-theme-css';
                link.rel = 'stylesheet';
                link.href = '/mafia-theme.css';
                document.head.appendChild(link);
            }

            // Initialize the game instance
            console.log("[GuitarPizza] Initializing game instance...");
            setStatus('Starting Game...');

            if (window.initGuitarPizza) {
                try {
                    // Check if initGuitarPizza returns an object (new version) or function (old version fallback)
                    const result = window.initGuitarPizza(canvasRef.current, userAddress, async (finalScore: number, inputLog: any[] = []) => {
                        console.log("[GuitarPizza] Game complete. Score:", finalScore);
                        console.log("[GuitarPizza] Input Log captured:", inputLog.length, "entries");

                        // Start ZK Verification
                        setIsVerifying(true);
                        setProofStatus('generating');

                        try {
                            // 1. ZK Circuit Simulation (Anti-Spam / Ghost Click)
                            // In a real scenario, this happens inside the WASM prover, but here we simulate the logic first
                            const zkResult = SimulatedZKCircuit.verifyTrace(inputLog, {}, finalScore);

                            if (!zkResult.verified) {
                                throw new Error(`ZK Verification Failed: ${zkResult.reason}`);
                            }

                            if (zkResult.penaltyCount > 0) {
                                console.warn(`[ZK] Penalty applied for ${zkResult.penaltyCount} ghost clicks.`);
                            }

                            // 2. Proof Generation (Mock)
                            const proofData = await ProofGenerator.generateLevelProof(1, finalScore, 0, 0);
                            console.log("[GuitarPizza] Proof generated:", proofData);

                            // 3. Submit to Mock Stellar Contract
                            const submission = await MockStellarService.submitVerifiedScore(userAddress, 1, finalScore, proofData.proof);

                            if (!submission.success) {
                                throw new Error(submission.message);
                            }

                            setProofStatus('success');

                            // Emit the original callback after a small delay to show the success state
                            setTimeout(() => {
                                setIsVerifying(false);
                                onGameComplete(finalScore);
                            }, 2000);

                        } catch (err: any) {
                            console.error("[GuitarPizza] Verification failed:", err);
                            setStatus(`Security Alert: ${err.message}`); // Show error on HUD
                            setProofStatus('failed');
                            setTimeout(() => setIsVerifying(false), 4000);
                        }
                    });

                    if (typeof result === 'function') {
                        // Old engine version fallback
                        engineRef.current = { cleanup: result, setVolume: () => { } };
                    } else {
                        // New engine version
                        engineRef.current = result;
                    }

                    setStatus(''); // Clear status on success
                    console.log("[GuitarPizza] Game initialized successfully.");
                } catch (e) {
                    console.error("[GuitarPizza] Error during window.initGuitarPizza:", e);
                    setError("Game engine failed to start.");
                }
            } else {
                console.error("[GuitarPizza] window.initGuitarPizza is still undefined after loading scripts.");
                setError("Game engine not found.");
            }
        };

        initGame();

        return () => {
            console.log("[GuitarPizza] Cleanup called.");
            // Cleanup game engine
            if (engineRef.current) {
                engineRef.current.cleanup();
                engineRef.current = null;
            }
            // Remove CSS
            const link = document.getElementById('mafia-theme-css');
            if (link) {
                link.remove();
            }
        };
    }, []); // userAddress is a dependency but we only want to run this ONCE on mount for now to avoid re-init loops

    const handleBackToLobby = () => {
        // Hide results
        const results = document.getElementById('results');
        if (results) results.style.display = 'none';

        // Show overlay (Engine also handles this, but we force it to sync React state)
        const overlay = document.getElementById('overlay');
        if (overlay) overlay.style.display = 'flex';

        // Reset view
        setView('lobby');

        // Optional: Trigger engine reset if needed, but engine has its own listener on this ID
    };

    return (
        <div className="w-full h-full flex flex-col bg-[#1a1a1a] text-white font-sans overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-[#111] border-b border-[#333] z-20">
                <div className="flex items-center gap-4">
                    {onBack && (
                        <button onClick={onBack} className="settings-btn" title="Exit to Library">
                            <ArrowLeft size={24} />
                        </button>
                    )}
                    <h1 className="text-xl font-bold tracking-wider" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent)' }}>
                        RHYTHM SLICE
                    </h1>
                </div>
                <button onClick={() => setShowSettings(true)}>
                    <Settings size={24} />
                </button>
            </div>

            {/* Game Container */}
            <div id="restaurant-table-bg" className="pizzeria-checker" style={{ flex: 1, padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', position: 'relative' }}>
                <div id="game-device-screen" className="game-container game-frame" ref={containerRef} style={{ width: 'auto', height: '100%', aspectRatio: '9/16', maxHeight: '100%', position: 'relative', overflow: 'hidden', border: '8px solid #000', borderRadius: '20px', boxShadow: '0 0 50px rgba(0,0,0,0.5)' }}>

                    {/* Status & Errors */}
                    {status && (
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', zIndex: 1000, textAlign: 'center' }}>
                            <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent)' }}>{status}</h2>
                        </div>
                    )}
                    {error && (
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--color-error)', zIndex: 1000, textAlign: 'center', background: 'rgba(0,0,0,0.8)', padding: '20px', borderRadius: 'var(--radius-md)' }}>
                            <h2>Error</h2>
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Settings Overlay */}
                    {/* Settings Overlay */}
                    {showSettings && (
                        <div className="modal-backdrop" onClick={() => setShowSettings(false)}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <div className="back-btn-circle" onClick={() => setShowSettings(false)}>
                                        <ArrowLeft size={20} />
                                    </div>
                                    <h2 className="modal-title">SETUP</h2>
                                    <div style={{ width: 40 }}></div>
                                </div>

                                <div style={{ flex: 1, overflowY: 'auto' }}>
                                    <div style={{ marginBottom: '1.5rem', width: '100%' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>Chef Name</label>
                                        <input
                                            type="text"
                                            value={chefName}
                                            onChange={(e) => setChefName(e.target.value)}
                                            style={{ width: '100%', padding: '0.8rem', background: '#f5f5f5', border: '1px solid #ddd', color: '#333', borderRadius: '8px', fontSize: '1rem' }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: '1.5rem', width: '100%' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>X Handle</label>
                                        <input
                                            type="text"
                                            value={xHandle}
                                            onChange={(e) => setXHandle(e.target.value)}
                                            style={{ width: '100%', padding: '0.8rem', background: '#f5f5f5', border: '1px solid #ddd', color: '#333', borderRadius: '8px', fontSize: '1rem' }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: '1.5rem', width: '100%' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>Connected Wallet</label>
                                        <div style={{ padding: '0.8rem', background: 'rgba(46, 204, 113, 0.1)', border: '1px solid #2ecc71', borderRadius: '8px', fontSize: '0.9rem', wordBreak: 'break-all', color: '#27ae60' }}>
                                            {userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : "Not Connected"}
                                        </div>
                                    </div>

                                    <div className="settings-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9f9f9', padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }}>
                                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Master Volume</span>
                                        <button onClick={toggleAudio} className="settings-btn" style={{ background: isMuted ? '#bdc3c7' : 'var(--ph-green)', borderRadius: '50%', width: 50, height: 50, padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 0 }}>
                                            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                                        </button>
                                    </div>
                                </div>

                                <button className="close-btn" onClick={() => setShowSettings(false)} style={{ width: '100%' }}>BACK TO COOKING</button>
                            </div>
                        </div>
                    )}

                    {/* MAIN LOBBY OVERLAY */}
                    <div id="overlay" style={{ display: 'flex', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }}>

                        <div className="bg-particles">
                            {/* Floating UP particles */}
                            <div className="particle p1">🍅</div>
                            <div className="particle p2">🧀</div>
                            <div className="particle p3">🌶️</div>
                            <div className="particle p4">🍄</div>
                            <div className="particle p5">🎸</div>
                        </div>

                        {/* RAIN DOWN mini pizzas */}
                        <div className="pizza-rain">
                            <div className="falling-pizza fp1">🍕</div>
                            <div className="falling-pizza fp2">🍕</div>
                            <div className="falling-pizza fp3">🍕</div>
                            <div className="falling-pizza fp4">🍕</div>
                            <div className="falling-pizza fp5">🍕</div>
                        </div>

                        {/* PERSISTENT LOBBY BACKGROUND */}
                        <div className="lobby-content" style={{
                            transition: 'all 0.3s ease',
                            filter: view !== 'lobby' ? 'blur(8px) brightness(0.6)' : 'none',
                            pointerEvents: view !== 'lobby' ? 'none' : 'auto',
                            transform: view !== 'lobby' ? 'scale(0.95)' : 'scale(1)',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            <div className="logo-container">
                                <h1 className="main-logo">RHYTHM<br />SLICE</h1>
                                <p className="subtitle">PIZZA KITCHEN</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '2rem', width: '80%', maxWidth: '300px' }}>
                                <button id="startBtn"
                                    onClick={handleStartGame}
                                    disabled={!engineRef.current}
                                    style={{ opacity: engineRef.current ? 1 : 0.5, cursor: engineRef.current ? 'pointer' : 'not-allowed', fontSize: '1.2rem', padding: '1rem' }}
                                >
                                    {engineRef.current ? "🔥 FIRE UP OVEN" : "🔥 HEATING UP..."}
                                </button>

                                <div className="grid grid-cols-2 gap-3 mt-4 w-full">
                                    <button className="secondary-btn lobby-nav-btn" onClick={() => setView('store')}>
                                        <span className="btn-icon">🛒</span>
                                        <span className="btn-text">MARKET</span>
                                    </button>
                                    <button className="secondary-btn lobby-nav-btn" onClick={() => setView('friends')}>
                                        <span className="btn-icon">👥</span>
                                        <span className="btn-text">CREW</span>
                                    </button>
                                    <button className="secondary-btn lobby-nav-btn" onClick={() => setShowSettings(true)}>
                                        <span className="btn-icon">⚙️</span>
                                        <span className="btn-text">SETUP</span>
                                    </button>
                                    <button className="secondary-btn lobby-nav-btn" onClick={() => setView('howto')}>
                                        <span className="btn-icon">📜</span>
                                        <span className="btn-text">RULES</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* MODALS OVERLAY */}
                        {view === 'store' && (
                            <div className="modal-backdrop" onClick={() => setView('lobby')}>
                                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                    <div className="modal-header">
                                        <div className="back-btn-circle" onClick={() => setView('lobby')}>
                                            <ArrowLeft size={20} />
                                        </div>
                                        <h2 className="modal-title">MARKET</h2>
                                        <div style={{ width: 40 }}></div>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem', textAlign: 'center' }}>Illicit goods for the aspiring Don.</p>

                                    <div className="store-grid">
                                        <div className="store-item" style={{ background: '#f9f9f9', padding: '0.8rem', borderRadius: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌶️</div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Spicy Pepperoni</div>
                                            <div style={{ color: '#dba11c', fontSize: '0.8rem', fontWeight: 'bold' }}>500 🍕</div>
                                        </div>
                                        <div className="store-item" style={{ background: '#f9f9f9', padding: '0.8rem', borderRadius: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🛡️</div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Oven Mitts</div>
                                            <div style={{ color: '#dba11c', fontSize: '0.8rem', fontWeight: 'bold' }}>1200 🍕</div>
                                        </div>
                                        <div className="store-item" style={{ background: '#f9f9f9', padding: '0.8rem', borderRadius: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🧂</div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Secret Sauce</div>
                                            <div style={{ color: '#dba11c', fontSize: '0.8rem', fontWeight: 'bold' }}>5000 🍕</div>
                                        </div>
                                        <div className="store-item" style={{ background: '#eee', padding: '0.8rem', borderRadius: '12px', border: '1px solid #ddd', textAlign: 'center', opacity: 0.7 }}>
                                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔒</div>
                                            <div style={{ fontSize: '0.9rem', color: '#666' }}>Mystery Box</div>
                                            <div style={{ color: '#999', fontSize: '0.8rem' }}>???</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {view === 'friends' && (
                            <div className="modal-backdrop" onClick={() => setView('lobby')}>
                                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                    <div className="modal-header">
                                        <div className="back-btn-circle" onClick={() => setView('lobby')}>
                                            <ArrowLeft size={20} />
                                        </div>
                                        <h2 className="modal-title">THE CREW</h2>
                                        <div style={{ width: 40 }}></div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%', marginBottom: '1rem', flex: 1, overflowY: 'auto' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9f9f9', padding: '0.8rem', borderRadius: '8px', border: '1px solid #eee' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#ddd' }}></div>
                                                <span style={{ fontWeight: 'bold' }}>Tony Slicer</span>
                                            </div>
                                            <span style={{ color: '#2ecc71', fontSize: '0.8rem', fontWeight: 'bold' }}>Online</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9f9f9', padding: '0.8rem', borderRadius: '8px', border: '1px solid #eee' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#ddd' }}></div>
                                                <span style={{ fontWeight: 'bold' }}>Vinnie Kneads</span>
                                            </div>
                                            <span style={{ color: '#95a5a6', fontSize: '0.8rem' }}>Offline 2h</span>
                                        </div>
                                    </div>
                                    <button className="secondary-btn" style={{ width: '100%', marginBottom: '0.5rem' }}>+ INVITE A FRIEND</button>
                                </div>
                            </div>
                        )}

                        {view === 'story' && (
                            <div className="modal-backdrop" onClick={() => setView('lobby')}>
                                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                    <div className="modal-header">
                                        <div className="back-btn-circle" onClick={() => setView('lobby')}>
                                            <ArrowLeft size={20} />
                                        </div>
                                        <h2 className="modal-title">LEGEND</h2>
                                        <div style={{ width: 40 }}></div>
                                    </div>
                                    <div style={{ padding: '0 1rem', textAlign: 'center' }}>
                                        <p style={{ lineHeight: '1.6' }}>New York, 1984. The Five Families control the cheese... You are the only one with the Rhythm to break their crust.</p>
                                        <p style={{ marginTop: '1rem', lineHeight: '1.6' }}>Prove your worth in the kitchen. Hit the notes, bake the perfect pies, and become the...</p>
                                        <h3 style={{ fontSize: '2rem', color: '#ccafa5', marginTop: '1rem', fontFamily: 'var(--font-title)' }}>DON OF DOUGH</h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        {view === 'howto' && (
                            <div className="modal-backdrop" onClick={() => setView('lobby')}>
                                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                    <div className="modal-header">
                                        <div className="back-btn-circle" onClick={() => setView('lobby')}>
                                            <ArrowLeft size={20} />
                                        </div>
                                        <h2 className="modal-title">RULES</h2>
                                        <div style={{ width: 40 }}></div>
                                    </div>

                                    <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
                                        <section style={{ marginBottom: '1.5rem' }}>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.8rem', color: 'var(--ph-gold)', borderBottom: '1px solid #eee', paddingBottom: '0.3rem' }}>1. THE CONTROLS</h3>
                                            <p style={{ fontSize: '0.95rem', color: '#444', marginBottom: '1rem' }}>Tap the keys as ingredients reach the plate at the bottom.</p>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1rem' }}>
                                                <div className="key-box">A<br /><span style={{ fontSize: '0.7rem' }}>🔴</span></div>
                                                <div className="key-box">S<br /><span style={{ fontSize: '0.7rem' }}>🟡</span></div>
                                                <div className="key-box">D<br /><span style={{ fontSize: '0.7rem' }}>🟢</span></div>
                                                <div className="key-box">K<br /><span style={{ fontSize: '0.7rem' }}>🟣</span></div>
                                            </div>
                                        </section>

                                        <section style={{ marginBottom: '1.5rem' }}>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.8rem', color: 'var(--ph-gold)', borderBottom: '1px solid #eee', paddingBottom: '0.3rem' }}>2. BAKING THE PIE</h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                                    <div style={{ fontSize: '1.5rem' }}>🎯</div>
                                                    <div>
                                                        <p style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Precision Matters</p>
                                                        <p style={{ fontSize: '0.85rem', color: '#666' }}>Hitting notes on time fills your <b>Pizza Meter</b>. "Perfect" hits grant bonus progress.</p>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                                    <div style={{ fontSize: '1.5rem' }}>🔄</div>
                                                    <div>
                                                        <p style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Maintain Combo</p>
                                                        <p style={{ fontSize: '0.85rem', color: '#666' }}>Don't miss! High combos activate <b>Fever Mode</b>, doubling your point gain.</p>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                                    <div style={{ fontSize: '1.5rem' }}>📦</div>
                                                    <div>
                                                        <p style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Complete Orders</p>
                                                        <p style={{ fontSize: '0.85rem', color: '#666' }}>Fill the meter completely to finish a pizza. Each finished pie increases your tips (score multipliers).</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        <section>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.8rem', color: 'var(--ph-gold)', borderBottom: '1px solid #eee', paddingBottom: '0.3rem' }}>3. THE DON'S REWARD</h3>
                                            <p style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>Produce the finest pies to climb the ranks and unlock exclusive kitchen tools in the Market.</p>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                    <div id="results" style={{ display: 'none' }}>
                        <h1>SERVICE ENDED</h1>
                        <div className="grade" id="resGrade">A</div>
                        <div className="stat-row">SCORE: <span id="resScore">0</span></div>
                        <button id="restartBtn">COOK AGAIN</button>
                        <button id="backToLobbyBtn" onClick={handleBackToLobby}>EXIT KITCHEN</button>
                    </div>

                    {/* ZK VERIFICATION OVERLAY */}
                    {isVerifying && (
                        <div className="modal-backdrop" style={{ zIndex: 100, display: 'flex', flexDirection: 'column', color: 'white' }}>
                            <div className="modal-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem' }}>
                                {proofStatus === 'generating' ? (
                                    <>
                                        <Loader2 className="animate-spin mb-4" size={60} color="var(--ph-gold)" />
                                        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.8rem', color: '#333' }}>GENERATING PROOF</h2>
                                        <p style={{ color: '#666', textAlign: 'center', marginTop: '1rem' }}>Securing your score with Zero-Knowledge magic...</p>
                                    </>
                                ) : proofStatus === 'success' ? (
                                    <>
                                        <div style={{ background: 'rgba(39, 174, 96, 0.1)', padding: '2rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
                                            <ShieldCheck size={80} color="#27ae60" />
                                        </div>
                                        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.8rem', color: '#333' }}>SCORE VERIFIED</h2>
                                        <p style={{ color: '#27ae60', fontWeight: 'bold', marginTop: '0.5rem' }}>Submission valid & sealed.</p>
                                    </>
                                ) : (
                                    <>
                                        <div style={{ background: 'rgba(192, 57, 43, 0.1)', padding: '2rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
                                            <VolumeX size={80} color="#c0392b" />
                                        </div>
                                        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.8rem', color: '#333' }}>VERIFICATION FAILED</h2>
                                        <p style={{ color: '#c0392b', marginTop: '1rem' }}>Something went wrong with the recipe.</p>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    <canvas ref={canvasRef} id="gameCanvas" style={{ width: '100%', height: '100%' }} />
                </div>
            </div>
        </div>
    );
}
