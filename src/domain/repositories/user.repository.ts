import { CreateUserData, UpdateUserData, User } from '../entities/user.entity';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  create(data: CreateUserData): Promise<User>;
  update(id: string, data: UpdateUserData): Promise<User | null>;
  delete(id: string): Promise<boolean>;
  updateRefreshToken(
    userId: string,
    refreshToken: string | null
  ): Promise<void>;
  findByRefreshToken(refreshToken: string): Promise<User | null>;
}
