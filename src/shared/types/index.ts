// Enum definitions
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  FULFILLED = 'FULFILLED',
  CANCELLED = 'CANCELLED'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  WAREHOUSE_MANAGER = 'WAREHOUSE_MANAGER',
  WAREHOUSE_STAFF = 'WAREHOUSE_STAFF',
  READONLY_USER = 'READONLY_USER'
}

// Interface definitions
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  shopifyOrderId: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: Address;
  trackingNumber: string | null;
  orderDate: Date;
  fulfilledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface Product {
  id: string;
  shopifyProductId: string;
  name: string;
  sku: string;
  barcode: string;
  description: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryItem {
  id: string;
  productId: string;
  quantity: number;
  location: string;
  lastCounted: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryAdjustment {
  id: string;
  inventoryItemId: string;
  userId: string;
  quantityChange: number;
  reason: string;
  createdAt: Date;
}

export interface Address {
  street1: string;
  street2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface ShippingLabel {
  id: string;
  orderId: string;
  trackingNumber: string;
  labelUrl: string;
  createdAt: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}