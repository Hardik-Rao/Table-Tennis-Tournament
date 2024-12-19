const express = require('express');
const router = express.Router();
const { 
    getAllMatches, 
    getMatchById, 
    addMatch, 
    updateMatch, 
    deleteMatch, 
    createMatchIfEligible 
} = require('../controllers/matchController');

// Match Routes
router.get('/', getAllMatches); // List all matches
router.get('/:id', getMatchById); // Get match by ID
router.put('/:id', updateMatch); // Update match details
router.post('/', addMatch); // Add a new match
router.delete('/:id', deleteMatch); // Delete a match

// Trigger the creation of matches
router.post('/create-match', async (req, res) => {
    try {
        await createMatchIfEligible(); // This function checks eligibility and creates matches
        res.status(200).json({ message: 'Matches generated successfully.' });
    } catch (error) {
        console.error('Error during match creation:', error);
        res.status(500).json({ error: 'Failed to create matches.' });
    }
});

module.exports = router;
