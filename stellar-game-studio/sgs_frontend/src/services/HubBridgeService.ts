/**
 * HubBridgeService.ts
 * Integración de protocolo de sincronización Iframe (Hub <-> Rhythm Slice) y manejo de Wallet Avalanche/EVM.
 */

export interface SignedScoreResult {
  payload: string;
  signature: string;
}

export class HubBridgeService {
  private static playerWallet: string | null = null;
  private static isInitialized = false;

  /**
   * Obtiene la wallet activa desde cookie en caso de modo Standalone (.spicycrust.com)
   */
  static getActiveWalletFromCookie(): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(?:^|; )+(?:avalanche_wallet|evm_wallet)=([^;]+)'));
    if (match && /^0x[a-fA-F0-9]{40}$/.test(match[1])) {
      return match[1];
    }
    return null;
  }

  /**
   * Obtiene la dirección actual del jugador registrada por el Hub o por Cookie
   */
  static getPlayerWallet(): string | null {
    return this.playerWallet || this.getActiveWalletFromCookie();
  }

  /**
   * Inicializa la escucha de mensajes desde el Hub contenedor (Iframe)
   */
  static initHubListener(onWalletSync?: (address: string) => void) {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    // Intentar inicializar con la cookie disponible de inmediato
    const cookieWallet = this.getActiveWalletFromCookie();
    if (cookieWallet) {
      this.playerWallet = cookieWallet;
      if (onWalletSync) onWalletSync(cookieWallet);
    }

    window.addEventListener('message', (event: MessageEvent) => {
      const { type, address } = event.data || {};

      if (type === 'HUB_WALLET_SYNC' && address) {
        console.log('🎮 [HubBridgeService] Wallet sincronizada desde Hub:', address);
        this.playerWallet = address;
        if (onWalletSync) {
          onWalletSync(address);
        }
      }
    });
  }

  /**
   * Solicita al Hub abrir el diálogo de inicio de sesión con Privy
   */
  static requestLoginFromHub() {
    if (typeof window !== 'undefined' && window.parent) {
      console.log('📡 [HubBridgeService] Enviando GAME_LOGIN_REQUEST al Hub...');
      window.parent.postMessage({ type: 'GAME_LOGIN_REQUEST' }, '*');
    }
  }

  /**
   * Solicita al Hub la firma off-chain ($0 Gas) para enviar el puntaje verificado
   */
  static requestScoreSignature(score: number, gameId = 'rhythm-slice'): Promise<SignedScoreResult> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.parent) {
        return reject(new Error('Entorno no compatible con Iframe Hub'));
      }

      const currentWallet = this.getPlayerWallet() || '0x0000000000000000000000000000000000000000';
      const nonce = Date.now();
      const payload = `SpicyCrust Score:\nPlayer: ${currentWallet}\nScore: ${score}\nGame: ${gameId}\nNonce: ${nonce}`;

      const timeoutId = setTimeout(() => {
        window.removeEventListener('message', handleResponse);
        reject(new Error('Tiempo de espera agotado al solicitar firma al Hub'));
      }, 15000);

      const handleResponse = (event: MessageEvent) => {
        if (event.data?.type === 'HUB_SIGN_RESPONSE') {
          clearTimeout(timeoutId);
          window.removeEventListener('message', handleResponse);
          if (event.data.signature) {
            resolve({
              payload,
              signature: event.data.signature
            });
          } else {
            reject(new Error(event.data.error || 'Firma rechazada por el usuario en el Hub'));
          }
        }
      };

      window.addEventListener('message', handleResponse);
      window.parent.postMessage({ type: 'GAME_SIGN_REQUEST', payload }, '*');
    });
  }
}
