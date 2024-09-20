import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'src/shared/types/index';
import { RootState } from 'src/frontend/store/rootReducer';

// Define the interface for the authentication state
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Define the initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

// Create the auth slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

// Export action creators
export const { login, logout } = authSlice.actions;

// Define selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;

export default authSlice.reducer;