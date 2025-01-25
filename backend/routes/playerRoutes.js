// playerRoute.js
const express = require('express');
const { addPlayer, getAllPlayers ,deletePlayer} = require('../controllers/playerController');

const router = express.Router();

// No need for multer middleware anymore
router.post('/', addPlayer);
router.get('/', getAllPlayers);
router.delete('/',deletePlayer);
module.exports = router;
