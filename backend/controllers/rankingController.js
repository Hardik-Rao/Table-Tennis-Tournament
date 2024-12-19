// Example for Ranking Controller

const { pool } = require('../config/db');

const getRankings = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rankings ORDER BY points DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching rankings:', error);
    res.status(500).json({ error: 'Failed to fetch rankings' });
  }
};

module.exports = { getRankings };
