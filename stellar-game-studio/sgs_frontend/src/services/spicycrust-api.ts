/**
 * Módulo de API de integración oficial SpicyCrust × Rhythm Slice
 * Conexión central con https://spicycrust-api.alphadocere.cl/api/v1
 */

const API_BASE = 'https://spicycrust-api.alphadocere.cl/api/v1';
const GAME_KEY = 'd2682766624499c657444e5ce68bd275ee5a8267a0cff2148656054e01c71099';
const GAME_SLUG = 'rhythm-slice';

let _seasonSlug: string | null = null;

export interface SubmitScoreOptions {
  nickname: string;
  email?: string;
  score: number;
  metadata?: Record<string, any>;
  playerExternalId?: string;
}

export interface LeaderboardItem {
  rank: number;
  player_id?: string | number;
  nickname: string;
  email?: string;
  score: number;
  score_id?: string;
  created_at?: string;
  metadata?: Record<string, any>;
}

export async function getActiveSeason(): Promise<string> {
  if (_seasonSlug) return _seasonSlug;
  try {
    const res = await fetch(`${API_BASE}/seasons?status=active`, { signal: AbortSignal.timeout(4000) });
    const json = await res.json();
    const season = Array.isArray(json) 
      ? json[0] 
      : (Array.isArray(json?.data) ? json.data[0] : (json?.data ?? json));
    if (season?.slug) {
      _seasonSlug = String(season.slug);
      return _seasonSlug;
    }
  } catch (e: any) {
    console.warn('[SpicyCrust] Season fallback:', e?.message || e);
  }
  return 'season-01';
}

export async function submitScore({
  nickname,
  email = '',
  score,
  metadata = {},
  playerExternalId
}: SubmitScoreOptions) {
  const seasonSlug = await getActiveSeason();

  // Resolve persistent external ID if not provided
  let externalId = playerExternalId;
  if (!externalId && typeof localStorage !== 'undefined') {
    externalId = localStorage.getItem('gp_player_external_id') || undefined;
    if (!externalId) {
      externalId = 'player-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now();
      localStorage.setItem('gp_player_external_id', externalId);
    }
  }
  if (!externalId) {
    externalId = 'player-' + Date.now();
  }

  const payload: Record<string, any> = {
    game_slug: GAME_SLUG,
    season_slug: seasonSlug,
    player_external_id: externalId,
    nickname: nickname.trim(),
    score: Math.floor(score || 0),
    metadata
  };

  const trimmedEmail = (email || '').trim();
  if (trimmedEmail) {
    payload.email = trimmedEmail;
  }

  const res = await fetch(`${API_BASE}/scores`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Game-Key': GAME_KEY
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8000)
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    let errJson: any;
    try { errJson = JSON.parse(errText); } catch {}
    const msg = errJson?.error?.message || errJson?.message || (typeof errJson?.error === 'string' ? errJson.error : null) || `HTTP ${res.status}: ${res.statusText}`;
    throw new Error(msg);
  }

  return await res.json();
}

export async function getLeaderboard(limit = 10, songFilter?: string): Promise<LeaderboardItem[]> {
  try {
    const seasonSlug = await getActiveSeason();
    let url = `${API_BASE}/leaderboard?game=${GAME_SLUG}&season=${seasonSlug}&limit=${limit}`;
    if (songFilter && songFilter !== 'all') {
      url += `&song=${encodeURIComponent(songFilter)}`;
    }

    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    const json = await res.json();

    // Soporte tanto para data.ranking (formato real de la API) como data.leaderboard
    const list = json?.data?.ranking ?? json?.data?.leaderboard ?? (Array.isArray(json?.data) ? json.data : []);
    return list;
  } catch (e: any) {
    console.warn('[SpicyCrust] Leaderboard fallback:', e?.message || e);
    return [];
  }
}
