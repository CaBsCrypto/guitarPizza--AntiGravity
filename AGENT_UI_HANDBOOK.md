# Manual de Acoplamiento Frontend — Rhythm Slice (Guitar Pizza)

> **Audiencia**: agente de IA (u humano) que va a rediseñar/modificar la UI del frontend
> **sin romper** la integración web3 (Stellar Soroban) ni el motor del juego de ritmo.
> **Última actualización**: 2026-07-01, contra el commit `8435a51` de `main`.

---

## 0. Contexto en 30 segundos

- **Rhythm Slice** es un juego de ritmo (estilo Guitar Hero, temática pizzería mafiosa) con economía on-chain en **Stellar Soroban testnet**: token $SLICE, leaderboard ZK, staking, PvP, horneado de pizzas, torneos.
- Frontend: **React 19 + Vite 7 + TypeScript + Zustand + Tailwind (mínimo, casi todo CSS custom)**.
- Ruta del frontend: `stellar-game-studio/sgs_frontend/`.
- **Deploy oficial: Vercel → https://rhythmslice.spicycrust.com** (auto-deploy en cada push a `main`). GitHub Pages está muerto y no se usa.
- El motor del juego es **JS vanilla en `public/game/guitar-pizza-engine.js`** — NO pasa por Vite/React, se carga con `<script>` dinámico.

---

## 1. REGLAS DE ORO (violarlas rompe el juego o el dinero)

### 🚫 NO tocar jamás
| Qué | Dónde | Por qué |
|---|---|---|
| Firmas/exports de `StellarContractService` | `src/services/StellarContractService.ts` (~2.300 líneas) | Es la capa completa de contratos. Todo el juego llama aquí. |
| Bindings generados de contratos | `src/contracts/*/` | Son generados por tooling (`bun run bindings`). No se editan a mano. |
| Lógica de resolución de contract IDs | `src/utils/constants.ts` (`TESTNET_CONTRACT_IDS`, `getContractId()`), `src/utils/runtimeConfig.ts` | Si cambias esto el juego apunta a contratos equivocados. |
| El bloque de carga del engine | `GuitarPizzaGame.tsx`, aprox. líneas 2740–3430 (busca `window.initGuitarPizza`) | Es el handshake React ↔ engine. Frágil y crítico. |
| El engine mismo | `public/game/guitar-pizza-engine.js` (~2.900 líneas) | Fuera de alcance de un rediseño de UI. Renderiza el canvas del juego. |
| Shape del estado de Zustand | `src/store/walletSlice.ts`, `src/store/friendsSlice.ts` | Muchos componentes leen esas keys por nombre. |
| Retornos de los hooks | `src/hooks/useWallet.ts`, `useSliceBalance.ts`, `useWalletStandalone.ts`, `useWebSocketBridge.ts` | Puedes consumirlos, no cambiarlos. |
| Formato del receipt/proof ZK | `src/zk/ProofGenerator.ts`, `buildReceipt()`/`buildProofData()` en StellarContractService | El contrato on-chain valida ese formato byte a byte. |
| `.env`, secrets, claves dev | raíz de `stellar-game-studio/` | Contiene secretos de wallets de prueba. |

### 🚫 Git
- **NUNCA push a `main` sin aprobación explícita del usuario.** `main` = deploy inmediato a producción (Vercel).
- Trabaja en una rama propia (ej: `dev/ui-redesign`) y entrega PR o commits para revisión.
- Hay un pre-push hook interactivo que pide escribir `DEPLOY` para pushear a `main`. No lo bypassees con `--no-verify`.

### ✅ SÍ puedes tocar libremente
- Todo `.css` del proyecto (`index.css`, `App.css`, `components/*.css`, `pages/*.css`).
- JSX/markup y estructura visual de componentes en `src/components/`, `src/pages/`, y las partes de UI de `src/games/guitar-pizza/GuitarPizzaGame.tsx` (menús, modales, HUD, lobby — **no** el bloque del engine).
- `public/mafia-theme.css` (tema legacy que aún carga `index.html`).
- Crear componentes nuevos, extraer sub-componentes, añadir CSS nuevo.

---

## 2. Mapa del proyecto

```
stellar-game-studio/sgs_frontend/src/
├── components/     ← Shell + wallet UI (Layout, WalletStandalone, GamesCatalog, MobileController…)
├── pages/          ← HomePage (lobby con carrusel de sindicatos), DocsPage
├── games/
│   └── guitar-pizza/
│       ├── GuitarPizzaGame.tsx   ← ⚠️ MONOLITO de ~9.450 líneas: todo el juego vive aquí
│       ├── SimulatedZKCircuit.ts
│       └── components/OnboardingModal.tsx
├── hooks/          ← useWallet, useSliceBalance, useWalletStandalone, useWebSocketBridge
├── services/       ← StellarContractService (núcleo web3), PasskeyService, MultiplayerService…
├── store/          ← Zustand: walletSlice, friendsSlice
├── contracts/      ← bindings TS generados (guitar-pizza, staking-vault, pvp-escrow, tournaments, refrigerator-vault)
├── utils/          ← constants.ts (contract IDs), runtimeConfig, transactionHelper…
├── zk/             ← ProofGenerator (Noir UltraHonk + fallback RISC Zero receipt)
└── data/           ← songList.ts (canciones del juego)

public/
├── game/guitar-pizza-engine.js   ← motor del juego (vanilla JS, canvas)
├── game/assets/                  ← sprites, audio (mp3s), decoración
└── mafia-theme.css               ← tema global legacy
```

---

## 3. Contratos de integración (la API interna que debes respetar)

### 3.1 Wallet — `useWallet()`
```ts
const {
  publicKey, walletType, isConnected, isConnecting, network, error,
  connect(), connectDev(), disconnect(), switchPlayer(),
  getContractSigner(),          // ← lo que se pasa a StellarContractService para firmar
  registerPasskey(), loginPasskey(),
} = useWallet();
```
- Soporta 3 modos: **Freighter/wallets-kit**, **Passkey Smart Account**, **dev wallets** (2 jugadores de prueba).
- Sesión persistida en cookie `stellar_wallet` (compartida entre subdominios `.spicycrust.com`).
- La UI de conexión vive en `WalletStandalone.tsx` — puedes restilizarla, no cambiar su lógica.

### 3.2 Balance $SLICE — `useSliceBalance()`
```ts
const { balance, loading, refresh } = useSliceBalance(); // poll cada 30s
```
- Hay eventos custom (`window.dispatchEvent`) que fuerzan refresh tras airdrops/claims. Si mueves el chip de balance de lugar, mantén el hook.

### 3.3 Servicio de contratos — `StellarContractService`
Métodos que la UI invoca (no exhaustivo, pero los principales flujos):
- **Juego**: `startGame()`, `submitScore()` (con proof ZK), `getSession()`
- **Leaderboard**: `submitLeaderboardScore()`, `getLeaderboard()`, `getPersonalBest()`
- **Recompensas**: `claimSlice()`, `claimEligibleAchievements()`, `dailyCheckIn()`
- **Staking**: `stakeSlice()`, `unstakeSlice()`, `getStakedBalance()`, `claimStakingRewards()`
- **Horno (pizza-baking)**: unlock de slots, bake con fuel, claim de pizzas
- **PvP escrow**: crear/aceptar/resolver duelos con apuesta
- **NFT/DeFi**: `getNftCollection()`, LP de Defindex

Regla práctica: **la UI llama, muestra loading, muestra resultado/error. Nada más.** Toda transacción firma con `getContractSigner()` del hook de wallet.

### 3.4 Handshake React ↔ Engine del juego
El flujo completo (en `GuitarPizzaGame.tsx`):
```
1. React monta <canvas ref={canvasRef}>
2. Si window.initGuitarPizza no existe → inyecta <script src="/game/guitar-pizza-engine.js">
3. window.GP_BASE_PATH = import.meta.env.BASE_URL   (resolución de assets)
4. window.initGuitarPizza(canvas, userAddress, onComplete, songUrl, translations)
5. El engine juega. Al terminar llama onComplete(finalScore, inputLog)
6. React genera el proof ZK (ProofGenerator) y llama submitScore()
```
- El engine devuelve una función de cleanup — se llama al desmontar.
- **Si rediseñas la pantalla del juego**: el canvas debe seguir existiendo con el mismo ref, y el contenedor puede cambiar de estilo pero no desmontar el canvas mientras se juega.
- Fullscreen móvil apunta directamente al contenedor del canvas (commits recientes) — pruébalo en móvil si tocas esa zona.

---

## 4. Sistema de estilos actual

### Design tokens (en `src/index.css`)
```css
--font-display: "Fraunces";        /* serif, títulos */
--font-body: "Space Grotesk";      /* sans, cuerpo */
--font-mono: "IBM Plex Mono";
--color-bg: #080808;               /* noir */
--color-accent: #d4af37;           /* dorado */
--color-accent2: #b91d1d;          /* rojo sangre */
--radius: 6px;
```

### Convenciones
- **Prefijo `rs-`** para las clases del diseño "Rhythm Slice" (ej: `.rs-shell`, `.rs-header`, `.rs-game-mode`, `.rs-play-btn`). Mantén el prefijo para clases nuevas.
- `.rs-game-mode` en el shell oculta header/footer cuando `page === 'game'` — el juego ocupa 100% de la pantalla. No rompas ese toggle.
- CSS por componente en archivos `.css` hermanos (`Layout.tsx` + `Layout.css`). Tailwind se usa poco; **sigue el patrón CSS custom** salvo que el usuario pida migrar a Tailwind.
- `public/mafia-theme.css` es legacy pero aún se carga — revisa qué selectores siguen vivos antes de borrarlo.
- **Mobile-first es crítico**: los últimos 2 meses de trabajo fueron casi todos fixes de layout móvil (fullscreen, safe areas, overflow de textos). Verifica cada cambio en viewport 375×812 además de desktop.

### ⚠️ El monolito
`GuitarPizzaGame.tsx` (9.450 líneas) mezcla: lobby del juego, selector de canciones, HUD, modales (check-in, quests, colección, staking, horno, PvP, torneos), proof stepper ZK, y el loader del engine. **Gran parte de la UI a rediseñar está aquí, con muchos estilos inline.**
- Si el rediseño es grande, extraer sub-componentes es bienvenido, PERO: extrae en commits pequeños, sin cambiar lógica, verificando que compila y corre después de cada extracción.
- No refactorices lógica y estilos en el mismo commit.

---

## 5. Flujo de trabajo esperado

1. **Rama**: crea `dev/ui-<tema>` desde `main` actualizado. Push libre a esa rama.
2. **Correr en local**:
   ```bash
   cd stellar-game-studio/sgs_frontend
   npm install        # si hace falta
   npm run dev        # Vite dev server
   ```
   - `vite.config.ts` usa `envDir: '..'` → el `.env` vive en `stellar-game-studio/`, no en `sgs_frontend/`. Ya existe, no lo regeneres.
   - Sin wallet real puedes usar **dev mode** (`connectDev()` / dev wallets del `.env`).
3. **Build check antes de entregar**: `npm run build` (usa 4GB de heap, es normal que tarde).
4. **QA mínimo por cambio**:
   - [ ] `npm run build` pasa sin errores
   - [ ] Lobby carga y el botón principal lleva al juego
   - [ ] Conectar wallet (dev mode basta) funciona
   - [ ] Una partida completa: jugar → terminar → pantalla de score → submit (en testnet)
   - [ ] Balance $SLICE visible en header
   - [ ] Viewport móvil 375px: sin overflow, fullscreen del juego funciona
   - [ ] Modales: check-in diario, selector de canciones, colección abren y cierran
5. **Entrega**: commits descriptivos en tu rama + resumen de qué archivos tocaste y qué flujos verificaste. **El merge a `main` lo decide el usuario.**

---

## 6. Referencias rápidas

| Cosa | Dónde |
|---|---|
| Sitio en producción | https://rhythmslice.spicycrust.com (Vercel, proyecto `guitarslice`) |
| Contract IDs vigentes (testnet) | `src/utils/constants.ts` → `TESTNET_CONTRACT_IDS` (fuente de verdad) |
| Historia del proyecto / sprints | `walkthrough.md` en la raíz del repo (hasta Sprint 23) |
| Guía de contratos Soroban | `stellar-game-studio/CLAUDE.md` (AGENTS.md) |
| Canciones | `src/data/songList.ts` + mp3 en `public/game/assets/audio/` |
| Paleta/fuentes | `src/index.css` (variables CSS) |

---

## 7. Errores comunes que ya mordieron a otros (no repetir)

1. **Desmontar el canvas del juego al cambiar de vista** → el engine queda corriendo huérfano y el audio sigue sonando. Usa el cleanup que devuelve `initGuitarPizza`.
2. **Cambiar textos de botones que son selectores de tests/estilos** — hay CSS que selecciona por clases `rs-` específicas; renombrar clases sin buscar usos rompe estilos silenciosamente (`grep -r "rs-nombre"` antes de renombrar).
3. **Olvidar el `BASE_URL`** en rutas de assets — usa `import.meta.env.BASE_URL` o rutas relativas que ya existen, nunca `/game/...` hardcodeado con dominio.
4. **Regenerar `package-lock.json` en Windows y commitearlo** — históricamente causó builds rotos en CI Linux. Si `npm install` te lo modifica sin haber agregado deps, no lo commitees.
5. **Textos largos en botones móviles** — hubo varios fixes de overflow (ej: "LET'S COOK"). Verifica cualquier texto nuevo en 375px.
