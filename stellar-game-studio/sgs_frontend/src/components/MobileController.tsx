import { useEffect, useState, useRef } from 'react';
import { useWebSocketBridge } from '../hooks/useWebSocketBridge';
import { wsBridgeService } from '../services/WebSocketBridgeService';
import { SONGS } from '../data/songList';
import { Play, RotateCcw, Home, SkipForward, Music, Radio, Volume2 } from 'lucide-react';
import './MobileController.css';

interface MobileControllerProps {
  roomIdFromUrl: string;
}

export function MobileController({ roomIdFromUrl }: MobileControllerProps) {
  const { status, webrtcStatus, roomId, connect, sendMessage } = useWebSocketBridge();
  const [lastKeyPressed, setLastKeyPressed] = useState<string | null>(null);

  // Video/Audio Streaming Ref and States
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Synchronized PC Game Lobby States
  const [gameStatus, setGameStatus] = useState<'lobby' | 'playing' | 'paused' | 'results'>('lobby');
  const [syncedSongId, setSyncedSongId] = useState<string>('sauce');

  // Interactive Tactile Tap Highlights State
  const [pressedLanes, setPressedLanes] = useState<Record<string, boolean>>({
    a: false,
    s: false,
    k: false,
    l: false
  });

  // Listen for PC state updates to sync Lobby, Songs list, and Results screen
  useEffect(() => {
    const unsubscribeMessages = wsBridgeService.onMessage((msg) => {
      if (msg.type === 'game-status' as any) {
        console.log('[Mobile Controller] Received game status update from PC:', msg);
        if (msg.status) setGameStatus(msg.status);
        if (msg.songId) setSyncedSongId(msg.songId);
      }
    });

    return () => {
      unsubscribeMessages();
    };
  }, []);

  // Subscribing to PC Screen Mirror Stream
  useEffect(() => {
    const unsubscribeStream = wsBridgeService.onRemoteStream((stream) => {
      console.log('[Mobile Controller] Remote screen mirror stream updated:', stream ? stream.id : 'CLEARED');
      setRemoteStream(stream);
      // Reset unlock status when a new stream is loaded
      if (!stream) {
        setIsUnlocked(false);
      }
    });
    return () => {
      unsubscribeStream();
    };
  }, []);

  // Bind the WebRTC remote stream to our HTML Video Element
  useEffect(() => {
    if (videoRef.current) {
      if (remoteStream) {
        console.log('[Mobile Controller] Binding MediaStream to HTML video element');
        videoRef.current.srcObject = remoteStream;
        // Keep it muted initially until user taps JOIN KITCHEN
        videoRef.current.muted = !isUnlocked;
        videoRef.current.play().catch((err) => {
          console.warn('[Mobile Controller] Autoplay failed or blocked:', err);
        });
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [remoteStream, isUnlocked]);

  // Set correct room ID and connect on mount
  useEffect(() => {
    // Explicitly disconnect any previous singleton connection first to guarantee a clean slate
    console.log('[Mobile Controller] Mount - forcing clean bridge reset');
    wsBridgeService.disconnect();

    if (roomIdFromUrl) {
      console.log(`[Mobile Controller] Connecting to Room from URL: ${roomIdFromUrl}`);
      wsBridgeService.setRoomId(roomIdFromUrl);
    } else {
      wsBridgeService.connect();
    }

    // Start WebRTC client-side signaling
    wsBridgeService.startSignaling(false);

    // Send handshake immediately and keep registering every 8 seconds
    const interval = setInterval(() => {
      const webrtcStatus = wsBridgeService.getWebRTCStatus();
      if (webrtcStatus !== 'connected' && webrtcStatus !== 'connecting') {
        console.log(`[Mobile Controller] Sending keep-alive handshake (WebRTC status: ${webrtcStatus})`);
        wsBridgeService.sendMessage({ type: 'handshake', sender: 'phone' });
      }
    }, 8000);

    return () => {
      clearInterval(interval);
      console.log('[Mobile Controller] Unmount - disconnecting bridge');
      wsBridgeService.disconnect();
    };
  }, [roomIdFromUrl]);

  // Handle Touch/Click Down
  const handlePressStart = (e: React.TouchEvent | React.MouseEvent, key: string) => {
    e.preventDefault();
    setLastKeyPressed(key.toUpperCase());
    setPressedLanes((prev) => ({ ...prev, [key]: true }));
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(25);
    }

    // Send websocket keydown
    sendMessage({
      type: 'keydown',
      key: key.toLowerCase(),
      sender: 'phone',
    });
  };

  // Handle Touch/Click Up
  const handlePressEnd = (e: React.TouchEvent | React.MouseEvent, key: string) => {
    e.preventDefault();
    setPressedLanes((prev) => ({ ...prev, [key]: false }));
    sendMessage({
      type: 'keyup',
      key: key.toLowerCase(),
      sender: 'phone',
    });
  };

  // Safe handler to unmute audio context stream
  const handleJoinKitchen = () => {
    setIsUnlocked(true);

    // Play a short silent Web Audio beep to programmatically satisfy Safari/Chrome user gesture audio autoplay rules
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
        
        setTimeout(() => {
          if (ctx && ctx.state !== 'closed') ctx.close().catch(e => console.warn(e));
        }, 500);
      }
    } catch (err) {
      console.warn('[Mobile Controller] Web Audio unlock beep failed:', err);
    }

    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play()
        .then(() => {
          console.log('[Mobile Controller] Audio unmuted successfully');
        })
        .catch((err) => {
          console.warn('[Mobile Controller] Failed to start audio play:', err);
        });
    }
  };

  const handleSelectSong = (songId: string) => {
    sendMessage({
      type: 'select-song',
      songId,
      sender: 'phone'
    });
    setSyncedSongId(songId);
  };

  const isStreamingActive = remoteStream !== null && isUnlocked;

  return (
    <div className={`mc-root ${isStreamingActive ? 'streaming-mode' : ''} ${(gameStatus === 'playing' || gameStatus === 'paused') ? 'gameplay-active' : ''}`}>
      <div className="mc-texture" />

      {/* CRT Scanline Retro Effect Overlay */}
      {remoteStream && <div className="mc-video-overlay" />}

      {/* Header Strip — Glassmorphic bar (Hidden completely during actual gameplay to maximize UI replication!) */}
      {gameStatus !== 'playing' && gameStatus !== 'paused' && (
        <header className="mc-header-glass">
          <div className="mc-header-left">
            <div className="mc-live-badge animate-pulse">
              <Radio size={12} className="inline mr-1" /> LIVE
            </div>
            <div>
              <h1 className="mc-title-glass">KITCHEN PAD</h1>
              <p className="mc-subtitle-glass">Room: #{roomId || 'OFFLINE'}</p>
            </div>
          </div>
          
          <div className="mc-header-right">
            <div className="mc-badge-group">
              <div className={`mc-badge ws-${status}`}>
                WS
              </div>
              <div className={`mc-badge p2p-${webrtcStatus === 'connected' ? 'connected' : webrtcStatus === 'connecting' ? 'connecting' : 'disconnected'}`}>
                P2P
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Glass Deck Container */}
      <div className="mc-deck-container">
        {/* Modal: 🚀 JOIN KITCHEN (Autoplay Audio Unlocker) */}
        {remoteStream && !isUnlocked && (
          <div className="mc-unlock-overlay animate-fade-in">
            <div className="mc-unlock-card glassmorphic">
              <div className="mc-pizza-spin-wrapper">
                <span className="mc-pizza-spin">🍕</span>
              </div>
              <h2 className="mc-unlock-title">SOVEREIGN SHIELDS ACTIVE</h2>
              <h3 className="mc-unlock-alert-title">KITCHEN AUDIO DETECTED</h3>
              <p className="mc-unlock-desc">
                Unlock real-time high-fidelity game audio & canvas mirroring.
              </p>
              <button className="mc-unlock-button" onClick={handleJoinKitchen}>
                🚀 JOIN KITCHEN
              </button>
            </div>
          </div>
        )}

        {/* 16:9 Aspect-Ratio Locked Real-Time Mirrored Game Deck */}
        {remoteStream && isUnlocked && (
          <div className="mc-game-deck">
            <div className="mc-video-wrapper">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={!isUnlocked}
                className="mc-video-element"
              />
              
              {/* Synced Glassmorphic Pause Overlay inside the gameplay deck */}
              {gameStatus === 'paused' && (
                <div className="mc-paused-overlay-screen glassmorphic animate-fade-in">
                  <div className="mc-paused-card gold-border">
                    <h2 className="mc-paused-title text-gold animate-pulse">KITCHEN PAUSED</h2>
                    <p className="mc-paused-subtitle">The pizza oven is holding its heat...</p>
                    <button 
                      className="mc-resume-button gold-glow-btn"
                      onClick={() => sendMessage({ type: 'keydown', key: 'escape', sender: 'phone' })}
                    >
                      ▶ RESUME COOKING
                    </button>
                    <button 
                      className="mc-paused-exit-btn"
                      onClick={() => sendMessage({ type: 'back-to-lobby', sender: 'phone' })}
                    >
                      LOBBY PRINCIPAL
                    </button>
                  </div>
                </div>
              )}

              {/* Perfectly Aligned Transparent Tapping Lanes positioned 1:1 on top of video visual tracks */}
              {(gameStatus === 'playing' || gameStatus === 'paused') && (
                <div className="mc-overlay-tracks">
                  {/* Track 1 - A */}
                  <div
                    className={`mc-overlay-lane lane-a ${pressedLanes.a ? 'active' : ''}`}
                    onTouchStart={(e) => handlePressStart(e, 'a')}
                    onTouchEnd={(e) => handlePressEnd(e, 'a')}
                    onMouseDown={(e) => handlePressStart(e, 'a')}
                    onMouseUp={(e) => handlePressEnd(e, 'a')}
                  >
                    <div className="lane-tap-glow" />
                    <span className="lane-tap-letter">A</span>
                  </div>

                  {/* Track 2 - S */}
                  <div
                    className={`mc-overlay-lane lane-s ${pressedLanes.s ? 'active' : ''}`}
                    onTouchStart={(e) => handlePressStart(e, 's')}
                    onTouchEnd={(e) => handlePressEnd(e, 's')}
                    onMouseDown={(e) => handlePressStart(e, 's')}
                    onMouseUp={(e) => handlePressEnd(e, 's')}
                  >
                    <div className="lane-tap-glow" />
                    <span className="lane-tap-letter">S</span>
                  </div>

                  {/* Track 3 - K */}
                  <div
                    className={`mc-overlay-lane lane-k ${pressedLanes.k ? 'active' : ''}`}
                    onTouchStart={(e) => handlePressStart(e, 'k')}
                    onTouchEnd={(e) => handlePressEnd(e, 'k')}
                    onMouseDown={(e) => handlePressStart(e, 'k')}
                    onMouseUp={(e) => handlePressEnd(e, 'k')}
                  >
                    <div className="lane-tap-glow" />
                    <span className="lane-tap-letter">K</span>
                  </div>

                  {/* Track 4 - L */}
                  <div
                    className={`mc-overlay-lane lane-l ${pressedLanes.l ? 'active' : ''}`}
                    onTouchStart={(e) => handlePressStart(e, 'l')}
                    onTouchEnd={(e) => handlePressEnd(e, 'l')}
                    onMouseDown={(e) => handlePressStart(e, 'l')}
                    onMouseUp={(e) => handlePressEnd(e, 'l')}
                  >
                    <div className="lane-tap-glow" />
                    <span className="lane-tap-letter">L</span>
                  </div>
                </div>
              )}

              {/* Floating Immersive Exit Button inside the gameplay video frame */}
              {(gameStatus === 'playing' || gameStatus === 'paused') && (
                <button
                  className="mc-mini-lobby-btn floating-exit"
                  onClick={() => sendMessage({ type: 'back-to-lobby', sender: 'phone' })}
                >
                  <Home size={12} className="inline mr-1" /> EXIT
                </button>
              )}
            </div>
          </div>
        )}

        {/* Dynamic Panels based on synced PC Game Status */}
        {(isUnlocked || !remoteStream) && gameStatus !== 'playing' && gameStatus !== 'paused' && (
          <div className="mc-panels-wrapper">
            {gameStatus === 'lobby' && (
              <div className="mc-lobby-panel glassmorphic animate-slide-up">
                <div className="mc-panel-header">
                  <Music size={16} className="text-gold" />
                  <span>SELECT INGREDIENT TRACK ({SONGS.length} Songs)</span>
                </div>

                {/* WebRTC (P2P) Status Feedback Banner */}
                <div className="mc-webrtc-feedback">
                  {webrtcStatus === 'connected' && (
                    <span style={{ color: '#2ece71', fontWeight: 'bold' }}>⚡ P2P MIRROR ACTIVE (Zero-lag Screen Shared)</span>
                  )}
                  {webrtcStatus === 'connecting' && (
                    <span style={{ color: '#f1c40f' }}>🔗 ESTABLISHING DUAL-SCREEN MIRROR...</span>
                  )}
                  {(webrtcStatus === 'failed' || webrtcStatus === 'idle') && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', textAlign: 'left', lineHeight: '1.3' }}>
                      <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>⚠️ MIRROR INACTIVE (WebSocket Controls ONLY)</span>
                      <span style={{ fontSize: '0.55rem', color: '#bbb' }}>
                        To mirror the game screen, ensure both devices are connected to the <strong>same Wi-Fi network</strong>.
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Scrollable Song selection deck */}
                <div className="mc-songs-scroller">
                  {SONGS.map((song) => {
                    const isSelected = song.id === syncedSongId;
                    return (
                      <div
                        key={song.id}
                        className={`mc-song-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelectSong(song.id)}
                      >
                        <div className="mc-song-details">
                          <span className="mc-song-index">#{String(song.index).padStart(2, '0')}</span>
                          <div className="mc-song-meta">
                            <span className="mc-song-title">{song.title}</span>
                            <span className="mc-song-artist">{song.artist}</span>
                          </div>
                        </div>
                        <div className="mc-song-stats">
                          <span className="mc-song-bpm">{song.bpm} BPM</span>
                          <span className="mc-song-duration">
                            {Math.floor(song.duration / 60)}:{String(Math.floor(song.duration % 60)).padStart(2, '0')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Big Golden Start Button */}
                <button
                  className="mc-action-button gold-glow"
                  onClick={() => sendMessage({ type: 'start-game', sender: 'phone' })}
                >
                  <Play size={20} className="inline mr-2 fill-current" /> INICIAR PARTIDA
                </button>
              </div>
            )}

            {gameStatus === 'results' && (
              <div className="mc-results-panel glassmorphic animate-slide-up">
                <div className="mc-pizza-trophy">🏆</div>
                <h2 className="mc-results-title">LEVEL COMPLETE</h2>
                <p className="mc-results-subtitle">The Godfather is impressed by your culinary speed!</p>
                
                <div className="mc-results-actions">
                  <button
                    className="mc-results-btn play-again"
                    onClick={() => sendMessage({ type: 'start-game', sender: 'phone' })}
                  >
                    <RotateCcw size={16} className="inline mr-1" /> JUGAR DE NUEVO
                  </button>
                  
                  <button
                    className="mc-results-btn next-songgold"
                    onClick={() => sendMessage({ type: 'start-game', sender: 'phone' })}
                  >
                    <SkipForward size={16} className="inline mr-1" /> SIGUIENTE CANCIÓN
                  </button>

                  <button
                    className="mc-results-btn back-lobby"
                    onClick={() => sendMessage({ type: 'back-to-lobby', sender: 'phone' })}
                  >
                    <Home size={16} className="inline mr-1" /> LOBBY PRINCIPAL
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Fallback floating HUD for WebSocket-only gameplay */}
        {(gameStatus === 'playing' || gameStatus === 'paused') && !remoteStream && (
          <div className="mc-playing-panel animate-fade-in">
            <div className="mc-in-game-header">
              <div className="mc-playing-track">
                <Music size={12} className="inline mr-1 text-gold" />
                <span>PLAYING: {SONGS.find(s => s.id === syncedSongId)?.title || syncedSongId}</span>
              </div>
              <button
                className="mc-mini-lobby-btn"
                onClick={() => sendMessage({ type: 'back-to-lobby', sender: 'phone' })}
              >
                <Home size={12} className="inline mr-1" /> EXIT
              </button>
            </div>
            {gameStatus === 'paused' && (
              <div className="mc-paused-overlay-fallback glassmorphic animate-fade-in">
                <div className="mc-paused-card gold-border">
                  <h2 className="mc-paused-title text-gold animate-pulse">KITCHEN PAUSED</h2>
                  <button 
                    className="mc-resume-button gold-glow-btn"
                    onClick={() => sendMessage({ type: 'keydown', key: 'escape', sender: 'phone' })}
                  >
                    ▶ RESUME COOKING
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fallback Four Colored Massive Touch Lanes - Only rendered if screen stream is NOT active to preserve visual space! */}
      {!isStreamingActive && (
        <div className="mc-pads-grid">
          {/* Lane 1 - Key A */}
          <div
            className="mc-pad p-a"
            onTouchStart={(e) => handlePressStart(e, 'a')}
            onTouchEnd={(e) => handlePressEnd(e, 'a')}
            onMouseDown={(e) => handlePressStart(e, 'a')}
            onMouseUp={(e) => handlePressEnd(e, 'a')}
          >
            <span className="mc-pad-letter">A</span>
            <span className="mc-pad-ingredient">🔴</span>
          </div>

          {/* Lane 2 - Key S */}
          <div
            className="mc-pad p-s"
            onTouchStart={(e) => handlePressStart(e, 's')}
            onTouchEnd={(e) => handlePressEnd(e, 's')}
            onMouseDown={(e) => handlePressStart(e, 's')}
            onMouseUp={(e) => handlePressEnd(e, 's')}
          >
            <span className="mc-pad-letter">S</span>
            <span className="mc-pad-ingredient">🟡</span>
          </div>

          {/* Lane 3 - Key K */}
          <div
            className="mc-pad p-k"
            onTouchStart={(e) => handlePressStart(e, 'k')}
            onTouchEnd={(e) => handlePressEnd(e, 'k')}
            onMouseDown={(e) => handlePressStart(e, 'k')}
            onMouseUp={(e) => handlePressEnd(e, 'k')}
          >
            <span className="mc-pad-letter">K</span>
            <span className="mc-pad-ingredient">🥓</span>
          </div>

          {/* Lane 4 - Key L */}
          <div
            className="mc-pad p-l"
            onTouchStart={(e) => handlePressStart(e, 'l')}
            onTouchEnd={(e) => handlePressEnd(e, 'l')}
            onMouseDown={(e) => handlePressStart(e, 'l')}
            onMouseUp={(e) => handlePressEnd(e, 'l')}
          >
            <span className="mc-pad-letter">L</span>
            <span className="mc-pad-ingredient">🟣</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default MobileController;
