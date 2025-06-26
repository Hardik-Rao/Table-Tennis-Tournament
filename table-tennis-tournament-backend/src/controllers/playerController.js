const { Player, Team } = require('../models');

// Get all players (existing endpoint)
exports.getAllPlayers = async (req, res) => {
  try {
    const players = await Player.findAll({
      attributes: [
        'player_name',
        'playing_style',
        'grip_style', 
        'rubber_type',
        'avatar_url'
      ],
      include: [{
        model: Team,
        attributes: ['team_name'],
        required: true // INNER JOIN - only players with teams
      }],
      order: [
        [Team, 'team_name', 'ASC'],
        ['player_position', 'ASC']
      ]
    });

    // Transform to match frontend expectations
    const formattedPlayers = players.map(player => ({
      name: player.player_name,
      team: player.Team.team_name,
      style: player.playing_style,
      grip: player.grip_style,
      rubber: player.rubber_type,
      avatar: player.avatar_url
    }));

    res.json(formattedPlayers);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get players by team ID (existing endpoint)
exports.getTeamPlayers = async (req, res) => {
  try {
    const { teamId } = req.params;

    const players = await Player.findAll({
      where: { team_id: teamId },
      attributes: [
        'player_id',
        'player_name',
        'roll_number',
        'branch',
        'year',
        'phone_number',
        'sport',
        'playing_style',
        'grip_style',
        'rubber_type',
        'player_position',
        'avatar_url'
      ],
      include: [{
        model: Team,
        attributes: ['team_name'],
        required: true
      }],
      order: [['player_position', 'ASC']]
    });

    if (players.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No players found for this team'
      });
    }

    // Format response
    const formattedPlayers = players.map(player => ({
      id: player.player_id,
      name: player.player_name,
      team: player.Team.team_name,
      roll_number: player.roll_number,
      branch: player.branch,
      year: player.year,
      phone: player.phone_number,
      sport: player.sport,
      style: player.playing_style,
      grip: player.grip_style,
      rubber: player.rubber_type,
      position: player.player_position,
      avatar: player.avatar_url
    }));

    res.json({
      success: true,
      data: {
        players: formattedPlayers,
        team_name: players[0].Team.team_name,
        total_players: formattedPlayers.length
      }
    });

  } catch (error) {
    console.error('Error fetching team players:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};