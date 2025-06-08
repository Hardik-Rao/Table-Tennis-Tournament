require('dotenv').config();
const { sequelize } = require('./src/models');
const app = require('./src/app'); // Import the app from app.js

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('✅ PostgreSQL database connection has been established successfully.');
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Unable to connect to the database:', error);
  });
