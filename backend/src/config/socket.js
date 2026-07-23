const { Server } = require('socket.io');
let io;

const initializeSocket = (server) => {
    const allowedOrigins = [
        process.env.CLIENT_URL,
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://localhost:3000'
    ].filter(Boolean);

    io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true
    }
    });
    io.on('connection', (socket) => {
    console.log(`🟢 Client connected: ${socket.id}`);
    // Send current signal state to new client
    const signalService = require('../services/signalService');
    const currentState = signalService.getCurrentState();
    socket.emit('signal:state', currentState);
    socket.on('disconnect', () => {
        console.log(`🔴 Client disconnected: ${socket.id}`);
});
});
    return io;
};

const getIO = () => {
    if (!io) {
    throw new Error('Socket.IO not initialized');
    }
    return io;
};

module.exports = { initializeSocket, getIO };