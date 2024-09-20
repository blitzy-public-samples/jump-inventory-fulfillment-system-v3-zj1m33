import * as constants from '../constants/roles';

// Represents a user in the system
export interface User {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: string | null;
}

// Represents user credentials for authentication
export interface UserCredentials {
  username: string;
  password: string;
}

// Represents user profile information
export interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  firstName: string | null;
  lastName: string | null;
}

// Defines possible user roles in the system
export type UserRole = typeof constants.ROLES[keyof typeof constants.ROLES];

// Represents an authentication token
export type AuthToken = string;

// Represents a user session
export type UserSession = {
  userId: number;
  token: AuthToken;
  expiresAt: Date;
};

// Human tasks:
// TODO: Review and validate the user role definitions to ensure they align with the latest business requirements
// TODO: Consider adding additional properties to the UserProfile interface if more user information is needed
// TODO: Implement proper input validation and sanitization for user-related data in the application logic