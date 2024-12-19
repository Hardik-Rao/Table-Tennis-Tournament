const express = require('express');
const router = express.Router();
const { getRankings } = require('../controllers/rankingController');

// Ranking routes
router.get('/', getRankings);              // Get player rankings

module.exports = router;
