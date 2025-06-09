const express = require('express');
const router = express.Router();
const { login, register, verifyToken, getProfile } = require('../controllers/authController');

// Authentication Routes
router.post('/login', login);
router.post('/register', register);
router.get('/profile', verifyToken, getProfile);

module.exports = router;