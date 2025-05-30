// server.js
require('dotenv').config(); // Load environment variables from .env file

const app = require('./src/app'); // <<< Make sure this path is './src/app'
const { connectDB } = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});