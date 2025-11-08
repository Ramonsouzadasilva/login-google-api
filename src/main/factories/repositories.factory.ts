import { prisma } from '../config/database';
import { PrismaUserRepository } from '../../infrastructure/repositories/user.repository.impl';
import { PrismaProductRepository } from '../../infrastructure/repositories/product.repository.impl';
import { PrismaOrderRepository } from '../../infrastructure/repositories/order.repository.impl';

// Repository instances
export const userRepository = new PrismaUserRepository(prisma);
export const productRepository = new PrismaProductRepository(prisma);
export const orderRepository = new PrismaOrderRepository(prisma);
