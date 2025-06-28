const express = require('express');
const router = express.Router();
const { getAllPlayers, getTeamPlayers } = require('../controllers/playerController');
const { getAllTeams, getTeamById } = require('../controllers/teamController');
const { 
  getAllMatches, 
  createMatch, 
  updateMatch, 
  deleteMatch, 
  updateMatchStatus 
} = require('../controllers/matchController');
const authRoutes = require('./authRoutes');

// Player routes
router.get('/players', getAllPlayers);
router.get('/players/team/:teamId', getTeamPlayers);

// Team routes
router.get('/teams', getAllTeams); // Get all teams with players for admin dashboard
router.get('/teams/:teamId', getTeamById); // Get specific team by ID

// Match routes
router.get('/matches', getAllMatches); // Get all matches
router.post('/matches', createMatch); // Create new match
router.put('/matches/:matchId', updateMatch); // Update match
router.delete('/matches/:matchId', deleteMatch); // Delete match
router.patch('/matches/:matchId/status', updateMatchStatus); // Update match status/scores

// Authentication routes
router.use('/auth', authRoutes);

module.exports = router;