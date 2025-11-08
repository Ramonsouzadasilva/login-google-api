import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateBody } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  createUserSchema,
  loginSchema,
  refreshTokenSchema,
} from '../../shared/validations/user.validation';
import { googleLoginSchema } from '../../shared/validations/login.validation';

export function createAuthRoutes(authController: AuthController): Router {
  const router = Router();
  router.post('/login', validateBody(loginSchema), authController.login);
  router.post(
    '/register',
    validateBody(createUserSchema),
    authController.register
  );
  router.post(
    '/refresh-token',
    validateBody(refreshTokenSchema),
    authController.refreshToken
  );

  router.post('/logout', authMiddleware, authController.logout);

  router.get('/me', authMiddleware, authController.me);

  router.post(
    '/login/google',
    validateBody(googleLoginSchema),
    authController.loginWithGoogle
  );

  return router;
}
