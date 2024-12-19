// db.js
const { Pool } = require('pg');

// PostgreSQL connection settings
const pool = new Pool({
  user: 'postgres',      // your database username
  host: 'localhost',          // your database host (use localhost for local setup)
  database: 'table-tennis',  // your database name
  password: 'Postgre',  // your database password
  port: 5432,                // default port for PostgreSQL
});

// Function to query the database
const query = (text, params) => pool.query(text, params);

module.exports = { pool };
