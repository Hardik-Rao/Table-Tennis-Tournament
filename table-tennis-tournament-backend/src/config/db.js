// src/config/db.js
const { Sequelize } = require('sequelize');

// Load environment variables for database credentials
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD; // <<< YES, THIS IS WHERE IT'S USED
const DB_HOST = process.env.DB_HOST;
const DB_DIALECT = process.env.DB_DIALECT || 'postgres';
const DB_PORT = process.env.DB_PORT || 5432; // Default PostgreSQL port

// Create a new Sequelize instance
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: DB_DIALECT,
    port: DB_PORT,
    logging: false, // Set to true to see SQL queries in console
    define: {
        timestamps: true, // Automatically add createdAt and updatedAt timestamps
        underscored: true, // Use snake_case for column names
    },
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL database connection has been established successfully.');
        // You might want to sync models here in development.
        // await sequelize.sync({ alter: true }); // Use alter: true to update schema without dropping data
        // console.log("All models were synchronized successfully.");
    } catch (error) {
        console.error(`Unable to connect to the database: ${error}`);
        process.exit(1); // Exit process with failure
    }
};

module.exports = {
    sequelize, // Export the sequelize instance
    connectDB, // Export the connection function
};