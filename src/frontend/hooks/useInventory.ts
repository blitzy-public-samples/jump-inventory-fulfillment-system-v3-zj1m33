import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInventory, updateInventoryItem, createInventoryItem, deleteInventoryItem } from '../store/actions/inventoryActions';
import { ApiError } from '../services/api';
import { InventoryItem } from '../../shared/types/inventory';

const useInventory = () => {
  // Initialize state variables for loading, error, and inventory items
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  // Get the Redux dispatch function
  const dispatch = useDispatch();

  // Select inventory items from the Redux store
  const inventoryItems = useSelector((state: any) => state.inventory.items);

  // Define a function to fetch inventory data
  const fetchInventoryData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(fetchInventory());
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Define function for creating inventory item
  const createItem = useCallback(async (item: InventoryItem) => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(createInventoryItem(item));
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Define function for updating inventory item
  const updateItem = useCallback(async (item: InventoryItem) => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(updateInventoryItem(item));
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Define function for deleting inventory item
  const deleteItem = useCallback(async (itemId: string) => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(deleteInventoryItem(itemId));
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Use useEffect to fetch inventory data on component mount
  useEffect(() => {
    fetchInventoryData();
  }, [fetchInventoryData]);

  // Return an object with inventory state and functions
  return {
    loading,
    error,
    inventoryItems,
    fetchInventoryData,
    createItem,
    updateItem,
    deleteItem,
  };
};

export default useInventory;

// Human tasks:
// TODO: Implement error handling for API calls
// TODO: Add unit tests for the useInventory hook
// TODO: Optimize performance by implementing pagination or virtual scrolling for large inventory lists
// TODO: Implement caching mechanism to reduce unnecessary API calls