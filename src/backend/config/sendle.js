// Import dotenv for environment variable configuration
import { config } from 'dotenv';

// Load environment variables
config();

// Define constants using environment variables
const SENDLE_API_KEY = process.env.SENDLE_API_KEY;
const SENDLE_API_SECRET = process.env.SENDLE_API_SECRET;
const SENDLE_API_BASE_URL = process.env.SENDLE_API_BASE_URL || 'https://api.sendle.com/api/v1';
const SENDLE_SANDBOX_MODE = process.env.SENDLE_SANDBOX_MODE === 'true';

// Export Sendle configuration object
export default {
  apiKey: SENDLE_API_KEY,
  apiSecret: SENDLE_API_SECRET,
  baseUrl: SENDLE_API_BASE_URL,
  sandboxMode: SENDLE_SANDBOX_MODE,
  endpoints: {
    createOrder: '/orders',
    getOrder: '/orders/{id}',
    trackOrder: '/tracking/{id}',
    getQuote: '/quote'
  }
};

// Human tasks:
// TODO: Verify and update the Sendle API endpoints if they change in the future
// TODO: Ensure that all necessary environment variables are properly set in the production environment
// TODO: Consider implementing a mechanism to rotate the API key and secret periodically for enhanced security