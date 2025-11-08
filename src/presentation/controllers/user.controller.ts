import { Request, Response, NextFunction } from 'express';
import { GetAllUsersUseCase } from '../../application/use-cases/users/get-all-users.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/users/get-user-by-id.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/users/update-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/users/delete-user.use-case';

export class UserController {
  constructor(
    private getAllUsersUseCase: GetAllUsersUseCase,
    private getUserByIdUseCase: GetUserByIdUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase
  ) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.getAllUsersUseCase.execute();
      res.json({
        status: 'success',
        data: { users },
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.getUserByIdUseCase.execute(req.params.id);
      res.json({
        status: 'success',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.updateUserUseCase.execute(
        req.params.id,
        req.body
      );
      res.json({
        status: 'success',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.deleteUserUseCase.execute(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
