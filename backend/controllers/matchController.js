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
/**
 * Determines the status of the match based on the current time in IST.
 * @param {Date} matchDateTime - The date and time of the match.
 * @returns {string} - The status: 'finished', 'running', or 'soon'.
 */
const determineMatchStatus = (matchDateTime) => {
  const now = new Date();
  const IST_OFFSET = 330; // IST offset in minutes (UTC+5:30)
  const currentIST = new Date(now.getTime() + IST_OFFSET * 60 * 1000);

  if (currentIST > matchDateTime) {
      return 'finished';
  } else if (
      currentIST.toDateString() === matchDateTime.toDateString() &&
      currentIST.getHours() === matchDateTime.getHours()
  ) {
      return 'running';
  } else {
      return 'soon';
  }
};
// Function to add a new match
const generateMatches = async (req, res) => {
  try {
      // Fetch all players from the players table
      const allPlayersResult = await pool.query('SELECT name FROM players');
      const allPlayers = allPlayersResult.rows.map((row) => row.name);

      // Fetch players already in matches
      const matchedPlayersResult = await pool.query(`
          SELECT DISTINCT player1_name AS name FROM match
          UNION
          SELECT DISTINCT player2_name AS name FROM match
      `);
      const matchedPlayers = matchedPlayersResult.rows.map((row) => row.name);

      // Filter out players who already have matches
      const newPlayers = allPlayers.filter(player => !matchedPlayers.includes(player));

      if (newPlayers.length === 0) {
          return res.status(400).json({ error: 'No new players available to create matches' });
      }

      // Shuffle new players randomly
      for (let i = newPlayers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newPlayers[i], newPlayers[j]] = [newPlayers[j], newPlayers[i]];
      }

      // Prepare matches
      const matches = [];
      const defaultVenue = 'ABC Stadium';
      let currentDate = new Date(); // Start from today
      currentDate.setHours(15, 0, 0, 0); // Set the time to 3 PM IST
      const endTime = new Date(currentDate);
      endTime.setHours(19, 0, 0, 0); // Set end time to 7 PM IST

      while (newPlayers.length > 1) {
          if (currentDate >= endTime) {
              // If the time exceeds 7 PM, shift to the next day at 3 PM
              currentDate.setDate(currentDate.getDate() + 1);
              currentDate.setHours(15, 0, 0, 0);
          }

          matches.push({
              player1_name: newPlayers.pop(),
              player2_name: newPlayers.pop(),
              player1_score: 0,
              player2_score: 0,
              match_date: currentDate.toISOString(),
              venue: defaultVenue,
              status: determineMatchStatus(currentDate),
          });

          // Increment time by 1 hour for the next match
          currentDate.setHours(currentDate.getHours() + 1);
      }

      // If there's an odd player, give them a bye
      if (newPlayers.length === 1) {
          if (currentDate >= endTime) {
              // Shift to the next day if beyond 7 PM
              currentDate.setDate(currentDate.getDate() + 1);
              currentDate.setHours(15, 0, 0, 0);
          }

          matches.push({
              player1_name: newPlayers.pop(),
              player2_name: 'no opponent registered yet',
              player1_score: 0,
              player2_score: 0,
              match_date: currentDate.toISOString(),
              venue: defaultVenue,
              status: determineMatchStatus(currentDate),
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
