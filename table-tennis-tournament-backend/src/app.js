const express = require('express');
const cors = require('cors');
const playerRoutes = require('./routes/api');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Table Tennis Tournament API is running!' });
});

app.use('/api', playerRoutes);

module.exports = app;
