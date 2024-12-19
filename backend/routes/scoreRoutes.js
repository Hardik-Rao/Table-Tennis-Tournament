const express = require('express');
const router = express.Router();
const { getScores, getScoreById, addScore, updateScore } = require('../controllers/scoreController');

// Score routes
router.get('/', getScores);           // List all scores
router.get('/:id', getScoreById);        // Get score by match ID
router.post('/', addScore);              // Submit a new score
router.put('/:id', updateScore);         // Update a score

module.exports = router;
