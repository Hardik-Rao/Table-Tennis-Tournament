const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { getAllMatches,generateMatches } = require('../controllers/matchController');

// Fetch all matches
router.get('/', getAllMatches);
// Add a new match
router.post('/generate', generateMatches);

module.exports = router;
