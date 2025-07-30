// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { 
  login, 
  register, 
  verifyToken, 
  getProfile,
  sendOTP,     // Add these new functions
  verifyOTP    // Add these new functions
} = require('../controllers/authController');

// Authentication Routes
router.post('/login', login);
router.post('/register', register);
router.get('/profile', verifyToken, getProfile);

// OTP Routes
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

module.exports = router;
