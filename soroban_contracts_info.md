# Documentación de Contratos Inteligentes Soroban - Rhythm Slice

Este documento resume las direcciones definitivas (Contract IDs), la ubicación de los bindings de TypeScript auto-generados y el esquema de autenticación/roles para conectar el frontend de **Rhythm Slice (Guitar Pizza)** a la red Testnet de Stellar.

---

## 1. Direcciones de Contratos Activos (Testnet)

Todos los contratos están compilados usando Soroban Rust SDK v25.0.2 y desplegados en la red Testnet oficial.

| Contrato | Contract ID (Testnet) | Propósito / Descripción |
| :--- | :--- | :--- |
| **\$SLICE Token** | `CACFX6EO72DX2HC5JC7M66TDESTEQ6VOYZXKVKB6NOH52LIL4GQDRDIL` | Token principal de la economía del juego ($SLICE). Utilizado para recompensas, duelos, congelamientos y fees. |
| **Oven Collectibles (NFT)** | `CBC3AGOZTWKEII45VBRWLOGMBNGBJ6ABPP6MOFAZM2HFHP2NKPXXEWXB` | Coleccionables ERC-721 para multipliers de horneado y reducción de tiempos de cocina. |
| **`guitar-pizza`** | `CCBDKEBNL3KH4FSRH6UCS72COWIP4Z7DRU74NSZMKJO2TXTKXACSZVVJ` | Validador de recetas y receptor principal de las firmas criptográficas de sesión de juego. |
| **`staking-vault`** | `CBX3ABOYGTTSLFXQ7FWGL2Q3QN7DZMTXWBFSU2JWC2KZEQQLUIVI7MRW` | Bóveda de Staking Clásico con rangos/tiers dinámicos (Piccolino a Don). |
| **`refrigerator-vault`** | `CA4HNGFAIFGLHJ4ZBEK4FWIV33FOQEEXMO4EQQOAPPOK4J6NWFP7XSB4` | Bóveda de Nevera para detener la expiración (decay) de ingredientes pagando una tarifa plana. |
| **`pizza-baking`** | `CAIQHGCF2374CULXFW3D3XC3GYIEMLZC4QLLKV76SM5VC33MDMGXH25B` | Motor de horneado (El Horno de la Famiglia) que consume ingredientes y acuña recompensas de $SLICE. |
| **`pvp-escrow`** | `CBGL7NQJBHXKJJPYWQF3UGAGEHWH72LHBOHDGOTU242XAEH5PXOTCALD` | Escrow para duelos de apuestas multi-jugador regulado por pruebas de ZK de puntaje alto. |
| **`zk-leaderboard`** | `CCGP2I2A5E7OKNHPWJVHDGQCTUIF2GLJEBOZO72LDDZ7ILY65ECEEV3S` | Top-10 ranking global asegurado contra trampas por medio de pruebas ZK en navegador. |
| **`mock-game-hub`** | `CC52YOVJEFKQT7GIIJ3HVRWZGEOGJZLQXR3AL6HAK6J5NWQMFS7RFMSM` | Orquestador de sesiones de juego (Estándar de Studio Lifecycle). |
| **`risc0-verifier`** | `CDSM3KQPI2M7X6CWMMKVNKZKYY73JZ2YBMW5U3V4EEELH2BRYSE6KJKC` | Verificador de firmas de RISC Zero para garantizar el juego limpio off-chain en la blockchain. |
| **`tournaments`** | `CADTV5WUWYWTBUEURYJ2MIE5UZ4HKVDNVST4KNJ34JPBBTKEWQ4QVGNM` | Administrador de ligas y torneos eliminatorios en tiempo real. |

---

## 2. Bindings de TypeScript Generados

Los bindings tipados se generan automáticamente y se encuentran en la carpeta `stellar-game-studio/bindings/`. No los edites a mano.

*   **\$SLICE Token Bindings:** [stellar-game-studio/bindings/slice-token](file:///d:/00%20PROGRAMANDO/guitarPizza--AntiGravity/stellar-game-studio/bindings/slice-token)
*   **Oven Collectibles (NFT) Bindings:** [stellar-game-studio/bindings/nft-collectibles](file:///d:/00%20PROGRAMANDO/guitarPizza--AntiGravity/stellar-game-studio/bindings/nft-collectibles)
*   **Guitar Pizza Bindings:** [stellar-game-studio/bindings/guitar_pizza](file:///d:/00%20PROGRAMANDO/guitarPizza--AntiGravity/stellar-game-studio/bindings/guitar_pizza)

### Instrucciones de Integración local:
1.  Navega al directorio del binding correspondiente. Por ejemplo:
    ```bash
    cd stellar-game-studio/bindings/slice-token
    ```
2.  Instala las dependencias y construye el compilado:
    ```bash
    npm install && npm run build
    ```
3.  Importa el cliente correspondiente en tu código de React:
    ```typescript
    import { Client } from './bindings/slice-token';
    ```

---

## 3. Credenciales y Permisos de Administración (Admin/Sponsor)

Para transacciones firmadas por servidor (Airdrops patrocinados, minteos automáticos sin firma directa de billetera Freighter, etc.):

*   **Dirección Pública (Admin/Sponsor PublicKey):**
    `GDTZDDVUPB2DHOJI665O5KWWDUIMCAP75CXDUSYMNHE6WHMHP57DMG7L`
*   **Clave Privada (Admin/Sponsor Secret Key):**
    `SBL476C4C7ZTSWUWWNPFNCFWEW2JIPPWJMZMTCI3QZFVSRQWSTQDVIFN`

### Restricciones Críticas de Minteo ($SLICE):
El contrato del **\$SLICE Token** tiene restringido el minteo libre. El rol de *Minter* exclusivo lo tiene el contrato del juego (`guitar-pizza`) para garantizar la integridad económica. 

Para realizar minteos administrativos o de faucet externos:
1.  Llamar temporalmente a la función `set_minter` apuntando a la dirección del administrador desde la clave secreta admin.
2.  Llamar a `mint` para depositar la cantidad deseada.
3.  Reestablecer inmediatamente el minter al contrato del juego (`guitar-pizza`) para resguardar la gobernanza.
*(Este flujo se encuentra completamente automatizado en el servicio backend del juego en `/api/drop-slice`).*
