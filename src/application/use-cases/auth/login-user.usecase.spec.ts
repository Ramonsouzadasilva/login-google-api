import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../../../shared/errors/unauthorized-error';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { LoginUserUseCase } from './login-user.use-case';

describe('LoginUserUseCase', () => {
  let userRepository: UserRepository;
  let loginUserUseCase: LoginUserUseCase;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword',
    role: 'USER',
  };

  //   beforeEach(() => {
  //     // Mock do UserRepository
  //     userRepository = {
  //       findByEmail: vi.fn(),
  //       updateRefreshToken: vi.fn(),
  //     } as unknown as UserRepository;

  //     loginUserUseCase = new LoginUserUseCase(userRepository);

  //     // Mock do bcrypt
  //     vi.spyOn(bcrypt, 'compare').mockResolvedValue(true as any);

  //     // Mock do JWT
  //     vi.spyOn(jwt, 'sign').mockImplementation(() => 'mocked-token');
  //   });

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
    process.env.JWT_EXPIRES_IN = '15m';
    process.env.JWT_REFRESH_EXPIRES_IN = '7d';

    userRepository = {
      findByEmail: vi.fn(),
      updateRefreshToken: vi.fn(),
    } as unknown as UserRepository;

    loginUserUseCase = new LoginUserUseCase(userRepository);

    vi.spyOn(bcrypt, 'compare').mockResolvedValue(true as any);
    vi.spyOn(jwt, 'sign').mockImplementation(() => 'mocked-token');
  });

  it('deve logar o usuário com credenciais válidas', async () => {
    (userRepository.findByEmail as any).mockResolvedValue(mockUser);

    const result = await loginUserUseCase.execute({
      email: mockUser.email,
      password: 'validPassword',
    });

    expect(userRepository.findByEmail).toHaveBeenCalledWith(mockUser.email);
    expect(bcrypt.compare).toHaveBeenCalledWith(
      'validPassword',
      mockUser.password
    );
    expect(userRepository.updateRefreshToken).toHaveBeenCalledWith(
      mockUser.id,
      'mocked-token'
    );

    expect(result).toEqual({
      user: {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
      },
      accessToken: 'mocked-token',
      refreshToken: 'mocked-token',
    });
  });

  it('deve lançar UnauthorizedError se o usuário não existir', async () => {
    (userRepository.findByEmail as any).mockResolvedValue(null);

    await expect(
      loginUserUseCase.execute({
        email: 'wrong@example.com',
        password: 'password',
      })
    ).rejects.toThrow(UnauthorizedError);
  });

  it('deve lançar UnauthorizedError se a senha for inválida', async () => {
    (userRepository.findByEmail as any).mockResolvedValue(mockUser);
    (bcrypt.compare as any).mockResolvedValue(false);

    await expect(
      loginUserUseCase.execute({
        email: mockUser.email,
        password: 'wrongPassword',
      })
    ).rejects.toThrow(UnauthorizedError);
  });

  it('deve lançar erro se os segredos JWT não estiverem definidos', async () => {
    (userRepository.findByEmail as any).mockResolvedValue(mockUser);

    // Remove secrets do process.env
    const oldSecret = process.env.JWT_SECRET;
    const oldRefreshSecret = process.env.JWT_REFRESH_SECRET;
    delete process.env.JWT_SECRET;
    delete process.env.JWT_REFRESH_SECRET;

    await expect(
      loginUserUseCase.execute({
        email: mockUser.email,
        password: 'validPassword',
      })
    ).rejects.toThrow('JWT secrets are not defined');

    // restaura
    process.env.JWT_SECRET = oldSecret;
    process.env.JWT_REFRESH_SECRET = oldRefreshSecret;
  });
});
