import WebSocket from 'ws';

async function testNtfy() {
  const roomId = 'test-' + Math.floor(Math.random() * 1000000);
  const wsUrl = `wss://ntfy.sh/guitarslice-${roomId}/ws`;
  const postUrl = `https://ntfy.sh/guitarslice-${roomId}`;

  console.log(`[TEST] Connecting to ntfy WebSocket: ${wsUrl}`);
  
  const ws = new WebSocket(wsUrl);
  let wsConnected = false;

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      console.log('❌ [TEST] Timeout after 8000ms');
      ws.terminate();
      resolve(false);
    }, 8000);

    ws.on('open', () => {
      console.log('✅ WebSocket subscriber connected to ntfy!');
      wsConnected = true;
      
      // Publish message via HTTP POST after 1s
      setTimeout(async () => {
        console.log(`🚀 Publishing message via HTTP POST to: ${postUrl}`);
        try {
          const response = await fetch(postUrl, {
            method: 'POST',
            body: JSON.stringify({ type: 'handshake', sender: 'phone' }),
            headers: {
              'Content-Type': 'application/json'
            }
          });
          const text = await response.text();
          console.log(`✅ Publish Response status: ${response.status}. Body: ${text}`);
        } catch (e) {
          console.log('❌ Publish HTTP POST Error:', e.message);
        }
      }, 1000);
    });

    ws.on('message', (data) => {
      const dataStr = data.toString();
      console.log(`📩 WebSocket received message from ntfy: ${dataStr}`);
      const payload = JSON.parse(dataStr);
      
      // ntfy wraps the payload inside its own message structure.
      // The actual message is in payload.message
      if (payload && payload.event === 'message') {
        console.log(`🎉 Found notification event! Content: ${payload.message}`);
        clearTimeout(timeout);
        ws.close();
        resolve(true);
      }
    });

    ws.on('error', (e) => {
      console.log('❌ WebSocket Error:', e.message);
      clearTimeout(timeout);
      resolve(false);
    });
  });
}

testNtfy().then(success => {
  console.log(`RESULT: ${success ? '✅ SUCCESS' : '❌ FAILED'}`);
});
