const express = require('express');
const multer = require('multer');
const { addPlayer, getAllPlayers, getPlayerById, updatePlayer, deletePlayer } = require('../controllers/playerController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Specify destination for uploaded files

// Define player-related routes
router.post('/', upload.single('image'), addPlayer); // Include multer middleware for image upload
router.get('/', getAllPlayers);
router.get('/:id', getPlayerById);
router.put('/:id', upload.single('image'), updatePlayer); // Optional: allow image updates
router.delete('/:id', deletePlayer);

module.exports = router;
