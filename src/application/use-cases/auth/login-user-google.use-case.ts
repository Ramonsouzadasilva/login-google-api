import jwt from 'jsonwebtoken';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { verifyGoogleToken } from '../../../shared/google/google-auth';

interface GoogleLoginRequest {
  idToken: string;
}

interface GoogleLoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

export class LoginWithGoogleUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ idToken }: GoogleLoginRequest): Promise<GoogleLoginResponse> {
    const googleUser = await verifyGoogleToken(idToken);

    let user = await this.userRepository.findByEmail(googleUser.email);

    if (!user) {
      user = await this.userRepository.create({
        email: googleUser.email,
        name: googleUser.name,
        role: 'USER',
        googleId: googleUser.googleId,
      });
    }

    const secret = process.env.JWT_SECRET!;
    const refreshSecret = process.env.JWT_REFRESH_SECRET!;

    const accessToken = jwt.sign({ userId: user.id, role: user.role }, secret, {
      expiresIn: '15m',
    });

    const refreshToken = jwt.sign({ userId: user.id }, refreshSecret, {
      expiresIn: '7d',
    });

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
