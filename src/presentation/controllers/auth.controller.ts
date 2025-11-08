import { Request, Response, NextFunction } from 'express';
import { LoginUserUseCase } from '../../application/use-cases/auth/login-user.use-case';
import { RegisterUserUseCase } from '../../application/use-cases/auth/register-user.use-case';
import { LogoutUserUseCase } from '../../application/use-cases/auth/logout-user-case';
import { RefreshTokenUseCase } from '../../application/use-cases/auth/refresh-token.use-case';
import { LoginWithGoogleUseCase } from '../../application/use-cases/auth/login-user-google.use-case';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export class AuthController {
  constructor(
    private loginUserUseCase: LoginUserUseCase,
    private registerUserUseCase: RegisterUserUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
    private logoutUserUseCase: LogoutUserUseCase,
    private loginWithGoogleUseCase: LoginWithGoogleUseCase
  ) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.loginUserUseCase.execute(req.body);
      res.json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.registerUserUseCase.execute(req.body);
      res.status(201).json({
        status: 'success',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  };

  me = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      res.json({
        status: 'success',
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          status: 'error',
          message: 'Refresh token is required',
        });
      }

      const result = await this.refreshTokenUseCase.execute({ refreshToken });

      res.json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized',
        });
      }

      await this.logoutUserUseCase.execute({ userId: req.user.userId });

      res.json({
        status: 'success',
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  loginWithGoogle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idToken } = req.body;
      const result = await this.loginWithGoogleUseCase.execute({ idToken });
      res.json(result);
    } catch (err) {
      next(err);
    }
  };
}
