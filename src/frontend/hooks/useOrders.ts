import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AsyncThunk } from '@reduxjs/toolkit';
import { fetchOrders, createOrder, updateOrder, deleteOrder } from '../store/actions/orderActions';
import { RootState } from '../store/index';
import { Order } from '../../shared/types/order';

// Define the interface for the return type of the useOrders hook
interface UseOrdersResult {
  orders: Order[];
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  createOrder: (orderData: Partial<Order>) => Promise<void>;
  updateOrder: (orderId: string, orderData: Partial<Order>) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
}

// Custom hook for managing orders in the frontend application
export const useOrders = (): UseOrdersResult => {
  // Initialize state for loading and error
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Get the dispatch function from useDispatch
  const dispatch = useDispatch();

  // Select orders from the Redux store using useSelector
  const orders = useSelector((state: RootState) => state.orders.orders);

  // Define fetchOrdersCallback using useCallback
  const fetchOrdersCallback = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(fetchOrders() as AsyncThunk<any, void, any>);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Define createOrderCallback using useCallback
  const createOrderCallback = useCallback(async (orderData: Partial<Order>) => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(createOrder(orderData) as AsyncThunk<any, Partial<Order>, any>);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Define updateOrderCallback using useCallback
  const updateOrderCallback = useCallback(async (orderId: string, orderData: Partial<Order>) => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(updateOrder({ id: orderId, ...orderData }) as AsyncThunk<any, Partial<Order>, any>);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Define deleteOrderCallback using useCallback
  const deleteOrderCallback = useCallback(async (orderId: string) => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(deleteOrder(orderId) as AsyncThunk<any, string, any>);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Use useEffect to fetch orders on component mount
  useEffect(() => {
    fetchOrdersCallback();
  }, [fetchOrdersCallback]);

  // Return the UseOrdersResult object with state and callbacks
  return {
    orders,
    loading,
    error,
    fetchOrders: fetchOrdersCallback,
    createOrder: createOrderCallback,
    updateOrder: updateOrderCallback,
    deleteOrder: deleteOrderCallback,
  };
};

// Human tasks:
// TODO: Implement error handling and retry logic for failed API calls
// TODO: Add pagination support for fetching orders
// TODO: Implement caching mechanism to reduce unnecessary API calls
// TODO: Add unit tests for the useOrders hook
// TODO: Consider implementing optimistic updates for better user experience