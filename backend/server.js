const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const { pool } = require('./config/db'); // Import database pool configuration

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json()); // Parse incoming JSON requests

// Import routes
const matchRoutes = require('./routes/matchRoutes'); // Routes for matches
const playerRoutes = require('./routes/playerRoutes'); // Routes for players
const rankingRoutes = require('./routes/rankingRoutes'); // Routes for rankings
const liveScoreRoutes = require('./routes/liveScoreRoutes'); // Routes for live scores
const registrationAdminRoutes = require('./routes/registrationAdminRoutes'); // Routes for user-related actions (e.g., login, register)
//const registrationPlayerRoutes = require('./routes/registrationPlayerRoutes');
// Register routes
app.use('/api/matches', matchRoutes); // Match-related endpoints
app.use('/api/players', playerRoutes); // Player-related endpoints
app.use('/api/rankings', rankingRoutes); // Ranking-related endpoints
app.use('/api/live-scores', liveScoreRoutes); // Live score endpoints
app.use('/api/admins', registrationAdminRoutes); // User-related endpoints (e.g., /register, /login)
//app.use('/api/player', registrationPlayerRoutes);
// Serve React frontend (Ensure correct path)
app.use(express.static(path.join(__dirname, 'build'))); // Adjusted to point to 'build' in the backend folder

// Fallback route for React app to handle all the routes and return index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html')); // Corrected fallback to serve index.html from 'build'
});

// Start the server
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
