import pkg from 'peerjs';
const { Peer } = pkg;

async function testPeerJS() {
  console.log('[TEST] Initializing client 1 and client 2 with PeerJS...');
  
  const id1 = 'guitarslice-test-c1-' + Math.floor(Math.random() * 10000);
  const id2 = 'guitarslice-test-c2-' + Math.floor(Math.random() * 10000);

  const peer1 = new Peer(id1);
  const peer2 = new Peer(id2);

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      console.log('❌ [TEST] Timeout after 15000ms');
      peer1.destroy();
      peer2.destroy();
      resolve(false);
    }, 15000);

    peer1.on('open', (id) => {
      console.log(`✅ Peer 1 opened with ID: ${id}`);
    });

    peer2.on('open', (id) => {
      console.log(`✅ Peer 2 opened with ID: ${id}`);
      
      // Wait a bit to ensure peer 1 is fully registered in the cloud server catalog
      setTimeout(() => {
        console.log(`🚀 Peer 2 connecting to Peer 1 (${id1})...`);
        const conn = peer2.connect(id1);

        conn.on('open', () => {
          console.log('%.⚡ P2P Connection opened between Peer 2 and Peer 1!');
          conn.send('hello from peer 2');
        });

        conn.on('error', (err) => {
          console.log('❌ Connection Error:', err.message);
        });
      }, 1000);
    });

    peer1.on('connection', (conn) => {
      console.log('📩 Peer 1 received connection request!');
      conn.on('data', (data) => {
        console.log(`📩 Peer 1 received data: ${data}`);
        clearTimeout(timeout);
        peer1.destroy();
        peer2.destroy();
        resolve(true);
      });
    });

    peer1.on('error', (e) => console.log('❌ Peer 1 Error:', e.message));
    peer2.on('error', (e) => console.log('❌ Peer 2 Error:', e.message));
  });
}

testPeerJS().then(success => {
  console.log(`RESULT: ${success ? '✅ SUCCESS' : '❌ FAILED'}`);
});
