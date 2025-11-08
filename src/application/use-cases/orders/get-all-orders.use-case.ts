import { OrderRepository } from '../../../domain/repositories/order.repository';
import { Order } from '../../../domain/entities/order.entity';

export class GetAllOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(): Promise<Order[]> {
    return await this.orderRepository.findAll();
  }
}
