const jwt = require('jsonwebtoken');

let ioInstance = null;

/**
 * Initializes Socket.IO connection handling.
 * Each authenticated client joins a private room named after their userId,
 * so notifications can be emitted to exactly the right user
 * (io.to(userId).emit(...)) instead of broadcasting to everyone.
 */
const initSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Client should emit "join" with their userId right after connecting.
    // We also support passing a JWT token for a slightly more secure join.
    socket.on('join', (payload) => {
      try {
        let userId = payload;

        // Support { token } payloads as well as plain userId strings
        if (payload && typeof payload === 'object' && payload.token) {
          const decoded = jwt.verify(payload.token, process.env.JWT_SECRET);
          userId = decoded.id;
        } else if (payload && typeof payload === 'object' && payload.userId) {
          userId = payload.userId;
        }

        if (userId) {
          socket.join(userId.toString());
          console.log(`👤 Socket ${socket.id} joined room: ${userId}`);
          socket.emit('joined', { room: userId.toString() });
        }
      } catch (error) {
        console.error('Socket join error:', error.message);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });
};

/**
 * Emits a notification event to a specific user's private room.
 * Used by controllers right after a notification is saved to MongoDB.
 */
const emitToUser = (userId, event, data) => {
  if (!ioInstance) {
    console.warn('Socket.IO not initialized yet — skipping emit');
    return;
  }
  ioInstance.to(userId.toString()).emit(event, data);
};

module.exports = { initSocket, emitToUser };
