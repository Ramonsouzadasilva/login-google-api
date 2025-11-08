import { UserRepository } from '../../../domain/repositories/user.repository';
import { UnauthorizedError } from '../../../shared/errors/unauthorized-error';

interface LogoutUserRequest {
  userId: string;
}

export class LogoutUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ userId }: LogoutUserRequest): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    await this.userRepository.updateRefreshToken(userId, null);
  }
}
