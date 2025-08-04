require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

(async () => {
  try {
    console.log('Attempting test DB connection...');
    await sequelize.authenticate();
    console.log('Test DB connection successful!');
    process.exit(0);
  } catch (error) {
    console.error('Test DB connection failed:', error);
    process.exit(1);
  }
})();
