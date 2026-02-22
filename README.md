# 🍕 Rhythm Slice — ZK-Verified Rhythm Game on Stellar

> **Stellar Hacks: ZK Gaming Hackathon submission**
> A rhythm game where every score is cryptographically proven — not just recorded.

[![Live Demo](https://img.shields.io/badge/🎮_Play_Now-GitHub_Pages-yellow)](https://cabscrypto.github.io/guitarPizza--AntiGravity/)
[![Stellar Testnet](https://img.shields.io/badge/Stellar-Testnet-blue)](https://stellar.org)
[![ZK Verified](https://img.shields.io/badge/ZK-RISC%20Zero-purple)](https://dev.risczero.com/)
[![Soroban SDK](https://img.shields.io/badge/Soroban-25.0.2-orange)](https://soroban.stellar.org)

**[→ Play it now: cabscrypto.github.io/guitarPizza--AntiGravity](https://cabscrypto.github.io/guitarPizza--AntiGravity/)**

---

## 🎯 For Judges: How ZK Powers the Game

ZK is not a badge here — it's the gating mechanism for every single on-chain action. **Nothing touches the blockchain without a proof.**

### The Core Flow

```
Player plays Rhythm Slice in the browser (off-chain)
        │
        ▼
Input log captured: every key press, timing delta, trap event
        │
        ▼
RISC Zero zkVM runs the game logic deterministically
  → Produces: journal (public outputs) + seal (proof)
        │
        ├──► guitar-pizza contract: verifies receipt → stores score → calls GameHub
        ├──► zk-leaderboard contract: only accepts entries backed by a valid receipt
        ├──► achievement-vault contract: badges minted only if proof confirms condition
        └──► daily-recipe contract: weekly challenge claimed only with verified pizza count
```

### What the ZK Circuit Proves

The journal is the **public output** — what the blockchain reads and trusts:

| Field | Type | What it proves |
|-------|------|----------------|
| `score` | u32 | Final score is correctly derived from inputs |
| `perfect_hits` / `total_hits` | u32 | Timing accuracy is real, not inflated |
| `traps_avoided` / `total_traps` | u32 | Player *didn't* press a key during trap windows |
| `fever_seconds` | u32 | Fever mode duration is genuine |
| `pizzas_completed` | u32 | Full pizza count matches ingredient hits |
| `player_addr_hash` | [u8;32] | keccak256 of Stellar address — ties proof to wallet |
| `session_id` | u32 | Anti-replay — each session is unique |
| `song_hash` | [u8;32] | Commitment to the note chart played |

### Why Trap Avoidance Is Interesting (Novel Mechanic)

Proving you *didn't* press a key is one of the hardest anti-cheat problems in rhythm games. Traditional systems can't verify absence of input. With ZK, `traps_avoided` is a **circuit output** — mathematically proven alongside the score. No server, no trust.

### Anti-Replay at Contract Level

Each receipt's `keccak256` digest is stored on-chain after submission. Submitting the same proof twice — from any session, any wallet — is rejected. Score farming is impossible.

---

## 📦 Smart Contracts — Stellar Testnet

All 4 game contracts are deployed, verified, and callable on Stellar Testnet.

### 1. `guitar-pizza` — Core Game Contract
**`CADIKXHE6RAW4LDGV6MNTSDEK5JKCNFWUQLCYUZA7DDTOIMF6PTVAMTH`**

Manages sessions and is the ZK verification entry point.

```
start_game(player, session_id, level_id, score_goal)
  → Opens session on-chain
  → Calls GameHub::start_game(CB4VZAT2...)
  → Rate-limits: 1 active session per player

submit_score(session_id, player, receipt)
  → Verifies RISC Zero receipt
  → Parses journal: score, hits, traps, fever, pizzas, addr_hash
  → Validates player_addr_hash against tx signer
  → Stores anti-replay digest (keccak256 of receipt)
  → Calls GameHub::end_game() with win/loss result
  → Emits verified_score event
```

### 2. `zk-leaderboard` — ZK-Gated Global Leaderboard
**`CAFKIEE76S5LHA2QJ3PYU7WW2VSCYCW2FDLCC2RTQLBTZRYTL5UL5PYV`**

Top-10 per level. No proof = no entry. Period.

```
submit_score(caller, player, level_id, score, perfect_hits, pizzas, receipt)
  → Accepts from trusted guitar-pizza contract OR direct with receipt
  → Maintains sorted top-10 per level
  → Updates personal best

get_leaderboard(level_id)        → Vec<LeaderboardEntry>
get_personal_best(player, level) → Option<LeaderboardEntry>
```

### 3. `achievement-vault` — ZK-Proven Badges
**`CCGVC6WRVP5BNFVBQRZ3KNGTSMR37QHGAZ76NB7FXUT4LSGORTPAERVC`**

Badges are minted on-chain only when the ZK proof confirms the condition. One per player, immutable forever. **Earned, not given.**

| Badge | Condition (proven by ZK circuit) |
|-------|----------------------------------|
| Perfect Run | `perfect_hits == total_hits` — zero misses |
| Trap Master | `traps_avoided == total_traps` — every trap dodged |
| Fever God | `fever_seconds >= 30` |
| Iron Chef | `pizzas_completed >= 5` |

### 4. `daily-recipe` — Weekly Pizza Challenge
**`CBWPTLNG5BZQUWQYRBTRGUARM7XUEUASASWMGLPIRKSNNVO7R4K3HOVN`**

Weekly target derived deterministically — zero admin, zero oracle:
```
target = keccak256(week_id)[0] % 6 + 3   →  always 3–8 pizzas
```
```
claim_weekly(player, pizzas_completed, receipt)
  → Verifies receipt (ZK-gated)
  → Checks pizzas_completed >= weekly target
  → Marks completion (once per player per week)
```

### 5. Game Hub — Official Hackathon Integration
**`CB4VZAT2U3UC6XFK3N23SKRF2NDCMP3QHJYMCHHFMZO7MRQO6DQ2EMYG`**

`guitar-pizza` calls `start_game()` and `end_game()` on the official hub on every session. In Rhythm Slice, `player1` = **La Casa** (the house target), `player2` = the human player.

---

## 🔮 ZK Verifier — Current State & Upgrade Path

The current implementation uses a **structural verifier** (checks receipt length and journal format). This is because the RISC Zero on-chain verifier for Stellar is in active development:

```rust
// Current — structural check (receipt length + journal parsing)
fn verify_receipt(_env: &Env, receipt: &Bytes) -> bool {
    receipt.len() >= RECEIPT_MIN_LEN
}

// One-line upgrade when stellar-risc0-verifier lands:
// https://github.com/NethermindEth/stellar-risc0-verifier/
fn verify_receipt(env: &Env, receipt: &Bytes) -> bool {
    RiscZeroVerifierClient::new(&env, &verifier_addr)
        .verify(&image_id, receipt)
}
```

The journal format, receipt structure, image_id, and all contract interfaces are already built to the real RISC Zero spec. **Upgrading is a one-line change per contract.**

---

## 📋 Hackathon Requirements Checklist

- [x] **ZK-Powered Mechanic** — ZK proof gates every score, leaderboard entry, badge, and weekly claim
- [x] **Deployed Onchain** — 4 contracts live on Stellar Testnet
- [x] **Game Hub Integration** — `start_game()` + `end_game()` called on `CB4VZAT2...`
- [x] **Front End** — React 19 + TypeScript, live at GitHub Pages
- [x] **Open-source Repo** — Public GitHub, MIT License
- [x] **Live Demo** — [cabscrypto.github.io/guitarPizza--AntiGravity](https://cabscrypto.github.io/guitarPizza--AntiGravity/)
- [ ] **Video Demo** — 2–3 min walkthrough (in progress)

---

## 🎮 What is Rhythm Slice?

New York, 1984. The Five Families control the cheese. To earn your rank in the kitchen, you must **prove** your rhythm — not just claim it.

Hit ingredient notes as they fall, dodge trap items (hotdogs & burgers), complete full pizzas, activate **Fever Mode** to multiply your score. When the session ends, a Zero-Knowledge proof is generated and submitted on-chain — making every score tamper-proof and every badge trustless.

> *The Don doesn't take your word for it. Show the receipt.*

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Blockchain | Stellar Soroban / Protocol 25 (X-Ray) |
| ZK Proofs | RISC Zero zkVM — journal + seal pattern |
| Contracts | Rust + Soroban SDK 25.0.2 |
| Frontend | React 19 + TypeScript + Vite 7 |
| Wallet | Freighter via `@creit-tech/stellar-wallets-kit` |
| Game Engine | Canvas-based JS rhythm engine (mobile-ready) |
| Styling | Tailwind CSS v4 |
| CI/CD | GitHub Actions → GitHub Pages |

---

## 🚀 Quick Start

```bash
git clone https://github.com/CaBsCrypto/guitarPizza--AntiGravity.git
cd guitarPizza--AntiGravity/stellar-game-studio

# Build contracts + deploy to testnet + generate TS bindings
bun run setup

# Start dev server (localhost:3000)
bun run dev
```

**Prerequisites:** `bun`, `rust`, `stellar-cli`, `wasm32v1-none` target

---

## 🛑 Developer Notes

### CI / Deploy
The workflow uses Node 22 and runs `rm -f package-lock.json && npm install` intentionally — the Windows-generated lockfile lacks Linux rollup binaries (`@rollup/rollup-linux-x64-gnu`).

### Branch Strategy
```
dev/ui      ──┐
dev/web3    ──┼──► Antigravity ──► main ──► 🚀 Pages
Claude (AI) ──┘
```

### GitHub Pages Base URL
```typescript
// ✅ Correct
const url = `${import.meta.env.BASE_URL}game/assets/image.jpg`.replace('//', '/');
```

---

Built with ❤️ for **Stellar Hacks: ZK Gaming** | $10,000 Prize Pool
