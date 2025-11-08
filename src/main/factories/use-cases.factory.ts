import {
  userRepository,
  productRepository,
  orderRepository,
} from './repositories.factory';

// Auth use cases
import { LoginUserUseCase } from '../../application/use-cases/auth/login-user.use-case';
import { LoginWithGoogleUseCase } from '../../application/use-cases/auth/login-user-google.use-case';
import { RegisterUserUseCase } from '../../application/use-cases/auth/register-user.use-case';

// User use cases
import { GetAllUsersUseCase } from '../../application/use-cases/users/get-all-users.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/users/get-user-by-id.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/users/update-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/users/delete-user.use-case';

// Product use cases
import { CreateProductUseCase } from '../../application/use-cases/products/create-product.use-case';
import { GetAllProductsUseCase } from '../../application/use-cases/products/get-all-products.use-case';
import { GetProductByIdUseCase } from '../../application/use-cases/products/get-product-by-id.use-case';
import { UpdateProductUseCase } from '../../application/use-cases/products/update-product.use-case';
import { DeleteProductUseCase } from '../../application/use-cases/products/delete-product.use-case';

// Order use cases
import { CreateOrderUseCase } from '../../application/use-cases/orders/create-order.use-case';
import { GetAllOrdersUseCase } from '../../application/use-cases/orders/get-all-orders.use-case';
import { GetOrderByIdUseCase } from '../../application/use-cases/orders/get-order-by-id.use-case';
import { GetUserOrdersUseCase } from '../../application/use-cases/orders/get-user-orders.use-case';
import { UpdateOrderUseCase } from '../../application/use-cases/orders/update-order.use-case';
import { DeleteOrderUseCase } from '../../application/use-cases/orders/delete-order.use-case';
import { GetOrderMetricsUseCase } from '../../application/use-cases/orders/get-order-metrics.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/auth/refresh-token.use-case';
import { LogoutUserUseCase } from '../../application/use-cases/auth/logout-user-case';

// Auth use cases instances
export const loginUserUseCase = new LoginUserUseCase(userRepository);
export const loginWithGoogleUseCase = new LoginWithGoogleUseCase(
  userRepository
);
export const registerUserUseCase = new RegisterUserUseCase(userRepository);
export const refreshTokenUseCase = new RefreshTokenUseCase(userRepository);
export const logoutUseCase = new LogoutUserUseCase(userRepository);

// User use cases instances
export const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
export const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
export const updateUserUseCase = new UpdateUserUseCase(userRepository);
export const deleteUserUseCase = new DeleteUserUseCase(userRepository);

// Product use cases instances
export const createProductUseCase = new CreateProductUseCase(productRepository);
export const getAllProductsUseCase = new GetAllProductsUseCase(
  productRepository
);
export const getProductByIdUseCase = new GetProductByIdUseCase(
  productRepository
);
export const updateProductUseCase = new UpdateProductUseCase(productRepository);
export const deleteProductUseCase = new DeleteProductUseCase(productRepository);

// Order use cases instances
export const createOrderUseCase = new CreateOrderUseCase(orderRepository);
export const getAllOrdersUseCase = new GetAllOrdersUseCase(orderRepository);
export const getOrderByIdUseCase = new GetOrderByIdUseCase(orderRepository);
export const getUserOrdersUseCase = new GetUserOrdersUseCase(orderRepository);
export const updateOrderUseCase = new UpdateOrderUseCase(orderRepository);
export const deleteOrderUseCase = new DeleteOrderUseCase(orderRepository);
export const getOrderMetricsUseCase = new GetOrderMetricsUseCase(
  orderRepository
);
