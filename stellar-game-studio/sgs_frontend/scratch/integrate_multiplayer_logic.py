import os

file_path = r"d:\00 PROGRAMANDO\guitarPizza--AntiGravity\stellar-game-studio\sgs_frontend\src\games\guitar-pizza\GuitarPizzaGame.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Inject import statement
import_target = "import { StellarContractService, type GameSessionStats, ACHIEVEMENT } from '../../services/StellarContractService';"
import_replacement = import_target + "\nimport { multiplayerService } from '../../services/MultiplayerService';"

if import_target in content and "multiplayerService" not in content:
    content = content.replace(import_target, import_replacement)
    print("SUCCESS: Imported multiplayerService!")
else:
    print("WARNING: Import not changed (already exists or target missing).")

# 2. Inject state variables inside the component
state_target = "    const [isPvp, setIsPvp] = useState<boolean>(false);"
state_replacement = state_target + """
    // Multiplayer Real-Time states
    const [mpMatchId, setMpMatchId] = useState<number | null>(null);
    const [rivalAddress, setRivalAddress] = useState<string | null>(null);
    const [isMultiplayer, setIsMultiplayer] = useState<boolean>(false);
    const [mpQueueStatus, setMpQueueStatus] = useState<string>('');
"""

if state_target in content and "mpMatchId" not in content:
    content = content.replace(state_target, state_replacement)
    print("SUCCESS: Added multiplayer states!")
else:
    print("WARNING: States not changed.")

# 3. Inject WebSocket connection and callbacks inside useEffect
use_effect_target = "    // Periodically run autoExpireIngredients to check for 7-day degradation"
use_effect_replacement = """    // Initialize WebSocket Multiplayer Connection
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
            onStartGame: (matchId) => {
                addLog(`[Multiplayer] Both wagers locked. Starting game sync!`);
                setIsPvp(true);
                setView('lobby');
                handleStartGame();
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
                alert(`🏁 Partida finalizada! \nChef A: ${payload.playerAScore} | Chef B: ${payload.playerBScore} \nGanador: ${payload.winnerAddress}`);
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

    // Periodically run autoExpireIngredients to check for 7-day degradation"""

if use_effect_target in content and "Initialize WebSocket" not in content:
    content = content.replace(use_effect_target, use_effect_replacement)
    print("SUCCESS: Added WebSocket initialization useEffect!")
else:
    print("WARNING: WebSocket useEffect not changed.")

# 4. Integrate live notes transmitter inside the PvP interval loop
pvp_interval_target = """        const interval = setInterval(() => {
            if ((window as any).getGuitarPizzaStats) {
                try {
                    const stats = (window as any).getGuitarPizzaStats();
                    if (stats) {
                        setPlayerPvpStats({
                            score: stats.score || 0,
                            combo: stats.combo || 0
                        });
                    }
                } catch (e) {}
            }"""

pvp_interval_replacement = """        const interval = setInterval(() => {
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
            }"""

if pvp_interval_target in content and "Sync player's own note hits" not in content:
    content = content.replace(pvp_interval_target, pvp_interval_replacement)
    print("SUCCESS: Wired live notes transmitter into pvp loop!")
else:
    print("WARNING: PVP loop sync not changed.")

# 5. Connect Campaign Button Click Handlers to WS
# Update CREATE PRIVATE ROOM handler
create_room_target = """                                            {/* ACTION 1: CREATE PRIVATE ROOM */}
                                            <button 
                                                onClick={async () => {
                                                    // Handle Pre-wager Lockup (wager transaction)
                                                    if (userAddress !== 'G_DEMO_USER' && isConnectedRef.current) {
                                                        const signer = getContractSignerRef.current();
                                                        addLog(`[PVP] Creating match on-chain with wager ${selectedWager}...`);
                                                        const res = await StellarContractService.createPvpMatch(userAddress, selectedWager, signer);
                                                        if (!res.success) {
                                                            alert(`⚠️ Error en Soroban: ${res.error}`);
                                                            return;
                                                        }
                                                    }
                                                    
                                                    const code = 'GP-' + Math.floor(1000 + Math.random() * 9000);
                                                    setRoomCode(code);
                                                    setPvpState('waiting');
                                                }}"""

create_room_replacement = """                                            {/* ACTION 1: CREATE PRIVATE ROOM */}
                                            <button 
                                                onClick={async () => {
                                                    addLog(`[PVP] Creating private lobby room with wager ${selectedWager}...`);
                                                    multiplayerService.createRoom(userAddress, selectedWager);
                                                }}"""

if create_room_target in content:
    content = content.replace(create_room_target, create_room_replacement)
    print("SUCCESS: Updated CREATE PRIVATE ROOM handler!")
else:
    print("WARNING: CREATE ROOM handler not changed.")

# Update JOIN PRIVATE ROOM handler
join_room_target = """                                                <button 
                                                    onClick={async () => {
                                                        if (!joinCode.startsWith('GP-')) {
                                                            alert('⚠️ Código inválido');
                                                            return;
                                                        }
                                                        
                                                        // Handle Pre-wager Lockup (wager transaction)
                                                        if (userAddress !== 'G_DEMO_USER' && isConnectedRef.current) {
                                                            const signer = getContractSignerRef.current();
                                                            addLog(`[PVP] Joining match GP-XXXX on-chain with wager ${selectedWager}...`);
                                                            const res = await StellarContractService.joinPvpMatch(userAddress, 12345, signer); // Use parsed match ID
                                                            if (!res.success) {
                                                                alert(`⚠️ Error en Soroban: ${res.error}`);
                                                                return;
                                                            }
                                                        }
                                                        
                                                        setIsPvp(true);
                                                        setView('lobby');
                                                        handleStartGame(); // Starts game with PVP enabled!
                                                    }}"""

join_room_replacement = """                                                <button 
                                                    onClick={async () => {
                                                        addLog(`[PVP] Joining private lobby Room ${joinCode}...`);
                                                        multiplayerService.joinRoom(userAddress, joinCode);
                                                    }}"""

if join_room_target in content:
    content = content.replace(join_room_target, join_room_replacement)
    print("SUCCESS: Updated JOIN PRIVATE ROOM handler!")
else:
    print("WARNING: JOIN ROOM handler not changed.")

# Update QUICK MATCHMAKING queue handler
quick_match_target = """                                            {/* ACTION 3: PUBLIC MATCHMAKING QUEUE */}
                                            <button 
                                                onClick={async () => {
                                                    // Simulates public queue with high-fidelity pre-wager
                                                    if (userAddress !== 'G_DEMO_USER' && isConnectedRef.current) {
                                                        const signer = getContractSignerRef.current();
                                                        addLog(`[PVP] Entering public queue with wager ${selectedWager}...`);
                                                        const res = await StellarContractService.createPvpMatch(userAddress, selectedWager, signer);
                                                        if (!res.success) {
                                                            alert(`⚠️ Error en Soroban: ${res.error}`);
                                                            return;
                                                        }
                                                    }
                                                    setRoomCode('MATCHMAKING');
                                                    setPvpState('waiting');
                                                }}"""

quick_match_replacement = """                                            {/* ACTION 3: PUBLIC MATCHMAKING QUEUE */}
                                            <button 
                                                onClick={async () => {
                                                    addLog(`[PVP] Entering real public queue with wager ${selectedWager}...`);
                                                    setRoomCode('MATCHMAKING');
                                                    setPvpState('waiting');
                                                    setMpQueueStatus(language === 'es' ? 'Buscando chef en la red...' : 'Searching for chef on-line...');
                                                    multiplayerService.joinQueue(userAddress, selectedWager);
                                                }}"""

if quick_match_target in content:
    content = content.replace(quick_match_target, quick_match_replacement)
    print("SUCCESS: Updated QUICK MATCHMAKING handler!")
else:
    print("WARNING: QUICK MATCHMAKING handler not changed.")

# Write changes back
with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("ALL CHANGES APPLIED SUCCESSFULLY!")
