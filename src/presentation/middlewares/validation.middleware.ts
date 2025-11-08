import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '../../shared/errors/validation-error';

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error: any) {
      if (error.errors) {
        const message = error.errors.map((err: any) => err.message).join(', ');
        next(new ValidationError(message));
      } else {
        next(new ValidationError('Invalid data'));
      }
    }
  };
}

export function validateParams(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.params);
      req.params = validatedData as unknown as typeof req.params;
      next();
    } catch (error: any) {
      if (error.errors) {
        const message = error.errors.map((err: any) => err.message).join(', ');
        next(new ValidationError(message));
      } else {
        next(new ValidationError('Invalid parameters'));
      }
    }
  };
}
