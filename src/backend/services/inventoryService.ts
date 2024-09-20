import { InventoryItem } from 'src/backend/models/InventoryItem';
import { InventoryAdjustment } from 'src/backend/models/InventoryAdjustment';
import { Product } from 'src/backend/models/Product';
import { ShopifyIntegration } from 'src/backend/integrations/shopifyIntegration';
import { PaginatedResponse } from 'src/shared/types/index';
import { handleApiError } from 'src/shared/utils/index';
import { Op, Transaction } from 'sequelize';

export class InventoryService {
  private shopifyIntegration: ShopifyIntegration;

  constructor(shopifyIntegration: ShopifyIntegration) {
    this.shopifyIntegration = shopifyIntegration;
  }

  async getInventory(page: number, limit: number, filters: object): Promise<PaginatedResponse<InventoryItem>> {
    try {
      const offset = (page - 1) * limit;
      const whereClause = this.buildWhereClause(filters);

      const { count, rows } = await InventoryItem.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        include: [{ model: Product, attributes: ['name', 'sku'] }],
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

  async getInventoryItemById(inventoryItemId: string): Promise<InventoryItem> {
    try {
      const inventoryItem = await InventoryItem.findByPk(inventoryItemId, {
        include: [{ model: Product, attributes: ['name', 'sku'] }],
      });

      if (!inventoryItem) {
        throw new Error('Inventory item not found');
      }

      return inventoryItem;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async adjustInventory(inventoryItemId: string, quantityChange: number, reason: string, userId: string): Promise<InventoryItem> {
    const transaction: Transaction = await InventoryItem.sequelize!.transaction();

    try {
      const inventoryItem = await InventoryItem.findByPk(inventoryItemId, { transaction });

      if (!inventoryItem) {
        throw new Error('Inventory item not found');
      }

      const newQuantity = inventoryItem.quantity + quantityChange;
      if (newQuantity < 0) {
        throw new Error('Inventory quantity cannot be negative');
      }

      await inventoryItem.update({ quantity: newQuantity }, { transaction });

      await InventoryAdjustment.create({
        inventoryItemId,
        userId,
        quantityChange,
        reason,
      }, { transaction });

      await transaction.commit();
      return inventoryItem;
    } catch (error) {
      await transaction.rollback();
      throw handleApiError(error);
    }
  }

  async transferInventory(productId: string, fromLocation: string, toLocation: string, quantity: number, userId: string): Promise<void> {
    const transaction: Transaction = await InventoryItem.sequelize!.transaction();

    try {
      const sourceItem = await InventoryItem.findOne({
        where: { productId, location: fromLocation },
        transaction,
      });

      const destinationItem = await InventoryItem.findOne({
        where: { productId, location: toLocation },
        transaction,
      });

      if (!sourceItem || !destinationItem) {
        throw new Error('Source or destination inventory item not found');
      }

      if (sourceItem.quantity < quantity) {
        throw new Error('Insufficient quantity in source location');
      }

      await sourceItem.decrement('quantity', { by: quantity, transaction });
      await destinationItem.increment('quantity', { by: quantity, transaction });

      await InventoryAdjustment.bulkCreate([
        {
          inventoryItemId: sourceItem.id,
          userId,
          quantityChange: -quantity,
          reason: `Transfer to ${toLocation}`,
        },
        {
          inventoryItemId: destinationItem.id,
          userId,
          quantityChange: quantity,
          reason: `Transfer from ${fromLocation}`,
        },
      ], { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw handleApiError(error);
    }
  }

  async syncInventoryWithShopify(): Promise<void> {
    try {
      const products = await Product.findAll({
        include: [{ model: InventoryItem }],
      });

      for (const product of products) {
        const totalQuantity = product.InventoryItems.reduce((sum, item) => sum + item.quantity, 0);
        await this.shopifyIntegration.updateInventory(product.shopifyProductId, totalQuantity);
      }
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getLowStockItems(threshold: number): Promise<InventoryItem[]> {
    try {
      return await InventoryItem.findAll({
        where: {
          quantity: { [Op.lte]: threshold },
        },
        include: [{ model: Product, attributes: ['name', 'sku'] }],
      });
    } catch (error) {
      throw handleApiError(error);
    }
  }

  private buildWhereClause(filters: object): object {
    const whereClause: any = {};
    
    if (filters.hasOwnProperty('productId')) {
      whereClause.productId = filters.productId;
    }
    
    if (filters.hasOwnProperty('location')) {
      whereClause.location = filters.location;
    }
    
    if (filters.hasOwnProperty('minQuantity')) {
      whereClause.quantity = { [Op.gte]: filters.minQuantity };
    }
    
    return whereClause;
  }
}