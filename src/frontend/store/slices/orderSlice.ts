import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order } from 'src/shared/types/index';
import { RootState } from 'src/frontend/store/rootReducer';

// Define the interface for the order state
interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

// Define the initial state
const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

// Create the order slice
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
      state.loading = false;
      state.error = null;
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.push(action.payload);
    },
    updateOrder: (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex(order => order.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },
    fulfillOrder: (state, action: PayloadAction<string>) => {
      const order = state.orders.find(order => order.id === action.payload);
      if (order) {
        order.status = 'FULFILLED';
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

// Export action creators
export const { setOrders, addOrder, updateOrder, fulfillOrder, setLoading, setError } = orderSlice.actions;

// Export selectors
export const selectOrders = (state: RootState) => state.orders.orders;
export const selectOrderById = (state: RootState, orderId: string) =>
  state.orders.orders.find(order => order.id === orderId);

// Export the reducer
export default orderSlice.reducer;

// TODO: Implement async thunks for fetching orders from the API
// TODO: Add error handling for failed API requests in the reducers
// TODO: Implement pagination support for the orders list
// TODO: Add filtering and sorting capabilities to the order selectors
// TODO: Create unit tests for the order slice, including all reducers and selectors
// TODO: Implement optimistic updates for order actions to improve perceived performance
// TODO: Add support for bulk order operations (e.g., bulk fulfill, bulk update)
// TODO: Implement a mechanism to handle order synchronization with Shopify
// TODO: Add support for order cancellation and refund processes
// TODO: Implement proper error handling and state updates for failed order operations