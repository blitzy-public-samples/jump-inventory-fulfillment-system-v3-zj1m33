import axios from 'axios';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from 'src/frontend/store';
import { User } from 'src/shared/types/user';
import { API_BASE_URL } from 'src/frontend/config/constants';

// Action types
export const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST';
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
export const USER_LOGIN_FAILURE = 'USER_LOGIN_FAILURE';
export const USER_LOGOUT = 'USER_LOGOUT';
export const USER_REGISTER_REQUEST = 'USER_REGISTER_REQUEST';
export const USER_REGISTER_SUCCESS = 'USER_REGISTER_SUCCESS';
export const USER_REGISTER_FAILURE = 'USER_REGISTER_FAILURE';
export const USER_PROFILE_REQUEST = 'USER_PROFILE_REQUEST';
export const USER_PROFILE_SUCCESS = 'USER_PROFILE_SUCCESS';
export const USER_PROFILE_FAILURE = 'USER_PROFILE_FAILURE';
export const USER_UPDATE_PROFILE_REQUEST = 'USER_UPDATE_PROFILE_REQUEST';
export const USER_UPDATE_PROFILE_SUCCESS = 'USER_UPDATE_PROFILE_SUCCESS';
export const USER_UPDATE_PROFILE_FAILURE = 'USER_UPDATE_PROFILE_FAILURE';

// Action creator for user login
export const login = (email: string, password: string): ThunkAction<Promise<void>, RootState, unknown, any> => {
  return async (dispatch: Dispatch) => {
    try {
      // Dispatch login request action
      dispatch({ type: USER_LOGIN_REQUEST });

      // Make a POST request to /api/users/login with email and password
      const { data } = await axios.post(`${API_BASE_URL}/api/users/login`, { email, password });

      // Dispatch login success action with user data
      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: data,
      });

      // Store user data in localStorage
      localStorage.setItem('userData', JSON.stringify(data));
    } catch (error) {
      // Dispatch login failure action with error message
      dispatch({
        type: USER_LOGIN_FAILURE,
        payload: error.response && error.response.data.message ? error.response.data.message : error.message,
      });
    }
  };
};

// Action creator for user logout
export const logout = (): ThunkAction<void, RootState, unknown, any> => (dispatch: Dispatch) => {
  // Remove user data from localStorage
  localStorage.removeItem('userData');

  // Dispatch logout action
  dispatch({ type: USER_LOGOUT });
};

// Action creator for user registration
export const register = (name: string, email: string, password: string): ThunkAction<Promise<void>, RootState, unknown, any> => {
  return async (dispatch: Dispatch) => {
    try {
      // Dispatch register request action
      dispatch({ type: USER_REGISTER_REQUEST });

      // Make a POST request to /api/users with name, email, and password
      const { data } = await axios.post(`${API_BASE_URL}/api/users`, { name, email, password });

      // Dispatch register success action with user data
      dispatch({
        type: USER_REGISTER_SUCCESS,
        payload: data,
      });

      // Store user data in localStorage
      localStorage.setItem('userData', JSON.stringify(data));
    } catch (error) {
      // Dispatch register failure action with error message
      dispatch({
        type: USER_REGISTER_FAILURE,
        payload: error.response && error.response.data.message ? error.response.data.message : error.message,
      });
    }
  };
};

// Action creator to fetch user profile
export const getUserProfile = (): ThunkAction<Promise<void>, RootState, unknown, any> => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      // Dispatch profile request action
      dispatch({ type: USER_PROFILE_REQUEST });

      // Get the user token from the state
      const { userLogin: { userInfo } } = getState();

      // Set the authorization header
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // Make a GET request to /api/users/profile
      const { data } = await axios.get(`${API_BASE_URL}/api/users/profile`, config);

      // Dispatch profile success action with user data
      dispatch({
        type: USER_PROFILE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      // Dispatch profile failure action with error message
      dispatch({
        type: USER_PROFILE_FAILURE,
        payload: error.response && error.response.data.message ? error.response.data.message : error.message,
      });
    }
  };
};

// Action creator to update user profile
export const updateUserProfile = (user: User): ThunkAction<Promise<void>, RootState, unknown, any> => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      // Dispatch update profile request action
      dispatch({ type: USER_UPDATE_PROFILE_REQUEST });

      // Get the user token from the state
      const { userLogin: { userInfo } } = getState();

      // Set the authorization header
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // Make a PUT request to /api/users/profile with updated user data
      const { data } = await axios.put(`${API_BASE_URL}/api/users/profile`, user, config);

      // Dispatch update profile success action with updated user data
      dispatch({
        type: USER_UPDATE_PROFILE_SUCCESS,
        payload: data,
      });

      // Update user data in localStorage
      localStorage.setItem('userData', JSON.stringify(data));
    } catch (error) {
      // Dispatch update profile failure action with error message
      dispatch({
        type: USER_UPDATE_PROFILE_FAILURE,
        payload: error.response && error.response.data.message ? error.response.data.message : error.message,
      });
    }
  };
};

// Human tasks:
// TODO: Implement proper error handling for network issues
// TODO: Add input validation before making the API call
// TODO: Implement a call to the backend to invalidate the user's session
// TODO: Implement email verification process
// TODO: Add strong password requirements
// TODO: Implement caching mechanism for user profile data
// TODO: Implement field-level validation before sending update request
// TODO: Add support for profile picture upload
// TODO: Implement multi-factor authentication (MFA) actions
// TODO: Add actions for password reset functionality
// TODO: Implement actions for user role management (for admin users)
// TODO: Add unit tests for all action creators