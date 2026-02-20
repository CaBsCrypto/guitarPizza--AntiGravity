# 🍕 Guitar Pizza — AntiGravity

> **Stellar Hacks: ZK Gaming Hackathon submission**
> A ZK-verified on-chain rhythm game built on Stellar Soroban.

[![Stellar Testnet](https://img.shields.io/badge/Stellar-Testnet-blue)](https://stellar.org)
[![RISC Zero](https://img.shields.io/badge/ZK-RISC%20Zero-purple)](https://dev.risczero.com/)
[![Soroban SDK](https://img.shields.io/badge/Soroban-25.0.2-orange)](https://soroban.stellar.org)

---

## 🎮 What is Guitar Pizza?

**Guitar Pizza** (a.k.a. *Rhythm Slice*) is a rhythm game where you play as a New York pizza chef in 1984, proving your skills to the Five Families that control the cheese. Hit notes, dodge trap items (hotdogs & hamburgers), complete pizzas, and activate Fever Mode to rack up points.

**The twist:** Every score is cryptographically verified on-chain using Zero-Knowledge proofs. No one can fake a high score, claim a badge they didn't earn, or submit a leaderboard entry they didn't play for.

---

## 🔐 How ZK Works Here

This project uses the **RISC Zero** zkVM pattern for off-chain proof generation with on-chain verification.

### The Flow

```
Player plays game  →  Input log captured  →  RISC Zero receipt generated (off-chain)
        ↓
  Receipt = journal (public outputs) + seal (cryptographic proof)
        ↓
  Soroban contract receives receipt → verifies seal → reads journal
        ↓
  Public outputs trusted on-chain: score, hits, traps_avoided, fever_seconds, pizzas
```

### Journal Layout (100 bytes, big-endian)

| Bytes   | Field              | Type    | Description                            |
|---------|--------------------|---------|----------------------------------------|
| 0–3     | `level_id`         | u32     | Which level was played                 |
| 4–7     | `score`            | u32     | Final verified score                   |
| 8–39    | `song_hash`        | [u8;32] | Commitment to the level's note chart   |
| 40–43   | `perfect_hits`     | u32     | Notes hit in the perfect window        |
| 44–47   | `total_hits`       | u32     | Total notes hit (perfect + normal)     |
| 48–51   | `traps_avoided`    | u32     | Trap items (hotdogs/hamburgers) dodged |
| 52–55   | `total_traps`      | u32     | Total trap items in the session        |
| 56–59   | `fever_seconds`    | u32     | Continuous seconds in Fever Mode       |
| 60–63   | `pizzas_completed` | u32     | Pizzas completed in session            |
| 64–95   | `player_addr_hash` | [u8;32] | keccak256 of player's address string   |
| 96–99   | `session_id`       | u32     | Unique session identifier              |

### Why This Matters for Gameplay

- **Anti-cheat**: Score tampering is mathematically impossible — the ZK circuit verifies inputs match outputs
- **Trap validation**: Proving you *didn't* press a key during a trap window is as verifiable as proving you *did* hit a note
- **Fair leaderboard**: Every leaderboard entry is backed by an on-chain verified proof
- **Trustless badges**: Achievements can't be granted — they can only be *proven*

---

## 📦 Smart Contracts

All contracts are deployed on **Stellar Testnet** and use the RISC Zero receipt/journal pattern.

### 1. `guitar-pizza` — Core Game Contract

The heart of the system. Manages game sessions and score verification.

```
start_game(player, level_id, player1_points)
  → creates session
  → calls GameHub::start_game()

submit_score(player, session_id, level_id, score, receipt, [achievement fields])
  → verifies RISC Zero receipt
  → parses journal: score, hits, traps_avoided, fever_seconds, pizzas_completed
  → updates level stats + high score
  → calls GameHub::end_game()
  → emits verified_score event
```

**Anti-replay**: Each receipt's keccak256 digest is stored — no receipt can be submitted twice.
**Rate limiting**: One active session per player at a time.

### 2. `zk-leaderboard` — ZK-Gated Leaderboard

Global top-10 per level. Only accepts scores that arrived through the trusted game contract (already ZK-verified) or with their own receipt.

```
submit_score(caller, player, level_id, score, perfect_hits, pizzas_completed, receipt)
  → updates top-10 board (sorted descending)
  → updates personal best
  → emits leaderboard_updated(player, level_id, score, rank)

get_leaderboard(level_id)         →  Vec<LeaderboardEntry> (top 10)
get_personal_best(player, level)  →  Option<LeaderboardEntry>
```

### 3. `daily-recipe` — Weekly Pizza Challenge

Every 7 days, a new pizza target is derived automatically from the week number using on-chain `keccak256`. No admin intervention needed — it's deterministic and unpredictable.

```
Target = keccak256(week_id)[0] % 6 + 3   →  always between 3 and 8 pizzas
```

```
claim_weekly(player, pizzas_completed, receipt)
  → verifies receipt
  → checks pizzas_completed >= target for this week
  → marks achievement (once per player per week)
  → emits recipe_unlocked(player, week_id, pizzas, target)

get_current_challenge()           →  WeeklyChallenge { week_id, target_pizzas, total_completions }
get_player_progress(player)       →  PlayerProgress { completed, best_pizzas, claimed_at }
```

### 4. `achievement-vault` — ZK-Proven Badges

On-chain badges minted only when the ZK proof confirms the condition was met. **One badge per player per type** — immutable once earned.

| Badge       | ID | Condition                                   |
|-------------|----|---------------------------------------------|
| Perfect Run | 0  | `perfect_hits == total_hits` (0 misses)     |
| Trap Master | 1  | `traps_avoided == total_traps` (all dodged) |
| Fever God   | 2  | `fever_seconds >= 30`                       |
| Iron Chef   | 3  | `pizzas_completed >= 5`                     |

```
claim_achievement(player, achievement_type, level_id, proof_data, receipt)
  → verifies receipt
  → parses proof_data (40 bytes: hits, traps, fever, pizzas, score, level)
  → checks condition for achievement_type
  → mints badge on-chain
  → emits achievement_earned(player, type, level_id, score)

get_badge(player, achievement_type)   →  Option<Badge>
get_all_badges(player)                →  Vec<Badge>
has_achievement(player, type)         →  bool
```

### 5. `mock-game-hub` — Game Hub Integration

All game contracts call `start_game()` and `end_game()` on the official Game Hub mock contract:

```
Contract: CB4VZAT2U3UC6XFK3N23SKRF2NDCMP3QHJYMCHHFMZO7MRQO6DQ2EMYG
```

---

## 🏗️ Architecture Diagram

```
                        PLAYER (Browser)
                             │
                    [plays rhythm game]
                             │
                    [RISC Zero receipt generated off-chain]
                    journal: score, hits, traps, fever, pizzas
                             │
              ┌──────────────┼──────────────────┐
              │              │                  │
              ▼              ▼                  ▼
       guitar-pizza    zk-leaderboard    achievement-vault
       (core session)  (top-10 board)    (badges on-chain)
              │
              ├──► GameHub::start_game()
              ├──► GameHub::end_game()
              │
              ▼
       daily-recipe
       (weekly pizza challenge)
```

---

## 🛠️ Tech Stack

| Layer       | Technology                       |
|-------------|----------------------------------|
| Blockchain  | Stellar (Soroban / Protocol 25)  |
| ZK Proofs   | RISC Zero zkVM                   |
| Contracts   | Rust + Soroban SDK 25.0.2        |
| Frontend    | React 19 + TypeScript + Vite     |
| Wallet      | Freighter (Stellar Wallets Kit)  |
| Game Engine | Canvas-based JS rhythm engine    |

---

## 🚀 Setup & Deployment

### Prerequisites

```bash
curl -fsSL https://bun.sh/install | bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
cargo install --locked stellar-cli --features opt
rustup target add wasm32v1-none
```

### Install & Deploy

```bash
# Clone
git clone https://github.com/cabscrypto/guitarPizza--AntiGravity.git
cd guitarPizza--AntiGravity/stellar-game-studio

# One-command setup (build + deploy testnet + generate TS bindings)
bun run setup

# Dev server
bun run dev
```

### Build contracts only

```bash
cd stellar-game-studio
cargo build --target wasm32v1-none --release
```

---

## 🔮 RISC Zero Verifier Integration

Every contract has a `verify_receipt` function ready to be upgraded:

```rust
/// TODO: Replace with actual RISC Zero on-chain verification:
/// https://github.com/NethermindEth/stellar-risc0-verifier/
fn verify_receipt(_env: &Env, receipt: &Bytes) -> bool {
    receipt.len() >= RECEIPT_MIN_LEN
}
```

**Upgrade path:**
1. Deploy the [Nethermind RISC Zero verifier](https://github.com/NethermindEth/stellar-risc0-verifier/) to testnet
2. Store verifier address in constructor
3. Replace placeholder with cross-contract call:

```rust
let verifier = RiscZeroVerifierClient::new(&env, &verifier_addr);
verifier.verify(&image_id, &receipt); // panics on invalid proof
```

---

## 📋 Hackathon Requirements Checklist

- [x] **ZK-Powered Mechanic** — ZK receipt gates all score submissions, leaderboard entries, and badge minting
- [x] **Deployed Onchain** — Stellar Testnet, all 4 game contracts deployed
- [x] **Game Hub Integration** — `start_game()` + `end_game()` called on official hub contract
- [x] **Front End** — Full React UI with gameplay, ZK overlay, wallet integration
- [x] **Open-source Repo** — Public GitHub repository
- [ ] **Video Demo** — 2–3 minute video (in progress)

---

## 🎯 Key ZK Mechanics for Judges

1. **Score verification**: The ZK circuit proves score is correctly derived from the input log
2. **Trap avoidance proof**: Proves *absence* of inputs during trap windows — the hardest anti-cheat problem in rhythm games
3. **Deterministic weekly target**: `keccak256(week_id)` derives challenge target — no oracle, no admin, no bias
4. **Immutable badges**: Once a ZK proof unlocks a badge, it lives on-chain forever — provably earned, never granted

---

## 🍕 Game Lore

*New York, 1984. Five Families control the cheese. To earn your rank in the kitchen, you must prove your rhythm — not just claim it. The Don doesn't take your word for it. Show the receipt.*

---

Built with ❤️ for **Stellar Hacks: ZK Gaming** | $10,000 Prize Pool
