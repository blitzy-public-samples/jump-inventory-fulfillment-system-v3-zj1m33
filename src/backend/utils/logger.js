const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Define global constants
const LOG_DIR = path.join(__dirname, '../../logs');
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

/**
 * Creates and configures a Winston logger instance with console and file transports
 * @returns {winston.Logger} Configured Winston logger instance
 */
function createLogger() {
  // Create a Winston logger instance
  const logger = winston.createLogger({
    level: LOG_LEVEL,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
      })
    ),
    transports: [
      // Configure console transport with colorization
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      }),
      // Configure file transport using DailyRotateFile
      new DailyRotateFile({
        filename: path.join(LOG_DIR, 'application-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d'
      })
    ]
  });

  // Add error handling for file transport
  logger.transports.forEach((transport) => {
    if (transport instanceof DailyRotateFile) {
      transport.on('error', (error) => {
        console.error('Error in file logging:', error);
      });
    }
  });

  // Return the configured logger instance
  return logger;
}

// Export the configured logger instance
const logger = createLogger();
module.exports = { logger };

// Human tasks:
// TODO: Review and adjust log retention policy based on compliance requirements
// TODO: Implement log shipping to a centralized log management system (e.g., ELK stack or AWS CloudWatch)
// TODO: Set up alerts for critical log events
// TODO: Ensure proper log rotation and archiving strategies are in place