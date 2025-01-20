const bcrypt = require('bcrypt');
const { pool } = require('../config/db'); // Import the pool from db.js

// Function to handle user registration
const registerUser = async (req, res) => {
  const { username, password, email, role, adminKey } = req.body;

  try {
    // Check if the username or email already exists
    const result = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
    if (result.rows.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // If the role is admin, validate the admin key
    if (role === 'admin' && adminKey !== 'your-predefined-admin-key') {
      return res.status(400).json({ message: 'Invalid admin key' });
    }

    // Insert the new user into the database
    const insertQuery = `
      INSERT INTO users (username, password, email, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, email, role
    `;
    const insertValues = [username, hashedPassword, email, role];
    const newUser = await pool.query(insertQuery, insertValues);

    // Respond with the created user details
    res.status(201).json({
      message: 'Registration successful',
      user: newUser.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser };
