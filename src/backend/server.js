// Import required modules
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const { config } = require('dotenv');
const { connectDatabase } = require('../config/database');
const orderRoutes = require('./routes/orderRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');
const logger = require('./utils/logger');

// Load environment variables
config();

// Set port from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// Function to start the server
const startServer = async () => {
  try {
    // Create Express application instance
    const app = express();

    // Set up middleware
    app.use(cors()); // TODO: Review and adjust CORS configuration for production
    app.use(helmet()); // Adds various HTTP headers for security
    app.use(morgan('combined')); // HTTP request logger
    app.use(compression()); // Compress response bodies
    app.use(express.json()); // Parse JSON request bodies
    app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

    // Apply rate limiting middleware
    app.use(rateLimiter);

    // Set up routes
    app.use('/api/orders', orderRoutes);
    app.use('/api/inventory', inventoryRoutes);
    app.use('/api/users', userRoutes);

    // Apply error handling middleware
    app.use(errorHandler);

    // Connect to the database
    await connectDatabase();

    // Start the server
    app.listen(PORT, () => {
      logger.info(`Server started on port ${PORT}`);
    });

    // TODO: Implement SSL/TLS for HTTPS in production
    // TODO: Set up proper logging and monitoring for production environment
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

// TODO: Configure environment variables for different environments (development, staging, production)
// TODO: Implement graceful shutdown handling
// TODO: Set up health check endpoint for load balancers
// TODO: Implement API versioning strategy