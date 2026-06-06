import { useEffect, useState } from 'react';
import { useWebSocketBridge } from '../hooks/useWebSocketBridge';
import { wsBridgeService } from '../services/WebSocketBridgeService';
import { X, RefreshCw, Smartphone, Play, CheckCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import './QRConnectionPanel.css';

interface QRConnectionPanelProps {
  onClose: () => void;
}

export function QRConnectionPanel({ onClose }: QRConnectionPanelProps) {
  const { status, webrtcStatus, roomId, clientUrl, connect, disconnect, sendMessage, onMessage } = useWebSocketBridge();
  const [activeKeys, setActiveKeys] = useState<Record<string, boolean>>({
    a: false,
    s: false,
    k: false,
    l: false,
  });

  // Keep track of mobile handshake status
  const [isPhoneHandshaked, setIsPhoneHandshaked] = useState(false);

  // Auto connect and start WebRTC Host signaling when the modal opens
  useEffect(() => {
    wsBridgeService.startSignaling(true); // desktop is the host
    return () => {
      // Keep running in background so phone stays connected if desired
    };
  }, []);

  // Listen to keydown and keyup events locally and via WebSocket to animate the key tester
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['a', 's', 'k', 'l'].includes(key)) {
        setActiveKeys((prev) => ({ ...prev, [key]: true }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['a', 's', 'k', 'l'].includes(key)) {
        setActiveKeys((prev) => ({ ...prev, [key]: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Unsubscribe function for WS messages
    const unsubscribeMessage = onMessage((msg) => {
      console.log('[QR Panel] Received message:', msg);
      if (msg.type === 'handshake') {
        setIsPhoneHandshaked(true);
        console.log('[QR Panel] Phone handshaked successfully!');
      } else if (msg.type === 'keydown' && msg.key) {
        const key = msg.key.toLowerCase();
        setActiveKeys((prev) => ({ ...prev, [key]: true }));
        // Programmatically dispatch a keydown event on window so the game engine handles it!
        const event = new KeyboardEvent('keydown', {
          key: key,
          code: `Key${key.toUpperCase()}`,
          bubbles: true,
          cancelable: true,
        });
        window.dispatchEvent(event);
      } else if (msg.type === 'keyup' && msg.key) {
        const key = msg.key.toLowerCase();
        setActiveKeys((prev) => ({ ...prev, [key]: false }));
        // Programmatically dispatch a keyup event on window
        const event = new KeyboardEvent('keyup', {
          key: key,
          code: `Key${key.toUpperCase()}`,
          bubbles: true,
          cancelable: true,
        });
        window.dispatchEvent(event);
      } else if (msg.type === 'start-game') {
        console.log('[QR Panel] Start game requested from phone!');
        const startBtn = document.getElementById('startBtn');
        if (startBtn) {
          startBtn.click();
        }
        onClose(); // Auto-close QR modal on launch
      }
    });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      unsubscribeMessage();
    };
  }, [onMessage]);

  const handleRegenerate = () => {
    const freshCode = Math.floor(100000 + Math.random() * 900000).toString();
    wsBridgeService.setRoomId(freshCode);
    setIsPhoneHandshaked(false);
  };

  // Allow simulated input presses inside the panel for instant feedback/testing
  const triggerSimulatedPress = (key: 'a' | 's' | 'k' | 'l') => {
    // 1. Simulate keydown
    const eventDown = new KeyboardEvent('keydown', {
      key: key,
      code: `Key${key.toUpperCase()}`,
      bubbles: true,
    });
    window.dispatchEvent(eventDown);
    setActiveKeys((prev) => ({ ...prev, [key]: true }));

    // 2. Simulate keyup after 120ms
    setTimeout(() => {
      const eventUp = new KeyboardEvent('keyup', {
        key: key,
        code: `Key${key.toUpperCase()}`,
        bubbles: true,
      });
      window.dispatchEvent(eventUp);
      setActiveKeys((prev) => ({ ...prev, [key]: false }));
    }, 120);
  };

  const handleSimulatePhoneConnection = () => {
    setIsPhoneHandshaked(true);
    sendMessage({ type: 'handshake', sender: 'phone' });
  };

  return (
    <div className="qr-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="qr-modal">
        {/* Header Ribbon */}
        <div className="qr-header">
          <div className="qr-header-checker" />
          <h2 className="qr-title">📱 DUAL-SCREEN REMOTE</h2>
          <p className="qr-subtitle">Pizza-Slicing Phone Controller</p>
          <button className="qr-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="qr-body">
          {/* WebSocket & WebRTC Status Indicator */}
          <div className="qr-status-strip">
            <span className="qr-status-label">BRIDGE STATUS:</span>
            <div className="qr-status-indicator" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span className={`qr-dot ${status}`} />
                <span style={{ color: status === 'connected' ? '#2ecc71' : status === 'connecting' ? '#f1c40f' : '#e74c3c', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  WS: {status}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span className={`qr-dot ${webrtcStatus === 'connected' ? 'connected' : webrtcStatus === 'connecting' ? 'connecting' : 'disconnected'}`} />
                <span style={{ color: webrtcStatus === 'connected' ? '#2ecc71' : webrtcStatus === 'connecting' ? '#f1c40f' : '#e74c3c', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  P2P: {webrtcStatus === 'connected' ? 'ACTIVE (⚡)' : webrtcStatus === 'connecting' ? 'CONNECTING...' : 'INACTIVE'}
                </span>
              </div>
            </div>
          </div>

          {/* QR Layout */}
          <div className="qr-content-layout">
            <div className="qr-code-wrapper" style={{ width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', padding: '8px', boxSizing: 'border-box' }}>
              <QRCodeSVG
                value={clientUrl}
                size={134}
                bgColor="#ffffff"
                fgColor="#000000"
                level="M"
                includeMargin={false}
              />
            </div>

            <div className="qr-steps">
              <div className="qr-step">
                <div className="qr-step-num">1</div>
                <div className="qr-step-text">
                  Scan QR with your <strong>smartphone</strong>.
                </div>
              </div>
              <div className="qr-step">
                <div className="qr-step-num">2</div>
                <div className="qr-step-text">
                  Keep this modal open while your phone links up.
                </div>
              </div>
              <div className="qr-step">
                <div className="qr-step-num">3</div>
                <div className="qr-step-text">
                  Tap buttons on phone to <strong>slice pizza</strong> in real-time!
                </div>
              </div>
            </div>
          </div>

          {/* Room code display */}
          <div className="qr-code-strip">
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>ROOM CODE:</span>
            <span className="qr-code-value">{roomId}</span>
          </div>

          {/* Keys/Notes Tester */}
          <div className="qr-key-tester">
            <div className="qr-key-tester-title">
              {isPhoneHandshaked ? '🟢 Phone Connected & Calibrated' : '⚡ Live Input Calibrator'}
            </div>
            <div className="qr-keys-row">
              <div className={`qr-key-indicator k-a ${activeKeys.a ? 'active' : ''}`} onClick={() => triggerSimulatedPress('a')}>A</div>
              <div className={`qr-key-indicator k-s ${activeKeys.s ? 'active' : ''}`} onClick={() => triggerSimulatedPress('s')}>S</div>
              <div className={`qr-key-indicator k-k ${activeKeys.k ? 'active' : ''}`} onClick={() => triggerSimulatedPress('k')}>K</div>
              <div className={`qr-key-indicator k-l ${activeKeys.l ? 'active' : ''}`} onClick={() => triggerSimulatedPress('l')}>L</div>
            </div>
          </div>

          {/* Actions */}
          <div className="qr-actions">
            <button className="qr-btn qr-btn-secondary" onClick={handleRegenerate}>
              <RefreshCw size={14} /> NEW ROOM
            </button>
            <button className="qr-btn qr-btn-primary" onClick={handleSimulatePhoneConnection}>
              <Smartphone size={14} /> {isPhoneHandshaked ? 'LINKED' : 'SIMULATE LINK'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
