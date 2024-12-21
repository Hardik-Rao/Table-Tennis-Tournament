const express = require('express');
const http = require('http');
const cors = require('cors');
const { pool } = require('./config/db'); // Import pool from db.js

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const matchRoutes = require('./routes/matchRoutes');
const playerRoutes = require('./routes/playerRoutes'); // For managing players
const rankingRoutes = require('./routes/rankingRoutes'); // For player rankings
const liveScoreRoutes = require('./routes/liveScoreRoutes'); // For live scores

// Register routes
app.use('/api/matches', matchRoutes); // Match-related endpoints
app.use('/api/players', playerRoutes); // Player-related endpoints
app.use('/api/rankings', rankingRoutes); // Ranking-related endpoints
app.use('/api/live-scores', liveScoreRoutes); // Live score endpoints

// Basic server endpoint
app.get('/', (req, res) => {
    res.send('Backend server is running');
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
