import { Request, Response, NextFunction } from 'express';
import { logger } from 'src/shared/utils/logger';
import { ApiError } from 'src/shared/utils/ApiError';
import { NODE_ENV } from 'src/shared/constants/index';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error
  logger.error(`Error: ${err.message}`, { error: err });

  // Determine if the error is an instance of ApiError
  const apiError = err instanceof ApiError ? err : new ApiError(500, 'Internal Server Error');

  // Set the response status code
  res.status(apiError.statusCode);

  // Prepare the error response object
  const errorResponse: any = {
    message: apiError.message,
    status: apiError.statusCode,
  };

  // If in development environment, include the error stack in the response
  if (NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  // Send the JSON response with the error details
  res.json(errorResponse);
};