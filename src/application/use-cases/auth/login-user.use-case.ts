import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { UnauthorizedError } from '../../../shared/errors/unauthorized-error';

interface LoginUserRequest {
  email: string;
  password: string;
}

interface LoginUserResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

export class LoginUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    email,
    password,
  }: LoginUserRequest): Promise<LoginUserResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const secret = process.env.JWT_SECRET as string;
    const refreshSecret = process.env.JWT_REFRESH_SECRET as string;

    if (!secret || !refreshSecret) {
      throw new Error('JWT secrets are not defined');
    }

    // Access token with short expiration
    const expiresIn: string | number = process.env.JWT_EXPIRES_IN
      ? isNaN(Number(process.env.JWT_EXPIRES_IN))
        ? process.env.JWT_EXPIRES_IN
        : Number(process.env.JWT_EXPIRES_IN)
      : '15m';

    const accessToken = jwt.sign({ userId: user.id, role: user.role }, secret, {
      expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
    });

    const refreshExpiresIn: string | number = process.env.JWT_REFRESH_EXPIRES_IN
      ? isNaN(Number(process.env.JWT_REFRESH_EXPIRES_IN))
        ? process.env.JWT_REFRESH_EXPIRES_IN
        : Number(process.env.JWT_REFRESH_EXPIRES_IN)
      : '7d';

    const refreshToken = jwt.sign({ userId: user.id }, refreshSecret, {
      expiresIn: refreshExpiresIn as jwt.SignOptions['expiresIn'],
    });

    // Store refresh token in database
    await this.userRepository.updateRefreshToken(user.id, refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }
}
