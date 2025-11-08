import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UnauthorizedError } from '../../../shared/errors/unauthorized-error';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { LogoutUserUseCase } from './logout-user-case';

describe('LogoutUserUseCase', () => {
  let userRepository: UserRepository;
  let logoutUserUseCase: LogoutUserUseCase;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    role: 'USER',
    refreshToken: 'some-refresh-token',
  };

  beforeEach(() => {
    // Mock do UserRepository
    userRepository = {
      findById: vi.fn(),
      updateRefreshToken: vi.fn(),
    } as unknown as UserRepository;

    logoutUserUseCase = new LogoutUserUseCase(userRepository);
  });

  it('deve remover o refresh token quando o usuário for encontrado', async () => {
    (userRepository.findById as any).mockResolvedValue(mockUser);

    await logoutUserUseCase.execute({ userId: mockUser.id });

    expect(userRepository.findById).toHaveBeenCalledWith(mockUser.id);
    expect(userRepository.updateRefreshToken).toHaveBeenCalledWith(
      mockUser.id,
      null
    );
  });

  it('deve lançar UnauthorizedError quando o usuário não for encontrado', async () => {
    (userRepository.findById as any).mockResolvedValue(null);

    await expect(
      logoutUserUseCase.execute({ userId: 'nonexistent-id' })
    ).rejects.toThrow(UnauthorizedError);
  });
});
