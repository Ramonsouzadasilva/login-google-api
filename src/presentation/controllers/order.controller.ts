import { Request, Response, NextFunction } from 'express';
import { CreateOrderUseCase } from '../../application/use-cases/orders/create-order.use-case';
import { GetAllOrdersUseCase } from '../../application/use-cases/orders/get-all-orders.use-case';
import { GetOrderByIdUseCase } from '../../application/use-cases/orders/get-order-by-id.use-case';
import { GetUserOrdersUseCase } from '../../application/use-cases/orders/get-user-orders.use-case';
import { UpdateOrderUseCase } from '../../application/use-cases/orders/update-order.use-case';
import { DeleteOrderUseCase } from '../../application/use-cases/orders/delete-order.use-case';
import { GetOrderMetricsUseCase } from '../../application/use-cases/orders/get-order-metrics.use-case';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export class OrderController {
  constructor(
    private createOrderUseCase: CreateOrderUseCase,
    private getAllOrdersUseCase: GetAllOrdersUseCase,
    private getOrderByIdUseCase: GetOrderByIdUseCase,
    private getUserOrdersUseCase: GetUserOrdersUseCase,
    private updateOrderUseCase: UpdateOrderUseCase,
    private deleteOrderUseCase: DeleteOrderUseCase,
    private getOrderMetricsUseCase: GetOrderMetricsUseCase
  ) {}

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const order = await this.createOrderUseCase.execute({
        ...req.body,
        userId: req.user!.userId,
      });
      res.status(201).json({
        status: 'success',
        data: { order },
      });
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await this.getAllOrdersUseCase.execute();
      res.json({
        status: 'success',
        data: { orders },
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await this.getOrderByIdUseCase.execute(req.params.id);
      res.json({
        status: 'success',
        data: { order },
      });
    } catch (error) {
      next(error);
    }
  };

  getUserOrders = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const orders = await this.getUserOrdersUseCase.execute(req.user!.userId);
      res.json({
        status: 'success',
        data: { orders },
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await this.updateOrderUseCase.execute(
        req.params.id,
        req.body
      );
      res.json({
        status: 'success',
        data: { order },
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.deleteOrderUseCase.execute(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  getMetrics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const metrics = await this.getOrderMetricsUseCase.execute();
      res.json({
        status: 'success',
        data: { metrics },
      });
    } catch (error) {
      next(error);
    }
  };
}
