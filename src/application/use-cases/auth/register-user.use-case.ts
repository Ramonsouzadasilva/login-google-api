import { UserRepository } from '../../../domain/repositories/user.repository';
import { CreateUserData, User } from '../../../domain/entities/user.entity';
import { ValidationError } from '../../../shared/errors/validation-error';

export class RegisterUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: CreateUserData): Promise<Omit<User, 'password'>> {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ValidationError('Email already exists');
    }

    const user = await this.userRepository.create(data);

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
