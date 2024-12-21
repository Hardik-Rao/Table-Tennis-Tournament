const { pool } = require('../config/db');

// Function to get all matches
const getAllMatches = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM match ORDER BY match_date DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
};
// Function to get a match by ID
// Function to create a match for an open tournament
// Function to add a new match
const generateMatches = async (req, res) => {
  try {
    // Fetch all players from the players table
    const playersResult = await pool.query('SELECT name FROM players');
    const players = playersResult.rows.map((row) => row.name);

    if (players.length === 0) {
      return res.status(400).json({ error: 'No players available to create matches' });
    }

    // Shuffle players randomly
    for (let i = players.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [players[i], players[j]] = [players[j], players[i]];
    }

    // Prepare matches
    const matches = [];
    const defaultDate = '2004-12-25';
    const defaultVenue = 'ABC Stadium';
    const defaultStatus = 'Soon';

    while (players.length > 1) {
      const player1 = players.pop();
      const player2 = players.pop();
      matches.push({
        player1_name: player1,
        player2_name: player2,
        player1_score: 0,
        player2_score: 0,
        match_date: defaultDate,
        venue: defaultVenue,
        status: defaultStatus,
      });
    }

    // If there's an odd player, give them a bye
    if (players.length === 1) {
      matches.push({
        player1_name: players.pop(),
        player2_name: 'Bye',
        player1_score: 0,
        player2_score: 0,
        match_date: defaultDate,
        venue: defaultVenue,
        status: defaultStatus,
      });
    }

    // Insert matches into the match table
    const insertQuery = `
      INSERT INTO match (player1_name, player2_name, player1_score, player2_score, match_date, venue, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    for (const match of matches) {
      await pool.query(insertQuery, [
        match.player1_name,
        match.player2_name,
        match.player1_score,
        match.player2_score,
        match.match_date,
        match.venue,
        match.status,
      ]);
    }

    res.status(201).json({ message: 'Matches generated successfully', matches });
  } catch (error) {
    console.error('Error generating matches:', error);
    res.status(500).json({ error: 'Failed to generate matches' });
  }
};
// Function to update a match's details
// Function to delete a match
module.exports = { 
  getAllMatches, 
 // getMatchById, 
  generateMatches, 
  //updateMatch, 
 // deleteMatch, 
 
};
