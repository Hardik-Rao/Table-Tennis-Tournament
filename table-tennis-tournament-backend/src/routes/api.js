const express = require('express');
const router = express.Router();
const { getAllPlayers } = require('../controllers/playerController');
const authRoutes = require('./authRoutes');

// Player routes
router.get('/players', getAllPlayers);

// Authentication routes
router.use('/auth', authRoutes);

module.exports = router;