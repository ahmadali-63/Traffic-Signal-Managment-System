const app = require('./src/app');
const http = require('http');
const { initializeSocket } = require('./src/config/socket');
const connectDB = require('./src/config/database');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

// Connect to MongoDB
connectDB();

// Start server
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Socket.IO ready`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
    console.log('Server closed');
    process.exit(0);
    });
});