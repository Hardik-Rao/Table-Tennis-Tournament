const { Player, Team } = require('../models');

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