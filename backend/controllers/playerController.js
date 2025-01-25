const { pool } = require('../config/db');

// Function to add a new player
const addPlayer = async (req, res) => {
  const { name, institute, age, rank = 0, points = 0 } = req.body;

  console.log(req.body)
  if (!name || !age) {
    return res.status(500).json({ error: 'Name and age are required.' });
  }

  try {
    // Adjusted query to not include img
    const result = await pool.query(
      'INSERT INTO players (name, institute, age, rank, points) VALUES ($1, $2, $3, $4, $5) RETURNING player_id',
      [name, institute, age, rank, points]
    );

    res.status(201).json({
      message: 'Player added successfully',
      player_id: result.rows[0].player_id,
    });
  } catch (error) {
    console.error('Error adding player:', error);
    res.status(500).json({ error: 'Failed to add player' });
  }
};

// Function to get all players
const getAllPlayers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM players');

    // Mapping players, no img data is included anymore
    const players = result.rows.map((player) => ({
      player_id: player.player_id,
      name: player.name,
      institute: player.institute,
      age: player.age,
      rank: player.rank,
      points: player.points,
    }));

    res.status(200).json(players);
  } catch (error) {
    console.error('Error retrieving players:', error);
    res.status(500).json({ error: 'Failed to retrieve players' });
  }
};

// Optional: Function to get a player by ID (if needed)


// Optional: Function to update a player's details (if needed)

// Optional: Function to delete a player (if needed)
const deletePlayer = async (req, res) => {
  const { name } = req.query; // Retrieve 'name' from query parameters

  if (!name) {
    return res.status(400).json({ error: 'Player name is required.' });
  }

  try {
    const result = await pool.query(
      'DELETE FROM players WHERE name = $1 RETURNING name',
      [name]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Player not found.' });
    }

    res.status(200).json({ message: `Player "${name}" deleted successfully.` });
  } catch (error) {
    console.error('Error deleting player:', error);
    res.status(500).json({ error: 'Failed to delete player.' });
  }
};






module.exports = {
  addPlayer,
  getAllPlayers,
 // getPlayerById,
 // updatePlayer,
  deletePlayer,
};
