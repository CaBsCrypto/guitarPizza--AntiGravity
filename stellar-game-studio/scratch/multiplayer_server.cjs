const { WebSocketServer } = require('ws');
const http = require('http');

const PORT = process.env.PORT || 8080;
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Rhythm Slice Real-Time Multiplayer server is running!\n');
});

const wss = new WebSocketServer({ server });

// Memory state
let publicQueue = []; // Array of { ws, playerAddress, wager }
const privateRooms = new Map(); // RoomCode -> { playerA: { ws, addr }, playerB: { ws, addr }, wager, status: 'open'|'active' }
const activeMatches = new Map(); // MatchId -> { playerA, playerB, wager, scores: {} }

let nextMatchId = 1;

function generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

console.log(`[WS-Server] Launching WebSocket Server on port ${PORT}...`);

wss.on('connection', (ws) => {
    console.log(`[WS-Server] New connection established.`);
    ws.isAlive = true;
    
    ws.on('pong', () => {
        ws.isAlive = true;
    });

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            const { event, payload } = data;
            
            console.log(`[WS-Server] Event received: ${event}`, payload);
            
            switch (event) {
                case 'join_queue':
                    handleJoinQueue(ws, payload);
                    break;
                    
                case 'leave_queue':
                    handleLeaveQueue(ws);
                    break;
                    
                case 'create_room':
                    handleCreateRoom(ws, payload);
                    break;
                    
                case 'join_room':
                    handleJoinRoom(ws, payload);
                    break;
                    
                case 'wager_locked':
                    handleWagerLocked(ws, payload);
                    break;
                    
                case 'sync_note':
                    handleSyncNote(ws, payload);
                    break;
                    
                case 'game_over':
                    handleGameOver(ws, payload);
                    break;
                    
                default:
                    console.warn(`[WS-Server] Unknown event: ${event}`);
            }
        } catch (e) {
            console.error('[WS-Server] Failed to parse message:', e);
        }
    });

    ws.on('close', () => {
        console.log(`[WS-Server] Connection closed.`);
        cleanPlayerSession(ws);
    });
});

// Matchmaking queues
function handleJoinQueue(ws, payload) {
    const { playerAddress, wager } = payload;
    if (!playerAddress) return;
    
    // Remove if already in queue
    publicQueue = publicQueue.filter(p => p.playerAddress !== playerAddress);
    
    // Check if another player in queue matches the wager amount
    const opponentIndex = publicQueue.findIndex(p => p.wager === Number(wager));
    
    if (opponentIndex !== -1) {
        // MATCH FOUND!
        const opponent = publicQueue[opponentIndex];
        publicQueue.splice(opponentIndex, 1);
        
        const matchId = nextMatchId++;
        const matchState = {
            matchId,
            playerA: { ws, addr: playerAddress, status: 'pending' },
            playerB: { ws: opponent.ws, addr: opponent.playerAddress, status: 'pending' },
            wager: Number(wager)
        };
        
        activeMatches.set(matchId, matchState);
        ws.matchState = { matchId, role: 'playerA' };
        opponent.ws.matchState = { matchId, role: 'playerB' };
        
        // Notify both players
        const matchFoundMsg = JSON.stringify({
            event: 'match_found',
            payload: { matchId, opponentAddress: opponent.playerAddress, wager }
        });
        const matchFoundMsgOpponent = JSON.stringify({
            event: 'match_found',
            payload: { matchId, opponentAddress: playerAddress, wager }
        });
        
        ws.send(matchFoundMsg);
        opponent.ws.send(matchFoundMsgOpponent);
        
        console.log(`[WS-Server] Match ${matchId} matched between ${playerAddress} and ${opponent.playerAddress}`);
    } else {
        // Put in queue
        ws.playerAddress = playerAddress;
        ws.wager = Number(wager);
        publicQueue.push({ ws, playerAddress, wager: Number(wager) });
        console.log(`[WS-Server] Player ${playerAddress} joined public queue with wager ${wager}`);
    }
}

function handleLeaveQueue(ws) {
    if (ws.playerAddress) {
        publicQueue = publicQueue.filter(p => p.playerAddress !== ws.playerAddress);
        console.log(`[WS-Server] Player ${ws.playerAddress} left public queue`);
    }
}

// Private rooms
function handleCreateRoom(ws, payload) {
    const { playerAddress, wager } = payload;
    const roomCode = generateRoomCode();
    
    privateRooms.set(roomCode, {
        playerA: { ws, addr: playerAddress, status: 'pending' },
        playerB: null,
        wager: Number(wager),
        status: 'open'
    });
    
    ws.roomCode = roomCode;
    ws.roomRole = 'playerA';
    
    ws.send(JSON.stringify({
        event: 'room_created',
        payload: { roomCode, wager }
    }));
    
    console.log(`[WS-Server] Private Room ${roomCode} created by ${playerAddress} with wager ${wager}`);
}

function handleJoinRoom(ws, payload) {
    const { playerAddress, roomCode } = payload;
    if (!privateRooms.has(roomCode)) {
        ws.send(JSON.stringify({ event: 'error', payload: 'Room not found' }));
        return;
    }
    
    const room = privateRooms.get(roomCode);
    if (room.status !== 'open') {
        ws.send(JSON.stringify({ event: 'error', payload: 'Room is already full or active' }));
        return;
    }
    
    room.playerB = { ws, addr: playerAddress, status: 'pending' };
    room.status = 'active';
    
    ws.roomCode = roomCode;
    ws.roomRole = 'playerB';
    
    const matchId = nextMatchId++;
    const matchState = {
        matchId,
        playerA: { ws: room.playerA.ws, addr: room.playerA.addr, status: 'pending' },
        playerB: { ws, addr: playerAddress, status: 'pending' },
        wager: room.wager
    };
    
    activeMatches.set(matchId, matchState);
    room.playerA.ws.matchState = { matchId, role: 'playerA' };
    ws.matchState = { matchId, role: 'playerB' };
    
    // Notify both about match found
    room.playerA.ws.send(JSON.stringify({
        event: 'match_found',
        payload: { matchId, opponentAddress: playerAddress, wager: room.wager, roomCode }
    }));
    
    ws.send(JSON.stringify({
        event: 'match_found',
        payload: { matchId, opponentAddress: room.playerA.addr, wager: room.wager, roomCode }
    }));
    
    console.log(`[WS-Server] Player ${playerAddress} joined private Room ${roomCode}. Match ${matchId} started.`);
}

// Escrow sync
function handleWagerLocked(ws, payload) {
    const { matchId } = payload;
    if (!activeMatches.has(matchId)) return;
    
    const match = activeMatches.get(matchId);
    const role = ws.matchState?.role;
    
    if (role === 'playerA') {
        match.playerA.status = 'locked';
    } else if (role === 'playerB') {
        match.playerB.status = 'locked';
    }
    
    console.log(`[WS-Server] Match ${matchId} - ${role} confirmed wager locked`);
    
    // If both are locked, broadcast game start with sync timestamp
    if (match.playerA.status === 'locked' && match.playerB.status === 'locked') {
        const startTime = Date.now() + 3500; // synchronized start in 3.5 seconds
        const startMsg = JSON.stringify({ event: 'start_game', payload: { matchId, startTime } });
        match.playerA.ws.send(startMsg);
        match.playerB.ws.send(startMsg);
        console.log(`[WS-Server] Match ${matchId} - Both locked! Sowing game start sync trigger at ${startTime}.`);
    }
}

// Live play sync
function handleSyncNote(ws, payload) {
    const { matchId, score, combo, hitType, isFever } = payload;
    if (!activeMatches.has(matchId)) return;
    
    const match = activeMatches.get(matchId);
    const role = ws.matchState?.role;
    
    const opponent = role === 'playerA' ? match.playerB : match.playerA;
    if (opponent && opponent.ws) {
        opponent.ws.send(JSON.stringify({
            event: 'rival_note',
            payload: { score, combo, hitType, isFever }
        }));
    }
}

function handleGameOver(ws, payload) {
    const { matchId, score } = payload;
    if (!activeMatches.has(matchId)) return;
    
    const match = activeMatches.get(matchId);
    const role = ws.matchState?.role;
    
    console.log(`[WS-Server] Match ${matchId} - Player ${role} finished with score ${score}`);
    
    if (role === 'playerA') {
        match.playerA.finalScore = score;
        match.playerA.status = 'finished';
    } else if (role === 'playerB') {
        match.playerB.finalScore = score;
        match.playerB.status = 'finished';
    }
    
    // If both finished, notify scores to resolve
    if (match.playerA.status === 'finished' && match.playerB.status === 'finished') {
        const scoreA = match.playerA.finalScore || 0;
        const scoreB = match.playerB.finalScore || 0;
        let winnerAddress = 'TIE';
        if (scoreA > scoreB) {
            winnerAddress = match.playerA.addr;
        } else if (scoreB > scoreA) {
            winnerAddress = match.playerB.addr;
        }

        const resultsMsg = JSON.stringify({
            event: 'match_resolved',
            payload: {
                matchId,
                playerAScore: scoreA,
                playerBScore: scoreB,
                winnerAddress
            }
        });
        match.playerA.ws.send(resultsMsg);
        match.playerB.ws.send(resultsMsg);
        activeMatches.delete(matchId);
        console.log(`[WS-Server] Match ${matchId} resolved and deleted. Winner: ${winnerAddress}`);
    }
}

// Clean session
function cleanPlayerSession(ws) {
    handleLeaveQueue(ws);
    
    if (ws.roomCode && privateRooms.has(ws.roomCode)) {
        const room = privateRooms.get(ws.roomCode);
        console.log(`[WS-Server] Cleaning Room ${ws.roomCode} due to host disconnect.`);
        
        // Notify opponent
        const opponent = ws.roomRole === 'playerA' ? room.playerB : room.playerA;
        if (opponent && opponent.ws) {
            opponent.ws.send(JSON.stringify({ event: 'rival_disconnected', payload: 'Host disconnected' }));
        }
        privateRooms.delete(ws.roomCode);
    }
    
    if (ws.matchState && activeMatches.has(ws.matchState.matchId)) {
        const { matchId, role } = ws.matchState;
        const match = activeMatches.get(matchId);
        console.log(`[WS-Server] Cleaning Match ${matchId} due to player ${role} disconnect.`);
        
        const opponent = role === 'playerA' ? match.playerB : match.playerA;
        if (opponent && opponent.ws) {
            opponent.ws.send(JSON.stringify({ event: 'rival_disconnected', payload: 'Opponent disconnected' }));
        }
        activeMatches.delete(matchId);
    }
}

// Keep connection alive
const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
        if (ws.isAlive === false) {
            console.log('[WS-Server] Terminating unresponsive connection.');
            return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
    });
}, 30000);

server.listen(PORT, () => {
    console.log(`[WS-Server] Listening on port ${PORT}`);
});
