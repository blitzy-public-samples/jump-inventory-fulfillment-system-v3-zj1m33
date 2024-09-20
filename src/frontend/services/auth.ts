import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { User } from '../types/user';
import { AuthResponse } from '../types/auth';
import { API_BASE_URL } from '../config/constants';

const LOCAL_STORAGE_TOKEN_KEY = 'auth_token';

// Authenticates a user and stores the JWT token
export const login = async (email: string, password: string): Promise<User> => {
  try {
    // Send a POST request to the login endpoint with email and password
    const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/login`, { email, password });
    
    // Receive the JWT token in the response
    const { token } = response.data;
    
    // Store the token in local storage
    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
    
    // Decode the token to get user information
    const user = jwtDecode<User>(token);
    
    // Return the user object
    return user;
  } catch (error) {
    throw new Error('Login failed');
  }
};

// Logs out the current user by removing the stored token
export const logout = (): void => {
  // Remove the JWT token from local storage
  localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
};

// Registers a new user
export const register = async (email: string, password: string, name: string): Promise<User> => {
  try {
    // Send a POST request to the registration endpoint with user details
    const response = await axios.post<User>(`${API_BASE_URL}/auth/register`, { email, password, name });
    
    // Receive the newly created user object in the response
    const user = response.data;
    
    // Return the user object
    return user;
  } catch (error) {
    throw new Error('Registration failed');
  }
};

// Initiates the password reset process
export const forgotPassword = async (email: string): Promise<void> => {
  try {
    // Send a POST request to the forgot password endpoint with the user's email
    await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
    
    // Handle the response (e.g., show a success message to the user)
    console.log('Password reset email sent');
  } catch (error) {
    throw new Error('Failed to initiate password reset');
  }
};

// Resets the user's password using a reset token
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  try {
    // Send a POST request to the reset password endpoint with the token and new password
    await axios.post(`${API_BASE_URL}/auth/reset-password`, { token, newPassword });
    
    // Handle the response (e.g., redirect to login page on success)
    console.log('Password reset successful');
  } catch (error) {
    throw new Error('Failed to reset password');
  }
};

// Retrieves the current authenticated user based on the stored token
export const getCurrentUser = (): User | null => {
  // Retrieve the JWT token from local storage
  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  
  if (token) {
    // If token exists, decode it to get user information
    try {
      return jwtDecode<User>(token);
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  }
  
  // Return null if no token is found or decoding fails
  return null;
};

// Checks if the user is currently authenticated
export const isAuthenticated = (): boolean => {
  // Check if a valid JWT token exists in local storage
  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  
  if (token) {
    try {
      const decodedToken: { exp: number } = jwtDecode(token);
      // Return true if token exists and is not expired, false otherwise
      return decodedToken.exp > Date.now() / 1000;
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  }
  
  return false;
};

// Retrieves the current authentication token
export const getAuthToken = (): string | null => {
  // Retrieve the JWT token from local storage
  return localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
};

// Human tasks:
// TODO: Implement token refresh mechanism to handle token expiration
// TODO: Add error handling for network issues and invalid credentials
// TODO: Implement secure token storage (e.g., HttpOnly cookies) instead of local storage for production
// TODO: Add multi-factor authentication support
// TODO: Implement logout functionality on the server-side (token invalidation)