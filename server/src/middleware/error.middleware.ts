import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// Custom error class for API errors
export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Error handler middleware
export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default error values
  let statusCode = 500;
  let message = 'Internal Server Error';
  let isOperational = false;

  // If it's our ApiError, use its properties
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  } else if (err.name === 'ValidationError') {
    // Mongoose validation error
    statusCode = 400;
    message = err.message;
    isOperational = true;
  } else if (err.name === 'CastError') {
    // Mongoose cast error
    statusCode = 400;
    message = 'Invalid ID format';
    isOperational = true;
  } else if (err.name === 'JsonWebTokenError') {
    // JWT validation error
    statusCode = 401;
    message = 'Invalid token';
    isOperational = true;
  }

  // Log error
  if (isOperational) {
    logger.warn(`Operational error: ${message}`);
  } else {
    logger.error(`Unhandled error: ${err.message}`, { error: err });
  }

  // Send error response
  const response = {
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

// 404 handler - to be used in app.ts
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new ApiError(404, `Resource not found - ${req.originalUrl}`);
  next(error);
};