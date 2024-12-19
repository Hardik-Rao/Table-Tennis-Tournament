const { pool } = require('../config/db');

// Function to add a new player
const addPlayer = async (req, res) => {
  const { name, institute, age, rank = 0, points = 0 } = req.body;
  const img = req.file ? req.file.path : null; // Access uploaded file's path

  if (!name || !age) {
    return res.status(400).json({ error: 'Name and age are required.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO players (name, institute, age, rank, points, img) VALUES ($1, $2, $3, $4, $5, $6) RETURNING player_id',
      [name, institute, age, rank, points, img]
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
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving players:', error);
    res.status(500).json({ error: 'Failed to retrieve players' });
  }
};

// Function to get player by ID
const getPlayerById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Player ID is required.' });
  }

  try {
    const result = await pool.query('SELECT * FROM players WHERE player_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error retrieving player:', error);
    res.status(500).json({ error: 'Failed to retrieve player' });
  }
};

// Function to update player details
const updatePlayer = async (req, res) => {
  const { player_id } = req.params;
  const { name, institute, age, rank, points } = req.body;
  const img = req.file ? req.file.path : null; // Handle uploaded image

  if (!player_id) {
    return res.status(400).json({ error: 'Player ID is required.' });
  }

  try {
    const fields = [];
    const values = [];
    let index = 1;

    if (name) {
      fields.push(`name = $${index++}`);
      values.push(name);
    }
    if (institute) {
      fields.push(`institute = $${index++}`);
      values.push(institute);
    }
    if (age) {
      fields.push(`age = $${index++}`);
      values.push(age);
    }
    if (rank) {
      fields.push(`rank = $${index++}`);
      values.push(rank);
    }
    if (points) {
      fields.push(`points = $${index++}`);
      values.push(points);
    }
    if (img) {
      fields.push(`img = $${index++}`);
      values.push(img);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields provided for update.' });
    }

    values.push(player_id);
    const query = `UPDATE players SET ${fields.join(', ')} WHERE player_id = $${index} RETURNING *`;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found.' });
    }

    res.status(200).json({
      message: 'Player updated successfully',
      player: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating player:', error);
    res.status(500).json({ error: 'Failed to update player' });
  }
};

// Function to delete a player
const deletePlayer = async (req, res) => {
  const { player_id } = req.params;

  if (!player_id) {
    return res.status(400).json({ error: 'Player ID is required.' });
  }

  try {
    const result = await pool.query('DELETE FROM players WHERE player_id = $1 RETURNING *', [player_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found.' });
    }

    res.status(200).json({ message: 'Player deleted successfully' });
  } catch (error) {
    console.error('Error deleting player:', error);
    res.status(500).json({ error: 'Failed to delete player' });
  }
};

module.exports = {
  addPlayer,
  getAllPlayers,
  getPlayerById,
  updatePlayer,
  deletePlayer,
};
