// socket.js
const socketIo = require('socket.io');

let io;

// Function to initialize socket.io
const initSocket = (server) => {
  io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for score updates from frontend
    socket.on('sendScore', (scoreData) => {
      console.log('Score update received:', scoreData);
      io.emit('liveScore', scoreData); // Emit the updated score to all connected clients
    });

    // Handle socket disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};

// Export the socket.io initialization function
module.exports = { initSocket };
