import axios from 'axios';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from 'src/frontend/store';
import { InventoryItem } from 'src/shared/types/inventory';
import { API_BASE_URL } from 'src/frontend/config/constants';

// Action type constants
const FETCH_INVENTORY_REQUEST = 'FETCH_INVENTORY_REQUEST';
const FETCH_INVENTORY_SUCCESS = 'FETCH_INVENTORY_SUCCESS';
const FETCH_INVENTORY_FAILURE = 'FETCH_INVENTORY_FAILURE';
const UPDATE_INVENTORY_REQUEST = 'UPDATE_INVENTORY_REQUEST';
const UPDATE_INVENTORY_SUCCESS = 'UPDATE_INVENTORY_SUCCESS';
const UPDATE_INVENTORY_FAILURE = 'UPDATE_INVENTORY_FAILURE';

// Async action creator to fetch inventory items from the server
export const fetchInventory = (): ThunkAction<void, RootState, unknown, any> => {
  return async (dispatch: Dispatch) => {
    try {
      // Dispatch FETCH_INVENTORY_REQUEST action
      dispatch({ type: FETCH_INVENTORY_REQUEST });

      // Make an API call to fetch inventory items
      const response = await axios.get<InventoryItem[]>(`${API_BASE_URL}/inventory`);

      // If successful, dispatch FETCH_INVENTORY_SUCCESS action with the fetched data
      dispatch({
        type: FETCH_INVENTORY_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      // If failed, dispatch FETCH_INVENTORY_FAILURE action with the error message
      dispatch({
        type: FETCH_INVENTORY_FAILURE,
        payload: error.message,
      });
    }
  };
};

// Async action creator to update a single inventory item
export const updateInventoryItem = (
  item: InventoryItem
): ThunkAction<void, RootState, unknown, any> => {
  return async (dispatch: Dispatch) => {
    try {
      // Dispatch UPDATE_INVENTORY_REQUEST action
      dispatch({ type: UPDATE_INVENTORY_REQUEST });

      // Make an API call to update the inventory item
      const response = await axios.put<InventoryItem>(
        `${API_BASE_URL}/inventory/${item.id}`,
        item
      );

      // If successful, dispatch UPDATE_INVENTORY_SUCCESS action with the updated item
      dispatch({
        type: UPDATE_INVENTORY_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      // If failed, dispatch UPDATE_INVENTORY_FAILURE action with the error message
      dispatch({
        type: UPDATE_INVENTORY_FAILURE,
        payload: error.message,
      });
    }
  };
};

// Human tasks:
// TODO: Implement error handling for network issues
// TODO: Add retry logic for failed requests
// TODO: Implement caching mechanism to reduce API calls
// TODO: Implement optimistic updates for better user experience
// TODO: Add validation checks before sending update request
// TODO: Implement undo functionality for inventory updates
// TODO: Implement additional inventory actions (e.g., add new item, delete item)
// TODO: Add unit tests for all action creators
// TODO: Implement inventory search and filter actions
// TODO: Add action for bulk inventory updates
// TODO: Implement inventory history tracking actions