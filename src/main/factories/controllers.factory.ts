import { LoginWithGoogleUseCase } from './../../application/use-cases/auth/login-user-google.use-case';
import {
  loginUserUseCase,
  registerUserUseCase,
  getAllUsersUseCase,
  getUserByIdUseCase,
  updateUserUseCase,
  deleteUserUseCase,
  createProductUseCase,
  getAllProductsUseCase,
  getProductByIdUseCase,
  updateProductUseCase,
  deleteProductUseCase,
  createOrderUseCase,
  getAllOrdersUseCase,
  getOrderByIdUseCase,
  getUserOrdersUseCase,
  updateOrderUseCase,
  deleteOrderUseCase,
  getOrderMetricsUseCase,
  logoutUseCase,
  refreshTokenUseCase,
  loginWithGoogleUseCase,
} from './use-cases.factory';

import { AuthController } from '../../presentation/controllers/auth.controller';
import { UserController } from '../../presentation/controllers/user.controller';
import { ProductController } from '../../presentation/controllers/product.controller';
import { OrderController } from '../../presentation/controllers/order.controller';

export const authController = new AuthController(
  loginUserUseCase,
  registerUserUseCase,
  refreshTokenUseCase,
  logoutUseCase,
  loginWithGoogleUseCase
);

export const userController = new UserController(
  getAllUsersUseCase,
  getUserByIdUseCase,
  updateUserUseCase,
  deleteUserUseCase
);

export const productController = new ProductController(
  createProductUseCase,
  getAllProductsUseCase,
  getProductByIdUseCase,
  updateProductUseCase,
  deleteProductUseCase
);

export const orderController = new OrderController(
  createOrderUseCase,
  getAllOrdersUseCase,
  getOrderByIdUseCase,
  getUserOrdersUseCase,
  updateOrderUseCase,
  deleteOrderUseCase,
  getOrderMetricsUseCase
);
