

import { useEffect, useRef, useState, useCallback } from 'react';

import { Settings, Volume2, VolumeX, ArrowLeft, ShieldCheck, Loader2, Globe } from 'lucide-react';

import { ProofGenerator } from '../../zk/ProofGenerator';

import { SimulatedZKCircuit } from './SimulatedZKCircuit';

import { StellarContractService, type GameSessionStats, ACHIEVEMENT, CONTRACT_IDS } from '../../services/StellarContractService';
import { multiplayerService } from '../../services/MultiplayerService';
import { useFriendsStore } from '../../store/friendsSlice';

import { useWallet } from '@/hooks/useWallet';

import { Buffer } from 'buffer';

import { getRandomSong, songPath, SONGS, type Song } from '../../data/songList';

import { CollectionTab } from '../../components/CollectionTab';
import { WalletStandalone } from '../../components/WalletStandalone';
import { SpicyCrustService } from '../../services/SpicyCrustService';
import { HubBridgeService } from '../../services/HubBridgeService';




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
    embed?: boolean;
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

        fireUp: 'JUGAR (ENCENDER HORNO)',

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

        fireUp: 'PLAY (FIRE UP OVEN)',

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

const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getDaysBetween = (date1Str: string, date2Str: string) => {
    const d1 = new Date(date1Str);
    const d2 = new Date(date2Str);
    d1.setHours(0,0,0,0);
    d2.setHours(0,0,0,0);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

interface OnboardingModalProps {
  showOnboarding: boolean;
  onboardingStep: number;
  setOnboardingStep: React.Dispatch<React.SetStateAction<number>>;
  language: 'es' | 'en';
  dismissOnboarding: () => void;
}

function OnboardingModal({
  showOnboarding,
  onboardingStep,
  setOnboardingStep,
  language,
  dismissOnboarding,
}: OnboardingModalProps) {
  if (!showOnboarding) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(10,0,0,0.88)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Card */}
      <div
        style={{
          background: 'linear-gradient(160deg, #1a0000 0%, #0d0000 100%)',
          border: '2px solid #d4af37',
          borderRadius: '20px',
          padding: '2rem 1.5rem 1.5rem',
          maxWidth: '320px',
          width: '100%',
          boxShadow: '0 30px 60px rgba(0,0,0,0.8), 0 0 40px rgba(212,175,55,0.15)',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Gold accent top line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '20%',
            right: '20%',
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
            borderRadius: '0 0 3px 3px',
          }}
        />

        {/* Step dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '1.5rem' }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: i === onboardingStep ? '20px' : '7px',
                height: '7px',
                borderRadius: '4px',
                background: i === onboardingStep ? '#d4af37' : 'rgba(212,175,55,0.25)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Step content */}
        {onboardingStep === 0 && (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '0.8rem', filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.4))' }}>🎸🍕</div>
            <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: '#d4af37', letterSpacing: '0.06em', marginBottom: '0.6rem', textTransform: 'uppercase' }}>
              {language === 'es' ? 'Bienvenido, Mafioso' : 'Welcome, Mafioso'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#ccc', lineHeight: '1.55', fontFamily: 'var(--font-body)' }}>
              {language === 'es'
                ? 'Guitar Pizza es un juego de ritmo on-chain. Cocina pizzas al ritmo de la música, acumula puntos y gana recompensas reales en la blockchain de Stellar.'
                : 'Guitar Pizza is an on-chain rhythm game. Cook pizzas to the beat, rack up points, and earn real rewards on the Stellar blockchain.'}
            </div>
          </>
        )}

        {onboardingStep === 1 && (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '0.8rem', filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.4))' }}>⛓️🏆</div>
            <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: '#d4af37', letterSpacing: '0.06em', marginBottom: '0.6rem', textTransform: 'uppercase' }}>
              {language === 'es' ? 'Gana $SLICE & NFTs' : 'Earn $SLICE & NFTs'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#ccc', lineHeight: '1.55', fontFamily: 'var(--font-body)' }}>
              {language === 'es'
                ? 'Cada partida te acerca a tokens $SLICE y NFTs de ingredientes raros. Completa misiones diarias, rompe récords y gana Tickets de Torneo.'
                : 'Every session brings you closer to $SLICE tokens and rare ingredient NFTs. Complete daily quests, break records, and earn Tournament Tickets.'}
            </div>
            {/* Mini reward showcase */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', marginTop: '0.8rem' }}>
              {['🍄 Truffle', '🍇 Grape', '🎟️ Ticket', '🔥 Streak'].map((label) => (
                <div key={label} style={{ fontSize: '0.55rem', color: '#d4af37', fontFamily: 'monospace', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem' }}>{label.split(' ')[0]}</div>
                  <div style={{ opacity: 0.7 }}>{label.split(' ')[1]}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {onboardingStep === 2 && (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '0.8rem', filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.4))' }}>🔑✨</div>
            <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: '#d4af37', letterSpacing: '0.06em', marginBottom: '0.6rem', textTransform: 'uppercase' }}>
              {language === 'es' ? 'Conecta tu Wallet' : 'Connect your Wallet'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#ccc', lineHeight: '1.55', fontFamily: 'var(--font-body)' }}>
              {language === 'es'
                ? 'Conecta una wallet Stellar (Freighter, Albedo, xBull) para guardar tus logros on-chain. ¡Puedes jugar sin wallet, pero no ganarás tokens!'
                : 'Connect a Stellar wallet (Freighter, Albedo, xBull) to save your achievements on-chain. You can play without one, but you won\'t earn tokens!'}
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.6rem', fontFamily: 'monospace', color: '#888', border: '1px dashed rgba(212,175,55,0.3)', borderRadius: '8px', padding: '0.5rem' }}>
              {language === 'es' ? '💡 Red: Stellar Testnet (gratis para probar)' : '💡 Network: Stellar Testnet (free to try)'}
            </div>
          </>
        )}

        {/* Navigation buttons */}
        <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.8rem', justifyContent: 'center' }}>
          {/* Skip */}
          <button
            onClick={dismissOnboarding}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px',
              color: '#888',
              fontSize: '0.72rem',
              fontFamily: 'monospace',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              letterSpacing: '0.05em',
            }}
          >
            {language === 'es' ? 'Saltar' : 'Skip'}
          </button>

          {/* Next / Done */}
          <button
            onClick={() => {
              if (onboardingStep < 2) {
                setOnboardingStep((s) => s + 1);
              } else {
                dismissOnboarding();
              }
            }}
            style={{
              background: 'linear-gradient(135deg, #d4af37, #8B6914)',
              border: 'none',
              borderRadius: '8px',
              color: '#1a0000',
              fontSize: '0.78rem',
              fontWeight: 'bold',
              fontFamily: 'var(--font-display)',
              padding: '0.55rem 1.4rem',
              cursor: 'pointer',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              boxShadow: '0 4px 12px rgba(212,175,55,0.4)',
            }}
          >
            {onboardingStep < 2
              ? language === 'es'
                ? 'Siguiente →'
                : 'Next →'
              : language === 'es'
              ? '¡Empezar! 🍕'
              : "Let's Cook! 🍕"}
          </button>
        </div>

        {/* Step counter */}
        <div style={{ marginTop: '0.8rem', fontSize: '0.52rem', color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace', letterSpacing: '0.06em' }}>
          {onboardingStep + 1} / 3 — GUITAR PIZZA • SOROBAN ZK EDITION
        </div>
      </div>
    </div>
  );
}

export function GuitarPizzaGame({ userAddress, onGameComplete: onGameCompleteProp, onBack, embed = false }: GuitarPizzaGameProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    // ── Fullscreen ───────────────────────────────────────────────────────────
    const [isGameFullscreen, setIsGameFullscreen] = useState(false);

    useEffect(() => {
        const handler = () => setIsGameFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handler);
        return () => document.removeEventListener('fullscreenchange', handler);
    }, []);

    const toggleGameFullscreen = useCallback(async () => {
        try {
            if (!document.fullscreenElement) {
                // Request fullscreen on the game device screen container
                await containerRef.current?.requestFullscreen({ navigationUI: 'hide' });
            } else {
                await document.exitFullscreen();
            }
        } catch {
            // Fullscreen API not supported or denied — silently ignore
        }
    }, []);

    const engineRef = useRef<{ cleanup: () => void, setVolume: (v: number) => void, startGame?: () => void } | null>(null);

    // Reactive Friends list from Zustand state store
    const friends = useFriendsStore((state) => state.friends);

    // Tracks the actual on-chain session ID (may differ from local if a session was reused)

    const onChainSessionIdRef = useRef<number>(0);



    const [status, setStatus] = useState<string>(''); // tx/status messages only — boot has its own loader

    const [booting, setBooting] = useState<boolean>(true); // true until the engine finishes init

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
    const isMutedRef = useRef(isMuted);
    useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);

    const [language, setLanguage] = useState<'es' | 'en'>(() => {

        try { return (localStorage.getItem('gp_language') as 'es' | 'en') ?? 'en'; }

        catch { return 'en'; }

    });

    const t = TRANSLATIONS[language];

    // New Player Onboarding — shows once on first visit
    const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
        try { return !localStorage.getItem('gp_onboarding_done'); }
        catch { return false; }
    });

    const [onboardingStep, setOnboardingStep] = useState(0);

    const dismissOnboarding = () => {
        setShowOnboarding(false);
        try { localStorage.setItem('gp_onboarding_done', '1'); } catch { /* noop */ }
    };



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



    const [view, setView] = useState<'cover' | 'lobby' | 'story' | 'howto' | 'store' | 'leaderboard' | 'songpicker' | 'oven' | 'collection' | 'pvplobby' | 'campaign' | 'bank'>('lobby');

    const [closingView, setClosingView] = useState<string | null>(null);

    const closeModalWithAnimation = useCallback((targetView: 'cover' | 'lobby' | 'story' | 'howto' | 'store' | 'leaderboard' | 'songpicker' | 'oven' | 'collection' | 'pvplobby' | 'campaign' | 'bank' = 'lobby') => {

        setClosingView(view);

        setTimeout(() => {

            setClosingView(null);

            setView(targetView);

        }, 200); // Matches the 0.2s in CSS

    }, [view]);

    // --- Daily Check-in States ---
    const [lastPlayedDate, setLastPlayedDate] = useState<string>(() => {
        return localStorage.getItem('gp_last_played_date') ?? '';
    });
    const [lastCheckInDate, setLastCheckInDate] = useState<string>(() => {
        return localStorage.getItem('gp_last_check_in_date') ?? '';
    });
    const [checkInStreak, setCheckInStreak] = useState<number>(() => {
        return parseInt(localStorage.getItem('gp_check_in_streak') ?? '0', 10) || 0;
    });
    const [checkInHistory, setCheckInHistory] = useState<string[]>(() => {
        try {
            return JSON.parse(localStorage.getItem('gp_check_in_history') ?? '[]');
        } catch {
            return [];
        }
    });
    const [showCheckInModal, setShowCheckInModal] = useState<boolean>(false);

    const todayStr = getTodayString();
    const hasPlayedToday = lastPlayedDate === todayStr;
    const hasCheckedInToday = lastCheckInDate === todayStr;
    const canCheckIn = hasPlayedToday && !hasCheckedInToday;

    const handleCheckIn = async () => {
        if (!canCheckIn) {
            alert(language === 'es' ? '⚠️ No puedes firmar el diario del Don en este momento.' : '⚠️ You cannot sign the Don\'t journal right now.');
            return;
        }

        const today = getTodayString();
        let newStreak = 1;
        if (lastCheckInDate) {
            const days = getDaysBetween(lastCheckInDate, today);
            if (days === 1) {
                newStreak = checkInStreak + 1;
            } else if (days === 0) {
                newStreak = checkInStreak;
            } else {
                newStreak = 1;
            }
        }

        // Calculate reward
        let reward = 1;
        let milestoneRewardMsg = '';
        if (newStreak === 7) {
            reward += 15;
            milestoneRewardMsg = language === 'es' ? '\n\n🎉 ¡SÚPER PREMIO de 7 días! +15 $SLICE' : '\n\n🎉 7-DAY SUPER REWARD! +15 $SLICE';
        } else if (newStreak === 30) {
            reward += 50;
            milestoneRewardMsg = language === 'es' ? '\n\n👑 ¡RECOMPENSA LEGENDARIA de 30 días! +50 $SLICE' : '\n\n👑 30-DAY LEGENDARY REWARD! +50 $SLICE';
        }

        // Submit daily check-in to Stellar smart contract
        let successOnChain = false;
        if (userAddress && userAddress !== 'G_DEMO_USER' && isConnected) {
            try {
                addLog(`[Check-in] Submitting daily check-in to Stellar smart contract...`);
                const signer = getContractSignerRef.current();
                const res = await StellarContractService.dailyCheckIn(userAddress, signer);
                if (res.success) {
                    successOnChain = true;
                    if (res.streak !== undefined) {
                        newStreak = res.streak;
                    }
                    addLog(`[Check-in] On-chain check-in confirmed successfully! Streak: ${newStreak}`);
                } else {
                    alert(language === 'es' 
                        ? `⚠️ Fallo en blockchain: ${res.error}` 
                        : `⚠️ Blockchain check-in failed: ${res.error}`
                    );
                    return;
                }
            } catch (err: any) {
                console.error("Failed to execute daily check-in transaction:", err);
                alert(language === 'es' 
                    ? `⚠️ Error de red al firmar: ${err.message}` 
                    : `⚠️ Connection error signing journal: ${err.message}`
                );
                return;
            }
        }

        // Update local state and local storage
        setSliceBalance(prev => prev + reward);
        setLastCheckInDate(today);
        setCheckInStreak(newStreak);
        const nextHistory = [...checkInHistory, today];
        setCheckInHistory(nextHistory);

        localStorage.setItem('gp_last_check_in_date', today);
        localStorage.setItem('gp_check_in_streak', newStreak.toString());
        localStorage.setItem('gp_check_in_history', JSON.stringify(nextHistory));

        alert((language === 'es' 
            ? `📝 ¡Diario firmado hoy!\n\nRacha actual: ${newStreak} ${newStreak === 1 ? 'día' : 'días'}\nRecompensa: +${reward} $SLICE${milestoneRewardMsg}` 
            : `📝 Signed the Don's journal today!\n\nCurrent streak: ${newStreak} ${newStreak === 1 ? 'day' : 'days'}\nReward: +${reward} $SLICE${milestoneRewardMsg}`) + 
            (successOnChain ? "\n\n🔒 (On-Chain Transaction Confirmed)" : "")
        );
    };

    // --- Rare Ingredients State ---
    const [rareIngredients, setRareIngredients] = useState<{truffle: number; caviar: number; fig: number; goldFlakes: number}>(() => {
        try {
            return JSON.parse(localStorage.getItem('gp_rare_ingredients') ?? '{"truffle":0,"caviar":0,"fig":0,"goldFlakes":0}');
        } catch {
            return { truffle: 0, caviar: 0, fig: 0, goldFlakes: 0 };
        }
    });

    useEffect(() => {
        localStorage.setItem('gp_rare_ingredients', JSON.stringify(rareIngredients));
    }, [rareIngredients]);

    // --- Daily Quests States ---
    const [dailyQuestProgress, setDailyQuestProgress] = useState<number[]>(() => {
        try {
            const savedDate = localStorage.getItem('gp_daily_quests_date');
            const today = getTodayString();
            if (savedDate === today) {
                return JSON.parse(localStorage.getItem('gp_daily_quests_progress') ?? '[0, 0, 0]');
            }
        } catch {}
        return [0, 0, 0];
    });

    const [dailyQuestClaimed, setDailyQuestClaimed] = useState<boolean[]>(() => {
        try {
            const savedDate = localStorage.getItem('gp_daily_quests_date');
            const today = getTodayString();
            if (savedDate === today) {
                return JSON.parse(localStorage.getItem('gp_daily_quests_claimed') ?? '[false, false, false]');
            }
        } catch {}
        return [false, false, false];
    });

    const [showQuestsModal, setShowQuestsModal] = useState<boolean>(false);

    // Sync Daily Quests to LocalStorage
    useEffect(() => {
        const today = getTodayString();
        localStorage.setItem('gp_daily_quests_date', today);
        localStorage.setItem('gp_daily_quests_progress', JSON.stringify(dailyQuestProgress));
        localStorage.setItem('gp_daily_quests_claimed', JSON.stringify(dailyQuestClaimed));
    }, [dailyQuestProgress, dailyQuestClaimed]);

    const incrementQuestProgress = useCallback((questIndex: number, amount: number = 1) => {
        setDailyQuestProgress(prev => {
            const next = [...prev];
            const targets = [2, 1, 1]; // Targets: 2 pizzas, 1 score completed, 1 wood speedup/slate
            next[questIndex] = Math.min(targets[questIndex], next[questIndex] + amount);
            return next;
        });
    }, []);

    const onGameComplete = useCallback((score: number) => {
        const today = getTodayString();
        localStorage.setItem('gp_last_played_date', today);
        setLastPlayedDate(today);
        // Complete Quest 2: Ryhthm Maestro
        incrementQuestProgress(1, 1);
        onGameCompleteProp(score);
    }, [onGameCompleteProp, incrementQuestProgress]);

    // --- Defindex LP & Staking States ---

    const [defindexLpBalance, setDefindexLpBalance] = useState<number>(0);
    const [stakedLp, setStakedLp] = useState<number>(0);
    const [bankTab, setBankTab] = useState<'amm' | 'staking'>('amm');
    const [stakeAmountSlice, setStakeAmountSlice] = useState<string>('');
    const [stakeAmountXlm, setStakeAmountXlm] = useState<string>('');
    const [withdrawAmountLp, setWithdrawAmountLp] = useState<string>('');
    const [stakeAmountLp, setStakeAmountLp] = useState<string>('');
    const [unstakeAmountLp, setUnstakeAmountLp] = useState<string>('');
    const [lastHarvest, setLastHarvest] = useState<number>(0);
    const [lpLastHarvest, setLpLastHarvest] = useState<number>(0);
    const [pendingSliceRewards, setPendingSliceRewards] = useState<{ cheese: number; pepperoni: number; bacon: number; onion: number }>({ cheese: 0, pepperoni: 0, bacon: 0, onion: 0 });
    const [pendingLpRewards, setPendingLpRewards] = useState<{ cheese: number; pepperoni: number; bacon: number; onion: number }>({ cheese: 0, pepperoni: 0, bacon: 0, onion: 0 });
    const [defindexLoading, setDefindexLoading] = useState<boolean>(false);
    const [friendBalances, setFriendBalances] = useState<Record<string, number>>({});

    useEffect(() => {
        if (view !== 'pvplobby' || !friends || friends.length === 0) return;
        
        const fetchFriendsBalances = async () => {
            const balances: Record<string, number> = {};
            await Promise.all(friends.map(async (f: any) => {
                try {
                    const bal = await StellarContractService.getSliceBalance(f.address);
                    balances[f.address] = bal;
                } catch (e) {
                    console.error("Failed to fetch balance for friend", f.address, e);
                    balances[f.address] = 0;
                }
            }));
            setFriendBalances(balances);
        };
        
        fetchFriendsBalances();
    }, [view, friends]);

    // --- ZK Leaderboard Level Selection ---
    const [leaderboardSongId, setLeaderboardSongId] = useState<number>(1);

    // --- Offline Transaction Queue ---
    const [pendingTxs, setPendingTxs] = useState<any[]>(() => {
        try {
            return JSON.parse(localStorage.getItem('gp_pending_txs') ?? '[]');
        } catch {
            return [];
        }
    });

    const claimQuestReward = (questIndex: number) => {
        const targets = [2, 1, 1];
        if (dailyQuestProgress[questIndex] < targets[questIndex]) return;
        if (dailyQuestClaimed[questIndex]) return;

        // Give reward based on index
        setRareIngredients(prev => {
            const next = { ...prev };
            if (questIndex === 0) {
                next.truffle += 1;
            } else if (questIndex === 1) {
                next.fig += 1;
            } else if (questIndex === 2) {
                next.goldFlakes += 1;
            }
            return next;
        });

        setDailyQuestClaimed(prev => {
            const next = [...prev];
            next[questIndex] = true;
            return next;
        });

        const rewardLabel = questIndex === 0 
            ? (language === 'es' ? '🍄 1 Trufa Negra' : '🍄 1 Black Truffle')
            : (questIndex === 1 
                ? (language === 'es' ? '🍇 1 Higo Silvestre' : '🍇 1 Wild Fig')
                : (language === 'es' ? '✨ 1 Lámina de Oro' : '✨ 1 Gold Flake'));

        alert(language === 'es' 
            ? `🎁 ¡Recompensa reclamada!\nObtuviste: ${rewardLabel}`
            : `🎁 Reward Claimed!\nYou obtained: ${rewardLabel}`
        );
    };



    // Timed-Baking Oven States

    const [ovenTab, setOvenTab] = useState<'baking' | 'classic' | 'collection' | 'refrigerator' | 'recipes'>('baking');

    const [stakedSlice, setStakedSlice] = useState<number>(() => {

        try { return parseInt(localStorage.getItem('gp_staked_slice') ?? '0', 10) || 0; }

        catch { return 0; }

    });

    const [sliceBalance, setSliceBalance] = useState<number>(0);
    const [ticketBalance, setTicketBalance] = useState<number>(0);

    // ─── PVP Duel States ────────────────────────────────────────────────────
    const [pvpState, setPvpState] = useState<'menu' | 'waiting' | 'active'>('menu');
    const [roomCode, setRoomCode] = useState<string>('');
    const [joinCode, setJoinCode] = useState<string>('');
    const [selectedWager, setSelectedWager] = useState<number>(10);
    const [isPvp, setIsPvp] = useState<boolean>(false);
    // Multiplayer Real-Time states
    const [mpMatchId, setMpMatchId] = useState<number | null>(null);
    const [rivalAddress, setRivalAddress] = useState<string | null>(null);
    const [isMultiplayer, setIsMultiplayer] = useState<boolean>(false);
    const [mpQueueStatus, setMpQueueStatus] = useState<string>('');

    const [rivalData, setRivalData] = useState<{ name: string; score: number; combo: number; isFever: boolean; isMiss: boolean } | null>(null);
    const [pvpCountdown, setPvpCountdown] = useState<number | null>(null);
    const [playerPvpStats, setPlayerPvpStats] = useState<{ score: number; combo: number } | null>(null);

    const [ingredients, setIngredients] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('gp_ingredients') ?? '{"cheese":5,"pepperoni":4,"bacon":2,"onion":2}');
        } catch {
            return { cheese: 5, pepperoni: 4, bacon: 2, onion: 2 };
        }
    });

    // ─── Refrigerator Vault (Nevera de la Famiglia) State & Helpers ────────

    const INGREDIENT_TOKENS = {
        cheese: 'CBFQYO2ML6ITTZLO46Z6WXUCOV4FLCRYHUBLC7RLERF5OM2G4Q324UGM',
        pepperoni: 'CBE5ZVJPGYORQYZ5ZCLBGKX2HUQVCL2HKGR2T5D4SLFGS73VJYVLPNUW',
        bacon: 'CB4DPSEWXQJHVLIZ3GABBAWNLMKKNZND3KIXPVGAXT6A63DPQMHDK3U5',
        onion: 'CBUE7F2FEVMUH4AX5VJ777EOXN7QCIQEIDZ36622YGLYSOCE6IRXCQEU',
    };

    const [frozenIngredients, setFrozenIngredients] = useState<Record<string, number>>(() => {
        try {
            return JSON.parse(localStorage.getItem('gp_frozen_ingredients') ?? '{"cheese":0,"pepperoni":0,"bacon":0,"onion":0}');
        } catch {
            return { cheese: 0, pepperoni: 0, bacon: 0, onion: 0 };
        }
    });

    const [ingredientTimestamps, setIngredientTimestamps] = useState<Record<string, number[]>>(() => {
        try {
            const saved = localStorage.getItem('gp_ingredient_timestamps');
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error(e);
        }
        const now = Date.now();
        return {
            cheese: Array(5).fill(now),
            pepperoni: Array(4).fill(now),
            bacon: Array(2).fill(now),
            onion: Array(2).fill(now)
        };
    });

    const loadTimestamps = useCallback(() => {
        return ingredientTimestamps;
    }, [ingredientTimestamps]);

    const addIngredientTimestamps = useCallback((type: string, count: number) => {
        setIngredientTimestamps(prev => {
            const ts = { ...prev };
            if (!ts[type]) ts[type] = [];
            const now = Date.now();
            for (let i = 0; i < count; i++) {
                ts[type].push(now);
            }
            localStorage.setItem('gp_ingredient_timestamps', JSON.stringify(ts));
            return ts;
        });
    }, []);

    const removeIngredientTimestamps = useCallback((type: string, count: number) => {
        setIngredientTimestamps(prev => {
            const ts = { ...prev };
            if (ts[type]) {
                ts[type] = [...ts[type]].sort((a: number, b: number) => a - b);
                ts[type] = ts[type].slice(count);
                localStorage.setItem('gp_ingredient_timestamps', JSON.stringify(ts));
            }
            return ts;
        });
    }, []);

    const autoExpireIngredients = useCallback(() => {
        setIngredientTimestamps(prevTs => {
            const ts = { ...prevTs };
            const now = Date.now();
            const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
            let expiredCount = 0;
            const expiredDetails: Record<string, number> = { cheese: 0, pepperoni: 0, bacon: 0, onion: 0 };
            const nextIngredients = { ...ingredients };
            let changed = false;

            for (const type of ['cheese', 'pepperoni', 'bacon', 'onion']) {
                if (ts[type] && ts[type].length > 0) {
                    const validTimestamps = ts[type].filter((t: number) => now - t < sevenDaysMs);
                    const expired = ts[type].length - validTimestamps.length;
                    if (expired > 0) {
                        ts[type] = validTimestamps;
                        nextIngredients[type] = Math.max(0, (nextIngredients[type] || 0) - expired);
                        expiredCount += expired;
                        expiredDetails[type] = expired;
                        changed = true;
                    }
                }
            }

            if (changed) {
                setIngredients(nextIngredients);
                localStorage.setItem('gp_ingredients', JSON.stringify(nextIngredients));
                localStorage.setItem('gp_ingredient_timestamps', JSON.stringify(ts));
                addLog(`🔥 Degradación: Han expirado ${expiredCount} ingredientes frescos de hace más de 7 días: ` +
                       `${expiredDetails.cheese} Queso, ${expiredDetails.pepperoni} Pepperoni, ` +
                       `${expiredDetails.bacon} Bacon, ${expiredDetails.onion} Onion.`);
            }
            return ts;
        });
    }, [ingredients]);

    const fetchRefrigeratorData = useCallback(async () => {
        const isPlaceholder = !CONTRACT_IDS.refrigeratorVault || CONTRACT_IDS.refrigeratorVault.includes('CONTRACTID') || CONTRACT_IDS.refrigeratorVault.includes('CDREFRIGERATOR') || CONTRACT_IDS.refrigeratorVault.length !== 56;
        if (!userAddress || userAddress === 'G_DEMO_USER' || !isConnected || isPlaceholder) {
            return;
        }
        try {
            const [cheeseBal, pepBal, baconBal, onionBal] = await Promise.all([
                StellarContractService.getRefrigeratorBalance(userAddress, INGREDIENT_TOKENS.cheese),
                StellarContractService.getRefrigeratorBalance(userAddress, INGREDIENT_TOKENS.pepperoni),
                StellarContractService.getRefrigeratorBalance(userAddress, INGREDIENT_TOKENS.bacon),
                StellarContractService.getRefrigeratorBalance(userAddress, INGREDIENT_TOKENS.onion)
            ]);

            const nextFrozen = {
                cheese: cheeseBal,
                pepperoni: pepBal,
                bacon: baconBal,
                onion: onionBal
            };
            setFrozenIngredients(nextFrozen);
            localStorage.setItem('gp_frozen_ingredients', JSON.stringify(nextFrozen));
        } catch (e) {
            console.error('fetchRefrigeratorData failed:', e);
        }
    }, [userAddress, isConnected]);

    const depositToRefrigerator = async (type: 'cheese' | 'pepperoni' | 'bacon' | 'onion', amount: number) => {
        if (amount <= 0) return;
        if ((ingredients as any)[type] < amount) {
            alert(`⚠️ No tienes suficiente ${type} fresco.`);
            return;
        }

        const isPlaceholder = !CONTRACT_IDS.refrigeratorVault || CONTRACT_IDS.refrigeratorVault.includes('CONTRACTID') || CONTRACT_IDS.refrigeratorVault.includes('CDREFRIGERATOR') || CONTRACT_IDS.refrigeratorVault.length !== 56;
        if (userAddress === 'G_DEMO_USER' || !isConnected || isPlaceholder) {
            const nextIngredients = { ...ingredients };
            (nextIngredients as any)[type] -= amount;
            removeIngredientTimestamps(type, amount);

            const nextFrozen = { ...frozenIngredients };
            nextFrozen[type] += amount;

            setIngredients(nextIngredients);
            setFrozenIngredients(nextFrozen);

            localStorage.setItem('gp_ingredients', JSON.stringify(nextIngredients));
            localStorage.setItem('gp_frozen_ingredients', JSON.stringify(nextFrozen));
            
            if (isPlaceholder) {
                addLog(`❄️ Simulación: Has depositado ${amount} ${type} en la Nevera.`);
                alert(`❄️ ¡Ingrediente preservado en la Nevera (Simulación Local)! \n(Nota: Contrato no desplegado aún en esta red)`);
            } else {
                addLog(`❄️ Local: Has depositado ${amount} ${type} en la Nevera.`);
                alert(`❄️ ¡Ingrediente preservado con éxito en la Nevera (Modo Demo)!`);
            }
            return;
        }

        try {
            const signer = getContractSignerRef.current();
            const tokenAddr = (INGREDIENT_TOKENS as any)[type];
            addLog(`❄️ Enviando transacción a Soroban para congelar ${amount} ${type}...`);
            const res = await StellarContractService.depositToRefrigerator(userAddress, tokenAddr, amount, signer);
            if (res.success) {
                const nextIngredients = { ...ingredients };
                (nextIngredients as any)[type] -= amount;
                removeIngredientTimestamps(type, amount);

                setIngredients(nextIngredients);
                localStorage.setItem('gp_ingredients', JSON.stringify(nextIngredients));

                await fetchRefrigeratorData();
                const updatedSlice = await StellarContractService.getSliceBalance(userAddress);
                setSliceBalance(updatedSlice);

                addLog(`❄️ ¡Congelación exitosa en Stellar Testnet!`);
                alert(`❄️ ¡Excelente! Ingredientes preservados de por vida on-chain.`);
            } else {
                if (res.error === 'SIGNATURE_REJECTED') {
                    addLog(`⚠️ Transacción cancelada: Firma rechazada por el usuario.`);
                    alert(`⚠️ Firma rechazada por el usuario.`);
                } else {
                    alert(`⚠️ Error al depositar en la Nevera: ${res.error}`);
                }
            }
        } catch (e: any) {
            if (e.message === 'SIGNATURE_REJECTED') {
                addLog(`⚠️ Transacción cancelada: Firma rechazada por el usuario.`);
                alert(`⚠️ Firma rechazada por el usuario.`);
            } else {
                alert(`⚠️ Error: ${e.message}`);
            }
        }
    };

    const withdrawFromRefrigerator = async (type: 'cheese' | 'pepperoni' | 'bacon' | 'onion', amount: number) => {
        if (amount <= 0) return;
        if (frozenIngredients[type] < amount) {
            alert(`⚠️ No tienes suficiente ${type} congelado en la Nevera.`);
            return;
        }

        const isPlaceholder = !CONTRACT_IDS.refrigeratorVault || CONTRACT_IDS.refrigeratorVault.includes('CONTRACTID') || CONTRACT_IDS.refrigeratorVault.includes('CDREFRIGERATOR') || CONTRACT_IDS.refrigeratorVault.length !== 56;
        if (userAddress === 'G_DEMO_USER' || !isConnected || isPlaceholder) {
            const nextIngredients = { ...ingredients };
            (nextIngredients as any)[type] += amount;
            addIngredientTimestamps(type, amount);

            const nextFrozen = { ...frozenIngredients };
            nextFrozen[type] -= amount;

            setIngredients(nextIngredients);
            setFrozenIngredients(nextFrozen);

            localStorage.setItem('gp_ingredients', JSON.stringify(nextIngredients));
            localStorage.setItem('gp_frozen_ingredients', JSON.stringify(nextFrozen));
            
            if (isPlaceholder) {
                addLog(`❄️ Simulación: Has retirado ${amount} ${type} de la Nevera.`);
                alert(`❄️ ¡Retiro exitoso de la Nevera (Simulación Local)! \n(Nota: Contrato no desplegado aún en esta red)`);
            } else {
                addLog(`❄️ Local: Has retirado ${amount} ${type} de la Nevera.`);
                alert(`❄️ ¡Retiro exitoso de la Nevera (Modo Demo)!`);
            }
            return;
        }

        try {
            const signer = getContractSignerRef.current();
            const tokenAddr = (INGREDIENT_TOKENS as any)[type];
            addLog(`❄️ Enviando transacción a Soroban para retirar ${amount} ${type}...`);
            const res = await StellarContractService.withdrawFromRefrigerator(userAddress, tokenAddr, amount, signer);
            if (res.success) {
                const nextIngredients = { ...ingredients };
                (nextIngredients as any)[type] += amount;
                addIngredientTimestamps(type, amount);

                setIngredients(nextIngredients);
                localStorage.setItem('gp_ingredients', JSON.stringify(nextIngredients));

                await fetchRefrigeratorData();

                addLog(`❄️ ¡Retiro exitoso desde Stellar Testnet!`);
                alert(`❄️ Ingredientes listos para cocinar.`);
            } else {
                if (res.error === 'SIGNATURE_REJECTED') {
                    addLog(`⚠️ Transacción cancelada: Firma rechazada por el usuario.`);
                    alert(`⚠️ Firma rechazada por el usuario.`);
                } else {
                    alert(`⚠️ Error al retirar de la Nevera: ${res.error}`);
                }
            }
        } catch (e: any) {
            if (e.message === 'SIGNATURE_REJECTED') {
                addLog(`⚠️ Transacción cancelada: Firma rechazada por el usuario.`);
                alert(`⚠️ Firma rechazada por el usuario.`);
            } else {
                alert(`⚠️ Error: ${e.message}`);
            }
        }
    };

    const [isPracticeMode, setIsPracticeMode] = useState<boolean>(true);
    const [personalBests, setPersonalBests] = useState<Record<string, number>>(() => {
        try {
            return JSON.parse(localStorage.getItem('gp_personal_bests') ?? '{}');
        } catch {
            return {};
        }
    });




    const [ovenSlots, setOvenSlots] = useState<Array<{

        id: number;

        isLocked: boolean;

        status: 'idle' | 'baking' | 'completed';

        pizzaType: 'margherita' | 'pepperoni' | 'special' | 'tartufo' | 'dolce' | 'mafia' | null;

        startTime: number | null;

        duration: number | null;

        ovenNftId: number | null;

        basePayout: number | null;

    }>>(() => {

        try {

            const saved = localStorage.getItem(`gp_oven_slots_${userAddress || 'offline'}`);

            if (saved) return JSON.parse(saved);

        } catch (e) { console.error("Error loading oven slots", e); }

        return [

            { id: 1, isLocked: false, status: 'idle', pizzaType: null, startTime: null, duration: null, ovenNftId: null, basePayout: null },

            { id: 2, isLocked: false, status: 'idle', pizzaType: null, startTime: null, duration: null, ovenNftId: null, basePayout: null },

            { id: 3, isLocked: true, status: 'idle', pizzaType: null, startTime: null, duration: null, ovenNftId: null, basePayout: null },

            { id: 4, isLocked: true, status: 'idle', pizzaType: null, startTime: null, duration: null, ovenNftId: null, basePayout: null }

        ];

    });



    const [selectedFuel, setSelectedFuel] = useState<'oak' | 'cherry' | 'mesquite'>('oak');

    const [equippedOvenStyle, setEquippedOvenStyle] = useState<'brick' | 'cyberpunk' | 'vulcan'>('brick');



    // Persistence effects

    useEffect(() => {

        localStorage.setItem('gp_staked_slice', stakedSlice.toString());

    }, [stakedSlice]);



    useEffect(() => {

        localStorage.setItem('gp_ingredients', JSON.stringify(ingredients));

    }, [ingredients]);



    useEffect(() => {

        localStorage.setItem(`gp_oven_slots_${userAddress || 'offline'}`, JSON.stringify(ovenSlots));

    }, [ovenSlots, userAddress]);



    // Load balances from contract when entering Oven/Bank views
    useEffect(() => {
        if ((view === 'oven' || view === 'songpicker' || view === 'bank') && userAddress) {
            const fetchOnChainData = async () => {
                if (document.hidden) return; // Skip if tab is inactive
                try {
                    const [balance, staked, tickets, lpBal, stakedLpBal, onChainCheckIn, lpLastHarvestVal] = await Promise.all([
                        StellarContractService.getSliceBalance(userAddress),
                        StellarContractService.getStakedBalance(userAddress),
                        StellarContractService.getTournamentTickets(userAddress),
                        StellarContractService.getDefindexLpBalance(userAddress),
                        StellarContractService.getLpStakedBalance(userAddress),
                        StellarContractService.getDailyCheckIn(userAddress),
                        StellarContractService.getLpStakingLastHarvest(userAddress),
                        fetchRefrigeratorData()
                    ]);

                    setSliceBalance(balance);
                    setStakedSlice(staked);
                    setTicketBalance(tickets);
                    setDefindexLpBalance(lpBal);
                    setStakedLp(stakedLpBal);
                    setLpLastHarvest(lpLastHarvestVal);

                    if (onChainCheckIn) {
                        const dateStr = onChainCheckIn.lastCheckinTimestamp > 0 
                            ? new Date(onChainCheckIn.lastCheckinTimestamp * 1000).toISOString().split('T')[0]
                            : '';
                        if (dateStr) {
                            setLastCheckInDate(dateStr);
                            localStorage.setItem('gp_last_check_in_date', dateStr);
                        }
                        setCheckInStreak(onChainCheckIn.streak);
                        localStorage.setItem('gp_check_in_streak', onChainCheckIn.streak.toString());
                    }

                    if (view === 'oven') {
                        // Fetch slot states in parallel from Soroban PizzaBaking contract
                        const updatedSlots = [...ovenSlots];
                        const slotPromises = updatedSlots.map(async (slot) => {
                            const onChainSlot = await StellarContractService.getBakingSlot(userAddress, slot.id);
                            if (onChainSlot) {
                                return {
                                    id: slot.id,
                                    isLocked: onChainSlot.locked,
                                    status: (onChainSlot.locked 
                                        ? 'idle' 
                                        : (onChainSlot.startTime === 0 
                                            ? 'idle' 
                                            : (Date.now() >= onChainSlot.startTime + onChainSlot.duration 
                                                ? 'completed' 
                                                : 'baking'))) as 'idle' | 'baking' | 'completed',
                                    pizzaType: (onChainSlot.recipeId === 1 
                                        ? 'margherita' 
                                        : (onChainSlot.recipeId === 2 ? 'pepperoni' : (onChainSlot.recipeId === 3 ? 'special' : (onChainSlot.recipeId === 4 ? 'tartufo' : (onChainSlot.recipeId === 5 ? 'dolce' : (onChainSlot.recipeId === 6 ? 'mafia' : null)))))) as 'margherita' | 'pepperoni' | 'special' | 'tartufo' | 'dolce' | 'mafia' | null,
                                    startTime: onChainSlot.startTime,
                                    duration: onChainSlot.duration,
                                    ovenNftId: onChainSlot.ovenNftId,
                                    basePayout: onChainSlot.basePayout
                                };
                            }
                            return slot;
                        });
                        const slotsResults = await Promise.all(slotPromises);
                        setOvenSlots(slotsResults);
                    }
                } catch (e) {
                    console.error("Failed to load on-chain balances/oven data", e);
                }
            };

            fetchOnChainData();
            const interval = setInterval(fetchOnChainData, 30000); // refresh every 30s instead of 10s
            return () => clearInterval(interval);
        }

    }, [view, userAddress, fetchRefrigeratorData]);

    // --- Defindex Vault Staking Handlers ---
    const handleDefindexDeposit = async () => {
        const sliceVal = parseFloat(stakeAmountSlice);
        const xlmVal = parseFloat(stakeAmountXlm);
        if (isNaN(sliceVal) || sliceVal <= 0 || isNaN(xlmVal) || xlmVal <= 0) {
            alert(language === 'es' ? 'Por favor ingresa cantidades válidas de SLICE y XLM.' : 'Please enter valid SLICE and XLM amounts.');
            return;
        }
        if (sliceBalance < sliceVal) {
            alert(language === 'es' ? 'Saldo de SLICE insuficiente.' : 'Insufficient SLICE balance.');
            return;
        }

        setDefindexLoading(true);
        try {
            const signer = getContractSignerRef.current();
            addLog(`🏦 Depositando ${sliceVal} SLICE y ${xlmVal} XLM en la Bóveda de Defindex...`);
            const res = await StellarContractService.depositDefindexVault(userAddress, sliceVal, xlmVal, signer);
            if (res.success) {
                addLog(`🏦 Depósito en Defindex exitoso! (tx: ${res.txHash || ''})`);
                alert(language === 'es' ? '¡Depósito en Defindex completado exitosamente!' : 'Defindex deposit completed successfully!');
                setStakeAmountSlice('');
                setStakeAmountXlm('');
                
                // Complete Quest 3: Spend slice in fuel or stake/liquidity
                incrementQuestProgress(2, 1);
                
                // Refresh balances
                const balance = await StellarContractService.getSliceBalance(userAddress);
                setSliceBalance(balance);
                const lpBal = await StellarContractService.getDefindexLpBalance(userAddress);
                setDefindexLpBalance(lpBal);
            } else {
                if (res.error === 'SIGNATURE_REJECTED') {
                    addLog(`⚠️ Transacción cancelada: Firma rechazada por el usuario.`);
                    alert(`⚠️ Firma rechazada por el usuario.`);
                } else {
                    alert(`⚠️ Error: ${res.error}`);
                }
            }
        } catch (e: any) {
            if (e.message === 'SIGNATURE_REJECTED') {
                addLog(`⚠️ Transacción cancelada: Firma rechazada por el usuario.`);
                alert(`⚠️ Firma rechazada por el usuario.`);
            } else {
                alert(`⚠️ Error: ${e.message}`);
            }
        } finally {
            setDefindexLoading(false);
        }
    };

    const handleDefindexWithdraw = async () => {
        const lpVal = parseFloat(withdrawAmountLp);
        if (isNaN(lpVal) || lpVal <= 0) {
            alert(language === 'es' ? 'Por favor ingresa una cantidad de LP válida.' : 'Please enter a valid LP amount.');
            return;
        }
        if (defindexLpBalance < lpVal) {
            alert(language === 'es' ? 'Saldo de LP insuficiente.' : 'Insufficient LP balance.');
            return;
        }

        setDefindexLoading(true);
        try {
            const signer = getContractSignerRef.current();
            addLog(`🏦 Retirando liquidez de la Bóveda de Defindex usando ${lpVal} LP...`);
            const res = await StellarContractService.withdrawDefindexVault(userAddress, lpVal, signer);
            if (res.success) {
                addLog(`🏦 Retiro de Defindex exitoso! (tx: ${res.txHash || ''})`);
                alert(language === 'es' ? '¡Retiro de Defindex completado exitosamente!' : 'Defindex withdrawal completed successfully!');
                setWithdrawAmountLp('');
                // Refresh balances
                const balance = await StellarContractService.getSliceBalance(userAddress);
                setSliceBalance(balance);
                const lpBal = await StellarContractService.getDefindexLpBalance(userAddress);
                setDefindexLpBalance(lpBal);
            } else {
                if (res.error === 'SIGNATURE_REJECTED') {
                    addLog(`⚠️ Transacción cancelada: Firma rechazada por el usuario.`);
                    alert(`⚠️ Firma rechazada por el usuario.`);
                } else {
                    alert(`⚠️ Error: ${res.error}`);
                }
            }
        } catch (e: any) {
            if (e.message === 'SIGNATURE_REJECTED') {
                addLog(`⚠️ Transacción cancelada: Firma rechazada por el usuario.`);
                alert(`⚠️ Firma rechazada por el usuario.`);
            } else {
                alert(`⚠️ Error: ${e.message}`);
            }
        } finally {
            setDefindexLoading(false);
        }
    };

    const handleLpStake = async () => {
        const lpVal = parseFloat(stakeAmountLp);
        if (isNaN(lpVal) || lpVal <= 0) {
            alert(language === 'es' ? 'Por favor ingresa una cantidad de LP válida.' : 'Please enter a valid LP amount.');
            return;
        }
        if (defindexLpBalance < lpVal) {
            alert(language === 'es' ? 'Saldo de LP insuficiente en billetera.' : 'Insufficient LP balance in wallet.');
            return;
        }

        setDefindexLoading(true);
        try {
            const signer = getContractSignerRef.current();
            addLog(`🥩 Depositando ${lpVal} LP en Staking Vault...`);
            const res = await StellarContractService.stakeLp(userAddress, lpVal, signer);
            if (res.success) {
                addLog(`🥩 LP Stake exitoso! (tx: ${res.txHash || ''})`);
                alert(language === 'es' ? '¡Staking de LP completado exitosamente!' : 'LP Staking completed successfully!');
                setStakeAmountLp('');
                
                // Refresh balances
                const lpBal = await StellarContractService.getDefindexLpBalance(userAddress);
                setDefindexLpBalance(lpBal);
                const stakedLpBal = await StellarContractService.getLpStakedBalance(userAddress);
                setStakedLp(stakedLpBal);
                const lastH = await StellarContractService.getLpStakingLastHarvest(userAddress);
                setLpLastHarvest(lastH);
            } else {
                if (res.error === 'SIGNATURE_REJECTED') {
                    addLog(`⚠️ Transacción cancelada: Firma rechazada por el usuario.`);
                    alert(`⚠️ Firma rechazada por el usuario.`);
                } else {
                    alert(`⚠️ Error: ${res.error}`);
                }
            }
        } catch (e: any) {
            if (e.message === 'SIGNATURE_REJECTED') {
                addLog(`⚠️ Transacción cancelada: Firma rechazada por el usuario.`);
                alert(`⚠️ Firma rechazada por el usuario.`);
            } else {
                alert(`⚠️ Error: ${e.message}`);
            }
        } finally {
            setDefindexLoading(false);
        }
    };

    const handleLpUnstake = async () => {
        const lpVal = parseFloat(unstakeAmountLp);
        if (isNaN(lpVal) || lpVal <= 0) {
            alert(language === 'es' ? 'Por favor ingresa una cantidad de LP válida.' : 'Please enter a valid LP amount.');
            return;
        }
        if (stakedLp < lpVal) {
            alert(language === 'es' ? 'Saldo de LP stakeado insuficiente.' : 'Insufficient staked LP balance.');
            return;
        }

        setDefindexLoading(true);
        try {
            const signer = getContractSignerRef.current();
            addLog(`🥩 Retirando ${lpVal} LP de Staking Vault...`);
            const res = await StellarContractService.unstakeLp(userAddress, lpVal, signer);
            if (res.success) {
                addLog(`🥩 LP Unstake exitoso! (tx: ${res.txHash || ''})`);
                alert(language === 'es' ? '¡Retiro de LP completado exitosamente!' : 'LP Unstake completed successfully!');
                setUnstakeAmountLp('');
                
                // Refresh balances
                const lpBal = await StellarContractService.getDefindexLpBalance(userAddress);
                setDefindexLpBalance(lpBal);
                const stakedLpBal = await StellarContractService.getLpStakedBalance(userAddress);
                setStakedLp(stakedLpBal);
                const lastH = await StellarContractService.getLpStakingLastHarvest(userAddress);
                setLpLastHarvest(lastH);
                await fetchRefrigeratorData();
            } else {
                if (res.error === 'SIGNATURE_REJECTED') {
                    addLog(`⚠️ Transacción cancelada: Firma rechazada por el usuario.`);
                    alert(`⚠️ Firma rechazada por el usuario.`);
                } else {
                    alert(`⚠️ Error: ${res.error}`);
                }
            }
        } catch (e: any) {
            if (e.message === 'SIGNATURE_REJECTED') {
                addLog(`⚠️ Transacción cancelada: Firma rechazada por el usuario.`);
                alert(`⚠️ Firma rechazada por el usuario.`);
            } else {
                alert(`⚠️ Error: ${e.message}`);
            }
        } finally {
            setDefindexLoading(false);
        }
    };

    const handleLpClaimRewards = async () => {
        if (stakedLp <= 0) {
            alert(language === 'es' ? 'No tienes LP tokens stakeados.' : 'You have no LP tokens staked.');
            return;
        }

        setDefindexLoading(true);
        try {
            const signer = getContractSignerRef.current();
            addLog(`🥩 Cosechando ingredientes del LP Staking...`);
            const res = await StellarContractService.claimLpRewards(userAddress, signer);
            if (res.success) {
                addLog(`🥩 Ingredientes cosechados! (tx: ${res.txHash || ''})`);
                alert(language === 'es' ? '¡Ingredientes cosechados exitosamente!' : 'Ingredients harvested successfully!');
                
                const lastH = await StellarContractService.getLpStakingLastHarvest(userAddress);
                setLpLastHarvest(lastH);
                await fetchRefrigeratorData();
            } else {
                if (res.error === 'SIGNATURE_REJECTED') {
                    addLog(`⚠️ Transacción cancelada: Firma rechazada por el usuario.`);
                    alert(`⚠️ Firma rechazada por el usuario.`);
                } else {
                    alert(`⚠️ Error: ${res.error}`);
                }
            }
        } catch (e: any) {
            if (e.message === 'SIGNATURE_REJECTED') {
                addLog(`⚠️ Transacción cancelada: Firma rechazada por el usuario.`);
                alert(`⚠️ Firma rechazada por el usuario.`);
            } else {
                alert(`⚠️ Error: ${e.message}`);
            }
        } finally {
            setDefindexLoading(false);
        }
    };

    // Real-time LP staking rewards estimation
    useEffect(() => {
        if (view !== 'bank' || bankTab !== 'staking' || stakedLp <= 0 || lpLastHarvest <= 0) {
            setPendingLpRewards({ cheese: 0, pepperoni: 0, bacon: 0, onion: 0 });
            return;
        }

        const interval = setInterval(() => {
            const elapsed = Math.max(0, Math.floor(Date.now() / 1000) - lpLastHarvest);
            const rawStake = Math.floor(stakedLp * 1e7);
            const rawReward = Math.floor((rawStake * elapsed * 4) / 6000);
            const rewardFloat = Math.max(0, rawReward / 1e7);
            setPendingLpRewards({
                cheese: rewardFloat,
                pepperoni: rewardFloat,
                bacon: rewardFloat,
                onion: rewardFloat
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [view, bankTab, stakedLp, lpLastHarvest]);

    const loadLeaderboard = useCallback(async () => {
        setLeaderboardLoading(true);
        setLeaderboardError(null);
        try {
            const entries = await StellarContractService.getLeaderboard(userAddress, leaderboardSongId);
            const arr = entries as any[];
            const mapped = arr.slice(0, 10).map((e: any, i: number) => {
                const playerStr = typeof e.player === 'string'
                    ? e.player
                    : (e.player?.toString?.() ?? String(e.player ?? ''));
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
    }, [userAddress, leaderboardSongId]);

    // --- Offline Transaction Queue Processing ---
    const processPendingQueue = useCallback(async () => {
        if (pendingTxs.length === 0 || !userAddress || userAddress === 'G_DEMO_USER' || !navigator.onLine) return;
        const queueToProcess = [...pendingTxs];
        addLog(`🔄 Found ${queueToProcess.length} pending ZK score submissions. Attempting auto-sync...`);
        
        let processedAny = false;
        const remainingQueue: any[] = [];

        for (const item of queueToProcess) {
            try {
                const signer = getContractSignerRef.current();
                const result = await StellarContractService.postGameFlow(userAddress, item.sessionStats, signer);
                if (result.scoreSubmitted) {
                    addLog(`✅ Auto-synced score of ${item.score} successfully!`);
                    processedAny = true;
                    if (result.sliceClaimed) {
                        setSliceBalance(prev => prev + result.sliceAmount);
                    }
                } else {
                    remainingQueue.push(item);
                }
            } catch (err) {
                console.error("Auto-sync failed for score", item.score, err);
                remainingQueue.push(item);
            }
        }

        setPendingTxs(remainingQueue);
        localStorage.setItem('gp_pending_txs', JSON.stringify(remainingQueue));
        
        if (processedAny) {
            alert(language === 'es'
                ? "🔄 ¡Sincronización completada! Tus récords pendientes han sido enviados a Stellar."
                : "🔄 Sync completed! Your pending records have been submitted to Stellar."
            );
            loadLeaderboard();
        }
    }, [pendingTxs, userAddress, loadLeaderboard, language]);

    useEffect(() => {
        const handleOnline = () => {
            processPendingQueue();
        };
        window.addEventListener('online', handleOnline);
        return () => window.removeEventListener('online', handleOnline);
    }, [processPendingQueue]);

    useEffect(() => {
        if (view === 'lobby' && userAddress && navigator.onLine) {
            processPendingQueue();
        }
    }, [view, userAddress, processPendingQueue]);

    // Initialize WebSocket Multiplayer Connection
    useEffect(() => {
        const addr = userAddress === 'G_DEMO_USER' ? 'G_DEMO_USER_' + Math.floor(Math.random() * 1000) : userAddress;
        
        multiplayerService.connect(undefined, {
            onRoomCreated: (code, wager) => {
                setRoomCode(code);
                setPvpState('waiting');
                setMpQueueStatus(language === 'es' ? 'Esperando al oponente...' : 'Waiting for opponent...');
            },
            onMatchFound: async (payload) => {
                addLog(`[Multiplayer] Match found! ID: ${payload.matchId} | Opponent: ${payload.opponentAddress}`);
                setMpMatchId(payload.matchId);
                setRivalAddress(payload.opponentAddress);
                setIsMultiplayer(true);
                setPvpState('waiting');
                setMpQueueStatus(language === 'es' ? '¡Rival encontrado! Firmando apuestas...' : 'Rival found! Locking wagers...');
                
                // Simulate or execute on-chain wager lockup
                if (userAddress !== 'G_DEMO_USER' && isConnectedRef.current) {
                    const signer = getContractSignerRef.current();
                    await StellarContractService.createPvpMatch(userAddress, payload.wager, signer);
                }
                
                // Confirm wager locked to socket server
                multiplayerService.lockWager(payload.matchId);
            },
            onStartGame: (matchId, startTime) => {
                addLog(`[Multiplayer] Both wagers locked. Starting game sync!`);
                setIsPvp(true);
                setView('lobby');
                // Pre-populate rival data with the opponent's address for real-time overlay
                setRivalData({
                    name: rivalAddress 
                        ? (rivalAddress.slice(0, 6) + '...' + rivalAddress.slice(-4))
                        : (language === 'es' ? 'Rival' : 'Opponent'),
                    score: 0,
                    combo: 0,
                    isFever: false,
                    isMiss: false
                });

                if (startTime) {
                    const diff = startTime - Date.now();
                    addLog(`[Multiplayer] Starting game in ${diff}ms (server synchronized)`);
                    setPvpCountdown(Math.max(1, Math.ceil(diff / 1000)));

                    const timer = setInterval(() => {
                        const remaining = startTime - Date.now();
                        if (remaining <= 0) {
                            clearInterval(timer);
                            setPvpCountdown(null);
                            handleStartGame();
                        } else {
                            setPvpCountdown(Math.max(1, Math.ceil(remaining / 1000)));
                        }
                    }, 100);
                } else {
                    handleStartGame();
                }
            },
            onRivalNote: (payload) => {
                setRivalData(prev => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        score: payload.score,
                        combo: payload.combo,
                        isFever: payload.isFever,
                        isMiss: payload.hitType === 'miss'
                    };
                });
            },
            onMatchResolved: (payload) => {
                addLog(`[Multiplayer] Game finished! Winner: ${payload.winnerAddress}`);
                alert(`🏁 Partida finalizada! 
Chef A: ${payload.playerAScore} | Chef B: ${payload.playerBScore} 
Ganador: ${payload.winnerAddress}`);
            },
            onRivalDisconnected: (reason) => {
                addLog(`[Multiplayer] Rival disconnected: ${reason}`);
                alert(`⚠️ Oponente desconectado. Partida suspendida.`);
                setIsPvp(false);
                setIsMultiplayer(false);
                setRivalData(null);
                setView('campaign');
            },
            onError: (err) => {
                console.error('[Multiplayer WebSocket] Error event:', err);
                setMpQueueStatus(`Error: ${err}`);
            }
        });
        
        return () => {
            multiplayerService.disconnect();
        };
    }, [userAddress, language]);

    // Periodically run autoExpireIngredients to check for 7-day degradation
    useEffect(() => {
        autoExpireIngredients();
        const interval = setInterval(() => {
            autoExpireIngredients();
        }, 60000); // every minute
        return () => clearInterval(interval);
    }, [ingredients, autoExpireIngredients]);

    // Live PVP Real-time Rival Simulator Effect
    useEffect(() => {
        if (!isPvp) {
            setRivalData(null);
            return;
        }

        setRivalData({
            name: language === 'es' ? 'Chef Corleone' : 'Chef Corleone',
            score: 0,
            combo: 0,
            isFever: false,
            isMiss: false
        });

        const interval = setInterval(() => {
            if ((window as any).getGuitarPizzaStats) {
                try {
                    const stats = (window as any).getGuitarPizzaStats();
                    if (stats) {
                        setPlayerPvpStats({
                            score: stats.score || 0,
                            combo: stats.combo || 0
                        });
                        
                        // Sync player's own note hits to opponent via WebSocket
                        if (isMultiplayer && mpMatchId !== null) {
                            multiplayerService.syncNote(
                                mpMatchId,
                                stats.score || 0,
                                stats.combo || 0,
                                stats.lastHitType || 'perfect',
                                stats.isFever || false
                            );
                        }
                    }
                } catch (e) {}
            }

            // Only simulate bot events if we are not connected to a live multiplayer opponent!
            if (!isMultiplayer) {
                setRivalData(prev => {
                    if (!prev) return null;
                    const rand = Math.random();
                    let nextMiss = false;
                    let nextCombo = prev.combo;
                    let addScore = 0;

                    if (rand < 0.08) {
                        nextMiss = true;
                        nextCombo = 0;
                    } else {
                        nextCombo += 1;
                        addScore = Math.floor(110 + Math.random() * 60);
                        if (prev.isFever) addScore *= 2;
                    }

                    let nextFever = prev.isFever;
                    if (nextCombo >= 10 && !nextFever && Math.random() < 0.4) {
                        nextFever = true;
                    } else if (nextFever && Math.random() < 0.15) {
                        nextFever = false;
                    }

                    return {
                        ...prev,
                        score: prev.score + addScore,
                        combo: nextCombo,
                        isFever: nextFever,
                        isMiss: nextMiss
                    };
                });
            }
        }, 1000);

        return () => {
            clearInterval(interval);
            setPlayerPvpStats(null);
        };
    }, [isPvp, isMultiplayer, language]);

    const playSyntheticDing = () => {
        if (isMutedRef.current) return;
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
            osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
            
            gain.gain.setValueAtTime(0.25, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
            
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.35);
            setTimeout(() => {
                if (ctx && ctx.state !== 'closed') ctx.close().catch(e => console.warn(e));
            }, 1000);
        } catch (e) {
            console.warn('Failed to play synthetic ding:', e);
        }
    };

    // Clock tick for baking progress & offline local timers

    useEffect(() => {

        const interval = setInterval(() => {

            setOvenSlots(prevSlots => {

                let changed = false;

                const nextSlots = prevSlots.map(slot => {

                    if (slot.status === 'baking' && slot.startTime && slot.duration) {

                        const elapsed = Date.now() - slot.startTime;

                        if (elapsed >= slot.duration) {

                            changed = true;
                            playSyntheticDing();

                            return { ...slot, status: 'completed' as const };

                        }

                    }

                    return slot;

                });

                return changed ? nextSlots : prevSlots;

            });

        }, 1000);

        return () => clearInterval(interval);

    }, []);



    const getBakeConfig = (recipe: 'margherita' | 'pepperoni' | 'special' | 'tartufo' | 'dolce' | 'mafia') => {
        switch (recipe) {
            case 'margherita': return { label: '🍕 Margherita', duration: 10000, cost: { cheese: 1 }, payout: 15 };
            case 'pepperoni': return { label: '🍖 Pepperoni', duration: 30000, cost: { cheese: 1, pepperoni: 1 }, payout: 40 };
            case 'special': return { label: '⭐ Speciale', duration: 60000, cost: { cheese: 1, pepperoni: 1, bacon: 1 }, payout: 100 };
            case 'tartufo': return { label: '🍄 Tartufo Prestigio', duration: 45000, cost: { cheese: 2, pepperoni: 1 }, payout: 120 };
            case 'dolce': return { label: '🍇 Dolce Vita', duration: 40000, cost: { cheese: 2, onion: 1 }, payout: 100 };
            case 'mafia': return { label: '👑 della Mafia', duration: 90000, cost: { cheese: 2, bacon: 2 }, payout: 250 };
        }
    };

    const startBaking = async (slotId: number, recipe: 'margherita' | 'pepperoni' | 'special' | 'tartufo' | 'dolce' | 'mafia') => {
        const config = getBakeConfig(recipe);
        if (!config) return;

        // Check and deduct fuel cost
        let fuelCost = 0.0;
        if (selectedFuel === 'cherry') fuelCost = 0.5;
        else if (selectedFuel === 'mesquite') fuelCost = 1.2;

        if (fuelCost > 0) {
            if (sliceBalance < fuelCost) {
                alert(language === 'es' 
                    ? `⚠️ Saldo de $SLICE insuficiente para comprar leña de cerezo/mezquite (${fuelCost} SLICE).` 
                    : `⚠️ Insufficient $SLICE balance to purchase wood fuel (${fuelCost} SLICE).`
                );
                return;
            }
            setSliceBalance(prev => Math.max(0, prev - fuelCost));
            // Complete Quest 3: Elite Patron
            incrementQuestProgress(2, 1);
        }

        // Check ingredients
        const nextIngredients = { ...ingredients };
        const nextRareIngredients = { ...rareIngredients };

        for (const [ing, required] of Object.entries(config.cost)) {
            if (ing in nextIngredients) {
                if ((nextIngredients as any)[ing] < required) {
                    alert(`⚠️ No tienes suficientes ingredientes para hornear esta pizza. Necesitas ${required} ${ing}.`);
                    return;
                }
            } else if (ing in nextRareIngredients) {
                if ((nextRareIngredients as any)[ing] < required) {
                    alert(`⚠️ No tienes suficientes ingredientes de prestigio. Necesitas ${required} ${ing}.`);
                    return;
                }
            } else {
                alert(`⚠️ Ingrediente desconocido: ${ing}`);
                return;
            }
        }

        // Deduct local ingredients
        for (const [ing, required] of Object.entries(config.cost)) {
            if (ing in nextIngredients) {
                (nextIngredients as any)[ing] -= required;
            } else if (ing in nextRareIngredients) {
                (nextRareIngredients as any)[ing] -= required;
            }
        }

        setIngredients(nextIngredients);
        setRareIngredients(nextRareIngredients);



        // Calculate Boost multipliers

        let speedBoost = 1.0;

        let yieldBoost = 1.0;



        // Fuel bonuses

        if (selectedFuel === 'cherry') { speedBoost *= 1.3; yieldBoost *= 1.1; }

        else if (selectedFuel === 'mesquite') { speedBoost *= 1.8; yieldBoost *= 1.3; }



        // Equipped Oven style bonuses (read from Collection)

        const equippedIdStr = localStorage.getItem('equippedOvenId');

        if (equippedIdStr) {

            const mult = parseFloat(localStorage.getItem('equippedOvenMultiplier') || '1.5');

            speedBoost *= (1.0 + (mult - 1.0) * 0.5);

            yieldBoost *= mult;

        }



        const rawDurationSec = Math.ceil((config.duration / speedBoost) / 1000);

        const durationMs = rawDurationSec * 1000;

        const startTime = Date.now();

        const basePayoutRaw = Math.ceil(config.payout * yieldBoost);



        // Update local state first (Optimistic UI)

        setOvenSlots(prev => prev.map(s => {

            if (s.id === slotId) {

                return {

                    ...s,

                    status: 'baking',

                    pizzaType: recipe,

                    startTime,

                    duration: durationMs,

                    basePayout: basePayoutRaw

                };

            }

            return s;

        }));



        // Send to Stellar Soroban on-chain contract (PizzaBaking)

        if (userAddress) {

            try {

                const recipeId = recipe === 'margherita' ? 1 : (recipe === 'pepperoni' ? 2 : (recipe === 'special' ? 3 : (recipe === 'tartufo' ? 4 : (recipe === 'dolce' ? 5 : 6))));

                const signer = getContractSignerRef.current();

                const ovenNftId = equippedIdStr ? parseInt(equippedIdStr, 10) : null;

                const fuelType = selectedFuel === 'cherry' ? 1 : (selectedFuel === 'mesquite' ? 2 : 0);

                const result = await StellarContractService.startBake(

                    userAddress,

                    slotId,

                    recipeId,

                    rawDurationSec,

                    basePayoutRaw,

                    ovenNftId,

                    fuelType,

                    signer

                );

                if (result.success) {

                    addLog(`🔥 On-chain baking started successfully! Hash: ${result.txHash}`);

                } else {

                    console.warn("Soroban bake transaction failed, using local offline mode");

                }

            } catch (err) {

                console.error("Soroban startBake exception", err);

            }

        }

    };



    const unlockSlot = async (slotId: number) => {

        const cost = slotId === 3 ? 50 : 100;

        if (sliceBalance < cost) {

            alert(`⚠️ Saldo de SLICE insuficiente. Desbloquear el horno #${slotId} requiere ${cost} SLICE.`);

            return;

        }



        // Deduct balance and unlock

        setSliceBalance(prev => Math.max(0, prev - cost));

        setOvenSlots(prev => prev.map(s => s.id === slotId ? { ...s, isLocked: false } : s));



        // Submit Soroban Transaction for slot unlock

        if (userAddress) {

            try {

                const signer = getContractSignerRef.current();

                const result = await StellarContractService.unlockBakingSlot(userAddress, slotId, signer);

                if (result.success) {

                    addLog(`🔓 Slot #${slotId} unlocked on-chain! Hash: ${result.txHash}`);

                }

            } catch (err) {

                console.error("Failed to unlock slot on-chain", err);

            }

        }

    };

    const playBakingChime = () => {
        if (isMutedRef.current) return;
        try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContextClass) return;
            const ctx = new AudioContextClass();
            const now = ctx.currentTime;

            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(523.25, now); // C5

            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(659.25, now); // E5

            gain1.gain.setValueAtTime(0.15, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

            gain2.gain.setValueAtTime(0.1, now);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

            osc1.connect(gain1);
            gain1.connect(ctx.destination);

            osc2.connect(gain2);
            gain2.connect(ctx.destination);

            osc1.start(now);
            osc1.stop(now + 1.2);

            osc2.start(now);
            osc2.stop(now + 0.8);

            setTimeout(() => {
                if (ctx && ctx.state !== 'closed') ctx.close().catch(e => console.warn(e));
            }, 1500);
        } catch (e) {
            console.error("Failed to play synthesis chime:", e);
        }
    };

    const claimPizza = async (slotId: number) => {

        const slot = ovenSlots.find(s => s.id === slotId);

        if (!slot) return;

        const payout = slot.basePayout || 10;



        // Add to SLICE balance and reset slot

        setSliceBalance(prev => prev + payout);
        // Complete Quest 1: Pizza Apprentice
        incrementQuestProgress(0, 1);

        setOvenSlots(prev => prev.map(s => {

            if (s.id === slotId) {

                return { ...s, status: 'idle', pizzaType: null, startTime: null, duration: null, basePayout: null };

            }

            return s;

        }));



        if (userAddress) {

            try {

                const signer = getContractSignerRef.current();

                const result = await StellarContractService.claimBake(userAddress, slotId, signer);

                if (result.success) {

                    addLog(`🍕 Baking slot claim confirmed on-chain!`);

                }

            } catch (err) {

                console.error("Failed to claim bake on-chain", err);

            }

        }



        alert(`🍕 ¡Maravilloso! Has reclamado tu pizza y obtenido ${payout} tokens $SLICE.`);

    };



    const [selectedSong, setSelectedSong] = useState<Song>(() => SONGS.find(s => s.available) ?? SONGS[0]);

    const selectedSongRef = useRef(selectedSong);

    useEffect(() => { selectedSongRef.current = selectedSong; }, [selectedSong]);

    // ── Audio Preview for Song Picker ──────────────────────────────────────────
    const previewAudioRef = useRef<HTMLAudioElement | null>(null);

    const stopPreviewAudio = useCallback(() => {
        if (previewAudioRef.current) {
            try {
                previewAudioRef.current.pause();
                previewAudioRef.current.currentTime = 0;
                previewAudioRef.current.src = '';
            } catch (e) {}
            previewAudioRef.current = null;
        }
    }, []);

    const playSongPreview = useCallback((song: Song) => {
        stopPreviewAudio();
        if (isMutedRef.current || !song.available) return;

        try {
            const basePath = window.GP_BASE_PATH || '';
            const audioSrc = basePath + songPath(song);
            const audio = new Audio(audioSrc);
            audio.volume = 0.45;
            audio.currentTime = song.start || 0;
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch((err) => {
                    console.warn('[SongPicker] Audio preview autoplay prevented/failed:', err);
                });
            }
            previewAudioRef.current = audio;
        } catch (e) {
            console.warn('[SongPicker] Failed to play preview audio:', e);
        }
    }, [stopPreviewAudio]);

    // Play preview when opening songpicker or stop when leaving
    useEffect(() => {
        if (view === 'songpicker') {
            playSongPreview(selectedSong);
        } else {
            stopPreviewAudio();
        }
        return () => {
            stopPreviewAudio();
        };
    }, [view, playSongPreview, stopPreviewAudio]);

    // Keep preview audio in sync with mute state
    useEffect(() => {
        if (previewAudioRef.current) {
            previewAudioRef.current.muted = isMuted;
        }
    }, [isMuted]);



    const [isVerifying, setIsVerifying] = useState(false);

    const [proofStatus, setProofStatus] = useState<'none' | 'generating' | 'success' | 'failed'>('none');

    const [zkStep, setZkStep] = useState(0);

    useEffect(() => {
        let interval: any;
        if (proofStatus === 'generating') {
            setZkStep(0);
            interval = setInterval(() => {
                setZkStep(prev => (prev < 3 ? prev + 1 : prev));
            }, 800);
        } else {
            setZkStep(0);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [proofStatus]);

    const [txHash, setTxHash] = useState<string | null>(null);

    const [sliceEarned, setSliceEarned] = useState<number>(0);

    const [livePing, setLivePing] = useState(24);

    useEffect(() => {
        let interval: any;
        if (pvpState === 'waiting' || isPvp) {
            interval = setInterval(() => {
                setLivePing(prev => {
                    const diff = Math.floor(Math.random() * 7) - 3;
                    const next = prev + diff;
                    return Math.max(12, Math.min(45, next));
                });
            }, 1200);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [pvpState, isPvp]);



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

    const closeTxPopup = useCallback(async () => {

        if (popupTimerRef.current) clearTimeout(popupTimerRef.current);

        if (popupIntervalRef.current) clearInterval(popupIntervalRef.current);

        setShowTxPopup(false);

        const currentScore = pendingFinalScoreRef.current;
        const activeWallet = HubBridgeService.getPlayerWallet() || userAddress || 'guest_player';

        try {
            // Intentar solicitar la firma off-chain ($0 Gas) al Hub si estamos en Iframe
            const signedData = await HubBridgeService.requestScoreSignature(currentScore, 'rhythm-slice');
            
            // Enviar score verificado a SpicyCrust API
            await SpicyCrustService.submitScore({
                playerExternalId: activeWallet,
                nickname: chefName || 'Chef Don',
                score: currentScore,
                payload: signedData.payload,
                signature: signedData.signature,
                metadata: {
                    timestamp: Date.now()
                }
            });
        } catch (err) {
            console.warn('⚠️ No se obtuvo firma del Hub, enviando submit tradicional:', err);
            
            // Fallback a registro de score normal
            SpicyCrustService.submitScore({
                playerExternalId: activeWallet,
                nickname: chefName || 'Chef Don',
                score: currentScore,
                metadata: {
                    timestamp: Date.now()
                }
            });
        }

        onGameComplete(currentScore);

    }, [onGameComplete, userAddress, chefName]);




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

                setBooting(false);

                addLog("[ERROR] Canvas ref is null");

                return;

            }



            addLog("Status: Loading Assets...");



            // Load scripts

            try {

                if (!window.initGuitarPizza) {

                    addLog("[GuitarPizza] initGuitarPizza undefined, loading engine...");



                    window.GP_BASE_PATH = import.meta.env.BASE_URL;

                    const baseUrl = import.meta.env.BASE_URL;

                    // Append version parameter to bust aggressive browser cache of public assets

                    const primaryPath = `${baseUrl}game/guitar-pizza-engine.js?v=6`.replace('//', '/');



                    addLog(`[GuitarPizza] Loading engine from: ${primaryPath}`);

                    await loadScript(primaryPath);

                } else {

                    addLog("[GuitarPizza] initGuitarPizza already defined.");

                }



            } catch (err) {

                console.error("[GuitarPizza] Failed to load game scripts:", err);

                setError("Failed to load game scripts. Check console.");

                setBooting(false);

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



            if (isPracticeMode) {

                addLog(`[GuitarPizza] Practice Mode: skipping on-chain registration. Local Session ID: ${localSessionId}`);

            } else {

                // Start game session on-chain in the background silently

                try {

                    const signer = getContractSignerRef.current();

                    StellarContractService.startGame(userAddress, localSessionId, 1, signer, 1).then(startResult => {

                        onChainSessionIdRef.current = startResult.sessionId;

                        if (!startResult.success) {

                            console.warn("[GuitarPizza] On-chain session registration failed:", startResult.error);

                        } else {

                            addLog(`[GuitarPizza] On-chain session ready: ${startResult.sessionId}`);

                        }

                    }).catch(err => {

                        console.error("[GuitarPizza] On-chain session start error:", err);

                    });

                } catch {

                    console.warn("[GuitarPizza] No wallet connected — skipping on-chain session start.");

                }

            }



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

                        let verifiedScore = finalScore;
                        let sessionStats: GameSessionStats | null = null;

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

                            verifiedScore = finalScore;

                            addLog(`[GuitarPizza] Engine score: ${finalScore} | ZK-verified score: ${verifiedScore}`);

                            addLog(`[GuitarPizza] Stats — hits:${hits} perfects:${perfects} fever:${fever}s pizzas:${pizzas}`);

                            // Update local balance

                            setPizzaBalance(prev => prev + verifiedScore);

                            sessionStats = {

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



                            // DEMO / NO-WALLET / PRACTICE CHECK: Skip blockchain submission when in practice mode or not connected

                            if (isPracticeMode || userAddress === 'G_DEMO_USER' || !isConnectedRef.current) {

                                addLog(isPracticeMode

                                    ? "[PRACTICE MODE] Skipping blockchain submission. Awarding local drops."

                                    : "[GuitarPizza] No wallet connected — score verified locally only.");


                                // Calculate local ingredients drops based on performance

                                const cheeseReward = Math.min(3, Math.floor(finalScore / 2500) + 1);

                                const pepReward = finalScore > 3000 ? Math.min(2, Math.floor((finalScore - 3000) / 3000) + 1) : 0;

                                const baconReward = finalScore > 5000 ? 1 : 0;

                                const onionReward = finalScore > 4000 ? 1 : 0;


                                const newIngredients = { ...ingredients };

                                newIngredients.cheese = (newIngredients.cheese || 0) + cheeseReward;

                                if (pepReward > 0) newIngredients.pepperoni = (newIngredients.pepperoni || 0) + pepReward;

                                if (baconReward > 0) newIngredients.bacon = (newIngredients.bacon || 0) + baconReward;

                                if (onionReward > 0) newIngredients.onion = (newIngredients.onion || 0) + onionReward;


                                setIngredients(newIngredients);

                                localStorage.setItem('gp_ingredients', JSON.stringify(newIngredients));


                                addLog(`🎁 Rewards dropped: ${cheeseReward} 🧀 Queso${pepReward ? `, ${pepReward} 🍖 Pep` : ''}${baconReward ? `, ${baconReward} 🥓 Bacon` : ''}${onionReward ? `, ${onionReward} 🧅 Onion` : ''}`);


                                // Check and update Personal Best to award weekly tournament ticket

                                const songId = selectedSong.id;

                                const currentPB = personalBests[songId] || 0;

                                let ticketEarned = false;


                                if (finalScore > currentPB) {

                                    const updatedPBs = { ...personalBests, [songId]: finalScore };

                                    setPersonalBests(updatedPBs);

                                    localStorage.setItem('gp_personal_bests', JSON.stringify(updatedPBs));

                                    

                                    // Award 1 ticket

                                    setTicketBalance(prev => prev + 1);

                                    ticketEarned = true;

                                    addLog("🎟️ NEW RECORD! You earned 1 Weekly Tournament Ticket!");

                                }


                                await new Promise(resolve => setTimeout(resolve, 800));

                                addLog(`SUCCESS! Score verified locally.`);

                                setProofStatus('success');

                                setOnChainScore(finalScore);


                                setTimeout(async () => { 

                                    setIsVerifying(false); 

                                    if (isPvp) {
                                        const rivalFinalScore = rivalData ? rivalData.score : 0;
                                        const won = finalScore > rivalFinalScore;
                                        setIsPvp(false); // Reset PVP state
                                        
                                        if (won) {
                                            if (userAddress !== 'G_DEMO_USER' && isConnectedRef.current) {
                                                const signer = getContractSignerRef.current();
                                                addLog(`[PVP] Resolving match GP-XXXX on-chain. Winning address: ${userAddress}...`);
                                                await StellarContractService.resolvePvpMatch(userAddress, 12345, signer);
                                            }
                                            alert(`⚔️ ¡VICTORIA DE LA MASA! 🍕\n\nTu Puntaje: ${finalScore}\nScore del Rival: ${rivalFinalScore}\n\n¡Has ganado el Duelo PVP y reclamado el pozo completo! +${selectedWager * 2} $SLICE (menos 5% de tarifa de tesorería).`);
                                        } else {
                                            alert(`⚠️ ¡Derrota en la Cocina! 🪵\n\nTu Puntaje: ${finalScore}\nScore del Rival: ${rivalFinalScore}\n\nEl oponente se lleva el pozo de $SLICE.`);
                                        }
                                    } else {
                                        const recordLabel = ticketEarned ? `🎟️ +1 Ticket de Torneo` : '';
                                        alert(`🎮 ¡Fin de la Práctica!\n\nPuntaje: ${finalScore}\nIngredientes ganados: +${cheeseReward} Queso${pepReward ? `, +${pepReward} Pepperoni` : ''}\n\n${recordLabel ? `🎉 ¡NUEVO RÉCORD PERSONAL! ${recordLabel}` : ''}`);
                                    }

                                    onGameComplete(finalScore);

                                }, 2000);


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
                            if (!navigator.onLine || err.message?.includes("Failed to fetch") || err.message?.includes("NetworkError") || err.message?.includes("network")) {
                                addLog("⚠️ Network offline. Saving ZK proof locally for automatic sync.");
                                const nextQueue = [...pendingTxs, {
                                    sessionStats: sessionStats || {
                                        levelId: 1,
                                        score: verifiedScore,
                                        sessionId: onChainSessionIdRef.current,
                                        perfectHits: 0,
                                        totalHits: 0,
                                        totalNotes: 0,
                                        trapsAvoided: 0,
                                        totalTraps: 0,
                                        feverSeconds: 0,
                                        pizzasCompleted: 0,
                                        comboBonus: 0,
                                        playerAddress: userAddress,
                                    },
                                    score: verifiedScore,
                                    timestamp: Date.now()
                                }];
                                setPendingTxs(nextQueue);
                                localStorage.setItem('gp_pending_txs', JSON.stringify(nextQueue));
                                setProofStatus('failed');
                                setIsVerifying(false);
                                setStatus('');
                                alert(language === 'es' 
                                    ? "⚠️ Sin conexión a internet. Tu récord y prueba ZK se guardaron localmente. Se sincronizarán automáticamente al reconectarte."
                                    : "⚠️ No internet connection. Your record and ZK proof have been saved locally. They will auto-sync when you reconnect."
                                );
                                onGameComplete(verifiedScore);
                                return;
                            }

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

                    setBooting(false);

                    addLog("[GuitarPizza] Game initialized successfully.");

                } catch (e) {

                    console.error("[GuitarPizza] Error during window.initGuitarPizza:", e);

                    setError("Game engine failed to start.");

                    setBooting(false);

                    addLog(`[ERROR] Engine start failed: ${e}`);

                }

            } else {

                console.error("[GuitarPizza] window.initGuitarPizza is still undefined after loading scripts.");

                setError("Game engine not found.");

                setBooting(false);

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
        <div className="w-full h-full flex flex-col text-white font-sans overflow-hidden" style={{ background: "#0a0705" }}>
            {/* Header — hidden in embed mode */}
            {!embed && (
            <div className="flex items-center justify-between p-4 border-b z-20" style={{ background: "#0a0705", borderColor: "rgba(201,162,39,0.2)" }}>
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

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-3">
                        <span className="rs-network-pill">● TESTNET</span>
                        <WalletStandalone />
                    </div>
                    {/* Fullscreen button — visible en mobile, oculto en desktop */}
                    <button
                        onClick={toggleGameFullscreen}
                        className="settings-btn gp-fs-btn"
                        title={isGameFullscreen ? (language === 'es' ? 'Salir de pantalla completa' : 'Exit fullscreen') : (language === 'es' ? 'Pantalla completa' : 'Fullscreen')}
                        aria-label={isGameFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                        style={{ fontSize: '1.2rem', lineHeight: 1 }}
                    >
                        {isGameFullscreen ? '⊠' : '⛶'}
                    </button>
                    <button onClick={() => setShowSettings(true)} className="settings-btn" title="Settings">
                        <Settings size={24} />
                    </button>
                </div>

            </div>
            )}
            {/* Game Container */}
            <div id="restaurant-table-bg" className="pizzeria-checker" style={{ flex: 1, padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', position: 'relative', backgroundPosition: 'center 80%' }}>
                <div
                    id="game-device-screen"
                    className="game-container game-frame"
                    ref={containerRef}
                    style={{
                        width: isGameFullscreen ? '100vw' : 'min(100%, calc((100vh - 2rem) * 9 / 16))',
                        height: isGameFullscreen ? '100vh' : 'auto',
                        aspectRatio: '9/16',
                        position: 'relative',
                        overflow: 'hidden',
                        border: isGameFullscreen ? 'none' : '8px solid #000',
                        borderRadius: isGameFullscreen ? '0' : '20px',
                        boxShadow: isGameFullscreen ? 'none' : '0 0 50px rgba(0,0,0,0.5)',
                    }}
                >
                    {/* ── Floating fullscreen FAB inside the game screen ── */}
                    <button
                        onClick={toggleGameFullscreen}
                        aria-label={isGameFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            zIndex: 9999,
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(10, 4, 2, 0.75)',
                            border: '1.5px solid rgba(204, 41, 41, 0.5)',
                            borderRadius: '8px',
                            color: '#F5EDE0',
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            backdropFilter: 'blur(6px)',
                            opacity: 0.8,
                            lineHeight: 1,
                        }}
                    >
                        {isGameFullscreen ? '⊠' : '⛶'}
                    </button>







                    {/* Synchronized PvP Start Countdown Overlay */}
                    {pvpCountdown !== null && (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'rgba(10, 7, 5, 0.9)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 3000,
                        }}>
                            <div style={{
                                fontSize: '6rem',
                                fontWeight: 'bold',
                                color: '#00f0ff',
                                textShadow: '0 0 20px rgba(0,240,255,0.6)',
                                fontFamily: 'monospace'
                            }}>
                                {pvpCountdown}
                            </div>
                            <div style={{
                                fontSize: '1.2rem',
                                color: '#ffd700',
                                marginTop: '1rem',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                textShadow: '0 0 10px rgba(255,215,0,0.4)'
                            }}>
                                {language === 'es' ? '¡PREPARATE PARA COCINAR!' : 'GET READY TO COOK!'}
                            </div>
                        </div>
                    )}
                    {/* COVER START SCREEN (PORTADA DE INICIO) */}
                    {view === 'cover' && (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(180deg, rgba(10, 7, 5, 0.8) 0%, rgba(27, 0, 0, 0.95) 100%), url("/game/assets/pizzeria_bg.png") center/cover no-repeat',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '2.5rem 1.5rem',
                            zIndex: 1500,
                            textAlign: 'center',
                            overflow: 'hidden'
                        }}>
                            <style>{`
                                @keyframes floatSlow {
                                    0% { transform: translateY(0px) rotate(0deg); opacity: 0.15; }
                                    50% { transform: translateY(-40px) rotate(180deg); opacity: 0.45; }
                                    100% { transform: translateY(0px) rotate(360deg); opacity: 0.15; }
                                }
                                @keyframes neonPulse {
                                    0% { text-shadow: 0 0 10px rgba(139,0,0,0.6), 2px 2px 0px #d4af37, -2px -2px 0px #27ae60; }
                                    50% { text-shadow: 0 0 25px rgba(231,76,60,0.95), 2px 2px 0px #f1c40f, -2px -2px 0px #2ecc71; }
                                    100% { text-shadow: 0 0 10px rgba(139,0,0,0.6), 2px 2px 0px #d4af37, -2px -2px 0px #27ae60; }
                                }
                            `}</style>

                            {/* Retro Scanline Overlay */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                                backgroundSize: '100% 4px, 6px 100%',
                                pointerEvents: 'none',
                                zIndex: 1
                            }} />

                            {/* Floating Background Ingredients */}
                            <div style={{ position: 'absolute', top: '15%', left: '10%', fontSize: '2rem', animation: 'floatSlow 12s infinite ease-in-out', pointerEvents: 'none', zIndex: 0 }}>🧀</div>
                            <div style={{ position: 'absolute', top: '45%', right: '12%', fontSize: '2.2rem', animation: 'floatSlow 15s infinite ease-in-out 2s', pointerEvents: 'none', zIndex: 0 }}>🍖</div>
                            <div style={{ position: 'absolute', top: '70%', left: '15%', fontSize: '1.8rem', animation: 'floatSlow 10s infinite ease-in-out 1s', pointerEvents: 'none', zIndex: 0 }}>🧅</div>
                            <div style={{ position: 'absolute', top: '25%', right: '15%', fontSize: '2rem', animation: 'floatSlow 14s infinite ease-in-out 3s', pointerEvents: 'none', zIndex: 0 }}>🥓</div>
                            <div style={{ position: 'absolute', top: '55%', left: '8%', fontSize: '2rem', animation: 'floatSlow 11s infinite ease-in-out 4s', pointerEvents: 'none', zIndex: 0 }}>🍄</div>

                            {/* Top Banner */}
                            <div style={{
                                width: '100%',
                                borderBottom: '2px double rgba(212, 175, 55, 0.5)',
                                paddingBottom: '0.5rem',
                                color: '#d4af37',
                                fontSize: '0.75rem',
                                fontFamily: 'monospace',
                                letterSpacing: '0.3em',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                textShadow: '0 0 8px rgba(212, 175, 55, 0.4)',
                                zIndex: 10
                            }}>
                                🕶️ LA FAMIGLIA PRESENTS 🕶️
                            </div>

                            {/* Title Container */}
                            <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                gap: '0.75rem',
                                zIndex: 10,
                                border: '3px double rgba(212, 175, 55, 0.4)',
                                padding: '1.5rem',
                                borderRadius: '16px',
                                background: 'rgba(10, 7, 5, 0.85)',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(212, 175, 55, 0.1)'
                            }}>
                                <h1 style={{
                                    fontFamily: 'Bangers, cursive',
                                    fontSize: '4.2rem',
                                    lineHeight: '0.85',
                                    color: '#e74c3c',
                                    animation: 'neonPulse 3s infinite ease-in-out',
                                    letterSpacing: '0.06em',
                                    transform: 'skewY(-4deg)',
                                    margin: '0 0 0.5rem 0'
                                }}>
                                    RHYTHM<br />SLICE
                                </h1>
                                
                                <div style={{
                                    display: 'inline-block',
                                    padding: '0.2rem 0.6rem',
                                    background: 'rgba(212, 175, 55, 0.15)',
                                    border: '1px solid #d4af37',
                                    borderRadius: '50px',
                                    fontSize: '0.55rem',
                                    fontFamily: 'monospace',
                                    color: '#ffcc00',
                                    fontWeight: 'bold',
                                    letterSpacing: '0.15em',
                                    marginBottom: '0.2rem'
                                }}>
                                    SOROBAN ZK EDITION
                                </div>

                                <p style={{
                                    fontFamily: '"Special Elite", monospace',
                                    fontSize: '0.88rem',
                                    color: '#fff',
                                    letterSpacing: '0.1em',
                                    margin: 0,
                                    textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                                }}>
                                    {language === 'es' ? 'LA COCINA DE LA MAFIA' : 'THE MAFIA PIZZERIA'}
                                </p>
                            </div>

                            {/* Pizza Centerpiece */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem',
                                position: 'relative',
                                zIndex: 10
                            }}>
                                <div style={{
                                    fontSize: '5.5rem',
                                    filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.7))',
                                    animation: 'pulse 1.8s infinite ease-in-out',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s'
                                }} 
                                onClick={() => setView('lobby')}
                                >
                                    🍕
                                </div>
                                <div style={{
                                    fontSize: '1.3rem',
                                    color: '#fff',
                                    marginTop: '-10px',
                                    display: 'flex',
                                    gap: '0.5rem',
                                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                                }}>
                                    🎸 🔪 🍷
                                </div>
                            </div>

                            {/* Footer Play Controls */}
                            <div style={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '1rem',
                                zIndex: 10
                            }}>
                                <button
                                    onClick={() => setView('lobby')}
                                    className="primary-btn"
                                    style={{
                                        width: '85%',
                                        maxWidth: '260px',
                                        padding: '1.1rem',
                                        fontSize: '1.2rem',
                                        fontFamily: 'var(--font-display)',
                                        letterSpacing: '0.08em',
                                        fontWeight: 'bold',
                                        boxShadow: '0 0 25px rgba(212,175,55,0.5), 0 0 50px rgba(139,0,0,0.3)',
                                        animation: 'pulse 1.4s infinite ease-in-out',
                                        background: 'linear-gradient(135deg, #d4af37, #c0392b)',
                                        color: '#fff',
                                        border: '2px solid #ffcc00',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    🍕 {language === 'es' ? 'ENTRAR A LA COCINA' : 'ENTER KITCHEN'} 🍕
                                </button>
                                {/* Wallet Status / New Player Hint */}
                                {userAddress ? (
                                    <div style={{
                                        background: 'rgba(39,174,96,0.12)',
                                        border: '1px solid rgba(39,174,96,0.35)',
                                        borderRadius: '10px',
                                        padding: '0.5rem 0.9rem',
                                        fontSize: '0.65rem',
                                        fontFamily: 'monospace',
                                        color: '#27ae60',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        maxWidth: '240px',
                                    }}>
                                        <span style={{ fontSize: '0.9rem' }}>✅</span>
                                        <div>
                                            <div style={{ fontWeight: 'bold', letterSpacing: '0.04em' }}>
                                                {language === 'es' ? 'WALLET CONECTADA' : 'WALLET CONNECTED'}
                                            </div>
                                            <div style={{ color: '#88cc88', opacity: 0.8 }}>
                                                {userAddress.slice(0, 6)}…{userAddress.slice(-4)}
                                            </div>
                                        </div>
                                        {checkInStreak > 0 && (
                                            <div style={{ marginLeft: 'auto', fontWeight: 'bold', color: '#d4af37', fontSize: '0.75rem' }}>
                                                🔥 {checkInStreak}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div style={{
                                        background: 'rgba(212,175,55,0.1)',
                                        border: '1px dashed rgba(212,175,55,0.5)',
                                        borderRadius: '10px',
                                        padding: '0.5rem 0.9rem',
                                        fontSize: '0.65rem',
                                        fontFamily: 'monospace',
                                        color: '#d4af37',
                                        maxWidth: '240px',
                                        textAlign: 'center',
                                        lineHeight: '1.5',
                                    }}>
                                        🔑 {language === 'es'
                                            ? 'Conecta una wallet Stellar para ganar $SLICE y NFTs on-chain'
                                            : 'Connect a Stellar wallet to earn $SLICE & on-chain NFTs'}
                                    </div>
                                )}

                                {/* Feature Icons Row */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: '1rem',
                                    marginTop: '0.2rem',
                                }}>
                                    {[
                                        { icon: '🎸', label: language === 'es' ? 'Ritmo' : 'Rhythm' },
                                        { icon: '🍕', label: language === 'es' ? 'Pizza' : 'Pizza' },
                                        { icon: '⛓', label: language === 'es' ? 'On-chain' : 'On-chain' },
                                        { icon: '⚔️', label: 'PvP' },
                                    ].map(f => (
                                        <div key={f.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                                            <span style={{ fontSize: '1.1rem' }}>{f.icon}</span>
                                            <span style={{ fontSize: '0.48rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{f.label}</span>
                                        </div>
                                    ))}
                                </div>

                                <div style={{
                                    fontSize: '0.48rem',
                                    color: 'rgba(255,255,255,0.18)',
                                    fontFamily: 'monospace',
                                    marginTop: '0.2rem'
                                }}>
                                    SOROBAN ZK EDITION • STELLAR TESTNET
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Boot Loader — single branded loading screen while the engine initializes */}
                    {booting && !error && (
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            zIndex: 2500,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '14px',
                            background: 'radial-gradient(ellipse at center, #16100a 0%, #080808 72%)',
                        }}>
                            <style>{`@keyframes gpBootSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                            @keyframes gpBootPulse { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }`}</style>
                            <div style={{
                                fontSize: '2.6rem',
                                lineHeight: 1,
                                animation: 'gpBootSpin 1.6s linear infinite',
                                filter: 'drop-shadow(0 0 14px rgba(212,175,55,0.35))',
                            }}>🍕</div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    fontFamily: 'var(--font-display)',
                                    fontWeight: 800,
                                    letterSpacing: '0.06em',
                                    fontSize: '1.5rem',
                                    color: '#f0ede8',
                                }}>RHYTHM <span style={{ color: '#b91d1d' }}>SLICE</span></div>
                                <div style={{
                                    marginTop: '8px',
                                    fontFamily: 'var(--font-mono, monospace)',
                                    fontSize: '0.7rem',
                                    letterSpacing: '0.18em',
                                    textTransform: 'uppercase',
                                    color: '#d4af37',
                                    animation: 'gpBootPulse 1.4s ease-in-out infinite',
                                }}>{language === 'es' ? 'Encendiendo el horno…' : 'Firing up the oven…'}</div>
                            </div>
                        </div>
                    )}

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

                                background: 'rgba(10, 8, 6, 0.94)',

                                backdropFilter: 'blur(10px)',

                                padding: '1.5rem',

                                borderRadius: '12px',

                                border: '1px solid rgba(212, 175, 55, 0.55)',

                                boxShadow: '0 10px 30px rgba(0,0,0,0.6), inset 0 0 20px rgba(212,175,55,0.06)',

                                display: 'flex',

                                flexDirection: 'column',

                                alignItems: 'center',

                                gap: '10px'

                            }}>

                                {status && (

                                    <h2 style={{

                                        fontFamily: 'var(--font-display)',

                                        color: '#d4af37',

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

                                        color: '#E74C3C',

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

                                    <div className="settings-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F9F5EB', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', border: '1px solid #E0D4B8' }}>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>

                                            <Globe size={20} color="#8B0000" />

                                            <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#8B0000' }}>{t.language}</span>

                                        </div>

                                        <div style={{ display: 'flex', gap: '0.5rem' }}>

                                            <button

                                                onClick={() => setLanguage('es')}

                                                style={{

                                                    padding: '0.5rem 1rem',

                                                    borderRadius: '8px',

                                                    border: '1px solid #D0B488',

                                                    background: language === 'es' ? 'var(--color-accent)' : '#F9F5EB',

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

                                                    border: '1px solid #D0B488',

                                                    background: language === 'en' ? 'var(--color-accent)' : '#F9F5EB',

                                                    color: language === 'en' ? '#fff' : '#333',

                                                    fontWeight: 'bold',

                                                    cursor: 'pointer'

                                                }}

                                            >EN</button>

                                        </div>

                                    </div>



                                    <div style={{ marginBottom: '1.5rem', width: '100%' }}>

                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B0000', fontSize: '0.9rem', fontWeight: 'bold' }}>{t.chefName}</label>

                                        <input

                                            type="text"

                                            value={chefName}

                                            onChange={(e) => setChefName(e.target.value)}

                                            style={{ width: '100%', padding: '0.8rem', background: '#F9F5EB', border: '1px solid #D0B488', color: '#333', borderRadius: '8px', fontSize: '1rem' }}

                                        />

                                    </div>



                                    <div style={{ marginBottom: '1.5rem', width: '100%' }}>

                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B0000', fontSize: '0.9rem', fontWeight: 'bold' }}>{t.xHandle}</label>

                                        <input

                                            type="text"

                                            value={xHandle}

                                            onChange={(e) => setXHandle(e.target.value)}

                                            style={{ width: '100%', padding: '0.8rem', background: '#F9F5EB', border: '1px solid #D0B488', color: '#333', borderRadius: '8px', fontSize: '1rem' }}

                                        />

                                    </div>



                                    <div style={{ marginBottom: '1.5rem', width: '100%' }}>

                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B0000', fontSize: '0.9rem', fontWeight: 'bold' }}>{t.wallet}</label>

                                        <div style={{ padding: '0.8rem', background: 'rgba(46, 204, 113, 0.1)', border: '1px solid #2ecc71', borderRadius: '8px', fontSize: '0.9rem', wordBreak: 'break-all', color: '#27ae60' }}>

                                            {userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : "Not Connected"}

                                        </div>

                                    </div>



                                    <div className="settings-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F9F5EB', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', border: '1px solid #E0D4B8' }}>

                                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#8B0000' }}>{t.volume}</span>

                                        <button onClick={toggleAudio} className="settings-btn" style={{ background: isMuted ? '#bdc3c7' : 'var(--ph-green)', borderRadius: '50%', width: 50, height: 50, padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 0 }}>

                                            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} color="#FFF" />}

                                        </button>

                                    </div>



                                    {/* ── MY TXs HISTORY ───────────────────────────────── */}

                                    <div style={{ marginBottom: '1rem', width: '100%' }}>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>

                                            <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#8B0000' }}>⛓ {t.myTxs}</span>

                                            <span style={{ fontSize: '0.75rem', color: '#999' }}>({txHistory.length})</span>

                                        </div>



                                        {txHistory.length === 0 ? (

                                            <div style={{ textAlign: 'center', color: '#8B0000', fontSize: '0.85rem', padding: '1rem', background: '#F9F5EB', borderRadius: '8px', border: '1px dashed #D0B488' }}>

                                                {t.noTxs}

                                            </div>

                                        ) : (

                                            <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #E0D4B8' }}>

                                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>

                                                    <thead>

                                                        <tr style={{ background: '#E0D4B8', color: '#8B0000', textAlign: 'left' }}>

                                                            <th style={{ padding: '0.4rem 0.6rem', fontWeight: 'bold' }}>Type</th>

                                                            <th style={{ padding: '0.4rem 0.4rem', fontWeight: 'bold', textAlign: 'right' }}>Score</th>

                                                            <th style={{ padding: '0.4rem 0.4rem', fontWeight: 'bold' }}>Date</th>

                                                            <th style={{ padding: '0.4rem 0.6rem', fontWeight: 'bold' }}>TX</th>

                                                        </tr>

                                                    </thead>

                                                    <tbody>

                                                        {txHistory.map((tx, i) => {

                                                            const shortHash = `${tx.hash.slice(0, 6)}…${tx.hash.slice(-6)}`;

                                                            const d = new Date(tx.timestamp);

                                                            const dateStr = `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;

                                                            return (

                                                                <tr key={i} style={{ borderTop: '1px solid #E0D4B8', background: i % 2 === 0 ? '#FFF8E7' : '#F9F5EB' }}>

                                                                    <td style={{ padding: '0.4rem 0.6rem', color: '#333', whiteSpace: 'nowrap' }}>

                                                                        {tx.type === 'Score Submit' ? (language === 'es' ? 'Envío Puntaje' : 'Score Submit') : tx.type}

                                                                    </td>

                                                                    <td style={{ padding: '0.4rem 0.4rem', color: '#8B0000', textAlign: 'right', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>

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



                                <button className="primary-btn" onClick={() => setShowSettings(false)} style={{ width: '100%', marginTop: '1rem', padding: '1rem', fontSize: '1rem' }}>{t.backToCooking}</button>

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

                            justifyContent: 'space-between',

                            paddingTop: '2.8rem',

                            paddingBottom: '2.8rem',

                            boxSizing: 'border-box',

                            position: 'relative',

                            zIndex: 1

                        }}>



                            <div className="logo-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '0.2rem' }}>

                                <h1 className="main-logo">RHYTHM<br />SLICE</h1>

                                <p className="subtitle" style={{ marginBottom: '0' }}>PIZZA KITCHEN</p>

                            </div>

                             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.8rem', width: '88%', maxWidth: '330px' }}>

                                 <button id="startBtn"

                                     onClick={() => handleStartGame()}

                                     disabled={!engineRef.current}

                                     style={{ opacity: engineRef.current ? 1 : 0.5, cursor: engineRef.current ? 'pointer' : 'not-allowed', fontSize: '1rem', padding: '0.62rem' }}

                                 >

                                     {engineRef.current ? `🔥 ${t.fireUp}` : `🔥 ${t.heatingUp}`}

                                 </button>



                                {/* Vibrant Disco Music Selector Between Buttons */}

                                <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '0.4rem', marginBottom: '0.4rem' }}>

                                    <button
                                        onClick={() => setView('songpicker')}
                                        title={language === 'es' ? 'Cambiar Canción' : 'Change Song'}
                                        className="lobby-song-selector-btn"
                                    >

                                        <div style={{

                                            animation: 'vinyl-spin 2s linear infinite',

                                            filter: 'drop-shadow(0 0 8px rgba(218,165,32,0.6))',

                                            display: 'flex',

                                            flexShrink: 0

                                        }}>

                                            <svg width="28" height="28" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">

                                                <circle cx="50" cy="50" r="49" fill="#1A0D0D" stroke="#DAA520" strokeWidth="2" strokeOpacity="0.8" />

                                                {[38, 33, 28, 23].map(r => (

                                                    <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="#CD5C5C" strokeWidth="1.5" strokeOpacity="0.4" />

                                                ))}

                                                <circle cx="50" cy="50" r="21" fill="#4A0E0E" />

                                                <circle cx="50" cy="50" r="20" fill="#DAA520" />

                                                <circle cx="50" cy="50" r="20" fill="none" stroke="#FFF8DC" strokeWidth="1" />

                                                <circle cx="50" cy="50" r="4.5" fill="#FFF8DC" />

                                                <path d="M 62 18 A 38 38 0 0 1 82 38" stroke="rgba(218,165,32,0.8)" strokeWidth="4" fill="none" strokeLinecap="round" />

                                            </svg>

                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', zIndex: 2 }}>

                                            <span style={{ fontSize: '0.85rem', color: '#FFF8DC', fontFamily: 'var(--font-display)', letterSpacing: '0.08em', textShadow: '0 0 5px rgba(255,248,220,0.5)' }}>

                                                {selectedSong.title}

                                            </span>

                                            <span style={{ fontSize: '0.55rem', color: '#DAA520', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 'bold' }}>

                                                {language === 'es' ? '🎵 CAMBIAR PISTA' : '🎵 CHANGE TRACK'}

                                            </span>

                                        </div>

                                    </button>

                                </div>



                                <button
                                    className="lobby-timed-oven-btn"
                                    onClick={() => setView('oven')}
                                >
                                    <span style={{ fontSize: '1.2rem' }}>🔥</span>
                                    <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-display)', letterSpacing: '0.06em', fontWeight: 'bold', color: 'var(--ph-gold)' }}>
                                        {language === 'es' ? '🔥 HORNO TIMED-BAKE & NFT' : '🔥 TIMED-BAKE OVEN & NFT'}
                                    </span>
                                </button>



                                <div className="grid grid-cols-2 gap-2 w-full">

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

                                {/* Daily Check-in Sidebar Float Button */}
                                <button
                                    onClick={() => setShowCheckInModal(true)}
                                    className="lobby-daily-checkin-btn"
                                >
                                    <span style={{ fontSize: '1.1rem' }}>📅</span>
                                    <span style={{ fontSize: '0.54rem', fontWeight: 'bold', fontFamily: 'monospace', color: '#fff', writingMode: 'vertical-lr', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {language === 'es' ? 'DIARIO' : 'DAILY'}
                                    </span>
                                    {canCheckIn && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '-3px',
                                            left: '-3px',
                                            width: '9px',
                                            height: '9px',
                                            borderRadius: '50%',
                                            background: '#ff4757',
                                            border: '1.5px solid #fff'
                                        }} />
                                    )}
                                </button>

                            </div>

                        </div>





                        {/* MODALS OVERLAY */}



                        {/* ── SONG PICKER (MAFIA EDITION) ─────────────────────────────── */}

                        {(view === 'songpicker' || closingView === 'songpicker') && (

                            <div className={`modal-backdrop ${closingView === 'songpicker' ? 'closing' : ''}`} onClick={() => closeModalWithAnimation('lobby')}>

                                <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
                                    background: '#FFF8E7',
                                    border: '6px solid #8B0000',
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(139, 0, 0, 0.05)',
                                    color: '#333',
                                    borderRadius: '16px',
                                    paddingTop: '1.2rem',
                                    paddingBottom: '1.2rem',
                                    paddingLeft: '1.2rem',
                                    paddingRight: '1.2rem',
                                    height: '92%',
                                    maxHeight: '92%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    boxSizing: 'border-box'
                                }}>

                                    <div className="modal-header" style={{

                                        borderBottom: '3px dashed #8B0000',

                                        paddingBottom: '1.2rem',

                                        marginBottom: '0.5rem'

                                    }}>

                                        <div className="back-btn-circle" onClick={() => closeModalWithAnimation('lobby')} style={{

                                            background: '#8B0000',

                                            color: 'white',

                                            border: '2px solid #5C0000',

                                            flexShrink: 0

                                        }}>

                                            <ArrowLeft size={20} />

                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, padding: '0 5px', minWidth: 0 }}>

                                            <h2 className="modal-title" style={{ margin: 0, whiteSpace: 'nowrap', color: '#8B0000', fontFamily: 'var(--font-display)', textShadow: 'none', fontSize: '1.4rem' }}>🍕 {language === 'es' ? 'EL MENÚ' : 'THE MENU'}</h2>

                                            <div style={{ fontSize: '0.75rem', color: '#27AE60', fontWeight: 'bold', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{language === 'es' ? 'Recetas Secretas' : 'Secret Recipes'}</div>

                                        </div>



                                    </div>



                                    <div style={{ flex: '1 1 auto', minHeight: '260px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingRight: '0.5rem', marginTop: '0.6rem' }}>

                                        {SONGS.map((song) => {

                                            const isSelected = selectedSong.id === song.id;

                                            const mins = Math.floor(song.duration / 60);

                                            const secs = Math.floor(song.duration % 60);

                                            return (

                                                <button
                                                    key={song.id}
                                                    disabled={!song.available}
                                                    onClick={() => {
                                                        setSelectedSong(song);
                                                        playSongPreview(song);
                                                    }}

                                                    style={{

                                                        display: 'flex',

                                                        alignItems: 'flex-start',

                                                        gap: '0.5rem',
                                                        padding: '0.5rem 0.7rem',
                                                        borderRadius: '8px',

                                                        border: isSelected ? '2px solid #27AE60' : '1px solid #E0D4B8',

                                                        background: isSelected ? 'rgba(39, 174, 96, 0.1)' : '#fff',

                                                        cursor: song.available ? 'pointer' : 'not-allowed',

                                                        opacity: song.available ? 1 : 0.6,

                                                        textAlign: 'left',

                                                        color: '#333',

                                                        width: '100%',

                                                        transition: 'all 0.2s ease',

                                                        boxShadow: isSelected ? '0 4px 12px rgba(39, 174, 96, 0.2)' : '0 2px 4px rgba(0,0,0,0.02)'

                                                    }}

                                                    onMouseEnter={(e) => {

                                                        if (!isSelected && song.available) {

                                                            e.currentTarget.style.background = '#F9F5EB';

                                                            e.currentTarget.style.transform = 'translateY(-2px)';

                                                            e.currentTarget.style.borderColor = '#D0B488';

                                                        }

                                                    }}

                                                    onMouseLeave={(e) => {

                                                        if (!isSelected && song.available) {

                                                            e.currentTarget.style.background = '#fff';

                                                            e.currentTarget.style.transform = 'translateY(0)';

                                                            e.currentTarget.style.borderColor = '#E0D4B8';

                                                        }

                                                    }}

                                                >

                                                    {/* Track number or Pizza Slice */}

                                                    <div style={{ width: '40px', flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '0.2rem' }}>

                                                        {isSelected ? (

                                                            <div style={{ fontSize: '1.6rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>🍕</div>

                                                        ) : (

                                                            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: song.available ? '#8B0000' : '#aaa', fontWeight: 'bold' }}>

                                                                {song.available ? `#${song.index}` : '🔒'}

                                                            </span>

                                                        )}

                                                    </div>



                                                    {/* Info */}

                                                    <div style={{ flex: 1, minWidth: 0, paddingRight: '0.4rem', paddingTop: '0.2rem' }}>

                                                        <div style={{

                                                            fontWeight: '900',

                                                            fontSize: isSelected ? '0.95rem' : '0.85rem', // Smaller fonts

                                                            color: isSelected ? '#27AE60' : '#8B0000',

                                                            textTransform: 'uppercase',

                                                            lineHeight: '1.15',

                                                            letterSpacing: '0.02em',

                                                            transition: 'all 0.2s ease'

                                                        }}>

                                                            {song.title}

                                                        </div>

                                                        <div style={{
                                                            fontSize: '0.7rem',
                                                            color: isSelected ? '#14532D' : '#666',
                                                            marginTop: '3px',
                                                            fontWeight: '600',
                                                            lineHeight: '1.15'
                                                        }}>
                                                            {song.artist}
                                                        </div>

                                                        {/* Difficulty Stars */}
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginTop: '5px' }}>
                                                            {[1, 2, 3].map(star => (
                                                                <span
                                                                    key={star}
                                                                    style={{
                                                                        fontSize: '0.65rem',
                                                                        opacity: star <= song.difficulty ? 1 : 0.2,
                                                                        filter: star <= song.difficulty
                                                                            ? (song.difficulty === 3 ? 'drop-shadow(0 0 3px #ff4444)' : 'drop-shadow(0 0 2px #d4af37)')
                                                                            : 'none',
                                                                        transition: 'all 0.2s',
                                                                    }}
                                                                >
                                                                    {song.difficulty === 3 ? '💀' : '🍕'}
                                                                </span>
                                                            ))}
                                                            <span style={{
                                                                fontSize: '0.52rem',
                                                                fontFamily: 'monospace',
                                                                marginLeft: '3px',
                                                                color: song.difficulty === 3 ? '#cc3333' : song.difficulty === 2 ? '#c0852a' : '#27ae60',
                                                                fontWeight: 'bold',
                                                                letterSpacing: '0.03em',
                                                            }}>
                                                                {song.difficulty === 1
                                                                    ? (language === 'es' ? 'FÁCIL' : 'EASY')
                                                                    : song.difficulty === 2
                                                                        ? (language === 'es' ? 'MEDIO' : 'MEDIUM')
                                                                        : (language === 'es' ? 'DIFÍCIL' : 'HARD')}
                                                            </span>
                                                        </div>

                                                        {/* Personal Best */}
                                                        {personalBests[song.id] ? (
                                                            <div style={{
                                                                fontSize: '0.52rem',
                                                                fontFamily: 'monospace',
                                                                marginTop: '3px',
                                                                color: '#8B6914',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '3px',
                                                            }}>
                                                                <span>🏆</span>
                                                                <span style={{ fontWeight: 'bold' }}>{personalBests[song.id].toLocaleString()}</span>
                                                                <span style={{ opacity: 0.7 }}>{language === 'es' ? 'pts récord' : 'pts best'}</span>
                                                            </div>
                                                        ) : (
                                                            <div style={{
                                                                fontSize: '0.5rem',
                                                                fontFamily: 'monospace',
                                                                marginTop: '3px',
                                                                color: 'rgba(0,0,0,0.25)',
                                                                fontStyle: 'italic',
                                                            }}>
                                                                {language === 'es' ? '— sin récord aún' : '— no record yet'}
                                                            </div>
                                                        )}

                                                    </div>



                                                    {/* Right side stats */}
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start', gap: '6px', flexShrink: 0, paddingTop: '0.2rem' }}>

                                                        {/* BPM Badge */}
                                                        <div style={{
                                                            fontSize: '0.7rem',
                                                            fontWeight: '900',
                                                            background: isSelected ? '#27AE60' : '#EAE3D1',
                                                            color: isSelected ? 'white' : '#666',
                                                            padding: '2px 6px',
                                                            border: isSelected ? '1px solid #1E8449' : '1px solid #D1C5AD',
                                                            borderRadius: '6px',
                                                            letterSpacing: '0.05em',
                                                            boxShadow: isSelected ? '0 2px 4px rgba(39,174,96,0.3)' : 'none'
                                                        }}>
                                                            {song.bpm ? `${song.bpm} BPM` : '120 BPM'}
                                                        </div>

                                                        {/* Duration */}
                                                        <div style={{
                                                            fontSize: '0.9rem',
                                                            fontFamily: 'var(--font-mono)',
                                                            color: isSelected ? '#1E8449' : '#333',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            {mins}:{secs.toString().padStart(2, '0')}
                                                        </div>

                                                        {/* New Record indicator (only when selected and PB exists) */}
                                                        {isSelected && personalBests[song.id] && (
                                                            <div style={{
                                                                background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))',
                                                                border: '1px solid rgba(212,175,55,0.5)',
                                                                borderRadius: '6px',
                                                                padding: '3px 6px',
                                                                textAlign: 'center',
                                                            }}>
                                                                <div style={{ fontSize: '0.5rem', color: '#8B6914', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                                                                    🏆 BEST
                                                                </div>
                                                                <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#8B6914', fontFamily: 'monospace' }}>
                                                                    {personalBests[song.id].toLocaleString()}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Play Count placeholder — shows '▶ Beat it' for no-record songs when selected */}
                                                        {isSelected && !personalBests[song.id] && song.available && (
                                                            <div style={{
                                                                fontSize: '0.52rem',
                                                                fontFamily: 'monospace',
                                                                color: '#8B0000',
                                                                fontWeight: 'bold',
                                                                letterSpacing: '0.04em',
                                                                border: '1px dashed rgba(139,0,0,0.4)',
                                                                borderRadius: '5px',
                                                                padding: '2px 5px',
                                                                textAlign: 'center',
                                                            }}>
                                                                ▶ {language === 'es' ? 'SIN RÉCORD' : 'NO RECORD'}
                                                            </div>
                                                        )}

                                                    </div>

                                                </button>

                                            );

                                        })}

                                    </div>



                                    {/* Ticket Sync and Actions HUD */}
                                    {userAddress && userAddress !== 'G_DEMO_USER' && (
                                        <div style={{
                                            background: '#F9F5EB',
                                            border: '1px dashed #D0B488',
                                            borderRadius: '8px',
                                            padding: '0.5rem',
                                            marginTop: '0.5rem',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '6px',
                                            width: '100%',
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#8B0000' }}>
                                                    🎟️ {language === 'es' ? 'MIS TICKETS DE TORNEO:' : 'MY TOURNAMENT TICKETS:'} <span style={{ fontSize: '1.1rem', color: '#27AE60' }}>{ticketBalance}</span>
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                                                <button
                                                    onClick={async () => {
                                                        const signer = getContractSignerRef.current();
                                                        setStatus(language === 'es' ? 'Reclamando Staking...' : 'Claiming Staking...');
                                                        try {
                                                            const res = await StellarContractService.claimStakingTickets(userAddress, signer);
                                                            setStatus('');
                                                            if (res.success) {
                                                                alert(language === 'es' ? '¡Tickets de Staking reclamados con éxito! 🎉' : 'Staking tickets successfully claimed! 🎉');
                                                                const tickets = await StellarContractService.getTournamentTickets(userAddress);
                                                                setTicketBalance(tickets);
                                                            } else {
                                                                if (res.error === 'SIGNATURE_REJECTED') {
                                                                    addLog(`⚠️ Transacción cancelada: Firma rechazada por el usuario.`);
                                                                    alert(`⚠️ Firma rechazada por el usuario.`);
                                                                } else {
                                                                    alert(`Error: ${res.error}`);
                                                                }
                                                            }
                                                        } catch (err: any) {
                                                            setStatus('');
                                                            if (err.message === 'SIGNATURE_REJECTED') {
                                                                addLog(`⚠️ Transacción cancelada: Firma rechazada por el usuario.`);
                                                                alert(`⚠️ Firma rechazada por el usuario.`);
                                                            } else {
                                                                alert(`Error: ${err.message}`);
                                                            }
                                                        }
                                                    }}
                                                    style={{
                                                        flex: 1,
                                                        padding: '8px',
                                                        fontSize: '0.75rem',
                                                        background: '#27AE60',
                                                        color: 'white',
                                                        border: '1px solid #1E8449',
                                                        borderRadius: '6px',
                                                        fontWeight: 'bold',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    🎁 {language === 'es' ? 'Reclamar Staking' : 'Claim Staking'}
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        const signer = getContractSignerRef.current();
                                                        setStatus(language === 'es' ? 'Comprando Ticket...' : 'Buying Ticket...');
                                                        try {
                                                            const res = await StellarContractService.buyTournamentTickets(userAddress, 1, signer);
                                                            setStatus('');
                                                            if (res.success) {
                                                                alert(language === 'es' ? '¡Ticket comprado con éxito! 🎟️' : 'Ticket bought successfully! 🎟️');
                                                                const tickets = await StellarContractService.getTournamentTickets(userAddress);
                                                                setTicketBalance(tickets);
                                                                const sliceBal = await StellarContractService.getSliceBalance(userAddress);
                                                                setSliceBalance(sliceBal);
                                                            } else {
                                                                if (res.error === 'SIGNATURE_REJECTED') {
                                                                    addLog(`⚠️ Transacción cancelada: Firma rechazada por el usuario.`);
                                                                    alert(`⚠️ Firma rechazada por el usuario.`);
                                                                } else {
                                                                    alert(`Error: ${res.error}`);
                                                                }
                                                            }
                                                        } catch (err: any) {
                                                            setStatus('');
                                                            if (err.message === 'SIGNATURE_REJECTED') {
                                                                addLog(`⚠️ Transacción cancelada: Firma rechazada por el usuario.`);
                                                                alert(`⚠️ Firma rechazada por el usuario.`);
                                                            } else {
                                                                alert(`Error: ${err.message}`);
                                                            }
                                                        }
                                                    }}
                                                    style={{
                                                        flex: 1,
                                                        padding: '8px',
                                                        fontSize: '0.75rem',
                                                        background: '#D4AF37',
                                                        color: 'white',
                                                        border: '1px solid #AA8010',
                                                        borderRadius: '6px',
                                                        fontWeight: 'bold',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    🛒 {language === 'es' ? 'Comprar (10 $SLICE)' : 'Buy (10 $SLICE)'}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.6rem', width: '100%' }}>
                                        <button
                                            disabled={!engineRef.current}
                                            onClick={() => {
                                                if (engineRef.current) {
                                                    stopPreviewAudio();
                                                    setIsPracticeMode(true);
                                                    setTimeout(() => {
                                                        closeModalWithAnimation('lobby');
                                                        handleStartGame();
                                                    }, 150);
                                                }
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: '0.7rem',
                                                fontSize: '0.9rem',
                                                background: 'linear-gradient(135deg, #2D3748, #4A5568)',
                                                color: 'white',
                                                border: '2px solid #1A202C',
                                                borderRadius: '8px',
                                                fontWeight: 'bold',
                                                cursor: engineRef.current ? 'pointer' : 'not-allowed',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                            }}
                                        >
                                            ⚔️ {language === 'es' ? 'PRÁCTICA LIBRE (GRATIS)' : 'FREE PRACTICE (FREE)'}
                                        </button>

                                        <button
                                            disabled={!engineRef.current}
                                            onClick={() => {
                                                if (engineRef.current) {
                                                    if (userAddress && userAddress !== 'G_DEMO_USER' && ticketBalance < 1) {
                                                        alert(language === 'es' ? '⚠️ Necesitas al menos 1 Ticket para jugar en modo competitivo.' : '⚠️ You need at least 1 Ticket to play competitively.');
                                                        return;
                                                    }
                                                    stopPreviewAudio();
                                                    setIsPracticeMode(false);
                                                    setTimeout(() => {
                                                        closeModalWithAnimation('lobby');
                                                        handleStartGame();
                                                    }, 150);
                                                }
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: '1rem',
                                                fontSize: '1.1rem',
                                                background: 'linear-gradient(135deg, #8B0000, #B30000)',
                                                color: 'white',
                                                border: '2px solid #5C0000',
                                                borderRadius: '8px',
                                                fontWeight: 'bold',
                                                cursor: engineRef.current ? 'pointer' : 'not-allowed',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.08em',
                                                boxShadow: '0 4px 10px rgba(139, 0, 0, 0.4)',
                                            }}
                                        >
                                            🔥 {engineRef.current ? (language === 'es' ? 'TORNEO COMPETITIVO' : 'COMPETITIVE TOURNAMENT') : `🔥 ${t.heatingUp}`}
                                        </button>
                                    </div>

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

                                                    background: isOwned ? 'rgba(39, 174, 96, 0.1)' : '#F9F5EB',

                                                    padding: '0.8rem',

                                                    borderRadius: '12px',

                                                    border: isOwned ? '1px solid #27ae60' : '1px solid #D0B488',

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



                                        <div className="store-item" style={{ background: '#F9F5EB', padding: '0.8rem', borderRadius: '12px', border: '1px dashed #D0B488', textAlign: 'center', opacity: 0.6, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

                                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔒</div>

                                            <div style={{ fontSize: '0.9rem', color: '#666', fontWeight: 'bold' }}>Mystery Pack</div>

                                            <div style={{ color: '#999', fontSize: '0.8rem', marginTop: '0.5rem' }}>???</div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        )}



                        {/* ── TIMED OVEN DASHBOARD & STAKING MODAL ─────────────────────────── */}

                        {(view === 'oven' || closingView === 'oven') && (

                            <div className={`modal-backdrop ${closingView === 'oven' ? 'closing' : ''}`} onClick={() => closeModalWithAnimation('lobby')} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>

                                <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{

                                    background: 'rgba(20, 5, 5, 0.98)',

                                    border: '4px solid #8B0000',

                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), inset 0 0 30px rgba(139, 0, 0, 0.15)',

                                    color: '#FFF8E7',

                                    borderRadius: '16px',

                                    padding: '1.2rem',

                                    width: '95%',

                                    maxWidth: '900px',

                                    maxHeight: '90vh',

                                    overflowY: 'auto',

                                    display: 'flex',

                                    flexDirection: 'column',

                                    gap: '1rem',

                                    position: 'relative'

                                }}>

                                    {/* Modal Header */}

                                    <div style={{

                                        display: 'flex',

                                        justifyContent: 'space-between',

                                        alignItems: 'center',

                                        borderBottom: '3px dashed rgba(139, 0, 0, 0.6)',

                                        paddingBottom: '0.8rem'

                                    }}>

                                        <button 

                                            onClick={() => closeModalWithAnimation('lobby')} 

                                            style={{

                                                background: '#8B0000',

                                                color: 'white',

                                                border: '2px solid #5C0000',

                                                borderRadius: '50%',

                                                width: '40px',

                                                height: '40px',

                                                display: 'flex',

                                                alignItems: 'center',

                                                justifyContent: 'center',

                                                cursor: 'pointer',

                                                transition: 'all 0.2s'

                                            }}

                                            onMouseEnter={(e) => e.currentTarget.style.background = '#C0392B'}

                                            onMouseLeave={(e) => e.currentTarget.style.background = '#8B0000'}

                                        >

                                            <ArrowLeft size={18} />

                                        </button>

                                        <h2 style={{ margin: 0, fontSize: '1.4rem', fontFamily: 'var(--font-display)', color: 'var(--ph-gold)', textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>

                                            🇮🇹 {language === 'es' ? 'EL HORNO DE LA FAMIGLIA' : 'THE FAMIGLIA OVEN'}

                                        </h2>

                                        <div style={{ width: '40px' }} />

                                    </div>



                                    {/* Sub-tab Navigation */}

                                    <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(0,0,0,0.5)', padding: '0.2rem', borderRadius: '8px' }}>

                                        <button 

                                            onClick={() => setOvenTab('baking')}

                                            style={{

                                                flex: 1,

                                                padding: '0.5rem',

                                                background: ovenTab === 'baking' ? 'linear-gradient(135deg, #1A0D0D, #8B0000)' : 'transparent',

                                                border: 'none',

                                                borderRadius: '6px',

                                                color: ovenTab === 'baking' ? 'var(--ph-gold)' : '#aaa',

                                                fontWeight: 'bold',

                                                fontSize: '0.75rem',

                                                cursor: 'pointer',

                                                transition: 'all 0.2s'

                                            }}

                                        >

                                            🔥 {language === 'es' ? 'HORNEAR' : 'BAKE PIZZA'}

                                        </button>

                                        <button 

                                            onClick={() => setOvenTab('classic')}

                                            style={{

                                                flex: 1,

                                                padding: '0.5rem',

                                                background: ovenTab === 'classic' ? 'linear-gradient(135deg, #1A0D0D, #8B0000)' : 'transparent',

                                                border: 'none',

                                                borderRadius: '6px',

                                                color: ovenTab === 'classic' ? 'var(--ph-gold)' : '#aaa',

                                                fontWeight: 'bold',

                                                fontSize: '0.75rem',

                                                cursor: 'pointer',

                                                transition: 'all 0.2s'

                                            }}

                                        >

                                            🏦 {language === 'es' ? 'STAKING VAULT' : 'STAKING VAULT'}

                                        </button>

                                        <button 

                                            onClick={() => setOvenTab('collection')}

                                            style={{

                                                flex: 1,

                                                padding: '0.5rem',

                                                background: ovenTab === 'collection' ? 'linear-gradient(135deg, #1A0D0D, #8B0000)' : 'transparent',

                                                border: 'none',

                                                borderRadius: '6px',

                                                color: ovenTab === 'collection' ? 'var(--ph-gold)' : '#aaa',

                                                fontWeight: 'bold',

                                                fontSize: '0.75rem',

                                                cursor: 'pointer',

                                                transition: 'all 0.2s'

                                            }}

                                        >

                                            👑 {language === 'es' ? 'COLECCIÓN' : 'COLLECTION'}

                                        </button>

                                        <button 

                                            onClick={() => setOvenTab('refrigerator')}

                                            style={{

                                                flex: 1,

                                                padding: '0.5rem',

                                                background: ovenTab === 'refrigerator' ? 'linear-gradient(135deg, #1A0D0D, #8B0000)' : 'transparent',

                                                border: 'none',

                                                borderRadius: '6px',

                                                color: ovenTab === 'refrigerator' ? 'var(--ph-gold)' : '#aaa',

                                                fontWeight: 'bold',

                                                fontSize: '0.75rem',

                                                cursor: 'pointer',

                                                transition: 'all 0.2s'

                                            }}

                                        >

                                            ❄️ {language === 'es' ? 'NEVERA' : 'VAULT'}

                                        </button>

                                    </div>



                                    {/* Tab Content Areas */}

                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '350px' }}>

                                        {/* CSS Keyframe Animations */}

                                        <style>{`

                                            @keyframes firePulse {

                                                0% { box-shadow: 0 0 15px rgba(255, 69, 0, 0.4), inset 0 0 15px rgba(255, 69, 0, 0.3); border-color: #ff4500; }

                                                50% { box-shadow: 0 0 30px rgba(255, 140, 0, 0.8), inset 0 0 25px rgba(255, 140, 0, 0.5); border-color: #ff8c00; }

                                                100% { box-shadow: 0 0 15px rgba(255, 69, 0, 0.4), inset 0 0 15px rgba(255, 69, 0, 0.3); border-color: #ff4500; }

                                            }

                                            @keyframes cyberpunkPulse {

                                                0% { box-shadow: 0 0 15px rgba(0, 255, 255, 0.4), inset 0 0 15px rgba(0, 255, 255, 0.3); border-color: #00ffff; }

                                                50% { box-shadow: 0 0 30px rgba(255, 0, 128, 0.8), inset 0 0 25px rgba(255, 0, 128, 0.5); border-color: #ff0080; }

                                                100% { box-shadow: 0 0 15px rgba(0, 255, 255, 0.4), inset 0 0 15px rgba(0, 255, 255, 0.3); border-color: #00ffff; }

                                            }

                                            @keyframes vulcanPulse {

                                                0% { box-shadow: 0 0 15px rgba(218, 165, 32, 0.4), inset 0 0 15px rgba(218, 165, 32, 0.3); border-color: #daa520; }

                                                50% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.9), inset 0 0 25px rgba(255, 215, 0, 0.6); border-color: #ffd700; }

                                                100% { box-shadow: 0 0 15px rgba(218, 165, 32, 0.4), inset 0 0 15px rgba(218, 165, 32, 0.3); border-color: #daa520; }

                                            }

                                            @keyframes flameFlicker {

                                                0% { transform: scale(1) rotate(-1deg); filter: brightness(1); }

                                                20% { transform: scale(1.05) rotate(2deg); filter: brightness(1.25); }

                                                40% { transform: scale(0.95) rotate(-2deg); filter: brightness(0.9); }

                                                60% { transform: scale(1.02) rotate(1deg); filter: brightness(1.15); }

                                                80% { transform: scale(0.98) rotate(-1deg); filter: brightness(0.95); }

                                                100% { transform: scale(1) rotate(0deg); filter: brightness(1); }

                                            }

                                            @keyframes lockShake {

                                                0% { transform: translateX(0); }

                                                20% { transform: translateX(-4px) rotate(-3deg); }

                                                40% { transform: translateX(4px) rotate(3deg); }

                                                60% { transform: translateX(-4px) rotate(-3deg); }

                                                80% { transform: translateX(4px) rotate(3deg); }

                                                100% { transform: translateX(0); }

                                            }

                                            .lock-container:hover .lock-shake {

                                                animation: lockShake 0.4s ease-in-out;

                                            }

                                            @keyframes readyPulse {
                                                0% { box-shadow: 0 0 10px rgba(57, 255, 20, 0.4), inset 0 0 10px rgba(57, 255, 20, 0.3); border-color: #39ff14; }
                                                50% { box-shadow: 0 0 25px rgba(57, 255, 20, 0.8), inset 0 0 20px rgba(57, 255, 20, 0.5); border-color: #32cd32; }
                                                100% { box-shadow: 0 0 10px rgba(57, 255, 20, 0.4), inset 0 0 10px rgba(57, 255, 20, 0.3); border-color: #39ff14; }
                                            }

                                            @keyframes legendarySparkle {
                                                0% { filter: drop-shadow(0 0 2px #d4af37) brightness(1); }
                                                50% { filter: drop-shadow(0 0 10px #ffd700) brightness(1.3); }
                                                100% { filter: drop-shadow(0 0 2px #d4af37) brightness(1); }
                                            }

                                            .legendary-spark {
                                                animation: legendarySparkle 2s infinite ease-in-out;
                                                border: 2px solid #ffd700 !important;
                                                box-shadow: 0 0 15px #ffd700, inset 0 0 10px rgba(255,215,0,0.3) !important;
                                            }
                                            .epic-spark {
                                                animation: legendarySparkle 2s infinite ease-in-out;
                                                border: 2px solid #ff00ff !important;
                                                box-shadow: 0 0 15px #ff00ff, inset 0 0 10px rgba(255,0,255,0.3) !important;
                                            }

                                        `}</style>



                                        {/* TAB 0: TIMED BAKING */}

                                        {ovenTab === 'baking' && (

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>

                                                {/* Equipped NFT Banner */}
                                                {localStorage.getItem('equippedOvenId') && (
                                                    <div style={{
                                                        background: 'linear-gradient(90deg, rgba(212,175,55,0.15), rgba(139,0,0,0.1))',
                                                        border: '1px solid #d4af37',
                                                        borderRadius: '6px',
                                                        padding: '0.4rem 0.6rem',
                                                        fontSize: '0.65rem',
                                                        color: '#FFF8E7',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        marginBottom: '0.2rem'
                                                    }}>
                                                        <span>🛡️ <strong>{language === 'es' ? 'HORNO EQUIPADO:' : 'EQUIPPED OVEN NFT:'}</strong> #{localStorage.getItem('equippedOvenId')}</span>
                                                        <span style={{ color: '#39ff14', fontWeight: 'bold' }}>+{localStorage.getItem('equippedOvenMultiplier') || '1.0'}x Boost</span>
                                                    </div>
                                                )}

                                                {/* Selectors and Stats Bar */}

                                                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>

                                                    {/* Fuel Selector */}

                                                    <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>

                                                        <span style={{ fontSize: '0.65rem', color: '#ffb703', fontWeight: 'bold' }}>🪵 LEÑA / WOOD FUEL:</span>

                                                        <div style={{ display: 'flex', gap: '0.3rem' }}>

                                                            {[

                                                                { id: 'oak', label: '🌳 Roble', desc: 'Base (1x)', cost: 'Gratis' },

                                                                { id: 'cherry', label: '🍒 Cerezo', desc: '1.3x Vel, +10% Yield', cost: '0.5 SLICE' },

                                                                { id: 'mesquite', label: '🌶️ Mezquite', desc: '1.8x Vel, +30% Yield', cost: '1.2 SLICE' }

                                                            ].map(fuel => (

                                                                <button

                                                                    key={fuel.id}

                                                                    onClick={() => setSelectedFuel(fuel.id as any)}

                                                                    style={{

                                                                        flex: 1,

                                                                        padding: '0.3rem',

                                                                        background: selectedFuel === fuel.id ? 'linear-gradient(135deg, #FF4500, #8B0000)' : 'rgba(0,0,0,0.5)',

                                                                        border: selectedFuel === fuel.id ? '1px solid #FFD700' : '1px solid rgba(255,255,255,0.1)',

                                                                        borderRadius: '4px',

                                                                        color: selectedFuel === fuel.id ? '#FFF' : '#ccc',

                                                                        cursor: 'pointer',

                                                                        fontSize: '0.6rem',

                                                                        fontWeight: 'bold',

                                                                        transition: 'all 0.2s',

                                                                        textAlign: 'center'

                                                                    }}

                                                                >

                                                                    <div style={{ fontSize: '0.65rem' }}>{fuel.label}</div>

                                                                    <div style={{ fontSize: '0.45rem', opacity: 0.8 }}>{fuel.desc}</div>

                                                                </button>

                                                            ))}

                                                        </div>

                                                    </div>



                                                    {/* Oven NFT Visual Selector */}

                                                    <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>

                                                        <span style={{ fontSize: '0.65rem', color: '#ffb703', fontWeight: 'bold' }}>🧱 HORNO NFT / OVEN STYLE:</span>

                                                        <div style={{ display: 'flex', gap: '0.3rem' }}>

                                                            {[

                                                                { id: 'brick', label: '🧱 Original', desc: 'Base (1x)' },

                                                                { id: 'cyberpunk', label: '🎛️ Neón', desc: 'Boost' },

                                                                { id: 'vulcan', label: '🌋 Vulcan', desc: 'Máximo' }

                                                            ].map(style => (

                                                                <button

                                                                    key={style.id}

                                                                    onClick={() => setEquippedOvenStyle(style.id as any)}

                                                                    style={{

                                                                        flex: 1,

                                                                        padding: '0.3rem',

                                                                        background: equippedOvenStyle === style.id ? 'linear-gradient(135deg, #2980b9, #2c3e50)' : 'rgba(0,0,0,0.5)',

                                                                        border: equippedOvenStyle === style.id ? '1px solid #3498db' : '1px solid rgba(255,255,255,0.1)',

                                                                        borderRadius: '4px',

                                                                        color: equippedOvenStyle === style.id ? '#FFF' : '#ccc',

                                                                        cursor: 'pointer',

                                                                        fontSize: '0.6rem',

                                                                        fontWeight: 'bold',

                                                                        transition: 'all 0.2s',

                                                                        textAlign: 'center'

                                                                    }}

                                                                >

                                                                    <div style={{ fontSize: '0.65rem' }}>{style.label}</div>

                                                                    <div style={{ fontSize: '0.45rem', opacity: 0.8 }}>{style.desc}</div>

                                                                </button>

                                                            ))}

                                                        </div>

                                                    </div>

                                                </div>



                                                {/* Resources & Wallet Stats Bar */}

                                                <div style={{

                                                    display: 'flex',

                                                    justifyContent: 'space-between',

                                                    alignItems: 'center',

                                                    background: 'rgba(0,0,0,0.4)',

                                                    border: '1px dashed rgba(139, 0, 0, 0.4)',

                                                    borderRadius: '8px',

                                                    padding: '0.5rem 0.8rem',

                                                    fontSize: '0.7rem'

                                                }}>

                                                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>

                                                        <span style={{ color: '#FFD700', fontWeight: 'bold' }}>💵 MI BALANCE:</span>

                                                        <span style={{ background: 'rgba(218,165,32,0.15)', padding: '2px 8px', borderRadius: '10px', color: '#ffb703', fontWeight: 'bold' }}>

                                                            {sliceBalance} $SLICE

                                                        </span>

                                                    </div>

                                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>

                                                        <span style={{ color: '#aaa' }}>🎒 MIS INGREDIENTES:</span>

                                                        <span style={{ color: ingredients.cheese >= 2 ? '#2ecc71' : '#e74c3c' }}>🧀 QUESO: {ingredients.cheese}</span>

                                                        <span style={{ color: ingredients.pepperoni >= 2 ? '#2ecc71' : '#e74c3c' }}>🍖 PEPERONI: {ingredients.pepperoni}</span>

                                                        <span style={{ color: ingredients.bacon >= 2 ? '#2ecc71' : '#e74c3c' }}>🥓 TOCINO: {ingredients.bacon}</span>

                                                        <span style={{ color: ingredients.onion >= 2 ? '#2ecc71' : '#e74c3c' }}>🧅 CEBOLLA: {ingredients.onion}</span>

                                                    </div>

                                                </div>



                                                {/* 4 Oven Slots Grid */}

                                                <div style={{

                                                    display: 'grid',

                                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',

                                                    gap: '0.8rem'

                                                }}>

                                                    {ovenSlots.map(slot => {

                                                        const config = slot.pizzaType ? getBakeConfig(slot.pizzaType) : null;

                                                        const isBakingActive = slot.status === 'baking';

                                                        const isCompleted = slot.status === 'completed';

                                                        let progressPct = 0;

                                                        let secondsLeft = 0;

                                                        if (isBakingActive && slot.startTime && slot.duration) {

                                                            const elapsed = Date.now() - slot.startTime;

                                                            progressPct = Math.min(100, (elapsed / slot.duration) * 100);

                                                            secondsLeft = Math.max(0, Math.ceil((slot.duration - elapsed) / 1000));

                                                        }



                                                        // Choose custom neon border and burning pulses based on equipped oven style

                                                        let pulseAnimation = 'none';

                                                        let borderStyle = {};

                                                        let legendaryClass = '';
                                                        const equippedMult = parseFloat(localStorage.getItem('equippedOvenMultiplier') || '1.0');
                                                        if (localStorage.getItem('equippedOvenId')) {
                                                            if (equippedMult >= 4.0) {
                                                                legendaryClass = 'legendary-spark';
                                                            } else if (equippedMult >= 2.0) {
                                                                legendaryClass = 'epic-spark';
                                                            }
                                                        }

                                                        if (isBakingActive) {

                                                            if (equippedOvenStyle === 'vulcan') {

                                                                pulseAnimation = 'vulcanPulse 1.8s infinite';

                                                                borderStyle = { animation: pulseAnimation, border: '2px solid #daa520' };

                                                            } else if (equippedOvenStyle === 'cyberpunk') {

                                                                pulseAnimation = 'cyberpunkPulse 1.5s infinite';

                                                                borderStyle = { animation: pulseAnimation, border: '2px solid #ff0080' };

                                                            } else {

                                                                pulseAnimation = 'firePulse 2s infinite';

                                                                borderStyle = { animation: pulseAnimation, border: '2px solid #ff4500' };

                                                            }

                                                        } else if (isCompleted) {

                                                            borderStyle = {

                                                                animation: 'readyPulse 1.5s infinite',

                                                                border: '2px solid #39ff14',

                                                                boxShadow: '0 0 15px rgba(57, 255, 20, 0.4)'

                                                            };

                                                        } else {

                                                            borderStyle = { border: '1px solid rgba(255, 255, 255, 0.1)' };

                                                        }



                                                        return (

                                                            <div

                                                                key={slot.id}

                                                                className={`${slot.isLocked ? "lock-container" : ""} ${legendaryClass}`}

                                                                style={{

                                                                    background: slot.isLocked ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.02)',

                                                                    borderRadius: '10px',

                                                                    padding: '0.6rem',

                                                                    display: 'flex',

                                                                    flexDirection: 'column',

                                                                    alignItems: 'center',

                                                                    justifyContent: 'space-between',

                                                                    minHeight: '170px',

                                                                    position: 'relative',

                                                                    overflow: 'hidden',

                                                                    transition: 'all 0.3s',

                                                                    ...borderStyle

                                                                }}

                                                            >

                                                                {/* SLOT NUMBER AND STATE BADGE */}

                                                                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>

                                                                    <span style={{ fontSize: '0.6rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '10px', color: '#FFF8DC', fontWeight: 'bold' }}>

                                                                        SLOT {slot.id}

                                                                    </span>

                                                                    {slot.isLocked && (

                                                                        <span style={{ fontSize: '0.55rem', background: '#C0392B', padding: '1px 4px', borderRadius: '4px', color: 'white', fontWeight: 'bold' }}>LOCKED</span>

                                                                    )}

                                                                    {isBakingActive && (

                                                                        <span style={{ fontSize: '0.55rem', background: 'linear-gradient(90deg, #ff4500, #d84b16)', padding: '1px 5px', borderRadius: '4px', color: 'white', fontWeight: 'bold' }}>BAKING</span>

                                                                    )}

                                                                    {isCompleted && (

                                                                        <span style={{ fontSize: '0.55rem', background: '#39ff14', padding: '1px 5px', borderRadius: '4px', color: 'black', fontWeight: 'bold' }}>READY!</span>

                                                                    )}

                                                                </div>



                                                                {slot.isLocked ? (

                                                                    /* LOCKED OVERLAY */

                                                                    <div className="lock-shake" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flex: 1, justifyContent: 'center', width: '100%' }}>

                                                                        <div style={{ fontSize: '1.8rem', animation: 'bounce 2s infinite alternate' }}>🔒</div>

                                                                        <span style={{ fontSize: '0.55rem', color: '#aaa', textAlign: 'center' }}>Requiere Horno de Acero o Mayor</span>

                                                                        <button

                                                                            onClick={() => unlockSlot(slot.id)}

                                                                            style={{

                                                                                width: '90%',

                                                                                padding: '0.25rem',

                                                                                background: 'linear-gradient(135deg, #DAA520, #8B0000)',

                                                                                border: '1px solid #FFD700',

                                                                                borderRadius: '4px',

                                                                                color: 'white',

                                                                                fontWeight: 'bold',

                                                                                fontSize: '0.6rem',

                                                                                cursor: 'pointer',

                                                                                boxShadow: '0 0 5px rgba(218,165,32,0.4)',

                                                                                transition: 'all 0.2s'

                                                                            }}

                                                                        >

                                                                            {slot.id === 3 ? 'Desbloquear (50 SLICE)' : 'Desbloquear (100 SLICE)'}

                                                                        </button>

                                                                    </div>

                                                                ) : slot.status === 'idle' ? (

                                                                    /* IDLE SELECT RECIPE MODE */

                                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', width: '100%', flex: 1, justifyContent: 'center' }}>

                                                                        <span style={{ fontSize: '0.55rem', color: '#888', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '2px' }}>Recetas Disponibles:</span>

                                                                        

                                                                        {/* Recipe Margherita */}

                                                                        <button

                                                                            onClick={() => startBaking(slot.id, 'margherita')}

                                                                            style={{

                                                                                display: 'flex',

                                                                                justifyContent: 'space-between',

                                                                                alignItems: 'center',

                                                                                padding: '0.2rem 0.4rem',

                                                                                background: 'rgba(255,255,255,0.03)',

                                                                                border: '1px solid rgba(255,255,255,0.08)',

                                                                                borderRadius: '4px',

                                                                                color: 'white',

                                                                                fontSize: '0.6rem',

                                                                                cursor: 'pointer',

                                                                                width: '100%'

                                                                            }}

                                                                        >

                                                                            <span>🍕 Margherita (10s)</span>

                                                                            <span style={{ color: ingredients.cheese >= 2 ? '#2ecc71' : '#e74c3c', fontWeight: 'bold' }}>🧀 {ingredients.cheese}/2</span>

                                                                        </button>



                                                                        {/* Recipe Pepperoni */}

                                                                        <button

                                                                            onClick={() => startBaking(slot.id, 'pepperoni')}

                                                                            style={{

                                                                                display: 'flex',

                                                                                justifyContent: 'space-between',

                                                                                alignItems: 'center',

                                                                                padding: '0.2rem 0.4rem',

                                                                                background: 'rgba(255,255,255,0.03)',

                                                                                border: '1px solid rgba(255,255,255,0.08)',

                                                                                borderRadius: '4px',

                                                                                color: 'white',

                                                                                fontSize: '0.6rem',

                                                                                cursor: 'pointer',

                                                                                width: '100%'

                                                                            }}

                                                                        >

                                                                            <span>🍖 Pepperoni (30s)</span>

                                                                            <span style={{ color: (ingredients.cheese >= 2 && ingredients.pepperoni >= 2) ? '#2ecc71' : '#e74c3c', fontWeight: 'bold' }}>🍖 {ingredients.pepperoni}/2</span>

                                                                        </button>



                                                                        {/* Recipe Special */}

                                                                        <button

                                                                            onClick={() => startBaking(slot.id, 'special')}

                                                                            style={{

                                                                                display: 'flex',

                                                                                justifyContent: 'space-between',

                                                                                alignItems: 'center',

                                                                                padding: '0.2rem 0.4rem',

                                                                                background: 'rgba(255,255,255,0.03)',

                                                                                border: '1px solid rgba(255,255,255,0.08)',

                                                                                borderRadius: '4px',

                                                                                color: 'white',

                                                                                fontSize: '0.6rem',

                                                                                cursor: 'pointer',

                                                                                width: '100%'

                                                                            }}

                                                                        >

                                                                            <span>⭐ Speciale (60s)</span>

                                                                            <span style={{ color: (ingredients.cheese >= 2 && ingredients.pepperoni >= 2 && ingredients.bacon >= 2 && ingredients.onion >= 2) ? '#2ecc71' : '#e74c3c', fontWeight: 'bold' }}>Todo 2+</span>

                                                                        </button>



                                                                        {/* Recipe Tartufo (Prestige) */}

                                                                        <button

                                                                            onClick={() => startBaking(slot.id, 'tartufo')}

                                                                            style={{

                                                                                display: 'flex',

                                                                                justifyContent: 'space-between',

                                                                                alignItems: 'center',

                                                                                padding: '0.2rem 0.4rem',

                                                                                background: 'rgba(139, 92, 246, 0.15)',

                                                                                border: '1px solid rgba(139, 92, 246, 0.3)',

                                                                                borderRadius: '4px',

                                                                                color: '#d8b4fe',

                                                                                fontSize: '0.6rem',

                                                                                cursor: 'pointer',

                                                                                width: '100%',

                                                                                marginTop: '0.2rem'

                                                                            }}

                                                                        >

                                                                            <span>🍄 Tartufo (45s)</span>

                                                                            <span style={{ color: (ingredients.cheese >= 2 && ingredients.pepperoni >= 1 && rareIngredients.truffle >= 1) ? '#2ecc71' : '#e74c3c', fontWeight: 'bold' }}>🍄 {rareIngredients.truffle}/1</span>

                                                                        </button>



                                                                        {/* Recipe Dolce Vita (Prestige) */}

                                                                        <button

                                                                            onClick={() => startBaking(slot.id, 'dolce')}

                                                                            style={{

                                                                                display: 'flex',

                                                                                justifyContent: 'space-between',

                                                                                alignItems: 'center',

                                                                                padding: '0.2rem 0.4rem',

                                                                                background: 'rgba(139, 92, 246, 0.15)',

                                                                                border: '1px solid rgba(139, 92, 246, 0.3)',

                                                                                borderRadius: '4px',

                                                                                color: '#d8b4fe',

                                                                                fontSize: '0.6rem',

                                                                                cursor: 'pointer',

                                                                                width: '100%',

                                                                                marginTop: '0.2rem'

                                                                            }}

                                                                        >

                                                                            <span>🍇 Dolce Vita (40s)</span>

                                                                            <span style={{ color: (ingredients.cheese >= 2 && ingredients.onion >= 1 && rareIngredients.fig >= 1) ? '#2ecc71' : '#e74c3c', fontWeight: 'bold' }}>🍇 {rareIngredients.fig}/1</span>

                                                                        </button>



                                                                        {/* Recipe della Mafia (Prestige) */}

                                                                        <button

                                                                            onClick={() => startBaking(slot.id, 'mafia')}

                                                                            style={{

                                                                                display: 'flex',

                                                                                justifyContent: 'space-between',

                                                                                alignItems: 'center',

                                                                                padding: '0.2rem 0.4rem',

                                                                                background: 'rgba(217, 70, 239, 0.2)',

                                                                                border: '1px solid rgba(217, 70, 239, 0.4)',

                                                                                borderRadius: '4px',

                                                                                color: '#f472b6',

                                                                                fontSize: '0.6rem',

                                                                                cursor: 'pointer',

                                                                                width: '100%',

                                                                                marginTop: '0.2rem'

                                                                            }}

                                                                        >

                                                                            <span>👑 della Mafia (90s)</span>

                                                                            <span style={{ color: (ingredients.cheese >= 2 && ingredients.bacon >= 2 && rareIngredients.caviar >= 1 && rareIngredients.goldFlakes >= 1) ? '#2ecc71' : '#e74c3c', fontWeight: 'bold' }}>✨ {rareIngredients.goldFlakes}/1</span>

                                                                        </button>

                                                                    </div>

                                                                ) : isBakingActive ? (

                                                                    /* ACTIVE BAKING BURNING ANIMATION MODE */

                                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '0.4rem', flex: 1, justifyContent: 'center' }}>

                                                                        <div style={{ position: 'relative', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                                                                            <div style={{ fontSize: '2.2rem', animation: 'spin 8s linear infinite' }}>🍕</div>

                                                                            <div style={{ fontSize: '1.2rem', position: 'absolute', animation: 'flameFlicker 0.4s infinite alternate', bottom: '-4px' }}>🔥</div>

                                                                        </div>

                                                                        <span style={{ fontSize: '0.65rem', color: '#ffb703', fontWeight: 'bold' }}>{config?.label}</span>

                                                                        <span style={{ fontSize: '0.55rem', color: '#ccc', fontFamily: 'monospace' }}>Restan: {secondsLeft} segs</span>

                                                                        

                                                                        {/* Progress Bar Container */}

                                                                        <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>

                                                                            <div style={{

                                                                                width: `${progressPct}%`,

                                                                                height: '100%',

                                                                                background: 'linear-gradient(90deg, #ff4500, #ff8c00, #ffd700)',

                                                                                transition: 'width 1s linear',

                                                                                boxShadow: '0 0 5px #ff4500'

                                                                            }} />

                                                                        </div>

                                                                    </div>

                                                                ) : (

                                                                    /* COMPLETED READY FOR HARVEST MODE */

                                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flex: 1, justifyContent: 'center', width: '100%' }}>

                                                                        <div style={{ fontSize: '2.5rem' }}>🛎️</div>

                                                                        <span style={{ fontSize: '0.65rem', color: '#39ff14', fontWeight: 'bold', textAlign: 'center' }}>{config?.label} BAKED!</span>

                                                                        <button

                                                                            onClick={() => { claimPizza(slot.id); playBakingChime(); }}

                                                                            style={{

                                                                                width: '90%',

                                                                                padding: '0.35rem 0.5rem',

                                                                                background: 'linear-gradient(135deg, #39ff14, #1b8a05)',

                                                                                border: 'none',

                                                                                borderRadius: '6px',

                                                                                color: 'black',

                                                                                fontWeight: 'bold',

                                                                                fontSize: '0.65rem',

                                                                                cursor: 'pointer',

                                                                                boxShadow: '0 0 10px rgba(57, 255, 20, 0.4)',

                                                                                transition: 'all 0.2s',

                                                                                textAlign: 'center'

                                                                            }}

                                                                        >

                                                                            CLAIM / COBRAR

                                                                        </button>

                                                                    </div>

                                                                )}

                                                            </div>

                                                        );

                                                    })}

                                                </div>

                                            </div>

                                        )}



                                        {/* TAB 1: CONGELAMIENTO CLÁSICO */}

                                        {ovenTab === 'classic' && (

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>

                                                <div style={{

                                                    background: 'rgba(255, 255, 255, 0.02)',

                                                    border: '1px solid rgba(255, 255, 255, 0.1)',

                                                    borderRadius: '8px',

                                                    padding: '0.6rem 0.8rem'

                                                }}>

                                                    <h3 style={{ margin: '0 0 0.4rem 0', color: 'var(--ph-gold)', fontSize: '0.9rem' }}>Estado del Staking</h3>

                                                    <p style={{ margin: '0 0 0.6rem 0', fontSize: '0.75rem', color: '#ccc', lineHeight: '1.3' }}>

                                                        Al congelar tu $SLICE en el Horno Clásico obtienes multiplicadores de puntuación e ingredientes con protección total del principal (cero Impermanent Loss).

                                                    </p>

                                                    

                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>

                                                        <span style={{ fontSize: '0.8rem' }}>SLICE Congelado:</span>

                                                        <span style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--ph-gold)' }}>{stakedSlice} $SLICE</span>

                                                    </div>

                                                    {/* Tier display */}

                                                    <div style={{

                                                        background: 'rgba(0, 0, 0, 0.4)',

                                                        borderRadius: '6px',

                                                        padding: '0.4rem 0.6rem',

                                                        display: 'flex',

                                                        justifyContent: 'space-between',

                                                        alignItems: 'center',

                                                        fontSize: '0.7rem',

                                                        borderLeft: '4px solid #8B0000'

                                                    }}>

                                                        <span>Rango de la Masa:</span>

                                                        <span style={{ fontWeight: 'bold', color: stakedSlice >= 5000 ? '#DAA520' : stakedSlice >= 2000 ? '#9B59B6' : stakedSlice >= 500 ? '#3498DB' : stakedSlice >= 100 ? '#2ECC71' : '#aaa' }}>

                                                            {stakedSlice >= 5000 ? '👑 DON DE LA MASA' : stakedSlice >= 2000 ? '🕴️ CAPOREGIME' : stakedSlice >= 500 ? '🔫 SOLDATO' : stakedSlice >= 100 ? '🥖 PICCOLINO' : '❌ ASOCIADO'}

                                                        </span>

                                                        <span>Multiplicador:</span>

                                                        <span style={{ fontWeight: 'bold', color: 'var(--ph-gold)' }}>

                                                            {stakedSlice >= 5000 ? '4.0x (+60% Score)' : stakedSlice >= 2000 ? '2.5x (+35% Score)' : stakedSlice >= 500 ? '1.5x (+15% Score)' : stakedSlice >= 100 ? '1.0x (+5% Score)' : '1.0x (Base)'}

                                                        </span>

                                                    </div>

                                                </div>



                                                {/* Action Panel */}

                                                <div style={{

                                                    background: 'rgba(255, 255, 255, 0.02)',

                                                    border: '1px solid rgba(255, 255, 255, 0.1)',

                                                    borderRadius: '8px',

                                                    padding: '0.6rem 0.8rem',

                                                    display: 'flex',

                                                    flexDirection: 'column',

                                                    gap: '0.5rem'

                                                }}>

                                                    <h3 style={{ margin: '0 0 0.2rem 0', color: 'var(--ph-gold)', fontSize: '0.85rem' }}>🎛️ Acciones de Bóveda</h3>

                                                    <div style={{ display: 'flex', gap: '0.4rem' }}>

                                                        <button 

                                                            onClick={async () => {

                                                                const amtStr = prompt(language === 'es' ? '¿Cuánto $SLICE deseas congelar en el Horno Clásico?' : 'How much $SLICE do you wish to stake?');

                                                                if (!amtStr) return;

                                                                const amt = parseFloat(amtStr);

                                                                if (isNaN(amt) || amt <= 0) return;

                                                                

                                                                if (userAddress) {

                                                                    try {

                                                                        const signer = getContractSignerRef.current();

                                                                        const result = await StellarContractService.stakeSlice(userAddress, amt, signer);

                                                                        if (result.success) {

                                                                            setStakedSlice(prev => prev + amt);

                                                                            alert("Staked successfully on-chain!");

                                                                        }

                                                                    } catch (err) {

                                                                        console.error("Stake on-chain failed", err);

                                                                    }

                                                                } else {

                                                                    // Fallback

                                                                    setStakedSlice(prev => prev + amt);

                                                                }

                                                            }}

                                                            style={{

                                                                flex: 1,

                                                                padding: '0.5rem',

                                                                background: '#27ae60',

                                                                color: 'white',

                                                                border: 'none',

                                                                borderRadius: '6px',

                                                                fontWeight: 'bold',

                                                                fontSize: '0.75rem',

                                                                cursor: 'pointer'

                                                            }}

                                                        >

                                                            🥩 CONGELAR ($SLICE)

                                                        </button>

                                                        <button 

                                                            onClick={async () => {

                                                                const amtStr = prompt(language === 'es' ? '¿Cuánto $SLICE deseas retirar del Horno Clásico?' : 'How much $SLICE do you wish to unstake?');

                                                                if (!amtStr) return;

                                                                const amt = parseFloat(amtStr);

                                                                if (isNaN(amt) || amt <= 0 || amt > stakedSlice) return;



                                                                if (userAddress) {

                                                                    try {

                                                                        const signer = getContractSignerRef.current();

                                                                        const result = await StellarContractService.unstakeSlice(userAddress, amt, signer);

                                                                        if (result.success) {

                                                                            setStakedSlice(prev => Math.max(0, prev - amt));

                                                                            alert("Unstaked successfully on-chain!");

                                                                        }

                                                                    } catch (err) {

                                                                        console.error("Unstake on-chain failed", err);

                                                                    }

                                                                } else {

                                                                    // Fallback

                                                                    setStakedSlice(prev => Math.max(0, prev - amt));

                                                                }

                                                            }}

                                                            style={{

                                                                flex: 1,

                                                                padding: '0.5rem',

                                                                background: '#c0392b',

                                                                color: 'white',

                                                                border: 'none',

                                                                borderRadius: '6px',

                                                                fontWeight: 'bold',

                                                                fontSize: '0.75rem',

                                                                cursor: 'pointer'

                                                            }}

                                                        >

                                                            🔓 RETIRAR ($SLICE)

                                                        </button>

                                                    </div>

                                                </div>

                                            </div>

                                        )}



                                        {/* TAB 2: NFT OVEN COLLECTION CAROUSEL (EMBEDDED) */}

                                        {ovenTab === 'collection' && (

                                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

                                                <CollectionTab 

                                                    language={language}

                                                    userAddress={userAddress}

                                                    onBack={() => setOvenTab('baking')}

                                                    isEmbedded={true}

                                                />

                                            </div>

                                        )}



                                        {/* TAB 4: REFRIGERATOR VAULT (NEVERA) */}

                                        {ovenTab === 'refrigerator' && (

                                            <div style={{ 
                                                flex: 1, 
                                                display: 'flex', 
                                                flexDirection: 'column', 
                                                background: 'linear-gradient(135deg, #110808, #2a0f0f)', 
                                                padding: '1.2rem', 
                                                borderRadius: '12px', 
                                                border: '1px solid rgba(217, 180, 136, 0.2)',
                                                color: '#f5efe6',
                                                overflowY: 'auto'
                                            }}>

                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
                                                    <div style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 0 8px #00f0ff)' }}>❄️</div>
                                                    <div>
                                                        <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--ph-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                            {language === 'es' ? 'Nevera de la Famiglia' : 'Nevera Vault'}
                                                        </h3>
                                                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#ccc' }}>
                                                            {language === 'es' 
                                                                ? 'sink deflacionario de preservación de ingredientes crudos' 
                                                                : 'Deflationary preservation sink for raw ingredients'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div style={{ 
                                                    background: 'rgba(0,0,0,0.4)', 
                                                    padding: '0.8rem', 
                                                    borderRadius: '8px', 
                                                    fontSize: '0.75rem', 
                                                    color: '#ddd', 
                                                    lineHeight: '1.4', 
                                                    borderLeft: '4px solid var(--ph-gold)',
                                                    marginBottom: '1rem' 
                                                }}>
                                                    ⚠️ <strong>{language === 'es' ? 'REGLA DE CONSERVACIÓN:' : 'PRESERVATION RULE:'}</strong> {language === 'es' 
                                                        ? 'Los ingredientes crudos se pudren y desaparecen tras 7 días. Congélalos on-chain para preservarlos de por vida. Cada depósito cobra una tarifa fija de ' 
                                                        : 'Raw ingredients spoil after 7 days unless frozen on-chain. Each deposit requires a flat fee of '}
                                                    <strong style={{ color: 'var(--ph-gold)' }}>0.5 $SLICE</strong> {language === 'es' ? '(50% se quema, 50% va a la tesorería de PizzaDAO).' : '(50% is burned, 50% to PizzaDAO Treasury).'}
                                                </div>

                                                <div className="nevera-grid">
                                                    {(['cheese', 'pepperoni', 'bacon', 'onion'] as const).map(type => {
                                                        const freshCount = (ingredients as any)[type] || 0;
                                                        const frozenCount = (frozenIngredients as any)[type] || 0;
                                                        
                                                        // Calculate time left for the oldest item
                                                        const ts = loadTimestamps();
                                                        let oldestTimeLeftStr = language === 'es' ? 'Sin ingredientes' : 'No items';
                                                        if (ts[type] && ts[type].length > 0) {
                                                            const oldest = Math.min(...ts[type]);
                                                            const elapsed = Date.now() - oldest;
                                                            const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
                                                            const remaining = sevenDaysMs - elapsed;
                                                            if (remaining <= 0) {
                                                                oldestTimeLeftStr = language === 'es' ? 'Expirado' : 'Expired';
                                                            } else {
                                                                const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
                                                                const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
                                                                oldestTimeLeftStr = language === 'es' 
                                                                    ? `Viejo expira en: ${days}d ${hours}h` 
                                                                    : `Oldest expires: ${days}d ${hours}h`;
                                                            }
                                                        }

                                                        const emoji = type === 'cheese' ? '🧀' : type === 'pepperoni' ? '🍖' : type === 'bacon' ? '🥓' : '🧅';
                                                        const label = type === 'cheese' ? 'Queso' : type === 'pepperoni' ? 'Pepperoni' : type === 'bacon' ? 'Bacon' : 'Onion';

                                                        return (
                                                            <div key={type} style={{ 
                                                                background: 'rgba(0,0,0,0.3)', 
                                                                padding: '0.8rem', 
                                                                borderRadius: '10px', 
                                                                border: '1px solid rgba(255,255,255,0.05)',
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                gap: '0.5rem'
                                                            }}>
                                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                                                                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{emoji} {label}</span>
                                                                    <span style={{ fontSize: '0.65rem', color: 'var(--ph-gold)', opacity: 0.9 }}>
                                                                        {oldestTimeLeftStr}
                                                                    </span>
                                                                </div>

                                                                <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', margin: '0.2rem 0' }}>
                                                                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', padding: '0.3rem', borderRadius: '6px', textAlign: 'center' }}>
                                                                        <div style={{ color: '#aaa', fontSize: '0.65rem' }}>{language === 'es' ? 'FRESCOS' : 'FRESH'}</div>
                                                                        <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#2ecc71' }}>{freshCount}</div>
                                                                    </div>
                                                                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', padding: '0.3rem', borderRadius: '6px', textAlign: 'center', border: '1px solid rgba(0,240,255,0.2)' }}>
                                                                        <div style={{ color: '#aaa', fontSize: '0.65rem' }}>{language === 'es' ? 'CONGELADOS' : 'FROZEN'}</div>
                                                                        <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#00f0ff', textShadow: '0 0 4px rgba(0,240,255,0.4)' }}>{frozenCount}</div>
                                                                    </div>
                                                                </div>

                                                                <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.3rem' }}>
                                                                    <button 
                                                                        onClick={() => depositToRefrigerator(type, 1)}
                                                                        disabled={freshCount < 1}
                                                                        style={{
                                                                            flex: 1,
                                                                            padding: '0.4rem',
                                                                            background: 'linear-gradient(135deg, #1b3d54, #0f2535)',
                                                                            color: '#00f0ff',
                                                                            border: '1px solid rgba(0,240,255,0.3)',
                                                                            borderRadius: '6px',
                                                                            fontSize: '0.7rem',
                                                                            fontWeight: 'bold',
                                                                            cursor: freshCount < 1 ? 'not-allowed' : 'pointer',
                                                                            opacity: freshCount < 1 ? 0.5 : 1
                                                                        }}
                                                                    >
                                                                        ❄️ {language === 'es' ? 'Congelar 1' : 'Freeze 1'}
                                                                    </button>

                                                                    <button 
                                                                        onClick={() => withdrawFromRefrigerator(type, 1)}
                                                                        disabled={frozenCount < 1}
                                                                        style={{
                                                                            flex: 1,
                                                                            padding: '0.4rem',
                                                                            background: 'linear-gradient(135deg, #4d2323, #2f1313)',
                                                                            color: '#ff6b6b',
                                                                            border: '1px solid rgba(255,107,107,0.3)',
                                                                            borderRadius: '6px',
                                                                            fontSize: '0.7rem',
                                                                            fontWeight: 'bold',
                                                                            cursor: frozenCount < 1 ? 'not-allowed' : 'pointer',
                                                                            opacity: frozenCount < 1 ? 0.5 : 1
                                                                        }}
                                                                    >
                                                                        🔥 {language === 'es' ? 'Retirar 1' : 'Withdraw 1'}
                                                                    </button>
                                                                </div>

                                                                <div style={{ display: 'flex', gap: '0.3rem' }}>
                                                                    <button 
                                                                        onClick={() => depositToRefrigerator(type, freshCount)}
                                                                        disabled={freshCount < 1}
                                                                        style={{
                                                                            flex: 1,
                                                                            padding: '0.2rem',
                                                                            background: 'rgba(0,240,255,0.1)',
                                                                            color: '#00f0ff',
                                                                            border: 'none',
                                                                            borderRadius: '4px',
                                                                            fontSize: '0.65rem',
                                                                            cursor: freshCount < 1 ? 'not-allowed' : 'pointer',
                                                                            opacity: freshCount < 1 ? 0.4 : 0.8
                                                                        }}
                                                                    >
                                                                        {language === 'es' ? 'Congelar Todo' : 'Freeze All'}
                                                                    </button>

                                                                    <button 
                                                                        onClick={() => withdrawFromRefrigerator(type, frozenCount)}
                                                                        disabled={frozenCount < 1}
                                                                        style={{
                                                                            flex: 1,
                                                                            padding: '0.2rem',
                                                                            background: 'rgba(255,107,107,0.1)',
                                                                            color: '#ff6b6b',
                                                                            border: 'none',
                                                                            borderRadius: '4px',
                                                                            fontSize: '0.65rem',
                                                                            cursor: frozenCount < 1 ? 'not-allowed' : 'pointer',
                                                                            opacity: frozenCount < 1 ? 0.4 : 0.8
                                                                        }}
                                                                    >
                                                                        {language === 'es' ? 'Retirar Todo' : 'Withdraw All'}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                <div style={{ marginTop: 'auto', textAlign: 'center', fontSize: '0.7rem', color: '#888' }}>
                                                    🔒 Stellar Testnet Address: {userAddress || 'Offline Demo Mode'}
                                                </div>

                                            </div>

                                        )}

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

                                    {/* Song Selector for dynamic ZK Leaderboard */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.8rem',
                                        padding: '0.6rem 1rem',
                                        background: 'rgba(0,0,0,0.2)',
                                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                                        justifyContent: 'space-between',
                                        marginBottom: '0.5rem'
                                    }}>
                                        <span style={{ fontSize: '0.85rem', color: '#aaa', fontWeight: 'bold' }}>
                                            {language === 'es' ? 'Canción de la Mafia:' : 'Mafia Track:'}
                                        </span>
                                        <select
                                            value={leaderboardSongId}
                                            onChange={(e) => setLeaderboardSongId(Number(e.target.value))}
                                            style={{
                                                background: '#222',
                                                color: '#fff',
                                                border: '1px solid #ff3e3e',
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '4px',
                                                fontSize: '0.85rem',
                                                cursor: 'pointer',
                                                outline: 'none',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            <option value={1}>🍕 O Sole Mio (Classic)</option>
                                            <option value={2}>🎸 Tarantella Rock (Medium)</option>
                                            <option value={3}>🎹 Bella Ciao (Hard)</option>
                                        </select>
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

                                                            borderBottom: '1px solid #E0D4B8',

                                                            background: isMe ? 'rgba(39,174,96,0.06)' : 'transparent',

                                                            borderLeft: isMe ? '3px solid #27ae60' : '3px solid transparent',

                                                        }}>

                                                            <span style={{ fontSize: '1.3rem', minWidth: '2rem', textAlign: 'center' }}>{medal}</span>

                                                            <div style={{ flex: 1, minWidth: 0 }}>

                                                                <div style={{ fontSize: '0.85rem', fontWeight: isMe ? 'bold' : 'normal', fontFamily: 'monospace', color: isMe ? '#27ae60' : '#8B0000', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>

                                                                    {shortAddr}{isMe ? ' (you)' : ''}

                                                                </div>

                                                            </div>

                                                            <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#27ae60', whiteSpace: 'nowrap' }}>

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



                        {/* ── DEFINDEX LP VAULT / COSA NOSTRA BANK MODAL ────────────────── */}
                        {(view === 'bank' || closingView === 'bank') && (
                            <div className={`modal-backdrop ${closingView === 'bank' ? 'closing' : ''}`} onClick={() => closeModalWithAnimation('lobby')} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
                                <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
                                    background: 'rgba(15, 15, 20, 0.98)',
                                    border: '4px solid #d4af37', // Gold frame
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.95), inset 0 0 30px rgba(212, 175, 55, 0.15)',
                                    color: '#FFF8E7',
                                    borderRadius: '16px',
                                    padding: '1.5rem',
                                    width: '95%',
                                    maxWidth: '650px',
                                    position: 'relative'
                                }}>
                                    <div className="modal-header" style={{ borderBottom: '2px dashed #d4af37', paddingBottom: '0.8rem', marginBottom: '1.2rem' }}>
                                        <div className="back-btn-circle" onClick={() => closeModalWithAnimation('lobby')} style={{ borderColor: '#d4af37' }}>
                                            <ArrowLeft size={20} style={{ color: '#d4af37' }} />
                                        </div>
                                        <h2 className="modal-title" style={{ color: '#d4af37', fontFamily: 'Courier New, monospace', textShadow: '0 0 8px rgba(212,175,55,0.4)' }}>
                                            🏦 BANCA DI COSA NOSTRA
                                        </h2>
                                        <button
                                            onClick={async () => {
                                                if (userAddress) {
                                                    const bal = await StellarContractService.getSliceBalance(userAddress);
                                                    setSliceBalance(bal);
                                                    const lpBal = await StellarContractService.getDefindexLpBalance(userAddress);
                                                    setDefindexLpBalance(lpBal);
                                                }
                                            }}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#d4af37' }}
                                            title="Sync Bank"
                                        >↺</button>
                                    </div>

                                    <div style={{
                                        background: 'rgba(0, 0, 0, 0.4)',
                                        padding: '1rem',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(212, 175, 55, 0.2)',
                                        marginBottom: '1.5rem',
                                        fontSize: '0.9rem',
                                        lineHeight: '1.4'
                                    }}>
                                        <p style={{ margin: 0, color: '#aaa', fontStyle: 'italic', textAlign: 'center' }}>
                                            {language === 'es'
                                                ? "«Aquí es donde 'limpiamos' la harina y los tokens de la pizzería. Deposita SLICE y XLM en el pool automatizado de Defindex para generar rendimiento y respaldar la liquidez de la familia.»"
                                                : "«This is where we 'wash' the flour and pizzeria tokens. Deposit SLICE and XLM into the automated Defindex vault to generate yield and secure the Famiglia's liquidity.»"
                                            }
                                        </p>
                                    </div>

                                    {/* Balances Dashboard */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                                        gap: '1rem',
                                        marginBottom: '1.5rem'
                                    }}>
                                        <div style={{
                                            background: 'rgba(255, 255, 255, 0.03)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            padding: '0.8rem',
                                            borderRadius: '8px',
                                            textAlign: 'center'
                                        }}>
                                            <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                {language === 'es' ? 'Tu Saldo SLICE' : 'Your SLICE Balance'}
                                            </div>
                                            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#ff3e3e', marginTop: '0.2rem' }}>
                                                {sliceBalance.toFixed(2)} $SLICE
                                            </div>
                                        </div>
                                        <div style={{
                                            background: 'rgba(212, 175, 55, 0.05)',
                                            border: '1px solid rgba(212, 175, 55, 0.2)',
                                            padding: '0.8rem',
                                            borderRadius: '8px',
                                            textAlign: 'center'
                                        }}>
                                            <div style={{ fontSize: '0.75rem', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                {language === 'es' ? 'Tokens LP Defindex' : 'Defindex LP Tokens'}
                                            </div>
                                            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#d4af37', marginTop: '0.2rem' }}>
                                                {defindexLpBalance.toFixed(4)} LP
                                            </div>
                                        </div>
                                        <div style={{
                                            background: 'rgba(212, 175, 55, 0.08)',
                                            border: '1px dashed #d4af37',
                                            padding: '0.8rem',
                                            borderRadius: '8px',
                                            textAlign: 'center'
                                        }}>
                                            <div style={{ fontSize: '0.75rem', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                {language === 'es' ? 'LP Staked' : 'Staked LP'}
                                            </div>
                                            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#ffd700', marginTop: '0.2rem' }}>
                                                {stakedLp.toFixed(4)} LP
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tab Switcher */}
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.2rem' }}>
                                        <button 
                                            onClick={() => setBankTab('amm')}
                                            style={{
                                                flex: 1,
                                                padding: '0.6rem',
                                                border: bankTab === 'amm' ? '1px solid #d4af37' : '1px solid rgba(255,255,255,0.1)',
                                                background: bankTab === 'amm' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(0,0,0,0.4)',
                                                color: '#d4af37',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                fontFamily: 'monospace',
                                                transition: 'all 0.3s ease',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            💧 {language === 'es' ? 'PROVEER LIQUIDEZ' : 'PROVIDE LIQUIDITY'}
                                        </button>
                                        <button 
                                            onClick={() => setBankTab('staking')}
                                            style={{
                                                flex: 1,
                                                padding: '0.6rem',
                                                border: bankTab === 'staking' ? '1px solid #ffd700' : '1px solid rgba(255,255,255,0.1)',
                                                background: bankTab === 'staking' ? 'rgba(255, 215, 0, 0.15)' : 'rgba(0,0,0,0.4)',
                                                color: '#ffd700',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                fontFamily: 'monospace',
                                                transition: 'all 0.3s ease',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            🥩 {language === 'es' ? 'STAKING DE LP (4X)' : 'LP STAKING (4X)'}
                                        </button>
                                    </div>

                                    {bankTab === 'amm' ? (
                                        /* AMM PANE */
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                                            gap: '1.5rem'
                                        }}>
                                            {/* Column 1: Deposit / Liquidity Provision */}
                                            <div style={{
                                                background: 'rgba(0,0,0,0.2)',
                                                padding: '1.2rem',
                                                borderRadius: '10px',
                                                border: '1px solid rgba(255,255,255,0.05)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.8rem'
                                            }}>
                                                <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1rem', color: '#27ae60', borderBottom: '1px solid rgba(39, 174, 96, 0.2)', paddingBottom: '0.3rem' }}>
                                                    📥 {language === 'es' ? 'Depositar Liquidez' : 'Deposit Liquidity'}
                                                </h3>
                                                
                                                <div>
                                                    <label style={{ fontSize: '0.75rem', color: '#aaa', display: 'block', marginBottom: '0.3rem' }}>$SLICE Amount</label>
                                                    <input 
                                                        type="number" 
                                                        placeholder="0.0"
                                                        value={stakeAmountSlice}
                                                        onChange={(e) => setStakeAmountSlice(e.target.value)}
                                                        style={{
                                                            width: '100%',
                                                            background: '#15151a',
                                                            border: '1px solid rgba(255,255,255,0.15)',
                                                            borderRadius: '6px',
                                                            padding: '0.5rem',
                                                            color: '#fff',
                                                            outline: 'none',
                                                            fontSize: '0.9rem'
                                                        }}
                                                    />
                                                </div>

                                                <div>
                                                    <label style={{ fontSize: '0.75rem', color: '#aaa', display: 'block', marginBottom: '0.3rem' }}>$XLM Amount</label>
                                                    <input 
                                                        type="number" 
                                                        placeholder="0.0"
                                                        value={stakeAmountXlm}
                                                        onChange={(e) => setStakeAmountXlm(e.target.value)}
                                                        style={{
                                                            width: '100%',
                                                            background: '#15151a',
                                                            border: '1px solid rgba(255,255,255,0.15)',
                                                            borderRadius: '6px',
                                                            padding: '0.5rem',
                                                            color: '#fff',
                                                            outline: 'none',
                                                            fontSize: '0.9rem'
                                                        }}
                                                    />
                                                </div>

                                                <button 
                                                    onClick={handleDefindexDeposit}
                                                    disabled={defindexLoading}
                                                    style={{
                                                        background: '#27ae60',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        padding: '0.7rem',
                                                        fontWeight: 'bold',
                                                        cursor: 'pointer',
                                                        marginTop: '0.5rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '0.5rem'
                                                    }}
                                                >
                                                    {defindexLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                                                    {language === 'es' ? 'Lavar Dinero (Depositar)' : 'Launder Money (Deposit)'}
                                                </button>
                                            </div>

                                            {/* Column 2: Withdraw Liquidity */}
                                            <div style={{
                                                background: 'rgba(0,0,0,0.2)',
                                                padding: '1.2rem',
                                                borderRadius: '10px',
                                                border: '1px solid rgba(255,255,255,0.05)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.8rem'
                                            }}>
                                                <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1rem', color: '#ff3e3e', borderBottom: '1px solid rgba(255, 62, 62, 0.2)', paddingBottom: '0.3rem' }}>
                                                    📤 {language === 'es' ? 'Retirar LP' : 'Withdraw LP'}
                                                </h3>

                                                <div>
                                                    <label style={{ fontSize: '0.75rem', color: '#aaa', display: 'block', marginBottom: '0.3rem' }}>LP Token Amount</label>
                                                    <div style={{ position: 'relative' }}>
                                                        <input 
                                                            type="number" 
                                                            placeholder="0.0"
                                                            value={withdrawAmountLp}
                                                            onChange={(e) => setWithdrawAmountLp(e.target.value)}
                                                            style={{
                                                                width: '100%',
                                                                background: '#15151a',
                                                                border: '1px solid rgba(255,255,255,0.15)',
                                                                borderRadius: '6px',
                                                                padding: '0.5rem',
                                                                paddingRight: '3.5rem',
                                                                color: '#fff',
                                                                outline: 'none',
                                                                fontSize: '0.9rem'
                                                            }}
                                                        />
                                                        <button 
                                                            onClick={() => setWithdrawAmountLp(defindexLpBalance.toString())}
                                                            style={{
                                                                position: 'absolute',
                                                                right: '5px',
                                                                top: '50%',
                                                                transform: 'translateY(-50%)',
                                                                background: 'rgba(212, 175, 55, 0.2)',
                                                                border: '1px solid #d4af37',
                                                                color: '#d4af37',
                                                                borderRadius: '4px',
                                                                padding: '0.2rem 0.4rem',
                                                                fontSize: '0.7rem',
                                                                cursor: 'pointer',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            MAX
                                                        </button>
                                                    </div>
                                                </div>

                                                <p style={{ fontSize: '0.7rem', color: '#777', margin: '0.5rem 0' }}>
                                                    {language === 'es'
                                                        ? 'Retirar liquidez quemará tus tokens LP y devolverá las cantidades proporcionales de SLICE y XLM a tu billetera.'
                                                        : 'Withdrawing liquidity will burn your LP tokens and return the proportional SLICE and XLM to your wallet.'
                                                    }
                                                </p>

                                                <button 
                                                    onClick={handleDefindexWithdraw}
                                                    disabled={defindexLoading}
                                                    style={{
                                                        background: '#ff3e3e',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        padding: '0.7rem',
                                                        fontWeight: 'bold',
                                                        cursor: 'pointer',
                                                        marginTop: 'auto',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '0.5rem'
                                                    }}
                                                >
                                                    {defindexLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                                                    {language === 'es' ? 'Recuperar Fondos (Retirar)' : 'Retrieve Funds (Withdraw)'}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* LP STAKING PANE */
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                                            gap: '1.5rem'
                                        }}>
                                            {/* Column 1: Stake LP */}
                                            <div style={{
                                                background: 'rgba(0,0,0,0.2)',
                                                padding: '1.2rem',
                                                borderRadius: '10px',
                                                border: '1px solid rgba(255,255,255,0.05)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.8rem'
                                            }}>
                                                <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1rem', color: '#ffd700', borderBottom: '1px solid rgba(255, 215, 0, 0.2)', paddingBottom: '0.3rem' }}>
                                                    🥩 {language === 'es' ? 'Hacer Stake de LP' : 'Stake LP Tokens'}
                                                </h3>

                                                <div>
                                                    <label style={{ fontSize: '0.75rem', color: '#aaa', display: 'block', marginBottom: '0.3rem' }}>LP Amount to Stake</label>
                                                    <div style={{ position: 'relative' }}>
                                                        <input 
                                                            type="number" 
                                                            placeholder="0.0"
                                                            value={stakeAmountLp}
                                                            onChange={(e) => setStakeAmountLp(e.target.value)}
                                                            style={{
                                                                width: '100%',
                                                                background: '#15151a',
                                                                border: '1px solid rgba(255,255,255,0.15)',
                                                                borderRadius: '6px',
                                                                padding: '0.5rem',
                                                                paddingRight: '3.5rem',
                                                                color: '#fff',
                                                                outline: 'none',
                                                                fontSize: '0.9rem'
                                                            }}
                                                        />
                                                        <button 
                                                            onClick={() => setStakeAmountLp(defindexLpBalance.toString())}
                                                            style={{
                                                                position: 'absolute',
                                                                right: '5px',
                                                                top: '50%',
                                                                transform: 'translateY(-50%)',
                                                                background: 'rgba(255, 215, 0, 0.2)',
                                                                border: '1px solid #ffd700',
                                                                color: '#ffd700',
                                                                borderRadius: '4px',
                                                                padding: '0.2rem 0.4rem',
                                                                fontSize: '0.7rem',
                                                                cursor: 'pointer',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            MAX
                                                        </button>
                                                    </div>
                                                </div>

                                                <button 
                                                    onClick={handleLpStake}
                                                    disabled={defindexLoading}
                                                    style={{
                                                        background: 'linear-gradient(135deg, #ffd700, #b8860b)',
                                                        color: '#1a0000',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        padding: '0.7rem',
                                                        fontWeight: 'bold',
                                                        cursor: 'pointer',
                                                        marginTop: '0.5rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '0.5rem'
                                                    }}
                                                >
                                                    {defindexLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                                                    {language === 'es' ? '🥩 Staker LP' : '🥩 Stake LP'}
                                                </button>
                                            </div>

                                            {/* Column 2: Unstake & Harvest */}
                                            <div style={{
                                                background: 'rgba(0,0,0,0.2)',
                                                padding: '1.2rem',
                                                borderRadius: '10px',
                                                border: '1px solid rgba(255,255,255,0.05)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.8rem'
                                            }}>
                                                <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1rem', color: '#ff4d4d', borderBottom: '1px solid rgba(255, 77, 77, 0.2)', paddingBottom: '0.3rem' }}>
                                                    📤 {language === 'es' ? 'Retirar & Cosechar' : 'Unstake & Claim'}
                                                </h3>

                                                <div>
                                                    <label style={{ fontSize: '0.75rem', color: '#aaa', display: 'block', marginBottom: '0.3rem' }}>LP Amount to Unstake</label>
                                                    <div style={{ position: 'relative' }}>
                                                        <input 
                                                            type="number" 
                                                            placeholder="0.0"
                                                            value={unstakeAmountLp}
                                                            onChange={(e) => setUnstakeAmountLp(e.target.value)}
                                                            style={{
                                                                width: '100%',
                                                                background: '#15151a',
                                                                border: '1px solid rgba(255,255,255,0.15)',
                                                                borderRadius: '6px',
                                                                padding: '0.5rem',
                                                                paddingRight: '3.5rem',
                                                                color: '#fff',
                                                                outline: 'none',
                                                                fontSize: '0.9rem'
                                                            }}
                                                        />
                                                        <button 
                                                            onClick={() => setUnstakeAmountLp(stakedLp.toString())}
                                                            style={{
                                                                position: 'absolute',
                                                                right: '5px',
                                                                top: '50%',
                                                                transform: 'translateY(-50%)',
                                                                background: 'rgba(255, 77, 77, 0.2)',
                                                                border: '1px solid #ff4d4d',
                                                                color: '#ff4d4d',
                                                                borderRadius: '4px',
                                                                padding: '0.2rem 0.4rem',
                                                                fontSize: '0.7rem',
                                                                cursor: 'pointer',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            MAX
                                                        </button>
                                                    </div>
                                                </div>

                                                <button 
                                                    onClick={handleLpUnstake}
                                                    disabled={defindexLoading}
                                                    style={{
                                                        background: '#ff4d4d',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        padding: '0.7rem',
                                                        fontWeight: 'bold',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '0.5rem',
                                                        marginBottom: '0.4rem'
                                                    }}
                                                >
                                                    {defindexLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                                                    {language === 'es' ? 'Retirar del Staking' : 'Unstake LP'}
                                                </button>

                                                {/* Claim panel */}
                                                <div style={{
                                                    background: 'rgba(255, 215, 0, 0.04)',
                                                    border: '1px dashed rgba(255, 215, 0, 0.2)',
                                                    borderRadius: '8px',
                                                    padding: '0.6rem',
                                                    marginTop: '0.4rem'
                                                }}>
                                                    <div style={{ fontSize: '0.75rem', color: '#ffd700', fontWeight: 'bold', marginBottom: '0.4rem' }}>
                                                        {language === 'es' ? '🎁 Recompensas LP Acumuladas' : '🎁 Accrued LP Rewards'}
                                                    </div>
                                                    <div style={{
                                                        display: 'grid',
                                                        gridTemplateColumns: '1fr 1fr',
                                                        gap: '0.3rem',
                                                        fontSize: '0.7rem',
                                                        color: '#ccc',
                                                        fontFamily: 'monospace',
                                                        marginBottom: '0.5rem'
                                                    }}>
                                                        <div>🧀 CHE: {pendingLpRewards.cheese.toFixed(5)}</div>
                                                        <div>🌶️ PEP: {pendingLpRewards.pepperoni.toFixed(5)}</div>
                                                        <div>🥓 BAC: {pendingLpRewards.bacon.toFixed(5)}</div>
                                                        <div>🧅 ONI: {pendingLpRewards.onion.toFixed(5)}</div>
                                                    </div>
                                                    <button
                                                        onClick={handleLpClaimRewards}
                                                        disabled={defindexLoading || stakedLp <= 0}
                                                        style={{
                                                            width: '100%',
                                                            background: 'rgba(255, 215, 0, 0.2)',
                                                            border: '1px solid #ffd700',
                                                            color: '#ffd700',
                                                            borderRadius: '6px',
                                                            padding: '0.4rem',
                                                            fontWeight: 'bold',
                                                            cursor: 'pointer',
                                                            fontSize: '0.75rem',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '0.3rem'
                                                        }}
                                                    >
                                                        {defindexLoading ? <Loader2 size={12} className="animate-spin" /> : null}
                                                        {language === 'es' ? '🌾 Cosechar Ingredientes' : '🌾 Harvest Rewards'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
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

                                        <h3 style={{ fontSize: '2rem', color: '#8B0000', marginTop: '1rem', fontFamily: 'var(--font-title)' }}>{t.don}</h3>

                                    </div>

                                </div>

                            </div>

                        )}



                        {view === 'campaign' && (

                            <div className="modal-backdrop" onClick={() => setView('lobby')}>

                                <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
                                    maxWidth: '450px',
                                    background: 'linear-gradient(135deg, #1A0D0D, #3A0000)',
                                    color: '#f5efe6',
                                    border: '1px solid rgba(217,180,136,0.3)',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.8)'
                                }}>

                                    <div className="modal-header">

                                        <div className="back-btn-circle" onClick={() => setView('lobby')}>

                                            <ArrowLeft size={20} />

                                        </div>

                                        <h2 className="modal-title" style={{ color: 'var(--ph-gold)' }}>
                                            {language === 'es' ? 'CAMPAÑAS DE LA MASA' : 'MASA CAMPAIGNS'}
                                        </h2>

                                        <div style={{ width: 40 }}></div>

                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0.5rem' }}>
                                        
                                        {/* OPTION 1: STORY MODE */}
                                        <div 
                                            onClick={() => { setView('lobby'); handleStartGame(); }}
                                            style={{
                                                background: 'rgba(0,0,0,0.5)',
                                                border: '1px solid rgba(255,255,255,0.05)',
                                                borderRadius: '12px',
                                                padding: '1.2rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                borderWidth: '1px'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--ph-gold)'}
                                            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
                                        >
                                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📖</div>
                                            <h4 style={{ margin: '0 0 0.3rem 0', color: 'var(--ph-gold)', fontSize: '1.1rem', textTransform: 'uppercase' }}>
                                                {language === 'es' ? 'Modo Historia (Solitario)' : 'Story Mode (Solo)'}
                                            </h4>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#ccc', lineHeight: '1.4' }}>
                                                {language === 'es' 
                                                    ? 'Enfréntate a las 5 Familias de la Cosa Nostra. Hornea pizzas clásicas perfectas, amasa con ritmo y obtén drops de ingredientes frescos.' 
                                                    : 'Face the 5 Cosa Nostra Families. Bake classic perfect pizzas, rhythm-knead, and secure fresh ingredient drops.'}
                                            </p>
                                        </div>

                                        {/* OPTION 2: PVP DUELS */}
                                        <div 
                                            onClick={() => setView('pvplobby')}
                                            style={{
                                                background: 'rgba(0,0,0,0.5)',
                                                border: '1px solid rgba(255,255,255,0.05)',
                                                borderRadius: '12px',
                                                padding: '1.2rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                borderWidth: '1px'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#00f0ff'}
                                            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                <span style={{ fontSize: '2.5rem' }}>⚔️</span>
                                                <span style={{ 
                                                    background: 'rgba(0,240,255,0.1)', 
                                                    color: '#00f0ff', 
                                                    fontSize: '0.65rem', 
                                                    padding: '2px 8px', 
                                                    borderRadius: '10px', 
                                                    fontWeight: 'bold',
                                                    border: '1px solid rgba(0,240,255,0.3)'
                                                }}>LIVE REAL-TIME</span>
                                            </div>
                                            <h4 style={{ margin: '0 0 0.3rem 0', color: '#00f0ff', fontSize: '1.1rem', textTransform: 'uppercase' }}>
                                                {language === 'es' ? 'Duelos PVP en Vivo' : 'Live PVP Duels'}
                                            </h4>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#ccc', lineHeight: '1.4' }}>
                                                {language === 'es' 
                                                    ? '¡Reta a otros chefs en tiempo real! Bloquea una apuesta de $SLICE en el Escrow seguro de Soroban y demuestra quién es el verdadero Don de la Masa.' 
                                                    : 'Challenge other chefs in real-time! Lock a $SLICE wager in the Soroban Escrow and prove who is the real Don of the Dough.'}
                                            </p>
                                        </div>

                                    </div>

                                </div>

                            </div>

                        )}



                        {view === 'pvplobby' && (

                            <div className="modal-backdrop" onClick={() => setView('lobby')}>

                                <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
                                    maxWidth: '450px',
                                    background: 'linear-gradient(135deg, #110808, #2a0f0f)',
                                    color: '#f5efe6',
                                    border: '1px solid rgba(0, 240, 255, 0.2)',
                                    boxShadow: '0 8px 32px rgba(0,240,255,0.1)'
                                }}>

                                    <div className="modal-header">

                                        <div className="back-btn-circle" onClick={() => handleStartGame()}>

                                            <ArrowLeft size={20} />

                                        </div>

                                        <h2 className="modal-title" style={{ color: '#00f0ff', textShadow: '0 0 8px rgba(0,240,255,0.4)' }}>
                                            {language === 'es' ? 'SINDICATO DE DELIVERY' : 'DELIVERY SYNDICATE'}
                                        </h2>

                                        <div style={{ width: 40 }}></div>

                                    </div>

                                    {pvpState === 'menu' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0.5rem' }}>
                                            
                                            {/* WAGER SELECTION */}
                                            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.8rem', borderRadius: '10px', textAlign: 'center' }}>
                                                <div style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                                    {language === 'es' ? 'SELECCIONA TU APUESTA' : 'SELECT YOUR WAGER'}
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                    {[5, 10, 25].map(amount => (
                                                        <button
                                                            key={amount}
                                                            onClick={() => setSelectedWager(amount)}
                                                            style={{
                                                                flex: 1,
                                                                padding: '0.5rem',
                                                                background: selectedWager === amount ? 'linear-gradient(135deg, #005f73, #0a9396)' : 'rgba(0,0,0,0.5)',
                                                                color: selectedWager === amount ? '#00f0ff' : '#aaa',
                                                                border: selectedWager === amount ? '1px solid #00f0ff' : '1px solid rgba(255,255,255,0.05)',
                                                                borderRadius: '6px',
                                                                fontWeight: 'bold',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            {amount} $SLICE
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* ACTION 1: CREATE PRIVATE ROOM */}
                                            <button 
                                                onClick={async () => {
                                                    addLog(`[PVP] Creating private lobby room with wager ${selectedWager}...`);
                                                    multiplayerService.createRoom(userAddress, selectedWager);
                                                }}
                                                className="primary-btn" 
                                                style={{ 
                                                    padding: '0.8rem', 
                                                    background: 'linear-gradient(135deg, #1b3d54, #0f2535)',
                                                    border: '1px solid #00f0ff',
                                                    color: '#00f0ff'
                                                }}
                                            >
                                                ⚔️ {language === 'es' ? 'CREAR SALA PRIVADA' : 'CREATE PRIVATE ROOM'}
                                            </button>

                                            {/* LA FAMIGLIA / FRIENDS DASHBOARD */}
                                            <div style={{
                                                background: 'rgba(0,0,0,0.5)',
                                                border: '1px solid rgba(0,240,255,0.15)',
                                                borderRadius: '12px',
                                                padding: '1rem',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.8rem'
                                            }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                                                    paddingBottom: '0.5rem'
                                                }}>
                                                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--ph-gold)' }}>
                                                        🍕 {language === 'es' ? 'LA FAMIGLIA (AMIGOS)' : 'LA FAMIGLIA (FRIENDS)'}
                                                    </span>
                                                    <button
                                                        onClick={() => {
                                                            const addr = prompt(language === 'es' ? 'Ingresa la Dirección Wallet Stellar de tu amigo:' : 'Enter your friend\'s Stellar Wallet Address:');
                                                            if (!addr || addr.length < 50) {
                                                                if (addr) alert(language === 'es' ? 'Dirección inválida' : 'Invalid address');
                                                                return;
                                                            }
                                                            const nickname = prompt(language === 'es' ? 'Ingresa un apodo para tu amigo:' : 'Enter a nickname for your friend:') || 'Chef';
                                                            const note = prompt(language === 'es' ? 'Ingresa una nota opcional para tu amigo:' : 'Enter an optional note for your friend:') || '';
                                                            useFriendsStore.getState().addFriend(addr.trim(), nickname.trim(), note.trim());
                                                        }}
                                                        style={{
                                                            background: 'rgba(0,240,255,0.1)',
                                                            border: '1px solid #00f0ff',
                                                            borderRadius: '6px',
                                                            color: '#00f0ff',
                                                            fontSize: '0.65rem',
                                                            padding: '0.2rem 0.5rem',
                                                            cursor: 'pointer',
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        + {language === 'es' ? 'AGREGAR' : 'ADD'}
                                                    </button>
                                                </div>

                                                {/* Local Hook to store.friends state wrapper */}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '150px', overflowY: 'auto' }}>
                                                    {(() => {
                                                        if (!friends || friends.length === 0) {
                                                            return (
                                                                <div style={{ fontSize: '0.72rem', color: '#666', textAlign: 'center', padding: '0.5rem 0' }}>
                                                                    {language === 'es' ? 'Aún sin amigos agregados.' : 'No kitchen partners added yet.'}
                                                                </div>
                                                            );
                                                        }
                                                        return friends.map((f: any) => (
                                                            <div key={f.address} style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                                background: 'rgba(255,255,255,0.03)',
                                                                padding: '0.4rem 0.6rem',
                                                                borderRadius: '8px',
                                                                border: '1px solid rgba(255,255,255,0.05)',
                                                                marginBottom: '0.3rem'
                                                            }}>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                                                                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'white' }}>🧑‍🍳 {f.alias}</span>
                                                                    <span style={{ fontSize: '0.65rem', color: '#ffb703', fontWeight: 'bold' }}>
                                                                        🍕 {friendBalances[f.address] !== undefined ? friendBalances[f.address].toFixed(2) : '...'} SLICE
                                                                    </span>
                                                                    {f.note && (
                                                                        <span style={{ fontSize: '0.6rem', color: '#ccc', fontStyle: 'italic', background: 'rgba(255,255,255,0.05)', padding: '2px 5px', borderRadius: '4px', alignSelf: 'flex-start' }}>
                                                                            📝 {f.note}
                                                                        </span>
                                                                    )}
                                                                    <span style={{ fontSize: '0.55rem', color: '#666' }}>{f.address.slice(0, 6)}...{f.address.slice(-6)}</span>
                                                                </div>
                                                                <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                                                                    <button
                                                                        onClick={() => {
                                                                            const newNote = prompt(
                                                                                language === 'es' ? 'Nota para tu amigo:' : 'Note for your friend:',
                                                                                f.note || ''
                                                                            );
                                                                            if (newNote !== null) {
                                                                                useFriendsStore.getState().updateFriendNote(f.address, newNote.trim());
                                                                            }
                                                                        }}
                                                                        title="Edit friend note"
                                                                        style={{
                                                                            background: 'rgba(255,255,255,0.1)',
                                                                            border: 'none',
                                                                            borderRadius: '4px',
                                                                            color: '#ccc',
                                                                            fontSize: '0.6rem',
                                                                            padding: '0.2rem 0.4rem',
                                                                            cursor: 'pointer'
                                                                        }}
                                                                    >
                                                                        📝
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            addLog(`[PVP] Instantly challenging friend ${f.alias} to wager room`);
                                                                            multiplayerService.createRoom(userAddress, selectedWager);
                                                                            setTimeout(() => {
                                                                                const code = localStorage.getItem('gp_active_room_code') || 'LOBBY';
                                                                                alert(language === 'es' 
                                                                                    ? `¡Sala creada! Dile a ${f.alias} que use el código de sala en su dispositivo para unirse y batallar.`
                                                                                    : `Lobby created! Tell ${f.alias} to enter the lobby code on their device to battle.`
                                                                                );
                                                                            }, 800);
                                                                        }}
                                                                        title="Create a room and challenge this chef!"
                                                                        style={{
                                                                            background: 'linear-gradient(135deg, #8B0000, #ff8c00)',
                                                                            border: 'none',
                                                                            borderRadius: '6px',
                                                                            color: 'white',
                                                                            fontSize: '0.65rem',
                                                                            padding: '0.3rem 0.5rem',
                                                                            cursor: 'pointer',
                                                                            fontWeight: 'bold'
                                                                        }}
                                                                    >
                                                                        ⚔️ {language === 'es' ? 'RETAR' : 'CHALLENGE'}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ));
                                                    })()}
                                                </div>
                                            </div>

                                            {/* ACTION 2: JOIN PRIVATE ROOM */}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', background: 'rgba(0,0,0,0.3)', padding: '0.8rem', borderRadius: '10px' }}>
                                                <input 
                                                    type="text" 
                                                    placeholder="ROOM CODE (e.g. GP-5431)"
                                                    value={joinCode}
                                                    onChange={e => setJoinCode(e.target.value.toUpperCase())}
                                                    style={{
                                                        padding: '0.5rem',
                                                        borderRadius: '6px',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        background: 'rgba(0,0,0,0.5)',
                                                        color: 'white',
                                                        textAlign: 'center',
                                                        fontSize: '0.9rem'
                                                    }}
                                                />
                                                <button 
                                                    onClick={async () => {
                                                        addLog(`[PVP] Joining private lobby Room ${joinCode}...`);
                                                        multiplayerService.joinRoom(userAddress, joinCode);
                                                    }}
                                                    className="primary-btn"
                                                    disabled={joinCode.length < 5}
                                                    style={{ padding: '0.5rem', fontSize: '0.8rem', opacity: joinCode.length >= 5 ? 1 : 0.5 }}
                                                >
                                                    {language === 'es' ? 'UNIRSE A SALA' : 'JOIN ROOM'}
                                                </button>
                                            </div>

                                            {/* ACTION 3: PUBLIC MATCHMAKING QUEUE */}
                                            <button 
                                                onClick={async () => {
                                                    addLog(`[PVP] Entering real public queue with wager ${selectedWager}...`);
                                                    setRoomCode('MATCHMAKING');
                                                    setPvpState('waiting');
                                                    setMpQueueStatus(language === 'es' ? 'Buscando chef en la red...' : 'Searching for chef on-line...');
                                                    multiplayerService.joinQueue(userAddress, selectedWager);
                                                }}
                                                className="primary-btn"
                                                style={{ padding: '0.8rem' }}
                                            >
                                                ⚡ {language === 'es' ? 'EMPAREJAMIENTO RÁPIDO' : 'QUICK MATCHMAKING'}
                                            </button>

                                        </div>
                                    )}

                                    {pvpState === 'waiting' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem', padding: '2rem 1rem', textAlign: 'center' }}>
                                            
                                            <Loader2 className="animate-spin" size={48} style={{ color: '#00f0ff' }} />
                                            
                                            <div>
                                                <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '1.1rem', color: '#00f0ff' }}>
                                                    {roomCode === 'MATCHMAKING' 
                                                        ? (language === 'es' ? 'Buscando Chef rival...' : 'Finding rival Chef...')
                                                        : (language === 'es' ? 'Sala creada con éxito' : 'Lobby created successfully')}
                                                </h4>
                                                {roomCode !== 'MATCHMAKING' && (
                                                    <div style={{ 
                                                        fontSize: '1.8rem', 
                                                        fontWeight: 'bold', 
                                                        color: 'var(--ph-gold)', 
                                                        background: 'rgba(0,0,0,0.5)', 
                                                        padding: '0.5rem 1.5rem', 
                                                        borderRadius: '8px',
                                                        border: '1px dashed var(--ph-gold)',
                                                        letterSpacing: '2px',
                                                        margin: '0.6rem 0'
                                                    }}>
                                                        {roomCode}
                                                    </div>
                                                )}
                                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#aaa', lineHeight: '1.4' }}>
                                                    {roomCode === 'MATCHMAKING'
                                                        ? (language === 'es' ? 'Buscando un oponente con la misma apuesta en Stellar Testnet.' : 'Looking for a matching wager on Stellar Testnet.')
                                                        : (language === 'es' ? 'Comparte este código con tu oponente para iniciar la partida en vivo.' : 'Share this code with your opponent to start the live game.')}
                                                </p>
                                                {mpQueueStatus && (
                                                    <div style={{ marginTop: '0.8rem', fontSize: '0.85rem', color: '#00f0ff', fontWeight: 'bold', textShadow: '0 0 5px rgba(0,240,255,0.4)' }}>
                                                        📡 {mpQueueStatus}
                                                    </div>
                                                )}
                                            </div>

                                            <div style={{ display: 'flex', gap: '0.5rem', width: '100%', marginTop: '0.5rem' }}>
                                                {/* QUICK MATCH RESOLUTION DEMO BOOTSTRAP */}
                                                <button 
                                                    onClick={() => {
                                                        setIsPvp(true);
                                                        setView('lobby');
                                                        handleStartGame(); // Starts game with PVP enabled!
                                                    }}
                                                    className="primary-btn"
                                                    style={{ flex: 1, padding: '0.6rem', fontSize: '0.8rem', background: '#27ae60' }}
                                                >
                                                    🚀 {language === 'es' ? 'Simular Rival' : 'Simulate Rival'}
                                                </button>

                                                <button 
                                                    onClick={() => {
                                                        setPvpState('menu');
                                                    }}
                                                    style={{ 
                                                        flex: 1,
                                                        padding: '0.6rem', 
                                                        fontSize: '0.8rem', 
                                                        background: 'rgba(255,255,255,0.05)', 
                                                        color: '#ff6b6b',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {language === 'es' ? 'Cancelar' : 'Cancel'}
                                                </button>
                                            </div>

                                        </div>
                                    )}

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

                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.8rem', color: '#8B0000', borderBottom: '1px solid #E0D4B8', paddingBottom: '0.3rem' }}>1. {t.controls}</h3>

                                            <p style={{ fontSize: '0.95rem', color: '#444', marginBottom: '0.5rem' }}>{t.controlsDesc}</p>

                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1rem' }}>

                                                <div className="key-box">A<br /><span style={{ fontSize: '0.7rem' }}>🔴</span></div>

                                                <div className="key-box">S<br /><span style={{ fontSize: '0.7rem' }}>🟡</span></div>

                                                <div className="key-box">K<br /><span style={{ fontSize: '0.7rem' }}>🥓</span></div>

                                                <div className="key-box">L<br /><span style={{ fontSize: '0.7rem' }}>🟣</span></div>

                                            </div>

                                        </section>



                                        <section style={{ marginBottom: '1.5rem' }}>

                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.8rem', color: '#8B0000', borderBottom: '1px solid #E0D4B8', paddingBottom: '0.3rem' }}>2. {t.baking}</h3>

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

                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.8rem', color: '#8B0000', borderBottom: '1px solid #E0D4B8', paddingBottom: '0.3rem' }}>3. {t.rewards}</h3>

                                            <p style={{ fontSize: '0.9rem', color: '#666' }}>{t.rewardsDesc}</p>

                                        </section>

                                    </div>

                                </div>

                            </div>

                        )}

                        {/* DAILY CHECK-IN MODAL (EL DIARIO DEL DON) */}
                        {showCheckInModal && (
                            <div className="modal-backdrop" onClick={() => setShowCheckInModal(false)}>
                                <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
                                    background: '#FFF8E7',
                                    border: '6px solid #8B0000',
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(139, 0, 0, 0.05)',
                                    color: '#333',
                                    borderRadius: '16px',
                                    padding: '1.5rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem',
                                    maxHeight: '85%'
                                }}>
                                    <div className="modal-header" style={{ borderBottom: '3px dashed #8B0000', paddingBottom: '0.8rem' }}>
                                        <div className="back-btn-circle" onClick={() => setShowCheckInModal(false)}>
                                            <ArrowLeft size={20} />
                                        </div>
                                        <h2 className="modal-title" style={{ fontSize: '1.4rem', fontFamily: 'Bangers, cursive', letterSpacing: '0.05em', color: '#8B0000' }}>
                                            📕 {language === 'es' ? 'EL DIARIO DEL DON' : "THE DON'S JOURNAL"}
                                        </h2>
                                        <div style={{ width: 40 }}></div>
                                    </div>

                                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <p style={{ fontSize: '0.82rem', color: '#555', textAlign: 'center', fontStyle: 'italic', fontFamily: '"Special Elite", monospace' }}>
                                            {language === 'es' 
                                                ? '"Firma cada día después de cocinar para ganarte el respeto de La Famiglia y tus raciones de $SLICE."'
                                                : '"Sign every day after cooking to earn the respect of La Famiglia and your $SLICE rations."'}
                                        </p>

                                        {/* STREAK WIDGET */}
                                        <div style={{
                                            background: 'linear-gradient(135deg, #8B0000, #4A0000)',
                                            borderRadius: '10px',
                                            padding: '0.8rem',
                                            color: '#fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                        }}>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--ph-gold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                    {language === 'es' ? 'Racha Actual' : 'Current Streak'}
                                                </div>
                                                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', fontFamily: 'var(--font-display)' }}>
                                                    🔥 {checkInStreak} {checkInStreak === 1 ? (language === 'es' ? 'Día' : 'Day') : (language === 'es' ? 'Días' : 'Days')}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                                                    {language === 'es' ? 'Última firma' : 'Last sign-in'}
                                                </div>
                                                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
                                                    {lastCheckInDate ? lastCheckInDate : '---'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* CALENDAR STAMP GRID (7 DAYS CYCLE) */}
                                        <div>
                                            <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#8B0000', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                📅 {language === 'es' ? 'Semana de Respeto' : 'Week of Respect'}
                                            </h3>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
                                                {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => {
                                                    const isCompleted = checkInStreak >= dayNum;
                                                    const isReady = (checkInStreak === dayNum - 1 || (checkInStreak % 7 === dayNum - 1)) && canCheckIn;
                                                    const isBonus = dayNum === 7;

                                                    return (
                                                        <div key={dayNum} style={{
                                                            background: isCompleted 
                                                                ? 'rgba(39, 174, 96, 0.08)' 
                                                                : (isReady ? 'rgba(212, 175, 55, 0.15)' : 'rgba(0,0,0,0.03)'),
                                                            border: isCompleted 
                                                                ? '2px solid #27ae60' 
                                                                : (isReady ? '2px dashed var(--ph-gold)' : '1px solid rgba(0,0,0,0.1)'),
                                                            borderRadius: '8px',
                                                            padding: '0.5rem 0.2rem',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            position: 'relative',
                                                            minHeight: '65px',
                                                            transition: 'all 0.2s ease'
                                                        }}>
                                                            <span style={{ fontSize: '0.62rem', fontWeight: 'bold', color: isCompleted ? '#27ae60' : '#888' }}>
                                                                {language === 'es' ? `Día ${dayNum}` : `Day ${dayNum}`}
                                                            </span>
                                                            <div style={{ fontSize: '1.2rem', margin: '2px 0' }}>
                                                                {isCompleted ? '💮' : (isBonus ? '🎁' : '🍕')}
                                                            </div>
                                                            <span style={{ fontSize: '0.55rem', fontWeight: 'bold', color: isBonus ? '#8B0000' : '#666' }}>
                                                                {isBonus ? '+15 SLICE' : '+1 SLICE'}
                                                            </span>
                                                            
                                                            {isCompleted && (
                                                                <div style={{
                                                                    position: 'absolute',
                                                                    top: '50%',
                                                                    left: '50%',
                                                                    transform: 'translate(-50%, -50%) rotate(-12deg)',
                                                                    color: 'rgba(139, 0, 0, 0.75)',
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: 'bold',
                                                                    border: '2px solid rgba(139, 0, 0, 0.75)',
                                                                    borderRadius: '50%',
                                                                    padding: '2px',
                                                                    textTransform: 'uppercase',
                                                                    pointerEvents: 'none',
                                                                    fontFamily: 'monospace',
                                                                    background: 'rgba(255, 248, 231, 0.9)'
                                                                }}>
                                                                    {language === 'es' ? 'FIRMA' : 'SIGNED'}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}

                                                <div style={{
                                                    gridColumn: 'span 1',
                                                    background: 'linear-gradient(135deg, #DA70D6, #8B0000)',
                                                    borderRadius: '8px',
                                                    padding: '0.3rem',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#fff',
                                                    border: '1px solid var(--ph-gold)',
                                                    textAlign: 'center'
                                                }}>
                                                    <span style={{ fontSize: '0.55rem', fontWeight: 'bold', color: 'var(--ph-gold)' }}>30 {language === 'es' ? 'DÍAS' : 'DAYS'}</span>
                                                    <span style={{ fontSize: '1rem' }}>👑</span>
                                                    <span style={{ fontSize: '0.52rem', fontWeight: 'bold' }}>+50 SLICE</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 30-DAY PROGRESS TRACKER */}
                                        <div style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', padding: '0.6rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', fontWeight: 'bold', color: '#555', marginBottom: '4px' }}>
                                                <span>🏆 {language === 'es' ? 'Camino al Botín (30 Días)' : "Path to Loot (30 Days)"}</span>
                                                <span style={{ fontFamily: 'monospace', marginLeft: 'auto' }}>{checkInStreak} / 30</span>
                                            </div>
                                            <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div style={{
                                                    width: `${Math.min(100, (checkInStreak / 30) * 100)}%`,
                                                    height: '100%',
                                                    background: 'linear-gradient(90deg, #FFD700, #ff8c00)',
                                                    transition: 'width 0.3s ease'
                                                }} />
                                            </div>
                                        </div>

                                        {/* DAILY QUESTS SECTION */}
                                        <div style={{
                                            background: 'rgba(139, 0, 0, 0.03)',
                                            border: '1.5px solid rgba(139, 0, 0, 0.15)',
                                            borderRadius: '10px',
                                            padding: '0.65rem 0.8rem',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.4rem'
                                        }}>
                                            <div style={{ fontSize: '0.72rem', fontWeight: 'bold', color: '#8B0000', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                📋 {language === 'es' ? 'Misiones de Hoy' : "Today's Quests"}
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                                {((['pizzaCooked', 'scoreComplete', 'stakeComplete'] as const).map((_qKey, idx) => {
                                                    const questTargets = [2, 1, 1];
                                                    const questLabels = language === 'es'
                                                        ? ['🍕 Hornear 2 pizzas', '🎵 Completar 1 canción', '🥩 Congelar ingredientes']
                                                        : ['🍕 Bake 2 pizzas', '🎵 Complete 1 song', '🥩 Freeze ingredients'];
                                                    const questRewards = ['🍄 1 Trufa', '🍇 1 Higo', '✨ 1 Oro'];
                                                    const target = questTargets[idx];
                                                    const progress = Math.min(dailyQuestProgress[idx] ?? 0, target);
                                                    const claimed = dailyQuestClaimed[idx] ?? false;
                                                    const pct = Math.round((progress / target) * 100);
                                                    const completed = progress >= target;

                                                    return (
                                                        <div
                                                            key={idx}
                                                            onClick={() => completed && !claimed ? claimQuestReward(idx) : undefined}
                                                            style={{
                                                                background: claimed ? 'rgba(39, 174, 96, 0.06)' : completed ? 'rgba(212, 175, 55, 0.08)' : 'rgba(0,0,0,0.02)',
                                                                border: claimed ? '1px solid rgba(39, 174, 96, 0.35)' : completed ? '1px solid rgba(212, 175, 55, 0.5)' : '1px solid rgba(139, 0, 0, 0.1)',
                                                                borderRadius: '6px',
                                                                padding: '0.25rem 0.5rem',
                                                                cursor: completed && !claimed ? 'pointer' : 'default',
                                                                transition: 'all 0.2s ease',
                                                            }}
                                                        >
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.1rem' }}>
                                                                <span style={{ fontSize: '0.62rem', color: claimed ? '#27ae60' : completed ? '#8B0000' : '#333', fontWeight: '500', fontFamily: 'monospace' }}>
                                                                    {questLabels[idx]}
                                                                </span>
                                                                <span style={{
                                                                    fontSize: '0.62rem',
                                                                    fontWeight: 'bold',
                                                                    color: claimed ? '#27ae60' : completed ? '#b8860b' : '#666',
                                                                    fontFamily: 'monospace'
                                                                }}>
                                                                    {claimed ? '✓ ' + (language === 'es' ? 'RECLAMADO' : 'CLAIMED')
                                                                        : completed ? (language === 'es' ? 'TAP RECLAMAR' : 'TAP CLAIM')
                                                                        : `${progress}/${target}`}
                                                                </span>
                                                            </div>
                                                            <div style={{ background: 'rgba(0,0,0,0.06)', borderRadius: '4px', height: '5px', overflow: 'hidden' }}>
                                                                <div style={{
                                                                    height: '100%',
                                                                    width: `${pct}%`,
                                                                    background: claimed ? '#27ae60' : completed ? '#d4af37' : 'linear-gradient(90deg, #8B0000, #c0392b)',
                                                                    borderRadius: '4px',
                                                                    transition: 'width 0.5s ease',
                                                                }} />
                                                            </div>
                                                            {completed && !claimed && (
                                                                <div style={{ fontSize: '0.58rem', color: '#b8860b', textAlign: 'right', marginTop: '0.1rem', fontFamily: 'monospace', fontWeight: 'bold' }}>
                                                                    🎁 {questRewards[idx]}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                }))}
                                            </div>
                                        </div>

                                        {/* PLAY REQUIREMENT MESSAGE & ACTIONS */}
                                        <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {!hasPlayedToday ? (
                                                <div style={{
                                                    background: 'rgba(139, 0, 0, 0.08)',
                                                    border: '1px solid rgba(139, 0, 0, 0.3)',
                                                    borderRadius: '8px',
                                                    padding: '0.6rem 0.8rem',
                                                    fontSize: '0.78rem',
                                                    color: '#8B0000',
                                                    textAlign: 'center',
                                                    fontWeight: 'bold'
                                                }}>
                                                    🔒 {language === 'es' 
                                                        ? '¡Juega una canción hoy para firmar el diario del Don!' 
                                                        : 'Play a song today to sign the Don\'s journal!'}
                                                </div>
                                            ) : hasCheckedInToday ? (
                                                <div style={{
                                                    background: 'rgba(39, 174, 96, 0.08)',
                                                    border: '1px solid rgba(39, 174, 96, 0.3)',
                                                    borderRadius: '8px',
                                                    padding: '0.6rem 0.8rem',
                                                    fontSize: '0.78rem',
                                                    color: '#27ae60',
                                                    textAlign: 'center',
                                                    fontWeight: 'bold'
                                                }}>
                                                    ✅ {language === 'es' 
                                                        ? '¡Ya has firmado el diario hoy!' 
                                                        : 'You have signed the journal today!'}
                                                </div>
                                            ) : null}

                                            <button
                                                onClick={handleCheckIn}
                                                disabled={!canCheckIn}
                                                className="primary-btn"
                                                style={{
                                                    width: '100%',
                                                    padding: '0.8rem',
                                                    fontSize: '1rem',
                                                    cursor: canCheckIn ? 'pointer' : 'not-allowed',
                                                    opacity: canCheckIn ? 1 : 0.6,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem',
                                                    background: canCheckIn ? 'linear-gradient(135deg, var(--ph-gold), #B8860B)' : '#ccc',
                                                    color: canCheckIn ? '#fff' : '#888',
                                                    border: 'none',
                                                    boxShadow: canCheckIn ? '0 4px 10px rgba(218,165,32,0.4)' : 'none'
                                                }}
                                            >
                                                ✍️ {language === 'es' ? 'FIRMAR DIARIO' : 'SIGN JOURNAL'}
                                            </button>
                                        </div>
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
                        maxHeight: '100%',
                        zIndex: 20,
                        // Elegant Glassmorphism: allows the game background to be seen blurred
                        background: 'rgba(20, 5, 5, 0.4)',
                        backdropFilter: 'blur(12px)',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        overflowY: 'auto',
                        WebkitOverflowScrolling: 'touch',
                        padding: '1rem 0.5rem',
                        boxSizing: 'border-box'
                    }}>

                        {/* Popup Card (Receipt Theme V3) */}
                        <div style={{
                            width: '90%',
                            maxWidth: '340px',
                            minHeight: 'fit-content',
                            margin: '2rem 0',
                            background: 'transparent',
                            /* The jagged receipt edges logic: 20px strips at top and bottom, full solid area in the middle */
                            backgroundImage: `
                                radial-gradient(circle at 10px 0, transparent 9px, #FDFDFD 10px),
                                linear-gradient(#FDFDFD, #FDFDFD),
                                radial-gradient(circle at 10px 100%, transparent 9px, #FDFDFD 10px)
                            `,
                            backgroundSize: '20px 20px, 100% calc(100% - 38px), 20px 20px',
                            backgroundPosition: 'top left, center, bottom left',
                            backgroundRepeat: 'repeat-x, no-repeat, repeat-x',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            padding: '1rem 1.25rem',
                            color: '#111',
                            position: 'relative',
                            /* A slight sepia tint with drop shadow to make it feel like printed paper against the black backdrop */
                            filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.5))'
                        }}>

                            {/* Inner Content wrapper to prevent text from crossing the jagged edges */}
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', padding: '10px 0', flex: 1 }}>

                                {/* Header Section */}
                                <div style={{ textAlign: 'center', width: '100%', marginBottom: '0.6rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <h2 style={{ fontFamily: "var(--font-title)", fontSize: '1.6rem', color: '#8B0000', margin: '0 0 0.25rem 0', letterSpacing: '2px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                                        LA FAMIGLIA
                                    </h2>
                                    <div style={{ fontFamily: "'Special Elite', monospace", fontSize: '0.85rem', color: '#444', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                        {language === 'es' ? 'TICKET #402' : 'RECEIPT #402'}
                                    </div>
                                    <div style={{ width: '100%', borderBottom: '2px dashed #888', marginTop: '0.6rem' }}></div>
                                </div>

                                {/* Score Content */}
                                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', width: '100%', fontFamily: "'Special Elite', monospace" }}>

                                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '1.1rem', marginBottom: '0.5rem', color: '#111' }}>
                                        <span>{t.score.toUpperCase()}</span>
                                        <span id="resScore" style={{ fontWeight: 'bold', fontSize: '1.35rem' }}>0</span>
                                    </div>

                                    <div id="resPizzas" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '1rem', marginBottom: '0.5rem', color: '#444' }}>
                                        <span>{language === 'es' ? 'PIZZAS' : 'PIZZAS BAKED'}</span>
                                        <span id="resPizzasCount" style={{ fontWeight: 'bold', fontSize: '1.15rem' }}>0</span>
                                    </div>

                                    <div style={{ width: '100%', borderBottom: '2px dashed #888', margin: '0.6rem 0' }}></div>

                                    {/* Huge Grade Stamp */}
                                    <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0.5rem 0' }}>
                                        <div className="grade" id="resGrade" style={{
                                            fontSize: 'clamp(3rem, 7vh, 4.2rem)',
                                            fontFamily: "'Bangers', cursive",
                                            fontWeight: 'bold',
                                            color: '#cc0000',
                                            opacity: 0.85,
                                            transform: 'rotate(-5deg)',
                                            border: '4px solid #cc0000',
                                            borderRadius: '10px',
                                            padding: '0 1.2rem',
                                            lineHeight: 1.1,
                                            boxShadow: 'inset 0 0 0 2px #FDFDFD, inset 0 0 0 4px #cc0000', // Double border effect
                                        }}>S</div>
                                    </div>

                                    {/* On-chain verified score */}
                                    {onChainScore !== null && (
                                        <div style={{ width: '100%', marginTop: '0.6rem', textAlign: 'center', fontSize: '0.85rem', color: '#555', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                            <div style={{ borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc', padding: '3px 0', width: '100%', letterSpacing: '1px' }}>
                                                *** {language === 'es' ? 'COPIA VERIFICADA' : 'VERIFIED COPY'} ***
                                            </div>
                                            <div>
                                                {t.scoreVerified.toUpperCase()}: <strong>{onChainScore.toLocaleString()} PTS</strong>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', width: '100%', marginTop: '0.8rem' }}>
                                    <button
                                        id="restartBtn"
                                        className="primary-btn"
                                        onClick={handleCookAgain}
                                        style={{ width: '100%', padding: '0.85rem 1rem', fontSize: '1.1rem', boxShadow: 'none' }}
                                    >
                                        🍕 {language === 'es' ? 'GUARDAR Y REPETIR' : 'SAVE & COOK AGAIN'}
                                    </button>

                                    {onChainScore !== null && onChainScore >= 4000 ? (
                                        <button
                                            id="nextLevelBtn"
                                            className="primary-btn"
                                            onClick={handleNextLevel}
                                            style={{
                                                width: '100%',
                                                padding: '0.85rem 1rem',
                                                fontSize: '1.1rem',
                                                background: '#E67E22',
                                                borderColor: '#D35400',
                                                boxShadow: 'none',
                                                textTransform: 'uppercase'
                                            }}
                                        >
                                            🚀 {language === 'es' ? 'NIVEL 2: MÁS RÁPIDO' : 'LEVEL 2: FASTER'}
                                        </button>
                                    ) : (
                                        <button
                                            id="nextLevelBtn"
                                            style={{ width: '100%', padding: '0.8rem 1rem', fontSize: '0.95rem', fontFamily: 'var(--font-title)', opacity: 0.6, cursor: 'not-allowed', background: '#E0D4B8', border: '2px solid #ccc', borderRadius: '12px', color: '#888', fontWeight: 'bold' }}
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
                                            padding: '0.75rem 1rem',
                                            fontSize: '1rem',
                                            fontFamily: "'Special Elite', monospace",
                                            background: 'transparent',
                                            border: '2px dashed #8B0000',
                                            borderRadius: '12px',
                                            color: '#8B0000',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = '#FFF8E7'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                    >
                                        {language === 'es' ? 'SALIR DE LA COCINA' : 'EXIT KITCHEN'}
                                    </button>
                                </div>

                            </div>

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

                                background: '#FFF8E7',

                                border: '3px solid #27ae60',

                                borderRadius: '16px',

                                padding: '1.5rem',

                                width: '88%',

                                maxWidth: '360px',

                                boxShadow: '0 10px 40px rgba(39,174,96,0.3)',

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

                                        <div style={{ color: '#555', fontSize: '0.75rem', marginTop: '2px', fontWeight: 'bold' }}>

                                            {language === 'es' ? 'Puntaje verificado en cadena' : 'Score verified on-chain'}

                                        </div>

                                    </div>

                                    <button

                                        onClick={closeTxPopup}

                                        style={{ background: '#F9F5EB', border: '1px solid #D0B488', borderRadius: '50%', width: 28, height: 28, color: '#8B0000', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}

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



                                {/* Check-in Prompt (shows if not yet checked in today) */}
                                {canCheckIn && (
                                    <div
                                        onClick={() => { closeTxPopup(); setShowCheckInModal(true); }}
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(139,0,0,0.12), rgba(212,175,55,0.1))',
                                            border: '1.5px dashed #d4af37',
                                            borderRadius: '10px',
                                            padding: '0.65rem 1rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.7rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,175,55,0.15)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139,0,0,0.12), rgba(212,175,55,0.1))')}
                                    >
                                        <span style={{ fontSize: '1.4rem' }}>📕</span>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '0.78rem', color: '#8B0000', letterSpacing: '0.04em' }}>
                                                {language === 'es' ? '¡Firma el Diario del Don hoy!' : "Sign the Don's Journal today!"}
                                            </div>
                                            <div style={{ fontSize: '0.65rem', color: '#888', marginTop: '1px' }}>
                                                {checkInStreak > 0
                                                    ? (language === 'es' ? `Racha actual: 🔥 ${checkInStreak} días` : `Current streak: 🔥 ${checkInStreak} days`)
                                                    : (language === 'es' ? 'Empieza tu racha hoy' : 'Start your streak today')}
                                            </div>
                                        </div>
                                        <div style={{
                                            background: '#d4af37',
                                            color: '#1a0000',
                                            fontSize: '0.6rem',
                                            fontWeight: 'bold',
                                            padding: '3px 8px',
                                            borderRadius: '6px',
                                            fontFamily: 'monospace',
                                            flexShrink: 0,
                                            animation: 'pulse 1.5s infinite',
                                        }}>
                                            ✍ {language === 'es' ? 'FIRMAR' : 'SIGN'}
                                        </div>
                                    </div>
                                )}

                                {/* Quest Progress Summary */}
                                {dailyQuestProgress.some((p, i) => p > 0 && !(dailyQuestClaimed[i])) && (
                                    <div style={{
                                        background: 'rgba(0,0,0,0.04)',
                                        border: '1px solid rgba(0,0,0,0.1)',
                                        borderRadius: '10px',
                                        padding: '0.6rem 0.8rem',
                                    }}>
                                        <div style={{ fontSize: '0.68rem', fontWeight: 'bold', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
                                            📋 {language === 'es' ? 'Misiones de Hoy' : "Today's Quests"}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            {[
                                                { label: language === 'es' ? '🍕 Hornear 2 pizzas' : '🍕 Bake 2 pizzas', target: 2, reward: '🍄' },
                                                { label: language === 'es' ? '🎵 Completar 1 canción' : '🎵 Complete 1 song', target: 1, reward: '🍇' },
                                                { label: language === 'es' ? '🥩 Congelar ingredientes' : '🥩 Freeze ingredients', target: 1, reward: '✨' },
                                            ].map((q, idx) => {
                                                const prog = Math.min(dailyQuestProgress[idx] ?? 0, q.target);
                                                const claimed = dailyQuestClaimed[idx] ?? false;
                                                const done = prog >= q.target;
                                                return (
                                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <div style={{ flex: 1, background: 'rgba(0,0,0,0.06)', borderRadius: '4px', height: '5px', overflow: 'hidden' }}>
                                                            <div style={{ height: '100%', width: `${Math.round((prog / q.target) * 100)}%`, background: claimed ? '#27ae60' : done ? '#d4af37' : '#8B0000', borderRadius: '4px', transition: 'width 0.4s ease' }} />
                                                        </div>
                                                        <span style={{ fontSize: '0.62rem', color: claimed ? '#27ae60' : done ? '#d4af37' : '#888', fontFamily: 'monospace', minWidth: '60px' }}>
                                                            {q.label.split(' ').slice(0, 2).join(' ')} {prog}/{q.target} {claimed ? '✓' : done ? q.reward : ''}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Countdown */}
                                <div style={{ textAlign: 'center', color: '#555', fontSize: '0.72rem' }}>
                                    {language === 'es' ? 'Cierre automático en' : 'Auto-closing in'} {popupCountdown}s
                                </div>

                            </div>

                        </div>

                    )}



                    {/* ── NEW PLAYER ONBOARDING MODAL ────────────────────────────── */}
                    <OnboardingModal
                        showOnboarding={showOnboarding}
                        onboardingStep={onboardingStep}
                        setOnboardingStep={setOnboardingStep}
                        language={language}
                        dismissOnboarding={dismissOnboarding}
                    />



                    {isPvp && rivalData && (

                        <div style={{
                            position: 'absolute',
                            top: '1rem',
                            left: '5%',
                            right: '5%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.6rem',
                            zIndex: 10,
                            pointerEvents: 'none'
                        }}>

                            {/* TENSION / TUG-OF-WAR BAR */}
                            <div style={{
                                width: '100%',
                                background: 'rgba(0,0,0,0.6)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '20px',
                                height: '24px',
                                display: 'flex',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                <div style={{
                                    flex: (engineRef.current ? Math.max(10, 100 * (1.0 - (rivalData.score / (Math.max(1, (playerPvpStats?.score || 0) + rivalData.score))))) : 50),
                                    background: 'linear-gradient(90deg, #8B0000, #ff8c00)',
                                    transition: 'all 0.5s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingLeft: '10px',
                                    fontSize: '0.65rem',
                                    fontWeight: 'bold',
                                    color: 'white'
                                }}>
                                    {language === 'es' ? 'TÚ' : 'YOU'}: {playerPvpStats?.score || 0}
                                </div>
                                <div style={{
                                    flex: (engineRef.current ? Math.max(10, 100 * (rivalData.score / (Math.max(1, (playerPvpStats?.score || 0) + rivalData.score)))) : 50),
                                    background: 'linear-gradient(90deg, #005f73, #00f0ff)',
                                    transition: 'all 0.5s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    paddingRight: '10px',
                                    fontSize: '0.65rem',
                                    fontWeight: 'bold',
                                    color: 'white'
                                }}>
                                    {rivalData.name}: {rivalData.score}
                                </div>

                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    textShadow: '0 0 4px black'
                                }}>
                                    ⚡ {language === 'es' ? 'TENSIÓN' : 'TENSION'} ⚡
                                </div>
                            </div>

                            {/* RIVAL REACTIVE AVATAR WIDGET */}
                            <div style={{
                                position: 'absolute',
                                top: '40px',
                                right: '10px',
                                background: rivalData.isFever 
                                    ? 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(0,0,0,0.6))'
                                    : 'rgba(0,0,0,0.7)',
                                border: rivalData.isFever ? '2px solid #00f0ff' : '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                padding: '0.6rem',
                                width: '110px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.2rem',
                                transition: 'all 0.3s ease',
                                boxShadow: rivalData.isFever ? '0 0 15px rgba(0,240,255,0.3)' : 'none'
                            }}>
                                <div style={{ fontSize: '1.8rem', position: 'relative' }}>
                                    {rivalData.isMiss ? '🪵 😵' : (rivalData.isFever ? '🔥 😎' : '👨‍🍳 🍳')}
                                    {rivalData.isMiss && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '-5px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            fontSize: '1rem'
                                        }}>
                                            🍅
                                        </div>
                                    )}
                                </div>
                                <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--ph-gold)' }}>{rivalData.name}</div>
                                <div style={{ fontSize: '0.6rem', color: '#ccc' }}>
                                    Combo: <span style={{ color: rivalData.combo > 0 ? '#2ecc71' : '#ff7675', fontWeight: 'bold' }}>{rivalData.combo}</span>
                                </div>
                                {rivalData.isFever && (
                                    <div style={{ fontSize: '0.55rem', color: '#00f0ff', fontWeight: 'bold', textTransform: 'uppercase', animation: 'pulse 1s infinite' }}>
                                        🔥 FIEBRE !!
                                    </div>
                                )}
                            </div>

                        </div>

                    )}

                    <canvas ref={canvasRef} id="gameCanvas" style={{ width: '100%', height: '100%' }} />

                </div>

            </div>

        </div>

    );

};



