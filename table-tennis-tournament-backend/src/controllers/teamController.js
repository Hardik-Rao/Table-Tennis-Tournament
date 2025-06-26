const { Player, Team } = require('../models');

// Get all teams with their players (for Admin Dashboard)
exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.findAll({
      attributes: [
        'team_id',
        'team_name',
        'captain_name',
        'captain_email',
        'primary_sport',
        'captain_roll_number',
        'captain_branch',
        'captain_year',
        'captain_phone'
      ],
      include: [{
        model: Player,
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
        required: false // LEFT JOIN - include teams even without players
      }],
      order: [
        ['team_name', 'ASC'],
        [Player, 'player_position', 'ASC']
      ]
    });

    // Transform to match frontend expectations
    const formattedTeams = teams.map(team => {
      // Generate mock wins/losses data for now
      const mockWinsLosses = () => {
        const wins = Math.floor(Math.random() * 20) + 5; // 5-24 wins
        const losses = Math.floor(Math.random() * 8) + 1; // 1-8 losses
        return { wins, losses };
      };

      const formattedPlayers = team.Players.map(player => {
        const { wins, losses } = mockWinsLosses();
        return {
          id: player.player_id,
          name: player.player_name,
          sport: player.sport,
          year: player.year,
          avatar: player.avatar_url || `https://i.pravatar.cc/150?u=${player.player_id}`,
          position: player.playing_style || 'Player',
          wins: wins,
          losses: losses,
          roll_number: player.roll_number,
          branch: player.branch,
          phone: player.phone_number,
          grip: player.grip_style,
          rubber: player.rubber_type
        };
      });

      // Calculate team totals
      const totalWins = formattedPlayers.reduce((sum, player) => sum + player.wins, 0);
      const totalLosses = formattedPlayers.reduce((sum, player) => sum + player.losses, 0);
      const totalMatches = totalWins + totalLosses;

      return {
        id: team.team_id,
        name: team.team_name,
        sport: team.primary_sport,
        captain: {
          name: team.captain_name,
          email: team.captain_email,
          avatar: `https://i.pravatar.cc/150?u=${team.captain_email}`,
          roll_number: team.captain_roll_number,
          branch: team.captain_branch,
          year: team.captain_year,
          phone: team.captain_phone
        },
        players: formattedPlayers,
        totalWins: totalWins,
        totalMatches: totalMatches,
        playerCount: formattedPlayers.length
      };
    });

    res.json({
      success: true,
      data: {
        teams: formattedTeams,
        totalTeams: formattedTeams.length,
        totalPlayers: formattedTeams.reduce((sum, team) => sum + team.playerCount, 0),
        totalMatches: formattedTeams.reduce((sum, team) => sum + team.totalMatches, 0)
      }
    });

  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

// Get team by ID
exports.getTeamById = async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findByPk(teamId, {
      attributes: [
        'team_id',
        'team_name',
        'captain_name',
        'captain_email',
        'primary_sport',
        'captain_roll_number',
        'captain_branch',
        'captain_year',
        'captain_phone'
      ],
      include: [{
        model: Player,
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
        required: false
      }],
      order: [
        [Player, 'player_position', 'ASC']
      ]
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Format the team data
    const formattedPlayers = team.Players.map(player => ({
      id: player.player_id,
      name: player.player_name,
      sport: player.sport,
      year: player.year,
      avatar: player.avatar_url || `https://i.pravatar.cc/150?u=${player.player_id}`,
      position: player.playing_style || 'Player',
      roll_number: player.roll_number,
      branch: player.branch,
      phone: player.phone_number,
      grip: player.grip_style,
      rubber: player.rubber_type
    }));

    const formattedTeam = {
      id: team.team_id,
      name: team.team_name,
      sport: team.primary_sport,
      captain: {
        name: team.captain_name,
        email: team.captain_email,
        avatar: `https://i.pravatar.cc/150?u=${team.captain_email}`,
        roll_number: team.captain_roll_number,
        branch: team.captain_branch,
        year: team.captain_year,
        phone: team.captain_phone
      },
      players: formattedPlayers,
      playerCount: formattedPlayers.length
    };

    res.json({
      success: true,
      data: formattedTeam
    });

  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};