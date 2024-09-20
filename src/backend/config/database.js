// Import dotenv for environment variable configuration
import { config } from 'dotenv';

// Load environment variables
config();

// Database configuration object
const databaseConfig = {
  // Development environment configuration
  development: {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: false
  },
  
  // Test environment configuration
  test: {
    dialect: 'postgres',
    host: process.env.TEST_DB_HOST,
    port: process.env.TEST_DB_PORT,
    username: process.env.TEST_DB_USERNAME,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_NAME,
    logging: false
  },
  
  // Production environment configuration
  production: {
    dialect: 'postgres',
    host: process.env.PROD_DB_HOST,
    port: process.env.PROD_DB_PORT,
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};

// Export the database configuration
export default databaseConfig;

// Human tasks:
// TODO: Ensure all necessary environment variables are set in the .env file
// TODO: Review and adjust database connection pool settings for production environment if needed
// TODO: Consider implementing a connection retry mechanism for improved reliability
// TODO: Evaluate the need for read replicas in the production environment for scalability