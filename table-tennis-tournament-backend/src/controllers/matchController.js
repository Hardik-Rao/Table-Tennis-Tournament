const { Match } = require('../models');

// Get all matches
exports.getAllMatches = async (req, res) => {
  try {
    const matches = await Match.findAll({
      order: [['match_date', 'ASC'], ['match_time', 'ASC']]
    });

    // Transform data to match frontend expectations
    const formattedMatches = matches.map(match => ({
      id: match.match_id,
      team1: {
        id: Math.random(), // Since we're not linking to actual teams yet
        name: match.team1_name,
        sport: match.sport
      },
      team2: {
        id: Math.random(),
        name: match.team2_name,
        sport: match.sport
      },
      date: match.match_date,
      time: match.match_time,
      venue: match.venue,
      sport: match.sport,
      status: match.status,
      team1_score: match.team1_score,
      team2_score: match.team2_score,
      winner_team: match.winner_team
    }));

    res.json({
      success: true,
      data: {
        matches: formattedMatches,
        totalMatches: formattedMatches.length,
        scheduledCount: formattedMatches.filter(m => m.status === 'scheduled').length,
        ongoingCount: formattedMatches.filter(m => m.status === 'ongoing').length,
        completedCount: formattedMatches.filter(m => m.status === 'completed').length
      }
    });

  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

// Create new match
exports.createMatch = async (req, res) => {
  try {
    const {
      team1Name,
      team2Name,
      date,
      time,
      venue,
      sport
    } = req.body;

    // Validation
    if (!team1Name || !team2Name || !date || !time || !venue || !sport) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (team1Name.trim().toLowerCase() === team2Name.trim().toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: 'Team names must be different'
      });
    }

    // Create the match
    const match = await Match.create({
      team1_name: team1Name.trim(),
      team2_name: team2Name.trim(),
      match_date: date,
      match_time: time,
      venue: venue,
      sport: sport,
      status: 'scheduled'
    });

    // Format response to match frontend expectations
    const formattedMatch = {
      id: match.match_id,
      team1: {
        id: Math.random(),
        name: match.team1_name,
        sport: match.sport
      },
      team2: {
        id: Math.random(),
        name: match.team2_name,
        sport: match.sport
      },
      date: match.match_date,
      time: match.match_time,
      venue: match.venue,
      sport: match.sport,
      status: match.status
    };

    res.status(201).json({
      success: true,
      message: 'Match scheduled successfully!',
      data: formattedMatch
    });

  } catch (error) {
    console.error('Error creating match:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

// Update match
exports.updateMatch = async (req, res) => {
  try {
    const { matchId } = req.params;
    const {
      team1Name,
      team2Name,
      date,
      time,
      venue,
      sport
    } = req.body;

    // Find the match
    const match = await Match.findByPk(matchId);
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    // Validation
    if (!team1Name || !team2Name || !date || !time || !venue || !sport) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (team1Name.trim().toLowerCase() === team2Name.trim().toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: 'Team names must be different'
      });
    }

    // Update the match
    await match.update({
      team1_name: team1Name.trim(),
      team2_name: team2Name.trim(),
      match_date: date,
      match_time: time,
      venue: venue,
      sport: sport
    });

    // Format response
    const formattedMatch = {
      id: match.match_id,
      team1: {
        id: Math.random(),
        name: match.team1_name,
        sport: match.sport
      },
      team2: {
        id: Math.random(),
        name: match.team2_name,
        sport: match.sport
      },
      date: match.match_date,
      time: match.match_time,
      venue: match.venue,
      sport: match.sport,
      status: match.status
    };

    res.json({
      success: true,
      message: 'Match updated successfully!',
      data: formattedMatch
    });

  } catch (error) {
    console.error('Error updating match:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};
// Get only ongoing matches for live scores


// Delete match
exports.deleteMatch = async (req, res) => {
  try {
    const { matchId } = req.params;

    const match = await Match.findByPk(matchId);
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    await match.destroy();

    res.json({
      success: true,
      message: 'Match deleted successfully!'
    });

  } catch (error) {
    console.error('Error deleting match:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

// Update match status and scores
exports.updateMatchStatus = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { status, team1_score, team2_score, winner_team } = req.body;

    const match = await Match.findByPk(matchId);
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (team1_score !== undefined) updateData.team1_score = team1_score;
    if (team2_score !== undefined) updateData.team2_score = team2_score;
    if (winner_team) updateData.winner_team = winner_team;

    await match.update(updateData);

    res.json({
      success: true,
      message: 'Match status updated successfully!',
      data: match
    });

  } catch (error) {
    console.error('Error updating match status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};