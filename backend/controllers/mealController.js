const { pool } = require('../config/db');
const QRCode = require('qrcode');  // Assuming you're using the 'qrcode' package for generating QR codes

// Function to generate meal QR Code
const generateMealQRCode = async (req, res) => {
  const { user_id, meal_id } = req.body;  // Get user_id and meal_id from the request body

  // Validate input data
  if (!user_id || !meal_id) {
    return res.status(400).json({ error: 'User ID and Meal ID are required' });
  }

  // Create a unique identifier for the meal (QR code content)
  const qrData = `${user_id}-${meal_id}-${new Date().toISOString()}`;

  try {
    // Generate the QR code as a data URL
    const qrCodeDataUrl = await QRCode.toDataURL(qrData);  // Generates a data URL (Base64 encoded image)

    // Optionally, store this QR code in the database with additional details if needed
    await pool.query(
      'INSERT INTO meal_qrcodes (user_id, meal_id, qr_code_data_url, created_at) VALUES ($1, $2, $3, $4)',
      [user_id, meal_id, qrCodeDataUrl, new Date()]
    );

    res.status(200).json({
      message: 'Meal QR Code generated successfully',
      qr_code: qrCodeDataUrl  // Send the QR code image as a base64 encoded string
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Failed to generate meal QR code' });
  }
};

// Function to validate a meal QR Code
const validateMealQRCode = async (req, res) => {
  const { code } = req.params;  // Get the QR code string from the URL parameter

  try {
    // Search for the QR code in the database to check if it's valid
    const result = await pool.query(
      'SELECT * FROM meal_qrcodes WHERE qr_code_data_url LIKE $1',
      [`%${code}%`]  // Match the code in the QR code URL
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invalid QR code or expired' });
    }

    // If the QR code exists, validate it (this could include additional checks like expiry date, etc.)
    res.status(200).json({
      message: `Meal QR Code ${code} is valid`,
      details: result.rows[0]  // Return details about the QR code (user, meal, etc.)
    });
  } catch (error) {
    console.error('Error validating QR code:', error);
    res.status(500).json({ error: 'Failed to validate meal QR code' });
  }
};

module.exports = { generateMealQRCode, validateMealQRCode };
