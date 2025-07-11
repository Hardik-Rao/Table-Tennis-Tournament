const express = require('express');
const cors = require('cors');
const playerRoutes = require('./routes/api');

const app = express();

// Updated CORS configuration to allow your Vercel frontend
app.use(cors({
  origin: [
    'https://table-tennis-tournament.vercel.app',
    'http://localhost:3000', // for React development server
    'http://localhost:5173'  // for Vite development server
  ],
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Table Tennis Tournament API is running!' });
});

app.use('/api', playerRoutes);

module.exports = app;