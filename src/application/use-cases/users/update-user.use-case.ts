import { UserRepository } from '../../../domain/repositories/user.repository';
import { UpdateUserData, User } from '../../../domain/entities/user.entity';
import { NotFoundError } from '../../../shared/errors/not-found-error';

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(
    id: string,
    data: UpdateUserData
  ): Promise<Omit<User, 'password'>> {
    const updatedUser = await this.userRepository.update(id, data);

    if (!updatedUser) {
      throw new NotFoundError('User');
    }

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
}
