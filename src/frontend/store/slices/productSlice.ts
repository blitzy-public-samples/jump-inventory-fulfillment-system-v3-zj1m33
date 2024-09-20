import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from 'src/shared/types/index';
import { RootState } from 'src/frontend/store/rootReducer';

// Define the interface for the product state
interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

// Define the initial state
const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

// Create the product slice
export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.loading = false;
      state.error = null;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(product => product.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(product => product.id !== action.payload);
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
export const { setProducts, addProduct, updateProduct, deleteProduct, setLoading, setError } = productSlice.actions;

// Define selectors
export const selectProducts = (state: RootState) => state.products.products;
export const selectProductById = (state: RootState, productId: string) =>
  state.products.products.find(product => product.id === productId);

export default productSlice.reducer;

// TODO: Implement async thunks for API operations
// TODO: Add unit tests for reducers and selectors
// TODO: Implement pagination, filtering, and sorting in selectors
// TODO: Add support for product variants and options if needed