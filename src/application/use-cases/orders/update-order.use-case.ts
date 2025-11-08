import { OrderRepository } from '../../../domain/repositories/order.repository';
import { UpdateOrderData, Order } from '../../../domain/entities/order.entity';
import { NotFoundError } from '../../../shared/errors/not-found-error';

export class UpdateOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(id: string, data: UpdateOrderData): Promise<Order> {
    const updatedOrder = await this.orderRepository.update(id, data);

    if (!updatedOrder) {
      throw new NotFoundError('Order');
    }

    return updatedOrder;
  }
}
