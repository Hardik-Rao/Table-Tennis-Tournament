const express = require('express');
const router = express.Router();
const { getAllPlayers, getTeamPlayers } = require('../controllers/playerController');
const { getAllTeams, getTeamById } = require('../controllers/teamController');
const authRoutes = require('./authRoutes');

// Player routes
router.get('/players', getAllPlayers);
router.get('/players/team/:teamId', getTeamPlayers);

// Team routes
router.get('/teams', getAllTeams); // Get all teams with players for admin dashboard
router.get('/teams/:teamId', getTeamById); // Get specific team by ID

// Authentication routes
router.use('/auth', authRoutes);

module.exports = router;