const WebSocket = require('ws');

console.log('--- STARTING SANITY TEST FOR WS MULTIPLAYER SERVER ---');

// We will launch the server programmatically, or test the logic directly.
// Let's test the winner determination logic directly from the server code structure
// to prove the bug, and then run a simulated WebSocket run.

const playerA_addr = 'GB_PLAYER_A_STELLAR_ADDRESS_111111111111111111111111';
const playerB_addr = 'GB_PLAYER_B_STELLAR_ADDRESS_222222222222222222222222';

// Simulated Server Match State Object:
const matchState = {
    matchId: 1,
    playerA: { addr: playerA_addr, status: 'pending' },
    playerB: { addr: playerB_addr, status: 'pending' },
    wager: 10
};

// When gameOver is called for A:
matchState.playerA.finalScore = 1500;
matchState.playerA.status = 'finished';

// When gameOver is called for B:
matchState.playerB.finalScore = 800;
matchState.playerB.status = 'finished';

console.log('Player A finalScore (should be 1500):', matchState.playerA.finalScore);
console.log('Player B finalScore (should be 800):', matchState.playerB.finalScore);

// Server's buggy winnerAddress resolution logic (from line 276 of multiplayer_server.cjs):
// winnerAddress: match.playerAScore > match.playerBScore ? match.playerA.addr : match.playerB.addr
// Note: playerAScore is read directly from match instead of match.playerA.finalScore!
const playerAScore = matchState.playerAScore; // undefined
const playerBScore = matchState.playerBScore; // undefined

const buggyWinnerAddress = playerAScore > playerBScore ? matchState.playerA.addr : matchState.playerB.addr;

console.log('--- WINNER DETERMINATION RESULT ---');
console.log('Parsed matchState.playerAScore:', playerAScore);
console.log('Parsed matchState.playerBScore:', playerBScore);
console.log('Comparison: undefined > undefined is', playerAScore > playerBScore);
console.log('Winner address determined by server:', buggyWinnerAddress);
console.log('Expected Winner (A should win with 1500 vs 800):', playerA_addr);
console.log('Actual determined winner matches Player B?', buggyWinnerAddress === playerB_addr ? 'YES (BUG DETECTED)' : 'NO');

// Let's write the correct resolution logic:
const correctWinnerAddress = matchState.playerA.finalScore > matchState.playerB.finalScore 
    ? matchState.playerA.addr 
    : matchState.playerB.addr;
console.log('Correct determined winner:', correctWinnerAddress);
console.log('Correct determined winner matches Player A?', correctWinnerAddress === playerA_addr ? 'YES (CORRECT)' : 'NO');
