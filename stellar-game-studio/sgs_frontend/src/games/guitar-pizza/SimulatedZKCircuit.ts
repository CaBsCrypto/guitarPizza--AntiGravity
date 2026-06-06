export interface InputLogEntry {
    time: number;
    lane: number;
    action: 'tap' | 'hold' | 'release';
    isHit: boolean; // Was this correlated to a note by the game engine?
    offset?: number | null;
}

export class SimulatedZKCircuit {
    /**
     * Re-runs the game logic on the input trace to verify the score.
     * Enforces Anti-Spam "Ghost Click" penalties and keypress timing variance bots checks.
     */
    static verifyTrace(
        inputLog: InputLogEntry[],
        songChartConfig: any, // Placeholder for song data
        claimedScore: number
    ): { verified: boolean; calculatedScore: number; penaltyCount: number; isBot: boolean; stdDevMs: number; reason?: string } {

        console.log(`[ZK Simulation] Verifying trace with ${inputLog.length} inputs...`);

        let calculatedScore = 0;
        let ghostClicks = 0;
        let validHits = 0;

        // Constants (must match game engine)
        const HIT_SCORE = 100;
        const GHOST_CLICK_PENALTY = 50;
        const SPAM_TOLERANCE_THRESHOLD = 5; // Allow a few accidental clicks

        for (const input of inputLog) {
            if (input.action === 'tap') {
                if (input.isHit) {
                    // In a real ZK circuit, we would re-calculate if it was a hit against the song chart.
                    // Here we trust the 'isHit' flag for the simulation, but in ZK we'd prove it.
                    calculatedScore += HIT_SCORE;
                    validHits++;
                } else {
                    // This input was NOT correlated to a note -> Ghost Click / Spam
                    ghostClicks++;
                    calculatedScore = Math.max(0, calculatedScore - GHOST_CLICK_PENALTY);
                }
            }
        }

        console.log(`[ZK Simulation] Valid Hits: ${validHits}, Ghost Clicks: ${ghostClicks}`);

        // 1. Check for Spam / Autoclickers
        if (ghostClicks > validHits + SPAM_TOLERANCE_THRESHOLD) {
            return {
                verified: false,
                calculatedScore,
                penaltyCount: ghostClicks,
                isBot: false,
                stdDevMs: 0,
                reason: "Excessive Spamming Detected (Ghost Clicks)"
            };
        }

        // 2. Timing/Duration Check (Anti-Song-Skip Bypass)
        const stats = (inputLog as any).stats || {};
        if (stats.startTime) {
            const songDuration = stats.songDuration || 30; // fallback to 30s
            const actualPlayDuration = (Date.now() - stats.startTime) / 1000;
            console.log(`[ZK Simulation] Play duration check: Song: ${songDuration}s vs Real: ${actualPlayDuration.toFixed(1)}s`);
            if (actualPlayDuration < songDuration - 4) { // allow a 4-second buffer for instant loading
                return {
                    verified: false,
                    calculatedScore,
                    penaltyCount: ghostClicks,
                    isBot: false,
                    stdDevMs: 0,
                    reason: "Song Playthrough Short-Circuit / Cheating Detected (Invalid duration)"
                };
            }
        }

        // 3. Mathematical Score Ceiling Check (Anti-Score-Faking)
        const totalNotes = stats.totalNotes || validHits;
        const maxTheoreticalScore = totalNotes * 160; // 100 base hit + combo bonus + fever multipliers max out at ~150-160%
        if (claimedScore > maxTheoreticalScore && totalNotes > 5) {
            return {
                verified: false,
                calculatedScore,
                penaltyCount: ghostClicks,
                isBot: false,
                stdDevMs: 0,
                reason: `Score Faking Detected: Claimed score (${claimedScore}) exceeds absolute theoretical ceiling (${maxTheoreticalScore})`
            };
        }

        // 4. Timing Variance Analysis (Autoclicker / Bot macro detection)
        const hitOffsetsMs: number[] = [];
        for (const input of inputLog) {
            if (input.action === 'tap' && input.isHit && input.offset !== undefined && input.offset !== null) {
                hitOffsetsMs.push(input.offset * 1000); // convert seconds to ms
            }
        }

        let isBot = false;
        let stdDevMs = 0;
        if (hitOffsetsMs.length >= 15) {
            const mean = hitOffsetsMs.reduce((sum, val) => sum + val, 0) / hitOffsetsMs.length;
            const variance = hitOffsetsMs.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / hitOffsetsMs.length;
            stdDevMs = Math.sqrt(variance);
            console.log(`[ZK Simulation] Timing Variance Analysis: ${hitOffsetsMs.length} hits. StdDev: ${stdDevMs.toFixed(3)}ms`);
            
            // Human timing variance under normal conditions is highly unlikely to be under 2.0ms across 15+ hits.
            // Robotic macro clickers have exactly 0.0ms or perfectly repeating identical microsecond signatures.
            if (stdDevMs < 2.0) {
                isBot = true;
                console.warn(`[ZK Simulation] ALERT: Uniform timing variance detected (${stdDevMs.toFixed(3)}ms)! Bot flag activated.`);
            }
        }

        if (isBot) {
            return {
                verified: false,
                calculatedScore,
                penaltyCount: ghostClicks,
                isBot: true,
                stdDevMs,
                reason: `Anti-Cheat triggered: keypress timing variance is below human thresholds (${stdDevMs.toFixed(2)}ms standard deviation). Automated playing is forbidden!`
            };
        }

        // 5. Log base Hits vs Claimed Score for record verification
        console.log(`[ZK Simulation] Score Check: Claimed ${claimedScore} vs Base Hits ${calculatedScore}`);

        return {
            verified: true,
            calculatedScore,
            penaltyCount: ghostClicks,
            isBot: false,
            stdDevMs
        };
    }

    /**
     * Conceptual Midnight integration: Derives an anonymous player nullifier
     * using ZK properties and generates a blind claim ticket validated by Midnight ledger consensus.
     */
    static generateMidnightShieldedTicket(
        score: number,
        playerAddress: string,
        sessionId: number,
        isBot: boolean = false
    ): {
        nullifier: string;
        blindSignature: string;
        shieldedTxHash: string;
    } {
        // Deterministic pseudo-randomness simulating ZK nullifiers and blind signatures
        const encoder = new TextEncoder();
        const baseData = `${playerAddress}-${sessionId}-${score}-${isBot ? 'bot' : 'clean'}-midnight-secret`;
        const dataBytes = encoder.encode(baseData);
        
        // Simple hash visualizer
        let hashVal = 0;
        for (let i = 0; i < dataBytes.length; i++) {
            hashVal = (hashVal << 5) - hashVal + dataBytes[i];
            hashVal |= 0;
        }

        const nullifierHex = Math.abs(hashVal).toString(16).padStart(16, '0');
        
        // If a bot is flagged, we prefix it so the smart contract verifier instantly triggers a transaction abort
        const nullifier = `mn_nullifier_${isBot ? 'bot_' : ''}${nullifierHex}`;
        const blindSignature = `mn_blind_sig_${isBot ? 'bot_' : ''}${Buffer.from(dataBytes.slice(0, 12)).toString('hex')}`;
        
        // Simulated Midnight blockchain shielded transaction hash
        const shieldedTxHash = `0x${Buffer.from(dataBytes.slice(0, 16)).toString('hex')}...midnight`;

        console.log('[Midnight integration] Zero-Knowledge private nullifier derived:', nullifier);
        console.log('[Midnight integration] Blind claim ticket signed by Midnight network:', blindSignature);

        return {
            nullifier,
            blindSignature,
            shieldedTxHash
        };
    }
}
