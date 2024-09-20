const rateLimit = require('express-rate-limit');
const Redis = require('redis');
const redisConfig = require('../config/redis');
const logger = require('../utils/logger');
const { RedisStore } = require('rate-limit-redis');

// Create a Redis client
const redisClient = new Redis(redisConfig);

/**
 * Creates and returns a rate limiter middleware
 * @param {Object} options - Options for configuring the rate limiter
 * @returns {Function} Rate limiter middleware
 */
const createRateLimiter = (options) => {
  // Create a new RedisStore instance using the redisClient
  const store = new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  });

  // Configure the rate limiter options with default values and user-provided options
  const config = {
    windowMs: 15 * 60 * 1000, // 15 minutes by default
    max: 100, // Limit each IP to 100 requests per windowMs by default
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    store: store,
    ...options,
    handler: (req, res) => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json({
        error: 'Too many requests, please try again later.',
      });
    },
  };

  // Create and return a new rateLimit instance with the configured options
  return rateLimit(config);
};

// Export the createRateLimiter function as default
module.exports = createRateLimiter;

// Export pre-configured rate limiters for API and authentication routes
module.exports.apiLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 100 });
module.exports.authLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 5 });

// Human tasks:
// TODO: Review and adjust rate limiting thresholds based on actual API usage patterns
// TODO: Implement IP whitelisting for trusted clients if necessary
// TODO: Set up monitoring and alerting for rate limit violations