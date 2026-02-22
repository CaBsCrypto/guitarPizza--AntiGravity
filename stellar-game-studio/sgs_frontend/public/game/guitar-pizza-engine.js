

window.initGuitarPizza = function (canvasElement, userAddress, onComplete) {
    // --- GLOBAL VARS & CONFIG (Scoped to this function) ---
    const CONFIG = {
        BPM: 128, LANE_COUNT: 5, HIT_WINDOW: 0.160, PERFECT_WINDOW: 0.060, SONG_DURATION: 90,
        HITS_PER_PIZZA: 20
    };

    const STATE = { MENU: 0, GAME: 1, RESULTS: 2 };
    let gameState = STATE.MENU; // Start in MENU
    let gameTimer = 0;
    let score = 0;
    let combo = 0;
    let maxCombo = 0;
    let health = 100;
    let fireMode = false;
    let difficultyMult = 0.6;
    let difficultyTimer = 0;

    let pizzaProgress = 0;
    let pizzasMade = 0;

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
    let particles = [];
    let feedbackSystem = [];
    let shake = 0;
    let camScale = 1.0;

    let beatTimer = 0;
    let beatFlash = 0;
    let bgScrollY = 0;
    let bgOffsetY = 0;

    // --- ZK INPUT LOG ---
    let inputLog = [];

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
    const TAGS = ["pepperoni", "cheese", "bacon", "onion"]; // Mapped to Lanes 0-3
    const TRAP_TAGS = ["hotdog", "burger"]; // Ghost/Trap Notes (Sushi removed for performance)
    const GOLDEN_TAG = "secret_sauce";
    // --- THEME CONFIGURATION (EDIT HERE!) ---
    const THE_OVEN_THEME = {
        colors: {
            // Lane Colors: [Red (Pepperoni), Yellow (Cheese), Pink (Bacon), Purple (Onion)]
            lanes: [
                { primary: "#C0392B", dark: "#922B21", plate: "#E6B0AA", note: "#C0392B" },    // Lane 0: Pepperoni
                { primary: "#F1C40F", dark: "#D4AC0D", plate: "#FCF3CF", note: "#F4D03F" },    // Lane 1: Cheese
                { primary: "#D98880", dark: "#C0392B", plate: "#FADBD8", note: "#E6B0AA" },    // Lane 2: Bacon (Pinkish)
                { primary: "#9B59B6", dark: "#7D3C98", plate: "#EBDEF0", note: "#9B59B6" }     // Lane 3: Onion
            ],
            hitLine: "#FFD700",
            background: {
                base: "#f8f8f8",
                checker: "#c1272d",
                oven: "#1a1a1a",
                ovenBorder: "#D4AF37",
                outerBorder: "#000000"
            }
        },
        dimensions: {
            checkerSize: 40,
            hitLineThickness: 6,
            laneBorderWidth: 2
        }
    };

    // --- HELPER FUNCTIONS ---

    function resetGame() {
        score = 0; combo = 0; maxCombo = 0; health = 100;
        fireMode = false; difficultyMult = 0.6; difficultyTimer = 0;
        pizzaProgress = 0; pizzasMade = 0;
        perfectStreak = 0; secretIngredients = 0;
        totalPerfectHits = 0; totalHits = 0;
        feverTime = 0; totalTraps = 0; trapsAvoided = 0; totalNotes = 0;
        notes = []; particles = []; feedbackSystem = [];
        gameTimer = 0; nextNoteTime = 0;
        inputLog = []; // Reset Log
        gameState = STATE.GAME;
        lastTime = performance.now(); // RESET TIME TO PREVENT HUGE DT JUMP
        AudioEngine.init(); // Ensure audio is ready
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
            // Calculate Grade
            let grade = "C";
            if (score > 5000) grade = "B";
            if (score > 10000) grade = "A";
            if (score > 20000) grade = "S";
            if (score > 30000) grade = "SS";
            if (uiResGrade) uiResGrade.innerText = grade;
        }
    }

    // --- INPUT HANDLING ---
    const Input = {
        held: [false, false, false, false],
        keyMap: { 'a': 0, 's': 1, 'k': 2, 'l': 3 }
    };

    function triggerInput(lane) {
        if (gameState !== STATE.GAME) return;
        const result = checkHit(lane);
        // Log for ZK
        inputLog.push({
            time: gameTimer,
            lane: lane,
            action: 'tap',
            isHit: result
        });
    }

    const onKeyDown = (e) => {
        if (e.repeat) return;
        const k = e.key.toLowerCase();
        if (Input.keyMap.hasOwnProperty(k)) {
            const lane = Input.keyMap[k];
            Input.held[lane] = true;
            triggerInput(lane);
        }
    };

    const onKeyUp = (e) => {
        const k = e.key.toLowerCase();
        if (Input.keyMap.hasOwnProperty(k)) {
            Input.held[Input.keyMap[k]] = false;
        }
    };

    const onTouchStart = (e) => {
        if (gameState !== STATE.GAME) return;
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        for (let i = 0; i < e.changedTouches.length; i++) {
            const t = e.changedTouches[i];
            const x = (t.clientX - rect.left) * scaleX;
            const lane = Math.floor(x / LANE_W);
            if (lane >= 0 && lane < 4) {
                Input.held[lane] = true;
                triggerInput(lane);
            }
        }
    };

    const onTouchEnd = (e) => {
        if (gameState !== STATE.GAME) return;
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        for (let i = 0; i < e.changedTouches.length; i++) {
            const t = e.changedTouches[i];
            const x = (t.clientX - rect.left) * scaleX;
            const lane = Math.floor(x / LANE_W);
            if (lane >= 0 && lane < 4) Input.held[lane] = false;
        }
    };

    // Attach listeners
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);

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


    // --- AUDIO ENGINE ---
    const AudioEngine = {
        ctx: null, isInit: false, masterGain: null,
        init: function () {
            if (this.isInit) {
                if (this.ctx.state === 'suspended') this.ctx.resume();
                return;
            }
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.35;
            this.masterGain.connect(this.ctx.destination);
            if (this.ctx.state === 'suspended') this.ctx.resume();
            this.isInit = true;
        },
        setVolume: function (value) {
            if (this.masterGain) {
                // Clamp between 0 and 1
                const v = Math.max(0, Math.min(1, value));
                this.masterGain.gain.cancelScheduledValues(0);
                this.masterGain.gain.value = v * 0.35; // Scale by our max "safe" volume
            }
        },
        playTone: function (freq, type, attack, decay) {
            if (!this.isInit) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(0, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + attack);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + decay);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start();
            osc.stop(this.ctx.currentTime + decay);
        },
        playChord: function (lane) {
            const roots = [110, 130.81, 146.83, 164.81];
            const root = roots[lane];
            [root, root * 1.5, root * 2].forEach(freq => this.playTone(freq, "sawtooth", 0.05, 0.3));
        },
        playMiss: function () { this.playTone(60, "sawtooth", 0.05, 0.2); },
        playOvenBell: function () {
            // Better "Order Up" sound
            this.playTone(880, "sine", 0.01, 1.2);
            this.playTone(1108.73, "sine", 0.01, 1.0); // C# (Major 3rd)
            this.playTone(1318.51, "sine", 0.01, 0.8); // E (Fifth)
            this.playTone(1760, "sine", 0.01, 0.6); // Octave
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
        const beat = (60 / CONFIG.BPM) / difficultyMult;
        const mult = [0.5, 0.5, 0.25, 1][Math.floor(Math.random() * 4)];
        nextNoteTime += beat * mult;
    }

    function checkHit(lane) {
        let bestDist = Infinity;
        let targetNote = null;
        notes.forEach(n => {
            if (n.lane === lane && !n.hit) {
                const dist = Math.abs(n.y - HIT_Y);
                if (dist < bestDist) { bestDist = dist; targetNote = n; }
            }
        });

        const hitZone = H * 0.15;
        if (targetNote && bestDist < hitZone) {
            targetNote.hit = true;

            // --- TRAP LOGIC ---
            if (targetNote.isTrap) {
                // PENALTY FOR HITTING A TRAP
                combo = 0; fireMode = false; health -= 15; perfectStreak = 0;
                score = Math.max(0, score - 500);
                createFeedback("WRONG ORDER! 🚫", lane, HIT_Y);
                AudioEngine.playMiss();
                shake = 10;
                return false; // Valid input (it registered), but bad outcome
            }

            if (targetNote.length > 0) targetNote.isSustaining = true;
            const perfect = bestDist < (hitZone * 0.3);

            totalHits++;
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

            const multiplier = fireMode ? 2 : 1;
            score += (perfect ? 100 + (combo * 10) : 50 + (combo * 5)) * multiplier;
            combo++;
            if (combo > maxCombo) maxCombo = combo;
            if (combo >= 20) fireMode = true;

            health = Math.min(100, health + (perfect ? 3 : 1));
            createExplosion(targetNote.lane, HIT_Y, targetNote.color, perfect);
            createFeedback(perfect ? "DELICIOUS!" : "TASTY", lane, HIT_Y);

            shake = perfect ? (fireMode ? 8 : 6) : 3;
            camScale = perfect ? 1.02 : 1.01;
            AudioEngine.playChord(lane);

            pizzaProgress++;
            if (pizzaProgress >= CONFIG.HITS_PER_PIZZA) finishPizza();
            return true; // HIT

        } else {
            combo = 0; fireMode = false; health -= 8; perfectStreak = 0;
            createFeedback("BURNT", lane, HIT_Y);
            shake = 5; camScale = 0.98;
            AudioEngine.playMiss();
            return false; // MISS
        }
    }

    let pizzaPopup = { active: false, scale: 0, alpha: 0, timer: 0 };
    function finishPizza() {
        pizzaProgress = 0; pizzasMade++; score += 1000; health = Math.min(100, health + 15);
        AudioEngine.playOvenBell();
        createFeedback("ORDER UP!", -1, H * 0.3);
        pizzaPopup.active = true; pizzaPopup.scale = 0; pizzaPopup.alpha = 1; pizzaPopup.timer = 1.5;
    }

    function update(dt) {
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
        if (gameTimer > nextNoteTime) spawnNote();

        if (pizzaPopup.active) {
            pizzaPopup.timer -= dt;
            if (pizzaPopup.timer <= 0) pizzaPopup.active = false;
            else {
                if (pizzaPopup.scale < 0.6) pizzaPopup.scale += dt * 8;
                else pizzaPopup.scale = 0.6;
                if (pizzaPopup.timer < 0.3) pizzaPopup.alpha = pizzaPopup.timer * 3;
            }
        }

        const moveSpeed = (H * 0.8) * difficultyMult;

        // Notes update
        for (let i = notes.length - 1; i >= 0; i--) {
            let n = notes[i];
            n.y += moveSpeed * dt;

            if (n.hit) {
                if (n.length > 0) {
                    if (n.y - n.length > HIT_Y) {
                        notes.splice(i, 1);
                        createFeedback("HELD!", n.lane, HIT_Y); score += 500;
                        continue;
                    }
                    if (Input.held[n.lane]) {
                        n.isSustaining = true; score += 10; health = Math.min(100, health + 0.05);
                        if (gameTimer % 0.1 < 0.02) createExplosion(n.lane, HIT_Y, n.color, true);
                    } else n.isSustaining = false;
                } else notes.splice(i, 1);
                continue;
            }

            n.rotation += dt * 2;
            if (n.y - n.length > H + NOTE_SIZE) {
                notes.splice(i, 1);

                // If it was a TRAP, letting it pass is GOOD (No penalty)
                if (!n.isTrap) {
                    combo = 0; fireMode = false; health -= 12;
                    createFeedback("DROPPED", n.lane, H - 50);
                    AudioEngine.playMiss();
                } else {
                    // Bonus for avoiding trap
                    trapsAvoided++;
                    createFeedback("DODGED!", n.lane, H - 50);
                    score += 50;
                }
            }
        }

        // Particles update
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].x += particles[i].vx * dt; particles[i].y += particles[i].vy * dt;
            particles[i].life -= dt * 2.5;
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
        const count = big ? 25 : 15;
        for (let i = 0; i < count; i++) {
            particles.push({
                x: tempX, y: y,
                vx: (Math.random() - 0.5) * (W * 0.6), vy: (Math.random() - 0.5) * (W * 0.6),
                color: color, life: 1.0, size: Math.random() * (W * 0.03) + 4
            });
        }
    }

    function createFeedback(text, lane, y) {
        let x = (lane !== -1) ? (lane * LANE_W) + (LANE_W / 2) : W / 2;
        // Store lane to recalculate X in render if window resizes (optional, but good for centering)
        // But for particles/feedback created at X time, X is usually fixed. 
        // We will store lane index to help render calc X dynamically if needed.
        feedbackSystem.push({
            text: text, x: x, y: y, life: 1.0, lane: lane,
            color: text == "ORDER UP!" ? "#55efc4" : ((text.startsWith("D") || text == "TASTY") ? "#ffeaa7" : "#ff7675")
        });
    }

    function drawBackground(ctx, W, H, offsetX, totalGameWidth, dt, moveSpeed) {
        // 1. Draw Italian Tablecloth Pattern (Red/White Checkers)
        const checkSize = 40;
        const rows = Math.ceil(H / checkSize);
        const cols = Math.ceil(W / checkSize);

        // Base white
        ctx.fillStyle = THE_OVEN_THEME.colors.background.base;
        ctx.fillRect(0, 0, W, H);

        // Red squares
        ctx.fillStyle = THE_OVEN_THEME.colors.background.checker; // Mafia Red
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
        ctx.shadowBlur = 40;
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

        ctx.globalAlpha = 0.05;
        for (let i = 0; i < 20; i++) {
            // Simple deterministic pseudo-random stars based on frame/time would be better but random is fine for now
            // kept simple to match previous logic
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

        const totalGameWidth = 4 * LANE_W;
        const offsetX = (W - totalGameWidth) / 2;
        const moveSpeed = (H * 0.8) * difficultyMult;

        // Draw Background (Tablecloth + Oven)
        drawBackground(ctx, W, H, offsetX, totalGameWidth, dt, moveSpeed);

        // Shake effect
        ctx.save();
        ctx.translate(W / 2, H / 2); ctx.scale(camScale, camScale); ctx.translate(-W / 2, -H / 2);
        if (shake > 0.1) ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);

        if (beatFlash > 0) {
            ctx.fillStyle = fireMode ? "#ff7675" : "#fff";
            ctx.globalAlpha = beatFlash * 0.5; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1.0;
        }

        // Lanes
        for (let i = 0; i < 4; i++) {
            const x = offsetX + i * LANE_W;
            const ingredient = THE_OVEN_THEME.colors.lanes[i];

            // Gradient BG
            const gradient = ctx.createLinearGradient(x, 0, x, H);
            gradient.addColorStop(0, ingredient.dark); gradient.addColorStop(1, ingredient.primary);
            ctx.fillStyle = gradient; ctx.fillRect(x, 0, LANE_W, H);
            ctx.strokeStyle = "rgba(0,0,0,0.3)"; ctx.lineWidth = THE_OVEN_THEME.dimensions.laneBorderWidth; ctx.strokeRect(x, 0, LANE_W, H);

            // Plate
            const plateX = x + LANE_W / 2; const plateY = HIT_Y; const plateRadius = LANE_W * 0.35;
            ctx.fillStyle = "rgba(0,0,0,0.4)"; ctx.beginPath(); ctx.arc(plateX + 4, plateY + 4, plateRadius + 2, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = ingredient.plate; ctx.beginPath(); ctx.arc(plateX, plateY, plateRadius, 0, Math.PI * 2); ctx.fill();

            // Active Glow
            if (Input.held[i]) {
                ctx.shadowBlur = 40; ctx.shadowColor = ingredient.primary;
                ctx.strokeStyle = ingredient.primary; ctx.lineWidth = 6;
                ctx.beginPath(); ctx.arc(plateX, plateY, plateRadius + 10, 0, Math.PI * 2); ctx.stroke();
                ctx.shadowBlur = 0;
            }
        }

        // Hit Line
        ctx.shadowBlur = 25; ctx.shadowColor = THE_OVEN_THEME.colors.hitLine; ctx.strokeStyle = THE_OVEN_THEME.colors.hitLine; ctx.lineWidth = THE_OVEN_THEME.dimensions.hitLineThickness;
        ctx.beginPath(); ctx.moveTo(offsetX, HIT_Y); ctx.lineTo(offsetX + totalGameWidth, HIT_Y); ctx.stroke(); ctx.shadowBlur = 0;

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
                ctx.restore();
                // Border
                ctx.strokeStyle = "white"; ctx.lineWidth = 3; ctx.stroke();
            } else {
                // Procedural Ingredient Art (Fallback if assets fail)
                const r = NOTE_SIZE / 2;

                // 1. Draw Base (Crust/Main Color)
                ctx.fillStyle = n.color;
                ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();

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
            ctx.restore();
        });

        // Visuals
        particles.forEach(p => {
            ctx.globalAlpha = p.life; ctx.fillStyle = p.color;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        });
        ctx.globalAlpha = 1.0;

        feedbackSystem.forEach(f => {
            // Adjust feedback X to match lane offset if it was lane-based
            let drawX = f.x;
            if (f.lane !== undefined && f.lane !== -1) {
                drawX = offsetX + (f.lane * LANE_W) + (LANE_W / 2);
            }

            ctx.save(); ctx.translate(drawX, f.y);
            // ... strict text scaling ...
            const s = Math.min(1.5, 1 + (1.0 - f.life));
            ctx.globalAlpha = f.life;
            ctx.font = "900 " + Math.min(LANE_W * 0.5, 60) + "px 'Impact'";
            ctx.textAlign = "center";
            ctx.lineWidth = 4; ctx.strokeStyle = "white"; ctx.strokeText(f.text, 0, 0);
            ctx.fillStyle = f.color; ctx.fillText(f.text, 0, 0);
            ctx.restore();
        });
        ctx.globalAlpha = 1.0;

        // Render Pizza Completion Character Popup
        if (pizzaPopup.active) {
            const img = ASSETS["super_pizza"];
            if (img) {
                ctx.save();
                ctx.globalAlpha = pizzaPopup.alpha;
                const charSize = Math.min(W * 0.8, 400) * pizzaPopup.scale;
                ctx.translate(W / 2, H * 0.35); // Position higher (35% from top)
                ctx.drawImage(img, -charSize / 2, -charSize / 2, charSize, charSize);
                ctx.restore();
            }
        }

        ctx.restore(); // Undo Camera Zoom

        // HUD (Mafia Style)
        const hudH = Math.min(H * 0.13, 110);
        const fontSize = Math.min(30, W * 0.08); // Responsive font
        ctx.font = `bold ${fontSize}px var(--font-display, Impact)`;
        ctx.shadowBlur = 10; ctx.shadowColor = "rgba(0,0,0,0.5)";

        ctx.fillStyle = "#FFD700"; // Neon Gold
        ctx.fillText(Math.floor(score), 20, hudH * 0.75);

        ctx.fillStyle = "#ff7675"; // Mafia Red
        ctx.font = `bold ${fontSize * 0.8}px var(--font-display, Impact)`;
        ctx.fillText(`🍕 x${pizzasMade}`, 20, hudH * 0.75 + fontSize + 5);
        ctx.shadowBlur = 0;
    }

    function endGame() {
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
        };
        if (onComplete) onComplete(score, inputLog);
    }

    function loop(timestamp) {
        if (!shouldRun) return;
        const dt = (timestamp - lastTime) / 1000;
        lastTime = timestamp;

        if (gameState === STATE.MENU) {
            // In MENU, we want TRANSPARENCY
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            requestId = requestAnimationFrame(loop);
            return;
        }

        if (dt < 0.5) { // Prevent huge dt jumps
            if (gameState === STATE.GAME) update(dt);
            render(dt);
        }
        requestId = requestAnimationFrame(loop);
    }

    // --- INITIALIZATION ---
    function startGame() {
        console.log("Starting Game from Engine API");
        resetGame();
        lastTime = performance.now(); // MUST reset time before entering GAME state
        showScreen('game');
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
            const ASSET_PATHS = {
                "pepperoni": "game/assets/pepperoni.jpg",
                "cheese": "game/assets/mixta.jpg",
                "bacon": "game/assets/tomatos.jpg",
                "onion": "game/assets/veg.jpg",
                "secret_sauce": "game/assets/salsasecreta.jpg",
                "hotdog": "game/assets/hotdog.jpg",
                "burger": "game/assets/burger.jpg",
                "super_pizza": "game/assets/decoracion/SuperPizza.png"
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
                ctx.fillText(`Cargando Ingredientes... ${percent}%`, W / 2, H / 2 - 20);

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
    return {
        cleanup: () => {
            shouldRun = false;
            cancelAnimationFrame(requestId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
            canvas.removeEventListener('touchstart', onTouchStart);
            canvas.removeEventListener('touchend', onTouchEnd);

            // Remove button listeners
            if (uiStartBtn) uiStartBtn.onclick = null;
            if (uiRestartBtn) uiRestartBtn.onclick = null;
            if (uiBackBtn) uiBackBtn.onclick = null;

            if (AudioEngine.ctx) AudioEngine.ctx.close();
        },
        setVolume: (v) => AudioEngine.setVolume(v),
        startGame: () => {
            if (gameState === STATE.MENU || gameState === STATE.RESULTS) {
                startGame();
            }
        }
    };
};

