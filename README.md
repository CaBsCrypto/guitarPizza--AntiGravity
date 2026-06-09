# 🍕 Rhythm Slice — ZK-Verified Rhythm Game on Stellar

> **Stellar Hacks: ZK Gaming Hackathon submission**
> A rhythm game where every score is cryptographically proven — not just recorded.

[![Live Demo](https://img.shields.io/badge/🎮_Play_Now-rhythmslice.spicycrust.com-yellow)](https://rhythmslice.spicycrust.com)
[![Stellar Testnet](https://img.shields.io/badge/Stellar-Testnet-blue)](https://stellar.org)
[![ZK Verified](https://img.shields.io/badge/ZK-RISC%20Zero-purple)](https://dev.risczero.com/)
[![Soroban SDK](https://img.shields.io/badge/Soroban-25.0.2-orange)](https://soroban.stellar.org)

**[→ Play it now: rhythmslice.spicycrust.com](https://rhythmslice.spicycrust.com)**

---

## ⚡ Post-Hackathon Major Web3 Upgrades

Rhythm Slice has transitioned from a single-player hackathon proof-of-concept into a **fully featured Web3 gaming ecosystem** featuring a non-custodial biometric onboarding flow, real-time multiplayer wagers, and a multi-contract circular economy.

### 🔑 1. Biometric Onboarding (Passkeys)
- **Keyless Non-Custodial Wallets**: Integrated WebAuthn / Passkeys (supporting Windows Hello, TouchID/FaceID, or local device PIN).
- **Zero Friction**: Players can sign up and sign Stellar transactions using their device's built-in biometrics without installing external browser extensions (like Freighter/Albedo).

### 📡 2. Real-Time PVP Multiplayer
- **Matchmaking & Rooms**: Custom signaling server running on WebSockets for public queue matchmaking and private "La Famiglia" lobby invitations.
- **Latency & Countdown Sync**: Integrated server-side timestamped synchronization (`startTime` broadcast) with 100ms client-side latency compensation. Both players start the song and note charts at the exact same millisecond.
- **Tug-of-War HUD**: Real-time visual Tension Bar representing score differentials, accompanied by reactive rival avatars representing misses, combo streaks, and Fever triggers.
- **PVP Escrow**: Multi-contract wager resolution locked in `pvp-escrow` where winner takes the pool based on verified ZK proofs.

### 🔄 3. Circular Tokenomics Ecosystem
- **Staking Vault (`staking-vault`)**: Users stake `$SLICE` in the vault to generate fresh pizza ingredients (Cheese, Pepperoni, Bacon, Onion) over ledger blocks.
- **Refrigerator Vault (`refrigerator-vault`)**: To prevent ingredient spoilage/expiration after 7 days, players can pay a 0.5 `$SLICE` fee to lock ingredients in cold storage.
- **Pizza Baking (`pizza-baking` / El Horno)**: Players bake complex recipes using raw ingredients to earn `$SLICE` payouts. Baking speed and payouts are boosted by equipped Oven NFTs (e.g. Boss, Consigliere, Don de la Masa).

---

## ## 🎯 For Judges: How ZK Powers the Game

ZK is the gating mechanism for every single on-chain action. **Nothing touches the blockchain without a proof.**

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

---

## 📦 Smart Contracts — Stellar Testnet

All contracts are deployed, verified, and active on Stellar Testnet:

1. **`guitar-pizza` (Core Sessions)**: `CBOKHYCJYPAIF3NQHPQGJTDJGCKBDC2FN5IXPBFI7L4UDIIFCLVED4HF`
2. **`slice-token` (Rhythm Token)**: `CDQQS675FAF3GXEV4Y5CQVWVHWOONDWMIM2QDVSQUHADA3XDDXSXZOFR` (with raised daily limit for active testnet validation)
3. **`zk-leaderboard` (ZK-Gated Leaderboards)**: `CAFKIEE76S5LHA2QJ3PYU7WW2VSCYCW2FDLCC2RTQLBTZRYTL5UL5PYV`
4. **`achievement-vault` (Badges)**: `CCGVC6WRVP5BNFVBQRZ3KNGTSMR37QHGAZ76NB7FXUT4LSGORTPAERVC`
5. **`daily-recipe` (Weekly Challenge)**: `CBWPTLNG5BZQUWQYRBTRGUARM7XUEUASASWMGLPIRKSNNVO7R4K3HOVN`
6. **`staking-vault` (Liquidity Staking)**: `CCFFCESR67QY2KDAOQGUKG3LWR6BFWXKGWF75TS75VX7IOBKHOSXJCW3`
7. **`refrigerator-vault` (Ingredient Storage)**: `CDNVDFIU5YHPB4PSPMJU24K7GF6EJWAKYRQGQCRNHYB5FPJR446VJYF2`
8. **`pizza-baking` (El Horno)**: `CC6JCDRZE7RQF4NDX6ITDQITCII7VS5MUJRZKXGYLQS2JQX6HRIAOP7M`
9. **`pvp-escrow` (Multiplayer Wager)**: `CAG2HF4P6FWMGQXJEP5RQQSO2WTMSQSQIQCPGME263HOPP337TXQWJM6`

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Blockchain | Stellar Soroban / Protocol 25 (X-Ray) |
| Cryptography | RISC Zero zkVM — journal + seal pattern |
| Contracts | Rust + Soroban SDK 25.0.2 |
| Frontend | React 18 + TypeScript + Vite 7 |
| Real-Time Network | WebSockets Matching + Local RTT Countdown Compensation |
| Authentication | Passkeys / WebAuthn Protocol |
| Game Engine | HTML5 Canvas-based JS engine |
| CI/CD | GitHub Actions + Vercel Production Auto-deploys |

---

## 🚀 Quick Start

```bash
git clone https://github.com/CaBsCrypto/guitarPizza--AntiGravity.git
cd guitarPizza--AntiGravity/stellar-game-studio

# Install dependencies
pnpm install

# Deploy new local/testnet contracts and generate TypeScript bindings
pnpm run setup

# Run the frontend dev server
pnpm run dev
```

---

Built with ❤️ for **Stellar Hacks: ZK Gaming** | $10,000 Prize Pool
