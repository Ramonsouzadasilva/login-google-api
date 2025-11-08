import { OrderRepository } from '../../../domain/repositories/order.repository';
import { Order } from '../../../domain/entities/order.entity';
import { NotFoundError } from '../../../shared/errors/not-found-error';

export class GetOrderByIdUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new NotFoundError('Order');
    }

    return order;
  }
}
