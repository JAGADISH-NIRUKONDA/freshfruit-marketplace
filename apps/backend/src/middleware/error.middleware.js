import { ZodError } from 'zod';
import { AppError, errorResponse } from '../utils/response.js';

export const notFoundHandler = (req, res, next) => {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));
};

export const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  // 1. Zod Validation Errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    return errorResponse(res, {
      statusCode: 400,
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }

  // 2. Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return errorResponse(res, {
      statusCode: 409,
      message: `A record with that ${field} already exists.`,
      errors: [{ field, message: `${field} is already taken.` }],
    });
  }

  // 3. Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((el) => ({
      field: el.path,
      message: el.message,
    }));
    return errorResponse(res, {
      statusCode: 400,
      message: 'Invalid input data',
      errors,
    });
  }

  // 4. Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return errorResponse(res, {
      statusCode: 400,
      message: `Invalid format for field: ${err.path}`,
    });
  }

  // 5. JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, {
      statusCode: 401,
      message: 'Invalid authentication token.',
    });
  }
  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, {
      statusCode: 401,
      message: 'Authentication token has expired. Please log in again.',
    });
  }

  // 6. Custom Operational AppError
  if (err instanceof AppError) {
    return errorResponse(res, {
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
    });
  }

  // 7. Unhandled Unexpected Server Errors
  console.error('[Unhandled Error]', err);
  const isProduction = process.env.NODE_ENV === 'production';
  return errorResponse(res, {
    statusCode: 500,
    message: isProduction ? 'Internal Server Error' : err.message,
    errors: isProduction ? null : err.stack,
  });
};

