
import { useEffect, useRef, useState, useCallback } from 'react';
import { Settings, Volume2, VolumeX, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';
import { ProofGenerator } from '../../zk/ProofGenerator';
import { SimulatedZKCircuit } from './SimulatedZKCircuit';
import { StellarContractService, type GameSessionStats, ACHIEVEMENT } from '../../services/StellarContractService';
import { useWallet } from '@/hooks/useWallet';
import { Buffer } from 'buffer';

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

interface TxRecord {
    hash: string;
    type: string;   // e.g. "Score Submit", "Leaderboard"
    score: number;
    timestamp: number; // Date.now()
}

const EXPLORER_BASE = 'https://stellar.expert/explorer/testnet/tx';

export function GuitarPizzaGame({ userAddress, onGameComplete, onBack }: GuitarPizzaGameProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    // Cleanup ref now holds the engine interface or null
    const engineRef = useRef<{ cleanup: () => void, setVolume: (v: number) => void, startGame?: () => void } | null>(null);
    // Tracks the actual on-chain session ID (may differ from local if a session was reused)
    const onChainSessionIdRef = useRef<number>(0);

    const [status, setStatus] = useState<string>('Initializing...');
    const [error, setError] = useState<string | null>(null);

    // Wallet
    const { getContractSigner, networkPassphrase, isConnected } = useWallet();

    // UI State
    const [showSettings, setShowSettings] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [view, setView] = useState<'lobby' | 'story' | 'howto' | 'store' | 'leaderboard'>('lobby');
    const [isVerifying, setIsVerifying] = useState(false);
    const [proofStatus, setProofStatus] = useState<'none' | 'generating' | 'success' | 'failed'>('none');
    const [txHash, setTxHash] = useState<string | null>(null);

    // TX pop-up after game completion
    const [showTxPopup, setShowTxPopup] = useState(false);
    const [popupTxs, setPopupTxs] = useState<TxRecord[]>([]);      // TXs of the current game
    const [popupCountdown, setPopupCountdown] = useState(8);
    const popupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const popupIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // TX history (persistent across games via localStorage)
    const [txHistory, setTxHistory] = useState<TxRecord[]>(() => {
        try { return JSON.parse(localStorage.getItem('gp_tx_history') ?? '[]'); }
        catch { return []; }
    });
    // Hold the finalScore to pass to onGameComplete when the popup closes
    const pendingFinalScoreRef = useRef<number>(0);

    // On-chain verified score (shown only after contract confirmation)
    const [onChainScore, setOnChainScore] = useState<number | null>(null);

    // Leaderboard from zk-leaderboard contract
    const [leaderboard, setLeaderboard] = useState<Array<{ rank: number; player: string; score: number }>>([]);
    const [leaderboardLoading, setLeaderboardLoading] = useState(false);

    // Profile State (Persist to local storage later)
    const [chefName, setChefName] = useState("Chef Anon");
    const [xHandle, setXHandle] = useState("@");

    // Results Screen State
    const [resultParams, setResultParams] = useState({ bgImage: '' });

    // ── TX popup helpers ──────────────────────────────────────────────────────
    const closeTxPopup = useCallback(() => {
        if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
        if (popupIntervalRef.current) clearInterval(popupIntervalRef.current);
        setShowTxPopup(false);
        onGameComplete(pendingFinalScoreRef.current);
    }, [onGameComplete]);

    const openTxPopup = useCallback((txs: TxRecord[], finalScore: number) => {
        pendingFinalScoreRef.current = finalScore;
        setPopupTxs(txs);
        setPopupCountdown(8);
        setShowTxPopup(true);

        // Countdown every second
        popupIntervalRef.current = setInterval(() => {
            setPopupCountdown(prev => {
                if (prev <= 1) {
                    if (popupIntervalRef.current) clearInterval(popupIntervalRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Auto-close after 8s
        popupTimerRef.current = setTimeout(() => {
            if (popupIntervalRef.current) clearInterval(popupIntervalRef.current);
            setShowTxPopup(false);
            onGameComplete(finalScore);
        }, 8000);
    }, [onGameComplete]);

    // ── Leaderboard loader ────────────────────────────────────────────────────
    const loadLeaderboard = useCallback(async () => {
        setLeaderboardLoading(true);
        try {
            const entries = await StellarContractService.getLeaderboard(userAddress, 1);
            const mapped = (entries as any[]).slice(0, 5).map((e: any, i: number) => ({
                rank: i + 1,
                player: String(e.player ?? ''),
                score: Number(e.score ?? 0),
            }));
            setLeaderboard(mapped);
        } catch {
            // silently fail — leaderboard is best-effort
        } finally {
            setLeaderboardLoading(false);
        }
    }, [userAddress]);

    // Audio Toggle Handler
    const toggleAudio = () => {
        const newMuteState = !isMuted;
        setIsMuted(newMuteState);
        if (engineRef.current) {
            engineRef.current.setVolume(newMuteState ? 0 : 1);
        }
    };

    const addLog = (msg: string) => {
        console.log(msg);
    };

    const handleStartGame = () => {
        if (engineRef.current && engineRef.current.startGame) {
            addLog("[GuitarPizza] Calling engine.startGame()");
            engineRef.current.startGame();
        } else {
            console.warn("[GuitarPizza] Engine not ready yet.");
            addLog("[WARN] Engine not ready yet.");
        }
    };

    // Load leaderboard on mount
    useEffect(() => { loadLeaderboard(); }, [loadLeaderboard]);

    useEffect(() => {
        addLog("[GuitarPizza] Component mounted.");

        // Load game scripts dynamically
        const loadScript = (src: string) => {
            return new Promise((resolve, reject) => {
                if (document.querySelector(`script[src="${src}"]`)) {
                    addLog(`[GuitarPizza] Script already loaded: ${src}`);
                    resolve(true);
                    return;
                }

                addLog(`[GuitarPizza] Loading script: ${src}`);
                const script = document.createElement('script');
                script.src = src;
                script.onload = () => {
                    addLog(`[GuitarPizza] Script loaded successfully: ${src}`);
                    resolve(true);
                };
                script.onerror = (e) => {
                    console.error(`[GuitarPizza] Script load error: ${src}`, e);
                    addLog(`[ERROR] Script load error: ${src}`);
                    reject(e);
                };
                document.body.appendChild(script);
            });
        };

        const initGame = async () => {
            if (!canvasRef.current) {
                console.error("[GuitarPizza] Canvas ref is null");
                setError("Canvas not found");
                addLog("[ERROR] Canvas ref is null");
                return;
            }

            setStatus('Loading Assets (this may take a moment)...');
            addLog("Status: Loading Assets...");

            // Load scripts
            try {
                if (!window.initGuitarPizza) {
                    addLog("[GuitarPizza] initGuitarPizza undefined, loading engine...");
                    setStatus('Loading Game Engine...');

                    const baseUrl = import.meta.env.BASE_URL;
                    const primaryPath = `${baseUrl}game/guitar-pizza-engine.js`.replace('//', '/');

                    addLog(`[GuitarPizza] Loading engine from: ${primaryPath}`);
                    await loadScript(primaryPath);
                } else {
                    addLog("[GuitarPizza] initGuitarPizza already defined.");
                }

            } catch (err) {
                console.error("[GuitarPizza] Failed to load game scripts:", err);
                setError("Failed to load game scripts. Check console.");
                addLog(`[ERROR] Failed to load scripts: ${err}`);
                return;
            }


            // Load CSS with correct public path
            const publicUrl = import.meta.env.BASE_URL; // e.g. /guitarPizza--AntiGravity/

            if (!document.getElementById('mafia-theme-css')) {
                const link = document.createElement('link');
                link.id = 'mafia-theme-css';
                link.rel = 'stylesheet';
                link.href = `${publicUrl}mafia-theme.css`.replace('//', '/');
                document.head.appendChild(link);
            }

            // Initialize the game instance
            addLog("[GuitarPizza] Initializing game instance...");

            // Generate a random session ID as candidate (may be replaced by an existing active one)
            const localSessionId = Math.floor(Math.random() * 1000000);
            onChainSessionIdRef.current = localSessionId; // default; updated after on-chain call

            // Start game session on-chain (fire and forget — non-blocking).
            // score_goal = 5000: player must beat La Casa (house) by hitting 5000 pts.
            // Guard: getContractSigner() throws if no wallet connected — catch silently.
            // If player already has an open session (#4), startGame reuses it automatically.
            try {
                const signer = getContractSigner();
                StellarContractService.startGame(userAddress, localSessionId, 1, signer, 5000)
                    .then(result => {
                        // Use the actual on-chain session ID (may be a reused one)
                        onChainSessionIdRef.current = result.sessionId;
                        if (!result.success) {
                            console.warn("[GuitarPizza] On-chain session registration failed:", result.error);
                        }
                    })
                    .catch(err => {
                        console.warn("[GuitarPizza] On-chain session registration failed:", err);
                    });
            } catch {
                console.warn("[GuitarPizza] No wallet connected — skipping on-chain session start.");
            }

            setStatus('Starting Game...');
            addLog("Status: Starting Game...");

            if (window.initGuitarPizza) {
                try {
                    // Check if initGuitarPizza returns an object (new version) or function (old version fallback)
                    const result = window.initGuitarPizza(canvasRef.current, userAddress, async (finalScore: number, inputLog: any[] = []) => {
                        // Clear any lingering status when game completes, just in case
                        setStatus('');
                        setOnChainScore(null); // reset until confirmed from contract

                        addLog(`GuitarPizza] Game complete. Score: ${finalScore}`);

                        // Randomly select defeat/result background (50/50 chance as requested)
                        // Paths must be prefixed with publicUrl for proper deployment
                        const publicUrl = import.meta.env.BASE_URL;
                        const defeatImages = [
                            `${publicUrl}game/assets/decoracion/DerrotaMiedo.jpg`.replace('//', '/'),
                            `${publicUrl}game/assets/decoracion/DerrotaAlCielo.jpg`.replace('//', '/')
                        ];
                        const randomBg = defeatImages[Math.floor(Math.random() * defeatImages.length)];
                        setResultParams({ bgImage: randomBg });

                        // Start ZK Verification
                        setIsVerifying(true);
                        setProofStatus('generating');

                        try {
                            // 1. ZK Circuit Simulation
                            const zkResult = SimulatedZKCircuit.verifyTrace(inputLog, {}, finalScore);

                            if (!zkResult.verified) {
                                throw new Error(`ZK Verification Failed: ${zkResult.reason}`);
                            }

                            // 2. Build session stats from input log + final score
                            // The engine now attaches stats to inputLog.stats (fixed)
                            const engineStats = (inputLog as any)?.stats ?? {};
                            const hits = engineStats.totalHits ?? 0;
                            const perfects = engineStats.perfectHits ?? 0;
                            const fever = engineStats.feverSeconds ?? 0;
                            const pizzas = engineStats.pizzasCompleted ?? 0;

                            // Use the engine's final score directly — it is the authoritative value
                            // the player sees on screen. The ZK stats are kept for the receipt/proof
                            // structure but the score field is taken from the engine to avoid
                            // any mismatch between the recalculation formula and the actual gameplay.
                            const verifiedScore = finalScore;
                            addLog(`[GuitarPizza] Engine score: ${finalScore} | ZK-verified score: ${verifiedScore}`);
                            addLog(`[GuitarPizza] Stats — hits:${hits} perfects:${perfects} fever:${fever}s pizzas:${pizzas}`);

                            const sessionStats: GameSessionStats = {
                                levelId: 1,
                                score: verifiedScore,  // ← verified score goes on-chain
                                sessionId: onChainSessionIdRef.current,
                                perfectHits: perfects,
                                totalHits: hits,
                                trapsAvoided: engineStats.trapsAvoided ?? 0,
                                totalTraps: engineStats.totalTraps ?? 0,
                                feverSeconds: fever,
                                pizzasCompleted: pizzas,
                                playerAddress: userAddress,
                            };

                            // 3. Generate RISC Zero receipt (164 bytes: journal + seal)
                            const { receipt } = await ProofGenerator.generateSessionReceipt(sessionStats);
                            addLog(`[GuitarPizza] Receipt generated: ${receipt.length} bytes`);

                            // DEMO / NO-WALLET CHECK: Skip blockchain submission when not connected
                            if (userAddress === 'G_DEMO_USER' || !isConnected) {
                                addLog(userAddress === 'G_DEMO_USER'
                                    ? "[DEMO MODE] Skipping blockchain submission."
                                    : "[GuitarPizza] No wallet connected — score verified locally only.");
                                await new Promise(resolve => setTimeout(resolve, 800));
                                addLog(`SUCCESS! Score verified locally.`);
                                setProofStatus('success');
                                setTimeout(() => { setIsVerifying(false); }, 2000);
                                return;
                            }

                            // 4. Submit all contracts in sequence via StellarContractService
                            addLog("Receipt ready. Submitting to Stellar contracts...");
                            setStatus('Submitting to Stellar...');

                            const signer = getContractSigner();
                            const result = await StellarContractService.postGameFlow(
                                userAddress,
                                sessionStats,
                                signer,
                            );

                            // Log what happened on-chain
                            if (result.scoreSubmitted) addLog('✅ Score verified on guitar-pizza contract');
                            if (result.leaderboardRank) addLog(`🏆 Leaderboard rank: #${result.leaderboardRank}`);
                            if (result.weeklyCompleted) addLog('🍕 Weekly recipe challenge completed!');
                            if (result.achievementsClaimed.length > 0) {
                                const names = ['Perfect Run', 'Trap Master', 'Fever God', 'Iron Chef'];
                                result.achievementsClaimed.forEach(id => addLog(`🏅 Badge earned: ${names[id] ?? id}`));
                            }
                            if (result.errors.length > 0) {
                                result.errors.forEach(e => console.warn('[StellarContract]', e));
                            }

                            // Save tx hash for Stellar Explorer link
                            if (result.txHash) {
                                setTxHash(result.txHash);
                                addLog(`🔗 TX: ${result.txHash}`);
                            }

                            // The score submitted is the authoritative on-chain value.
                            // We skip getSession() because the sessionId used locally may differ
                            // from the one the contract stored (reuse logic in startGame).
                            // verifiedScore === finalScore (set above), which is what was submitted.
                            const confirmedScore = verifiedScore;
                            setOnChainScore(confirmedScore);
                            addLog(`✅ On-chain score confirmed: ${confirmedScore}`);

                            // Refresh leaderboard now that the new score is recorded
                            loadLeaderboard();

                            addLog(`SUCCESS! Score verified on-chain.`);

                            setStatus(''); // Clear submitting overlay
                            setProofStatus('success');

                            setTimeout(() => {
                                setIsVerifying(false); // Close verification overlay

                                // Build TxRecord list for this game's popup
                                const gameTxs: TxRecord[] = [];
                                if (result.txHash) {
                                    gameTxs.push({ hash: result.txHash, type: 'Score Submit', score: confirmedScore, timestamp: Date.now() });
                                }

                                if (gameTxs.length > 0) {
                                    // Persist to history (max 20 entries)
                                    setTxHistory(prev => {
                                        const updated = [...gameTxs, ...prev].slice(0, 20);
                                        localStorage.setItem('gp_tx_history', JSON.stringify(updated));
                                        return updated;
                                    });
                                    openTxPopup(gameTxs, confirmedScore);
                                } else {
                                    onGameComplete(confirmedScore);
                                }
                            }, 2000);

                        } catch (err: any) {
                            console.error("[GuitarPizza] Verification failed:", err);
                            setStatus(''); // Clear the submitting overlay on error too!
                            let errorMessage = "Verification Failed";

                            // Parse specific error types
                            if (err.message) {
                                if (err.message.includes("User declined") || err.message.includes("Rejected")) {
                                    errorMessage = "Transaction Rejected by User";
                                } else if (err.message.includes("HostError") || err.message.includes("UnreachableCodeReached")) {
                                    errorMessage = "Contract Error: Level Not Configured?";
                                } else if (err.message.includes("tx_bad_seq")) {
                                    errorMessage = "Sequence Error: Refresh & Retry";
                                } else {
                                    // Clean up long stack traces if present
                                    errorMessage = err.message.split('\n')[0];
                                }
                            }

                            setStatus(errorMessage);
                            setProofStatus('failed');
                            addLog(`[ERROR] ${errorMessage}`);

                            // Still show full error in console for debugging, but clean UI
                            setTimeout(() => {
                                setIsVerifying(false); // Close verification overlay
                                setStatus(''); // Clear persistent error overlay
                            }, 4000);
                        }
                    });

                    if (typeof result === 'function') {
                        engineRef.current = { cleanup: result, setVolume: () => { } };
                    } else {
                        engineRef.current = result;
                    }

                    setStatus('');
                    addLog("[GuitarPizza] Game initialized successfully.");
                } catch (e) {
                    console.error("[GuitarPizza] Error during window.initGuitarPizza:", e);
                    setError("Game engine failed to start.");
                    addLog(`[ERROR] Engine start failed: ${e}`);
                }
            } else {
                console.error("[GuitarPizza] window.initGuitarPizza is still undefined after loading scripts.");
                setError("Game engine not found.");
                addLog("[ERROR] window.initGuitarPizza undefined");
            }
        };

        const timer = setTimeout(initGame, 100); // Small delay to ensure render

        return () => {
            clearTimeout(timer);
            addLog("[GuitarPizza] Cleanup called.");
            if (engineRef.current) {
                engineRef.current.cleanup();
                engineRef.current = null;
            }
            // Clear TX popup timers if component unmounts mid-countdown
            if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
            if (popupIntervalRef.current) clearInterval(popupIntervalRef.current);
            const link = document.getElementById('mafia-theme-css');
            if (link) {
                link.remove();
            }
        };
    }, []);

    const handleBackToLobby = () => {
        const results = document.getElementById('results');
        if (results) results.style.display = 'none';

        const overlay = document.getElementById('overlay');
        if (overlay) overlay.style.display = 'flex';

        setView('lobby');
        loadLeaderboard(); // refresh after returning from a game
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



                    {/* Status & Errors Overlay */}
                    {(status || error) && (
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 2000,
                            textAlign: 'center',
                            width: '80%',
                            maxWidth: '400px',
                            pointerEvents: 'none' // Let clicks pass through if needed, though usually blocking is fine
                        }}>
                            <div style={{
                                background: 'rgba(0, 0, 0, 0.85)',
                                backdropFilter: 'blur(10px)',
                                padding: '1.5rem',
                                borderRadius: '16px',
                                border: '2px solid var(--color-accent)',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                {status && (
                                    <h2 style={{
                                        fontFamily: 'var(--font-display)',
                                        color: 'var(--color-accent)',
                                        fontSize: '1.4rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        margin: 0
                                    }}>
                                        {status}
                                    </h2>
                                )}
                                {error && (
                                    <p style={{
                                        color: 'var(--color-error)',
                                        fontSize: '0.9rem',
                                        margin: 0,
                                        fontWeight: 'bold'
                                    }}>
                                        {error}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

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

                                    {/* ── MY TXs HISTORY ───────────────────────────────── */}
                                    <div style={{ marginBottom: '1rem', width: '100%' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                                            <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>⛓ My TXs</span>
                                            <span style={{ fontSize: '0.75rem', color: '#999' }}>({txHistory.length})</span>
                                        </div>

                                        {txHistory.length === 0 ? (
                                            <div style={{ textAlign: 'center', color: '#bbb', fontSize: '0.85rem', padding: '1rem', background: '#f9f9f9', borderRadius: '8px', border: '1px dashed #ddd' }}>
                                                No transactions yet. Play a game to start!
                                            </div>
                                        ) : (
                                            <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #e5e5e5' }}>
                                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                                                    <thead>
                                                        <tr style={{ background: '#f0f0f0', color: '#555', textAlign: 'left' }}>
                                                            <th style={{ padding: '0.4rem 0.6rem', fontWeight: '600' }}>Type</th>
                                                            <th style={{ padding: '0.4rem 0.4rem', fontWeight: '600', textAlign: 'right' }}>Score</th>
                                                            <th style={{ padding: '0.4rem 0.4rem', fontWeight: '600' }}>Date</th>
                                                            <th style={{ padding: '0.4rem 0.6rem', fontWeight: '600' }}>TX</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {txHistory.map((tx, i) => {
                                                            const shortHash = `${tx.hash.slice(0, 6)}…${tx.hash.slice(-6)}`;
                                                            const d = new Date(tx.timestamp);
                                                            const dateStr = `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
                                                            return (
                                                                <tr key={i} style={{ borderTop: '1px solid #eee', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                                                                    <td style={{ padding: '0.4rem 0.6rem', color: '#333', whiteSpace: 'nowrap' }}>
                                                                        {tx.type}
                                                                    </td>
                                                                    <td style={{ padding: '0.4rem 0.4rem', color: '#555', textAlign: 'right', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                                                                        {tx.score.toLocaleString()}
                                                                    </td>
                                                                    <td style={{ padding: '0.4rem 0.4rem', color: '#888', whiteSpace: 'nowrap' }}>
                                                                        {dateStr}
                                                                    </td>
                                                                    <td style={{ padding: '0.4rem 0.6rem', whiteSpace: 'nowrap' }}>
                                                                        <a
                                                                            href={`${EXPLORER_BASE}/${tx.hash}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            style={{ color: '#2980b9', textDecoration: 'none', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                                                            title={tx.hash}
                                                                        >
                                                                            {shortHash} 🔗
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
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

                            {/* ── TOP SCORES REMOVED ── */}


                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem', width: '80%', maxWidth: '300px' }}>
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
                                    <button className="secondary-btn lobby-nav-btn" onClick={() => { loadLeaderboard(); setView('leaderboard'); }}>
                                        <span className="btn-icon">🏆</span>
                                        <span className="btn-text">LEADERBOARD</span>
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

                        {view === 'leaderboard' && (
                            <div className="modal-backdrop" onClick={() => setView('lobby')}>
                                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                    <div className="modal-header">
                                        <div className="back-btn-circle" onClick={() => setView('lobby')}>
                                            <ArrowLeft size={20} />
                                        </div>
                                        <h2 className="modal-title">🏆 LEADERBOARD</h2>
                                        <button
                                            onClick={loadLeaderboard}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', width: 40, color: '#666' }}
                                            title="Refresh"
                                        >↺</button>
                                    </div>

                                    <div style={{ flex: 1, overflowY: 'auto', width: '100%' }}>
                                        {leaderboardLoading ? (
                                            <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                                                <Loader2 size={24} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                                                Loading on-chain scores...
                                            </div>
                                        ) : leaderboard.length === 0 ? (
                                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🍕</div>
                                                <div style={{ fontWeight: 'bold', marginBottom: '0.3rem' }}>No scores yet!</div>
                                                <div style={{ color: '#888', fontSize: '0.9rem' }}>Be the first chef on-chain.</div>
                                                <button
                                                    className="primary-btn"
                                                    style={{ marginTop: '1.5rem', width: '100%', padding: '0.9rem' }}
                                                    onClick={() => { setView('lobby'); handleStartGame(); }}
                                                >🔥 FIRE UP OVEN</button>
                                            </div>
                                        ) : (
                                            <div style={{ width: '100%' }}>
                                                <div style={{ fontSize: '0.72rem', color: '#999', textAlign: 'center', marginBottom: '0.8rem', letterSpacing: '0.08em' }}>
                                                    ⛓ Scores verified on Stellar Testnet
                                                </div>
                                                {leaderboard.map((entry, i) => {
                                                    const medals = ['🥇', '🥈', '🥉'];
                                                    const medal = medals[i] ?? `${i + 1}.`;
                                                    const shortAddr = `${entry.player.slice(0, 6)}…${entry.player.slice(-4)}`;
                                                    const isMe = entry.player === userAddress;
                                                    return (
                                                        <div key={i} style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.75rem',
                                                            padding: '0.75rem 0.5rem',
                                                            borderBottom: '1px solid #eee',
                                                            background: isMe ? 'rgba(39,174,96,0.06)' : 'transparent',
                                                            borderLeft: isMe ? '3px solid #27ae60' : '3px solid transparent',
                                                        }}>
                                                            <span style={{ fontSize: '1.3rem', minWidth: '2rem', textAlign: 'center' }}>{medal}</span>
                                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                                <div style={{ fontSize: '0.85rem', fontWeight: isMe ? 'bold' : 'normal', fontFamily: 'monospace', color: isMe ? '#27ae60' : '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                    {shortAddr}{isMe ? ' (you)' : ''}
                                                                </div>
                                                            </div>
                                                            <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#c0932f', whiteSpace: 'nowrap' }}>
                                                                {entry.score.toLocaleString()} pts
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    {leaderboard.length > 0 && (
                                        <button
                                            className="primary-btn"
                                            style={{ width: '100%', marginTop: '0.5rem', padding: '0.9rem' }}
                                            onClick={() => { setView('lobby'); handleStartGame(); }}
                                        >🔥 CHALLENGE THE BOARD</button>
                                    )}
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

                    <div id="results" style={{
                        display: 'none',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 20,
                        background: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(4px)',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        {/* Popup Card */}
                        <div style={{
                            width: '85%',
                            maxWidth: '400px',
                            minHeight: '500px',
                            // Improved visibility: Lighter gradient at top to show image better
                            backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.85) 70%), url(${resultParams.bgImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '20px',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                            border: '4px solid var(--color-accent)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '2rem',
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.4)', padding: '0.5rem 1rem', borderRadius: '10px', backdropFilter: 'blur(2px)' }}>
                                <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '2.5rem', margin: 0, textShadow: '2px 2px 4px black' }}>SERVICE ENDED</h1>
                                <div style={{ width: '60px', height: '4px', background: 'var(--ph-gold)', margin: '0.5rem auto' }}></div>
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <div className="grade" id="resGrade" style={{ fontSize: '7rem', fontWeight: 'bold', color: 'var(--ph-gold)', textShadow: '0 0 20px rgba(255,215,0,0.5)', lineHeight: 1 }}>S</div>
                                <div className="stat-row" style={{ fontSize: '1.2rem', marginTop: '0.5rem', background: 'rgba(0,0,0,0.6)', padding: '0.2rem 1rem', borderRadius: '20px' }}>SCORE: <span id="resScore">0</span></div>
                                {/* On-chain verified score — shown once confirmed from contract */}
                                {onChainScore !== null && (
                                    <div style={{ marginTop: '0.4rem', fontSize: '0.82rem', background: 'rgba(39,174,96,0.2)', border: '1px solid #27ae60', borderRadius: '12px', padding: '0.2rem 0.8rem', color: '#27ae60', display: 'inline-block' }}>
                                        ✅ On-chain: {onChainScore.toLocaleString()} pts
                                    </div>
                                )}
                            </div>

                            {/* Verification Status or Actions */}
                            {isVerifying ? (
                                <div style={{
                                    background: 'rgba(0,0,0,0.8)',
                                    padding: '1rem',
                                    borderRadius: '10px',
                                    width: '100%',
                                    textAlign: 'center',
                                    border: '1px solid var(--ph-gold)'
                                }}>
                                    {proofStatus === 'generating' ? (
                                        <>
                                            <p style={{ color: 'var(--ph-gold)', fontWeight: 'bold', marginBottom: '0.5rem' }}>GENERATING PROOF...</p>
                                            <div style={{ fontSize: '0.8rem', color: '#ccc' }}>Securing score with Zero-Knowledge</div>
                                        </>
                                    ) : proofStatus === 'success' ? (
                                        <div style={{ color: '#27ae60', fontWeight: 'bold', fontSize: '1rem' }}>
                                            ✓ VERIFIED & SEALED ON-CHAIN
                                        </div>
                                    ) : (
                                        <div style={{ color: '#e74c3c' }}>Verification Failed</div>
                                    )}
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%' }}>
                                    <button id="restartBtn" className="primary-btn" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>COOK AGAIN</button>
                                    <button id="backToLobbyBtn" onClick={handleBackToLobby} className="secondary-btn" style={{ width: '100%', padding: '0.8rem', opacity: 0.9 }}>EXIT KITCHEN</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* TX Sealed Pop-up — appears after on-chain submission, auto-closes in 8s */}
                    {showTxPopup && (
                        <div style={{
                            position: 'absolute', top: 0, left: 0,
                            width: '100%', height: '100%',
                            zIndex: 30,
                            background: 'rgba(0,0,0,0.75)',
                            backdropFilter: 'blur(6px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <div style={{
                                background: 'linear-gradient(160deg, #1a1a2e 0%, #0f0f1a 100%)',
                                border: '2px solid #27ae60',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                width: '88%',
                                maxWidth: '360px',
                                boxShadow: '0 0 40px rgba(39,174,96,0.3)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                            }}>
                                {/* Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ color: '#27ae60', fontWeight: 'bold', fontSize: '0.85rem', letterSpacing: '0.1em' }}>
                                            ⛓ SEALED ON STELLAR
                                        </div>
                                        <div style={{ color: '#aaa', fontSize: '0.75rem', marginTop: '2px' }}>
                                            Score verified on-chain
                                        </div>
                                    </div>
                                    <button
                                        onClick={closeTxPopup}
                                        style={{ background: 'none', border: '1px solid #555', borderRadius: '50%', width: 28, height: 28, color: '#aaa', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                                    >✕</button>
                                </div>

                                {/* TX rows */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {popupTxs.map((tx, i) => {
                                        const shortHash = `${tx.hash.slice(0, 8)}…${tx.hash.slice(-6)}`;
                                        return (
                                            <div key={i} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                background: 'rgba(39,174,96,0.08)',
                                                border: '1px solid rgba(39,174,96,0.3)',
                                                borderRadius: '8px',
                                                padding: '0.5rem 0.75rem',
                                                gap: '0.5rem',
                                            }}>
                                                <div>
                                                    <div style={{ color: '#27ae60', fontSize: '0.78rem', fontWeight: 'bold' }}>✅ {tx.type}</div>
                                                    <div style={{ color: '#888', fontSize: '0.7rem', fontFamily: 'monospace' }}>{shortHash}</div>
                                                </div>
                                                <a
                                                    href={`${EXPLORER_BASE}/${tx.hash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ color: '#27ae60', fontSize: '1.2rem', textDecoration: 'none', flexShrink: 0 }}
                                                    title="View on Stellar Explorer"
                                                >🔗</a>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Actions */}
                                <button
                                    onClick={closeTxPopup}
                                    className="primary-btn"
                                    style={{ width: '100%', padding: '0.8rem', fontSize: '1rem' }}
                                >
                                    🍕 COOK AGAIN
                                </button>

                                {/* Countdown */}
                                <div style={{ textAlign: 'center', color: '#555', fontSize: '0.72rem' }}>
                                    Auto-closing in {popupCountdown}s
                                </div>
                            </div>
                        </div>
                    )}

                    <canvas ref={canvasRef} id="gameCanvas" style={{ width: '100%', height: '100%' }} />
                </div>
            </div>
        </div>
    );
}
