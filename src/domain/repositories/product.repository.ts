import {
  CreateProductData,
  Product,
  UpdateProductData,
} from '../entities/product.entity';

export interface ProductRepository {
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  findByCategory(categoryId: string): Promise<Product[]>;
  create(data: CreateProductData): Promise<Product>;
  update(id: string, data: UpdateProductData): Promise<Product | null>;
  delete(id: string): Promise<boolean>;
  updateStock(id: string, quantity: number): Promise<boolean>;
}
