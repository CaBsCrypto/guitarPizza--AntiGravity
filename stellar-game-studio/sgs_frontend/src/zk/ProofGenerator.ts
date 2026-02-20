import { buildReceipt, type GameSessionStats } from '../services/StellarContractService';

/**
 * ProofGenerator
 *
 * Generates RISC Zero-compatible receipts for the Guitar Pizza ZK system.
 *
 * A receipt = journal (100 bytes of public outputs) + seal (64 bytes placeholder).
 * Total: 164 bytes — satisfies RECEIPT_MIN_LEN = 164 in all Soroban contracts.
 *
 * TODO: Replace with actual RISC Zero WASM guest execution:
 *   1. Compile the guest circuit with `cargo risczero build`
 *   2. Load the WASM binary in the browser
 *   3. Call the prover with the input trace
 *   4. Return the real receipt bytes
 *
 * Reference: https://github.com/NethermindEth/stellar-risc0-verifier/
 */
export class ProofGenerator {
    /**
     * Generate a receipt for a completed game session.
     *
     * @param stats - Full session stats captured from the game engine
     * @returns receipt bytes (164 bytes: 100-byte journal + 64-byte seal)
     */
    static async generateSessionReceipt(stats: GameSessionStats): Promise<{
        receipt: Buffer;
        stats: GameSessionStats;
    }> {
        console.log('[ProofGenerator] Generating RISC Zero receipt...', stats);

        // Simulate proof generation delay (real ZK would take 2-10s)
        await new Promise(resolve => setTimeout(resolve, 1500));

        const receipt = buildReceipt(stats);

        console.log(`[ProofGenerator] Receipt generated: ${receipt.length} bytes`);
        console.log(`[ProofGenerator] Journal: level=${stats.levelId} score=${stats.score} perfectHits=${stats.perfectHits}/${stats.totalHits} traps=${stats.trapsAvoided}/${stats.totalTraps} fever=${stats.feverSeconds}s pizzas=${stats.pizzasCompleted}`);

        return { receipt, stats };
    }

    /**
     * Legacy compatibility wrapper.
     * @deprecated Use generateSessionReceipt instead.
     */
    static async generateLevelProof(
        levelId: number,
        score: number,
        perfectHits: number,
        totalHits: number,
        opts?: Partial<GameSessionStats>
    ): Promise<{ proof: Uint8Array; publicSignals: Uint8Array }> {
        const stats: GameSessionStats = {
            levelId,
            score,
            perfectHits,
            totalHits,
            trapsAvoided:    opts?.trapsAvoided    ?? 0,
            totalTraps:      opts?.totalTraps      ?? 0,
            feverSeconds:    opts?.feverSeconds    ?? 0,
            pizzasCompleted: opts?.pizzasCompleted ?? 0,
            sessionId:       opts?.sessionId       ?? Math.floor(Math.random() * 1_000_000),
        };

        const { receipt } = await this.generateSessionReceipt(stats);

        // Public signals = first 8 bytes of journal (level_id + score)
        const publicSignals = new Uint8Array(receipt.buffer, 0, 8);

        return {
            proof: new Uint8Array(receipt),
            publicSignals: new Uint8Array(publicSignals),
        };
    }
}
