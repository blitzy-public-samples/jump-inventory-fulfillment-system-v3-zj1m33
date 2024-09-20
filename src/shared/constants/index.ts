import { UserRole, OrderStatus } from 'src/shared/types/index';

export const API_BASE_URL = '/api/v1';

export const SHOPIFY_API_VERSION = '2023-04';

export const SENDLE_API_VERSION = 'v1';

export const PAGINATION_DEFAULT_LIMIT = 20;

export const MAX_LOGIN_ATTEMPTS = 5;

export const PASSWORD_RESET_EXPIRY = 3600000; // 1 hour in milliseconds

export const JWT_EXPIRY = '1h';

export const ORDER_STATUSES: Record<OrderStatus, string> = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  FULFILLED: 'Fulfilled',
  CANCELLED: 'Cancelled'
};

export const USER_ROLES: Record<UserRole, string> = {
  ADMIN: 'Admin',
  WAREHOUSE_MANAGER: 'Warehouse Manager',
  WAREHOUSE_STAFF: 'Warehouse Staff',
  READONLY_USER: 'Read-only User'
};

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  INVALID_CREDENTIALS: 'Invalid username or password',
  ACCOUNT_LOCKED: 'Account locked due to multiple failed attempts',
  INVALID_TOKEN: 'Invalid or expired token',
  NOT_FOUND: 'Resource not found',
  INTERNAL_SERVER_ERROR: 'Internal server error'
};

export const INVENTORY_LOCATIONS = [
  'Warehouse A',
  'Warehouse B',
  'Storage Unit 1',
  'Storage Unit 2'
];

export const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const CURRENCY = 'USD';