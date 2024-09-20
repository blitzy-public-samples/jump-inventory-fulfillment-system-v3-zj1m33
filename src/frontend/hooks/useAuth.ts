import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, refreshToken } from '../store/actions/userActions';
import { setAuthToken, removeAuthToken } from '../services/api';
import { isTokenExpired } from '../utils/validators';

// Interface defining the authentication state
interface AuthState {
  isAuthenticated: boolean;
  user: object | null;
  token: string | null;
}

// Custom hook for managing authentication state and operations
const useAuth = () => {
  // Initialize state for authentication using useState
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });

  // Get dispatch function from useDispatch
  const dispatch = useDispatch();

  // Select user state from Redux store using useSelector
  const userState = useSelector((state: any) => state.user);

  // Define loginUser function to handle user login
  const loginUser = useCallback(async (email: string, password: string) => {
    try {
      const action = await dispatch(login(email, password));
      if (action.payload) {
        setAuthState({
          isAuthenticated: true,
          user: action.payload.user,
          token: action.payload.token,
        });
        setAuthToken(action.payload.token);
      }
    } catch (error) {
      console.error('Login failed:', error);
      // TODO: Implement proper error handling for failed login attempts
    }
  }, [dispatch]);

  // Define logoutUser function to handle user logout
  const logoutUser = useCallback(() => {
    dispatch(logout());
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
    removeAuthToken();
  }, [dispatch]);

  // Define checkAuthStatus function to check and refresh token if needed
  const checkAuthStatus = useCallback(async () => {
    if (authState.token && isTokenExpired(authState.token)) {
      try {
        const action = await dispatch(refreshToken());
        if (action.payload) {
          setAuthState({
            isAuthenticated: true,
            user: action.payload.user,
            token: action.payload.token,
          });
          setAuthToken(action.payload.token);
        } else {
          logoutUser();
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        logoutUser();
      }
    }
  }, [authState.token, dispatch, logoutUser]);

  // Use useEffect to check auth status on component mount and set up interval for periodic checks
  useEffect(() => {
    checkAuthStatus();
    const intervalId = setInterval(checkAuthStatus, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(intervalId);
  }, [checkAuthStatus]);

  // Update authState when userState changes
  useEffect(() => {
    setAuthState({
      isAuthenticated: !!userState.token,
      user: userState.user,
      token: userState.token,
    });
  }, [userState]);

  // Return authentication state and methods
  return {
    ...authState,
    loginUser,
    logoutUser,
  };
};

export default useAuth;

// TODO: Implement proper error handling for failed login attempts
// TODO: Add unit tests for the useAuth hook
// TODO: Consider implementing a more robust token refresh mechanism
// TODO: Evaluate the security of token storage and consider using HttpOnly cookies