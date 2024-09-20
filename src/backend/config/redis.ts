import Redis from 'ioredis';
import { REDIS_URL, REDIS_PORT, REDIS_PASSWORD, NODE_ENV } from 'src/shared/constants/index';

let redisClient: Redis;

const redisOptions: Redis.RedisOptions = {
  host: REDIS_URL,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
  retryStrategy: (times: number) => {
    if (times > 3) {
      console.error('Redis connection failed after 3 attempts');
      return null;
    }
    return Math.min(times * 100, 3000);
  },
};

if (NODE_ENV === 'production') {
  redisOptions.tls = {};
}

export const connectToRedis = async (): Promise<void> => {
  try {
    redisClient = new Redis(redisOptions);

    redisClient.on('connect', () => {
      console.log('Successfully connected to Redis');
    });

    redisClient.on('error', (error) => {
      console.error('Redis connection error:', error);
    });

    await redisClient.ping();
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    throw error;
  }
};

export { redisClient };