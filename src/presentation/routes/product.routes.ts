import { Router } from 'express';
import { z } from 'zod';
import { ProductController } from '../controllers/product.controller';
import {
  validateBody,
  validateParams,
} from '../middlewares/validation.middleware';
import {
  authMiddleware,
  adminMiddleware,
} from '../middlewares/auth.middleware';
import {
  createProductSchema,
  updateProductSchema,
} from '../../shared/validations/product.validation';

const uuidSchema = z.object({
  id: z.string().uuid('Invalid product ID'),
});

export function createProductRoutes(
  productController: ProductController
): Router {
  const router = Router();

  // Public routes
  router.get('/', productController.getAll);

  // Admin only routes
  router.post(
    '/',
    authMiddleware,
    adminMiddleware,
    validateBody(createProductSchema),
    productController.create
  );
  router.get('/:id', validateParams(uuidSchema), productController.getById);
  router.put(
    '/:id',
    authMiddleware,
    adminMiddleware,
    validateParams(uuidSchema),
    validateBody(updateProductSchema),
    productController.update
  );
  router.delete(
    '/:id',
    authMiddleware,
    adminMiddleware,
    validateParams(uuidSchema),
    productController.delete
  );

  return router;
}
