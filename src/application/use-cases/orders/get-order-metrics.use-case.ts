import { OrderRepository } from '../../../domain/repositories/order.repository';

export class GetOrderMetricsUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute() {
    return await this.orderRepository.getMetrics();
  }
}
