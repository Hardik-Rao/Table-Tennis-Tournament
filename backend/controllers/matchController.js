const { pool } = require('../config/db');

// Function to get all matches
const getAllMatches = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM matches ORDER BY match_date DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
};

// Function to get a match by ID
const getMatchById = async (req, res) => {
  const { id } = req.params; // Extract match ID from the URL
  try {
    const result = await pool.query('SELECT * FROM matches WHERE match_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }
    res.status(200).json(result.rows[0]); // Return match data by ID
  } catch (error) {
    console.error('Error fetching match:', error);
    res.status(500).json({ error: 'Failed to fetch match' });
  }
};

// Function to create a match if eligible
const createMatchIfEligible = async () => {
  try {
    // Step 1: Get all teams with at least 3 players
    const teamsResult = await pool.query(`
      SELECT team, COUNT(*) as player_count
      FROM players
      GROUP BY team
      HAVING COUNT(*) >= 3
    `);

    if (teamsResult.rows.length < 2) {
      console.log("Not enough teams with enough players to create a match.");
      return;
    }

    // Step 2: Select two teams with at least 3 players each
    const team1 = teamsResult.rows[0].team;
    const team2 = teamsResult.rows[1].team;

    // Step 3: Select 3 players randomly from each team
    const team1PlayersResult = await pool.query(`
      SELECT * FROM players WHERE team = $1 ORDER BY RANDOM() LIMIT 3
    `, [team1]);

    const team2PlayersResult = await pool.query(`
      SELECT * FROM players WHERE team = $1 ORDER BY RANDOM() LIMIT 3
    `, [team2]);

    if (team1PlayersResult.rows.length < 3 || team2PlayersResult.rows.length < 3) {
      console.log("One of the teams does not have enough players to create a match.");
      return;
    }

    // Step 4: Create a new match entry in the matches table
    const matchDate = new Date(); // Use the current date and time as match date
    const matchResult = await pool.query(`
      INSERT INTO matches (team1_name, team2_name, team1_score, team2_score, match_date, status)
      VALUES ($1, $2, 0, 0, $3, 'scheduled') RETURNING match_id
    `, [team1, team2, matchDate]);

    const matchId = matchResult.rows[0].match_id;

    console.log(`Match created successfully between ${team1} and ${team2} with match ID: ${matchId}`);
  } catch (error) {
    console.error('Error creating match:', error);
  }
};

// Function to add a new match
const addMatch = async (req, res) => {
  const { team1_id, team2_id, match_date, venue, team1_score = 0, team2_score = 0 } = req.body;

  if (!team1_id || !team2_id || !match_date || !venue) {
    return res.status(400).json({ error: 'Team IDs, match date, and venue are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO matches (team1_id, team2_id, match_date, venue, team1_score, team2_score) VALUES ($1, $2, $3, $4, $5, $6) RETURNING match_id',
      [team1_id, team2_id, match_date, venue, team1_score, team2_score]
    );

    res.status(201).json({
      message: 'Match added successfully',
      match_id: result.rows[0].match_id,
    });
  } catch (error) {
    console.error('Error adding match:', error);
    res.status(500).json({ error: 'Failed to add match' });
  }
};

// Function to update a match's details
const updateMatch = async (req, res) => {
  const { id } = req.params;
  const { team1_name, team2_name, team1_score, team2_score, match_date, venue } = req.body;

  if (!team1_name || !team2_name || !team1_score || !team2_score || !match_date || !venue) {
    return res.status(400).json({ error: 'Team names, scores, match date, and venue are required' });
  }

  try {
    const result = await pool.query(
      'UPDATE matches SET team1_name = $1, team2_name = $2, team1_score = $3, team2_score = $4, match_date = $5, venue = $6 WHERE match_id = $7 RETURNING *',
      [team1_name, team2_name, team1_score, team2_score, match_date, venue, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }

    res.status(200).json({
      message: 'Match updated successfully',
      match: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating match:', error);
    res.status(500).json({ error: 'Failed to update match' });
  }
};

// Function to delete a match
const deleteMatch = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM matches WHERE match_id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }

    res.status(200).json({ message: 'Match deleted successfully' });
  } catch (error) {
    console.error('Error deleting match:', error);
    res.status(500).json({ error: 'Failed to delete match' });
  }
};

module.exports = { 
  getAllMatches, 
  getMatchById, 
  addMatch, 
  updateMatch, 
  deleteMatch, 
  createMatchIfEligible 
};
