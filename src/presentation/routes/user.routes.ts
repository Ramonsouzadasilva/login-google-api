import { Router } from 'express';
import { z } from 'zod';
import { UserController } from '../controllers/user.controller';
import {
  validateBody,
  validateParams,
} from '../middlewares/validation.middleware';
import {
  authMiddleware,
  adminMiddleware,
} from '../middlewares/auth.middleware';
import { updateUserSchema } from '../../shared/validations/user.validation';

const uuidSchema = z.object({
  id: z.string().uuid('Invalid user ID'),
});

export function createUserRoutes(userController: UserController): Router {
  const router = Router();
  console.log('Registering user route: /:id');
  router.use(authMiddleware);
  router.use(adminMiddleware);

  router.get('/', userController.getAll);
  router.get('/:id', validateParams(uuidSchema), userController.getById);
  router.put(
    '/:id',
    validateParams(uuidSchema),
    validateBody(updateUserSchema),
    userController.update
  );
  router.delete('/:id', validateParams(uuidSchema), userController.delete);

  return router;
}
