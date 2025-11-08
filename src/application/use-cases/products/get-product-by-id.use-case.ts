import { ProductRepository } from '../../../domain/repositories/product.repository';
import { Product } from '../../../domain/entities/product.entity';
import { NotFoundError } from '../../../shared/errors/not-found-error';

export class GetProductByIdUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundError('Product');
    }

    return product;
  }
}
