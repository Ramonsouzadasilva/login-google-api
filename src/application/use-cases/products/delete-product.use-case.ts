import { ProductRepository } from '../../../domain/repositories/product.repository';
import { NotFoundError } from '../../../shared/errors/not-found-error';

export class DeleteProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundError('Product');
    }

    await this.productRepository.delete(id);
  }
}
