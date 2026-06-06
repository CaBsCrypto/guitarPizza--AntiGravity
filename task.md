# Task Checklist: Web3, Tokenomics, and Defindex Integration

## 📋 Task Checklist

- [x] **1. UI Rebranding to "El Horno de la Famiglia"**
  - [x] Rename references from "Bakery" / "Panadería" to "El Horno de la Famiglia" / "The Oven Vault" in `GuitarPizzaGame.tsx`.
- [x] **2. Interactive Oven Vault Modal (`view === 'oven'`)**
  - [x] Implement Tab 1: Congelamiento Clásico (Tiers: Piccolino, Soldato, Caporegime, Don).
  - [x] Implement Tab 2: Super-Horno Defindex (Single-sided Staking with 2x yield, and 50/50 LP Staking with 4x yield and IL warnings).
  - [x] Implement Tab 3: Nevera Vault (7-day decay countdowns, "Congelar" button locking ingredients by paying flat fee in $SLICE).
  - [x] Implement Proof-of-Play panel (displays locks based on maxScore: 2,000 pts for gas sponsorship, 4,000 pts for Faucet).
- [x] **3. Post-game Gameplay Drops & Stellar Integration**
  - [x] Award PEP, CHE, BAC, ONI dynamically in `onComplete` in `GuitarPizzaGame.tsx` based on hits.
  - [x] Add ticket cryptographic validation support in `StellarContractService.ts` (handled via the robust RISC Zero ZK receipt journal).
- [x] **4. Build, Validation and Vercel Deploy**
  - [x] Verify local compilation completes cleanly (`pnpm build`).
  - [x] Deploy the updated rhythm game live to Vercel production.

## 📱 Responsive Layout & Mobile Fixes (Sprint 10)

- [x] Apply flex: '1 1 240px' on Nevera Frozen Ingredients container to enable clean mobile wrapping.
- [x] Add whiteSpace: 'normal' on NUEVA COMANDA trigger button to wrap cleanly on 320px-360px viewports.
- [x] Enable wrapping on Clash Board Active Orders section header (📝 ORDENES ACTIVAS).
- [x] Align desktop modals to flex-start with a top padding of 120px in mafia-theme.css to clear sticky headers.
- [x] Restrict large desktop modals (Oven, Clash Board) to maxHeight: '72vh' to guarantee they fit vertically and end on the page above the footer.
- [x] Compile and deploy updated assets live to Vercel production.
- [x] Streamline code inside `GuitarPizzaGame.tsx` to utilize premium classes over inline styling constraints.
- [x] Restructure Primary Lobby Buttons (Clashes & Oven) to a side-by-side card grid to save 50% vertical space and stop Title overflow.

## 🤝 Sprint 13: "La Famiglia" (Friends List)
- [x] Draft Implementation Plan for Data Storage Strategy and Modal UI insertion.
- [x] Implement Option A (Local Storage via Zustand Persist Middleware) via a new `friendsSlice.ts` to hold public keys and aliases.
- [x] Inject a Tab Switcher inside the "PIZZERÍA CLASHES" Modal to toggle between "Global Feed" and "La Famiglia".
- [x] Add logic to input Stellar `G...` keys + Aliases, validate 56-chars, and map them in a scrollable list.
- [x] Add "Retar" (Challenge) and "Remove" (X) buttons to the friend list objects.
- [x] Deploy La Famiglia to Production via Vercel.

## 🏆 Dynamic High Score, Compact Layouts & Lobby Cancel (Sprint 11)

- [x] Expose player's dynamic verified high score record (`maxScore` / "puntos") inside the Sybil Defense console.
- [x] Prepend player's active challenge in the global lobby as "TU COMANDA ACTIVA (ESPERANDO RIVAL)".
- [x] Implement "CANCELAR COMANDA" action button to revoke the player's active match cleanly from the lobby feed.
- [x] Prevent empty feed warning from showing when the player has an active pending duel.
- [x] Tense and shrink outer gaps, margins, container paddings, inputs, and buttons in Oven tabs.
- [x] Build and compile successfully with Vite with zero errors.
- [x] Deploy live production build to Vercel.

## 📱 Remove REMOTE Header Trigger & Lobby UI Overhaul (Sprint 12)

- [x] Remove the `📱 REMOTE` header trigger button and unused states from `Layout.tsx`.
- [x] Implement ultra-premium 3D pill-shaped buttons for Clashes (`.lobby-clashes-btn`) and Oven (`.lobby-oven-btn`) inside `mafia-theme.css`.
- [x] Redesign the secondary lobby option grid (Market, Ranking, Setup, Rules) into beautiful 3D dark-gold pills (`.lobby-nav-btn`).
- [x] Build and compile successfully with Vite with zero errors.
- [x] Deploy live production build to Vercel.

## 💿 Campaign Progression & NFT Drop System Integration (Sprint 14)

- [x] Configure 888 hard supply deterministic metadata mapping for 8 pixel-art oven styles.
- [x] Implement root-level `/api/drop-oven.ts` serverless handler to receive client POSTs.
- [x] Add root-level `package.json` with `@stellar/stellar-sdk` dependency to enable remote serverless compiler resolution.
- [x] Set Vercel deployment options to target Node.js runtime and apply typecasting to resolve remote complex signature checks.
- [x] Re-position and style the ultra-premium spinning gold-pill `💿 MINT` button next to the `$SLICE` balance in the header and Oven sub-header.
- [x] Integrate active rotation velocity keyframe animations to accelerate rotation from `4s` to `0.6s` during mint processes.
- [x] Enable dynamic on-chain collection retrieval via `balance_of` on `CollectionTab.tsx` and hook up equipping local storage multipliers.
- [x] Build, compile, and successfully deploy to production on Vercel.

## 🎨 Visual Polish: Card Transparency & Layout Overlaps
- [x] Remove checkered gray-and-white grid background from NFT oven images using PIL flood-fill, restoring clean transparent backgrounds.
- [x] Wrap Sybil Defense & Proof-of-Play panel inside conditional check `{ovenTab !== 'collection' && ( ... )}` in `GuitarPizzaGame.tsx` to hide it when looking at the collection tab, resolving card overlap.
- [x] Trigger production build and redeploy to Vercel.

## 🍕 Sprint 20: Timed-Baking System and Soroban Integration
- [x] Update Soroban `staking-vault` Rust unit test suite with SDK v23 standards (`register_stellar_asset_contract` and `StellarAssetClient`).
- [x] Ensure 100% compilation and success on workspace smart contract unit tests.
- [x] Build the visual Oven dashboard in `GuitarPizzaGame.tsx` showing the 4-slot grid, locking mechanics, cherry/mesquite wood selection, and glowing animations.
- [x] Wire `startBaking`, `speedUpBake`, and `claimPizza` explicitly to `StellarContractService.ts` to replace local simulation with live on-chain operations.
- [x] Implement non-blocking mock local/localStorage fallbacks when offline or playing under the demo user `G_DEMO_USER`.
- [x] Successfully consolidate the baking views and build the workspace cleanly.

