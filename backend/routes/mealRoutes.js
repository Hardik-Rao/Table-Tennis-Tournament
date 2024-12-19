const express = require('express');
const router = express.Router();
const { generateMealQRCode, validateMealQRCode } = require('../controllers/mealController');

// Meal QR code routes
router.post('/qr', generateMealQRCode);    // Generate a QR code for meal tracking
router.get('/qr/:code', validateMealQRCode); // Validate a meal QR code

module.exports = router;
