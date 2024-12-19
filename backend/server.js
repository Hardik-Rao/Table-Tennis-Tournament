const express = require('express');
const http = require('http');
const cors = require('cors');
const { pool } = require('./config/db'); // Import pool from db.js
const { initSocket } = require('./socket'); // Import socket.js
const logger = require('./utils/logger');

const app = express();
const server = http.createServer(app);

app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Enable JSON parsing
app.use('/uploads', express.static('uploads')); // Serve uploaded files
// Import routes
const scoreRoutes = require('./routes/scoreRoutes');
const playerRoutes = require('./routes/playerRoutes');
const matchRoutes = require('./routes/matchRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const liveScoreRoutes = require('./routes/liveScoreRoutes');
const mealRoutes = require('./routes/mealRoutes');
const rankingRoutes = require('./routes/rankingRoutes');

// Register routes
app.use('/api/scores', scoreRoutes); // Score-related routes
app.use('/api/players', playerRoutes); // Player-related routes
app.use('/api/matches', matchRoutes); // Match-related routes
app.use('/api/schedule', scheduleRoutes); // Schedule-related routes
app.use('/api/live-scores', liveScoreRoutes); // Live score-related routes
app.use('/api/meal', mealRoutes); // Meal-related routes
app.use('/api/rankings', rankingRoutes); // Rankings-related routes

// Basic server endpoint
app.get('/', (req, res) => {
    res.send('Backend server is running');
    logger.info('Server is running on the root route');
});

// Test database connection route
app.get('/test-db', async (req, res) => {
    try {
        const client = await pool.connect(); // Use pool to get a client
        const result = await client.query('SELECT NOW()'); // Query to check the connection
        res.status(200).json({ message: 'Database connection successful', time: result.rows[0] });
        client.release(); // Release the client back to the pool
    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).json({ error: 'Failed to connect to the database' });
    }
});

// Initialize socket.io for live score updates
initSocket(server);

// Start the server
const PORT = process.env.PORT || 5000; // Ensure this is declared only once
server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
