import dayjs from 'dayjs';
import { DATE_FORMAT, CURRENCY } from 'src/shared/constants/index';
import { Order, Product, InventoryItem } from 'src/shared/types/index';

export const formatDate = (date: string | Date): string => {
  return dayjs(date).format(DATE_FORMAT);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: CURRENCY,
  }).format(amount);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  );
};

export const generateOrderSummary = (order: Order): object => {
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    orderId: order.id,
    totalItems,
    totalPrice: formatCurrency(totalPrice),
  };
};

export const calculateInventoryValue = (inventoryItems: InventoryItem[], products: Product[]): number => {
  const productPriceMap = new Map(products.map(product => [product.id, product.price]));

  return inventoryItems.reduce((total, item) => {
    const price = productPriceMap.get(item.productId) || 0;
    return total + (item.quantity * price);
  }, 0);
};

export const handleApiError = (error: any): object => {
  if (error instanceof Error) {
    return {
      message: error.message,
      status: error.name === 'ApiError' ? (error as any).status : 500,
      details: error.stack,
    };
  }
  return {
    message: 'An unknown error occurred',
    status: 500,
    details: JSON.stringify(error),
  };
};

export const debounce = (func: Function, wait: number): Function => {
  let timeoutId: NodeJS.Timeout;

  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), wait);
  };
};

export const throttle = (func: Function, wait: number): Function => {
  let lastCall = 0;

  return function (this: any, ...args: any[]) {
    const now = Date.now();
    if (now - lastCall >= wait) {
      lastCall = now;
      func.apply(this, args);
    }
  };
};