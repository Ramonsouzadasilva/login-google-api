import { PrismaClient } from '@prisma/client';
import { OrderRepository } from '../../domain/repositories/order.repository';
import {
  CreateOrderData,
  Order,
  UpdateOrderData,
} from '../../domain/entities/order.entity';

export class PrismaOrderRepository implements OrderRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) return null;

    return {
      ...order,
      total: Number(order.total),
      orderItems: order.orderItems.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
    } as Order;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => ({
      ...order,
      total: Number(order.total),
      orderItems: order.orderItems.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
    })) as Order[];
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => ({
      ...order,
      total: Number(order.total),
      orderItems: order.orderItems.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
    })) as Order[];
  }

  async create(data: CreateOrderData): Promise<Order> {
    return await this.prisma.$transaction(async (tx) => {
      // Calculate total and validate products
      let total = 0;
      const orderItems = [];

      for (const item of data.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.name}`);
        }

        const itemTotal = Number(product.price) * item.quantity;
        total += itemTotal;

        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        });

        // Update product stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Create order
      const order = await tx.order.create({
        data: {
          userId: data.userId,
          total,
          orderItems: {
            create: orderItems,
          },
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      return {
        ...order,
        total: Number(order.total),
        orderItems: order.orderItems.map((item) => ({
          ...item,
          price: Number(item.price),
        })),
      } as Order;
    });
  }

  async update(id: string, data: UpdateOrderData): Promise<Order | null> {
    try {
      const order = await this.prisma.order.update({
        where: { id },
        data,
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      return {
        ...order,
        total: Number(order.total),
        orderItems: order.orderItems.map((item) => ({
          ...item,
          price: Number(item.price),
        })),
      } as Order;
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.order.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  async getMetrics() {
    const [orders, revenue] = await Promise.all([
      this.prisma.order.groupBy({
        by: ['status'],
        _count: true,
      }),
      this.prisma.order.aggregate({
        _sum: {
          total: true,
        },
        _avg: {
          total: true,
        },
        _count: true,
      }),
    ]);

    const ordersByStatus = orders.reduce((acc, order) => {
      acc[order.status] = order._count;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalOrders: revenue._count,
      totalRevenue: Number(revenue._sum.total) || 0,
      averageOrderValue: Number(revenue._avg.total) || 0,
      ordersByStatus,
    };
  }
}
