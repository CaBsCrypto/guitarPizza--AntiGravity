# Documentación de Contratos Inteligentes Soroban - Slash Slice

Este documento resume los Contract IDs, la ubicación de los bindings de TypeScript y la configuración de administración necesaria para conectar los contratos de Stellar (Soroban) al frontend de **Slash Slice**.

---

## 1. Direcciones de Contrato (Contract IDs) en Testnet

| Contrato | Contract ID (Testnet) | Propósito / Descripción |
| :--- | :--- | :--- |
| **\$SLICE Token** | `CACFX6EO72DX2HC5JC7M66TDESTEQ6VOYZXKVKB6NOH52LIL4GQDRDIL` | Token principal de la economía del juego. Utilizado para faucet, PvP escrow y fees. |
| **Oven Collectibles (NFT)** | `CBC3AGOZTWKEII45VBRWLOGMBNGBJ6ABPP6MOFAZM2HFHP2NKPXXEWXB` | Coleccionable ERC-721 (888 supply límite) para los hornos pixel art y multipliers. |

---

## 2. Bindings de TypeScript Generados

Los bindings de TypeScript tipados para interactuar directamente con las funciones de los contratos desde el frontend React se encuentran en el directorio del proyecto:

* **\$SLICE Token Bindings:** [stellar-game-studio/bindings/slice-token](./stellar-game-studio/bindings/slice-token)
* **Oven Collectibles (NFT) Bindings:** [stellar-game-studio/bindings/nft-collectibles](./stellar-game-studio/bindings/nft-collectibles)

### Instrucciones de Integración:
1. Navega al directorio del binding:
   ```bash
   cd stellar-game-studio/bindings/slice-token
   ```
2. Instala las dependencias y compila el paquete npm local:
   ```bash
   npm install && npm run build
   ```
3. Importa el cliente generado en tu archivo de React para realizar llamadas tipadas:
   ```typescript
   import { Client } from './bindings/slice-token';
   ```

---

## 3. Credenciales de Administración y Roles (Admin / Sponsor)

Para realizar firmas del lado del servidor (Airdrops patrocinados, minteos automáticos sin firma de usuario, etc.):

* **Dirección Pública (Admin/Sponsor PublicKey):**
  `GDTZDDVUPB2DHOJI665O5KWWDUIMCAP75CXDUSYMNHE6WHMHP57DMG7L`
* **Clave Privada (Admin/Sponsor Secret Key):**
  `SBL476C4C7ZTSWUWWNPFNCFWEW2JIPPWJMZMTCI3QZFVSRQWSTQDVIFN`

### Nota de Permisos (Minter Exclusive):
El contrato de **\$SLICE Token** restringe el minteo libre. El rol de *Minter* está asignado al contrato de juego (`guitar-pizza`). 

Para mintear tokens de manera externa:
1. Cambia temporalmente el rol de minter al administrador llamando a `set_minter` en el contrato de \$SLICE (usando la clave privada de arriba).
2. Ejecuta el minteo (`mint`).
3. Reestablece el rol de minter al contrato del juego para asegurar la descentralización del gameplay.
*(Este flujo se encuentra completamente automatizado en la API de backend en `api/drop-slice.js`).*
