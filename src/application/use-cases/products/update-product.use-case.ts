import { ProductRepository } from '../../../domain/repositories/product.repository';
import {
  UpdateProductData,
  Product,
} from '../../../domain/entities/product.entity';
import { NotFoundError } from '../../../shared/errors/not-found-error';

export class UpdateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(id: string, data: UpdateProductData): Promise<Product> {
    const updatedProduct = await this.productRepository.update(id, data);

    if (!updatedProduct) {
      throw new NotFoundError('Product');
    }

    return updatedProduct;
  }
}
