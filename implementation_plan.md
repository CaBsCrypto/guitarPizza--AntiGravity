# Approved Web3, Tokenomics, and Defindex Integration Plan: rhythmSlice

This document outlines the final, approved next-level architectural design and tokenomics model for **Rhythm Slice**, locking in the decisions from our grilling session to implement hybrid Staking/Yield-Farming vaults, dual-tier Proof-of-Play Sybil barriers, cryptographic ticket validation, simplified ingredient decay freezing, and rebranding the Bakery to **"El Horno de la Famiglia" (The Oven Vault)**.

---

## 🍕 1. Rebranding: "El Horno de la Famiglia" (The Oven Vault)

We are permanently deleting the term "Bakery" (Panadería) and replacing it in all UI components, modals, translation keys, and source codes with our chosen mafia name:
* **Spanish:** `EL HORNO DE LA FAMIGLIA` (El Horno)
* **English:** `THE OVEN VAULT` (The Oven)

This rebrand reinforces the 1980s NY Italian-mafia aesthetic, turning our asset forge into a premium cast-iron oven where players bake custom recipe slips under the watchful eye of the Don.

---

## ❄️ 2. Staking / Freezing $SLICE Tiers & The Defindex Hybrid Model

We are implementing a three-option freezing and yield-farming interface inside **El Horno de la Famiglia**, giving players a clear choice between low-risk protection, balanced staking, and high-yield asset options:

```
                                  +-----------------------------+
                                  |   EL HORNO DE LA FAMIGLIA   |
                                  +-----------------------------+
                                                 │
            ┌────────────────────────────────────┼────────────────────────────────────┐
            ▼                                    ▼                                    ▼
[CONGELAMIENTO CLÁSICO]               [BÓVEDA SINGLE-SIDED]                 [SUPER-HORNO DEFINDEX]
 (Safe Staking Tab)                    (Single Staking Tab)                  (Yield Farming Tab)
- 100% Principal Protection           - Single $SLICE Vault                 - Combined $SLICE-XLM / USDC Pool
- Baseline Yield (1x)                 - Balanced Yield (2x)                 - Boosted Yield (4x)
- Zero Impermanent Loss               - Zero Impermanent Loss               - Subject to Impermanent Loss (IL)
```

### A. Option 1: Congelamiento Clásico (Safe Staking)
* **Capital Protection:** The player's `$SLICE` is locked securely in the contract storage. There is **zero risk of Impermanent Loss**.
* **Proportionate Rewards:** The player earns baseline ingredient yields ($1\times$) and standard score multipliers based on their tier:
  * **Piccolino (100 - 499 $SLICE):** $+5\%$ Score Multiplier, $1.0\times$ Ingredient Yield rate.
  * **Soldato (500 - 1,999 $SLICE):** $+15\%$ Score Multiplier, $1.5\times$ Ingredient Yield rate, 1 free Weekly Tournament ticket.
  * **Caporegime (2,000 - 4,999 $SLICE):** $+35\%$ Score Multiplier, $2.5\times$ Ingredient Yield rate, 3 free Weekly Tournament tickets, access to VIP songs.
  * **Don de la Masa (5,000+ $SLICE):** $+60\%$ Score Multiplier, $4.0\times$ Ingredient Yield rate, free Tournaments entry, Golden HUD Badge.

### B. Option 2: Bóveda Single-Sided $SLICE (No IL Staking)
* **Yield Booster:** The player deposits only `$SLICE` into a single-asset yield contract.
* **Capital Protection:** 100% immune to Impermanent Loss (IL).
* **Yield Rate:** Earns a steady $2.0\times$ ingredient generation multiplier, providing an attractive intermediate risk-reward tier.

### C. Option 3: Super-Horno Defindex (Yield Farming)
* **DeFi Yield Aggregation:** The player's `$SLICE` is combined 50/50 with `$XLM` or `$USDC` and deposited directly into a high-liquidity **Defindex LP Vault**.
* **Yield Boost:** Players earn boosted ingredient rates ($4.0\times$) and gain tournament tickets faster, but assume standard AMM market fluctuations (Impermanent Loss). The UI will display clear mafia-themed warnings detailing the risks of high-temperature yield farming.

---

## 🤖 3. Sybil Defense: Dual-Tier Proof-of-Play (Prueba de Juego)

To protect the `$SLICE` Faucet and the gas sponsorship treasury from automated bot scripting, we enforce a strict **Proof-of-Play** verification gate with two difficulty tiers:

1. **Sponsored Gas Quota (2/24h) - 2,000 Points Gate:**
   * A beginner-friendly barrier. The player must successfully play and complete any song in the catalog with a verified score of **2,000+ points** (or complete the basic gameplay tutorial).
   * This activates the **2 free daily sponsored gas fee-bumps**, allowing them to transact on-chain with zero gas fees.
2. **SLICE Faucet Claim (5 $SLICE) - 4,000 Points Gate:**
   * A premium barrier. The player must score **4,000+ points** on any song to unlock the Faucet's one-time 5 `$SLICE` claim, protecting token supply from automated sybil farms.
3. **On-Chain Cryptographic Ticket Verification:**
   * The local Prover (`SimulatedZKCircuit.ts`) generates a cryptographically signed score ticket containing a game trace verification.
   * The Soroban contract verifies this ticket, preventing clients from modifying local JS scores to bypass the proof-of-play.

---

## 🍂 4. Ingredient Token Decay & The Locking Refrigerator Vault

To keep the game economy balanced and protect the `$SLICE` token from hyperinflation, we are implementing a thematic **Ingredient Degradation** loop:

1. **The 7-Day Spoiling Clock:** Raw ingredients (PEP, CHE, BAC, ONI) generated by players have a 7-day expiration time. If left unused in their raw inventory, they spoil and are automatically burned from circulation.
2. **Baking Sinks:** Burning ingredients to bake high-value recipe slips (e.g. *Supreme Pizza*) permanently locks their value, cashing them out for `$SLICE` payouts.
3. **The Non-Custodial Locking Refrigerator Vault (Nevera de la Famiglia):**
   * If a player wants to store their ingredients safely without spoiling, they can deposit them into a special **Nevera Vault**.
   * The vault freezes the 7-day decay timer completely.
   * To lock ingredients in the Nevera, the player pays a flat storage fee in `$SLICE` (e.g., 0.5 `$SLICE` per ingredient batch), creating an elegant token sink where `$SLICE` is permanently burned to preserve raw assets.

---

## 📋 Proposed Changes

Grouped logically by files to modify:

### 1. Frontend UI & Gameplay

#### [MODIFY] [GuitarPizzaGame.tsx](file:///d:/00%20PROGRAMANDO/guitarPizza--AntiGravity/stellar-game-studio/sgs_frontend/src/games/guitar-pizza/GuitarPizzaGame.tsx)
* Rebrand all remaining "Bakery" copy and states to "El Horno de la Famiglia" / "The Oven Vault".
* Fully integrate the multi-tab `{view === 'oven'}` modal with:
  * **Tab 1: Congelamiento Clásico** (multipliers and tiers: Piccolino, Soldato, Caporegime, Don).
  * **Tab 2: Super-Horno Defindex** (Single-sided $SLICE vault with 2x yield, and 50/50 LP vault with 4x yield and Impermanent Loss warnings).
  * **Tab 3: Nevera Vault** (simplified ingredient lock mechanism showing 7-day decay counters, "Congelar" buttons, and the flat fee in $SLICE).
  * **Proof-of-Play Panel:** Faucet locked behind 4,000+ points and sponsored transactions locked behind 2,000+ points.
* Expose dynamic post-game ingredient drops based on note hits performance in the final score screen.

#### [MODIFY] [StellarContractService.ts](file:///d:/00%20PROGRAMANDO/guitarPizza--AntiGravity/stellar-game-studio/sgs_frontend/src/services/StellarContractService.ts)
* Add support for cryptographic score ticket verification inside `submitScore`.
* Integrate single-sided $SLICE staking vault calls and Nevera locking transactions.

---

## Verification Plan

### Automated Tests
* Run TypeScript compiler check on `sgs_frontend`:
  ```powershell
  pnpm build
  ```

### Manual Verification
* Start the local server (`npm run dev`) and test playing a song to confirm ingredient drops.
* Verify the 2,000 points threshold successfully unlocks sponsored gas quota indicator.
* Verify the 4,000 points threshold successfully unlocks the Faucet claim button.
