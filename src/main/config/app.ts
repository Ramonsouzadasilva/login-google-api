import express from 'express';
import cors from 'cors';
// import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import {
  authController,
  userController,
  productController,
  orderController,
} from '../factories/controllers.factory';
import { createAuthRoutes } from '../../presentation/routes/auth.routes';
import { createUserRoutes } from '../../presentation/routes/user.routes';
import { createProductRoutes } from '../../presentation/routes/product.routes';
import { createOrderRoutes } from '../../presentation/routes/order.routes';
import { errorHandler } from '../../presentation/middlewares/error-handler.middleware';

export function createApp() {
  const app = express();

  app.use(cors());

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
  });
  app.use(limiter);

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  app.use('/api/auth', createAuthRoutes(authController));
  app.use('/api/users', createUserRoutes(userController));
  app.use('/api/products', createProductRoutes(productController));
  app.use('/api/orders', createOrderRoutes(orderController));

  app.use(errorHandler);

  return app;
}
