require('dotenv').config();
const { sequelize } = require('./src/models');
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('✅ PostgreSQL database connection has been established successfully.');
    
    // Add this line to create tables from your models
    return sequelize.sync({ force: false }); // Creates tables if they don't exist
  })
  .then(() => {
    console.log('✅ Database tables synchronized successfully.');
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Unable to connect to the database:', error);
  });