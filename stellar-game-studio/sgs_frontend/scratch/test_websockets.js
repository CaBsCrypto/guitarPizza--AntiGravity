import WebSocket from 'ws';

async function testConnection(name, url) {
  return new Promise((resolve) => {
    console.log(`[TEST] Connecting to ${name}: ${url}`);
    const start = Date.now();
    try {
      const ws = new WebSocket(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      });
      
      const timeout = setTimeout(() => {
        console.log(`❌ [${name}] Timeout after 5000ms`);
        ws.terminate();
        resolve(false);
      }, 5000);

      ws.on('open', () => {
        clearTimeout(timeout);
        console.log(`✅ [${name}] CONNECTED in ${Date.now() - start}ms`);
        ws.close();
        resolve(true);
      });

      ws.on('error', (err) => {
        clearTimeout(timeout);
        console.log(`❌ [${name}] ERROR in ${Date.now() - start}ms: ${err.message}`);
        resolve(false);
      });
    } catch (e) {
      console.log(`❌ [${name}] EXCEPTION: ${e.message}`);
      resolve(false);
    }
  });
}

async function run() {
  const dynamicChannelUrl = 'wss://demo.piesocket.com/v3/guitarslice-ABCX34?api_key=VCKGPEJyWZTMmTPuj2RDkqGUV9mTRFL3aa2ExdxD&notify_self=1';
  await testConnection('PieSocket Custom Channel', dynamicChannelUrl);
}

run();
