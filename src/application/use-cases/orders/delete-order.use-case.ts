import { OrderRepository } from '../../../domain/repositories/order.repository';
import { NotFoundError } from '../../../shared/errors/not-found-error';

export class DeleteOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(id: string): Promise<void> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new NotFoundError('Order');
    }

    await this.orderRepository.delete(id);
  }
}
