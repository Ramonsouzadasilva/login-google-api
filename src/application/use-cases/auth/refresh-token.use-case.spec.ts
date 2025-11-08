import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';
import { RefreshTokenUseCase } from './refresh-token.use-case';
import { UnauthorizedError } from '../../../shared/errors/unauthorized-error';
import { UserRepository } from '../../../domain/repositories/user.repository';

describe('RefreshTokenUseCase', () => {
  let userRepository: UserRepository;
  let refreshTokenUseCase: RefreshTokenUseCase;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    role: 'USER',
    refreshToken: 'old-refresh-token',
  };

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
    process.env.JWT_EXPIRES_IN = '15m';
    process.env.JWT_REFRESH_EXPIRES_IN = '7d';

    userRepository = {
      findByRefreshToken: vi.fn(),
      updateRefreshToken: vi.fn(),
    } as unknown as UserRepository;

    refreshTokenUseCase = new RefreshTokenUseCase(userRepository);

    // Mock do jwt
    vi.spyOn(jwt, 'verify').mockImplementation((token: string) => {
      if (token === 'invalid-token') throw new Error('invalid');
      return { userId: mockUser.id };
    });
    vi.spyOn(jwt, 'sign').mockImplementation(() => 'mocked-token');
  });

  it('deve gerar novos tokens com refresh token válido', async () => {
    (userRepository.findByRefreshToken as any).mockResolvedValue(mockUser);

    const result = await refreshTokenUseCase.execute({
      refreshToken: mockUser.refreshToken,
    });

    expect(userRepository.findByRefreshToken).toHaveBeenCalledWith(
      mockUser.refreshToken
    );
    expect(userRepository.updateRefreshToken).toHaveBeenCalledWith(
      mockUser.id,
      'mocked-token'
    );

    expect(result).toEqual({
      accessToken: 'mocked-token',
      refreshToken: 'mocked-token',
    });
  });

  it('deve lançar UnauthorizedError se o refresh token for inválido', async () => {
    await expect(
      refreshTokenUseCase.execute({ refreshToken: 'invalid-token' })
    ).rejects.toThrow(UnauthorizedError);
  });

  it('deve lançar UnauthorizedError se o usuário não for encontrado', async () => {
    (userRepository.findByRefreshToken as any).mockResolvedValue(null);

    await expect(
      refreshTokenUseCase.execute({ refreshToken: mockUser.refreshToken })
    ).rejects.toThrow(UnauthorizedError);
  });

  it('deve lançar erro se secrets JWT não estiverem definidos', async () => {
    delete process.env.JWT_SECRET;
    delete process.env.JWT_REFRESH_SECRET;

    await expect(
      refreshTokenUseCase.execute({ refreshToken: mockUser.refreshToken })
    ).rejects.toThrow('JWT secrets are not defined');
  });
});
