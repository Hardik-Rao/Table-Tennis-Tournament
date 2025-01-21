const express = require('express');
const { checkUser, registerUser, loginUser } = require('../controllers/registrationController'); // Import the controller functions

const router = express.Router();

// Check user route
router.get('/check', checkUser);

// Registration route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

module.exports = router;
