import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import orderReducer from './reducers/orderReducer';
import inventoryReducer from './reducers/inventoryReducer';
import userReducer from './reducers/userReducer';

// Combine reducers
const rootReducer = combineReducers({
  order: orderReducer,
  inventory: inventoryReducer,
  user: userReducer,
});

// Define RootState type
export type RootState = ReturnType<typeof rootReducer>;

// Configure store function
const configureStore = () => {
  // Create middleware array with thunk
  const middleware = [thunk];

  // Apply middleware and dev tools
  const enhancedMiddleware = composeWithDevTools(applyMiddleware(...middleware));

  // Create store with root reducer and enhanced middleware
  const store = createStore(rootReducer, enhancedMiddleware);

  return store;
};

export default configureStore;

// Human tasks:
// TODO: Review and adjust middleware configuration if additional middleware is needed
// TODO: Consider implementing code splitting for reducers if the application grows larger
// TODO: Evaluate the need for persistence (e.g., redux-persist) based on application requirements