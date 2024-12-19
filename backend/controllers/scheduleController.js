const { pool } = require('../config/db');

// Function to get the full tournament schedule
const getTournamentSchedule = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM schedule');
    res.status(200).json(result.rows); // Return the full schedule
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
};

// Function to get the schedule for a specific day
const getScheduleByDay = async (req, res) => {
  const { day } = req.params;  // Extract day from URL parameter

  try {
    const result = await pool.query('SELECT * FROM schedule WHERE day = $1', [day]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No schedule found for this day' });
    }

    res.status(200).json(result.rows); // Return the schedule for the specified day
  } catch (error) {
    console.error('Error fetching schedule for day:', error);
    res.status(500).json({ error: 'Failed to fetch schedule for this day' });
  }
};

module.exports = { getTournamentSchedule, getScheduleByDay };

