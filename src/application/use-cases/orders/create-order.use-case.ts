import { OrderRepository } from '../../../domain/repositories/order.repository';
import { CreateOrderData, Order } from '../../../domain/entities/order.entity';

export class CreateOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(data: CreateOrderData): Promise<Order> {
    return await this.orderRepository.create(data);
  }
}
