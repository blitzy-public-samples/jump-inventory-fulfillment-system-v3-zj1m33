import { combineReducers, Reducer } from '@reduxjs/toolkit';
import { authSlice } from 'src/frontend/store/slices/authSlice';
import { orderSlice } from 'src/frontend/store/slices/orderSlice';
import { inventorySlice } from 'src/frontend/store/slices/inventorySlice';
import { productSlice } from 'src/frontend/store/slices/productSlice';

// Combine all slice reducers into a single root reducer
const rootReducer = combineReducers({
  auth: authSlice.reducer,
  order: orderSlice.reducer,
  inventory: inventorySlice.reducer,
  product: productSlice.reducer,
});

// Export the root reducer
export default rootReducer;

// Define the RootState type
export type RootState = ReturnType<typeof rootReducer>;

// Function to create the root reducer (if needed for dynamic reducer addition)
export const createRootReducer = (): Reducer => {
  return combineReducers({
    auth: authSlice.reducer,
    order: orderSlice.reducer,
    inventory: inventorySlice.reducer,
    product: productSlice.reducer,
  });
};

// TODO: Consider adding additional slices for future features
// TODO: Implement Redux middleware if needed (e.g., for logging or async operations)
// TODO: Create unit tests for the root reducer
// TODO: Ensure proper integration with Redux store configuration