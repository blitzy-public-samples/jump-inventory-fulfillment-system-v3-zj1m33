import winston from 'winston';
import { NODE_ENV } from 'src/shared/constants/index';

const createLogger = (): winston.Logger => {
  // Create a new Winston logger instance
  const logger = winston.createLogger({
    level: NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      NODE_ENV === 'production'
        ? winston.format.json()
        : winston.format.printf(({ level, message, timestamp, stack }) => {
            return `${timestamp} ${level}: ${message}${stack ? '\n' + stack : ''}`;
          })
    ),
    transports: [
      // Add console transport for all environments
      new winston.transports.Console({
        format: winston.format.colorize({ all: true }),
      }),
    ],
  });

  // Add file transport for production environment
  if (NODE_ENV === 'production') {
    logger.add(
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      })
    );
    logger.add(
      new winston.transports.File({
        filename: 'logs/combined.log',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      })
    );
  }

  return logger;
};

export const logger = createLogger();