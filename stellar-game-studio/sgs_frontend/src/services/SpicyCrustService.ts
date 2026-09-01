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
  email?: string;
  payload?: string;
  signature?: string;
  metadata?: {
    combo?: number;
    accuracy?: number;
    songId?: string;
    songTitle?: string;
    difficulty?: string;
    pizzas?: number;
    [key: string]: any;
  };
}

export interface LeaderboardEntry {
  rank: number;
  player_id: string;
  nickname: string;
  score: number;
  created_at?: string;
  metadata?: {
    accuracy?: number;
    combo?: number;
    songId?: string;
    song_id?: string;
    songTitle?: string;
    difficulty?: string;
    pizzas?: number;
    [key: string]: any;
  };
}

export class SpicyCrustService {
  private static isFlushing = false;

  /**
   * Inicializar listener de reconexión online para vaciar cola offline
   */
  static initOfflineQueueSync() {
    if (typeof window === 'undefined') return;
    window.addEventListener('online', () => {
      console.log('[SpicyCrustService] Conexión reestablecida. Sincronizando cola offline...');
      SpicyCrustService.flushPendingScores();
    });
    // Intentar sync al inicio
    SpicyCrustService.flushPendingScores();
  }

  /**
   * Enviar puntaje de partida a la API central de SpicyCrust con tolerancia offline
   */
  static async submitScore(params: SubmitScoreParams) {
    const cleanScore = Math.floor(params.score || 0);
    const cleanNick = (params.nickname || localStorage.getItem('gp_chef_name') || 'Chef Don').trim();
    const cleanEmail = params.email ? params.email.trim() : (localStorage.getItem('gp_player_email') || '');

    // Record local nickname & email
    if (cleanNick && typeof localStorage !== 'undefined') {
      localStorage.setItem('gp_chef_name', cleanNick);
    }
    if (cleanEmail && typeof localStorage !== 'undefined') {
      localStorage.setItem('gp_player_email', cleanEmail);
    }

    // No registrar ni guardar partidas con 0 puntos en el ranking
    if (cleanScore <= 0) {
      console.log('[SpicyCrustService] Partida con 0 pts — omitiendo guardado en el ranking.');
      return { success: true, message: 'Zero score skipped' };
    }

    const payloadBody = {
      game_slug: 'rhythm-slice',
      player_external_id: params.playerExternalId || 'anonymous_chef',
      playerAddress: params.playerExternalId || 'anonymous_chef',
      nickname: cleanNick,
      email: cleanEmail || undefined,
      score: cleanScore,
      payload: params.payload,
      signature: params.signature,
      metadata: {
        ...(params.metadata || {}),
        chain: typeof localStorage !== 'undefined' ? (localStorage.getItem('gp_active_chain') || 'avalanche') : 'avalanche',
        timestamp: Date.now()
      }
    };

    // Cache local inmediato del leaderboard y del historial
    try {
      if (typeof localStorage !== 'undefined') {
        // 1. Historial de partidas
        const localHistory = JSON.parse(localStorage.getItem('gp_local_scores') || '[]');
        localHistory.unshift({
          ...payloadBody,
          savedAt: new Date().toISOString()
        });
        localStorage.setItem('gp_local_scores', JSON.stringify(localHistory.slice(0, 30)));

        // 2. Actualizar Leaderboard local inmediatamente (manteniendo solo el mejor score por jugador)
        SpicyCrustService.updateCachedLeaderboard(payloadBody);
      }
    } catch (e) {
      console.warn('[SpicyCrustService] Error guardando score en caché local:', e);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/scores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Game-Key': GAME_KEY
        },
        body: JSON.stringify(payloadBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('[SpicyCrustService] Score enviado exitosamente a SpicyCrust API:', data);
      return data;
    } catch (error) {
      console.warn('[SpicyCrustService] No se pudo enviar el score a la API remota. Guardado en caché y cola offline:', error);
      // Guardar en cola pendiente para reintentar cuando haya red
      SpicyCrustService.enqueuePendingScore(payloadBody);
      return { success: true, offline: true, error };
    }
  }

  /**
   * Sanitizar lista del Leaderboard: filtrar 0 pts, deduplicar por chef y ordenar descendentemente
   */
  private static sanitizeLeaderboard(entries: LeaderboardEntry[]): LeaderboardEntry[] {
    const chefMap = new Map<string, LeaderboardEntry>();

    for (const item of entries) {
      if (!item || typeof item.score !== 'number' || item.score <= 0) continue;
      const key = (item.nickname || item.player_id || 'Chef Anon').trim().toLowerCase();
      const existing = chefMap.get(key);
      if (!existing || item.score > existing.score) {
        chefMap.set(key, { ...item });
      }
    }

    let uniqueList = Array.from(chefMap.values());

    if (uniqueList.length === 0) {
      uniqueList = [
        { rank: 1, player_id: 'player_mario_01', nickname: 'Mario Chef', score: 15400, metadata: { songId: '01_sauce', songTitle: 'Sauce', difficulty: 'Hard' } },
        { rank: 2, player_id: 'player_luigi_02', nickname: 'Luigi Slice', score: 12800, metadata: { songId: '02_rare_pizzas', songTitle: 'Rare Pizzas', difficulty: 'Medium' } }
      ];
    }

    uniqueList.sort((a, b) => b.score - a.score);
    uniqueList.forEach((item, idx) => {
      item.rank = idx + 1;
    });

    return uniqueList;
  }

  /**
   * Actualizar caché local de la tabla de líderes deduplicando por jugador y ordenando por puntaje
   */
  private static updateCachedLeaderboard(scorePayload: any) {
    if (typeof localStorage === 'undefined' || !scorePayload || scorePayload.score <= 0) return;
    try {
      let cached: LeaderboardEntry[] = [];
      try {
        cached = JSON.parse(localStorage.getItem('gp_cached_leaderboard') || '[]');
      } catch {
        cached = [];
      }

      cached.push({
        rank: 0,
        player_id: scorePayload.player_external_id,
        nickname: scorePayload.nickname,
        score: scorePayload.score,
        metadata: scorePayload.metadata,
        created_at: new Date().toISOString()
      });

      const sanitized = SpicyCrustService.sanitizeLeaderboard(cached);
      localStorage.setItem('gp_cached_leaderboard', JSON.stringify(sanitized.slice(0, 50)));
    } catch (e) {
      console.warn('[SpicyCrustService] Error actualizando caché del ranking:', e);
    }
  }

  /**
   * Encolar score pendiente en localStorage
   */
  private static enqueuePendingScore(scorePayload: any) {
    if (typeof localStorage === 'undefined' || !scorePayload || scorePayload.score <= 0) return;
    try {
      const queue = JSON.parse(localStorage.getItem('gp_pending_scores_queue') || '[]');
      queue.push(scorePayload);
      localStorage.setItem('gp_pending_scores_queue', JSON.stringify(queue.slice(-20)));
    } catch (e) {
      console.warn('[SpicyCrustService] Error encolando score offline:', e);
    }
  }

  /**
   * Vaciar cola de scores pendientes al recuperar conexión
   */
  static async flushPendingScores() {
    if (this.isFlushing || typeof localStorage === 'undefined') return;
    try {
      const queueRaw = localStorage.getItem('gp_pending_scores_queue');
      if (!queueRaw) return;
      const queue = JSON.parse(queueRaw);
      if (!Array.isArray(queue) || queue.length === 0) return;

      this.isFlushing = true;
      console.log(`[SpicyCrustService] Reenviando ${queue.length} scores de la cola offline...`);

      const remaining: any[] = [];
      for (const item of queue) {
        if (!item || item.score <= 0) continue;
        try {
          const res = await fetch(`${API_BASE_URL}/api/v1/scores`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Game-Key': GAME_KEY
            },
            body: JSON.stringify(item)
          });
          if (!res.ok) remaining.push(item);
        } catch {
          remaining.push(item);
        }
      }

      if (remaining.length === 0) {
        localStorage.removeItem('gp_pending_scores_queue');
        console.log('[SpicyCrustService] Cola offline vaciada con éxito.');
      } else {
        localStorage.setItem('gp_pending_scores_queue', JSON.stringify(remaining));
      }
    } catch (e) {
      console.warn('[SpicyCrustService] Error procesando cola offline:', e);
    } finally {
      this.isFlushing = false;
    }
  }

  /**
   * Obtener el Leaderboard de Rhythm Slice con soporte de filtros
   */
  static async getLeaderboard(options: { limit?: number; songFilter?: string; unique?: boolean } = {}) {
    const limit = options.limit || 50;
    const unique = options.unique !== false;
    const songParam = options.songFilter && options.songFilter !== 'all' ? `&song=${encodeURIComponent(options.songFilter)}` : '';

    try {
      const url = `${API_BASE_URL}/api/v1/leaderboard?game=rhythm-slice&limit=${limit}&unique=${unique}${songParam}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      if (data && data.success && Array.isArray(data.data?.ranking)) {
        const sanitized = SpicyCrustService.sanitizeLeaderboard(data.data.ranking);
        if (typeof localStorage !== 'undefined' && (!options.songFilter || options.songFilter === 'all')) {
          localStorage.setItem('gp_cached_leaderboard', JSON.stringify(sanitized));
        }
        data.data.ranking = sanitized;
        return data;
      }
      return data;
    } catch (error) {
      console.warn('[SpicyCrustService] Servidor remoto no disponible o offline, sirviendo ranking local sanitizado:', error);
      let cachedRanking: LeaderboardEntry[] = [];
      if (typeof localStorage !== 'undefined') {
        try {
          cachedRanking = JSON.parse(localStorage.getItem('gp_cached_leaderboard') || '[]');
        } catch {
          cachedRanking = [];
        }
      }

      // Sanitizar caché (eliminar 0 pts, duplicados y ordenar)
      cachedRanking = SpicyCrustService.sanitizeLeaderboard(cachedRanking);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('gp_cached_leaderboard', JSON.stringify(cachedRanking));
      }

      // Filtrar por canción si se seleccionó una específica
      if (options.songFilter && options.songFilter !== 'all') {
        const filterVal = options.songFilter.toLowerCase();
        const rawFilter = options.songFilter;
        cachedRanking = cachedRanking.filter(entry => 
          entry.metadata?.songId === rawFilter ||
          entry.metadata?.song_id === rawFilter ||
          (entry.metadata?.songTitle && entry.metadata.songTitle.toLowerCase().includes(filterVal))
        );
        cachedRanking.forEach((entry, i) => { entry.rank = i + 1; });
      }

      return {
        success: true,
        offline: true,
        data: {
          game: { slug: 'rhythm-slice' },
          season: { slug: 'season-01' },
          ranking: cachedRanking.slice(0, limit),
          total: cachedRanking.length
        }
      };
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

// Iniciar listener offline automáticamente en cliente
if (typeof window !== 'undefined') {
  SpicyCrustService.initOfflineQueueSync();
}
