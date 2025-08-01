const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Team, Player, sequelize } = require('../models');
const { sendOTPEmail, sendRegistrationConfirmation } = require('../services/emailService');

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

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

// NEW: Send OTP Controller
exports.sendOTP = async (req, res) => {
  try {
    const { email, fullName } = req.body;

    // Validation
    if (!email || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Email and full name are required'
      });
    }

    if (!email.includes('@iitjammu.ac.in')) {
      return res.status(400).json({
        success: false,
        message: 'Please use your @iitjammu.ac.in email address'
      });
    }

    // Check if email already exists
    const existingTeam = await Team.findOne({ 
      where: { captain_email: email } 
    });
    
    if (existingTeam) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered as a team captain'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP with expiration (10 minutes)
    otpStore.set(email, {
      otp,
      fullName,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      attempts: 0
    });

    // Send OTP email
    await sendOTPEmail(email, fullName, otp);

    console.log(`OTP sent to ${email}: ${otp}`); // For development only

    res.json({
      success: true,
      message: 'OTP sent successfully to your email'
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again.'
    });
  }
};

// NEW: Verify OTP Controller
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Get stored OTP
    const storedData = otpStore.get(email);
    
    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired. Please request a new OTP.'
      });
    }

    // Check expiration
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP.'
      });
    }

    // Check attempts (prevent brute force)
    if (storedData.attempts >= 3) {
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (otp !== storedData.otp) {
      // Increment attempts
      otpStore.set(email, {
        ...storedData,
        attempts: storedData.attempts + 1
      });
      
      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${2 - storedData.attempts} attempts remaining.`
      });
    }

    // OTP verified successfully
    otpStore.set(email, {
      ...storedData,
      verified: true,
      verifiedAt: Date.now()
    });

    res.json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP. Please try again.'
    });
  }
};

// Login Controller (unchanged)
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
    if (!email.includes('@iitjammu.ac.in')) {
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
        'sport',
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

// UPDATED: Enhanced Register Controller with OTP verification
exports.register = async (req, res) => {
  // Start database transaction
  const transaction = await sequelize.transaction();
  
  try {
    const {
      // Team/Captain Information
      team_name,
      captain_email,
      captain_name,
      captain_roll_number,
      captain_branch,
      captain_year,
      captain_phone,
      password,
      primary_sport,
      // Players Information (array of player objects)
      players
    } = req.body;

    // NEW: Check if email was verified via OTP
    const storedData = otpStore.get(captain_email);
    if (!storedData || !storedData.verified) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Email not verified. Please verify your email first.'
      });
    }

    // NEW: Check if verification is still valid (within 30 minutes)
    if (Date.now() - storedData.verifiedAt > 30 * 60 * 1000) {
      otpStore.delete(captain_email);
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Email verification expired. Please verify again.'
      });
    }

    // Validation for required team fields
    if (!team_name || !captain_email || !captain_name || !captain_roll_number || 
        !captain_branch || !captain_year || !captain_phone || !password) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'All team and captain fields are required'
      });
    }

    // Validate email format and college domain
    if (!captain_email.includes('@iitjammu.ac.in')) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Please use your college email address (@iitjammu.ac.in)'
      });
    }

    // Validate players array
    if (!players || !Array.isArray(players) || players.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'At least one player must be registered'
      });
    }

    // Validate each player
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      if (!player.player_name || !player.roll_number || !player.branch || 
          !player.year || !player.phone_number || !player.sport || 
          !player.playing_style || !player.grip_style || !player.rubber_type) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `All fields are required for player ${i + 1}`
        });
      }
    }

    // Check if team name already exists
    const existingTeamName = await Team.findOne({
      where: { team_name: team_name }
    });

    if (existingTeamName) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Team name already exists. Please choose a different name.'
      });
    }

    // Check if captain email already exists
    const existingTeam = await Team.findOne({
      where: { captain_email: captain_email }
    });

    if (existingTeam) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Team captain with this email already exists'
      });
    }

    // Check if captain roll number already exists
    const existingCaptainRoll = await Team.findOne({
      where: { captain_roll_number: captain_roll_number }
    });

    if (existingCaptainRoll) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Captain roll number already registered'
      });
    }

    // Check for duplicate roll numbers in players
    const rollNumbers = players.map(p => p.roll_number);
    const uniqueRollNumbers = new Set(rollNumbers);
    
    if (rollNumbers.length !== uniqueRollNumbers.size) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Duplicate roll numbers found in players list'
      });
    }

    // Check if any player roll numbers already exist in database
    const existingPlayers = await Player.findAll({
      where: {
        roll_number: rollNumbers
      }
    });

    if (existingPlayers.length > 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Roll number(s) already registered: ${existingPlayers.map(p => p.roll_number).join(', ')}`
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
      email_verified: true // UPDATED: Set to true since OTP was verified
    }, { transaction });

    // Create players
    const playerData = players.map((player, index) => ({
      team_id: newTeam.team_id,
      player_name: player.player_name,
      roll_number: player.roll_number,
      branch: player.branch,
      year: player.year,
      phone_number: player.phone_number,
      sport: player.sport,
      playing_style: player.playing_style,
      grip_style: player.grip_style,
      rubber_type: player.rubber_type,
      player_position: index + 1, // Set position based on order
      avatar_url: player.avatar_url || null
    }));

    const createdPlayers = await Player.bulkCreate(playerData, { transaction });

    // Commit transaction
    await transaction.commit();

    // NEW: Clean up OTP store after successful registration
    otpStore.delete(captain_email);

    // NEW: Send registration confirmation email
    try {
      await sendRegistrationConfirmation(captain_email, captain_name, { 
        teamName: team_name 
      });
    } catch (emailError) {
      console.error('Confirmation email failed:', emailError);
      // Don't fail registration if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Team and players registered successfully!',
      data: {
        team_id: newTeam.team_id,
        team_name: newTeam.team_name,
        captain_email: newTeam.captain_email,
        players_count: createdPlayers.length
      }
    });

  } catch (error) {
    // Rollback transaction on error
    await transaction.rollback();
    console.error('Registration error:', error);
    
    // Handle specific database errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Duplicate entry found. Please check team name, email, or roll numbers.'
      });
    }
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + error.errors.map(e => e.message).join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Verify Token Middleware (unchanged)
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

// Get current team info (unchanged)
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
        'sport',
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
