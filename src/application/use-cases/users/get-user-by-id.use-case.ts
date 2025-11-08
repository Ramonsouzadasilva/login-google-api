import { UserRepository } from '../../../domain/repositories/user.repository';
import { User } from '../../../domain/entities/user.entity';
import { NotFoundError } from '../../../shared/errors/not-found-error';

export class GetUserByIdUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError('User');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
