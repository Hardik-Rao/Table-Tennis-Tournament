require('dotenv').config();
const { sequelize } = require('./src/models');
const app = require('./src/app');
const http = require('http');
const { init } = require('./src/socket'); // import init from socket.js

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize Socket.IO once here
const io = init(server);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Optionally, send current scores on new connection using your currentLiveScores array or retrieve from database

  // Listen for admin score updates
  socket.on('adminUpdateScore', (updatedMatch) => {
    // Update your live score data here, for example:
    // currentLiveScores logic can be moved here or managed globally if needed

    // Broadcast updated live scores to all clients
    io.emit('liveScoresUpdate', updatedMatch);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

sequelize.authenticate()
  .then(() => {
    console.log('✅ PostgreSQL database connected.');
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error('❌ Unable to connect to the database:', error);
  });
