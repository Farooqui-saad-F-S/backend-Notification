require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

const app = require('./app');
const connectDB = require('./config/db');
const { initSocket } = require('./sockets/socket');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB before accepting traffic
connectDB();

// Wrap the Express app in a raw HTTP server so Socket.IO can attach to it
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

initSocket(io);

server.listen(PORT, () => {
  console.log(`🚀 Notification Center backend running on http://localhost:${PORT}`);
  console.log(`🔌 Socket.IO listening for real-time connections`);
});
