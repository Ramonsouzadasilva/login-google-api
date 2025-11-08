import {
  CreateOrderData,
  Order,
  UpdateOrderData,
} from '../entities/order.entity';

export interface OrderRepository {
  findById(id: string): Promise<Order | null>;
  findByUserId(userId: string): Promise<Order[]>;
  findAll(): Promise<Order[]>;
  create(data: CreateOrderData): Promise<Order>;
  update(id: string, data: UpdateOrderData): Promise<Order | null>;
  delete(id: string): Promise<boolean>;
  getMetrics(): Promise<{
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    ordersByStatus: Record<string, number>;
  }>;
}
