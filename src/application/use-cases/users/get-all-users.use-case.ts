import { UserRepository } from '../../../domain/repositories/user.repository';
import { User } from '../../../domain/entities/user.entity';

export class GetAllUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.findAll();
    return users.map(({ password, ...user }) => user);
  }
}
