import { Request, Response } from 'express';
import { ProductService } from 'src/backend/services/productService';
import { handleApiError } from 'src/shared/utils/index';
import { PaginatedResponse, Product } from 'src/shared/types/index';

export class ProductController {
  private productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters = req.query.filters as Record<string, string>;

      const paginatedProducts: PaginatedResponse<Product> = await this.productService.getProducts(page, limit, filters);
      res.status(200).json(paginatedProducts);
    } catch (error) {
      handleApiError(res, error);
    }
  }

  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const productId = req.params.id;
      const product = await this.productService.getProductById(productId);
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }
      res.status(200).json(product);
    } catch (error) {
      handleApiError(res, error);
    }
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const productData = req.body;
      // TODO: Implement input validation
      const createdProduct = await this.productService.createProduct(productData);
      res.status(201).json(createdProduct);
    } catch (error) {
      handleApiError(res, error);
    }
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const productId = req.params.id;
      const updateData = req.body;
      // TODO: Implement input validation
      const updatedProduct = await this.productService.updateProduct(productId, updateData);
      if (!updatedProduct) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }
      res.status(200).json(updatedProduct);
    } catch (error) {
      handleApiError(res, error);
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const productId = req.params.id;
      const result = await this.productService.deleteProduct(productId);
      if (!result) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      handleApiError(res, error);
    }
  }

  async syncProductsWithShopify(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.productService.syncProductsWithShopify();
      res.status(200).json(result);
    } catch (error) {
      handleApiError(res, error);
    }
  }

  async getProductInventory(req: Request, res: Response): Promise<void> {
    try {
      const productId = req.params.id;
      const inventory = await this.productService.getProductInventory(productId);
      if (!inventory) {
        res.status(404).json({ message: 'Product inventory not found' });
        return;
      }
      res.status(200).json(inventory);
    } catch (error) {
      handleApiError(res, error);
    }
  }
}