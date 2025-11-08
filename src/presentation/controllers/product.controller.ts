import { Request, Response, NextFunction } from 'express';
import { CreateProductUseCase } from '../../application/use-cases/products/create-product.use-case';
import { GetAllProductsUseCase } from '../../application/use-cases/products/get-all-products.use-case';
import { GetProductByIdUseCase } from '../../application/use-cases/products/get-product-by-id.use-case';
import { UpdateProductUseCase } from '../../application/use-cases/products/update-product.use-case';
import { DeleteProductUseCase } from '../../application/use-cases/products/delete-product.use-case';

export class ProductController {
  constructor(
    private createProductUseCase: CreateProductUseCase,
    private getAllProductsUseCase: GetAllProductsUseCase,
    private getProductByIdUseCase: GetProductByIdUseCase,
    private updateProductUseCase: UpdateProductUseCase,
    private deleteProductUseCase: DeleteProductUseCase
  ) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.createProductUseCase.execute(req.body);
      res.status(201).json({
        status: 'success',
        data: { product },
      });
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await this.getAllProductsUseCase.execute();
      res.json({
        status: 'success',
        data: { products },
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.getProductByIdUseCase.execute(req.params.id);
      res.json({
        status: 'success',
        data: { product },
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.updateProductUseCase.execute(
        req.params.id,
        req.body
      );
      res.json({
        status: 'success',
        data: { product },
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.deleteProductUseCase.execute(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
