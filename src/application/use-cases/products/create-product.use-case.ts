import { ProductRepository } from '../../../domain/repositories/product.repository';
import {
  CreateProductData,
  Product,
} from '../../../domain/entities/product.entity';

export class CreateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(data: CreateProductData): Promise<Product> {
    return await this.productRepository.create(data);
  }
}
