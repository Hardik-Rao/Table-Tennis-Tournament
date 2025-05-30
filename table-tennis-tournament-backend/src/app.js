// src/app.js
const express = require('express');
const cors = require('cors'); // For handling cross-origin requests

const app = express();

// Middleware
app.use(express.json()); // Body parser for JSON requests
app.use(cors()); // Enable CORS for all routes (you might want to restrict this in production)

// Define a simple root route for testing if the server is alive
app.get('/', (req, res) => {
    res.send('API is running...');
});

// TODO: Future routes will go here
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/tournaments', require('./routes/tournamentRoutes'));

module.exports = app;