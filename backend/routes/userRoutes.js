const express = require('express');
const bcrypt = require('bcrypt');
const { pool } = require('../config/db'); // Database pool
const router = express.Router();

// Registration route
router.get('/check', async (req, res) => {
  const { email } = req.query; // Get the email from query parameters

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });

    if (user) {
      return res.status(200).json({ isRegistered: true });
    } else {
      return res.status(200).json({ isRegistered: false });
    }
  } catch (error) {
    console.error('Error checking user:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});
router.post('/register', async (req, res) => {
  const { username, password, email, role, adminKey } = req.body;

  try {
    // Validate inputs
    if (!username || !password || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Admin key validation (if registering as admin)
    if (role === 'admin' && adminKey !== 'your-secret-admin-key') {
      return res.status(403).json({ message: 'Invalid admin key' });
    }

    // Check if the user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Hash the password and save the user
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4)',
      [username, hashedPassword, email, role]
    );

    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validate inputs
    if (!username || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the user exists
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Verify the password
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    res.status(200).json({ message: 'Login successful', role: user.rows[0].role });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
