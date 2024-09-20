import { Sequelize, SequelizeOptions } from 'sequelize';
import { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, NODE_ENV } from 'src/shared/constants/index';

// Configuration options for Sequelize
const sequelizeOptions: SequelizeOptions = {
  dialect: 'postgres',
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  logging: NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

// Sequelize instance for database operations
export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, sequelizeOptions);

// Function to establish a connection to the PostgreSQL database
export const connectToDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    // Implement retry mechanism here
    throw error;
  }
};

// Implement connection pooling
sequelize.addHook('beforeConnect', async (config: any) => {
  config.pool = sequelizeOptions.pool;
});

// Add logging for database events
sequelize.afterConnect((connection: any) => {
  console.log(`New connection established: ${connection.uuid}`);
});

sequelize.beforeDisconnect((connection: any) => {
  console.log(`Connection closed: ${connection.uuid}`);
});

// Export the Sequelize instance for use in other parts of the application
export default sequelize;