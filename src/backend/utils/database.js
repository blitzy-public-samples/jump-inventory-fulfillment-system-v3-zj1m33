const { Sequelize } = require('sequelize');
const { dbConfig } = require('config');
const logger = require('../utils/logger');

// Global variable to store the Sequelize instance
let sequelize = null;

/**
 * Initializes the database connection and syncs models
 * @returns {Promise<void>} Resolves when the database is initialized and synced
 */
async function initializeDatabase() {
  try {
    // Create a new Sequelize instance using the configuration from dbConfig
    sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
      host: dbConfig.host,
      dialect: dbConfig.dialect,
      logging: (msg) => logger.debug(msg),
    });

    // Test the database connection
    await sequelize.authenticate();

    // If successful, log the success message
    logger.info('Database connection has been established successfully.');

    // Sync all defined models to the database
    await sequelize.sync();
    logger.info('All models were synchronized successfully.');
  } catch (error) {
    // If an error occurs, log the error and throw it
    logger.error('Unable to connect to the database:', error);
    throw error;
  }
}

/**
 * Returns the current Sequelize connection instance
 * @returns {Sequelize} The current Sequelize connection instance
 */
function getConnection() {
  // Check if the sequelize instance exists
  if (!sequelize) {
    // If it doesn't exist, throw an error
    throw new Error('Database connection has not been initialized. Call initializeDatabase() first.');
  }
  // Return the sequelize instance
  return sequelize;
}

/**
 * Closes the current database connection
 * @returns {Promise<void>} Resolves when the connection is closed
 */
async function closeConnection() {
  try {
    // Check if the sequelize instance exists
    if (sequelize) {
      // If it exists, close the connection
      await sequelize.close();
      // Set the sequelize instance to null
      sequelize = null;
      // Log the connection closure
      logger.info('Database connection closed successfully.');
    }
  } catch (error) {
    // If an error occurs, log the error and throw it
    logger.error('Error closing database connection:', error);
    throw error;
  }
}

/**
 * Executes a series of database operations within a transaction
 * @param {Function} callback - The function to execute within the transaction
 * @returns {Promise<any>} Resolves with the result of the transaction
 */
async function executeTransaction(callback) {
  // Get the current database connection
  const connection = getConnection();
  
  try {
    // Start a new transaction
    const result = await connection.transaction(async (t) => {
      // Execute the provided callback function within the transaction
      return await callback(t);
    });

    // If successful, commit the transaction and return the result
    return result;
  } catch (error) {
    // If an error occurs, rollback the transaction, log the error, and throw it
    logger.error('Transaction failed:', error);
    throw error;
  }
}

module.exports = {
  initializeDatabase,
  getConnection,
  closeConnection,
  executeTransaction,
};

// Human tasks:
// TODO: Review and optimize database connection pooling settings
// TODO: Implement additional error handling for specific database errors
// TODO: Add support for read replicas if needed for scaling
// TODO: Implement database migration versioning system
// TODO: Create a function to check and upgrade database schema version