import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from 'src/backend/models/User';
import { JWT_SECRET } from 'src/shared/constants/index';
import { handleApiError } from 'src/shared/utils/index';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    // If no token is provided, return a 401 Unauthorized error
    if (!token) {
      return handleApiError(res, 'No token provided', 401);
    }

    // Verify the token using jwt.verify and the JWT_SECRET
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // If token is invalid, jwt.verify will throw an error, which will be caught in the catch block

    // Fetch the user from the database using the userId from the decoded token
    const user = await User.findByPk(decoded.userId);

    // If user is not found, return a 401 Unauthorized error
    if (!user) {
      return handleApiError(res, 'User not found', 401);
    }

    // Attach the user object to the request
    (req as any).user = user;

    // Call next() to pass control to the next middleware
    next();
  } catch (error) {
    // If token is invalid or any other error occurs, return a 401 Unauthorized error
    handleApiError(res, 'Invalid token', 401);
  }
};