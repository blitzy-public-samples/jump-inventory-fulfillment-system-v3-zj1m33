import { Product } from 'src/backend/models/Product';
import { InventoryItem } from 'src/backend/models/InventoryItem';
import { ShopifyIntegration } from 'src/backend/integrations/shopifyIntegration';
import { PaginatedResponse } from 'src/shared/types/index';
import { handleApiError } from 'src/shared/utils/index';
import { Op } from 'sequelize';

export class ProductService {
  private shopifyIntegration: ShopifyIntegration;

  constructor(shopifyIntegration: ShopifyIntegration) {
    this.shopifyIntegration = shopifyIntegration;
  }

  async getProducts(page: number, limit: number, filters: object): Promise<PaginatedResponse<Product>> {
    try {
      const offset = (page - 1) * limit;
      const whereClause = this.buildWhereClause(filters);

      const { count, rows } = await Product.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      });

      return {
        data: rows,
        total: count,
        page,
        pageSize: limit,
        totalPages: Math.ceil(count / limit),
      };
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getProductById(productId: string): Promise<Product> {
    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const transaction = await Product.sequelize!.transaction();
    try {
      const newProduct = await Product.create(productData, { transaction });
      
      const shopifyProduct = await this.shopifyIntegration.createProduct(newProduct);
      newProduct.shopifyProductId = shopifyProduct.id;
      await newProduct.save({ transaction });

      await transaction.commit();
      return newProduct;
    } catch (error) {
      await transaction.rollback();
      throw handleApiError(error);
    }
  }

  async updateProduct(productId: string, updateData: Partial<Product>): Promise<Product> {
    const transaction = await Product.sequelize!.transaction();
    try {
      const product = await Product.findByPk(productId, { transaction });
      if (!product) {
        throw new Error('Product not found');
      }

      await product.update(updateData, { transaction });
      await this.shopifyIntegration.updateProduct(product.shopifyProductId!, product);

      await transaction.commit();
      return product;
    } catch (error) {
      await transaction.rollback();
      throw handleApiError(error);
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    const transaction = await Product.sequelize!.transaction();
    try {
      const product = await Product.findByPk(productId, { transaction });
      if (!product) {
        throw new Error('Product not found');
      }

      await this.shopifyIntegration.deleteProduct(product.shopifyProductId!);
      await product.destroy({ transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw handleApiError(error);
    }
  }

  async syncProductsWithShopify(): Promise<void> {
    try {
      const shopifyProducts = await this.shopifyIntegration.getProducts();

      for (const shopifyProduct of shopifyProducts) {
        const existingProduct = await Product.findOne({ where: { shopifyProductId: shopifyProduct.id } });

        if (existingProduct) {
          await existingProduct.update(this.mapShopifyProductToLocal(shopifyProduct));
        } else {
          await Product.create(this.mapShopifyProductToLocal(shopifyProduct));
        }
      }
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getProductInventory(productId: string): Promise<InventoryItem[]> {
    try {
      const product = await Product.findByPk(productId, {
        include: [{ model: InventoryItem, as: 'inventoryItems' }],
      });

      if (!product) {
        throw new Error('Product not found');
      }

      return product.inventoryItems || [];
    } catch (error) {
      throw handleApiError(error);
    }
  }

  private buildWhereClause(filters: object): object {
    const whereClause: any = {};

    if (filters.hasOwnProperty('name')) {
      whereClause.name = { [Op.iLike]: `%${filters.name}%` };
    }

    if (filters.hasOwnProperty('sku')) {
      whereClause.sku = { [Op.iLike]: `%${filters.sku}%` };
    }

    // Add more filter conditions as needed

    return whereClause;
  }

  private mapShopifyProductToLocal(shopifyProduct: any): Partial<Product> {
    return {
      shopifyProductId: shopifyProduct.id,
      name: shopifyProduct.title,
      description: shopifyProduct.body_html,
      sku: shopifyProduct.variants[0]?.sku,
      price: parseFloat(shopifyProduct.variants[0]?.price),
      // Map other fields as needed
    };
  }
}