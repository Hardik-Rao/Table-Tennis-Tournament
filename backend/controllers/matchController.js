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
const generateMatches = async (req, res) => {
    try {
        // Fetch all players from the players table
        const allPlayersResult = await pool.query('SELECT name FROM players');
        const allPlayers = allPlayersResult.rows.map((row) => row.name);

        // Fetch unmatched player (if any)
        const unmatchedPlayerResult = await pool.query(`
            SELECT player1_name 
            FROM match 
            WHERE player2_name = 'no opponent registered yet'
            LIMIT 1
        `);
        const unmatchedPlayer =
            unmatchedPlayerResult.rows.length > 0
                ? unmatchedPlayerResult.rows[0].player1_name
                : null;

        // Filter new players who are not already matched
        const matchedPlayersResult = await pool.query(`
            SELECT DISTINCT player1_name AS name FROM match
            UNION
            SELECT DISTINCT player2_name AS name FROM match
        `);
        const matchedPlayers = matchedPlayersResult.rows.map((row) => row.name);

        const newPlayers = allPlayers.filter(
            (player) => !matchedPlayers.includes(player)
        );

        if (newPlayers.length === 0) {
            return res
                .status(400)
                .json({ error: 'No new players available to create matches' });
        }

        const defaultVenue = 'ABC Stadium';
        let currentDate;

        // Fetch the latest match date and time from the database
        const latestMatchResult = await pool.query(`
            SELECT MAX(match_date) AS latest_match_date
            FROM match
        `);
        const latestMatchDate = latestMatchResult.rows[0].latest_match_date;

        if (latestMatchDate) {
            currentDate = new Date(latestMatchDate); // Start from the latest match's time
            currentDate.setHours(currentDate.getHours() + 1); // Increment by 1 hour
        } else {
            // If no matches exist, start from today at 3 PM
            currentDate = new Date();
            currentDate.setHours(15, 0, 0, 0); // 3 PM
        }

        // Define the daily time range
        const startTime = new Date(currentDate);
        startTime.setHours(15, 0, 0, 0); // 3 PM
        const endTime = new Date(currentDate);
        endTime.setHours(19, 0, 0, 0); // 7 PM

        // Ensure matches are only scheduled within the time range
        if (currentDate < startTime) {
            currentDate = startTime; // Reset to 3 PM if earlier
        } else if (currentDate >= endTime) {
            currentDate.setDate(currentDate.getDate() + 1);
            currentDate.setHours(15, 0, 0, 0); // 3 PM
        }

        const matches = [];

        // If there's an unmatched player, pair them with the first new player
        if (unmatchedPlayer && newPlayers.length > 0) {
            const newPlayer = newPlayers.pop();

            matches.push({
                player1_name: unmatchedPlayer,
                player2_name: newPlayer,
                player1_score: 0,
                player2_score: 0,
                match_date: currentDate.toISOString(),
                venue: defaultVenue,
                status: determineMatchStatus(currentDate),
            });

            // Increment time for the next match
            currentDate.setHours(currentDate.getHours() + 1);
            if (currentDate >= endTime) {
                currentDate.setDate(currentDate.getDate() + 1);
                currentDate.setHours(15, 0, 0, 0);
            }

            // Remove the unmatched player from the "no opponent registered yet" state
            await pool.query(
                `DELETE FROM match WHERE player1_name = $1 AND player2_name = 'no opponent registered yet'`,
                [unmatchedPlayer]
            );
        }

        // Create matches for remaining new players
        while (newPlayers.length > 1) {
            matches.push({
                player1_name: newPlayers.pop(),
                player2_name: newPlayers.pop(),
                player1_score: 0,
                player2_score: 0,
                match_date: currentDate.toISOString(),
                venue: defaultVenue,
                status: determineMatchStatus(currentDate),
            });

            // Increment time for the next match
            currentDate.setHours(currentDate.getHours() + 1);
            if (currentDate >= endTime) {
                currentDate.setDate(currentDate.getDate() + 1);
                currentDate.setHours(15, 0, 0, 0);
            }
        }

        // Handle the last player (if odd number of new players)
        if (newPlayers.length === 1) {
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
