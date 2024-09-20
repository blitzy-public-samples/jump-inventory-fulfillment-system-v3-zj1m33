import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_BASE_URL } from 'src/shared/constants/index';
import { handleApiError } from 'src/shared/utils/index';

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(handleApiError(error))
  );

  return instance;
};

const axiosInstance = createAxiosInstance();

const handleRequest = async <T>(requestPromise: Promise<AxiosResponse<T>>): Promise<T> => {
  try {
    const response = await requestPromise;
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const api = {
  auth: {
    login: (credentials: { username: string; password: string }) =>
      handleRequest(axiosInstance.post('/auth/login', credentials)),
    logout: () => handleRequest(axiosInstance.post('/auth/logout')),
  },
  orders: {
    getOrders: (params?: object) => handleRequest(axiosInstance.get('/orders', { params })),
    getOrderById: (orderId: string) => handleRequest(axiosInstance.get(`/orders/${orderId}`)),
    createOrder: (orderData: object) => handleRequest(axiosInstance.post('/orders', orderData)),
    updateOrder: (orderId: string, updateData: object) =>
      handleRequest(axiosInstance.put(`/orders/${orderId}`, updateData)),
    fulfillOrder: (orderId: string) =>
      handleRequest(axiosInstance.post(`/orders/${orderId}/fulfill`)),
  },
  inventory: {
    getInventory: (params?: object) =>
      handleRequest(axiosInstance.get('/inventory', { params })),
    adjustInventory: (itemId: string, adjustmentData: object) =>
      handleRequest(axiosInstance.post(`/inventory/${itemId}/adjust`, adjustmentData)),
  },
  products: {
    getProducts: (params?: object) =>
      handleRequest(axiosInstance.get('/products', { params })),
    getProductById: (productId: string) =>
      handleRequest(axiosInstance.get(`/products/${productId}`)),
    createProduct: (productData: object) =>
      handleRequest(axiosInstance.post('/products', productData)),
    updateProduct: (productId: string, updateData: object) =>
      handleRequest(axiosInstance.put(`/products/${productId}`, updateData)),
    deleteProduct: (productId: string) =>
      handleRequest(axiosInstance.delete(`/products/${productId}`)),
  },
};