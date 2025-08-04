require('dotenv').config();
const { connectDB } = require('./src/config/db'); // Adjust the path if needed
const app = require('./src/app');
const http = require('http');
const { init } = require('./src/socket');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = init(server);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('adminUpdateScore', (updatedMatch) => {
    io.emit('liveScoresUpdate', updatedMatch);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});
console.log('Starting DB connection attempt...');
// Ensure DB connection before starting server
connectDB()
  .then(() => {
    console.log('✅ PostgreSQL database connected.');
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  });
console.log('DATABASE_URL:', process.env.DATABASE_URL);
