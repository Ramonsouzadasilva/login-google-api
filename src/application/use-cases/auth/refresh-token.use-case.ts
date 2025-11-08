import jwt from 'jsonwebtoken';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { UnauthorizedError } from '../../../shared/errors/unauthorized-error';

interface RefreshTokenRequest {
  refreshToken: string;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export class RefreshTokenUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    refreshToken,
  }: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const secret = process.env.JWT_SECRET as string;
    const refreshSecret = process.env.JWT_REFRESH_SECRET as string;

    if (!secret || !refreshSecret) {
      throw new Error('JWT secrets are not defined');
    }

    // Verify refresh token
    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, refreshSecret);
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    // Find user by refresh token stored in database
    const user = await this.userRepository.findByRefreshToken(refreshToken);

    if (!user || user.id !== decoded.userId) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    // Generate new access token
    const expiresIn: string | number = process.env.JWT_EXPIRES_IN
      ? isNaN(Number(process.env.JWT_EXPIRES_IN))
        ? process.env.JWT_EXPIRES_IN
        : Number(process.env.JWT_EXPIRES_IN)
      : '15m';

    // const accessToken = jwt.sign({ userId: user.id, role: user.role }, secret, {
    //   expiresIn,
    // });
    const accessToken = jwt.sign({ userId: user.id, role: user.role }, secret, {
      expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
    });

    // Generate new refresh token
    const refreshExpiresIn: string | number = process.env.JWT_REFRESH_EXPIRES_IN
      ? isNaN(Number(process.env.JWT_REFRESH_EXPIRES_IN))
        ? process.env.JWT_REFRESH_EXPIRES_IN
        : Number(process.env.JWT_REFRESH_EXPIRES_IN)
      : '7d';

    const newRefreshToken = jwt.sign({ userId: user.id }, refreshSecret, {
      expiresIn: refreshExpiresIn as jwt.SignOptions['expiresIn'],
    });

    // Update refresh token in database
    await this.userRepository.updateRefreshToken(user.id, newRefreshToken);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
