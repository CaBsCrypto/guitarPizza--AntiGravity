import { useEffect, useState } from 'react';
import { wsBridgeService, type ConnectionStatus, type BridgeMessage, type WebRTCStatus } from '../services/WebSocketBridgeService';

export function useWebSocketBridge(autoConnect: boolean = false) {
  const [status, setStatus] = useState<ConnectionStatus>(wsBridgeService.getStatus());
  const [webrtcStatus, setWebrtcStatus] = useState<WebRTCStatus>(wsBridgeService.getWebRTCStatus());
  const [roomId, setRoomId] = useState<string>(wsBridgeService.getRoomId());
  const [clientUrl, setClientUrl] = useState<string>(wsBridgeService.getRoomClientUrl());

  useEffect(() => {
    // Listen for status changes
    const unsubscribeStatus = wsBridgeService.onStatusChange((newStatus) => {
      setStatus(newStatus);
      setRoomId(wsBridgeService.getRoomId());
      setClientUrl(wsBridgeService.getRoomClientUrl());
    });

    // Listen for WebRTC status changes
    const unsubscribeWebRTC = wsBridgeService.onWebRTCStatusChange((newWebRTCStatus) => {
      setWebrtcStatus(newWebRTCStatus);
    });

    // Update state when room ID or url changes (though usually stable)
    setRoomId(wsBridgeService.getRoomId());
    setClientUrl(wsBridgeService.getRoomClientUrl());

    return () => {
      unsubscribeStatus();
      unsubscribeWebRTC();
    };
  }, []);

  const connect = () => wsBridgeService.connect();
  const disconnect = () => wsBridgeService.disconnect();
  const sendMessage = (msg: BridgeMessage) => wsBridgeService.sendMessage(msg);

  return {
    status,
    webrtcStatus,
    roomId,
    clientUrl,
    connect,
    disconnect,
    sendMessage,
    onMessage: (callback: (msg: BridgeMessage) => void) => wsBridgeService.onMessage(callback)
  };
}
