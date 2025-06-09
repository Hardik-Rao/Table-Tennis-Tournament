const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Team, Player } = require('../models');

// Generate JWT Token
const generateToken = (teamId, captainEmail) => {
  return jwt.sign(
    { 
      teamId: teamId,
      email: captainEmail,
      type: 'captain'
    }, 
    process.env.JWT_SECRET || 'your_jwt_secret_key_here', 
    { expiresIn: '24h' }
  );
};

// Hash password with salt
const hashPassword = (password, salt) => {
  return bcrypt.hashSync(password + salt, 10);
};

// Verify password
const verifyPassword = (password, salt, hashedPassword) => {
  // For now, handle both plain text (existing data) and hashed passwords
  // Check if it's plain text first (temporary for existing data)
  if (hashedPassword === password) {
    return true;
  }
  // Check hashed password
  return bcrypt.compareSync(password + salt, hashedPassword);
};

// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Check if email is college email
    if (!email.includes('@college.edu')) {
      return res.status(400).json({
        success: false,
        message: 'Please use your college email address'
      });
    }

    // Find team by captain email
    const team = await Team.findOne({
      where: { captain_email: email }
    });

    if (!team) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if email is verified
    if (!team.email_verified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email address before logging in'
      });
    }

    // Verify password
    const isValidPassword = verifyPassword(password, team.salt, team.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Get team players
    const players = await Player.findAll({
      where: { team_id: team.team_id },
      attributes: [
        'player_id',
        'player_name', 
        'roll_number',
        'branch',
        'year',
        'phone_number',
        'playing_style',
        'grip_style', 
        'rubber_type',
        'player_position',
        'avatar_url'
      ],
      order: [['player_position', 'ASC']]
    });

    // Generate JWT token
    const token = generateToken(team.team_id, team.captain_email);

    // Return success response
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token: token,
        team: {
          team_id: team.team_id,
          team_name: team.team_name,
          captain_name: team.captain_name,
          captain_email: team.captain_email,
          captain_roll_number: team.captain_roll_number,
          captain_branch: team.captain_branch,
          captain_year: team.captain_year,
          captain_phone: team.captain_phone,
          primary_sport: team.primary_sport,
          players: players
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Register Controller (for future use)
exports.register = async (req, res) => {
  try {
    const {
      team_name,
      captain_email,
      captain_name,
      captain_roll_number,
      captain_branch,
      captain_year,
      captain_phone,
      password,
      primary_sport
    } = req.body;

    // Validation
    if (!team_name || !captain_email || !captain_name || !password) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Check if team already exists
    const existingTeam = await Team.findOne({
      where: { captain_email: captain_email }
    });

    if (existingTeam) {
      return res.status(400).json({
        success: false,
        message: 'Team captain with this email already exists'
      });
    }

    // Generate salt and hash password
    const salt = crypto.randomBytes(16).toString('hex');
    const password_hash = hashPassword(password, salt);

    // Create new team
    const newTeam = await Team.create({
      team_name,
      captain_email,
      captain_name,
      captain_roll_number,
      captain_branch,
      captain_year,
      captain_phone,
      primary_sport: primary_sport || 'Table Tennis',
      password_hash,
      salt,
      email_verified: false // Will need email verification
    });

    res.status(201).json({
      success: true,
      message: 'Team registered successfully. Please verify your email.',
      data: {
        team_id: newTeam.team_id,
        team_name: newTeam.team_name,
        captain_email: newTeam.captain_email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Verify Token Middleware
exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
    
    // Find team
    const team = await Team.findByPk(decoded.teamId);
    if (!team) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    req.team = team;
    req.user = decoded;
    next();

  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Get current team info
exports.getProfile = async (req, res) => {
  try {
    const team = req.team;
    
    // Get team players
    const players = await Player.findAll({
      where: { team_id: team.team_id },
      attributes: [
        'player_id',
        'player_name', 
        'roll_number',
        'branch',
        'year', 
        'phone_number',
        'playing_style',
        'grip_style',
        'rubber_type',
        'player_position',
        'avatar_url'
      ],
      order: [['player_position', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        team: {
          team_id: team.team_id,
          team_name: team.team_name,
          captain_name: team.captain_name,
          captain_email: team.captain_email,
          captain_roll_number: team.captain_roll_number,
          captain_branch: team.captain_branch,
          captain_year: team.captain_year,
          captain_phone: team.captain_phone,
          primary_sport: team.primary_sport,
          players: players
        }
      }
    });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};