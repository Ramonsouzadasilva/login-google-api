import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/errors/app-error';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({
      status: 'error',
      message: 'Database operation failed',
    });
  }

  // Default error
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
}
