// logger.js
const winston = require('winston');

// Create a logger instance
const logger = winston.createLogger({
  level: 'info', // Set the logging level to info
  format: winston.format.combine(
    winston.format.timestamp(), // Add timestamp to logs
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }), // Log to console
    new winston.transports.File({ filename: 'logs/app.log' }) // Log to file (optional)
  ],
});

// Export the logger instance
module.exports = logger;
