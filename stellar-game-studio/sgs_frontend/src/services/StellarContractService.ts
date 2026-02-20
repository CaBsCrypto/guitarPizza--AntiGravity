/**
 * StellarContractService
 *
 * Real on-chain integration for Guitar Pizza contracts on Stellar Testnet.
 * Replaces MockStellarService with actual Soroban contract calls.
 *
 * Contracts (Stellar Testnet):
 *   guitar-pizza:       CADIKXHE6RAW4LDGV6MNTSDEK5JKCNFWUQLCYUZA7DDTOIMF6PTVAMTH
 *   zk-leaderboard:     CAFKIEE76S5LHA2QJ3PYU7WW2VSCYCW2FDLCC2RTQLBTZRYTL5UL5PYV
 *   daily-recipe:       CBWPTLNG5BZQUWQYRBTRGUARM7XUEUASASWMGLPIRKSNNVO7R4K3HOVN
 *   achievement-vault:  CCGVC6WRVP5BNFVBQRZ3KNGTSMR37QHGAZ76NB7FXUT4LSGORTPAERVC
 */

import { Buffer } from 'buffer';
import { keccak_256 } from '@noble/hashes/sha3';
import { Client as GuitarPizzaClient, networks as gpNetworks } from '../contracts/guitar-pizza';

// ─── Contract IDs (Testnet) ────────────────────────────────────────────────
const CONTRACT_IDS = {
  guitarPizza:       'CADIKXHE6RAW4LDGV6MNTSDEK5JKCNFWUQLCYUZA7DDTOIMF6PTVAMTH',
  zkLeaderboard:     'CAFKIEE76S5LHA2QJ3PYU7WW2VSCYCW2FDLCC2RTQLBTZRYTL5UL5PYV',
  dailyRecipe:       'CBWPTLNG5BZQUWQYRBTRGUARM7XUEUASASWMGLPIRKSNNVO7R4K3HOVN',
  achievementVault:  'CCGVC6WRVP5BNFVBQRZ3KNGTSMR37QHGAZ76NB7FXUT4LSGORTPAERVC',
} as const;

const RPC_URL         = 'https://soroban-testnet.stellar.org';
const NETWORK_PASS    = 'Test SDF Network ; September 2015';

// ─── Achievement type constants (mirrors achievement-vault contract) ────────
export const ACHIEVEMENT = {
  PERFECT_RUN:  0,
  TRAP_MASTER:  1,
  FEVER_GOD:    2,
  IRON_CHEF:    3,
} as const;

// ─── Types ─────────────────────────────────────────────────────────────────
export interface GameSessionStats {
  perfectHits:     number;
  totalHits:       number;
  trapsAvoided:    number;
  totalTraps:      number;
  feverSeconds:    number;
  pizzasCompleted: number;
  score:           number;
  levelId:         number;
  sessionId:       number;
  playerAddress?:  string;   // Stellar G-address — used to compute player_addr_hash in journal
}

export interface SignerFn {
  signTransaction: (xdr: string, opts: { networkPassphrase: string; address: string }) => Promise<{ signedTxXdr: string }>;
}

// ─── Journal builder ────────────────────────────────────────────────────────
/**
 * Encodes a GameSessionStats into the 100-byte journal format expected by the
 * RISC Zero receipt. The seal is appended as 64 random bytes (placeholder).
 *
 * Journal layout (big-endian):
 *   [0..4]    level_id         u32
 *   [4..8]    score            u32
 *   [8..40]   song_hash        [u8;32]   (zeros for now)
 *   [40..44]  perfect_hits     u32
 *   [44..48]  total_hits       u32
 *   [48..52]  traps_avoided    u32
 *   [52..56]  total_traps      u32
 *   [56..60]  fever_seconds    u32
 *   [60..64]  pizzas_completed u32
 *   [64..96]  player_addr_hash [u8;32]   (keccak256 placeholder: zeros)
 *   [96..100] session_id       u32
 *   [100..164] seal            [u8;64]   (random placeholder bytes)
 */
export function buildReceipt(stats: GameSessionStats): Buffer {
  const journal = new ArrayBuffer(100);
  const view    = new DataView(journal);
  let offset    = 0;

  const writeU32 = (v: number) => { view.setUint32(offset, v, false); offset += 4; };

  writeU32(stats.levelId);
  writeU32(stats.score);

  // song_hash: 32 zero bytes (commitment known by contract)
  offset += 32;

  writeU32(stats.perfectHits);
  writeU32(stats.totalHits);
  writeU32(stats.trapsAvoided);
  writeU32(stats.totalTraps);
  writeU32(stats.feverSeconds);
  writeU32(stats.pizzasCompleted);

  // player_addr_hash: keccak256(player_address_string) — must match the contract verification.
  // The Soroban contract does: env.crypto().keccak256(&player.to_string().to_bytes())
  // player.to_string() on a Stellar G-address returns the raw strkey string (e.g. "GCQ36V6U...").
  const playerStr = stats.playerAddress ?? '';
  const addrBytes = new TextEncoder().encode(playerStr);
  const addrHash  = playerStr.length > 0
    ? keccak_256(addrBytes)          // Uint8Array(32)
    : new Uint8Array(32);            // zeros if no address (won't pass contract, but safe locally)
  const journalArr = new Uint8Array(journal);
  journalArr.set(addrHash, offset);  // write 32 bytes at current offset (64)
  offset += 32;

  writeU32(stats.sessionId);

  // Seal: 64 pseudo-random bytes derived from score+session to be deterministic per run
  const seal = new Uint8Array(64);
  for (let i = 0; i < 64; i++) {
    seal[i] = (stats.score * 7 + stats.sessionId * 13 + i * 31) & 0xff;
  }

  const full = new Uint8Array(164);
  full.set(journalArr, 0);
  full.set(seal, 100);

  return Buffer.from(full);
}

/**
 * Encodes proof_data for achievement-vault (40 bytes, big-endian).
 *
 * Layout:
 *   [0..4]   perfect_hits     u32
 *   [4..8]   total_hits       u32
 *   [8..12]  traps_avoided    u32
 *   [12..16] total_traps      u32
 *   [16..20] fever_seconds    u32
 *   [20..24] pizzas_completed u32
 *   [24..32] score            u64
 *   [32..36] level_id         u32
 *   [36..40] reserved         u32 (0)
 */
export function buildProofData(stats: GameSessionStats): Buffer {
  const buf  = new ArrayBuffer(40);
  const view = new DataView(buf);
  view.setUint32(0,  stats.perfectHits,     false);
  view.setUint32(4,  stats.totalHits,       false);
  view.setUint32(8,  stats.trapsAvoided,    false);
  view.setUint32(12, stats.totalTraps,      false);
  view.setUint32(16, stats.feverSeconds,    false);
  view.setUint32(20, stats.pizzasCompleted, false);
  // u64 score as two u32 halves
  view.setUint32(24, Math.floor(stats.score / 0x100000000), false);
  view.setUint32(28, stats.score >>> 0, false);
  view.setUint32(32, stats.levelId, false);
  view.setUint32(36, 0, false);
  return Buffer.from(buf);
}

// ─── Client factory ─────────────────────────────────────────────────────────
function makeGuitarClient(publicKey: string): GuitarPizzaClient {
  return new GuitarPizzaClient({
    networkPassphrase: NETWORK_PASS,
    contractId:        CONTRACT_IDS.guitarPizza,
    rpcUrl:            RPC_URL,
    publicKey,
  });
}

// Lazy-load the new bindings to avoid bundling issues if they haven't been
// installed yet. Falls back gracefully.
async function loadZkLeaderboardClient(publicKey: string) {
  try {
    const mod = await import('../../../bindings/zk_leaderboard/src/index');
    return new mod.Client({ networkPassphrase: NETWORK_PASS, contractId: CONTRACT_IDS.zkLeaderboard, rpcUrl: RPC_URL, publicKey });
  } catch { return null; }
}

async function loadDailyRecipeClient(publicKey: string) {
  try {
    const mod = await import('../../../bindings/daily_recipe/src/index');
    return new mod.Client({ networkPassphrase: NETWORK_PASS, contractId: CONTRACT_IDS.dailyRecipe, rpcUrl: RPC_URL, publicKey });
  } catch { return null; }
}

async function loadAchievementVaultClient(publicKey: string) {
  try {
    const mod = await import('../../../bindings/achievement_vault/src/index');
    return new mod.Client({ networkPassphrase: NETWORK_PASS, contractId: CONTRACT_IDS.achievementVault, rpcUrl: RPC_URL, publicKey });
  } catch { return null; }
}

// ─── Helper: sign + send ────────────────────────────────────────────────────
/**
 * Signs and submits a transaction. Returns the transaction hash if available.
 */
async function signAndSend(tx: any, signer: SignerFn, playerAddress: string): Promise<string | undefined> {
  const sentTx = await tx.signAndSend({
    signTransaction: async (xdr: string) => {
      const { signedTxXdr } = await signer.signTransaction(xdr, {
        networkPassphrase: NETWORK_PASS,
        address: playerAddress,
      });
      return { signedTxXdr };
    },
  });
  // Extract the transaction hash from the response
  return (sentTx as any)?.getTransactionResponse?.txHash as string | undefined;
}

// ═══════════════════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════════════════

export class StellarContractService {
  // ─── 0. Query: get active session for a player ──────────────────────────
  /**
   * Returns the active session_id for this player, or null if none.
   * Read-only — no signature required.
   */
  static async getActiveSession(playerAddress: string): Promise<number | null> {
    try {
      const client = makeGuitarClient(playerAddress);
      const tx = await client.get_active_session({ player: playerAddress });
      const val = tx.result;
      if (val === undefined || val === null) return null;

      const sessionId = Number(val);

      // Also verify the session isn't already ended — if it is, don't reuse it.
      try {
        const stx = await client.get_session({ session_id: sessionId });
        const session = stx.result;
        if (session && typeof session === 'object' && 'is_ended' in session) {
          if ((session as any).is_ended) {
            console.log(`[StellarContract] Session ${sessionId} is ended — treating as no active session.`);
            return null;
          }
        }
      } catch {
        // get_session failed (session not found) — treat as no active session
        return null;
      }

      return sessionId;
    } catch {
      return null;
    }
  }

  // ─── 1. Start game session ──────────────────────────────────────────────
  /**
   * Opens a session on the guitar-pizza contract and registers with GameHub.
   *
   * player1 = La Casa (admin/house, stored in contract)
   * player2 = human player
   * score_goal = minimum score the human must reach to "beat the house"
   *
   * If the player already has an active session on-chain, reuses that
   * session_id instead of trying to open a new one (avoids ActiveSessionExists #4).
   *
   * Returns { success, sessionId } — use the returned sessionId for submit_score.
   */
  static async startGame(
    playerAddress: string,
    sessionId: number,
    levelId: number,
    signer: SignerFn,
    scoreGoal: number = 5000,
  ): Promise<{ success: boolean; sessionId: number; error?: string }> {
    try {
      const client = makeGuitarClient(playerAddress);

      // Check if there's already an active session — reuse it to avoid #4.
      const existing = await this.getActiveSession(playerAddress);
      if (existing !== null) {
        console.log(`[StellarContract] Reusing existing active session ${existing} for ${playerAddress}`);
        return { success: true, sessionId: existing };
      }

      const tx = await client.start_game({
        session_id: sessionId,
        player:     playerAddress,
        level_id:   levelId,
        score_goal: scoreGoal,
      });
      await signAndSend(tx, signer, playerAddress);
      console.log(`[StellarContract] Session ${sessionId} started on-chain ✅ (goal: ${scoreGoal})`);
      return { success: true, sessionId };
    } catch (err: any) {
      const msg = err?.message ?? String(err);
      // Error #4 = ActiveSessionExists — fetch the real session_id and reuse it
      if (msg.includes('#4') || msg.includes('ActiveSessionExists')) {
        console.warn('[StellarContract] ActiveSessionExists — querying active session to reuse...');
        const existing = await this.getActiveSession(playerAddress);
        if (existing !== null) {
          return { success: true, sessionId: existing };
        }
      }
      console.error('[StellarContract] start_game failed:', err);
      return { success: false, sessionId, error: msg };
    }
  }

  // ─── 2. Submit verified score (guitar-pizza) ────────────────────────────
  /**
   * Submits the ZK receipt to the guitar-pizza contract.
   * The contract verifies the receipt, updates stats, and calls GameHub.end_game().
   */
  static async submitScore(
    playerAddress: string,
    stats: GameSessionStats,
    signer: SignerFn,
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      const receipt = buildReceipt(stats);
      const client  = makeGuitarClient(playerAddress);

      const tx = await client.submit_score({
        session_id: stats.sessionId,
        player:     playerAddress,
        receipt,
      });
      const txHash = await signAndSend(tx, signer, playerAddress);
      console.log(`[StellarContract] Score ${stats.score} submitted on-chain ✅${txHash ? ` (tx: ${txHash})` : ''}`);
      return { success: true, txHash };
    } catch (err: any) {
      console.error('[StellarContract] submit_score failed:', err);
      return { success: false, error: err?.message ?? String(err) };
    }
  }

  // ─── 3. Submit score to leaderboard ────────────────────────────────────
  /**
   * Submits score + stats to the zk-leaderboard contract.
   * Returns the rank achieved (1 = first place).
   */
  static async submitLeaderboardScore(
    playerAddress: string,
    stats: GameSessionStats,
    signer: SignerFn,
  ): Promise<{ success: boolean; rank?: number; error?: string }> {
    try {
      const receipt = buildReceipt(stats);
      const client  = await loadZkLeaderboardClient(playerAddress);
      if (!client) return { success: false, error: 'zk-leaderboard client unavailable' };

      const tx = await client.submit_score({
        caller:          playerAddress,
        player:          playerAddress,
        level_id:        stats.levelId,
        score:           BigInt(stats.score),
        perfect_hits:    stats.perfectHits,
        pizzas_completed: stats.pizzasCompleted,
        receipt,
      });
      await signAndSend(tx, signer, playerAddress);
      console.log(`[StellarContract] Leaderboard score submitted ✅`);
      return { success: true };
    } catch (err: any) {
      console.error('[StellarContract] leaderboard submit_score failed:', err);
      return { success: false, error: err?.message ?? String(err) };
    }
  }

  // ─── 4. Claim weekly recipe ─────────────────────────────────────────────
  /**
   * Claims the weekly pizza challenge if pizzas_completed >= weekly target.
   */
  static async claimWeeklyRecipe(
    playerAddress: string,
    stats: GameSessionStats,
    signer: SignerFn,
  ): Promise<{ success: boolean; weeklyTarget?: number; error?: string }> {
    try {
      const receipt = buildReceipt(stats);
      const client  = await loadDailyRecipeClient(playerAddress);
      if (!client) return { success: false, error: 'daily-recipe client unavailable' };

      const tx = await client.claim_weekly({
        player:          playerAddress,
        pizzas_completed: stats.pizzasCompleted,
        receipt,
      });
      await signAndSend(tx, signer, playerAddress);
      console.log(`[StellarContract] Weekly recipe claimed ✅`);
      return { success: true };
    } catch (err: any) {
      const msg = err?.message ?? String(err);
      // NotEnoughPizzas is an expected contract error — not a failure
      if (msg.includes('NotEnoughPizzas') || msg.includes('Error(Contract, #4)')) {
        return { success: false, error: 'NotEnoughPizzas' };
      }
      if (msg.includes('AlreadyCompleted') || msg.includes('Error(Contract, #2)')) {
        return { success: false, error: 'AlreadyCompleted' };
      }
      console.error('[StellarContract] claim_weekly failed:', err);
      return { success: false, error: msg };
    }
  }

  // ─── 5. Claim achievement badges ───────────────────────────────────────
  /**
   * Attempts to claim every achievement the player qualifies for based on stats.
   * Silently skips already-earned badges.
   */
  static async claimEligibleAchievements(
    playerAddress: string,
    stats: GameSessionStats,
    signer: SignerFn,
  ): Promise<{ claimed: number[]; errors: string[] }> {
    const claimed: number[] = [];
    const errors:  string[] = [];

    const qualifies = (type: number): boolean => {
      switch (type) {
        case ACHIEVEMENT.PERFECT_RUN:
          return stats.totalHits > 0 && stats.perfectHits === stats.totalHits;
        case ACHIEVEMENT.TRAP_MASTER:
          return stats.totalTraps > 0 && stats.trapsAvoided === stats.totalTraps;
        case ACHIEVEMENT.FEVER_GOD:
          return stats.feverSeconds >= 30;
        case ACHIEVEMENT.IRON_CHEF:
          return stats.pizzasCompleted >= 5;
        default:
          return false;
      }
    };

    for (const type of [
      ACHIEVEMENT.PERFECT_RUN,
      ACHIEVEMENT.TRAP_MASTER,
      ACHIEVEMENT.FEVER_GOD,
      ACHIEVEMENT.IRON_CHEF,
    ]) {
      if (!qualifies(type)) continue;

      try {
        const receipt   = buildReceipt(stats);
        const proofData = buildProofData(stats);
        const client    = await loadAchievementVaultClient(playerAddress);
        if (!client) { errors.push(`achievement-vault unavailable`); continue; }

        const tx = await client.claim_achievement({
          player:           playerAddress,
          achievement_type: type,
          level_id:         stats.levelId,
          proof_data:       proofData,
          receipt,
        });
        await signAndSend(tx, signer, playerAddress);
        claimed.push(type);
        console.log(`[StellarContract] Achievement ${type} claimed ✅`);
      } catch (err: any) {
        const msg = err?.message ?? String(err);
        // AlreadyEarned is fine — skip silently
        if (msg.includes('AlreadyEarned') || msg.includes('Error(Contract, #2)')) continue;
        errors.push(`Achievement ${type}: ${msg}`);
      }
    }

    return { claimed, errors };
  }

  // ─── 6. Query: on-chain session (to read verified score) ────────────────
  /**
   * Reads the session data from the guitar-pizza contract.
   * Use this after submitScore to get the authoritative on-chain score.
   */
  static async getSession(playerAddress: string, sessionId: number): Promise<{ score: number; playerWon: boolean } | null> {
    try {
      const client = makeGuitarClient(playerAddress);
      const tx     = await client.get_session({ session_id: sessionId });
      const session = tx.result as any;
      if (!session) return null;
      return {
        score:     Number(session.score ?? 0),
        playerWon: Boolean(session.player_won ?? false),
      };
    } catch { return null; }
  }

  // ─── 7. Query: leaderboard ──────────────────────────────────────────────
  static async getLeaderboard(playerAddress: string, levelId: number) {
    try {
      const client = await loadZkLeaderboardClient(playerAddress);
      if (!client) return [];
      const tx     = await client.get_leaderboard({ level_id: levelId });
      return tx.result ?? [];
    } catch { return []; }
  }

  // ─── 7. Query: personal best ────────────────────────────────────────────
  static async getPersonalBest(playerAddress: string, levelId: number) {
    try {
      const client = await loadZkLeaderboardClient(playerAddress);
      if (!client) return null;
      const tx     = await client.get_personal_best({ player: playerAddress, level_id: levelId });
      return tx.result ?? null;
    } catch { return null; }
  }

  // ─── 8. Query: weekly challenge ─────────────────────────────────────────
  static async getCurrentWeeklyChallenge(playerAddress: string) {
    try {
      const client = await loadDailyRecipeClient(playerAddress);
      if (!client) return null;
      const tx     = await client.get_current_challenge();
      return tx.result ?? null;
    } catch { return null; }
  }

  // ─── 9. Query: player weekly progress ──────────────────────────────────
  static async getPlayerWeeklyProgress(playerAddress: string) {
    try {
      const client = await loadDailyRecipeClient(playerAddress);
      if (!client) return null;
      const tx     = await client.get_player_progress({ player: playerAddress });
      return tx.result ?? null;
    } catch { return null; }
  }

  // ─── 10. Query: badges ──────────────────────────────────────────────────
  static async getAllBadges(playerAddress: string) {
    try {
      const client = await loadAchievementVaultClient(playerAddress);
      if (!client) return [];
      const tx     = await client.get_all_badges({ player: playerAddress });
      return tx.result ?? [];
    } catch { return []; }
  }

  // ─── 11. Full post-game flow ─────────────────────────────────────────────
  /**
   * Convenience: runs all post-game contract calls in sequence.
   * 1. submit_score to guitar-pizza
   * 2. submit to leaderboard
   * 3. claim weekly recipe (if enough pizzas)
   * 4. claim eligible achievement badges
   *
   * Returns a summary of what happened on-chain.
   */
  static async postGameFlow(
    playerAddress: string,
    stats: GameSessionStats,
    signer: SignerFn,
  ): Promise<{
    scoreSubmitted:   boolean;
    txHash?:          string;
    leaderboardRank?: number;
    weeklyCompleted:  boolean;
    achievementsClaimed: number[];
    errors: string[];
  }> {
    const errors: string[] = [];

    // 1. Submit score (main contract + GameHub)
    // guitar-pizza.submit_score calls GameHub.end_game internally, which should
    // propagate the score to the zk-leaderboard via the trusted-game path.
    // We do NOT call submitLeaderboardScore directly because the receipt bytes
    // have an anti-replay digest stored during submit_score — a second call
    // with the same receipt would be rejected by the leaderboard contract.
    const scoreResult = await this.submitScore(playerAddress, stats, signer);
    if (!scoreResult.success) errors.push(`Score: ${scoreResult.error}`);

    // Note: leaderboard rank is not available synchronously — caller should
    // refresh getLeaderboard() after a short delay to see updated standings.
    const lbResult = { success: scoreResult.success, rank: undefined };

    // 2. Weekly recipe
    let weeklyCompleted = false;
    const weeklyResult = await this.claimWeeklyRecipe(playerAddress, stats, signer);
    if (weeklyResult.success) weeklyCompleted = true;
    else if (weeklyResult.error && !['NotEnoughPizzas', 'AlreadyCompleted'].includes(weeklyResult.error ?? '')) {
      errors.push(`Weekly: ${weeklyResult.error}`);
    }

    // 4. Achievements
    const achResult = await this.claimEligibleAchievements(playerAddress, stats, signer);
    if (achResult.errors.length) errors.push(...achResult.errors);

    return {
      scoreSubmitted:      scoreResult.success,
      txHash:              scoreResult.txHash,
      leaderboardRank:     lbResult.rank,
      weeklyCompleted,
      achievementsClaimed: achResult.claimed,
      errors,
    };
  }
}
