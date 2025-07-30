const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

exports.getLeaderboard = async (req, res) => {
  try {
    // Raw SQL query groups and counts wins per team where status=completed and winner_team is not null
    const leaderboard = await sequelize.query(
      `SELECT winner_team AS team_name, COUNT(*) AS wins
       FROM matches
       WHERE status = 'completed' AND winner_team IS NOT NULL
       GROUP BY winner_team
       ORDER BY wins DESC`,
      { type: QueryTypes.SELECT }
    );

    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};
