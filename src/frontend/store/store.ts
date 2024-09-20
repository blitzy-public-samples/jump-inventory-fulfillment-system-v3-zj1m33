import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from 'src/frontend/store/rootReducer';
import thunk from 'redux-thunk';

// Create and configure the Redux store
const createStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
    devTools: process.env.NODE_ENV !== 'production',
  });

  return store;
};

// Create the store
export const store = createStore();

// Export the AppDispatch type
export type AppDispatch = typeof store.dispatch;