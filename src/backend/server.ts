import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { connectToDatabase } from './config/database';
import { connectToRedis } from './config/redis';
import authRoutes from './routes/authRoutes';
import orderRoutes from './routes/orderRoutes';
import inventoryRoutes from './routes/inventoryRoutes';
import productRoutes from './routes/productRoutes';
import shippingRoutes from './routes/shippingRoutes';
import errorMiddleware from './middleware/errorMiddleware';
import logger from './utils/logger';
import { PORT, NODE_ENV } from '../shared/constants';

const setupExpress = (): express.Application => {
  const app = express();

  // Apply middleware
  app.use(cors());
  app.use(helmet());
  app.use(compression());
  app.use(morgan('combined'));

  // Set up body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Mount routes
  app.use('/api/auth', authRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/inventory', inventoryRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/shipping', shippingRoutes);

  // Apply error middleware
  app.use(errorMiddleware);

  return app;
};

const startServer = async (): Promise<void> => {
  try {
    const app = setupExpress();

    // Connect to database
    await connectToDatabase();
    logger.info('Connected to database');

    // Connect to Redis
    await connectToRedis();
    logger.info('Connected to Redis');

    // Start the server
    app.listen(PORT, () => {
      logger.info(`Server running in ${NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();