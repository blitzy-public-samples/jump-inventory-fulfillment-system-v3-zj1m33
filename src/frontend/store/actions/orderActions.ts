import axios from 'axios';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { Order, OrderStatus } from 'src/shared/types/order';
import { API } from 'src/frontend/services/api';
import { RootState, AppAction } from 'src/frontend/store/types';

// Action type constants
export const FETCH_ORDERS_REQUEST = 'FETCH_ORDERS_REQUEST';
export const FETCH_ORDERS_SUCCESS = 'FETCH_ORDERS_SUCCESS';
export const FETCH_ORDERS_FAILURE = 'FETCH_ORDERS_FAILURE';
export const CREATE_ORDER_REQUEST = 'CREATE_ORDER_REQUEST';
export const CREATE_ORDER_SUCCESS = 'CREATE_ORDER_SUCCESS';
export const CREATE_ORDER_FAILURE = 'CREATE_ORDER_FAILURE';
export const UPDATE_ORDER_REQUEST = 'UPDATE_ORDER_REQUEST';
export const UPDATE_ORDER_SUCCESS = 'UPDATE_ORDER_SUCCESS';
export const UPDATE_ORDER_FAILURE = 'UPDATE_ORDER_FAILURE';
export const FULFILL_ORDER_REQUEST = 'FULFILL_ORDER_REQUEST';
export const FULFILL_ORDER_SUCCESS = 'FULFILL_ORDER_SUCCESS';
export const FULFILL_ORDER_FAILURE = 'FULFILL_ORDER_FAILURE';

// Type alias for all possible order action types
export type OrderActionTypes =
  | { type: typeof FETCH_ORDERS_REQUEST }
  | { type: typeof FETCH_ORDERS_SUCCESS; payload: Order[] }
  | { type: typeof FETCH_ORDERS_FAILURE; payload: string }
  | { type: typeof CREATE_ORDER_REQUEST }
  | { type: typeof CREATE_ORDER_SUCCESS; payload: Order }
  | { type: typeof CREATE_ORDER_FAILURE; payload: string }
  | { type: typeof UPDATE_ORDER_REQUEST }
  | { type: typeof UPDATE_ORDER_SUCCESS; payload: Order }
  | { type: typeof UPDATE_ORDER_FAILURE; payload: string }
  | { type: typeof FULFILL_ORDER_REQUEST }
  | { type: typeof FULFILL_ORDER_SUCCESS; payload: Order }
  | { type: typeof FULFILL_ORDER_FAILURE; payload: string };

// Define ThunkResult and ThunkDispatch types
type OrderThunkResult = ThunkAction<Promise<void>, RootState, unknown, OrderActionTypes>;
type OrderThunkDispatch = ThunkDispatch<RootState, unknown, OrderActionTypes>;

// Async action creator to fetch orders from the backend
export const fetchOrders = (
  filters: { status?: OrderStatus; dateRange?: [Date, Date] }
): OrderThunkResult => {
  return async (dispatch: OrderThunkDispatch) => {
    try {
      // Dispatch request action
      dispatch({ type: FETCH_ORDERS_REQUEST });

      // Call API to fetch orders
      const orders = await API.getOrders(filters);

      // Dispatch success action with fetched orders
      dispatch({ type: FETCH_ORDERS_SUCCESS, payload: orders });
    } catch (error) {
      // Dispatch failure action with error message
      dispatch({ type: FETCH_ORDERS_FAILURE, payload: error.message });
    }
  };
};

// Async action creator to create a new order
export const createOrder = (orderData: Partial<Order>): OrderThunkResult => {
  return async (dispatch: OrderThunkDispatch) => {
    try {
      // Dispatch request action
      dispatch({ type: CREATE_ORDER_REQUEST });

      // Call API to create order
      const createdOrder = await API.createOrder(orderData);

      // Dispatch success action with created order
      dispatch({ type: CREATE_ORDER_SUCCESS, payload: createdOrder });
    } catch (error) {
      // Dispatch failure action with error message
      dispatch({ type: CREATE_ORDER_FAILURE, payload: error.message });
    }
  };
};

// Async action creator to update an existing order
export const updateOrder = (orderId: string, updateData: Partial<Order>): OrderThunkResult => {
  return async (dispatch: OrderThunkDispatch) => {
    try {
      // Dispatch request action
      dispatch({ type: UPDATE_ORDER_REQUEST });

      // Call API to update order
      const updatedOrder = await API.updateOrder(orderId, updateData);

      // Dispatch success action with updated order
      dispatch({ type: UPDATE_ORDER_SUCCESS, payload: updatedOrder });
    } catch (error) {
      // Dispatch failure action with error message
      dispatch({ type: UPDATE_ORDER_FAILURE, payload: error.message });
    }
  };
};

// Async action creator to fulfill an order
export const fulfillOrder = (orderId: string): OrderThunkResult => {
  return async (dispatch: OrderThunkDispatch) => {
    try {
      // Dispatch request action
      dispatch({ type: FULFILL_ORDER_REQUEST });

      // Call API to fulfill order
      const fulfilledOrder = await API.fulfillOrder(orderId);

      // Dispatch success action with fulfilled order
      dispatch({ type: FULFILL_ORDER_SUCCESS, payload: fulfilledOrder });
    } catch (error) {
      // Dispatch failure action with error message
      dispatch({ type: FULFILL_ORDER_FAILURE, payload: error.message });
    }
  };
};

// Human tasks:
// TODO: Implement error handling and retry logic for API calls
// TODO: Add unit tests for each action creator
// TODO: Implement caching mechanism for fetched orders to reduce API calls
// TODO: Add action for bulk order operations (e.g., bulk fulfill, bulk update)
// TODO: Implement optimistic updates for better user experience