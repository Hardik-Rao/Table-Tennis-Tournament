// playerRoute.js
const express = require('express');
const { addPlayer, getAllPlayers } = require('../controllers/playerController');

const router = express.Router();

// No need for multer middleware anymore
router.post('/', addPlayer);
router.get('/', getAllPlayers);

module.exports = router;
