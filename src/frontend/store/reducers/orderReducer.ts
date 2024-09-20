import { Reducer, AnyAction } from 'redux';
import { Order } from 'src/shared/types/order';
import { OrderActionTypes } from 'src/frontend/store/actions/orderActions';

// Interface defining the shape of the order state
interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  currentOrder: Order | null;
}

// Initial state for the order reducer
const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
  currentOrder: null
};

// Reducer function for handling order-related actions
const orderReducer: Reducer<OrderState, AnyAction> = (state = initialState, action): OrderState => {
  switch (action.type) {
    // Fetching orders - start
    case OrderActionTypes.FETCH_ORDERS_START:
      return {
        ...state,
        loading: true,
        error: null
      };

    // Fetching orders - success
    case OrderActionTypes.FETCH_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: action.payload,
        error: null
      };

    // Fetching orders - failure
    case OrderActionTypes.FETCH_ORDERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Creating an order
    case OrderActionTypes.CREATE_ORDER_SUCCESS:
      return {
        ...state,
        orders: [...state.orders, action.payload],
        currentOrder: action.payload
      };

    // Updating an order
    case OrderActionTypes.UPDATE_ORDER_SUCCESS:
      return {
        ...state,
        orders: state.orders.map(order => 
          order.id === action.payload.id ? action.payload : order
        ),
        currentOrder: action.payload
      };

    // Deleting an order
    case OrderActionTypes.DELETE_ORDER_SUCCESS:
      return {
        ...state,
        orders: state.orders.filter(order => order.id !== action.payload),
        currentOrder: null
      };

    // Setting the current order
    case OrderActionTypes.SET_CURRENT_ORDER:
      return {
        ...state,
        currentOrder: action.payload
      };

    // Return current state for any unhandled action types
    default:
      return state;
  }
};

export default orderReducer;

// Human tasks:
// TODO: Implement additional action types as needed for order management features
// TODO: Consider adding more granular error handling for different types of order-related errors
// TODO: Optimize performance by implementing pagination or infinite scrolling for large order lists
// TODO: Add unit tests for the orderReducer function to ensure correct state updates for each action type