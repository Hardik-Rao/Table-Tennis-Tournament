

const express = require('express');
const router = express.Router();
const { getLiveScores, updateLiveScore } = require('../controllers/liveScoreController');

// Route for getting live scores
router.get('/', getLiveScores); // Get all live scores

// Route for updating live scores
router.put('/', updateLiveScore); // Update a live score

module.exports = router;
