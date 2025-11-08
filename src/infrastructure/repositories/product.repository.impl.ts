import { PrismaClient } from '@prisma/client';
import { ProductRepository } from '../../domain/repositories/product.repository';
import {
  CreateProductData,
  Product,
  UpdateProductData,
} from '../../domain/entities/product.entity';

export class PrismaProductRepository implements ProductRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    return product
      ? ({ ...product, price: Number(product.price) } as Product)
      : null;
  }

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    return products.map((p) => ({ ...p, price: Number(p.price) })) as Product[];
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: { categoryId },
      include: { category: true },
    });
    return products.map((p) => ({ ...p, price: Number(p.price) })) as Product[];
  }

  async create(data: CreateProductData): Promise<Product> {
    const product = await this.prisma.product.create({
      data,
      include: { category: true },
    });
    return { ...product, price: Number(product.price) } as Product;
  }

  async update(id: string, data: UpdateProductData): Promise<Product | null> {
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data,
        include: { category: true },
      });
      return { ...product, price: Number(product.price) } as Product;
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.product.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  async updateStock(id: string, quantity: number): Promise<boolean> {
    try {
      await this.prisma.product.update({
        where: { id },
        data: {
          stock: {
            increment: quantity,
          },
        },
      });
      return true;
    } catch {
      return false;
    }
  }
}
