import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { UserRepository } from '../../domain/repositories/user.repository';
import {
  CreateUserData,
  UpdateUserData,
  User,
} from '../../domain/entities/user.entity';

export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user as User | null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user as User | null;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return users as User[];
  }

  // async create(data: CreateUserData): Promise<User> {
  //   const hashedPassword = await bcrypt.hash(data.password, 10);

  //   const user = await this.prisma.user.create({
  //     data: {
  //       ...data,
  //       password: hashedPassword,
  //     },
  //   });

  //   return user as User;
  // }

  async create(data: CreateUserData): Promise<User> {
    let hashedPassword: string | undefined;

    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    return user as User;
  }

  async update(id: string, data: UpdateUserData): Promise<User | null> {
    const updateData = { ...data };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    return user as User;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  async findByRefreshToken(refreshToken: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { refreshToken },
    });
  }
}
