const { Sequelize } = require('sequelize');

// Use DATABASE_URL if defined, otherwise fallback to individual env vars
const connectionString = process.env.DATABASE_URL;

const sequelize = connectionString
  ? new Sequelize(connectionString, {
      dialect: 'postgres',
      protocol: 'postgres',
      logging: false, // set true for debugging
      define: {
        timestamps: true,
        underscored: true,
      },
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // required for Supabase SSL cert
        },
      },
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT || 'postgres',
        port: process.env.DB_PORT || 5432,
        logging: false,
        define: {
          timestamps: true,
          underscored: true,
        },
      }
    );

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL database connection has been established successfully.');
    // Optionally sync schema in development:
    // await sequelize.sync({ alter: true });
  } catch (error) {
    console.error(`Unable to connect to the database: ${error}`);
    process.exit(1); // exit with failure
  }
};

module.exports = {
  sequelize,
  connectDB,
};
