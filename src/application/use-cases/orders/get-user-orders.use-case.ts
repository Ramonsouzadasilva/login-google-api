import { OrderRepository } from '../../../domain/repositories/order.repository';
import { Order } from '../../../domain/entities/order.entity';

export class GetUserOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(userId: string): Promise<Order[]> {
    return await this.orderRepository.findByUserId(userId);
  }
}
