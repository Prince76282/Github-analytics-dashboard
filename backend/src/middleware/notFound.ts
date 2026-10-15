import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  next(new AppError(`Endpoint not found: ${req.method} ${req.originalUrl}`, 404));
};
