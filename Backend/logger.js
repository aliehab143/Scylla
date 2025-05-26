const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Ensure the log directory exists
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Define the log file path
const logFilePath = path.join(logDir, 'app.log');

// Create Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }), // ISO timestamp
    winston.format.json() // JSON format for logs
  ),
  transports: [
    new winston.transports.File({ filename: logFilePath }), // Write to app.log
    new winston.transports.Console() // Also log to console for debugging
  ]
});

// Info log function
const infoLog = (userId, type, sourceId) => {
  logger.info('Action performed', {
    id: userId,
    type,
    sourceId // Can also represent dashboardId
  });
};

// Error log function
const errorLog = (userId, type, errorMessage) => {
  logger.error('Error occurred', {
    id: userId,
    type,
    error: errorMessage
  });
};

module.exports = { infoLog, errorLog };