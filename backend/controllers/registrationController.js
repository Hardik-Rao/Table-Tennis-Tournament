const bcrypt = require('bcrypt');
const { pool } = require('../config/db'); // Import the pool from db.js

// Function to check if a user is already registered
const checkUser = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      return res.status(200).json({ isRegistered: true });
    } else {
      return res.status(200).json({ isRegistered: false });
    }
  } catch (error) {
    console.error('Error checking user:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Function to handle user registration
const registerUser = async (req, res) => {
  const { username, password, email, role, adminKey } = req.body;

  try {
    if (!username || !password || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (role === 'admin' && adminKey !== 'your-secret-admin-key') {
      return res.status(403).json({ message: 'Invalid admin key' });
    }

    const existingUser = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4)',
      [username, hashedPassword, email, role]
    );

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to handle user login
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check if the user has the role of 'admin'
    if (user.rows[0].role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: User is not an admin' });
    }

    res.status(200).json({ message: 'Login successful', role: user.rows[0].role });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { checkUser, registerUser, loginUser };
