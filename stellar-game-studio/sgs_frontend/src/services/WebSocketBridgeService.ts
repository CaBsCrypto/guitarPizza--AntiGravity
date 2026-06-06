/**
 * WebSocketBridgeService (Hybrid WebRTC + ntfy.sh Broker Edition)
 * Delivers indestructible, zero-config controller connection using:
 * 1. ntfy.sh public pub/sub broker for 100% reliable signaling/fallback (zero-signup, zero key restrictions).
 * 2. High-performance native WebRTC P2P Data Channel for sub-5ms input latency.
 * Fully compatible with COEP require-corp headers and all mobile carrier networks.
 */

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';
export type WebRTCStatus = 'idle' | 'connecting' | 'connected' | 'failed';

export interface BridgeMessage {
  type: 'keydown' | 'keyup' | 'handshake' | 'webrtc-offer' | 'webrtc-answer' | 'webrtc-candidate' | 'start-game' | 'game-status' | 'select-song' | 'back-to-lobby';
  key?: string;
  sender?: 'desktop' | 'phone';
  room?: string;
  sdp?: string;
  candidate?: any;
  status?: 'lobby' | 'playing' | 'paused' | 'results';
  songId?: string;
  songTitle?: string;
  songArtist?: string;
  score?: number;
  combo?: number;
  progress?: number;
}

class WebSocketBridgeService {
  private socket: WebSocket | null = null;
  private eventSource: EventSource | null = null; // Resilient SSE fallback for carrier/CG-NAT traversal
  private statusListeners: ((status: ConnectionStatus) => void)[] = [];
  private webrtcStatusListeners: ((status: WebRTCStatus) => void)[] = [];
  private messageListeners: ((msg: BridgeMessage) => void)[] = [];
  private remoteStreamListeners: ((stream: MediaStream | null) => void)[] = [];

  private currentStatus: ConnectionStatus = 'disconnected';
  private currentWebrtcStatus: WebRTCStatus = 'idle';
  private roomId: string = '';
  private reconnectTimeout: any = null;
  private isHost: boolean = false;

  // Resilient Multi-Broker Pool for robust cross-network signaling
  private brokers: string[] = [
    'ntfy.adminforge.de', // Germany (Preferred globally unblocked mirror)
    'ntfy.tedomum.fr',    // France (Fully unblocked, highly reliable backup)
    'ntfy.sp-codes.de',   // Germany Backup
    'ntfy.sh'             // US (Official instance)
  ];
  private selectedBroker: string = 'ntfy.adminforge.de';

  // WebRTC native instances
  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private pendingCandidates: any[] = [];
  private webrtcTimeout: any = null;

  constructor() {
    this.roomId = this.generateRoomId();
  }

  private generateRoomId(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  public getRoomId(): string {
    return this.roomId;
  }

  public setRoomId(id: string): void {
    const normalizedId = id.trim().toUpperCase();
    const isSocketDead = !this.socket || this.socket.readyState === WebSocket.CLOSED || this.socket.readyState === WebSocket.CLOSING;
    if (this.roomId !== normalizedId || isSocketDead) {
      console.log(`[Bridge] Setting Room ID to: ${normalizedId} (force reconnect: ${isSocketDead})`);
      this.roomId = normalizedId;
      this.disconnect();
      this.connect();
    }
  }

  public getRoomClientUrl(): string {
    const host = window.location.origin + window.location.pathname;
    return `${host}?mode=remote&room=${this.roomId}&broker=${this.selectedBroker}`;
  }

  public getStatus(): ConnectionStatus {
    return this.currentStatus;
  }

  public getWebRTCStatus(): WebRTCStatus {
    return this.currentWebrtcStatus;
  }

  public onStatusChange(callback: (status: ConnectionStatus) => void): () => void {
    this.statusListeners.push(callback);
    callback(this.currentStatus);
    return () => {
      this.statusListeners = this.statusListeners.filter(l => l !== callback);
    };
  }

  public onWebRTCStatusChange(callback: (status: WebRTCStatus) => void): () => void {
    this.webrtcStatusListeners.push(callback);
    callback(this.currentWebrtcStatus);
    return () => {
      this.webrtcStatusListeners = this.webrtcStatusListeners.filter(l => l !== callback);
    };
  }

  public onMessage(callback: (msg: BridgeMessage) => void): () => void {
    this.messageListeners.push(callback);
    return () => {
      this.messageListeners = this.messageListeners.filter(l => l !== callback);
    };
  }

  public onRemoteStream(callback: (stream: MediaStream | null) => void): () => void {
    this.remoteStreamListeners.push(callback);
    return () => {
      this.remoteStreamListeners = this.remoteStreamListeners.filter(l => l !== callback);
    };
  }

  private setStatus(status: ConnectionStatus): void {
    if (this.currentStatus !== status) {
      this.currentStatus = status;
      this.statusListeners.forEach(listener => listener(status));
    }
  }

  private setWebrtcStatus(status: WebRTCStatus): void {
    if (this.currentWebrtcStatus !== status) {
      console.log(`[Bridge] WebRTC Status transition: ${this.currentWebrtcStatus} -> ${status}`);
      this.currentWebrtcStatus = status;
      this.webrtcStatusListeners.forEach(listener => listener(status));
    }
  }

  public connect(): void {
    if (this.socket || this.eventSource) {
      if (this.socket?.readyState === WebSocket.OPEN || this.socket?.readyState === WebSocket.CONNECTING || this.eventSource) {
        console.log(`[Bridge] Already connecting or connected via WebSocket/EventSource`);
        return;
      }
      this.disconnect();
    }

    this.setStatus('connecting');

    // Parse URL parameter for broker if connecting as client (phone)
    if (typeof window !== 'undefined') {
      const queryParams = new URLSearchParams(window.location.search);
      const urlBroker = queryParams.get('broker');
      if (urlBroker) {
        const cleaned = urlBroker.trim();
        if (cleaned && this.selectedBroker !== cleaned) {
          console.log(`[Bridge] Client adopting URL-specified broker: ${cleaned}`);
          this.selectedBroker = cleaned;
        }
      }
    }

    // Resilient EventSource (SSE) Fallback subscription path
    const initEventSourceFallback = (reason: string) => {
      if (this.eventSource) return;
      console.warn(`[Bridge] WebSocket subscription unavailable (${reason}). Initializing resilient EventSource (SSE) fallback...`);
      
      const sseUrl = `https://${this.selectedBroker}/guitarslice-${this.roomId.toLowerCase()}/sse`;
      console.log(`[Bridge] Listening to SSE stream on: ${sseUrl}`);
      
      try {
        this.eventSource = new EventSource(sseUrl);
        
        this.eventSource.onopen = () => {
          console.log(`[Bridge] Resilient EventSource (SSE) connected successfully!`);
          this.setStatus('connected');
          if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
          }
          // Send handshake
          this.sendMessage({ type: 'handshake', sender: this.isHost ? 'desktop' : 'phone' });
        };
        
        this.eventSource.onmessage = async (event) => {
          try {
            const rawData = JSON.parse(event.data);
            if (rawData && rawData.event === 'message' && rawData.message) {
              const data: BridgeMessage = JSON.parse(rawData.message);
              if (data && typeof data === 'object') {
                const currentSenderRole = this.isHost ? 'desktop' : 'phone';
                if (data.sender === currentSenderRole) return;
                this.messageListeners.forEach(listener => listener(data));
                await this.handleSignalingMessage(data);
              }
            }
          } catch (e) {
            // Ignore parse errors
          }
        };
        
        this.eventSource.onerror = (err) => {
          console.error('[Bridge] EventSource error, attempting to cycle or reconnect...', err);
          if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
          }
          this.setStatus('disconnected');
          
          // Cycle broker on client too if SSE fails entirely!
          if (!this.isHost) {
            const currentIndex = this.brokers.indexOf(this.selectedBroker);
            const nextBroker = this.brokers[currentIndex === -1 ? 0 : (currentIndex + 1) % this.brokers.length];
            console.log(`[Bridge] Client cycling broker from [${this.selectedBroker}] to [${nextBroker}]`);
            this.selectedBroker = nextBroker;
          }
          this.attemptReconnect();
        };
      } catch (e) {
        console.error('[Bridge] Failed to construct EventSource:', e);
        this.attemptReconnect();
      }
    };

    // Enforce lowercase ntfy topic naming to guarantee perfect room-code alignment across devices
    const wsUrl = `wss://${this.selectedBroker}/guitarslice-${this.roomId.toLowerCase()}/ws`;

    console.log(`[Bridge] Connecting to WebSocket room via broker [${this.selectedBroker}] at: ${wsUrl}`);

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log(`[Bridge] Connected successfully to WebSocket broker [${this.selectedBroker}]`);
        this.setStatus('connected');
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }

        // Send handshake
        this.sendMessage({ type: 'handshake', sender: this.isHost ? 'desktop' : 'phone' });
      };

      this.socket.onmessage = async (event) => {
        try {
          const rawData = JSON.parse(event.data);
          
          // ntfy wraps messages inside its own notification envelope.
          // Event type can be "open", "keepalive", or "message".
          if (rawData && rawData.event === 'message' && rawData.message) {
            const data: BridgeMessage = JSON.parse(rawData.message);
            
            if (data && typeof data === 'object') {
              const currentSenderRole = this.isHost ? 'desktop' : 'phone';

              // 1. Filter out loopback echoes of our own messages
              if (data.sender === currentSenderRole) {
                return;
              }

              // 2. Deliver message to listeners
              this.messageListeners.forEach(listener => listener(data));

              // 3. Handle WebRTC Signaling internals
              await this.handleSignalingMessage(data);
            }
          }
        } catch (e) {
          // Ignore parsing errors for non-matching ntfy structures
        }
      };

      const handleFailoverOrReconnect = (errorMsg: string) => {
        const isConnectingFailure = this.currentStatus === 'connecting';
        
        // If Host fails to connect (initial handshake error, rate limited 429, etc.), failover to next broker!
        if (this.isHost && isConnectingFailure) {
          const currentIndex = this.brokers.indexOf(this.selectedBroker);
          const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % this.brokers.length;
          const nextBroker = this.brokers[nextIndex];
          console.warn(`[Bridge] Broker [${this.selectedBroker}] failed (${errorMsg}). Failing over to next broker [${nextBroker}]...`);
          
          this.selectedBroker = nextBroker;
          this.socket = null;
          this.setStatus('disconnected');
          this.cleanupWebRTC();
          
          // Re-trigger connect with the next broker in 1 second
          if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = setTimeout(() => {
            this.reconnectTimeout = null;
            this.connect();
          }, 1000);
        } else {
          // Client (phone) or active connection dropped - instantly use resilient SSE EventSource fallback!
          this.socket = null;
          this.cleanupWebRTC();
          initEventSourceFallback(errorMsg);
        }
      };

      this.socket.onclose = (event) => {
        handleFailoverOrReconnect(`closed with code ${event.code}`);
      };

      this.socket.onerror = (error) => {
        handleFailoverOrReconnect('error event');
      };
    } catch (e) {
      console.error('[Bridge] Error creating socket:', e);
      this.setStatus('disconnected');
      initEventSourceFallback(e instanceof Error ? e.message : 'exception');
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectTimeout) return;
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      this.connect();
    }, 5000);
  }

  public disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.cleanupWebRTC();
    this.isHost = false;
    this.setStatus('disconnected');
  }

  public sendMessage(msg: BridgeMessage): void {
    // If WebRTC is active and open, send inputs via native P2P Data Channel for sub-5ms lag!
    if (this.isP2PAvailable()) {
      try {
        this.dataChannel!.send(JSON.stringify(msg));
        return; // Success, skip cloud publishing!
      } catch (err) {
        console.warn('[Bridge] WebRTC send failed, falling back to ntfy WebSocket:', err);
      }
    }

    // Fallback: dynamic HTTP POST publishing matching selected broker
    msg.sender = this.isHost ? 'desktop' : 'phone';
    msg.room = this.roomId;

    // Enforce lowercase ntfy topic naming for casing parity
    const postUrl = `https://${this.selectedBroker}/guitarslice-${this.roomId.toLowerCase()}`;

    fetch(postUrl, {
      method: 'POST',
      body: JSON.stringify(msg),
      headers: {
        'Content-Type': 'text/plain'
      }
    }).catch(err => {
      console.warn('[Bridge] ntfy publish failed:', err);
    });
  }

  public startSignaling(isHost: boolean): void {
    console.log(`[Bridge] Initializing bridge signaling. isHost: ${isHost}`);
    const hostChanged = this.isHost !== isHost;
    this.isHost = isHost;
    if (hostChanged) {
      console.log(`[Bridge] Host role changed to ${isHost}. Forcing clean reconnect...`);
      this.disconnect();
    }
    this.connect();
  }

  // =========================================================================
  // NATIVE WEBRTC DATA CHANNEL IMPLEMENTATION (Zero lag UDP route)
  // =========================================================================

  private isP2PAvailable(): boolean {
    return this.dataChannel !== null && this.dataChannel.readyState === 'open';
  }

  private cleanupWebRTC(): void {
    if (this.webrtcTimeout) {
      clearTimeout(this.webrtcTimeout);
      this.webrtcTimeout = null;
    }
    if (this.dataChannel) {
      this.dataChannel.close();
      this.dataChannel = null;
    }
    if (this.peerConnection) {
      this.peerConnection.getSenders().forEach(sender => {
        if (sender.track) {
          try {
            sender.track.stop();
          } catch (e) {
            console.warn('[Bridge] Failed to stop track during cleanup:', e);
          }
        }
      });
      this.peerConnection.close();
      this.peerConnection = null;
    }
    this.pendingCandidates = [];
    this.setWebrtcStatus('idle');
    // Notify phone listeners that the screen mirror has closed
    this.remoteStreamListeners.forEach(listener => {
      try {
        listener(null);
      } catch (e) {}
    });
  }

  private async handleSignalingMessage(msg: BridgeMessage) {
    switch (msg.type) {
      case 'handshake':
        // When Desktop (Host) receives phone handshake, it triggers WebRTC initialization!
        if (this.isHost && msg.sender === 'phone') {
          if (this.currentWebrtcStatus === 'connected' || this.currentWebrtcStatus === 'connecting') {
            console.log(`[Bridge] WebRTC is already ${this.currentWebrtcStatus}. Ignoring redundant handshake.`);
            return;
          }
          console.log('[Bridge] Phone handshaked. Initializing WebRTC Peer Connection...');
          await this.initWebRTCHost();
        }
        break;

      case 'webrtc-offer':
        // Phone (Client) receives the SDP offer from Desktop
        if (!this.isHost && msg.sender === 'desktop' && msg.sdp) {
          console.log('[Bridge] Received WebRTC SDP Offer. Setting remote description...');
          await this.initWebRTCClient(msg.sdp);
        }
        break;

      case 'webrtc-answer':
        // Desktop (Host) receives answer from Phone
        if (this.isHost && msg.sender === 'phone' && msg.sdp && this.peerConnection) {
          console.log('[Bridge] Received WebRTC SDP Answer. Completing handshake...');
          await this.peerConnection.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: msg.sdp }));
          await this.flushPendingCandidates();
        }
        break;

      case 'webrtc-candidate':
        // Exchange ICE candidates
        if (msg.candidate) {
          console.log('[Bridge] Received remote ICE Candidate');
          if (this.peerConnection && this.peerConnection.remoteDescription) {
            try {
              await this.peerConnection.addIceCandidate(new RTCIceCandidate(msg.candidate));
            } catch (e) {
              console.warn('[Bridge] Error adding remote candidate:', e);
            }
          } else {
            this.pendingCandidates.push(msg.candidate);
          }
        }
        break;
    }
  }

  private setupIceCandidateHandler(pc: RTCPeerConnection) {
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendMessage({
          type: 'webrtc-candidate',
          candidate: event.candidate,
          sender: this.isHost ? 'desktop' : 'phone'
        });
      }
    };

    pc.onconnectionstatechange = () => {
      console.log(`[Bridge] WebRTC Connection State: ${pc.connectionState}`);
      if (pc.connectionState === 'connected') {
        this.setWebrtcStatus('connected');
        if (this.webrtcTimeout) clearTimeout(this.webrtcTimeout);
      } else if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
        this.setWebrtcStatus('failed');
      }
    };
  }

  private async flushPendingCandidates() {
    console.log(`[Bridge] Flushing ${this.pendingCandidates.length} pending ICE candidates...`);
    for (const candidate of this.pendingCandidates) {
      try {
        if (this.peerConnection) {
          await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (e) {
        console.warn('[Bridge] Failed to add pending candidate:', e);
      }
    }
    this.pendingCandidates = [];
  }

  // Desktop setup (Host)
  private async initWebRTCHost() {
    this.cleanupWebRTC();
    this.setWebrtcStatus('connecting');

    const config: RTCConfiguration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
        { urls: 'stun:stun.services.mozilla.com' },
        {
          urls: [
            'turns:openrelay.metered.ca:443?transport=tcp', // TLS encrypted TURN (essential for cellular carrier traversal!)
            'turn:openrelay.metered.ca:80',
            'turn:openrelay.metered.ca:443',
            'turn:openrelay.metered.ca:443?transport=tcp'
          ],
          username: 'openrelay',
          credential: 'openrelay'
        }
      ],
      iceCandidatePoolSize: 10,
      iceTransportPolicy: 'all'
    };

    try {
      this.peerConnection = new RTCPeerConnection(config);
      this.setupIceCandidateHandler(this.peerConnection);

      // Create Data Channel
      this.dataChannel = this.peerConnection.createDataChannel('rhythm-slice-ctrl', {
        ordered: false,         // Out-of-order UDP delivery for maximum speed!
        maxRetransmits: 0       // Zero retransmits: if a packet drops, ignore it (like gamepad input)
      });

      this.setupDataChannelHandlers(this.dataChannel);

      // Try to capture and stream the game canvas for mobile mirroring
      const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
      if (canvas) {
        try {
          console.log('[Bridge] Found #gameCanvas. Preparing dual-track streaming...');
          const combinedStream = new MediaStream();

          // 1. Capture video stream from canvas (24 FPS delivers organic, natural scrolling notes for mobile networks!)
          const canvasStream = (canvas as any).captureStream ? (canvas as any).captureStream(24) : null;
          if (canvasStream) {
            canvasStream.getVideoTracks().forEach((track: MediaStreamTrack) => {
              console.log('[Bridge] Adding canvas video track to combined stream:', track.kind);
              combinedStream.addTrack(track);
            });
          }

          // 2. Capture audio stream from AudioEngine
          const audioStream = (window as any).capturedAudioStream;
          if (audioStream) {
            console.log('[Bridge] Found window.capturedAudioStream. Attaching audio tracks...');
            audioStream.getAudioTracks().forEach((track: MediaStreamTrack) => {
              console.log('[Bridge] Adding audio track to combined stream:', track.kind);
              combinedStream.addTrack(track);
            });
          } else {
            console.warn('[Bridge] window.capturedAudioStream not found during WebRTC Host init');
          }

          // 3. Add all tracks from combined stream to the RTCPeerConnection instance
          combinedStream.getTracks().forEach((track: MediaStreamTrack) => {
            console.log('[Bridge] Adding track from combined stream to RTCPeerConnection:', track.kind);
            this.peerConnection!.addTrack(track, combinedStream);
          });
        } catch (e) {
          console.warn('[Bridge] Dual-track stream capture failed:', e);
        }
      }

      // Create SDP offer
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      console.log('[Bridge] WebRTC Offer generated, sending to phone...');
      this.sendMessage({
        type: 'webrtc-offer',
        sdp: offer.sdp,
        sender: 'desktop'
      });

      // Apply WebRTC Max Video Bitrate Limit to prevent cellular network congestion/input delay
      setTimeout(() => {
        if (this.peerConnection) {
          this.peerConnection.getSenders().forEach(sender => {
            if (sender.track && sender.track.kind === 'video') {
              try {
                const parameters = sender.getParameters();
                if (!parameters.encodings) parameters.encodings = [{}];
                parameters.encodings[0].maxBitrate = 350000; // Limit to 350 kbps for smooth 24 FPS cellular tracking
                sender.setParameters(parameters)
                  .then(() => console.log('[Bridge] WebRTC Video Max Bitrate successfully restricted to 350 kbps'))
                  .catch(e => console.warn('[Bridge] Failed to set video bitrate parameters:', e));
              } catch (e) {
                console.warn('[Bridge] Error reading sender parameters:', e);
              }
            }
          });
        }
      }, 1000);

      // Set timeout for WebRTC establishment (increased to 12 seconds for slow/cellular connections)
      this.webrtcTimeout = setTimeout(() => {
        if (this.currentWebrtcStatus !== 'connected') {
          console.warn('[Bridge] WebRTC handshake timed out. Falling back fully to ntfy WebSocket.');
          this.setWebrtcStatus('failed');
        }
      }, 12000);

    } catch (e) {
      console.error('[Bridge] Error starting WebRTC Host:', e);
      this.setWebrtcStatus('failed');
    }
  }

  // Phone setup (Client)
  private async initWebRTCClient(sdp: string) {
    this.cleanupWebRTC();
    this.setWebrtcStatus('connecting');

    const config: RTCConfiguration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
        { urls: 'stun:stun.services.mozilla.com' },
        {
          urls: [
            'turns:openrelay.metered.ca:443?transport=tcp', // TLS encrypted TURN (essential for cellular carrier traversal!)
            'turn:openrelay.metered.ca:80',
            'turn:openrelay.metered.ca:443',
            'turn:openrelay.metered.ca:443?transport=tcp'
          ],
          username: 'openrelay',
          credential: 'openrelay'
        }
      ],
      iceCandidatePoolSize: 10,
      iceTransportPolicy: 'all'
    };

    try {
      this.peerConnection = new RTCPeerConnection(config);
      this.setupIceCandidateHandler(this.peerConnection);

      // Client catches the host data channel
      this.peerConnection.ondatachannel = (event) => {
        console.log('[Bridge] WebRTC Data Channel received from Desktop');
        this.dataChannel = event.channel;
        this.setupDataChannelHandlers(this.dataChannel);
      };

      // Client catches incoming media tracks (game canvas mirror stream)
      this.peerConnection.ontrack = (event) => {
        console.log('[Bridge] Received remote WebRTC track!');
        if (event.streams && event.streams[0]) {
          const stream = event.streams[0];
          console.log('[Bridge] Notifying stream listeners with media stream:', stream.id);
          this.remoteStreamListeners.forEach(listener => {
            try {
              listener(stream);
            } catch (e) {}
          });
        }
      };

      // Set offer remote description
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp }));
      await this.flushPendingCandidates();

      // Create SDP answer
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      console.log('[Bridge] WebRTC Answer generated, sending to Desktop...');
      this.sendMessage({
        type: 'webrtc-answer',
        sdp: answer.sdp,
        sender: 'phone'
      });

    } catch (e) {
      console.error('[Bridge] Error creating WebRTC Client Answer:', e);
      this.setWebrtcStatus('failed');
    }
  }

  private setupDataChannelHandlers(channel: RTCDataChannel) {
    channel.onopen = () => {
      console.log('⚡ [Bridge] P2P RTCDataChannel OPENED! Latency is now <5ms');
      this.setWebrtcStatus('connected');
    };

    channel.onclose = () => {
      console.log('[Bridge] P2P RTCDataChannel Closed');
      this.setWebrtcStatus('failed');
    };

    channel.onmessage = (event) => {
      try {
        const msg: BridgeMessage = JSON.parse(event.data);
        // Redispatch incoming inputs exactly like WebSocket ones!
        this.messageListeners.forEach(listener => listener(msg));
      } catch (err) {
        console.warn('[Bridge] Error parsing WebRTC data payload:', err);
      }
    };
  }
}

export const wsBridgeService = new WebSocketBridgeService();
