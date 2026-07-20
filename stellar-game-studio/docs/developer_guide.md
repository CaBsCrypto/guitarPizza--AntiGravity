# Rhythm Slice — Developer Guide

This guide describes how to run, test, and expand the **Rhythm Slice (Stellar Game Studio)** codebase.

---

## 🛠️ Requirements & Environment Setup

1. **Bun or Node.js**: The repository uses `bun` as the preferred script runner and package manager. If you don't have bun installed, `npm` or `pnpm` will also work.
2. **Rust & Cargo**: Required to compile the Soroban Smart Contracts.
3. **Stellar CLI**: Install `stellar-cli` (v22+) for deploying to testnet and generating TS bindings.
4. **Nargo (Noir)**: Install `nargo` if you intend to compile or modify the ZK circuits.

---

## 📦 Project Structure

*   `contracts/`: Contains the Soroban Smart Contracts written in Rust.
    *   `guitar-pizza/`: Core game session receipt validator.
    *   `slice-token/`: ERC-20-like token contract for $SLICE.
    *   `refrigerator-vault/`: Raw ingredient cold-storage.
    *   `pizza-baking/`: Cooking timer logic and reward outputs.
    *   `staking-vault/`: Standard single-sided staking tiers.
    *   `pvp-escrow/`: Double-sided wagers and score duel releases.
*   `bindings/`: Typed TypeScript bindings generated directly from contracts WASM files.
*   `sgs_frontend/`: The main React 19 + TypeScript + Vite frontend.
*   `scripts/`: Automation scripts for deployment, compilation, and setup.
*   `circuits/`: Noir Zero-Knowledge circuits.

---

## 🚀 Execution & Deployment Commands

Execute these commands from the `stellar-game-studio/` directory:

### 1. Initialize and Setup Workspace
This command compiles all contracts, deploys them to Stellar Testnet, generates TypeScript bindings, and creates the `.env` file containing the deployed Contract IDs.
```bash
bun run setup
```

### 2. Run the Development Server
Starts the React frontend locally with hot-reloading:
```bash
bun run dev
```

### 3. Build & Deploy Individual Contracts
To re-build or re-deploy a single contract:
```bash
# Build
bun run build <contract-name>

# Deploy
bun run deploy <contract-name>
```

### 4. Regenerate Bindings
If you modify contract code, regenerate TypeScript bindings:
```bash
bun run bindings <contract-name>
```

---

## 🧪 Testing Smart Contracts

Each contract contains its own unit test suite inside `src/test.rs`. Unit tests simulate the Soroban environment, register dependencies (like Mock token assets), and validate function bounds.

To run tests for all contracts in the workspace:
```bash
cargo test --all
```

To test a single contract:
```bash
cargo test -p <contract-package-name>
```

---

## 📝 Best Practices for Adding a New Game

1. **Scaffold the Game**: Run `bun run create <game-name>` to generate boilerplate contract and frontend code.
2. **Follow the Lifecycle**: Every game must integrate with the Game Hub client:
    - Call `start_game` to open a session and lock wager amounts.
    - Call `end_game` to resolve the winner on-chain.
3. **Use Temporary Storage**: Store game sessions using temporary instance storage with a 30-day TTL. Remember to call `extend_ttl` on every write to avoid data eviction.
4. **Deterministic Randomness**: Never use ledger timestamp or sequence numbers for randomness. Use `env.prng()` seeded by a combination of `session_id` and player addresses.
