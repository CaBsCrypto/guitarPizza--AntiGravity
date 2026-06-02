import WebSocket from 'ws';

async function testPubSub(apiKey) {
  const roomId = 'test-' + Math.floor(Math.random() * 1000000);
  const url = `wss://demo.piesocket.com/v3/guitarslice-${roomId}?api_key=${apiKey}&notify_self=1`;
  
  console.log(`[TEST] Connecting to PieSocket with key: ${apiKey} on room: guitarslice-${roomId}`);
  
  const client1 = new WebSocket(url);
  const client2 = new WebSocket(url);

  let c1Connected = false;
  let c2Connected = false;
  let messageReceived = false;

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      console.log('❌ [TEST] Timeout after 5000ms');
      client1.terminate();
      client2.terminate();
      resolve(false);
    }, 5000);

    client1.on('open', () => {
      console.log('✅ Client 1 connected');
      c1Connected = true;
      checkAndPublish();
    });

    client2.on('open', () => {
      console.log('✅ Client 2 connected');
      c2Connected = true;
      checkAndPublish();
    });

    client2.on('message', (data) => {
      const dataStr = data.toString();
      console.log(`📩 Client 2 received message: ${dataStr}`);
      if (dataStr.includes('error') && dataStr.includes('API')) {
        console.log('❌ Error received inside channel!');
        clearTimeout(timeout);
        client1.close();
        client2.close();
        resolve(false);
      } else {
        // If it's a handshake message, we succeeded!
        if (dataStr.includes('handshake')) {
          messageReceived = true;
          clearTimeout(timeout);
          client1.close();
          client2.close();
          resolve(true);
        }
      }
    });

    function checkAndPublish() {
      if (c1Connected && c2Connected) {
        console.log('🚀 Both clients connected. Client 1 publishing test message...');
        setTimeout(() => {
          client1.send(JSON.stringify({ type: 'handshake', sender: 'phone' }));
        }, 1000); // Wait 1 second to ensure subscription is active
      }
    }

    client1.on('error', (e) => console.log('❌ Client 1 Error:', e.message));
    client2.on('error', (e) => console.log('❌ Client 2 Error:', e.message));
  });
}

async function run() {
  const success = await testPubSub('oDJUXOCAYUzMapjWwSy6G9vCwwhM7yGl4Y44zDM5');
  console.log(`RESULT: ${success ? '✅ SUCCESS' : '❌ FAILED'}`);
}

run();
