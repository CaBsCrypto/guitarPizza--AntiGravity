/**
 * Cliente de Integración con la API del Ecosistema SpicyCrust (v1)
 * Conecta el frontend de Rhythm Slice (Guitar Pizza) con la API central de SpicyCrust.
 */

const API_BASE_URL = import.meta.env.VITE_SPICY_API_URL || 'https://spicycrust-api.chiledao.cl';
const GAME_KEY = import.meta.env.VITE_SPICY_GAME_KEY || 'rhythm_slice_secret_key_2026';

export interface SubmitScoreParams {
  playerExternalId: string;
  nickname: string;
  score: number;
  metadata?: {
    combo?: number;
    accuracy?: number;
    songId?: string;
    difficulty?: string;
    [key: string]: any;
  };
}

export class SpicyCrustService {
  /**
   * Enviar puntaje de partida a la API central de SpicyCrust
   */
  static async submitScore(params: SubmitScoreParams) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/scores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Game-Key': GAME_KEY
        },
        body: JSON.stringify({
          game_slug: 'rhythm-slice',
          player_external_id: params.playerExternalId,
          nickname: params.nickname || 'Anónimo',
          score: Math.floor(params.score),
          metadata: params.metadata || {}
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Score enviado exitosamente a SpicyCrust API:', data);
      return data;
    } catch (error) {
      console.error('Error al conectar con SpicyCrust API:', error);
      return { success: false, error };
    }
  }

  /**
   * Obtener el Leaderboard de Rhythm Slice
   */
  static async getLeaderboard(limit = 50) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/leaderboard?game=rhythm-slice&limit=${limit}`);
      return await response.json();
    } catch (error) {
      console.error('Error al consultar Leaderboard de Rhythm Slice:', error);
      return { success: false, data: [] };
    }
  }

  /**
   * Obtener el Leaderboard Global del Ecosistema SpicyCrust
   */
  static async getGlobalLeaderboard() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/leaderboard/global`);
      return await response.json();
    } catch (error) {
      console.error('Error al consultar Leaderboard Global:', error);
      return { success: false, data: [] };
    }
  }
}
