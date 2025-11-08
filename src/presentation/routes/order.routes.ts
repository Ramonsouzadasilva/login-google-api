import { Router } from 'express';
import { z } from 'zod';
import { OrderController } from '../controllers/order.controller';
import {
  validateBody,
  validateParams,
} from '../middlewares/validation.middleware';
import {
  authMiddleware,
  adminMiddleware,
} from '../middlewares/auth.middleware';
import {
  createOrderSchema,
  updateOrderSchema,
} from '../../shared/validations/order.validation';

const uuidSchema = z.object({
  id: z.string().uuid('Invalid order ID'),
});

export function createOrderRoutes(orderController: OrderController): Router {
  const router = Router();
  console.log('Registering order route: /:id');

  router.use(authMiddleware);

  // User routes
  router.post('/', validateBody(createOrderSchema), orderController.create);
  router.get('/my-orders', orderController.getUserOrders);

  // Admin routes
  router.get('/', adminMiddleware, orderController.getAll);
  router.get('/metrics', adminMiddleware, orderController.getMetrics);
  router.get('/:id', validateParams(uuidSchema), orderController.getById);
  router.put(
    '/:id',
    adminMiddleware,
    validateParams(uuidSchema),
    validateBody(updateOrderSchema),
    orderController.update
  );
  router.delete(
    '/:id',
    adminMiddleware,
    validateParams(uuidSchema),
    orderController.delete
  );

  return router;
}
