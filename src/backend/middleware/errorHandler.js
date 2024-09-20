// Import the Winston logger
const logger = require('winston');

/**
 * Express middleware function for handling errors
 * @param {Error} err - The error object
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
const errorHandler = (err, req, res, next) => {
  // Log the error using Winston logger
  logger.error(`Error: ${err.message}`, { stack: err.stack });

  // Determine the status code based on the error type
  let statusCode = 500;
  if (err.name === 'ValidationError') {
    statusCode = 400;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
  }

  // Prepare an error response object
  const errorResponse = {
    error: {
      message: err.message || 'Internal Server Error',
      status: statusCode
    }
  };

  // If in development environment, include stack trace in the response
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack;
  }

  // Send the error response to the client
  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;

// Human tasks:
// TODO: Review and update error types and their corresponding status codes
// TODO: Implement custom error classes if needed for more specific error handling
// TODO: Consider implementing error reporting to an external service (e.g., Sentry)
// TODO: Implement unit tests for the errorHandler middleware
// TODO: Review and update error messages to ensure they are user-friendly and not exposing sensitive information
// TODO: Consider implementing a custom error class for application-specific errors