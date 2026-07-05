

window.initGuitarPizza = function (canvasElement, userAddress, onComplete, songUrl, t, options) {
    options = options || {};
    // Default translations if missing
    t = t || { engineLoading: 'Cargando Ingredientes...', engineLetsCook: "¡A COCINAR! 🍕", engineLevelComplete: '🎉 ¡NIVEL COMPLETADO!', engineServiceEnded: 'SERVICIO FINALIZADO' };
    const language = options.language || ((t && t.engineLoading && t.engineLoading.includes('Cargando')) ? 'es' : 'en');

    // --- GLOBAL VARS & CONFIG (Scoped to this function) ---
    // Parse all song params from the URL query string
    const _songParams = (function () {
        try {
            const queryString = typeof songUrl === 'string' && songUrl.includes('?') ? songUrl.substring(songUrl.indexOf('?')) : '';
            const u = new URLSearchParams(queryString);
            const bpm = parseInt(u.get('bpm') || '0', 10);
            const start = parseFloat(u.get('start') || '0');
            const duration = parseFloat(u.get('duration') || '0');
            return { bpm: bpm > 0 ? bpm : 128, start: start || 0, duration: duration > 0 ? duration : 80 };
        } catch (e) { return { bpm: 128, start: 0, duration: 80 }; }
    })();

    const CONFIG = {
        BPM: _songParams.bpm,
        SONG_START: _songParams.start,
        SONG_DURATION: _songParams.duration,
        LANE_COUNT: 5, HIT_WINDOW: 0.160, PERFECT_WINDOW: 0.060,
        HITS_PER_PIZZA: 20
    };

    const STATE = { MENU: 0, GAME: 1, RESULTS: 2, PAUSED: 3, COUNTDOWN: 4 };
    let gameState = STATE.MENU;
    let loopRunning = true;
    let isVictory = false; // true = song ended (win), false = health=0 (defeat)
    let gameTimer = 0;
    let _pendingSongPlay = null; // set at lead-in start; fires when gameTimer reaches 0
    let _cdPrevVal = null;       // countdown pop-animation state
    let _cdAnimStart = 0;
    let score = 0;
    let combo = 0;
    let maxCombo = 0;
    let health = 100;
    let fireMode = false;
    let difficultyMult = 0.6;
    let difficultyTimer = 0;

    let pizzaProgress = 0;
    let pizzasMade = 0;

    // --- NEW MECHANICS ---
    let rushHourActive = false;
    let rushHourTimer = 0; // Time since last rush hour
    let rushHourDuration = 0; // How long current rush hour lasts
    let rushHourNextTrigger = 15; // Trigger first rush hour at 15s
    let rushHourCompleted = 0;

    let highScore = 0; // Local high score
    let totalPerfectHits = 0;
    let totalHits = 0;
    let perfectStreak = 0;
    let secretIngredients = 0;

    // --- ZK STATS (exported on game complete) ---
    let feverTime = 0;       // seconds spent in fireMode
    let totalTraps = 0;      // trap notes spawned
    let trapsAvoided = 0;    // traps successfully dodged (let pass)
    let totalNotes = 0;      // non-trap notes spawned (for ZK total_notes bound)

    let notes = [];
    let latency = (options && typeof options.latency === 'number') ? (options.latency / 1000) : 0;
    let chartNotesToSpawn = null;
    let particles = [];
    let feedbackSystem = [];
    let shake = 0;
    let laneBoxPhase = [0, 0, 0, 0]; // 0 = closed, 1 = open
    let centerBanner = null; // { text, life, maxLife }
    let laneBoxAnim = [0, 0, 0, 0]; // 0..1 bounce timer per lane
    let laneHitAnim = [0, 0, 0, 0]; // neon glow trigger per lane
    let trapBurnAnim = [0, 0, 0, 0]; // trap burn indicator per lane
    let accuracyTicks = []; // array of timing ticks for early/late calibration meter
    let camScale = 1.0;

    let beatTimer = 0;
    let beatFlash = 0;
    let bgScrollY = 0;
    let bgOffsetY = 0;

    // --- ZK INPUT LOG ---
    let inputLog = [];
    let gamepadActive = false;
    let lastStartPressed = false;

    // --- ENGINE SETUP ---
    const canvas = canvasElement;
    const ctx = canvas.getContext('2d');
    const container = canvasElement.parentElement;
    let lastTime = 0;
    let nextNoteTime = 0;

    let W, H, LANE_W, HIT_Y, NOTE_SIZE;

    // --- UI ELEMENTS ---
    const uiOverlay = document.getElementById('overlay');
    const uiStartBtn = document.getElementById('startBtn');
    const uiResults = document.getElementById('results');
    const uiResScore = document.getElementById('resScore');
    const uiResGrade = document.getElementById('resGrade');
    const uiRestartBtn = document.getElementById('restartBtn');
    const uiBackBtn = document.getElementById('backToLobbyBtn');

    // --- ASSETS ---
    // --- ASSETS ---
    const ASSETS = {};
    // --- PIZZA BOX PLATE ASSETS (4 per lane) ---
    const PLATE_ASSETS = { closed: [null, null, null, null], open: [null, null, null, null] };
    (function loadBoxAssets() {
        const base = (window.GP_BASE_PATH || '/') + 'game/assets/';
        const closedNames = ['cajacerrada1.png', 'cajacerrada2.png', 'caja cerrada 3.png', 'cajacerrada4.png'];
        const openNames = ['pizzaAbierta1.png', 'pizzaAbierta2.png', 'pizzaAbierta3.png', 'pizzaAbierta4.png'];
        for (let i = 0; i < 4; i++) {
            const c = new window.Image();
            c.src = base + closedNames[i] + "?v=2";
            c.onload = () => { PLATE_ASSETS.closed[i] = c; };
            const o = new window.Image();
            o.src = base + openNames[i] + "?v=2";
            o.onload = () => { PLATE_ASSETS.open[i] = o; };
        }
    })();
    const TAGS = ["pepperoni", "cheese", "bacon", "onion"]; // Mapped to Lanes 0-3
    const TRAP_TAGS = ["hotdog", "burger"]; // Ghost/Trap Notes (Sushi removed for performance)
    const GOLDEN_TAG = "secret_sauce";
    // --- THEME CONFIGURATION (EDIT HERE!) ---
    const THE_OVEN_THEME = {
        colors: {
            // Lane Colors: [Red (Pepperoni), Yellow (Cheese), Pink (Bacon), Purple (Onion)]
            lanes: [
                { primary: "rgba(192, 57, 43, 0.4)", dark: "rgba(192, 57, 43, 0.05)", plate: "#4a0000", note: "#C0392B" },    // Lane 0: Pepperoni
                { primary: "rgba(241, 196, 15, 0.4)", dark: "rgba(241, 196, 15, 0.05)", plate: "#664a00", note: "#F4D03F" },    // Lane 1: Cheese
                { primary: "rgba(217, 136, 128, 0.4)", dark: "rgba(217, 136, 128, 0.05)", plate: "#5c2b14", note: "#E6B0AA" },    // Lane 2: Bacon (Pinkish)
                { primary: "rgba(155, 89, 182, 0.4)", dark: "rgba(155, 89, 182, 0.05)", plate: "#27004f", note: "#9B59B6" }     // Lane 3: Onion
            ],
            hitLine: "#D4A84B", // Mafia Gold for Hitline
            background: {
                base: "#ffffff",       // Pure white paper texture for maximum contrast
                checker: "#9A1F1F",    // Slightly lighter mafia red
                oven: "#4A4A4A",       // 20%+ brighter grey for the background track
                ovenBorder: "#8B0000", // Blood Red Inner Border
                outerBorder: "#080402" // Deepest black-brown for the frame
            }
        },
        dimensions: {
            checkerSize: 40,
            hitLineThickness: 6,
            laneBorderWidth: 2
        }
    };

    // --- HELPER FUNCTIONS ---

    let _difficultyStart = 0.6;  // set by startGame opts

    function resetGame() {
        score = 0; combo = 0; maxCombo = 0; health = 100;
        fireMode = false; difficultyMult = _difficultyStart; difficultyTimer = 0;
        pizzaProgress = 0; pizzasMade = 0;
        perfectStreak = 0; secretIngredients = 0;
        rushHourActive = false; rushHourTimer = 0;
        rushHourDuration = 0; rushHourNextTrigger = 15;
        totalPerfectHits = 0; totalHits = 0;
        feverTime = 0; totalTraps = 0; trapsAvoided = 0; totalNotes = 0;
        notes = []; particles = []; feedbackSystem = [];
        gameTimer = 0; nextNoteTime = 0;
        _pendingSongPlay = null;
        inputLog = []; // Reset Log
        inputLog.startTime = Date.now(); // Record session start time for anti-cheat
        isVictory = false;
        _levelCompleteTriggered = false;
        laneBoxPhase = [0, 0, 0, 0]; // all boxes start closed
        laneBoxAnim = [0, 0, 0, 0];
        laneHitAnim = [0, 0, 0, 0];
        trapBurnAnim = [0, 0, 0, 0];
        accuracyTicks = [];
        centerBanner = null;
        gameState = STATE.GAME;
        lastTime = performance.now(); // RESET TIME TO PREVENT HUGE DT JUMP
        AudioEngine.init(); // Ensure audio is ready

        if (options && options.chartData && Array.isArray(options.chartData.notes)) {
            chartNotesToSpawn = options.chartData.notes.map(n => ({
                time: Number(n.time),
                lane: Number(n.lane),
                isTrap: !!n.isTrap,
                isSustain: !!n.isSustain,
                length: Number(n.length || 0)
            })).sort((a, b) => a.time - b.time);

            // Expand SONG_DURATION if the note times exceed it
            if (chartNotesToSpawn.length > 0) {
                const lastNote = chartNotesToSpawn[chartNotesToSpawn.length - 1];
                const lastNoteEndTime = lastNote.time + (lastNote.length || 0) + 3;
                if (lastNoteEndTime > CONFIG.SONG_DURATION) {
                    CONFIG.SONG_DURATION = lastNoteEndTime;
                }
            }
        } else {
            chartNotesToSpawn = null;
        }
    }

    function showScreen(screen) {
        if (uiOverlay) uiOverlay.style.display = 'none';
        if (uiResults) uiResults.style.display = 'none';

        if (screen === 'menu') {
            if (uiOverlay) uiOverlay.style.display = 'flex';
            // Clear canvas to transparent so CSS gradient shows
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else if (screen === 'results') {
            if (uiResults) uiResults.style.display = 'flex';
            if (uiResScore) uiResScore.innerText = Math.floor(score).toString();

            // Victory vs defeat visuals
            const titleEl = document.getElementById('resTitle');
            const pizzasEl = document.getElementById('resPizzas');
            const pizzasCountEl = document.getElementById('resPizzasCount');
            const nextLevelBtn = document.getElementById('nextLevelBtn');

            if (isVictory) {
                if (titleEl) { titleEl.innerText = t.engineLevelComplete; titleEl.style.color = '#ffd700'; }
                if (pizzasEl) { pizzasEl.style.display = 'block'; }
                if (pizzasCountEl) { pizzasCountEl.innerText = pizzasMade; }
                if (nextLevelBtn) { nextLevelBtn.style.display = 'block'; }
                if (uiResults) { uiResults.style.background = 'rgba(20,50,20,0.7)'; }
            } else {
                if (titleEl) { titleEl.innerText = t.engineServiceEnded; titleEl.style.color = '#fff'; }
                if (pizzasEl) { pizzasEl.style.display = 'none'; }
                if (nextLevelBtn) { nextLevelBtn.style.display = 'none'; }
                if (uiResults) { uiResults.style.background = 'rgba(0,0,0,0.6)'; }
            }

            // Calculate Grade
            let grade = "C";
            if (score > 5000) grade = "B";
            if (score > 10000) grade = "A";
            if (score > 20000) grade = "S";
            if (score > 30000) grade = "SS";
            if (uiResGrade) uiResGrade.innerText = grade;
        }
    }

    function togglePause() {
        if (gameState === STATE.GAME) {
            gameState = STATE.PAUSED;
            // Stop the song to prevent browser/driver audio glitches on suspend
            AudioEngine.stopSong();
            createFeedback("PAUSE", -1, H * 0.45);
        } else if (gameState === STATE.PAUSED) {
            gameState = STATE.GAME;
            // Resume the song exactly where we left off (resolvedStart + gameTimer)
            const songRate = AudioEngine._fireRate || 1.0;
            const resolvedStart = CONFIG.SONG_START || 0;
            const resolvedDuration = CONFIG.SONG_DURATION || 0;
            const durationLeft = resolvedDuration - gameTimer;
            // gameTimer < 0 means we're still in the lead-in: the song hasn't
            // started yet (_pendingSongPlay will fire it), so don't resume audio.
            if (durationLeft > 0 && gameTimer >= 0) {
                AudioEngine.playSong(songRate, resolvedStart + gameTimer, durationLeft);
            }
            lastTime = performance.now(); // reset time to prevent huge dt jump
        }
    }
    window.toggleGuitarPizzaPause = togglePause;
    window.getGuitarPizzaStats = function() {
        return {
            score: score || 0,
            combo: combo || 0,
            progress: (CONFIG.SONG_DURATION > 0) ? Math.min(1.0, Math.max(0.0, gameTimer / CONFIG.SONG_DURATION)) : 0
        };
    };

    // --- INPUT HANDLING ---
    const optionsKeyMap = {};
    if (options && options.keyMap) {
        for (const k in options.keyMap) {
            if (options.keyMap.hasOwnProperty(k)) {
                optionsKeyMap[k.toLowerCase()] = options.keyMap[k];
            }
        }
    } else {
        optionsKeyMap['a'] = 0;
        optionsKeyMap['s'] = 1;
        optionsKeyMap['k'] = 2;
        optionsKeyMap['l'] = 3;
    }

    const Input = {
        held: [false, false, false, false],
        keyboardHeld: [false, false, false, false],
        touchHeld: [false, false, false, false],
        gamepadHeld: [false, false, false, false],
        wsHeld: [false, false, false, false],
        keyMap: optionsKeyMap
    };

    function triggerInput(lane) {
        if (gameState !== STATE.GAME) return;
        const result = checkHit(lane);
        // Log for ZK
        inputLog.push({
            time: gameTimer,
            lane: lane,
            action: 'tap',
            isHit: result.hit,
            offset: result.offset
        });
    }

    const onKeyDown = (e) => {
        if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
            e.preventDefault();
            togglePause();
            return;
        }
        if (gameState === STATE.PAUSED && (e.key === 'q' || e.key === 'Q')) {
            e.preventDefault();
            if (uiBackBtn) uiBackBtn.click();
            return;
        }
        if (gameState === STATE.PAUSED) return; // Ignore play inputs if paused
        
        if (e.repeat) return;
        const k = e.key.toLowerCase();
        if (Input.keyMap.hasOwnProperty(k)) {
            const lane = Input.keyMap[k];
            Input.keyboardHeld[lane] = true;
            Input.held[lane] = true;
            triggerInput(lane);
        }
    };

    const onKeyUp = (e) => {
        const k = e.key.toLowerCase();
        if (Input.keyMap.hasOwnProperty(k)) {
            const lane = Input.keyMap[k];
            Input.keyboardHeld[lane] = false;
            Input.held[lane] = Input.keyboardHeld[lane] || Input.touchHeld[lane] || Input.gamepadHeld[lane] || Input.wsHeld[lane];
        }
    };

    const getTouchLane = (clientX) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const x = (clientX - rect.left) * scaleX;

        // Match the centering logic from render()
        const totalGameWidth = 4 * LANE_W;
        const offsetX = (W - totalGameWidth) / 2;

        // Offset the touch X by the blank margin on the left
        const lane = Math.floor((x - offsetX) / LANE_W);
        return lane;
    };

    const onTouchStart = (e) => {
        if (gameState !== STATE.GAME) return;
        // On mobile, preventing default here might block interactions, but we need it to stop scrolling
        e.preventDefault();

        for (let i = 0; i < e.changedTouches.length; i++) {
            const lane = getTouchLane(e.changedTouches[i].clientX);
            if (lane >= 0 && lane < 4) {
                Input.touchHeld[lane] = true;
                Input.held[lane] = true;
                triggerInput(lane);
            }
        }
    };

    const onTouchEnd = (e) => {
        if (gameState !== STATE.GAME) return;
        e.preventDefault();

        for (let i = 0; i < e.changedTouches.length; i++) {
            const lane = getTouchLane(e.changedTouches[i].clientX);
            if (lane >= 0 && lane < 4) {
                Input.touchHeld[lane] = false;
                Input.held[lane] = Input.keyboardHeld[lane] || Input.gamepadHeld[lane] || Input.touchHeld[lane] || Input.wsHeld[lane];
            }
        }
    };

    // Attach listeners
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);

    const onGamepadConnected = (e) => {
        gamepadActive = true;
        createFeedback("CONTROLLER DETECTED! 🎮", -1, H * 0.4);
    };
    const onGamepadDisconnected = (e) => {
        if (navigator.getGamepads) {
            const gps = navigator.getGamepads();
            let count = 0;
            for (let i = 0; i < gps.length; i++) if (gps[i]) count++;
            if (count === 0) gamepadActive = false;
        }
    };
    window.addEventListener("gamepadconnected", onGamepadConnected);
    window.addEventListener("gamepaddisconnected", onGamepadDisconnected);

    // --- XBOX GAMEPAD SUPPORT ---
    function pollGamepads() {
        if (!navigator.getGamepads) return;
        const gamepads = navigator.getGamepads();
        const currentPressed = [false, false, false, false];
        let hasActiveInput = false;

        // Button helper to handle standard vs analog triggers
        const checkButton = (btn, isTrigger = false) => {
            if (!btn) return false;
            if (isTrigger) {
                // Triggers (LT/RT) are analog and prone to drift/stretching.
                // Apply a conservative deadzone threshold (0.15) to register as pressed.
                const val = typeof btn.value === 'number' ? btn.value : (btn.pressed ? 1.0 : 0.0);
                return val > 0.15;
            }
            return !!btn.pressed;
        };

        if (gameState === STATE.PAUSED) {
            // Still poll menu buttons (Start/Select) to pause/quit, but skip play inputs
            for (let g = 0; g < gamepads.length; g++) {
                const gp = gamepads[g];
                if (!gp || !gp.buttons) continue;
                const startPressed = checkButton(gp.buttons[9]);
                if (startPressed) {
                    hasActiveInput = true;
                    if (!lastStartPressed) {
                        lastStartPressed = true;
                        togglePause();
                    }
                } else {
                    lastStartPressed = false;
                }
                const selectPressed = checkButton(gp.buttons[8]);
                if (selectPressed) {
                    hasActiveInput = true;
                    if (uiBackBtn) uiBackBtn.click();
                }
            }
            if (hasActiveInput) {
                gamepadActive = true;
            }
            return;
        }

        for (let g = 0; g < gamepads.length; g++) {
            const gp = gamepads[g];
            if (!gp || !gp.buttons) continue;

            // Check Menu buttons
            const startPressed = checkButton(gp.buttons[9]);
            if (startPressed) {
                hasActiveInput = true;
                if (!lastStartPressed) {
                    lastStartPressed = true;
                    togglePause();
                }
            } else {
                lastStartPressed = false;
            }

            const selectPressed = checkButton(gp.buttons[8]);
            if (selectPressed) {
                hasActiveInput = true;
                if (gameState === STATE.PAUSED) {
                    if (uiBackBtn) uiBackBtn.click();
                }
            }

            // Check gameplay inputs for the 4 lanes:
            // Lane 0: Button 2 (X), Button 14 (D-pad Left), Button 6 (LT - Left Trigger), or Left Stick Left
            const lane0Pressed = checkButton(gp.buttons[2]) || 
                                 checkButton(gp.buttons[14]) || 
                                 checkButton(gp.buttons[6], true) ||
                                 (gp.axes && gp.axes[0] < -0.5);
            if (lane0Pressed) {
                currentPressed[0] = true;
                hasActiveInput = true;
            }

            // Lane 1: Button 0 (A), Button 13 (D-pad Down), Button 4 (LB - Left Bumper), or Left Stick Down
            const lane1Pressed = checkButton(gp.buttons[0]) || 
                                 checkButton(gp.buttons[13]) || 
                                 checkButton(gp.buttons[4]) ||
                                 (gp.axes && gp.axes[1] > 0.5);
            if (lane1Pressed) {
                currentPressed[1] = true;
                hasActiveInput = true;
            }

            // Lane 2: Button 3 (Y), Button 12 (D-pad Up), Button 5 (RB - Right Bumper), or Left Stick Up
            const lane2Pressed = checkButton(gp.buttons[3]) || 
                                 checkButton(gp.buttons[12]) || 
                                 checkButton(gp.buttons[5]) ||
                                 (gp.axes && gp.axes[1] < -0.5);
            if (lane2Pressed) {
                currentPressed[2] = true;
                hasActiveInput = true;
            }

            // Lane 3: Button 1 (B), Button 15 (D-pad Right), Button 7 (RT - Right Trigger), or Left Stick Right
            const lane3Pressed = checkButton(gp.buttons[1]) || 
                                 checkButton(gp.buttons[15]) || 
                                 checkButton(gp.buttons[7], true) ||
                                 (gp.axes && gp.axes[0] > 0.5);
            if (lane3Pressed) {
                currentPressed[3] = true;
                hasActiveInput = true;
            }
        }

        // Only switch the active UI overlay to Gamepad mode if a real user input action was detected.
        // This prevents phantom/virtual gamepads from taking over keyboard visual cues.
        if (hasActiveInput) {
            gamepadActive = true;
        }

        for (let lane = 0; lane < 4; lane++) {
            if (currentPressed[lane]) {
                if (!Input.gamepadHeld[lane]) {
                    Input.gamepadHeld[lane] = true;
                    Input.held[lane] = true;
                    triggerInput(lane);
                }
            } else {
                Input.gamepadHeld[lane] = false;
                Input.held[lane] = Input.keyboardHeld[lane] || Input.gamepadHeld[lane] || Input.touchHeld[lane] || Input.wsHeld[lane];
            }
        }
    }

    // --- PIESOCKET WEBSOCKET BRIDGE ---
    let socket = null;
    function handleWebSocketMessage(dataStr) {
        try {
            let msg = null;
            try {
                msg = JSON.parse(dataStr);
            } catch (e) {
                // Parse plain string format, e.g. "keydown_0", "down_0"
                const lowerStr = dataStr.toLowerCase().trim();
                const parts = lowerStr.split('_');
                if (parts.length === 2) {
                    const action = parts[0];
                    const lane = parseInt(parts[1], 10);
                    if (!isNaN(lane) && lane >= 0 && lane < 4) {
                        if (action === 'keydown' || action === 'down' || action === 'press') {
                            Input.wsHeld[lane] = true;
                            Input.held[lane] = true;
                            triggerInput(lane);
                        } else if (action === 'keyup' || action === 'up' || action === 'release') {
                            Input.wsHeld[lane] = false;
                            Input.held[lane] = Input.keyboardHeld[lane] || Input.gamepadHeld[lane] || Input.touchHeld[lane] || Input.wsHeld[lane];
                        }
                    }
                }
                return;
            }

            if (msg && typeof msg === 'object') {
                let lane = -1;
                if (msg.hasOwnProperty('lane')) {
                    lane = parseInt(msg.lane, 10);
                } else if (msg.hasOwnProperty('note')) {
                    lane = parseInt(msg.note, 10);
                }

                if (isNaN(lane) || lane < 0 || lane >= 4) return;

                let type = String(msg.type || msg.action || msg.event || '').toLowerCase();
                let isDown = false;
                let isUp = false;

                if (msg.hasOwnProperty('pressed')) {
                    isDown = !!msg.pressed;
                    isUp = !msg.pressed;
                } else if (msg.hasOwnProperty('state')) {
                    const state = String(msg.state).toLowerCase();
                    isDown = (state === 'down' || state === 'pressed' || state === 'keydown');
                    isUp = (state === 'up' || state === 'released' || state === 'keyup');
                } else {
                    isDown = (type === 'keydown' || type === 'down' || type === 'press');
                    isUp = (type === 'keyup' || type === 'up' || type === 'release');
                }

                if (isDown) {
                    Input.wsHeld[lane] = true;
                    Input.held[lane] = true;
                    triggerInput(lane);
                } else if (isUp) {
                    Input.wsHeld[lane] = false;
                    Input.held[lane] = Input.keyboardHeld[lane] || Input.gamepadHeld[lane] || Input.touchHeld[lane] || Input.wsHeld[lane];
                }
            }
        } catch (err) {
            console.warn('[Engine] Error handling WebSocket message:', err);
        }
    }

    if (!options || options.enableWebSocket !== false) {
        const wsUrl = (options && options.webSocketUrl) || 'wss://demo.piesocket.com/v3/channel_1?api_key=VCKGPEJyWZTMmTPuj2RDkqGUV9mTRFL3aa2ExdxD&notify_self=1';
        try {
            socket = new WebSocket(wsUrl);
            socket.onopen = () => {
                console.log('[Engine] WebSocket bridge connected to:', wsUrl);
            };
            socket.onmessage = (event) => {
                handleWebSocketMessage(event.data);
            };
            socket.onclose = () => {
                console.log('[Engine] WebSocket bridge closed.');
            };
            socket.onerror = (error) => {
                console.warn('[Engine] WebSocket bridge error:', error);
            };
        } catch (e) {
            console.warn('[Engine] Failed to connect to WebSocket bridge:', e);
        }
    }

    // --- dynamic real-time latency calibration hook ---
    const updateLatencyFunc = function (ms) {
        if (typeof ms === 'number') {
            latency = ms / 1000;
            if (options) {
                options.latency = ms;
            }
            console.log('[Engine] Active latency calibrated in real-time to:', ms, 'ms');
        }
    };
    window.updateGuitarPizzaLatency = updateLatencyFunc;

    // UI Listeners
    if (uiStartBtn) uiStartBtn.onclick = () => {
        resetGame();
        showScreen('game');
    };

    if (uiRestartBtn) uiRestartBtn.onclick = () => {
        resetGame();
        showScreen('game');
    };

    if (uiBackBtn) uiBackBtn.onclick = () => {
        // Force cleanup via callback or just reload?
        // Since we are inside the engine, we can just stop.
        // But the parent component handles the view.
        // For now, let's just go to menu.
        gameState = STATE.MENU;
        showScreen('menu');
    };

    // --- OFFLINE DSP BEAT DETECTOR & CHART GENERATOR ---
    function generateChartFromAudio(songBuffer, bpm) {
        const channelData = songBuffer.getChannelData(0);
        const sampleRate = songBuffer.sampleRate;
        const duration = songBuffer.duration;
        
        const blockSize = 512;
        const totalBlocks = Math.floor(channelData.length / blockSize);
        
        // IIR 1-Pole Low-Pass Filter Coeffs (fc = 150 Hz for bass)
        const dt = 1 / sampleRate;
        const rcBass = 1 / (2 * Math.PI * 150);
        const alphaBass = dt / (rcBass + dt);
        
        // IIR 1-Pole High-Pass cutoff (fc = 2500 Hz for treble)
        const rcTreble = 1 / (2 * Math.PI * 2500);
        const alphaTreble = dt / (rcTreble + dt);

        const bassEnergies = new Float32Array(totalBlocks);
        const trebleEnergies = new Float32Array(totalBlocks);
        
        let prevBassY = 0;
        let prevTrebleY = 0;
        
        for (let b = 0; b < totalBlocks; b++) {
            let bassSum = 0;
            let trebleSum = 0;
            const startSample = b * blockSize;
            
            for (let i = 0; i < blockSize; i++) {
                const x = channelData[startSample + i];
                
                // Bass (low-pass)
                const bassY = alphaBass * x + (1 - alphaBass) * prevBassY;
                prevBassY = bassY;
                bassSum += bassY * bassY;
                
                // Treble (subtraction from low-pass)
                const lowY = alphaTreble * x + (1 - alphaTreble) * prevTrebleY;
                prevTrebleY = lowY;
                const trebleY = x - lowY;
                trebleSum += trebleY * trebleY;
            }
            
            bassEnergies[b] = Math.sqrt(bassSum / blockSize);
            trebleEnergies[b] = Math.sqrt(trebleSum / blockSize);
        }
        
        // Onset flux calculations
        const bassFlux = new Float32Array(totalBlocks);
        const trebleFlux = new Float32Array(totalBlocks);
        for (let b = 1; b < totalBlocks; b++) {
            bassFlux[b] = Math.max(0, bassEnergies[b] - bassEnergies[b - 1]);
            trebleFlux[b] = Math.max(0, trebleEnergies[b] - trebleEnergies[b - 1]);
        }
        
        // Peak detection & dynamic thresholds
        const windowSize = 20;
        const detectedBassOnsets = [];
        const detectedTrebleOnsets = [];
        
        for (let b = windowSize; b < totalBlocks - windowSize; b++) {
            let sumBass = 0, sumTreble = 0;
            for (let w = -windowSize; w <= windowSize; w++) {
                sumBass += bassFlux[b + w];
                sumTreble += trebleFlux[b + w];
            }
            const meanBass = sumBass / (windowSize * 2 + 1);
            const meanTreble = sumTreble / (windowSize * 2 + 1);
            
            const thresholdBass = meanBass * 2.4 + 0.025;
            const thresholdTreble = meanTreble * 2.6 + 0.016;
            
            const tSeconds = (b * blockSize) / sampleRate;
            
            if (bassFlux[b] > thresholdBass) {
                let isLocalMax = true;
                for (let r = -3; r <= 3; r++) {
                    if (bassFlux[b] < bassFlux[b + r]) { isLocalMax = false; break; }
                }
                if (isLocalMax) {
                    detectedBassOnsets.push({ time: tSeconds, strength: bassFlux[b] });
                }
            }
            
            if (trebleFlux[b] > thresholdTreble) {
                let isLocalMax = true;
                for (let r = -3; r <= 3; r++) {
                    if (trebleFlux[b] < trebleFlux[b + r]) { isLocalMax = false; break; }
                }
                if (isLocalMax) {
                    detectedTrebleOnsets.push({ time: tSeconds, strength: trebleFlux[b] });
                }
            }
        }
        
        // Quantization Grid & Rhythmic Lane distribution (Optimized like Guitar Hero Medium)
        const beatLength = 60 / bpm;
        const stepLength = beatLength / 2; // Quantize to 8th note steps (Medium difficulty, perfectly rhythmic!)
        const chartNotes = [];
        const seenTimes = new Set();
        const laneLastNoteTime = [-999, -999, -999, -999];
        
        function addNote(time, lane, isTrap = false, isSustain = false, length = 0) {
            const quantized = Math.round(time / stepLength) * stepLength;
            if (quantized < 0.2 || quantized > duration - 2.5) return;
            
            // Enforce minimum time spacing (cooldown) to ensure fun, playable notes: at least 0.8 beats
            const minSpacing = beatLength * 0.8;
            
            const key = `${quantized.toFixed(3)}-${lane}`;
            if (!seenTimes.has(key)) {
                // Prevent note flooding in the same lane
                if (quantized - laneLastNoteTime[lane] < minSpacing) return;
                
                seenTimes.add(key);
                laneLastNoteTime[lane] = quantized;
                chartNotes.push({
                    time: quantized,
                    lane: lane,
                    isTrap: isTrap,
                    isSustain: isSustain,
                    length: length
                });
            }
        }
        
        // Distribute Bass -> Lanes 0 (Pepperoni) & 2 (Bacon)
        detectedBassOnsets.forEach((onset) => {
            if (onset.strength > 0.24) {
                // Heavy impact: spawn dual-lane chords on major kicks
                addNote(onset.time, 0);
                addNote(onset.time, 2);
            } else {
                const lane = Math.floor(onset.time / beatLength) % 2 === 0 ? 0 : 2;
                addNote(onset.time, lane);
            }
        });
        
        // Distribute Treble -> Lanes 1 (Cheese) & 3 (Onion)
        detectedTrebleOnsets.forEach((onset) => {
            const isSustain = onset.strength > 0.22 && Math.random() < 0.25;
            const length = isSustain ? beatLength * (1 + Math.floor(Math.random() * 2)) : 0;
            const isTrap = !isSustain && onset.strength < 0.08 && Math.random() < 0.12;
            
            const lane = Math.floor(onset.time / beatLength) % 2 === 0 ? 1 : 3;
            addNote(onset.time, lane, isTrap, isSustain, length);
        });
        
        chartNotes.sort((a, b) => a.time - b.time);
        return chartNotes;
    }

    // --- AUDIO ENGINE ---
    const AudioEngine = {
        ctx: null, isInit: false, masterGain: null, audioDest: null, analyser: null,
        // Music playback
        songBuffer: null, songSource: null, musicGain: null, filterNode: null,

        init: function () {
            if (this.isInit) {
                if (this.ctx && this.ctx.state === 'suspended') {
                    // Only resume if called from a user gesture (startGame)
                    try { this.ctx.resume(); } catch (e) { }
                }
                return;
            }
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.35;
            this.masterGain.connect(this.ctx.destination);

            // Create Audio Analyser Node for dynamic visuals
            try {
                this.analyser = this.ctx.createAnalyser();
                this.analyser.fftSize = 64; // Small fft for fast volume tracking!
                this.masterGain.connect(this.analyser);
            } catch (e) {
                console.warn('[AudioEngine] AnalyserNode creation failed:', e);
            }
            
            // Capture audio stream for WebRTC guest mirroring
            if (this.ctx) {
                try {
                    this.audioDest = this.ctx.createMediaStreamDestination();
                    this.masterGain.connect(this.audioDest);
                    window.capturedAudioStream = this.audioDest.stream;
                    console.log('[AudioEngine] WebRTC Audio Capture Destination created successfully!');
                } catch (err) {
                    console.warn('[AudioEngine] MediaStreamAudioDestinationNode not supported or failed to create:', err);
                }
            }

            // It will be suspended, we will resume it later
            this.isInit = true;
        },
        setVolume: function (value) {
            if (this.masterGain) {
                const v = Math.max(0, Math.min(1, value));
                this.masterGain.gain.cancelScheduledValues(0);
                this.masterGain.gain.value = v * 0.35;
            }
        },

        // ── MUSIC ─────────────────────────────────────────────────────────────
        loadSong: async function (url) {
            if (!this.isInit) this.init(); // Init context early (will be suspended)
            if (!url) return;
            try {
                const resp = await fetch(url);
                const arrayBuffer = await resp.arrayBuffer();
                this.songBuffer = await this.ctx.decodeAudioData(arrayBuffer);
                console.log('[AudioEngine] Song loaded and decoded:', url);

                // Run dynamic offline beat detection mapper if chartData is missing
                if (!options.chartData || !Array.isArray(options.chartData.notes) || options.chartData.notes.length === 0) {
                    console.log('[Engine] Generating dynamic chart from audio track...');
                    const autoNotes = generateChartFromAudio(this.songBuffer, CONFIG.BPM);
                    options.chartData = { notes: autoNotes };
                    console.log(`[Engine] Dynamically mapped ${autoNotes.length} notes across 4 lanes.`);
                }
            } catch (e) {
                console.warn('[AudioEngine] Failed to load song:', e);
            }
        },
        playSong: function (initialRate, startSec, durationSec) {
            if (!this.isInit || !this.songBuffer) return;
            this.stopSong();

            this.filterNode = this.ctx.createBiquadFilter();
            this.filterNode.type = 'lowpass';
            this.filterNode.frequency.value = 20000;

            this.musicGain = this.ctx.createGain();
            this.musicGain.gain.value = 0.75;

            this.songSource = this.ctx.createBufferSource();
            this.songSource.buffer = this.songBuffer;
            this.songSource.loop = false; // segment play — no full loop
            this.songSource.playbackRate.value = initialRate || this._fireRate || 1.0;

            this.songSource.connect(this.musicGain);
            this.musicGain.connect(this.filterNode);
            this.filterNode.connect(this.masterGain);

            // Play only the curated segment
            const s = startSec || 0;
            const d = durationSec || this.songBuffer.duration;
            this.songSource.start(0, s, d);
            console.log('[AudioEngine] segment ' + s + 's – ' + (s + d) + 's  (duration: ' + d + 's)');

            // Schedule a 3s fade-out before the segment ends to avoid abrupt cut
            const fadeStart = Math.max(0, d - 3);
            const fadeStartCtx = this.ctx.currentTime + fadeStart;
            this.musicGain.gain.setValueAtTime(0.75, fadeStartCtx);
            this.musicGain.gain.linearRampToValueAtTime(0.0, this.ctx.currentTime + d);

            // When the segment naturally ends -> trigger level complete (victory)
            this.songSource.onended = () => {
                if (gameState === STATE.GAME) completeLevel();
            };
        },
        stopSong: function () {
            if (this.songSource) {
                try { this.songSource.stop(); } catch (e) { }
                try { this.songSource.disconnect(); } catch (e) { }
                this.songSource = null;
            }
        },

        // ── REACTIVE AUDIO ────────────────────────────────────────────────────
        _fireRate: 1.0,      // target playback rate during fire mode
        _sustainTimer: 0,    // throttle for sustain ticks

        onHit: function (isPerfect) {
            if (!this.filterNode || !this.isInit || !this.musicGain || !this.songSource) return;
            const now = this.ctx.currentTime;

            if (isPerfect) {
                // ── PERFECT HIT: full musical punch ──────────────────────────
                // Volume: snap to full (1.0), decay back to normal over 0.35s
                this.musicGain.gain.cancelScheduledValues(now);
                this.musicGain.gain.setValueAtTime(1.0, now);
                this.musicGain.gain.setTargetAtTime(0.75, now + 0.04, 0.18);

                // Filter: flash fully open, snap back slowly
                this.filterNode.frequency.cancelScheduledValues(now);
                this.filterNode.frequency.setValueAtTime(22050, now);
                this.filterNode.frequency.setTargetAtTime(16000, now + 0.06, 0.25);

                // Pitch: satisfying swell +5%, decay back
                this.songSource.playbackRate.cancelScheduledValues(now);
                this.songSource.playbackRate.setValueAtTime(1.05, now);
                this.songSource.playbackRate.setTargetAtTime(this._fireRate, now + 0.06, 0.22);
            } else {
                // ── NORMAL HIT: lighter swell ─────────────────────────────────
                // Volume: bump to 0.90, fall back
                this.musicGain.gain.cancelScheduledValues(now);
                this.musicGain.gain.setValueAtTime(0.90, now);
                this.musicGain.gain.setTargetAtTime(0.75, now + 0.02, 0.12);

                // Filter: open brighter briefly
                this.filterNode.frequency.cancelScheduledValues(now);
                this.filterNode.frequency.setTargetAtTime(20000, now, 0.08);

                // Pitch: subtle +2% nudge
                this.songSource.playbackRate.cancelScheduledValues(now);
                this.songSource.playbackRate.setValueAtTime(1.02, now);
                this.songSource.playbackRate.setTargetAtTime(this._fireRate, now + 0.03, 0.14);
            }

            // Trigger synthesized sound effect
            this.playHitSplat(isPerfect);
        },

        onMiss: function () {
            if (!this.filterNode || !this.isInit) return;
            const now = this.ctx.currentTime;
            // ── HARD vinyl scratch ──
            // Filter: instant slam to 280Hz, slow crawl back
            this.filterNode.frequency.cancelScheduledValues(now);
            this.filterNode.frequency.setValueAtTime(20000, now);
            this.filterNode.frequency.linearRampToValueAtTime(280, now + 0.07);
            // Stay muffled (around 800Hz) until a correct pizza is hit
            this.filterNode.frequency.setTargetAtTime(800, now + 0.1, 0.5);
            // Pitch: big dip + wobble back
            if (this.songSource) {
                this.songSource.playbackRate.cancelScheduledValues(now);
                this.songSource.playbackRate.setValueAtTime(0.82, now);
                this.songSource.playbackRate.linearRampToValueAtTime(1.06, now + 0.18);
                this.songSource.playbackRate.setTargetAtTime(this._fireRate, now + 0.2, 0.5);
            }

            // Trigger error buzzer SFX
            this.playMissSFX();
        },

        onFireMode: function () {
            if (!this.isInit || !this.songSource) return;
            const now = this.ctx.currentTime;
            this._fireRate = 1.15; // Speed up song during fever
            this.songSource.playbackRate.cancelScheduledValues(now);
            this.songSource.playbackRate.setTargetAtTime(this._fireRate, now, 0.5);
        },

        onFireModeEnd: function () {
            if (!this.isInit || !this.songSource) return;
            const now = this.ctx.currentTime;
            this._fireRate = 1.0; // Reset to normal speed
            this.songSource.playbackRate.cancelScheduledValues(now);
            this.songSource.playbackRate.setTargetAtTime(this._fireRate, now, 0.2);
        },

        onSustainTick: function (dt) {
            // Called every game frame while holding a sustain note.
            // Throttle to ~10Hz to avoid flooding the scheduler.
            if (!this.filterNode || !this.isInit || !this.songSource) return;
            this._sustainTimer += dt;
            if (this._sustainTimer < 0.1) return;
            this._sustainTimer = 0;
            const now = this.ctx.currentTime;
            // Gradually open filter brighter (excitement builds)
            const cur = this.filterNode.frequency.value;
            const target = Math.min(22050, cur + 1200);
            this.filterNode.frequency.setTargetAtTime(target, now, 0.08);
            // Slowly increase speed (max +8%)
            const curRate = this.songSource.playbackRate.value;
            const targetRate = Math.min(this._fireRate + 0.08, curRate + 0.004);
            this.songSource.playbackRate.setTargetAtTime(targetRate, now, 0.3);
        },

        onSustainComplete: function () {
            if (!this.isInit) return;
            const now = this.ctx.currentTime;
            // Victory peak: pitch jumps up then settles back to base
            if (this.songSource) {
                this.songSource.playbackRate.cancelScheduledValues(now);
                this.songSource.playbackRate.setValueAtTime(1.12, now);
                this.songSource.playbackRate.setTargetAtTime(this._fireRate, now + 0.08, 0.45);
            }
            // Bright filter snap
            if (this.filterNode) {
                this.filterNode.frequency.cancelScheduledValues(now);
                this.filterNode.frequency.setValueAtTime(22050, now);
            }
            // Chime tones removed — pitch peak + filter snap IS the reward
            this._sustainTimer = 0;
        },


        onFireMode: function () {
            if (!this.isInit) return;
            this._fireRate = 1.07; // music stays faster in fire mode
            const now = this.ctx.currentTime;
            if (this.songSource) {
                this.songSource.playbackRate.cancelScheduledValues(now);
                this.songSource.playbackRate.setValueAtTime(1.12, now);          // hard jump
                this.songSource.playbackRate.setTargetAtTime(1.07, now + 0.1, 0.3); // settle
            }
            if (this.filterNode) {
                this.filterNode.frequency.cancelScheduledValues(now);
                this.filterNode.frequency.setValueAtTime(22050, now);            // fully open
            }
            // Fire fanfare tones removed — the music speed jump IS the signal
        },

        onFireModeEnd: function () {
            if (!this.isInit) return;
            this._fireRate = 1.0;
            const now = this.ctx.currentTime;
            if (this.songSource) {
                this.songSource.playbackRate.cancelScheduledValues(now);
                this.songSource.playbackRate.setTargetAtTime(1.0, now, 0.4);
            }
        },

        // ── SFX ───────────────────────────────────────────────────────────────
        playTone: function (freq, type, attack, decay, vol) {
            if (!this.isInit) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(0, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(vol !== undefined ? vol : 0.3, this.ctx.currentTime + attack);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + decay);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start();
            osc.stop(this.ctx.currentTime + decay);
        },

        playHitSplat: function (isPerfect) {
            if (!this.isInit) return;
            const now = this.ctx.currentTime;

            // 1. Kick/Thump (Deep sine sweep)
            const osc = this.ctx.createOscillator();
            const oscGain = this.ctx.createGain();
            osc.type = 'sine';

            // Pitch sweep down
            osc.frequency.setValueAtTime(isPerfect ? 180 : 130, now);
            osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.1);

            // Volume envelope
            oscGain.gain.setValueAtTime(0, now);
            oscGain.gain.linearRampToValueAtTime(isPerfect ? 0.9 : 0.6, now + 0.01);
            oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

            osc.connect(oscGain);
            oscGain.connect(this.masterGain);
            osc.start(now);
            osc.stop(now + 0.15);

            // 2. "Splat" Noise (Short white noise burst)
            const bufferSize = this.ctx.sampleRate * 0.1; // 100ms
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1; // White noise
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            const noiseFilter = this.ctx.createBiquadFilter();
            noiseFilter.type = 'bandpass';
            noiseFilter.frequency.value = isPerfect ? 2500 : 1500; // Crunchier/higher for perfect

            const noiseGain = this.ctx.createGain();
            noiseGain.gain.setValueAtTime(0, now);
            noiseGain.gain.linearRampToValueAtTime(isPerfect ? 0.4 : 0.2, now + 0.01);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + (isPerfect ? 0.08 : 0.05));

            noise.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(this.masterGain);

            noise.start(now);
        },

        playMissSFX: function () {
            if (!this.isInit) return;
            const now = this.ctx.currentTime;

            // Dissonant, low frequency "Burnt Buzzer"
            const osc1 = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            const oscGain = this.ctx.createGain();

            osc1.type = 'sawtooth';
            osc2.type = 'square';

            osc1.frequency.setValueAtTime(110, now); // A2
            osc2.frequency.setValueAtTime(118, now); // Dissonant beating

            // Slight pitch bend down to sound broken
            osc1.frequency.linearRampToValueAtTime(80, now + 0.4);
            osc2.frequency.linearRampToValueAtTime(85, now + 0.4);

            oscGain.gain.setValueAtTime(0, now);
            oscGain.gain.linearRampToValueAtTime(0.5, now + 0.05);
            oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

            osc1.connect(oscGain);
            osc2.connect(oscGain);
            oscGain.connect(this.masterGain);

            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + 0.4);
            osc2.stop(now + 0.4);
        },

        playOvenBell: function () {
            // Bright, ringing metallic bell for completed pizza
            this.playTone(1046.50, "sine", 0.01, 1.5, 0.15); // C6
            this.playTone(1318.51, "sine", 0.01, 1.3, 0.1);  // E6
            this.playTone(1567.98, "sine", 0.01, 1.0, 0.08); // G6
            this.playTone(2093.00, "sine", 0.01, 0.8, 0.05); // C7
        },

        getAudioVolume: function () {
            if (!this.isInit || !this.analyser) return 0;
            const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            this.analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
            }
            return (sum / dataArray.length) / 255;
        },
        getBassKick: function () {
            if (!this.isInit || !this.analyser) return 0;
            const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            this.analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            const bins = Math.min(4, dataArray.length);
            for (let i = 0; i < bins; i++) {
                sum += dataArray[i];
            }
            return (sum / bins) / 255;
        }
    };

    // --- GAME LOGIC ---
    function spawnNote() {
        const lane = Math.floor(Math.random() * 4);
        const isSustain = Math.random() < 0.2;

        // 15% Chance for a TRAP NOTE (Ghost Note)
        const isTrap = Math.random() < 0.15;

        let tag, color;

        if (isTrap) {
            totalTraps++;
            tag = TRAP_TAGS[Math.floor(Math.random() * TRAP_TAGS.length)];
            color = "#555555"; // Greyish/Burnt color for traps
        } else {
            totalNotes++; // count playable notes for ZK total_notes witness
            const isGolden = perfectStreak >= 10 && Math.random() < 0.3;
            tag = isGolden ? GOLDEN_TAG : TAGS[lane];
        }

        const length = isSustain && !isTrap && tag !== GOLDEN_TAG ? (150 + Math.random() * 200) : 0;

        notes.push({
            lane: lane, y: -NOTE_SIZE - length,
            color: isTrap ? "#555" : THE_OVEN_THEME.colors.lanes[lane].note,
            tag: tag, hit: false, rotation: (Math.random() - 0.5) * 6.0,
            length: length, isSustaining: false,
            isGolden: tag === GOLDEN_TAG,
            isTrap: isTrap
        });
        // BPM-synced note scheduling: musical rhythmic patterns
        // Pattern: mix of quarter notes (1 beat), 8th notes (0.5 beat), and 16th (0.25)
        // Weighted to feel musical: more quarter/8th than 16th notes
        let beatDuration = (60 / CONFIG.BPM) / difficultyMult;

        let rhythmicPatterns = [1, 1, 0.5, 0.5, 0.5, 0.25, 0.25, 1, 0.5];

        if (rushHourActive) {
            // Extreme density during rush hour
            rhythmicPatterns = [0.25, 0.25, 0.125, 0.5, 0.25];
            beatDuration *= 0.8; // Move faster too
        }

        const mult = rhythmicPatterns[Math.floor(Math.random() * rhythmicPatterns.length)];
        nextNoteTime += beatDuration * mult;
    }

    function spawnChartNote(chartNote) {
        const lane = Math.max(0, Math.min(3, chartNote.lane || 0));
        const isTrap = !!chartNote.isTrap;
        let tag, color;

        if (isTrap) {
            totalTraps++;
            tag = TRAP_TAGS[Math.floor(Math.random() * TRAP_TAGS.length)];
            color = "#555555";
        } else {
            totalNotes++;
            tag = TAGS[lane];
            color = THE_OVEN_THEME.colors.lanes[lane].note;
        }

        const moveSpeed = (H * 0.8) * difficultyMult;
        const noteLength = chartNote.isSustain ? (chartNote.length || 0.5) : 0;
        const lengthInPixels = noteLength * moveSpeed;

        notes.push({
            lane: lane,
            y: HIT_Y - (chartNote.time + latency - gameTimer) * moveSpeed,
            color: color,
            tag: tag,
            hit: false,
            rotation: (Math.random() - 0.5) * 6.0,
            length: lengthInPixels,
            isSustaining: false,
            isGolden: false,
            isTrap: isTrap,
            isChartNote: true,
            chartTime: chartNote.time,
            chartLength: noteLength,
            latencySec: latency
        });
    }

    function checkHit(lane) {
        let bestDist = Infinity;
        let targetNote = null;
        notes.forEach(n => {
            if (n.lane === lane && !n.hit) {
                const targetY = n.isChartNote ? HIT_Y : (HIT_Y + latency * ((H * 0.8) * difficultyMult));
                const dist = Math.abs(n.y - targetY);
                if (dist < bestDist) { bestDist = dist; targetNote = n; }
            }
        });

        if (targetNote) {
            const targetY = targetNote.isChartNote ? HIT_Y : (HIT_Y + latency * ((H * 0.8) * difficultyMult));
            // Precision Timing Calibration Calculation (early is negative, late is positive)
            const timeOffset = (targetNote.y - targetY) / ((H * 0.8) * difficultyMult);
            const absOffset = Math.abs(timeOffset);

            // Standardize timing windows in seconds (completely independent of screen height/speed!)
            const HIT_WINDOW_SEC = 0.180; // +/- 180ms total window
            const PERFECT_WINDOW_SEC = 0.045; // +/- 45ms Perfect
            const TASTY_WINDOW_SEC = 0.120; // +/- 120ms Good/Tasty

            if (absOffset < HIT_WINDOW_SEC) {
                targetNote.hit = true;

                // --- TRAP LOGIC ---
                if (targetNote.isTrap) {
                    // PENALTY FOR HITTING A TRAP
                    if (fireMode) AudioEngine.onFireModeEnd();
                    combo = 0; fireMode = false; health -= 15; perfectStreak = 0;
                    score = Math.max(0, score - 500);
                    createFeedback("WRONG ORDER! 🚫", lane, HIT_Y);
                    AudioEngine.onMiss(); // onMiss already triggers playMissSFX internally
                    shake = 18;
                    trapBurnAnim[lane] = 1.0; // Trigger burnt box charring indicator
                    return { hit: false, offset: timeOffset }; // Valid input (it registered), but bad outcome
                }

                if (targetNote.length > 0) targetNote.isSustaining = true;
                const perfect = absOffset < PERFECT_WINDOW_SEC;
                const tasty = absOffset < TASTY_WINDOW_SEC;

                // Precision Timing Calibration Calculation
                accuracyTicks.push({ offset: timeOffset, life: 1.5, isPerfect: perfect });
                if (accuracyTicks.length > 20) accuracyTicks.shift();

                // Dynamic Auto-Calibration: gently align latency to player's natural offset over time
                if (tasty) {
                    // A positive offset means late hit, so notes should arrive slightly later -> increase latency slightly
                    // A negative offset means early hit, so notes should arrive slightly earlier -> decrease latency slightly
                    latency += timeOffset * 0.035; 
                    // Keep latency within reasonable bounds (e.g. -100ms to +300ms)
                    latency = Math.max(-0.1, Math.min(0.3, latency));
                    if (window.updateGuitarPizzaLatency) {
                        window.updateGuitarPizzaLatency(latency * 1000);
                    }
                }

                totalHits++;
                // Trigger box bounce animation on the hit lane
                laneBoxAnim[lane] = 1.0;
                laneHitAnim[lane] = 1.0; // Trigger neonglow flash
                if (perfect) {
                    totalPerfectHits++;
                    perfectStreak++;
                    if (targetNote.isGolden) {
                        secretIngredients++;
                        score += 5000;
                        createFeedback("SECRET SAUCE! 🧪", lane, HIT_Y);
                        perfectStreak = 0; // Reset after finding one
                    }
                } else {
                    perfectStreak = 0;
                }

                // Trigger Fever Mode if combo is about to reach 20
                if (combo >= 19 && !fireMode) {
                    fireMode = true;
                    AudioEngine.onFireMode();
                    createFeedback("🔥🔥 FEVER MODE! 🔥🔥", -1, H * 0.5);
                    shake = 15;
                }

                const multiplier = fireMode ? 2 : 1;
                score += (perfect ? 100 + (combo * 10) : 50 + (combo * 5)) * multiplier;
                combo++;
                if (combo > maxCombo) maxCombo = combo;

                // Cool combo streak popups
                if (combo > 0 && combo % 10 === 0 && !fireMode) {
                    createFeedback("COMBO " + combo + "!", -1, H * 0.4);
                }

                health = Math.min(100, health + (perfect ? 3 : 1));
                createExplosion(targetNote.lane, HIT_Y, targetNote.color, perfect);
                createFeedback(perfect ? "DELICIOUS!" : "TASTY", lane, HIT_Y);

                shake = perfect ? (fireMode ? 8 : 6) : 3;
                camScale = perfect ? 1.02 : 1.01;
                // Music IS the feedback: no synthetic chord — onHit swells the song itself
                AudioEngine.onHit(perfect);

                pizzaProgress++;
                if (pizzaProgress >= CONFIG.HITS_PER_PIZZA) finishPizza();
                return { hit: true, offset: timeOffset }; // HIT
            }
        }

        // MISS PENALTY (if no targetNote found, or targetNote is out of bounds)
        if (fireMode) AudioEngine.onFireModeEnd();
        combo = 0; fireMode = false; health -= 4; perfectStreak = 0;
        console.log(`[Engine] MISS! Lane ${lane} played without a note. Health drops by 4 to ${health}`);
        createFeedback("BURNT", lane, HIT_Y);
        shake = 5; camScale = 0.98;
        AudioEngine.onMiss(); // onMiss triggers playMissSFX internally
        return { hit: false, offset: null }; // MISS
    }

    let pizzaPopup = { active: false, scale: 0, alpha: 0, timer: 0 };
    function finishPizza() {
        pizzaProgress = 0; pizzasMade++; score += 1000; health = Math.min(100, health + 15);
        AudioEngine.playOvenBell();
        createFeedback("ORDER UP!", -1, H * 0.3);
        pizzaPopup.active = true; pizzaPopup.scale = 0; pizzaPopup.alpha = 1; pizzaPopup.timer = 1.5;
    }

    function update(dt) {
        pollGamepads();
        const moveSpeed = (H * 0.8) * difficultyMult;
        if (shake > 0) shake *= 0.9;
        if (camScale > 1.0) camScale -= dt * 0.1;
        if (camScale < 1.0) camScale += dt * 0.1;

        bgScrollY = (bgScrollY + (100 + combo * 2) * dt) % 120;

        beatTimer += dt;
        if (beatTimer >= (60 / CONFIG.BPM)) {
            beatTimer -= (60 / CONFIG.BPM);
            beatFlash = 0.3;
            if (!fireMode) camScale = 1.005;
        }
        if (beatFlash > 0) beatFlash -= dt * 2.0;

        if (health <= 0) {
            console.log(`[Engine] Health reached ${health}. Triggering Game Over.`);
            // ROBUSTNESS: Only end if we actually have dimensions initialized.
            // Occasionally resize() hasn't fired yet on first frames.
            if (W > 0 && H > 0) {
                endGame();
            }
            return;
        }

        difficultyTimer += dt;
        if (difficultyTimer > 20.0 && difficultyMult < 1.3) {
            difficultyTimer = 0; difficultyMult += 0.1;
            createFeedback("SPEED UP! ⚡", -1, H / 2);
        }

        if (fireMode) feverTime += dt;  // accumulate seconds in fever/fire mode
        gameTimer += dt;
        // Lead-in over: start the song exactly when the clock crosses zero
        if (_pendingSongPlay && gameTimer >= 0) {
            const _startSong = _pendingSongPlay;
            _pendingSongPlay = null;
            _startSong();
        }
        rushHourTimer += dt;

        // ── RUSH HOUR LOGIC ──
        if (!rushHourActive && rushHourTimer > rushHourNextTrigger && CONFIG.SONG_DURATION > 30) {
            // Trigger Rush Hour
            rushHourActive = true;
            rushHourDuration = 6 + Math.random() * 4; // 6 to 10 seconds of chaos
            createFeedback("SYSTEM OVERRIDE!", -1, H * 0.4);
            shake = 20;
            // Next rush hour in 20-30 seconds
            rushHourNextTrigger = rushHourTimer + rushHourDuration + 20 + Math.random() * 10;
        }

        if (rushHourActive) {
            rushHourDuration -= dt;
            if (rushHourDuration <= 0) {
                rushHourActive = false;
                createFeedback("OVERRIDE COMPLETE", -1, H * 0.4);
                score += 5000;
                finishPizza(); // Instant pizza completion as reward
                health = Math.min(100, health + 20); // Big heal
            }
        }

        // ── Box opening: all open at 15% of song ──
        if (CONFIG.SONG_DURATION > 0 && gameTimer / CONFIG.SONG_DURATION >= 0.15) {
            if (laneBoxPhase[0] !== 1) {
                laneBoxPhase = [1, 1, 1, 1];
                centerBanner = { text: t.engineLetsCook, life: 1.4, maxLife: 1.4 };
            }
        }
        // Update banner
        if (centerBanner) {
            centerBanner.life -= dt;
            if (centerBanner.life <= 0) centerBanner = null;
        }
        // Decay box bounce animations
        for (let i = 0; i < 4; i++) {
            if (laneBoxAnim[i] > 0) laneBoxAnim[i] = Math.max(0, laneBoxAnim[i] - dt * 8);
            if (laneHitAnim[i] > 0) laneHitAnim[i] = Math.max(0, laneHitAnim[i] - dt * 4); // decay over ~250ms
            if (trapBurnAnim[i] > 0) trapBurnAnim[i] = Math.max(0, trapBurnAnim[i] - dt * 3); // decay over ~330ms
        }
        // Update timing precision calibrator ticks
        for (let i = accuracyTicks.length - 1; i >= 0; i--) {
            accuracyTicks[i].life -= dt;
            if (accuracyTicks[i].life <= 0) accuracyTicks.splice(i, 1);
        }

        if (chartNotesToSpawn) {
            const preSpawnTime = (HIT_Y + NOTE_SIZE) / moveSpeed;
            while (chartNotesToSpawn.length > 0) {
                const nextChartNote = chartNotesToSpawn[0];
                if (gameTimer >= nextChartNote.time + latency - preSpawnTime) {
                    spawnChartNote(nextChartNote);
                    chartNotesToSpawn.shift();
                } else {
                    break;
                }
            }
        } else {
            if (gameTimer > nextNoteTime) spawnNote();
        }

        if (pizzaPopup.active) {
            pizzaPopup.timer -= dt;
            if (pizzaPopup.timer <= 0) pizzaPopup.active = false;
            else {
                if (pizzaPopup.scale < 0.6) pizzaPopup.scale += dt * 8;
                else pizzaPopup.scale = 0.6;
                if (pizzaPopup.timer < 0.3) pizzaPopup.alpha = pizzaPopup.timer * 3;
            }
        }

        // Robustness fallback: complete level if we exceed song duration by 2 seconds
        if (CONFIG.SONG_DURATION > 0 && gameTimer >= CONFIG.SONG_DURATION + 2.0) {
            completeLevel();
        }

        // Notes update
        for (let i = notes.length - 1; i >= 0; i--) {
            let n = notes[i];
            if (n.isChartNote) {
                n.y = HIT_Y - (n.chartTime + latency - gameTimer) * moveSpeed;
                n.length = n.chartLength * moveSpeed;
            } else {
                n.y += moveSpeed * dt;
            }

            if (n.hit) {
                if (n.length > 0) {
                    if (n.y - n.length > HIT_Y) {
                        notes.splice(i, 1);
                        createFeedback("HELD!", n.lane, HIT_Y); score += 500 * (fireMode ? 2 : 1);
                        AudioEngine.onSustainComplete();
                        continue;
                    }
                    if (Input.held[n.lane]) {
                        n.isSustaining = true; score += 10 * (fireMode ? 2 : 1); health = Math.min(100, health + 0.05);
                        if (gameTimer % 0.1 < 0.02) createExplosion(n.lane, HIT_Y, n.color, true);
                        AudioEngine.onSustainTick(dt);
                    } else n.isSustaining = false;
                } else notes.splice(i, 1);
                continue;
            }

            n.rotation += dt * 2;
            if (n.y - n.length > H + NOTE_SIZE) {
                // If it was a TRAP, letting it pass is GOOD (No penalty)
                if (!n.isTrap) {
                    if (fireMode) AudioEngine.onFireModeEnd();
                    combo = 0; fireMode = false; health -= rushHourActive ? 8 : 4; // Double damage during rush hour
                    console.log(`[Engine] NOTE DROPPED! Lane ${n.lane}. Health drops by ${rushHourActive ? 8 : 4} to ${health}`);
                    createFeedback("DROPPED!", n.lane, H - 50);
                    shake = 12; // Heavy shake on dropped note
                    camScale = 0.95;
                    AudioEngine.onMiss(); // onMiss triggers playMissSFX internally
                } else {
                    // Bonus for avoiding trap
                    trapsAvoided++;
                    createFeedback("DODGED!", n.lane, H - 50);
                    score += 50;
                }

                // IMPORTANT: Always remove the note from the array, whether it was a trap or not.
                // Previously, this was inside the `if` block above, causing an infinite loop
                // because `i--` in the for-loop would keep hitting the same non-deleted note over and over again?
                // Actually, the original code had `notes.splice(i, 1);` at the top of the block, 
                // but the recent SFX changes might have messed with `playMiss` vs `playMissSFX`. Let's ensure it's deleted.
                notes.splice(i, 1);
            }
        }

        // Particles update
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].vy += 2000 * dt; // Gravity pulls them down
            particles[i].x += particles[i].vx * dt;
            particles[i].y += particles[i].vy * dt;
            if (particles[i].rotation !== undefined) {
                particles[i].rotation += particles[i].vr * dt;
            }
            particles[i].life -= dt * 1.5; // Slightly longer life to see them fall
            if (particles[i].life <= 0) particles.splice(i, 1);
        }

        // Feedback update
        for (let i = feedbackSystem.length - 1; i >= 0; i--) {
            feedbackSystem[i].y -= (H * 0.2) * dt;
            feedbackSystem[i].life -= dt;
            if (feedbackSystem[i].life <= 0) feedbackSystem.splice(i, 1);
        }
    }

    function createExplosion(lane, y, color, big) {
        const tempX = (lane * LANE_W) + (LANE_W / 2);
        const isSoft = (options.vfxMode || 'soft') === 'soft';
        const count = isSoft ? (big ? 8 : 4) : (big ? 35 : 15);
        for (let i = 0; i < count; i++) {
            particles.push({
                x: tempX, y: y,
                vx: (Math.random() - 0.5) * (W * (isSoft ? 0.35 : 0.8)),
                vy: -Math.random() * (H * (isSoft ? 0.35 : 0.7)) - (H * (isSoft ? 0.1 : 0.2)), // Jump up (pop)
                color: color,
                life: 1.0,
                size: Math.random() * (W * (isSoft ? 0.015 : 0.03)) + (isSoft ? 3 : 6),
                rotation: Math.random() * Math.PI * 2,
                vr: (Math.random() - 0.5) * (isSoft ? 5 : 15) // rotation speed
            });
        }
    }

    function createFeedback(text, lane, y) {
        let x = (lane !== -1) ? (lane * LANE_W) + (LANE_W / 2) : W / 2;
        // Store lane to recalculate X in render if window resizes
        // Determine theme color based on text
        let fColor = "#ffffff";
        if (text === "ORDER UP!" || text === "TASTY" || text.startsWith("D")) {
            fColor = THE_OVEN_THEME.colors.background.ovenBorder; // Mafia Gold
        } else if (text === "PERFECT" || text === "HELD!" || text === "OVERRIDE COMPLETE") {
            fColor = "#ffffff"; // Stark white for perfect
        } else if (text === "SYSTEM OVERRIDE!") {
            fColor = "#00ffff"; // Cyan neon for override
        } else {
            fColor = THE_OVEN_THEME.colors.background.checker; // Blood Red for miss/wrong
        }

        feedbackSystem.push({
            text: text, x: x, y: y, life: 1.0, lane: lane,
            color: fColor
        });
    }

    function drawBackground(ctx, W, H, offsetX, totalGameWidth, dt, moveSpeed) {
        const isSoft = (options.vfxMode || 'soft') === 'soft';
        // 1. Draw Italian Tablecloth Pattern (Red/White Checkers)
        const checkSize = 40;
        const rows = Math.ceil(H / checkSize);
        const cols = Math.ceil(W / checkSize);

        // Base white
        ctx.fillStyle = THE_OVEN_THEME.colors.background.base;
        ctx.fillRect(0, 0, W, H);

        // Red squares - much cleaner in soft mode
        ctx.fillStyle = isSoft ? "rgba(154, 31, 31, 0.42)" : THE_OVEN_THEME.colors.background.checker; // Mafia Red
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if ((r + c) % 2 === 1) {
                    ctx.fillRect(c * THE_OVEN_THEME.dimensions.checkerSize, r * THE_OVEN_THEME.dimensions.checkerSize, THE_OVEN_THEME.dimensions.checkerSize, THE_OVEN_THEME.dimensions.checkerSize);
                }
            }
        }

        // 2. Draw Dark Game Track Background (The "Oven" or "Space")

        // Shadow behind the track
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = isSoft ? 0 : 25;
        ctx.fillStyle = THE_OVEN_THEME.colors.background.oven;
        ctx.fillRect(offsetX, 0, totalGameWidth, H);
        ctx.shadowBlur = 0; // Reset shadow

        // 3. Borders
        // Outer Dark Border
        ctx.strokeStyle = THE_OVEN_THEME.colors.background.outerBorder;
        ctx.lineWidth = 10;
        ctx.strokeRect(offsetX - 5, -10, totalGameWidth + 10, H + 20);

        // Inner Gold Border
        ctx.strokeStyle = THE_OVEN_THEME.colors.background.ovenBorder; // Gold
        ctx.lineWidth = 6;
        ctx.strokeRect(offsetX, 0, totalGameWidth, H);

        // 3. Space/Star effect ONLY inside the track
        bgOffsetY += moveSpeed * dt * 0.4;
        ctx.save();
        ctx.beginPath();
        ctx.rect(offsetX, 0, totalGameWidth, H);
        ctx.clip();

        ctx.globalAlpha = isSoft ? 0.015 : 0.05;
        const starCount = isSoft ? 6 : 20;
        for (let i = 0; i < starCount; i++) {
            const x = offsetX + Math.random() * totalGameWidth;
            const y = (Math.random() * H + bgOffsetY) % H;
            ctx.fillStyle = "#fff"; ctx.fillRect(x, y, 2, 2);
        }
        ctx.restore();
        ctx.globalAlpha = 1.0;
    }

    function render(dt) {
        // Clear canvas
        ctx.clearRect(0, 0, W, H);

        // If Menu, STOP here. (Loop clears it to transparent).
        if (gameState === STATE.MENU) return;
        // Do NOT stop for RESULTS, we want to see the frozen last frame of the game!

        const totalGameWidth = 4 * LANE_W;
        const offsetX = (W - totalGameWidth) / 2;
        const moveSpeed = (H * 0.8) * difficultyMult;

        // Draw Background (Tablecloth + Oven)
        drawBackground(ctx, W, H, offsetX, totalGameWidth, dt, moveSpeed);
 
        // Retrieve real-time audio analysis data
        const volume = (AudioEngine.getAudioVolume ? AudioEngine.getAudioVolume() : 0);
        const bassKick = (AudioEngine.getBassKick ? AudioEngine.getBassKick() : 0);
        const isSoft = (options.vfxMode || 'soft') === 'soft';
        const bassZoom = isSoft ? 0 : (bassKick * 0.007); // max +0.7% zoom on heavy bass kicks (disabled in soft mode)
 
        // Shake & Audio-Reactive camera bounce effect
        ctx.save();
        ctx.translate(W / 2, H / 2); ctx.scale(camScale + bassZoom, camScale + bassZoom); ctx.translate(-W / 2, -H / 2);
        const appliedShake = isSoft ? (shake * 0.15) : shake;
        if (appliedShake > 0.1) ctx.translate((Math.random() - 0.5) * appliedShake, (Math.random() - 0.5) * appliedShake);
 
        // Removed the beatFlash overlay directly so it stops putting white/red flashes over everything
        // if (beatFlash > 0) { ... }
 
        // 1. Draw Lane Backgrounds
        for (let i = 0; i < 4; i++) {
            const x = offsetX + i * LANE_W;
            const ingredient = THE_OVEN_THEME.colors.lanes[i];
 
            // If rush hour is active, lanes glow with Cyberpunk Neon Tech Colors
            let topColor, botColor;
            if (rushHourActive) {
                // Neon Grid / Cyberpunk Aesthetic (Cyan / Magenta)
                const neonGlows = [
                    "rgba(0, 255, 255, 0.4)", // Cyan
                    "rgba(255, 0, 255, 0.4)", // Magenta
                    "rgba(138, 43, 226, 0.4)", // Blue Violet
                    "rgba(57, 255, 20, 0.4)"   // Neon Green
                ];
                topColor = neonGlows[i % 4];
                if (isSoft) {
                    topColor = topColor.replace(/0\.4\)$/, '0.10)'); // Tamer overlay in soft mode
                }
 
                // Pulsing bottom color based on time
                const pulseAlpha = isSoft ? 0.04 : (0.2 + (Math.sin(gameTimer * 10 + i) * 0.5 + 0.5) * 0.2);
                botColor = topColor.replace(/0\.(?:4|10)\)$/, pulseAlpha + ')');
 
                // Tech-glitch flash
                if (!isSoft && Math.random() < 0.03) botColor = "rgba(255, 255, 255, 0.7)";
            } else {
                topColor = ingredient.primary.replace(/rgba\(([^,]+),([^,]+),([^,]+),([^)]+)\)/, "rgba($1,$2,$3,0.9)");
                botColor = ingredient.primary.replace(/rgba\(([^,]+),([^,]+),([^,]+),([^)]+)\)/, "rgba($1,$2,$3,0.7)");
            }
 
            const gradient = ctx.createLinearGradient(x, 0, x, H);
            gradient.addColorStop(0, topColor);
            gradient.addColorStop(1, botColor);
 
            ctx.fillStyle = gradient; ctx.fillRect(x, 0, LANE_W, H);
 
            // Tech-Futurist Matrix/Grid overlay during override
            if (rushHourActive) {
                ctx.strokeStyle = isSoft ? "rgba(0, 255, 255, 0.05)" : "rgba(0, 255, 255, 0.15)";
                ctx.lineWidth = 1;
                const dashOffset = (gameTimer * (isSoft ? 60 : 200)) % 40;
                ctx.setLineDash([5, 15]);
                ctx.lineDashOffset = dashOffset;
 
                // Draw vertical tech lines
                ctx.beginPath();
                ctx.moveTo(x + LANE_W * 0.25, 0); ctx.lineTo(x + LANE_W * 0.25, H);
                ctx.moveTo(x + LANE_W * 0.75, 0); ctx.lineTo(x + LANE_W * 0.75, H);
                ctx.stroke();
                ctx.setLineDash([]); // Reset
            }
 
            ctx.strokeStyle = rushHourActive ? (isSoft ? "rgba(0, 255, 255, 0.25)" : "rgba(0, 255, 255, 0.5)") : "rgba(0,0,0,0.3)";
            ctx.lineWidth = rushHourActive ? (isSoft ? 2 : 3) : THE_OVEN_THEME.dimensions.laneBorderWidth;
            ctx.strokeRect(x, 0, LANE_W, H);
        }
 
        // --- DOUBLE-SIDED NEON GOLD EQUALIZER SPECTROGRAMS (RHYTHMIC FREQUENCIES) ---
        if (AudioEngine.analyser && !isSoft) {
            const bufferLength = AudioEngine.analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            AudioEngine.analyser.getByteFrequencyData(dataArray);
 
            const visW = 8; // extremely narrow, elegant visualizer indicator lines
            const visH = H * 0.45; // height of visualizer panel
            const visY = H * 0.25; // y position
            const visXLeft = offsetX - 6; // left border
            const visXRight = offsetX + totalGameWidth + 6; // right border
 
            const barCount = 14;
            const singleBarH = visH / barCount;
 
            ctx.save();
            for (let i = 0; i < barCount; i++) {
                // Read frequency data (lowest to highest indices represent bass to treble)
                const freqVal = dataArray[i % dataArray.length] / 255; // 0..1
                const barLength = Math.max(2, freqVal * visW);
 
                // Select glowing gradient matching the Oven/Mafia Gold theme (highly translucent)
                const valAlpha = freqVal * 0.30;
                ctx.fillStyle = `rgba(255, 215, 0, ${valAlpha})`;
                if (!isSoft) {
                    ctx.shadowColor = "rgba(255, 215, 0, 1)";
                    ctx.shadowBlur = freqVal * 3;
                }
 
                // Draw left bar (expands left)
                ctx.fillRect(visXLeft - barLength, visY + i * singleBarH, barLength, singleBarH - 3);
 
                // Draw right bar (expands right)
                ctx.fillRect(visXRight, visY + i * singleBarH, barLength, singleBarH - 3);
            }
            ctx.restore();
        }
 
        // 1.5 Pulsing background combo over lanes, under notes
        if (combo >= 5) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(offsetX, 0, totalGameWidth, H);
            ctx.clip(); // Ensure it doesn't bleed outside the oven track
 
            const isFever = fireMode;
            const cbx = offsetX + totalGameWidth / 2;
            const cby = H * 0.5;
            const baseFontSize = W * (isSoft ? 0.18 : 0.25);
            const pulse = beatFlash;
            // Easing the pulse
            const size = baseFontSize * (1.0 + pulse * (isSoft ? 0.05 : 0.15));
 
            ctx.translate(cbx, cby);
            ctx.globalAlpha = isFever 
                ? (isSoft ? 0.08 : 0.3 + pulse * 0.3) 
                : (isSoft ? 0.04 : 0.15 + pulse * 0.15);
            ctx.font = `900 italic ${size}px 'Impact'`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = isFever ? '#ff4500' : '#ffffff';
            if (!isSoft) {
                ctx.shadowColor = isFever ? '#ff4500' : '#D4Af37';
                ctx.shadowBlur = isFever ? 40 : 20;
            }
            ctx.fillText(combo + "x", 0, 0);
            ctx.restore();
        }
 
        // 2. Draw Elegant Division / Delivery Counter for the Pizzas
        // Move it higher so open boxes don't cover the golden trim
        const counterTop = HIT_Y - (LANE_W * 0.65);
        const counterHeight = H - counterTop;
 
        // Counter Background (Dark translucent glass)
        ctx.fillStyle = "rgba(20, 5, 5, 0.8)";
        ctx.fillRect(offsetX, counterTop, totalGameWidth, counterHeight);

        // Golden Line separating the lanes from the counter (Elegant Hit Frame)
        ctx.fillStyle = THE_OVEN_THEME.colors.hitLine;
        ctx.shadowBlur = 10;
        ctx.shadowColor = THE_OVEN_THEME.colors.hitLine;
        ctx.fillRect(offsetX, counterTop, totalGameWidth, 4);
        ctx.shadowBlur = 0;

        // A second subtle gold trim line at the very bottom
        ctx.fillRect(offsetX, H - 6, totalGameWidth, 6);

        // 3. Draw Pizza Boxes and Hit Feedback
        for (let i = 0; i < 4; i++) {
            const x = offsetX + i * LANE_W;
            const ingredient = THE_OVEN_THEME.colors.lanes[i];

            // ── Pizza Box Plate ──
            const plateX = x + LANE_W / 2; const plateY = HIT_Y; const plateRadius = LANE_W * 0.35;
            const boxSize = plateRadius * 2.8;
            const boxImg = laneBoxPhase[i] === 1 ? PLATE_ASSETS.open[i] : PLATE_ASSETS.closed[i];

            // Lift: box moves UP on hit, returns smoothly
            const anim = laneBoxAnim[i];
            const liftY = Math.sin(anim * Math.PI) * 12; // max -12px up
            const drawY = plateY - liftY;

            // ── Neon hold glow (pulsing with beat & real-time audio volume!) ──
            if (Input.held[i] && !isSoft) {
                const pulse = 1.0 + beatFlash * 0.4 + volume * 0.6;
                const glowR = boxSize * 0.7 * pulse;
                const neonColors = [
                    'rgba(192,57,43',   // red   (pepperoni)
                    'rgba(241,196,15',  // yellow(cheese)
                    'rgba(217,136,128', // pink  (bacon)
                    'rgba(155,89,182',  // purple(onion)
                ];
                const base = neonColors[i];
                const neonGrad = ctx.createRadialGradient(plateX, drawY, 0, plateX, drawY, glowR);
                neonGrad.addColorStop(0, base + (isSoft ? ', 0.22)' : ', 0.6)'));
                neonGrad.addColorStop(0.5, base + (isSoft ? ', 0.08)' : ', 0.2)'));
                neonGrad.addColorStop(1, base + ', 0)');
                ctx.fillStyle = neonGrad;
                ctx.shadowColor = ingredient.primary;
                ctx.shadowBlur = isSoft ? 8 * pulse : 35 * pulse;
                ctx.beginPath(); ctx.arc(plateX, drawY, glowR, 0, Math.PI * 2); ctx.fill();
                ctx.shadowBlur = 0;
            }

            if (boxImg) {
                // Removed the dark 0.3 opacity black box that was darkening the plates
                ctx.drawImage(boxImg, plateX - boxSize / 2, drawY - boxSize / 2, boxSize, boxSize);
            } else {
                ctx.fillStyle = "rgba(0,0,0,0.4)"; ctx.beginPath(); ctx.arc(plateX + 4, drawY + 4, plateRadius + 2, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = ingredient.plate; ctx.beginPath(); ctx.arc(plateX, drawY, plateRadius, 0, Math.PI * 2); ctx.fill();
            }

            // ── Gamepad Active Overlay Button Helper ──
            if (gamepadActive) {
                const badgeY = drawY + plateRadius * 1.5;
                
                // Xbox face buttons and shoulder buttons configurations
                const xboxConfigs = [
                    { primary: 'LT', secondary: 'X', dpad: '◀', color: '#3498db', textColor: '#ffffff' }, // Lane 0: LT / X
                    { primary: 'LB', secondary: 'A', dpad: '▼', color: '#2ecc71', textColor: '#ffffff' }, // Lane 1: LB / A
                    { primary: 'RB', secondary: 'Y', dpad: '▲', color: '#f1c40f', textColor: '#000000' }, // Lane 2: RB / Y
                    { primary: 'RT', secondary: 'B', dpad: '▶', color: '#e74c3c', textColor: '#ffffff' }  // Lane 3: RT / B
                ];
                
                const config = xboxConfigs[i];
                
                ctx.save();
                
                // 1. Draw D-pad Arrow Indicator
                ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
                ctx.font = 'bold 11px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(config.dpad, plateX - 25, badgeY);
                
                // 2. Draw Xbox Shoulder/Trigger Pill Badge
                const pillW = 22;
                const pillH = 15;
                ctx.fillStyle = config.color;
                ctx.beginPath();
                ctx.roundRect(plateX - pillW / 2, badgeY - pillH / 2, pillW, pillH, 4);
                ctx.fill();
                
                // White border
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1.2;
                ctx.stroke();
                
                // 3. Draw Badge Primary Text (LT/LB/RB/RT)
                ctx.fillStyle = config.textColor;
                ctx.font = "900 9px monospace";
                ctx.textAlign = 'center';
                ctx.fillText(config.primary, plateX, badgeY + 0.5);
                
                // 4. Draw Secondary/Alternative Face Button Badge (X/A/Y/B) in parenthesis
                ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
                ctx.font = "bold 9px Arial";
                ctx.textAlign = 'left';
                ctx.fillText(`(${config.secondary})`, plateX + pillW / 2 + 5, badgeY);
                
                ctx.restore();
            }

            // --- NEON HIT GLOW RING & EXPANDING RIPPLE EFFECT ---
            if (laneHitAnim[i] > 0 && !isSoft) {
                const hitAlpha = laneHitAnim[i];
                const hitRadius = plateRadius * (0.85 + (1.0 - hitAlpha) * 1.0);
                const neonColors = [
                    'rgba(255, 77, 77',   // red   (pepperoni)
                    'rgba(241, 196, 15',  // yellow(cheese)
                    'rgba(232, 167, 161', // pink  (bacon)
                    'rgba(155, 89, 182',  // purple(onion)
                ];
                const base = neonColors[i];
                ctx.save();
                ctx.strokeStyle = base + `, ${isSoft ? hitAlpha * 0.35 : hitAlpha})`;
                ctx.lineWidth = (isSoft ? 3 : 6) * hitAlpha;
                if (!isSoft) {
                    ctx.shadowColor = base + `, 1.0)`;
                    ctx.shadowBlur = 20 * hitAlpha;
                }
                ctx.beginPath();
                ctx.arc(plateX, drawY, hitRadius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            }

            // --- TRAP CARBONIZED BLACK SOOT & RED SMOKE TRAIL ---
            if (trapBurnAnim[i] > 0) {
                const burnAlpha = trapBurnAnim[i];
                ctx.save();
                // 1. Red warning hot outline
                ctx.strokeStyle = `rgba(231, 76, 60, ${burnAlpha})`;
                ctx.lineWidth = isSoft ? 4 * burnAlpha : 8 * burnAlpha;
                if (!isSoft) {
                    ctx.shadowColor = 'rgba(231, 76, 60, 1)';
                    ctx.shadowBlur = 25 * burnAlpha;
                }
                ctx.beginPath();
                ctx.arc(plateX, drawY, plateRadius * 1.3, 0, Math.PI * 2);
                ctx.stroke();
                
                // 2. Burnt soot overlay
                ctx.fillStyle = `rgba(18, 9, 4, ${burnAlpha * 0.8})`;
                ctx.beginPath();
                ctx.arc(plateX, drawY, plateRadius * 1.2, 0, Math.PI * 2);
                ctx.fill();
                
                // 3. Dynamic drifting ash smoke (disabled in soft mode to prevent particles overhead)
                if (!isSoft) {
                    ctx.fillStyle = `rgba(45, 45, 45, ${burnAlpha * 0.65})`;
                    for (let j = 0; j < 3; j++) {
                        const smokeR = plateRadius * (0.22 + Math.sin(gameTimer * 5 + j) * 0.08);
                        const smokeX = plateX + Math.sin(gameTimer * 7 + j) * 12;
                        const smokeY = drawY - (LANE_W * 0.35) * (1.0 - burnAlpha) - (j * 14);
                        ctx.beginPath();
                        ctx.arc(smokeX, smokeY, smokeR, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                ctx.restore();
            }
        }

        // Hit Zone — side ticks per lane (no full line over the pizza boxes)
        ctx.shadowBlur = isSoft ? 0 : 8;
        ctx.shadowColor = THE_OVEN_THEME.colors.hitLine;
        ctx.fillStyle = THE_OVEN_THEME.colors.hitLine;
        const tickW = 10, tickH = 18;
        for (let i = 0; i < 4; i++) {
            const lx = offsetX + i * LANE_W;
            const rx = lx + LANE_W;
            // Left tick (pointing right ▶)
            ctx.beginPath();
            ctx.moveTo(lx, HIT_Y - tickH / 2);
            ctx.lineTo(lx + tickW, HIT_Y);
            ctx.lineTo(lx, HIT_Y + tickH / 2);
            ctx.closePath(); ctx.fill();
            // Right tick (pointing left ◀)
            ctx.beginPath();
            ctx.moveTo(rx, HIT_Y - tickH / 2);
            ctx.lineTo(rx - tickW, HIT_Y);
            ctx.lineTo(rx, HIT_Y + tickH / 2);
            ctx.closePath(); ctx.fill();
        }
        ctx.shadowBlur = 0;

        // Notes
        notes.forEach(n => {
            const x = offsetX + n.lane * LANE_W + LANE_W / 2;
            // Sustain tail
            if (n.length > 0) {
                const tailWidth = LANE_W * 0.4;
                const tailX = x - tailWidth / 2;
                const tailY = n.y - n.length;
                ctx.fillStyle = n.color; ctx.globalAlpha = 0.6; ctx.fillRect(tailX, tailY, tailWidth, n.length);
                ctx.globalAlpha = 1.0;
            }

            const img = ASSETS[n.tag];
            ctx.save(); ctx.translate(x, n.y); ctx.rotate(n.rotation);
            if (img) {
                const s = NOTE_SIZE;
                ctx.beginPath(); ctx.arc(0, 0, s / 2, 0, Math.PI * 2); ctx.closePath();
                ctx.save(); ctx.clip();
                ctx.drawImage(img, -s * 0.65, -s * 0.65, s * 1.3, s * 1.3);
                
                // 1. DANGER SHADING TINT FOR TRAPS
                if (n.isTrap) {
                    ctx.fillStyle = "rgba(139, 0, 0, 0.4)"; // Translucent Crimson Overlay
                    ctx.fill();
                } else if (fireMode) {
                    // Gold skinning overlay for Fever Mode notes
                    ctx.fillStyle = "rgba(255, 215, 0, 0.45)"; // Translucent Gold
                    ctx.fill();
                }
                ctx.restore();
                
                // 2. HIGHLIGHT GLOWS AND OUTLINE STYLING
                if (n.isTrap) {
                    ctx.strokeStyle = "#FF3333"; // Hazard Red
                    ctx.lineWidth = 5;
                    ctx.shadowBlur = isSoft ? 0 : 10;
                    ctx.shadowColor = "#FF3333"; // Flashing red outer glow
                } else if (fireMode) {
                    ctx.strokeStyle = "#FFD700"; // Gold
                    ctx.lineWidth = 4;
                    ctx.shadowBlur = isSoft ? 0 : 8;
                    ctx.shadowColor = "#FFD700";
                } else {
                    ctx.strokeStyle = "white";
                    ctx.lineWidth = 3;
                    ctx.shadowBlur = 0;
                }
                ctx.stroke();

                // 3. HAZARD BAN/SKULL OVERLAY
                if (n.isTrap) {
                    ctx.shadowBlur = 0; // Reset shadow for internal overlays
                    
                    // Draw Red Diagonal Strike (🚫)
                    const r = s / 2;
                    ctx.strokeStyle = "#FF3333";
                    ctx.lineWidth = 5;
                    ctx.beginPath();
                    ctx.moveTo(-r * 0.5, -r * 0.5);
                    ctx.lineTo(r * 0.5, r * 0.5);
                    ctx.stroke();

                    // Render stylized skull in center
                    ctx.fillStyle = "#FF3333";
                    ctx.font = "bold " + Math.floor(s * 0.45) + "px Arial";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText("💀", 0, -2);
                }
            } else {
                // Procedural Ingredient Art (Fallback if assets fail)
                const r = NOTE_SIZE / 2;

                // 1. Draw Base (Crust/Main Color)
                ctx.fillStyle = n.isTrap ? "rgba(139, 0, 0, 0.45)" : (fireMode ? "#FFD700" : n.color); // Procedural Gold Crust
                ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();

                if (n.isTrap) {
                    // Procedural Danger Overhaul
                    ctx.strokeStyle = "#FF3333";
                    ctx.lineWidth = 5;
                    ctx.shadowBlur = isSoft ? 0 : 10;
                    ctx.shadowColor = "#FF3333";
                    ctx.stroke();
                    
                    ctx.shadowBlur = 0; // Reset shadow for internal overlays
                    ctx.beginPath();
                    ctx.moveTo(-r * 0.6, -r * 0.6);
                    ctx.lineTo(r * 0.6, r * 0.6);
                    ctx.stroke();
                    
                    ctx.fillStyle = "#FF3333";
                    ctx.font = "bold " + Math.floor(r * 0.9) + "px Arial";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText("💀", 0, 0);
                } else if (fireMode) {
                    // Shiny Gold details
                    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                    ctx.beginPath(); ctx.arc(-r * 0.3, -r * 0.3, r * 0.25, 0, Math.PI * 2); ctx.fill();
                    ctx.strokeStyle = "#FFD700";
                    ctx.lineWidth = 4;
                    ctx.shadowBlur = isSoft ? 0 : 8;
                    ctx.shadowColor = "#FFD700";
                    ctx.stroke();
                } else {
                    // 2. Add "3D" Bevel/Highlight
                    ctx.fillStyle = "rgba(255,255,255,0.3)";
                    ctx.beginPath(); ctx.arc(-r * 0.3, -r * 0.3, r * 0.25, 0, Math.PI * 2); ctx.fill();

                    // 3. Lane-Specific Details (Toppings)
                    if (n.lane === 0) { // PEPPERONI (Red Lane)
                        ctx.fillStyle = "rgba(90, 20, 20, 0.6)"; // Dark meat spots
                        // Draw a few 'slices' or spots on the pepperoni
                        ctx.beginPath(); ctx.arc(r * 0.3, r * 0.3, r * 0.15, 0, Math.PI * 2); ctx.fill();
                        ctx.beginPath(); ctx.arc(-r * 0.2, -r * 0.4, r * 0.18, 0, Math.PI * 2); ctx.fill();
                        ctx.beginPath(); ctx.arc(-r * 0.4, r * 0.2, r * 0.12, 0, Math.PI * 2); ctx.fill();
                    }
                    else if (n.lane === 1) { // CHEESE (Yellow Lane)
                        // Holes like swiss or bubbles
                        ctx.fillStyle = "rgba(255, 255, 200, 0.5)";
                        ctx.beginPath(); ctx.arc(r * 0.2, -r * 0.2, r * 0.25, 0, Math.PI * 2); ctx.fill();
                        ctx.fillStyle = "rgba(230, 180, 0, 0.4)"; // Darker pockets
                        ctx.beginPath(); ctx.arc(-r * 0.3, r * 0.3, r * 0.15, 0, Math.PI * 2); ctx.fill();
                    }
                    else if (n.lane === 2) { // BACON (Pink/Red Lane)
                        // Strips of fat/meat
                        ctx.fillStyle = "rgba(255, 255, 255, 0.6)"; // Fat strips
                        ctx.lineCap = "round";
                        ctx.save();
                        ctx.rotate(Math.PI / 4); // Diagonal strips
                        ctx.fillRect(-r * 0.6, -r * 0.15, r * 1.2, r * 0.1);
                        ctx.fillRect(-r * 0.6, r * 0.15, r * 1.2, r * 0.1);
                        ctx.restore();
                    }
                    else if (n.lane === 3) { // ONION (Purple Lane)
                        // Concentric Rings
                        ctx.strokeStyle = "rgba(230, 200, 255, 0.8)";
                        ctx.lineWidth = 2.5;
                        ctx.beginPath(); ctx.arc(0, 0, r * 0.6, 0, Math.PI * 2); ctx.stroke();
                        ctx.beginPath(); ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2); ctx.stroke();
                    }

                    // 4. Outer Crust/Border
                    ctx.strokeStyle = "rgba(0,0,0,0.2)";
                    ctx.lineWidth = 2;
                    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
                }
            }
            ctx.restore();
        });

        // Visuals (Particles / Crumbs)
        particles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = p.life < 0.2 ? p.life * 5 : 1.0; // Fade out near the end
            ctx.fillStyle = p.color;
            ctx.translate(p.x, p.y);
            if (p.rotation !== undefined) ctx.rotate(p.rotation);
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size); // Square crumbs look better as food
            ctx.restore();
        });
        ctx.globalAlpha = 1.0;

        feedbackSystem.forEach(f => {
            // Adjust feedback X to match lane offset if it was lane-based
            let drawX = f.x;
            if (f.lane !== undefined && f.lane !== -1) {
                drawX = offsetX + (f.lane * LANE_W) + (LANE_W / 2);
            }

            // Damped harmonic bounce oscillator: pops up dynamically, overshoots, and settles back smoothly
            const lifeProgress = 1.0 - f.life;
            const s = 1.0 + Math.sin(lifeProgress * Math.PI * 2.5) * 0.5 * f.life;

            ctx.save();
            ctx.translate(drawX, f.y);
            ctx.scale(s, s); // CRITICAL BUGFIX: Applying the computed elastic scaling directly!
            
            ctx.globalAlpha = f.life;
            ctx.font = "900 " + Math.min(LANE_W * 0.5, 60) + "px 'Bangers'";
            ctx.textAlign = "center";
            ctx.lineWidth = 6; ctx.strokeStyle = "#4D1100"; ctx.strokeText(f.text, 0, 0); // thicker shadow outline
            ctx.lineWidth = 2.5; ctx.strokeStyle = "#FFF8E7"; ctx.strokeText(f.text, 0, 0); // Double stroke for legibility
            ctx.fillStyle = f.color; ctx.fillText(f.text, 0, 0);
            ctx.restore();
        });
        ctx.globalAlpha = 1.0;

        // ── TIMING ACCURACY CALIBRATION METER (EARLY / LATE) ────────────────
        if (accuracyTicks && accuracyTicks.length > 0) {
            const barW = Math.min(W * 0.5, 300);
            const barH = 6;
            const barX = W / 2 - barW / 2;
            const barY = H * 0.77;

            ctx.save();
            // 1. Draw backing glass bar
            ctx.fillStyle = "rgba(12, 6, 5, 0.75)";
            ctx.strokeStyle = "rgba(255, 215, 0, 0.3)";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(barX, barY - barH / 2, barW, barH, 3);
            ctx.fill();
            ctx.stroke();

            // 2. Draw Translucent Green Perfect Zone (+/- 45ms)
            ctx.fillStyle = "rgba(46, 204, 113, 0.4)";
            ctx.fillRect(W / 2 - barW * 0.22, barY - barH / 2 + 1, barW * 0.44, barH - 2);

            // 3. Draw Gold Perfect target center tick
            ctx.strokeStyle = "rgba(255, 215, 0, 0.9)";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(W / 2, barY - 7);
            ctx.lineTo(W / 2, barY + 7);
            ctx.stroke();

            // 4. Draw active sliding accuracy tick indicators
            accuracyTicks.forEach(tick => {
                const maxOffset = 0.2; // +/- 200ms timing window limit
                const clampedOffset = Math.max(-maxOffset, Math.min(maxOffset, tick.offset));
                // early is negative (left), late is positive (right)
                const tickX = W / 2 + (clampedOffset / maxOffset) * (barW / 2);

                ctx.globalAlpha = tick.life;
                ctx.fillStyle = tick.isPerfect ? "#2ece71" : "#f1c40f";
                if (!isSoft) {
                    ctx.shadowColor = tick.isPerfect ? "#2ece71" : "#f1c40f";
                    ctx.shadowBlur = 12 * tick.life;
                }
                ctx.beginPath();
                ctx.arc(tickX, barY, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            });
            ctx.globalAlpha = 1.0;

            // 5. Draw "EARLY" and "LATE" guides
            ctx.font = "bold 8px monospace";
            ctx.fillStyle = "rgba(255, 215, 0, 0.5)";
            ctx.textAlign = "left";
            ctx.fillText("EARLY", barX - 42, barY + 3);
            ctx.textAlign = "right";
            ctx.fillText("LATE", barX + barW + 42, barY + 3);
            ctx.restore();
        }

        // ── Center Banner (¡A COCINAR! etc.) ────────────────────────────────
        if (centerBanner) {
            const t = centerBanner.life / centerBanner.maxLife; // 1→0
            // Scale: pop in fast, then hold, then fade out
            const popScale = t > 0.7
                ? 0.5 + (1 - t) / 0.3 * 0.7   // 0→1 during first 30% of life
                : 1.2 - (t < 0.25 ? (0.25 - t) / 0.25 * 0.3 : 0); // slight shrink on exit
            const alpha = t < 0.25 ? t / 0.25 * 1.0 : (t > 0.85 ? (t - 0.85) / 0.15 : 1.0);
            const fontSize = Math.min(W * 0.09, 65);
            ctx.save();
            ctx.translate(W / 2, H * 0.35);
            ctx.scale(popScale, popScale);
            ctx.globalAlpha = alpha;
            ctx.font = `900 ${fontSize}px 'Bangers', cursive`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            // Shadow layer
            ctx.shadowColor = 'rgba(0,0,0,0.9)';
            ctx.shadowBlur = 20;
            // Thick outline
            ctx.lineWidth = fontSize * 0.15;
            ctx.strokeStyle = '#222';
            ctx.strokeText(centerBanner.text, 0, 0);
            // Red fill
            ctx.fillStyle = '#CC2929';
            ctx.fillText(centerBanner.text, 0, 0);
            ctx.shadowBlur = 0;
            ctx.restore();
        }

        if (pizzaPopup.active) {
            const img = ASSETS["super_pizza"];
            if (img) {
                ctx.save();
                ctx.globalAlpha = pizzaPopup.alpha;
                const charSize = Math.max(0.1, Math.min(W * 0.8, 400) * pizzaPopup.scale);
                if (charSize > 1) {
                    ctx.translate(W / 2, H * 0.35); // Position higher (35% from top)
                    ctx.drawImage(img, -charSize / 2, -charSize / 2, charSize, charSize);
                }
                ctx.restore();
            }
        }

        ctx.restore(); // Undo Camera Zoom

        // HUD (Mafia Style - Elegant Redesign)
        const hudH = Math.min(H * 0.13, 110);
        const fontSizeScore = Math.min(30, W * 0.05); // slightly smaller, cleaner font

        // Use offsetX to keep the HUD strictly inside the game track (the Oven window)
        // If the window is huge, offsetX centers the game. We add a 20px padding inward.
        const hudLeftX = offsetX + 20;
        const hudRightX = offsetX + totalGameWidth - 20;

        ctx.shadowBlur = 10; ctx.shadowColor = "rgba(0,0,0,0.9)"; // Stronger drop shadow for elegance

        // --- SCORE (Classic Pizzeria Theme) ---
        ctx.font = `bold ${fontSizeScore}px 'Special Elite', monospace`;
        ctx.fillStyle = "#8B0000"; // Dark Red
        ctx.textAlign = "left";
        ctx.shadowBlur = 0; // Remove neon blur
        ctx.fillText(`SCORE`, hudLeftX, hudH * 0.5);
        ctx.fillStyle = "#27ae60"; // Classic Green
        ctx.fillText(`${Math.floor(score)}`, hudLeftX, hudH * 0.5 + fontSizeScore + 2);

        // --- PIZZAS BAKED ---
        ctx.fillStyle = "#8B0000"; // Dark Red
        ctx.font = `bold ${fontSizeScore * 0.7}px 'Bangers', cursive`;
        ctx.textAlign = "right";
        ctx.letterSpacing = "1px";
        ctx.fillText(`${pizzasMade} PIZZAS BAKED`, hudRightX, hudH * 0.5 + fontSizeScore * 1.5 + 5);
        ctx.letterSpacing = "0px";

        // --- HEALTH / "RESPECT" BAR (Top Center, inside track) ---
        const barW = Math.min(totalGameWidth * 0.4, 300);
        const barH = Math.min(H * 0.02, 14); // Slimmer, sleeker
        const barX = W / 2 - barW / 2;
        const barY = hudH * 0.45;

        // "RESPECT" label above the bar
        ctx.font = `bold 14px 'Special Elite', monospace`;
        ctx.fillStyle = "#8B0000"; // Dark Red
        ctx.textAlign = "center";
        ctx.letterSpacing = "2px";
        ctx.fillText("RESPECT", W / 2, barY - 10);
        ctx.letterSpacing = "0px";

        // Cream paper frame with red border
        ctx.fillStyle = "#FFF8E7";
        ctx.fillRect(barX - 4, barY - 4, barW + 8, barH + 8);
        ctx.strokeStyle = "#8B0000"; // Dark Red border
        ctx.lineWidth = 2;
        ctx.strokeRect(barX - 4, barY - 4, barW + 8, barH + 8);

        // Health fill (Solid colors based on health)
        const hpPercent = Math.max(0, health / 100);

        if (hpPercent > 0.5) {
            ctx.fillStyle = "#27ae60"; // Classic green
        } else if (hpPercent > 0.25) {
            ctx.fillStyle = "#f39c12"; // Warning gold
        } else {
            ctx.fillStyle = "#c0392b"; // Danger red
        }

        if (hpPercent < 0.25 && Math.floor(gameTimer * 8) % 2 === 0) ctx.fillStyle = "#ffffff"; // Fast flash when dying

        ctx.shadowBlur = 0;
        ctx.fillRect(barX, barY, barW * hpPercent, barH);

        // --- TIME REMAINING (Top Right) ---
        ctx.shadowBlur = 0;
        const timeLeft = Math.max(0, Math.ceil(CONFIG.SONG_DURATION - gameTimer));
        ctx.fillStyle = timeLeft <= 10 ? "#e74c3c" : "#8B0000";
        ctx.font = `bold ${Math.min(24, W * 0.045)}px 'Special Elite', monospace`;
        ctx.textAlign = "right";
        ctx.fillText(`⏱ ${timeLeft}s`, hudRightX, hudH * 0.5);

        // ── Paused Screen Overlay ──────────────────────────────────────────
        if (gameState === STATE.PAUSED) {
            ctx.save();
            ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
            ctx.fillRect(0, 0, W, H);
            
            // Draw a beautiful mafia gold blur/glowing frame inside the track
            ctx.strokeStyle = THE_OVEN_THEME.colors.hitLine;
            ctx.lineWidth = 4;
            ctx.strokeRect(offsetX, H * 0.3, totalGameWidth, H * 0.4);
            
            ctx.fillStyle = "rgba(20, 5, 5, 0.9)";
            ctx.fillRect(offsetX + 2, H * 0.3 + 2, totalGameWidth - 4, H * 0.4 - 4);
            
            // Draw large PAUSED title
            ctx.font = "900 " + Math.min(W * 0.08, 55) + "px 'Bangers'";
            ctx.fillStyle = "#FFD700";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.shadowColor = "#FFD700";
            ctx.shadowBlur = isSoft ? 0 : 8;
            ctx.fillText(language === 'es' ? "JUEGO EN PAUSA" : "GAME PAUSED", W / 2, H * 0.42);
            ctx.shadowBlur = 0;
            
            // Draw instruction subtext
            ctx.font = "bold " + Math.min(W * 0.03, 14) + "px sans-serif";
            ctx.fillStyle = "#FFF8E7";
            ctx.fillText(
                language === 'es' ? "Presiona ESC, [P] o (START) para Reanudar" : "Press ESC, [P] or (START) to Resume", 
                W / 2, 
                H * 0.52
            );
            
            ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
            ctx.fillText(
                language === 'es' ? "Presiona Q o (SELECT) para salir al Vestíbulo" : "Press Q or (SELECT) to Quit to Lobby", 
                W / 2, 
                H * 0.58
            );
            
            ctx.restore();
        }

        if (gameState === STATE.COUNTDOWN) {
            // Warm noir vignette backdrop instead of a flat black wash
            const vg = ctx.createRadialGradient(W / 2, H * 0.4, 0, W / 2, H * 0.4, Math.max(W, H) * 0.8);
            vg.addColorStop(0, "rgba(24, 14, 5, 0.82)");
            vg.addColorStop(1, "rgba(0, 0, 0, 0.94)");
            ctx.fillStyle = vg;
            ctx.fillRect(0, 0, W, H);

            const val = window._gpCountdown || "";
            // Pop animation: re-trigger every time the displayed value changes
            if (val !== _cdPrevVal) { _cdPrevVal = val; _cdAnimStart = performance.now(); }
            const cdEl = (performance.now() - _cdAnimStart) / 1000;
            const cdT = Math.min(1, cdEl / 0.4);
            const cdEase = 1 - Math.pow(1 - cdT, 3); // ease-out cubic
            const cdScale = 1.28 - 0.28 * cdEase;

            let fSize = Math.min(W * 0.3, 200);
            if (typeof val === 'string' && val.length > 2) {
                fSize = Math.min(W / (val.length * 0.62), 110);
            }
            const numY = H * 0.32;

            // Soft gold halo behind the number (brighter right after each tick)
            const haloAlpha = 0.32 - 0.14 * cdEase;
            const halo = ctx.createRadialGradient(W / 2, numY, 0, W / 2, numY, fSize * 1.15);
            halo.addColorStop(0, "rgba(212, 175, 55, " + haloAlpha.toFixed(3) + ")");
            halo.addColorStop(1, "rgba(212, 175, 55, 0)");
            ctx.fillStyle = halo;
            ctx.fillRect(W / 2 - fSize * 1.3, numY - fSize * 1.3, fSize * 2.6, fSize * 2.6);

            ctx.save();
            ctx.translate(W / 2, numY);
            ctx.scale(cdScale, cdScale);
            ctx.font = "700 " + Math.floor(fSize) + "px 'Fraunces', Georgia, serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const numGrad = ctx.createLinearGradient(0, -fSize / 2, 0, fSize / 2);
            numGrad.addColorStop(0, "#f6e27a");
            numGrad.addColorStop(0.55, "#d4af37");
            numGrad.addColorStop(1, "#8a6d1f");
            ctx.fillStyle = numGrad;
            ctx.shadowColor = "rgba(212, 175, 55, 0.6)";
            ctx.shadowBlur = 30;
            ctx.fillText(String(val), 0, 0);
            ctx.shadowBlur = 0;
            ctx.lineWidth = Math.max(1.5, fSize * 0.012);
            ctx.strokeStyle = "rgba(20, 10, 0, 0.5)";
            ctx.strokeText(String(val), 0, 0);
            ctx.restore();

            // --- CONTROLS PANEL (noir card) ---
            const panelW = Math.min(W * 0.86, 460);
            const panelH = 152;
            const panelX = W / 2 - panelW / 2;
            const panelY = H * 0.56;

            ctx.save();
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.fillStyle = "rgba(10, 7, 5, 0.92)";
            ctx.strokeStyle = "rgba(212, 175, 55, 0.5)";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(panelX, panelY, panelW, panelH, 14);
            ctx.fill();
            ctx.stroke();

            // Title
            ctx.fillStyle = "#d4af37";
            ctx.font = "700 15px 'Fraunces', Georgia, serif";
            try { ctx.letterSpacing = "3px"; } catch (e) { }
            ctx.fillText(language === 'es' ? "CÓMO JUGAR" : "HOW TO PLAY", W / 2, panelY + 24);
            try { ctx.letterSpacing = "0px"; } catch (e) { }

            // Divider that fades out at the edges
            const div = ctx.createLinearGradient(panelX + 20, 0, panelX + panelW - 20, 0);
            div.addColorStop(0, "rgba(212, 175, 55, 0)");
            div.addColorStop(0.5, "rgba(212, 175, 55, 0.45)");
            div.addColorStop(1, "rgba(212, 175, 55, 0)");
            ctx.strokeStyle = div;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(panelX + 20, panelY + 40);
            ctx.lineTo(panelX + panelW - 20, panelY + 40);
            ctx.stroke();

            // Keycaps, each tinted with its lane color
            const keyY = panelY + 68;
            const spacing = 48;
            const startX = W / 2 - spacing * 1.5;
            const keys = ['A', 'S', 'K', 'L'];
            keys.forEach((key, idx) => {
                const x = startX + idx * spacing;
                const kw = 32, kh = 32;
                let laneColor = "#d4af37";
                try { laneColor = THE_OVEN_THEME.colors.lanes[idx].note || laneColor; } catch (e) { }

                const cap = ctx.createLinearGradient(0, keyY - kh / 2, 0, keyY + kh / 2);
                cap.addColorStop(0, "rgba(48, 38, 26, 0.95)");
                cap.addColorStop(1, "rgba(22, 16, 10, 0.95)");
                ctx.fillStyle = cap;
                ctx.strokeStyle = "rgba(212, 175, 55, 0.65)";
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.roundRect(x - kw / 2, keyY - kh / 2, kw, kh, 7);
                ctx.fill();
                ctx.stroke();

                // Bottom shading for a subtle 3D keycap feel
                ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x - kw / 2 + 5, keyY + kh / 2 - 3);
                ctx.lineTo(x + kw / 2 - 5, keyY + kh / 2 - 3);
                ctx.stroke();

                ctx.fillStyle = "#f0ede8";
                ctx.font = "700 14px 'Space Grotesk', sans-serif";
                ctx.fillText(key, x, keyY + 1);

                // Lane color dot links each key to its column
                ctx.beginPath();
                ctx.arc(x, keyY + kh / 2 + 8, 3, 0, Math.PI * 2);
                ctx.fillStyle = laneColor;
                ctx.fill();
            });

            ctx.fillStyle = "#f0ede8";
            ctx.font = "500 13px 'Space Grotesk', sans-serif";
            ctx.fillText(
                language === 'es' ? "Presiona las teclas para tocar cada ingrediente" : "Press the keys to play each ingredient",
                W / 2,
                panelY + 114
            );
            ctx.fillStyle = "rgba(240, 237, 232, 0.5)";
            ctx.font = "italic 11px 'Space Grotesk', sans-serif";
            ctx.fillText(
                language === 'es' ? "(En móvil o táctil: Toca las columnas en pantalla)" : "(On Mobile/Touch: Tap the screen columns directly)",
                W / 2,
                panelY + 134
            );

            ctx.restore();
        }

        // Reset
        ctx.textAlign = "left";
        ctx.shadowBlur = 0;
    }

    // Called when song ends naturally (player completed the level)
    let _levelCompleteTriggered = false;
    function completeLevel() {
        if (_levelCompleteTriggered) return;
        _levelCompleteTriggered = true;
        isVictory = true;
        endGame();
    }

    function endGame() {
        AudioEngine.stopSong();
        gameState = STATE.RESULTS;
        showScreen('results');
        showScreen('results');
        // Attach ZK stats to inputLog so the frontend can build a valid Noir proof.
        //
        // comboBonus = score - base_score
        // base_score = hits*100 + perfect*50 + pizzas*1000 + traps_avoided*50
        //            (the deterministic part the Noir circuit verifies exactly)
        // comboBonus captures all dynamic extras: combo multipliers, fever 2x,
        // sustain ticks, secret sauce (5000), minus trap-hit penalties (-500 each).
        // It must be >= 0; if negative the player lost badly and won't submit anyway.
        const _baseScore = totalHits * 100
            + totalPerfectHits * 50
            + pizzasMade * 1000
            + trapsAvoided * 50;
        const _comboBonus = Math.max(0, Math.floor(score) - _baseScore);

        inputLog.stats = {
            perfectHits: totalPerfectHits,
            totalHits: totalHits,
            totalNotes: Math.min(totalNotes, 200), // capped at circuit bound
            feverSeconds: Math.floor(feverTime),
            pizzasCompleted: pizzasMade,
            trapsAvoided: trapsAvoided,
            totalTraps: totalTraps,
            comboBonus: _comboBonus,
            startTime: inputLog.startTime || Date.now(),
            songDuration: CONFIG.SONG_DURATION,
        };
        if (onComplete) onComplete(score, inputLog);
    }

    function loop(timestamp) {
        if (!shouldRun) return;
        const dt = (timestamp - lastTime) / 1000;
        lastTime = timestamp;

        if (gameState === STATE.MENU) {
            // In MENU, we clear canvas once and stop the loop to conserve CPU/Battery
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            loopRunning = false;
            return;
        }

        if (gameState === STATE.PAUSED) {
            pollGamepads();
        }

        if (dt < 0.5) { // Prevent huge dt jumps
            if (gameState === STATE.GAME) {
                update(dt);
            }
            // Always render the visual state, even if GAME OVER (RESULTS)
            // This allows the React CSS glassmorphism overlay to blur the active gameplay view
            // instead of a black canvas.
            render(dt);
        }
        requestId = requestAnimationFrame(loop);
    }

    // --- INITIALIZATION ---
    // opts: { songRate, diffStart, songStart, songDuration }
    //   songRate     — playback speed (1.0 default)
    //   diffStart    — initial difficultyMult (0.6 default)
    //   songStart    — seconds into the file to begin (from Song.start)
    //   songDuration — how many seconds to play  (from Song.duration)
    function startGame(opts) {
        const { songRate = 1.0, diffStart = 0.6 } = opts || {};
        const resolvedStart = CONFIG.SONG_START;
        const resolvedDuration = CONFIG.SONG_DURATION;
        console.log('[Engine] startGame — rate:' + songRate + ' diff:' + diffStart + ' seg:' + resolvedStart + 's–' + (resolvedStart + resolvedDuration) + 's (' + resolvedDuration + 's)');
        _difficultyStart = diffStart;
        AudioEngine._fireRate = songRate;
        AudioEngine.init(); // This will resume the context since we are in a user gesture
        AudioEngine.stopSong();
        
        resetGame();
        
        gameState = STATE.COUNTDOWN;
        window._gpCountdown = 3;
        if (!loopRunning) {
            loopRunning = true;
            lastTime = performance.now();
            requestId = requestAnimationFrame(loop);
        }
        showScreen('game'); // Hides the HTML menu overlay so the user can see the canvas
        lastTime = performance.now();
        
        let countdownTimer = 3;
        const interval = setInterval(() => {
            countdownTimer--;
            if (countdownTimer > 0) {
                window._gpCountdown = countdownTimer;
            } else if (countdownTimer === 0) {
                window._gpCountdown = language === 'es' ? "¡A COCINAR!" : "LET'S COOK!";
            } else {
                clearInterval(interval);
                window._gpCountdown = null;
                gameState = STATE.GAME;
                lastTime = performance.now();
                // Lead-in: start the clock negative (the time a note takes to fall
                // from the top of the screen to the hit line, plus a small buffer)
                // so the first notes always enter from above instead of spawning
                // mid-screen. The song starts when the clock crosses zero.
                const _leadMoveSpeed = (H * 0.8) * difficultyMult;
                const _leadIn = ((HIT_Y + NOTE_SIZE) / _leadMoveSpeed) + 0.3;
                gameTimer = -_leadIn;
                if (songUrl) {
                    _pendingSongPlay = () => {
                        if (AudioEngine.songBuffer) {
                            AudioEngine.playSong(songRate, resolvedStart, resolvedDuration);
                        } else {
                            AudioEngine.loadSong(songUrl).then(() => AudioEngine.playSong(songRate, resolvedStart, resolvedDuration));
                        }
                    };
                }
            }
        }, 1000);
    }

    let shouldRun = true;
    let requestId;

    function resize() {
        W = container.clientWidth;
        H = container.clientHeight;
        canvas.width = W;
        canvas.height = H;

        // Responsive Scaling
        const isMobile = W < 600;
        const aspect = W / H;

        // Lane Width: On mobile, use more width percentage. On PC, limit max width.
        if (isMobile) {
            LANE_W = W / 4;
        } else {
            // Keep game centered with max width on PC
            const maxWidth = Math.min(600, W * 0.5);
            LANE_W = maxWidth / 4;
        }

        HIT_Y = H * 0.85;
        NOTE_SIZE = Math.min(LANE_W * 0.8, 100);

        // Recalculate global font scale for render
        // Store in config or global var if needed, but for now we rely on render usage
    }

    window.addEventListener('resize', resize);
    resize();

    // --- ASSET LOADING ---
    // --- ASSET LOADING ---
    function loadImages() {
        return new Promise((resolve) => {
            const base = (window.GP_BASE_PATH || '/');
            const ASSET_PATHS = {
                "pepperoni": base + "game/assets/pepperoni.jpg?v=2",
                "cheese": base + "game/assets/mixta.jpg?v=2",
                "bacon": base + "game/assets/tomatos.jpg?v=2",
                "onion": base + "game/assets/veg.jpg?v=2",
                "secret_sauce": base + "game/assets/salsasecreta.jpg?v=2",
                "hotdog": base + "game/assets/hotdog.jpg?v=2",
                "burger": base + "game/assets/burger.jpg?v=2",
                "super_pizza": base + "game/assets/benny_transparent.png?v=2"
            };

            const keys = Object.keys(ASSET_PATHS);
            const total = keys.length;
            let loaded = 0;

            console.log("[Engine] Loading Assets...");

            // Helper to draw loading screen
            const drawLoading = (current, total) => {
                // Clear background
                ctx.fillStyle = THE_OVEN_THEME.colors.background.oven;
                ctx.fillRect(0, 0, W, H);

                // Draw Text
                ctx.fillStyle = "#fff";
                ctx.font = "30px Arial";
                ctx.textAlign = "center";
                const percent = Math.floor((current / total) * 100);
                ctx.fillText(`${t.engineLoading} ${percent}%`, W / 2, H / 2 - 20);

                // Draw Bar Background
                const barW = Math.min(W * 0.6, 400);
                const barH = 20;
                const barX = (W - barW) / 2;
                const barY = H / 2 + 20;

                ctx.fillStyle = "#333";
                ctx.fillRect(barX, barY, barW, barH);

                // Draw Bar Progress
                ctx.fillStyle = THE_OVEN_THEME.colors.lanes[1].primary; // Cheese Yellow
                ctx.fillRect(barX, barY, barW * (current / total), barH);

                // Border
                ctx.strokeStyle = "#fff";
                ctx.lineWidth = 2;
                ctx.strokeRect(barX, barY, barW, barH);
            };

            // Draw initial state
            drawLoading(0, total);

            keys.forEach(key => {
                const img = new Image();
                img.src = ASSET_PATHS[key];

                img.onload = () => {
                    ASSETS[key] = img;
                    loaded++;
                    drawLoading(loaded, total);
                    if (loaded === total) {
                        setTimeout(resolve, 100); // Small delay to show 100%
                    }
                };

                img.onerror = (e) => {
                    console.error(`Failed to load asset: ${key}`, e);
                    loaded++;
                    drawLoading(loaded, total);
                    if (loaded === total) {
                        setTimeout(resolve, 100);
                    }
                };
            });
        });
    }

    // Show Menu initially

    showScreen('menu');

    loadImages().then(() => {
        // AudioEngine.init(); // Wait for user gesture on Start Button
        lastTime = performance.now();
        requestId = requestAnimationFrame(loop);
    });

    // --- CLEANUP ---
    // --- EXPOSED API ---
    // Pre-load the song so it's ready when the player clicks Start
    if (songUrl) {
        AudioEngine.loadSong(songUrl);
    }

    return {
        cleanup: () => {
            shouldRun = false;
            cancelAnimationFrame(requestId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
            canvas.removeEventListener('touchstart', onTouchStart);
            canvas.removeEventListener('touchend', onTouchEnd);
            window.removeEventListener("gamepadconnected", onGamepadConnected);
            window.removeEventListener("gamepaddisconnected", onGamepadDisconnected);

            // Remove button listeners
            if (uiStartBtn) uiStartBtn.onclick = null;
            if (uiRestartBtn) uiRestartBtn.onclick = null;
            if (uiBackBtn) uiBackBtn.onclick = null;

            AudioEngine.stopSong();
            if (AudioEngine.ctx) AudioEngine.ctx.close();
            if (socket) {
                try {
                    socket.close();
                } catch (e) {}
            }
            if (window.updateGuitarPizzaLatency === updateLatencyFunc) {
                window.updateGuitarPizzaLatency = null;
            }
            window.toggleGuitarPizzaPause = null;
            window.getGuitarPizzaStats = null;
        },
        setVolume: (v) => AudioEngine.setVolume(v),
        startGame: () => {
            if (gameState === STATE.MENU || gameState === STATE.RESULTS) {
                startGame();
            }
        },
        getInputLog: () => inputLog,
        getInputState: () => Input,
        updateLatency: updateLatencyFunc,
        getEngineState: () => ({
            gameState,
            fireMode,
            combo,
            score,
            health,
            pizzasMade,
            pizzaProgress,
            rushHourActive,
            latency: latency * 1000
        })
    };
};

