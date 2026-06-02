export interface ClashChallenge {
  id: string;
  creator: string;
  songIndex: number;
  songTitle: string;
  difficulty: 'easy' | 'normal' | 'hard';
  wager: number;
  status: 'waiting' | 'accepted' | 'playing';
}

class GlobalLobbyService {
  private socket: WebSocket | null = null;
  private selectedBroker: string = 'ntfy.adminforge.de';
  private challengeListeners: ((challenges: ClashChallenge[]) => void)[] = [];
  private activeChallenges: Map<string, { challenge: ClashChallenge; lastSeen: number }> = new Map();
  private userAddress: string = '';
  private myChallenge: ClashChallenge | null = null;
  private onChallengeAcceptedCallback: ((challenge: ClashChallenge) => void) | null = null;
  private onShortcodeResolvedCallback: ((shortcode: string, pubkey: string) => void) | null = null;
  private queryInterval: any = null;
  private heartbeatInterval: any = null;
  private cleanInterval: any = null;

  public connect(userAddress: string): void {
    if (this.socket) return;
    this.userAddress = userAddress;

    const wsUrl = `wss://${this.selectedBroker}/guitarslice-global-lobby/ws`;
    console.log(`[GlobalLobby] Connecting to global lobby at: ${wsUrl}`);

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log(`[GlobalLobby] Connected to global lobby successfully!`);
        this.queryChallenges();
      };

      this.socket.onmessage = (event) => {
        try {
          const rawData = JSON.parse(event.data);
          if (rawData && rawData.event === 'message' && rawData.message) {
            const data = JSON.parse(rawData.message);
            this.handleLobbyMessage(data);
          }
        } catch (e) {
          // Ignore parse errors
        }
      };

      this.socket.onclose = () => {
        this.cleanup();
        setTimeout(() => this.connect(userAddress), 5000);
      };

      // Query active challenges periodically
      this.queryInterval = setInterval(() => this.queryChallenges(), 6000);
      
      // Heartbeat for our own challenge
      this.heartbeatInterval = setInterval(() => {
        if (this.myChallenge && this.myChallenge.status === 'waiting') {
          this.announceChallenge(this.myChallenge);
        }
      }, 3000);

      // Clean dead challenges (not seen in >8 seconds)
      this.cleanInterval = setInterval(() => {
        const now = Date.now();
        let changed = false;
        for (const [id, entry] of this.activeChallenges.entries()) {
          if (now - entry.lastSeen > 8000) {
            this.activeChallenges.delete(id);
            changed = true;
          }
        }
        if (changed) {
          this.notifyListeners();
        }
      }, 4000);

    } catch (err) {
      console.error('[GlobalLobby] Socket error:', err);
    }
  }

  private handleLobbyMessage(data: any): void {
    if (!data || typeof data !== 'object') return;

    if (data.type === 'query_challenges') {
      if (this.myChallenge && this.myChallenge.status === 'waiting') {
        this.announceChallenge(this.myChallenge);
      }
    } else if (data.type === 'challenge_announcement') {
      const ch: ClashChallenge = data.challenge;
      if (ch && ch.id) {
        if (ch.creator === this.userAddress) return;
        this.activeChallenges.set(ch.id, { challenge: ch, lastSeen: Date.now() });
        this.notifyListeners();
      }
    } else if (data.type === 'accept_challenge') {
      const challengeId = data.challengeId;
      const opponent = data.opponent;
      if (this.myChallenge && this.myChallenge.id === challengeId) {
        console.log(`[GlobalLobby] Challenge accepted by: ${opponent}`);
        this.myChallenge.status = 'accepted';
        if (this.onChallengeAcceptedCallback) {
          this.onChallengeAcceptedCallback({ ...this.myChallenge, status: 'accepted' });
        }
      }
    } else if (data.type === 'remove_challenge') {
      const challengeId = data.challengeId;
      if (this.activeChallenges.has(challengeId)) {
        this.activeChallenges.delete(challengeId);
        this.notifyListeners();
      }
    } else if (data.type === 'resolve_shortcode') {
      if (this.userAddress && this.userAddress.length >= 7) {
        const myShortCode = this.userAddress.substring(1, 7).toUpperCase();
        if (data.shortcode === myShortCode) {
          // It's me! Respond with my pubkey
          this.publish({ type: 'shortcode_resolved', shortcode: myShortCode, pubkey: this.userAddress });
        }
      }
    } else if (data.type === 'shortcode_resolved') {
      if (this.onShortcodeResolvedCallback && data.shortcode && data.pubkey) {
        this.onShortcodeResolvedCallback(data.shortcode, data.pubkey);
      }
    }
  }

  public queryChallenges(): void {
    this.publish({ type: 'query_challenges', sender: this.userAddress });
  }

  public resolveShortcode(shortcode: string): void {
    this.publish({ type: 'resolve_shortcode', shortcode });
  }

  public postChallenge(songIndex: number, songTitle: string, difficulty: 'easy' | 'normal' | 'hard', wager: number): ClashChallenge {
    const id = Math.random().toString(36).substring(2, 9).toUpperCase();
    const newChallenge: ClashChallenge = {
      id,
      creator: this.userAddress,
      songIndex,
      songTitle,
      difficulty,
      wager,
      status: 'waiting'
    };

    this.myChallenge = newChallenge;
    console.log(`[GlobalLobby] Posted custom challenge:`, newChallenge);
    this.announceChallenge(newChallenge);
    return newChallenge;
  }

  public cancelMyChallenge(): void {
    if (this.myChallenge) {
      console.log(`[GlobalLobby] Cancelling my challenge: ${this.myChallenge.id}`);
      this.publish({ type: 'remove_challenge', challengeId: this.myChallenge.id });
      this.myChallenge = null;
    }
  }

  public acceptChallenge(challenge: ClashChallenge): void {
    console.log(`[GlobalLobby] Accepting challenge: ${challenge.id} from creator: ${challenge.creator}`);
    this.publish({
      type: 'accept_challenge',
      challengeId: challenge.id,
      opponent: this.userAddress
    });
  }

  private announceChallenge(ch: ClashChallenge): void {
    this.publish({
      type: 'challenge_announcement',
      challenge: ch
    });
  }

  private publish(msg: any): void {
    const postUrl = `https://${this.selectedBroker}/guitarslice-global-lobby`;
    fetch(postUrl, {
      method: 'POST',
      body: JSON.stringify(msg),
      headers: {
        'Content-Type': 'text/plain'
      }
    }).catch(err => {
      console.warn('[GlobalLobby] Publish failed:', err);
    });
  }

  public onChallengesChange(callback: (challenges: ClashChallenge[]) => void): () => void {
    this.challengeListeners.push(callback);
    callback(Array.from(this.activeChallenges.values()).map(e => e.challenge));
    return () => {
      this.challengeListeners = this.challengeListeners.filter(l => l !== callback);
    };
  }

  public onChallengeAccepted(callback: (challenge: ClashChallenge) => void): void {
    this.onChallengeAcceptedCallback = callback;
  }

  public onShortcodeResolved(callback: (shortcode: string, pubkey: string) => void): void {
    this.onShortcodeResolvedCallback = callback;
  }

  private notifyListeners(): void {
    const list = Array.from(this.activeChallenges.values()).map(e => e.challenge);
    this.challengeListeners.forEach(listener => listener(list));
  }

  private cleanup(): void {
    if (this.queryInterval) clearInterval(this.queryInterval);
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    if (this.cleanInterval) clearInterval(this.cleanInterval);
    this.socket = null;
  }

  public disconnect(): void {
    this.cleanup();
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export const globalLobbyService = new GlobalLobbyService();
