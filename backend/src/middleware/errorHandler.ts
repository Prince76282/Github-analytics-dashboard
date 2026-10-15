import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details = err.details || undefined;

  // Handle Mongoose duplicate key error (E11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || {})[0] || 'resource';
    message = `This repository is already saved (${field} collision).`;
    details = { duplicateKey: err.keyValue };
  }

  // Handle Mongoose CastError / ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Database validation error';
    details = Object.values(err.errors || {}).map((e: any) => e.message);
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for parameter: ${err.path}`;
  }

  if (env.NODE_ENV !== 'test' && statusCode >= 500) {
    console.error('Unhandled Server Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: statusCode,
      ...(details ? { details } : {}),
      ...(env.NODE_ENV === 'development' && statusCode >= 500 ? { stack: err.stack } : {}),
    },
  });
};
