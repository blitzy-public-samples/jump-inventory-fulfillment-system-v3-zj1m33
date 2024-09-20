import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InventoryItem } from 'src/shared/types/index';
import { RootState } from 'src/frontend/store/rootReducer';

// Define the interface for the inventory state
interface InventoryState {
  items: InventoryItem[];
  loading: boolean;
  error: string | null;
}

// Define the initial state
const initialState: InventoryState = {
  items: [],
  loading: false,
  error: null,
};

// Create the inventory slice
const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setInventoryItems: (state, action: PayloadAction<InventoryItem[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateInventoryItem: (state, action: PayloadAction<InventoryItem>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    adjustInventory: (state, action: PayloadAction<{ id: string; quantityChange: number }>) => {
      const { id, quantityChange } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity += quantityChange;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

// Export the action creators
export const { 
  setInventoryItems, 
  updateInventoryItem, 
  adjustInventory,
  setLoading,
  setError
} = inventorySlice.actions;

// Define selectors
export const selectInventoryItems = (state: RootState) => state.inventory.items;

export const selectInventoryItemById = (state: RootState, itemId: string) =>
  state.inventory.items.find(item => item.id === itemId);

export const selectLowStockItems = (state: RootState, threshold: number) =>
  state.inventory.items.filter(item => item.quantity < threshold);

// Export the reducer
export default inventorySlice.reducer;