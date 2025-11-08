import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RegisterUserUseCase } from './register-user.use-case';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { ValidationError } from '../../../shared/errors/validation-error';
import { User, Role } from '@prisma/client';
import { CreateUserData } from '../../../domain/entities/user.entity';

// Mock do repository
const mockUserRepository: UserRepository = {
  findById: vi.fn(),
  findByEmail: vi.fn(),
  findAll: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  updateRefreshToken: vi.fn(),
  findByRefreshToken: vi.fn(),
};

describe('RegisterUserUseCase', () => {
  let registerUserUseCase: RegisterUserUseCase;

  beforeEach(() => {
    // Limpa todos os mocks antes de cada teste
    vi.clearAllMocks();

    // Cria nova instância do use case
    registerUserUseCase = new RegisterUserUseCase(mockUserRepository);
  });

  describe('execute', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const createUserData: CreateUserData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword123',
        role: Role.USER,
      };

      const createdUser: User = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword123',
        role: Role.USER,
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock: email não existe
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);

      // Mock: criação do usuário
      vi.mocked(mockUserRepository.create).mockResolvedValue(createdUser);

      // Act
      const result = await registerUserUseCase.execute(createUserData);

      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com'
      );
      expect(mockUserRepository.findByEmail).toHaveBeenCalledTimes(1);

      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserData);
      expect(mockUserRepository.create).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        role: Role.USER,
        refreshToken: null,
        createdAt: createdUser.createdAt,
        updatedAt: createdUser.updatedAt,
      });

      expect(result).not.toHaveProperty('password');
    });

    it('should throw ValidationError when email already exists', async () => {
      // Arrange
      const createUserData: CreateUserData = {
        email: 'existing@example.com',
        name: 'Test User',
        password: 'hashedPassword123',
        role: Role.USER,
      };

      const existingUser: User = {
        id: '456',
        email: 'existing@example.com',
        name: 'Existing User',
        password: 'hashedPassword456',
        role: Role.USER,
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock: email já existe
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(existingUser);

      // Act & Assert
      await expect(registerUserUseCase.execute(createUserData)).rejects.toThrow(
        ValidationError
      );

      await expect(registerUserUseCase.execute(createUserData)).rejects.toThrow(
        'Email already exists'
      );

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'existing@example.com'
      );
      expect(mockUserRepository.findByEmail).toHaveBeenCalledTimes(2); // chamado 2x devido aos 2 expects
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should create user with ADMIN role when specified', async () => {
      // Arrange
      const createUserData: CreateUserData = {
        email: 'admin@example.com',
        name: 'Admin User',
        password: 'hashedPassword123',
        role: Role.ADMIN,
      };

      const createdUser: User = {
        id: '789',
        email: 'admin@example.com',
        name: 'Admin User',
        password: 'hashedPassword123',
        role: Role.ADMIN,
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);
      vi.mocked(mockUserRepository.create).mockResolvedValue(createdUser);

      // Act
      const result = await registerUserUseCase.execute(createUserData);

      // Assert
      expect(result.role).toBe(Role.ADMIN);
      expect(result).not.toHaveProperty('password');
    });

    it('should not include password in the returned user object', async () => {
      // Arrange
      const createUserData: CreateUserData = {
        email: 'security@example.com',
        name: 'Security Test',
        password: 'superSecretPassword',
        role: Role.USER,
      };

      const createdUser: User = {
        id: '999',
        email: 'security@example.com',
        name: 'Security Test',
        password: 'superSecretPassword',
        role: Role.USER,
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);
      vi.mocked(mockUserRepository.create).mockResolvedValue(createdUser);

      // Act
      const result = await registerUserUseCase.execute(createUserData);

      // Assert
      expect(result).not.toHaveProperty('password');
      expect(Object.keys(result)).not.toContain('password');
    });

    it('should handle repository errors', async () => {
      // Arrange
      const createUserData: CreateUserData = {
        email: 'error@example.com',
        name: 'Error Test',
        password: 'password123',
        role: Role.USER,
      };

      const databaseError = new Error('Database connection failed');

      vi.mocked(mockUserRepository.findByEmail).mockRejectedValue(
        databaseError
      );

      // Act & Assert
      await expect(registerUserUseCase.execute(createUserData)).rejects.toThrow(
        'Database connection failed'
      );

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'error@example.com'
      );
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });
});
