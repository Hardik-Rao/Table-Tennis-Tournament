const { pool } = require('../config/db');

// Get all scores
const getScores = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM scores');
    res.status(200).json(result.rows); // Send back all scores
  } catch (error) {
    console.error('Error retrieving scores:', error);
    res.status(500).json({ error: 'Failed to retrieve scores' });
  }
};

// Get score by ID
const getScoreById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM scores WHERE score_id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Score not found' });
    }

    res.status(200).json(result.rows[0]); // Return the score found by ID
  } catch (error) {
    console.error('Error retrieving score by ID:', error);
    res.status(500).json({ error: 'Failed to retrieve score by ID' });
  }
};

// Add a new score
const addScore = async (req, res) => {
  const { player, points } = req.body;

  if (!player || !points) {
    return res.status(400).json({ error: 'Player and points are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO scores (player, points, timestamp) VALUES ($1, $2, $3) RETURNING *',
      [player, points, new Date()]
    );

    res.status(201).json(result.rows[0]); // Return the newly added score
  } catch (error) {
    console.error('Error adding score:', error);
    res.status(500).json({ error: 'Failed to add score' });
  }
};

// Update a score
const updateScore = async (req, res) => {
  const { id } = req.params;
  const { player, points } = req.body;

  if (!player || !points) {
    return res.status(400).json({ error: 'Player and points are required' });
  }

  try {
    const result = await pool.query(
      'UPDATE scores SET player = $1, points = $2, timestamp = $3 WHERE score_id = $4 RETURNING *',
      [player, points, new Date(), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Score not found' });
    }

    res.status(200).json(result.rows[0]); // Return the updated score
  } catch (error) {
    console.error('Error updating score:', error);
    res.status(500).json({ error: 'Failed to update score' });
  }
};
module.exports = {
    getScores,
    getScoreById,
    addScore,
    updateScore,
  };
