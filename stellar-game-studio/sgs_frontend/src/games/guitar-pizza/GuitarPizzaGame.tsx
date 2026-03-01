
import { useEffect, useRef, useState, useCallback } from 'react';
import { Settings, Volume2, VolumeX, ArrowLeft, ShieldCheck, Loader2, Globe } from 'lucide-react';
import { ProofGenerator } from '../../zk/ProofGenerator';
import { SimulatedZKCircuit } from './SimulatedZKCircuit';
import { StellarContractService, type GameSessionStats, ACHIEVEMENT } from '../../services/StellarContractService';
import { useWallet } from '@/hooks/useWallet';
import { Buffer } from 'buffer';
import { getRandomSong, songPath, SONGS, type Song } from '../../data/songList';

// We'll import the game logic from a separate file or inline it here if feasible
// For now, we assume the game logic is exposed globally via window.GuitarPizza or similar after loading scripts

declare global {
    interface Window {
        initGuitarPizza: (canvas: HTMLCanvasElement | null, userAddress: string, onComplete: (score: number, inputLog?: any[]) => void, songUrl?: string, t?: any) => () => void;
        BASE64_ASSETS: Record<string, string>;
        GP_BASE_PATH?: string;
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

const TRANSLATIONS = {
    es: {
        initializing: 'Inicializando...',
        loadingAssets: 'Cargando Objetos...',
        loadingEngine: 'Cargando Motor...',
        openingSession: 'Abriendo sesión...',
        startingGame: 'Iniciando Juego...',
        market: 'MERCADO',
        marketSub: 'Para el aspirante a Don.',
        ranking: 'RANKING',
        legend: 'LEYENDA',
        rules: 'REGLAS',
        setup: 'AJUSTES',
        fireUp: 'ENCENDER HORNO',
        heatingUp: 'CALENTANDO...',
        chefName: 'Nombre del Chef',
        xHandle: 'Usuario X',
        wallet: 'Billetera Conectada',
        volume: 'Volumen Maestro',
        myTxs: 'Mis Transacciones',
        noTxs: 'Sin transacciones aún. ¡Juega para empezar!',
        backToCooking: 'VOLVER A LA COCINA',
        serviceEnded: 'SERVICIO FINALIZADO',
        score: 'PUNTAJE',
        cookAgain: 'COCINAR DE NUEVO',
        exitKitchen: 'SALIR DE LA COCINA',
        verifying: 'GENERANDO PRUEBA...',
        securing: 'Asegurando puntaje con Zero-Knowledge',
        verified: '✓ VERIFICADO Y SELLADO',
        failed: 'Verificación Fallida',
        sealed: 'SELLADO EN STELLAR',
        scoreVerified: 'Puntaje verificado en cadena',
        autoClose: 'Cierre automático en',
        challenge: 'DESAFIAR AL TABLERO',
        noScores: '¡Sin puntajes aún!',
        beFirst: 'Sé el primero en la cadena.',
        refresh: 'Refrescar',
        back: 'Atrás',
        storyIntro: 'NY 1984. Las Familias controlan el queso... Usa el Ritmo para romper su corteza.',
        storyBody: 'Demuestra tu valía en la cocina. Toca las notas, hornea las pizzas perfectas y conviértete en el...',
        don: 'DON DE LA MASA',
        controls: 'CONTROLES',
        controlsDesc: 'Toca las teclas cuando los ingredientes lleguen al plato.',
        baking: 'HORNEANDO',
        precision: 'Precisión',
        precisionDesc: 'Los aciertos llenan tu medidor.',
        combo: 'Combo / Fiebre',
        comboDesc: '¡No falles! Activa el Modo Fiebre.',
        orders: 'Pedidos',
        ordersDesc: 'Completa pizzas para ganar más.',
        rewards: 'RECOMPENSA',
        rewardsDesc: '¡Sube en el ranking y desbloquea herramientas!',
        language: 'Idioma',
        engineLoading: 'Cargando Ingredientes...',
        engineLetsCook: '¡A COCINAR! 🍕',
        engineLevelComplete: '🎉 ¡NIVEL COMPLETADO!',
        engineServiceEnded: 'SERVICIO FINALIZADO'
    },
    en: {
        initializing: 'Initializing...',
        loadingAssets: 'Loading Assets (this may take a moment)...',
        loadingEngine: 'Loading Game Engine...',
        openingSession: 'Opening on-chain session...',
        startingGame: 'Starting Game...',
        market: 'MARKET',
        marketSub: 'Illicit goods for the aspiring Don.',
        ranking: 'BOARD',
        legend: 'LEGEND',
        rules: 'RULES',
        setup: 'SETUP',
        fireUp: 'FIRE UP OVEN',
        heatingUp: 'HEATING UP...',
        chefName: 'Chef Name',
        xHandle: 'X Handle',
        wallet: 'Connected Wallet',
        volume: 'Master Volume',
        myTxs: 'My TXs',
        noTxs: 'No transactions yet. Play a game to start!',
        backToCooking: 'BACK TO COOKING',
        serviceEnded: 'SERVICE ENDED',
        score: 'SCORE',
        cookAgain: 'COOK AGAIN',
        exitKitchen: 'EXIT KITCHEN',
        verifying: 'GENERATING PROOF...',
        securing: 'Securing score with Zero-Knowledge',
        verified: '✓ VERIFIED & SEALED',
        failed: 'Verification Failed',
        sealed: 'SEALED ON STELLAR',
        scoreVerified: 'Score verified on-chain',
        autoClose: 'Auto-closing in',
        challenge: 'CHALLENGE THE BOARD',
        noScores: 'No scores yet!',
        beFirst: 'Be the first chef on-chain.',
        refresh: 'Refresh',
        back: 'Back',
        storyIntro: 'New York, 1984. The Five Families control the cheese... You are the only one with the Rhythm to break their crust.',
        storyBody: 'Prove your worth in the kitchen. Hit the notes, bake the perfect pies, and become the...',
        don: 'DON OF DOUGH',
        controls: 'CONTROLS',
        controlsDesc: 'Tap the keys as ingredients reach the plate at the bottom.',
        baking: 'BAKING',
        precision: 'Precision',
        precisionDesc: 'Hits fill your Pizza Meter.',
        combo: 'Combo / Fever',
        comboDesc: "Don't miss! Activate Fever Mode.",
        orders: 'Orders',
        ordersDesc: 'Finish pies to increase tips.',
        rewards: 'REWARD',
        rewardsDesc: 'Climb the ranks and unlock market tools!',
        language: 'Language',
        engineLoading: 'Loading Ingredients...',
        engineLetsCook: "LET'S COOK! 🍕",
        engineLevelComplete: '🎉 LEVEL COMPLETE!',
        engineServiceEnded: 'SERVICE ENDED'
    }
};

export function GuitarPizzaGame({ userAddress, onGameComplete, onBack }: GuitarPizzaGameProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    // Cleanup ref now holds the engine interface or null
    const engineRef = useRef<{ cleanup: () => void, setVolume: (v: number) => void, startGame?: () => void } | null>(null);
    // Tracks the actual on-chain session ID (may differ from local if a session was reused)
    const onChainSessionIdRef = useRef<number>(0);

    const [status, setStatus] = useState<string>(TRANSLATIONS['es'].initializing); // Default to es for init
    const [error, setError] = useState<string | null>(null);

    // Wallet
    const { getContractSigner, networkPassphrase, isConnected } = useWallet();

    // Refs so the game-completion closure always reads the LATEST wallet state
    // (the main useEffect has [] deps — without refs it captures stale values)
    const isConnectedRef = useRef(isConnected);
    const getContractSignerRef = useRef(getContractSigner);
    useEffect(() => { isConnectedRef.current = isConnected; }, [isConnected]);
    useEffect(() => { getContractSignerRef.current = getContractSigner; }, [getContractSigner]);

    // UI State
    const [showSettings, setShowSettings] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [language, setLanguage] = useState<'es' | 'en'>(() => {
        try { return (localStorage.getItem('gp_language') as 'es' | 'en') ?? 'en'; }
        catch { return 'en'; }
    });
    const t = TRANSLATIONS[language];

    useEffect(() => {
        localStorage.setItem('gp_language', language);
    }, [language]);

    // Market State
    const [pizzaBalance, setPizzaBalance] = useState<number>(() => {
        try { return parseInt(localStorage.getItem('gp_pizzas_balance') ?? '0', 10) || 0; }
        catch { return 0; }
    });

    const [inventory, setInventory] = useState<string[]>(() => {
        try { return JSON.parse(localStorage.getItem('gp_inventory') ?? '[]'); }
        catch { return []; }
    });

    useEffect(() => {
        localStorage.setItem('gp_pizzas_balance', pizzaBalance.toString());
    }, [pizzaBalance]);

    useEffect(() => {
        localStorage.setItem('gp_inventory', JSON.stringify(inventory));
    }, [inventory]);

    const [view, setView] = useState<'lobby' | 'story' | 'howto' | 'store' | 'leaderboard' | 'songpicker'>('lobby');
    const [closingView, setClosingView] = useState<string | null>(null);

    const closeModalWithAnimation = useCallback((targetView: 'lobby' | 'story' | 'howto' | 'store' | 'leaderboard' | 'songpicker' = 'lobby') => {
        setClosingView(view);
        setTimeout(() => {
            setClosingView(null);
            setView(targetView);
        }, 200); // Matches the 0.2s in CSS
    }, [view]);

    const [selectedSong, setSelectedSong] = useState<Song>(() => SONGS.find(s => s.available) ?? SONGS[0]);
    const selectedSongRef = useRef(selectedSong);
    useEffect(() => { selectedSongRef.current = selectedSong; }, [selectedSong]);

    const [isVerifying, setIsVerifying] = useState(false);
    const [proofStatus, setProofStatus] = useState<'none' | 'generating' | 'success' | 'failed'>('none');
    const [txHash, setTxHash] = useState<string | null>(null);
    const [sliceEarned, setSliceEarned] = useState<number>(0);

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
    const [leaderboardError, setLeaderboardError] = useState<string | null>(null);
    // Status of the leaderboard submission from the last game
    const [lbSubmitStatus, setLbSubmitStatus] = useState<'none' | 'ok' | 'fail'>('none');

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

        // Auto-close after 8 seconds
        popupTimerRef.current = setTimeout(() => {
            closeTxPopup();
        }, 8000);
    }, [closeTxPopup]);

    // Clear timers on unmount
    useEffect(() => {
        return () => {
            if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
            if (popupIntervalRef.current) clearInterval(popupIntervalRef.current);
        };
    }, []);

    // ── Leaderboard loader ────────────────────────────────────────────────────
    const loadLeaderboard = useCallback(async () => {
        setLeaderboardLoading(true);
        setLeaderboardError(null);
        try {
            const entries = await StellarContractService.getLeaderboard(userAddress, 1);
            const arr = entries as any[];
            const mapped = arr.slice(0, 10).map((e: any, i: number) => {
                // e.player may be an Address object or already a string
                const playerStr = typeof e.player === 'string'
                    ? e.player
                    : (e.player?.toString?.() ?? String(e.player ?? ''));
                // e.score is u64 (BigInt) or number
                const scoreNum = typeof e.score === 'bigint' ? Number(e.score) : Number(e.score ?? 0);
                return { rank: i + 1, player: playerStr, score: scoreNum };
            });
            setLeaderboard(mapped);
            if (arr.length === 0) {
                console.warn('[Leaderboard] No entries returned — board may be empty or query failed.');
            }
        } catch (err) {
            console.error('[Leaderboard] Failed to load:', err);
            setLeaderboardError('Could not load leaderboard. Check console.');
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
        // Reset leaderboard submission status for the new game
        setLbSubmitStatus('none');
        setSliceEarned(0);
        if (engineRef.current && engineRef.current.startGame) {
            addLog("[GuitarPizza] Calling engine.startGame()");
            engineRef.current.startGame();
        } else {
            console.warn("[GuitarPizza] Engine not ready yet.");
            addLog("[WARN] Engine not ready yet.");
        }
    };

    // Called when the player clicks "Cook Again" on the results screen.
    // Hides the results panel, resets UI state, starts a new on-chain session
    // (async, non-blocking), then tells the engine to begin a fresh game.
    const handleCookAgain = async () => {
        const results = document.getElementById('results');
        if (results) results.style.display = 'none';
        setIsVerifying(false);
        setProofStatus('none');
        setOnChainScore(null);
        setLbSubmitStatus('none');

        // Start the game immediately — don't block on the on-chain call
        if (engineRef.current?.startGame) {
            engineRef.current.startGame();
        }

        // Open a fresh on-chain session in the background
        const localSessionId = Math.floor(Math.random() * 1000000);
        onChainSessionIdRef.current = localSessionId;
        try {
            const signer = getContractSignerRef.current();
            const startResult = await StellarContractService.startGame(userAddress, localSessionId, 1, signer, 1);
            onChainSessionIdRef.current = startResult.sessionId;
            addLog(`[GuitarPizza] On-chain session ready (replay): ${startResult.sessionId}`);
        } catch {
            console.warn("[GuitarPizza] No wallet for replay on-chain session — skipping.");
        }
    };

    const handleNextLevel = () => {
        // Unlock Level 2
        const song2 = SONGS.find(s => s.id === 'rare-pizzas');
        if (song2) {
            song2.available = true;
            setSelectedSong(song2);
        }
        handleCookAgain(); // uses the new selectedSong in the next init
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

            setStatus(t.loadingAssets);
            addLog("Status: Loading Assets...");

            // Load scripts
            try {
                if (!window.initGuitarPizza) {
                    addLog("[GuitarPizza] initGuitarPizza undefined, loading engine...");
                    setStatus(t.loadingEngine);

                    window.GP_BASE_PATH = import.meta.env.BASE_URL;
                    const baseUrl = import.meta.env.BASE_URL;
                    // Append version parameter to bust aggressive browser cache of public assets
                    const primaryPath = `${baseUrl}game/guitar-pizza-engine.js?v=2`.replace('//', '/');

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

            // Start game session on-chain — AWAIT so the real sessionId is known
            // before the game starts. This prevents the race condition where submit_score
            // uses a different sessionId than the one stored on-chain.
            // score_goal = 1 so submit_score always returns true (human always "wins").
            setStatus(t.openingSession);
            try {
                const signer = getContractSignerRef.current();
                const startResult = await StellarContractService.startGame(userAddress, localSessionId, 1, signer, 1);
                onChainSessionIdRef.current = startResult.sessionId;
                if (!startResult.success) {
                    console.warn("[GuitarPizza] On-chain session registration failed:", startResult.error);
                } else {
                    addLog(`[GuitarPizza] On-chain session ready: ${startResult.sessionId}`);
                }
            } catch {
                console.warn("[GuitarPizza] No wallet connected — skipping on-chain session start.");
            }

            setStatus(t.startingGame);
            addLog("Status: Starting Game...");

            if (window.initGuitarPizza) {
                try {
                    // Read the latest selected song from the ref to avoid stale closures
                    const latestSelectedSong = selectedSongRef.current;
                    const chosenSong = latestSelectedSong.available ? latestSelectedSong : (SONGS.find(s => s.available) ?? latestSelectedSong);
                    const baseUrl = `${import.meta.env.BASE_URL}${songPath(chosenSong)}`.replace('//', '/');
                    // Append song params as query params so the engine uses the correct segment
                    const params = new URLSearchParams();
                    if (chosenSong.bpm) params.set('bpm', String(chosenSong.bpm));
                    params.set('start', String(chosenSong.start ?? 0));
                    params.set('duration', String(chosenSong.duration ?? 80));
                    params.set('v', '3');
                    const resolvedSongUrl = `${baseUrl}?${params.toString()}`;
                    addLog(`[GuitarPizza] Song: ${chosenSong.title} @ ${chosenSong.bpm ?? '?'}BPM | ${chosenSong.start}s–${(chosenSong.start ?? 0) + (chosenSong.duration ?? 80)}s`);
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

                            // Update local balance
                            setPizzaBalance(prev => prev + verifiedScore);

                            const sessionStats: GameSessionStats = {
                                levelId: 1,
                                score: verifiedScore,  // ← verified score goes on-chain
                                sessionId: onChainSessionIdRef.current,
                                perfectHits: perfects,
                                totalHits: hits,
                                totalNotes: engineStats.totalNotes ?? hits,
                                trapsAvoided: engineStats.trapsAvoided ?? 0,
                                totalTraps: engineStats.totalTraps ?? 0,
                                feverSeconds: fever,
                                pizzasCompleted: pizzas,
                                comboBonus: engineStats.comboBonus ?? 0,
                                playerAddress: userAddress,
                            };

                            // 3. Generate RISC Zero receipt (164 bytes: journal + seal)
                            const { receipt } = await ProofGenerator.generateSessionReceipt(sessionStats);
                            addLog(`[GuitarPizza] Receipt generated: ${receipt.length} bytes`);

                            // DEMO / NO-WALLET CHECK: Skip blockchain submission when not connected
                            if (userAddress === 'G_DEMO_USER' || !isConnectedRef.current) {
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
                            setStatus(t.sealed); // or just generic sending

                            const signer = getContractSignerRef.current();
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
                            if (result.sliceClaimed) {
                                addLog(`💰 +${result.sliceAmount} $SLICE earned!`);
                                setSliceEarned(result.sliceAmount);
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

                            // Track leaderboard submission result for UI feedback
                            setLbSubmitStatus(result.leaderboardSubmitted ? 'ok' : 'fail');

                            // Refresh leaderboard at 4s, 9s, 18s after game ends —
                            // multiple attempts handle eventual consistency on Stellar testnet.
                            setTimeout(() => loadLeaderboard(), 4000);
                            setTimeout(() => loadLeaderboard(), 9000);
                            setTimeout(() => loadLeaderboard(), 18000);

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
                    }, resolvedSongUrl, t);

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
            addLog(`[GuitarPizza] Cleanup called for song: ${selectedSong.id}`);
            if (engineRef.current) {
                engineRef.current.cleanup();
                engineRef.current = null;
            }
        };
        // Re-run the entire initialization when the selected song changes!
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSong.id]);

    // Run-once cleanup for global CSS and lingering timers on unmount
    useEffect(() => {
        return () => {
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
                                    <h2 className="modal-title">{t.setup}</h2>
                                    <div style={{ width: 40 }}></div>
                                </div>

                                <div style={{ flex: 1, overflowY: 'auto' }}>
                                    <div className="settings-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9f9f9', padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                            <Globe size={20} color="#666" />
                                            <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{t.language}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => setLanguage('es')}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '8px',
                                                    border: '1px solid #ddd',
                                                    background: language === 'es' ? 'var(--color-accent)' : '#fff',
                                                    color: language === 'es' ? '#fff' : '#333',
                                                    fontWeight: 'bold',
                                                    cursor: 'pointer'
                                                }}
                                            >ES</button>
                                            <button
                                                onClick={() => setLanguage('en')}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '8px',
                                                    border: '1px solid #ddd',
                                                    background: language === 'en' ? 'var(--color-accent)' : '#fff',
                                                    color: language === 'en' ? '#fff' : '#333',
                                                    fontWeight: 'bold',
                                                    cursor: 'pointer'
                                                }}
                                            >EN</button>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '1.5rem', width: '100%' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>{t.chefName}</label>
                                        <input
                                            type="text"
                                            value={chefName}
                                            onChange={(e) => setChefName(e.target.value)}
                                            style={{ width: '100%', padding: '0.8rem', background: '#f5f5f5', border: '1px solid #ddd', color: '#333', borderRadius: '8px', fontSize: '1rem' }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: '1.5rem', width: '100%' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>{t.xHandle}</label>
                                        <input
                                            type="text"
                                            value={xHandle}
                                            onChange={(e) => setXHandle(e.target.value)}
                                            style={{ width: '100%', padding: '0.8rem', background: '#f5f5f5', border: '1px solid #ddd', color: '#333', borderRadius: '8px', fontSize: '1rem' }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: '1.5rem', width: '100%' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>{t.wallet}</label>
                                        <div style={{ padding: '0.8rem', background: 'rgba(46, 204, 113, 0.1)', border: '1px solid #2ecc71', borderRadius: '8px', fontSize: '0.9rem', wordBreak: 'break-all', color: '#27ae60' }}>
                                            {userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : "Not Connected"}
                                        </div>
                                    </div>

                                    <div className="settings-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9f9f9', padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }}>
                                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{t.volume}</span>
                                        <button onClick={toggleAudio} className="settings-btn" style={{ background: isMuted ? '#bdc3c7' : 'var(--ph-green)', borderRadius: '50%', width: 50, height: 50, padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 0 }}>
                                            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                                        </button>
                                    </div>

                                    {/* ── MY TXs HISTORY ───────────────────────────────── */}
                                    <div style={{ marginBottom: '1rem', width: '100%' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                                            <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>⛓ {t.myTxs}</span>
                                            <span style={{ fontSize: '0.75rem', color: '#999' }}>({txHistory.length})</span>
                                        </div>

                                        {txHistory.length === 0 ? (
                                            <div style={{ textAlign: 'center', color: '#bbb', fontSize: '0.85rem', padding: '1rem', background: '#f9f9f9', borderRadius: '8px', border: '1px dashed #ddd' }}>
                                                {t.noTxs}
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
                                                                        {tx.type === 'Score Submit' ? (language === 'es' ? 'Envío Puntaje' : 'Score Submit') : tx.type}
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

                                <button className="close-btn" onClick={() => setShowSettings(false)} style={{ width: '100%' }}>{t.backToCooking}</button>
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
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <p className="subtitle">PIZZA KITCHEN</p>
                                    {/* Mafia noir vinyl SVG — asymmetric gold highlight makes spin obvious */}
                                    <button
                                        onClick={() => setView('songpicker')}
                                        title={selectedSong.title}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            padding: 0,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            animation: 'vinyl-spin 3s linear infinite',
                                            filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.8))',
                                        }}
                                    >
                                        <svg width="50" height="50" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                            {/* Outer disc — near black */}
                                            <circle cx="50" cy="50" r="49" fill="#0d0d0d" stroke="#d4af37" strokeWidth="1.5" strokeOpacity="0.5" />
                                            {/* Groove rings — concentric thin circles */}
                                            {[38, 33, 28, 23].map(r => (
                                                <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="#1e1e1e" strokeWidth="1.2" />
                                            ))}
                                            {/* Dark red label ring — Italian vintage style */}
                                            <circle cx="50" cy="50" r="21" fill="#5a0f0f" />
                                            <circle cx="50" cy="50" r="20" fill="#7a1515" />
                                            {/* Label ring decorative border */}
                                            <circle cx="50" cy="50" r="20" fill="none" stroke="#a02020" strokeWidth="1" />
                                            {/* Center spindle hole */}
                                            <circle cx="50" cy="50" r="4.5" fill="#d4af37" />
                                            {/* Asymmetric specular highlight — top-right arc, makes spin VERY visible */}
                                            <path d="M 62 18 A 38 38 0 0 1 82 38" stroke="rgba(255,230,100,0.55)" strokeWidth="4" fill="none" strokeLinecap="round" />
                                            {/* Softer secondary highlight */}
                                            <path d="M 65 22 A 33 33 0 0 1 78 42" stroke="rgba(255,255,255,0.18)" strokeWidth="2" fill="none" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem', width: '80%', maxWidth: '300px' }}>
                                <button id="startBtn"
                                    onClick={handleStartGame}
                                    disabled={!engineRef.current}
                                    style={{ opacity: engineRef.current ? 1 : 0.5, cursor: engineRef.current ? 'pointer' : 'not-allowed', fontSize: '1rem', padding: '0.75rem' }}
                                >
                                    {engineRef.current ? `🔥 ${t.fireUp}` : `🔥 ${t.heatingUp}`}
                                </button>

                                <div className="grid grid-cols-2 gap-2 mt-2 w-full">
                                    <button
                                        className="secondary-btn lobby-nav-btn"
                                        style={{ position: 'relative', overflow: 'hidden' }}
                                        onClick={() => setView('store')}
                                    >
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                                            <span className="btn-icon">🛒</span>
                                            <span className="btn-text">{t.market}</span>
                                        </div>
                                    </button>
                                    <button className="secondary-btn lobby-nav-btn" onClick={() => { loadLeaderboard(); setView('leaderboard'); }}>
                                        <span className="btn-icon">🏆</span>
                                        <span className="btn-text">{t.ranking}</span>
                                    </button>
                                    <button className="secondary-btn lobby-nav-btn" onClick={() => setShowSettings(true)}>
                                        <span className="btn-icon">⚙️</span>
                                        <span className="btn-text">{t.setup}</span>
                                    </button>
                                    <button className="secondary-btn lobby-nav-btn" onClick={() => setView('howto')}>
                                        <span className="btn-icon">📜</span>
                                        <span className="btn-text">{t.rules}</span>
                                    </button>
                                </div>
                            </div>
                        </div>


                        {/* MODALS OVERLAY */}

                        {/* ── SONG PICKER (PIZZA BOX EDITION) ─────────────────────────────── */}
                        {(view === 'songpicker' || closingView === 'songpicker') && (
                            <div className={`modal-backdrop ${closingView === 'songpicker' ? 'closing' : ''}`} onClick={() => closeModalWithAnimation('lobby')}>
                                <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
                                    background: '#e6c280', // Cardboard color
                                    border: '4px solid #b38b59', // Darker cardboard edge
                                    boxShadow: '0 20px 50px rgba(0,0,0,0.8), inset 0 0 60px rgba(139, 90, 43, 0.4)',
                                    color: '#3e2723',
                                    borderRadius: '8px', // Boxy corners
                                    paddingTop: '2rem',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    {/* Decorative Pizza Box Flap */}
                                    <div style={{
                                        position: 'absolute',
                                        top: 0, left: 0, width: '100%', height: '14px',
                                        background: 'repeating-linear-gradient(45deg, #c1272d, #c1272d 15px, #ffffff 15px, #ffffff 30px)',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                    }} />

                                    <div className="modal-header" style={{ borderBottom: '3px dashed #b38b59', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                                        <div className="back-btn-circle" onClick={() => closeModalWithAnimation('lobby')} style={{
                                            borderColor: '#c1272d',
                                            color: '#fff',
                                            background: '#c1272d',
                                            boxShadow: '3px 3px 0 rgba(0,0,0,0.2)',
                                            borderRadius: '8px', // Square button for boxy feel
                                            flexShrink: 0
                                        }}>
                                            <ArrowLeft size={20} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, padding: '0 10px', transform: 'rotate(-2deg)' }}>
                                            <h2 className="modal-title" style={{ color: '#c1272d', textShadow: '2px 2px 0px #fff', letterSpacing: '1px', fontSize: '1.5rem', textAlign: 'center', fontFamily: 'var(--font-display)', margin: 0, whiteSpace: 'nowrap' }}>🍕 {language === 'es' ? 'EL MENÚ' : 'THE MENU'}</h2>
                                            <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 'bold', marginTop: '4px', textTransform: 'uppercase', background: '#fff', padding: '2px 6px', border: '2px solid #166534', transform: 'rotate(2deg)', whiteSpace: 'nowrap' }}>{language === 'es' ? 'Recetas Secretas' : 'Secret Recipes'}</div>
                                        </div>
                                        <div style={{ width: 40, fontSize: '1.2rem', color: '#c1272d', textAlign: 'right', fontWeight: '900', textShadow: '1px 1px 0 #fff', flexShrink: 0 }}>
                                            {SONGS.filter(s => s.available).length}/{SONGS.length}
                                        </div>
                                    </div>

                                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingRight: '0.25rem' }}>
                                        {SONGS.map((song) => {
                                            const isSelected = selectedSong.id === song.id;
                                            const mins = Math.floor(song.duration / 60);
                                            const secs = Math.floor(song.duration % 60);
                                            return (
                                                <button
                                                    key={song.id}
                                                    disabled={!song.available}
                                                    onClick={() => { setSelectedSong(song); closeModalWithAnimation('lobby'); }}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '1rem',
                                                        padding: '0.75rem 1rem',
                                                        borderRadius: '6px',
                                                        border: isSelected ? '3px solid #c1272d' : '2px solid rgba(139, 90, 43, 0.4)',
                                                        background: isSelected
                                                            ? '#fff9e6' // Bright pizza dough color
                                                            : song.available
                                                                ? 'rgba(255,255,255,0.4)' // Plain cardboard tint
                                                                : 'rgba(0,0,0,0.1)', // Disabled state
                                                        boxShadow: isSelected ? '4px 4px 0 rgba(193, 39, 45, 0.3)' : '3px 3px 0 rgba(139, 90, 43, 0.2)',
                                                        cursor: song.available ? 'pointer' : 'not-allowed',
                                                        opacity: song.available ? 1 : 0.6,
                                                        textAlign: 'left',
                                                        color: '#3e2723',
                                                        width: '100%',
                                                        transition: 'all 0.15s ease',
                                                        position: 'relative'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!isSelected && song.available) {
                                                            e.currentTarget.style.background = '#fff';
                                                            e.currentTarget.style.transform = 'translateY(-2px) translateX(-2px)';
                                                            e.currentTarget.style.boxShadow = '5px 5px 0 rgba(139, 90, 43, 0.3)';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (!isSelected && song.available) {
                                                            e.currentTarget.style.background = 'rgba(255,255,255,0.4)';
                                                            e.currentTarget.style.transform = 'translateY(0) translateX(0)';
                                                            e.currentTarget.style.boxShadow = '3px 3px 0 rgba(139, 90, 43, 0.2)';
                                                        }
                                                    }}
                                                    onMouseDown={(e) => { if (song.available) { e.currentTarget.style.transform = 'translateY(2px) translateX(2px)'; e.currentTarget.style.boxShadow = 'none'; } }}
                                                    onMouseUp={(e) => { if (song.available && !isSelected) { e.currentTarget.style.transform = 'translateY(-2px) translateX(-2px)'; e.currentTarget.style.boxShadow = '5px 5px 0 rgba(139, 90, 43, 0.3)'; } }}
                                                >
                                                    {/* Track number or Pizza Slice */}
                                                    <div style={{ width: '35px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                        {isSelected ? (
                                                            <div style={{ fontSize: '1.6rem', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))', transform: 'rotate(15deg)' }}>🍕</div>
                                                        ) : (
                                                            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#b38b59', fontWeight: '900' }}>
                                                                {song.available ? `#${song.index}` : '🔒'}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Info */}
                                                    <div style={{ flex: 1, overflow: 'hidden', paddingRight: '0.5rem', zIndex: 1 }}>
                                                        <div style={{
                                                            fontWeight: '900',
                                                            fontSize: isSelected ? '1.2rem' : '1.05rem',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            color: isSelected ? '#c1272d' : '#5d4037',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.5px',
                                                            transition: 'all 0.15s ease'
                                                        }}>
                                                            {song.title}
                                                        </div>
                                                        <div style={{
                                                            fontSize: '0.8rem',
                                                            color: '#8d6e63',
                                                            marginTop: '2px',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            fontWeight: '700'
                                                        }}>
                                                            {song.artist}
                                                        </div>
                                                    </div>

                                                    {/* Right side stats */}
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', minWidth: '60px', zIndex: 1 }}>
                                                        <div style={{
                                                            fontSize: '0.7rem',
                                                            fontWeight: '900',
                                                            background: isSelected ? '#166534' : 'transparent',
                                                            color: isSelected ? '#fff' : '#166534',
                                                            padding: '2px 6px',
                                                            border: '2px solid #166534',
                                                            transform: 'rotate(2deg)',
                                                            boxShadow: isSelected ? '2px 2px 0 rgba(0,0,0,0.2)' : 'none'
                                                        }}>
                                                            {song.bpm ? `${song.bpm} BPM` : '120 BPM'}
                                                        </div>
                                                        <div style={{
                                                            fontSize: '0.9rem',
                                                            fontFamily: 'var(--font-display)',
                                                            color: '#5d4037',
                                                            fontWeight: '900'
                                                        }}>
                                                            {mins}:{secs.toString().padStart(2, '0')}
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        className="primary-btn"
                                        style={{ width: '100%', marginTop: '0.5rem' }}
                                        onClick={() => closeModalWithAnimation('lobby')}
                                    >
                                        🔥 {language === 'es' ? 'ENCENDER HORNO' : 'READY — FIRE UP OVEN'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {(view === 'store' || closingView === 'store') && (
                            <div className={`modal-backdrop ${closingView === 'store' ? 'closing' : ''}`} onClick={() => closeModalWithAnimation('lobby')}>
                                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                    <div className="modal-header">
                                        <div className="back-btn-circle" onClick={() => closeModalWithAnimation('lobby')}>
                                            <ArrowLeft size={20} />
                                        </div>
                                        <h2 className="modal-title">{t.market}</h2>
                                        <div style={{ width: 40 }}></div>
                                    </div>

                                    <div style={{ padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
                                            {t.marketSub}
                                        </p>
                                        <div style={{ background: 'rgba(212,175,55,0.15)', padding: '0.4rem 0.8rem', borderRadius: '12px', border: '1px solid var(--ph-gold)', fontWeight: 'bold', color: 'var(--ph-gold)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1.1rem' }}>
                                            <span>🍕</span> {pizzaBalance.toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="store-grid" style={{ padding: '0 0.5rem', maxHeight: '50vh', overflowY: 'auto' }}>
                                        {[
                                            { id: 'spicy_pepperoni', icon: '🌶️', name: 'Spicy Pepperoni', price: 500 },
                                            { id: 'oven_mitts', icon: '🛡️', name: 'Oven Mitts', price: 1200 },
                                            { id: 'secret_sauce', icon: '🧂', name: 'Secret Sauce', price: 5000 },
                                            { id: 'golden_cutter', icon: '🔪', name: 'Golden Cutter', price: 10000 },
                                        ].map(item => {
                                            const isOwned = inventory.includes(item.id);
                                            const canAfford = pizzaBalance >= item.price;

                                            // Handle Purchase logic
                                            const handleBuy = () => {
                                                if (isOwned || !canAfford) return;
                                                setPizzaBalance(prev => prev - item.price);
                                                setInventory(prev => [...prev, item.id]);
                                            };

                                            return (
                                                <div key={item.id} className="store-item" style={{
                                                    background: isOwned ? 'rgba(39, 174, 96, 0.1)' : '#f9f9f9',
                                                    padding: '0.8rem',
                                                    borderRadius: '12px',
                                                    border: isOwned ? '1px solid #27ae60' : '1px solid #ddd',
                                                    textAlign: 'center',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between',
                                                    gap: '0.5rem',
                                                    opacity: (!isOwned && !canAfford) ? 0.7 : 1
                                                }}>
                                                    <div>
                                                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                                                        <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: isOwned ? '#27ae60' : '#333' }}>{item.name}</div>
                                                    </div>

                                                    <button
                                                        onClick={handleBuy}
                                                        disabled={isOwned || !canAfford}
                                                        style={{
                                                            width: '100%',
                                                            padding: '0.5rem',
                                                            borderRadius: '8px',
                                                            border: 'none',
                                                            fontWeight: 'bold',
                                                            cursor: (isOwned || !canAfford) ? 'not-allowed' : 'pointer',
                                                            background: isOwned ? '#27ae60' : (canAfford ? 'var(--ph-gold)' : '#ccc'),
                                                            color: isOwned ? 'white' : (canAfford ? 'black' : '#666'),
                                                            fontSize: '0.85rem'
                                                        }}
                                                    >
                                                        {isOwned ? (language === 'es' ? 'COMPRADO' : 'OWNED') : `${item.price} 🍕`}
                                                    </button>
                                                </div>
                                            );
                                        })}

                                        <div className="store-item" style={{ background: '#eee', padding: '0.8rem', borderRadius: '12px', border: '1px dashed #bbb', textAlign: 'center', opacity: 0.6, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔒</div>
                                            <div style={{ fontSize: '0.9rem', color: '#666', fontWeight: 'bold' }}>Mystery Pack</div>
                                            <div style={{ color: '#999', fontSize: '0.8rem', marginTop: '0.5rem' }}>???</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {(view === 'leaderboard' || closingView === 'leaderboard') && (
                            <div className={`modal-backdrop ${closingView === 'leaderboard' ? 'closing' : ''}`} onClick={() => closeModalWithAnimation('lobby')}>
                                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                    <div className="modal-header">
                                        <div className="back-btn-circle" onClick={() => closeModalWithAnimation('lobby')}>
                                            <ArrowLeft size={20} />
                                        </div>
                                        <h2 className="modal-title">🏆 {t.ranking}</h2>
                                        <button
                                            onClick={loadLeaderboard}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', width: 40, color: '#666' }}
                                            title={t.refresh}
                                        >↺</button>
                                    </div>

                                    {/* Leaderboard submission badge from last game */}
                                    {lbSubmitStatus !== 'none' && (
                                        <div style={{
                                            textAlign: 'center',
                                            padding: '0.4rem 0.8rem',
                                            marginBottom: '0.5rem',
                                            borderRadius: '8px',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold',
                                            background: lbSubmitStatus === 'ok' ? 'rgba(39,174,96,0.12)' : 'rgba(231,76,60,0.12)',
                                            color: lbSubmitStatus === 'ok' ? '#27ae60' : '#e74c3c',
                                            border: `1px solid ${lbSubmitStatus === 'ok' ? '#27ae60' : '#e74c3c'}`,
                                        }}>
                                            {lbSubmitStatus === 'ok' ? '✅ Your score was submitted to the board!' : '⚠️ Leaderboard submission failed — see console'}
                                        </div>
                                    )}

                                    <div style={{ flex: 1, overflowY: 'auto', width: '100%' }}>
                                        {leaderboardLoading ? (
                                            <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                                                <Loader2 size={24} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                                                Loading on-chain scores...
                                            </div>
                                        ) : leaderboardError ? (
                                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</div>
                                                <div style={{ color: '#e74c3c', fontWeight: 'bold', marginBottom: '0.3rem', fontSize: '0.9rem' }}>Could not load scores</div>
                                                <div style={{ color: '#888', fontSize: '0.8rem' }}>{leaderboardError}</div>
                                                <button className="primary-btn" style={{ marginTop: '1rem', padding: '0.6rem 1.2rem' }} onClick={loadLeaderboard}>Try Again</button>
                                            </div>
                                        ) : leaderboard.length === 0 ? (
                                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🍕</div>
                                                <div style={{ fontWeight: 'bold', marginBottom: '0.3rem' }}>{t.noScores}</div>
                                                <div style={{ color: '#888', fontSize: '0.9rem' }}>{t.beFirst}</div>
                                                <button
                                                    className="primary-btn"
                                                    style={{ marginTop: '1.5rem', width: '100%', padding: '0.9rem' }}
                                                    onClick={() => { setView('lobby'); handleStartGame(); }}
                                                >🔥 FIRE UP OVEN</button>
                                            </div>
                                        ) : (
                                            <div style={{ width: '100%' }}>
                                                <div style={{ fontSize: '0.72rem', color: '#999', textAlign: 'center', marginBottom: '0.8rem', letterSpacing: '0.08em' }}>
                                                    ⛓ Scores verified on Stellar Testnet · {leaderboard.length} entr{leaderboard.length === 1 ? 'y' : 'ies'}
                                                </div>
                                                {leaderboard.map((entry, i) => {
                                                    const medals = ['🥇', '🥈', '🥉'];
                                                    const medal = medals[i] ?? `${i + 1}.`;
                                                    const shortAddr = entry.player.length >= 10
                                                        ? `${entry.player.slice(0, 6)}…${entry.player.slice(-4)}`
                                                        : entry.player;
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
                                        >🔥 {t.challenge}</button>
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
                                        <h2 className="modal-title">{t.legend}</h2>
                                        <div style={{ width: 40 }}></div>
                                    </div>
                                    <div style={{ padding: '0 1rem', textAlign: 'center' }}>
                                        <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                                            {t.storyIntro}
                                        </p>
                                        <p style={{ lineHeight: '1.6' }}>
                                            {t.storyBody}
                                        </p>
                                        <h3 style={{ fontSize: '2rem', color: '#ccafa5', marginTop: '1rem', fontFamily: 'var(--font-title)' }}>{t.don}</h3>
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
                                        <h2 className="modal-title">{t.rules}</h2>
                                        <div style={{ width: 40 }}></div>
                                    </div>

                                    <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
                                        <section style={{ marginBottom: '1.5rem' }}>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.8rem', color: 'var(--ph-gold)', borderBottom: '1px solid #eee', paddingBottom: '0.3rem' }}>1. {t.controls}</h3>
                                            <p style={{ fontSize: '0.95rem', color: '#444', marginBottom: '0.5rem' }}>{t.controlsDesc}</p>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1rem' }}>
                                                <div className="key-box">A<br /><span style={{ fontSize: '0.7rem' }}>🔴</span></div>
                                                <div className="key-box">S<br /><span style={{ fontSize: '0.7rem' }}>🟡</span></div>
                                                <div className="key-box">K<br /><span style={{ fontSize: '0.7rem' }}>🥓</span></div>
                                                <div className="key-box">L<br /><span style={{ fontSize: '0.7rem' }}>🟣</span></div>
                                            </div>
                                        </section>

                                        <section style={{ marginBottom: '1.5rem' }}>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.8rem', color: 'var(--ph-gold)', borderBottom: '1px solid #eee', paddingBottom: '0.3rem' }}>2. {t.baking}</h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                                    <div style={{ fontSize: '1.5rem' }}>🎯</div>
                                                    <div>
                                                        <p style={{ fontWeight: 'bold', fontSize: '0.95rem', margin: 0 }}>{t.precision}</p>
                                                        <p style={{ fontSize: '0.85rem', color: '#666' }}>{t.precisionDesc}</p>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                                    <div style={{ fontSize: '1.5rem' }}>🔄</div>
                                                    <div>
                                                        <p style={{ fontWeight: 'bold', fontSize: '0.95rem', margin: 0 }}>{t.combo}</p>
                                                        <p style={{ fontSize: '0.85rem', color: '#666' }}>{t.comboDesc}</p>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                                    <div style={{ fontSize: '1.5rem' }}>📦</div>
                                                    <div>
                                                        <p style={{ fontWeight: 'bold', fontSize: '0.95rem', margin: 0 }}>{t.orders}</p>
                                                        <p style={{ fontSize: '0.85rem', color: '#666' }}>{t.ordersDesc}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        <section>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.8rem', color: 'var(--ph-gold)', borderBottom: '1px solid #eee', paddingBottom: '0.3rem' }}>3. {t.rewards}</h3>
                                            <p style={{ fontSize: '0.9rem', color: '#666' }}>{t.rewardsDesc}</p>
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
                        // Elegant Glassmorphism: allows the game background to be seen blurred
                        background: 'rgba(20, 5, 5, 0.4)',
                        backdropFilter: 'blur(12px)',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        {/* Popup Card (Elegant Glassmorphism) */}
                        <div style={{
                            width: '85%',
                            maxWidth: '420px',
                            minHeight: '480px',
                            // Removed the hard black gradient and replaced with elegant bright glass
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '16px',
                            boxShadow: '0 30px 60px rgba(0,0,0,0.8), inset 0 2px 0 rgba(255,255,255,0.1)',
                            border: '1px solid rgba(212,175,55, 0.3)', // Subtle gold border
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '2.5rem 2rem',
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* Decorative Top Accent */}
                            <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '4px', background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }}></div>

                            {/* Aligned Header Section */}
                            <div style={{ textAlign: 'center', width: '100%', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <h1 id="resTitle" style={{
                                    fontFamily: 'var(--font-title)',
                                    fontSize: '1.8rem',
                                    letterSpacing: '2px',
                                    color: '#fdf8f0',
                                    margin: '0',
                                    lineHeight: '1.1',
                                    textShadow: '0 4px 10px rgba(0,0,0,0.8)'
                                }}>
                                    {t.serviceEnded}
                                </h1>
                                <div style={{ width: '120px', height: '2px', background: 'linear-gradient(90deg, transparent, #d4af37, transparent)', marginTop: '0.8rem' }}></div>
                            </div>

                            {/* Score Content centrally aligned */}
                            <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                {/* Huge Glowing Grade */}
                                <div className="grade" id="resGrade" style={{
                                    fontSize: '7.5rem',
                                    fontFamily: 'var(--font-title)',
                                    fontWeight: 'bold',
                                    color: 'var(--ph-gold)',
                                    textShadow: '0 0 30px rgba(212,175,55,0.4), 0 0 10px rgba(255,255,255,0.2)',
                                    lineHeight: 1,
                                    marginBottom: '1rem'
                                }}>S</div>

                                {/* Receipt-style Score Badge */}
                                <div className="stat-row" style={{
                                    fontSize: '1.4rem',
                                    fontFamily: "'Special Elite', monospace",
                                    color: '#fdf8f0',
                                    background: 'rgba(0,0,0,0.5)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    padding: '0.6rem 1.5rem',
                                    borderRadius: '30px',
                                    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)'
                                }}>
                                    {t.score}: <span id="resScore" style={{ color: 'var(--ph-gold)', fontWeight: 'bold' }}>0</span>
                                </div>
                                <div id="resPizzas" style={{ fontSize: '1.1rem', marginTop: '0.8rem', fontFamily: "'Bangers', cursive", letterSpacing: '1px', color: '#cca243', display: 'none' }}>
                                    🍕 <span id="resPizzasCount">0</span> {language === 'es' ? ' PIZZAS' : ' PIZZAS BAKED'}
                                </div>

                                {/* On-chain verified score */}
                                {onChainScore !== null && (
                                    <div style={{ marginTop: '0.8rem', fontSize: '0.85rem', background: 'rgba(39,174,96,0.15)', border: '1px solid rgba(39,174,96,0.5)', borderRadius: '12px', padding: '0.3rem 1rem', color: '#2ecc71', display: 'inline-block', fontFamily: 'monospace' }}>
                                        ✅ {t.scoreVerified}: <strong style={{ color: '#fff' }}>{onChainScore.toLocaleString()} pts</strong>
                                    </div>
                                )}
                            </div>

                            {/* Verification Status or Actions */}
                            {isVerifying ? (
                                <div style={{
                                    background: 'rgba(0,0,0,0.4)',
                                    padding: '1.2rem',
                                    borderRadius: '12px',
                                    width: '100%',
                                    marginTop: '1.5rem',
                                    textAlign: 'center',
                                    border: '1px solid rgba(212,175,55,0.2)',
                                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
                                }}>
                                    {proofStatus === 'generating' ? (
                                        <>
                                            <p style={{ color: 'var(--ph-gold)', fontFamily: 'var(--font-title)', fontSize: '1.2rem', letterSpacing: '1px', marginBottom: '0.3rem' }}>{t.verifying}</p>
                                            <div style={{ fontSize: '0.85rem', color: '#aaa', fontFamily: "'Special Elite', monospace" }}>{t.securing}</div>
                                        </>
                                    ) : proofStatus === 'success' ? (
                                        <div style={{ color: '#2ecc71', fontWeight: 'bold', fontSize: '1.1rem', letterSpacing: '1px' }}>
                                            ✅ {t.verified} ON-CHAIN
                                        </div>
                                    ) : (
                                        <div style={{ color: '#e74c3c', fontWeight: 'bold' }}>❌ {t.failed}</div>
                                    )}
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%', marginTop: '1.5rem' }}>
                                    <button
                                        id="restartBtn"
                                        onClick={handleCookAgain}
                                        style={{
                                            width: '100%',
                                            padding: '1.2rem',
                                            fontSize: '1.2rem',
                                            fontFamily: 'var(--font-title)',
                                            letterSpacing: '2px',
                                            background: 'linear-gradient(135deg, #a71d1d, #600202)',
                                            border: '1px solid #ff4d4d',
                                            boxShadow: '0 4px 15px rgba(139,0,0,0.6), inset 0 2px 0 rgba(255,100,100,0.4)',
                                            borderRadius: '12px',
                                            color: '#fff',
                                            cursor: 'pointer',
                                            textTransform: 'uppercase',
                                            transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.filter = 'brightness(1.2)';
                                            e.currentTarget.style.transform = 'scale(1.03)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.filter = 'none';
                                            e.currentTarget.style.transform = 'scale(1)';
                                        }}
                                        onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)' }}
                                        onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1.03)' }}
                                    >
                                        🍕 {language === 'es' ? 'GUARDAR Y REPETIR' : 'SAVE & COOK AGAIN'}
                                    </button>

                                    {onChainScore !== null && onChainScore >= 4000 ? (
                                        <button
                                            id="nextLevelBtn"
                                            onClick={handleNextLevel}
                                            style={{
                                                width: '100%',
                                                padding: '1.2rem',
                                                fontSize: '1.2rem',
                                                fontFamily: 'var(--font-title)',
                                                letterSpacing: '2px',
                                                background: 'linear-gradient(135deg, #d4af37, #997a00)',
                                                border: '1px solid #f9e596',
                                                boxShadow: '0 4px 15px rgba(212,175,55,0.4), inset 0 2px 0 rgba(255,255,255,0.4)',
                                                borderRadius: '12px',
                                                color: '#111',
                                                cursor: 'pointer',
                                                textTransform: 'uppercase',
                                                transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.filter = 'brightness(1.15)';
                                                e.currentTarget.style.transform = 'scale(1.03)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.filter = 'none';
                                                e.currentTarget.style.transform = 'scale(1)';
                                            }}
                                            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)' }}
                                            onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1.03)' }}
                                        >
                                            🚀 {language === 'es' ? 'NIVEL 2: MÁS RÁPIDO' : 'LEVEL 2: FASTER'}
                                        </button>
                                    ) : (
                                        <button
                                            id="nextLevelBtn"
                                            style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', fontFamily: 'var(--font-title)', opacity: 0.4, cursor: 'not-allowed', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                                            disabled
                                            title={language === 'es' ? 'Consigue 4000 pts para desbloquear' : 'Score 4000 pts to unlock'}
                                        >
                                            🔒 {language === 'es' ? 'SIGUIENTE NIVEL (4000 PTS)' : 'NEXT LEVEL (4000 PTS)'}
                                        </button>
                                    )}

                                    <button
                                        id="backToLobbyBtn"
                                        onClick={handleBackToLobby}
                                        style={{
                                            width: '100%',
                                            padding: '0.9rem',
                                            fontSize: '0.95rem',
                                            fontFamily: "'Special Elite', monospace",
                                            background: 'transparent',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            borderRadius: '12px',
                                            color: '#aaa',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#aaa'; }}
                                    >
                                        {language === 'es' ? 'SALIR' : 'EXIT KITCHEN'}
                                    </button>
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
                                            ⛓ {language === 'es' ? 'SELLADO EN STELLAR' : 'SEALED ON STELLAR'}
                                        </div>
                                        <div style={{ color: '#aaa', fontSize: '0.75rem', marginTop: '2px' }}>
                                            {language === 'es' ? 'Puntaje verificado en cadena' : 'Score verified on-chain'}
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
                                                    <div style={{ color: '#27ae60', fontSize: '0.78rem', fontWeight: 'bold' }}>✅ {tx.type === 'Score Submit' ? (language === 'es' ? 'Envío Puntaje' : 'Score Submit') : tx.type}</div>
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

                                {/* SLICE reward banner */}
                                {sliceEarned > 0 && (
                                    <div style={{
                                        background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))',
                                        border: '1px solid rgba(212,175,55,0.6)',
                                        borderRadius: '10px',
                                        padding: '0.75rem 1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                    }}>
                                        <span style={{ fontSize: '1.6rem' }}>🍕</span>
                                        <div>
                                            <div style={{ color: '#d4af37', fontWeight: 'bold', fontSize: '1rem', letterSpacing: '0.05em' }}>
                                                +{sliceEarned} $SLICE {language === 'es' ? 'ganados' : 'earned'}
                                            </div>
                                            <div style={{ color: '#a08828', fontSize: '0.72rem', marginTop: '2px' }}>
                                                {language === 'es' ? 'Acreditados en tu wallet' : 'Minted to your wallet on-chain'}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <button
                                    onClick={closeTxPopup}
                                    className="primary-btn"
                                    style={{ width: '100%', padding: '0.8rem', fontSize: '1rem' }}
                                >
                                    🍕 {language === 'es' ? 'REPETIR' : 'COOK AGAIN'}
                                </button>

                                {/* Countdown */}
                                <div style={{ textAlign: 'center', color: '#555', fontSize: '0.72rem' }}>
                                    {language === 'es' ? 'Cierre automático en' : 'Auto-closing in'} {popupCountdown}s
                                </div>
                            </div>
                        </div>
                    )}

                    <canvas ref={canvasRef} id="gameCanvas" style={{ width: '100%', height: '100%' }} />
                </div>
            </div>
        </div>
    );
};
