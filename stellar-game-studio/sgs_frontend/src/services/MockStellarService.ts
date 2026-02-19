import { config } from '../config';

export class MockStellarService {
    // Simulate network latency (0.5s - 1.5s)
    private static async delay() {
        return new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    }

    /**
     * Submit a verified score to the mock contract.
     */
    static async submitVerifiedScore(
        playerAddress: string,
        levelId: number,
        score: number,
        proof: Uint8Array
    ): Promise<{ success: boolean; message: string }> {
        // OVERRIDE: Use Test Wallet if defined
        const activePlayer = (config.testWallet && config.testWallet.address.startsWith("G"))
            ? config.testWallet.address
            : playerAddress;

        console.log(`[MockStellar] Submitting score: ${score} for Level ${levelId} | Player: ${activePlayer}`);
        await this.delay();

        if (proof.length === 0) {
            return { success: false, message: "Invalid ZK Proof (Empty)" };
        }

        // Simulate Anti-Cheat Check
        if (score > 100000) {
            return { success: false, message: "Score rejected by contract logic (Too High)" };
        }

        console.log(`[MockStellar] Score verified on-chain!`);
        return { success: true, message: "Score verified and recorded!" };
    }

    /**
     * Solve the daily secret recipe.
     */
    static async solveRecipe(
        playerAddress: string,
        proof: Uint8Array
    ): Promise<{ success: boolean; reward: number; message: string }> {
        console.log(`[MockStellar] Verifying recipe solution...`);
        await this.delay();

        if (proof.length === 0) {
            return { success: false, reward: 0, message: "Invalid Recipe Proof" };
        }

        return { success: true, reward: 500, message: "Recipe Solved! You received 500 Pizza Tokens." };
    }
}
