export interface RivalNotePayload {
  score: number;
  combo: number;
  hitType: 'perfect' | 'great' | 'miss';
  isFever: boolean;
}

export interface MatchFoundPayload {
  matchId: number;
  opponentAddress: string;
  wager: number;
  roomCode?: string;
}

export interface MatchResolvedPayload {
  matchId: number;
  playerAScore: number;
  playerBScore: number;
  winnerAddress: string;
}

export type MultiplayerEventCallback = {
  onMatchFound?: (payload: MatchFoundPayload) => void;
  onStartGame?: (matchId: number, startTime?: number) => void;
  onRivalNote?: (payload: RivalNotePayload) => void;
  onMatchResolved?: (payload: MatchResolvedPayload) => void;
  onRivalDisconnected?: (reason: string) => void;
  onRoomCreated?: (roomCode: string, wager: number) => void;
  onError?: (error: string) => void;
};

class MultiplayerService {
  private socket: WebSocket | null = null;
  private callbacks: MultiplayerEventCallback = {};
  private reconnectInterval: any = null;
  private url: string = '';

  constructor() {
    // Default to port 8080 or window location
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // If running in development, connect to local port 8080. 
    // In production, fallback dynamically to the same host window.location.host (or fallback VPS/Render URL)
    const host = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? '127.0.0.1:8080'
      : window.location.host; // fallback dynamically to the active spicycrust.com domain
    this.url = `${protocol}//${host}`;
  }

  connect(customUrl?: string, callbacks?: MultiplayerEventCallback) {
    if (customUrl) {
      this.url = customUrl;
    }
    if (callbacks) {
      this.callbacks = { ...this.callbacks, ...callbacks };
    }

    // Prevent duplicate connections or leaks
    if (this.socket) {
      console.log('[MultiplayerService] Cleaning up active websocket before reconnecting...');
      try {
        this.socket.onopen = null;
        this.socket.onmessage = null;
        this.socket.onerror = null;
        this.socket.onclose = null;
        this.socket.close();
      } catch (e) {}
      this.socket = null;
    }

    console.log(`[MultiplayerService] Connecting to ${this.url}...`);
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log('[MultiplayerService] WebSocket Connected.');
      if (this.reconnectInterval) {
        clearInterval(this.reconnectInterval);
        this.reconnectInterval = null;
      }
    };

    this.socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        console.log(`[MultiplayerService] Event received: ${msg.event}`, msg.payload);
        
        switch (msg.event) {
          case 'match_found':
            this.callbacks.onMatchFound?.(msg.payload);
            break;
          case 'start_game':
            this.callbacks.onStartGame?.(msg.payload.matchId, msg.payload.startTime);
            break;
          case 'rival_note':
            this.callbacks.onRivalNote?.(msg.payload);
            break;
          case 'match_resolved':
            this.callbacks.onMatchResolved?.(msg.payload);
            break;
          case 'rival_disconnected':
            this.callbacks.onRivalDisconnected?.(msg.payload);
            break;
          case 'room_created':
            this.callbacks.onRoomCreated?.(msg.payload.roomCode, msg.payload.wager);
            break;
          case 'error':
            this.callbacks.onError?.(msg.payload);
            break;
        }
      } catch (e) {
        console.error('[MultiplayerService] Failed to parse socket message:', e);
      }
    };

    this.socket.onclose = () => {
      console.warn('[MultiplayerService] WebSocket Closed. Attempting reconnect in 5s...');
      if (!this.reconnectInterval) {
        this.reconnectInterval = setInterval(() => this.connect(), 5000);
      }
    };

    this.socket.onerror = (err) => {
      console.error('[MultiplayerService] WebSocket Error:', err);
    };
  }

  disconnect() {
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      this.reconnectInterval = null;
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  registerCallbacks(callbacks: MultiplayerEventCallback) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  // Send Actions
  joinQueue(playerAddress: string, wager: number) {
    this.send('join_queue', { playerAddress, wager });
  }

  leaveQueue() {
    this.send('leave_queue', {});
  }

  createRoom(playerAddress: string, wager: number) {
    this.send('create_room', { playerAddress, wager });
  }

  joinRoom(playerAddress: string, roomCode: string) {
    this.send('join_room', { playerAddress, roomCode });
  }

  lockWager(matchId: number) {
    this.send('wager_locked', { matchId });
  }

  syncNote(matchId: number, score: number, combo: number, hitType: 'perfect' | 'great' | 'miss', isFever: boolean) {
    this.send('sync_note', { matchId, score, combo, hitType, isFever });
  }

  gameOver(matchId: number, score: number) {
    this.send('game_over', { matchId, score });
  }

  private send(event: string, payload: any) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('[MultiplayerService] Socket is not open.');
      return;
    }
    this.socket.send(JSON.stringify({ event, payload }));
  }
}

export const multiplayerService = new MultiplayerService();
