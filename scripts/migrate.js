const { Sequelize } = require('sequelize');
const Umzug = require('umzug');
const sequelize = require('src/backend/config/database');
const logger = require('src/backend/utils/logger');

const setupUmzug = () => {
  const umzug = new Umzug({
    migrations: {
      path: './src/backend/migrations',
      params: [sequelize.getQueryInterface(), Sequelize],
    },
    storage: 'sequelize',
    storageOptions: {
      sequelize: sequelize,
    },
    logger: logger,
  });

  return umzug;
};

const runMigrations = async () => {
  const umzug = setupUmzug();

  try {
    logger.info('Starting database migrations...');
    const migrations = await umzug.up();
    migrations.forEach((migration) => {
      logger.info(`Executed migration: ${migration.file}`);
    });
    logger.info('All migrations have been executed successfully.');
  } catch (error) {
    logger.error('Error during migration:', error);
    throw error;
  }
};

module.exports = {
  runMigrations,
};