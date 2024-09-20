import { Request, Response } from 'express';
import { InventoryService } from 'src/backend/services/inventoryService';
import { handleApiError } from 'src/shared/utils/index';
import { PaginatedResponse, InventoryItem } from 'src/shared/types/index';

export class InventoryController {
  private inventoryService: InventoryService;

  constructor(inventoryService: InventoryService) {
    this.inventoryService = inventoryService;
  }

  async getInventory(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters = req.query.filters as Record<string, string>;

      const result: PaginatedResponse<InventoryItem> = await this.inventoryService.getInventory(page, limit, filters);
      res.json(result);
    } catch (error) {
      handleApiError(res, error);
    }
  }

  async getInventoryItemById(req: Request, res: Response): Promise<void> {
    try {
      const inventoryItemId = req.params.id;
      const inventoryItem = await this.inventoryService.getInventoryItemById(inventoryItemId);
      
      if (!inventoryItem) {
        res.status(404).json({ message: 'Inventory item not found' });
        return;
      }

      res.json(inventoryItem);
    } catch (error) {
      handleApiError(res, error);
    }
  }

  async adjustInventory(req: Request, res: Response): Promise<void> {
    try {
      const inventoryItemId = req.params.id;
      const { quantityChange, reason } = req.body;

      if (typeof quantityChange !== 'number' || !reason) {
        res.status(400).json({ message: 'Invalid input data' });
        return;
      }

      const updatedItem = await this.inventoryService.adjustInventory(inventoryItemId, quantityChange, reason);
      res.json(updatedItem);
    } catch (error) {
      handleApiError(res, error);
    }
  }

  async transferInventory(req: Request, res: Response): Promise<void> {
    try {
      const { productId, fromLocation, toLocation, quantity } = req.body;

      if (!productId || !fromLocation || !toLocation || typeof quantity !== 'number') {
        res.status(400).json({ message: 'Invalid input data' });
        return;
      }

      await this.inventoryService.transferInventory(productId, fromLocation, toLocation, quantity);
      res.json({ message: 'Inventory transfer successful' });
    } catch (error) {
      handleApiError(res, error);
    }
  }

  async syncInventoryWithShopify(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.inventoryService.syncInventoryWithShopify();
      res.json(result);
    } catch (error) {
      handleApiError(res, error);
    }
  }

  async getLowStockItems(req: Request, res: Response): Promise<void> {
    try {
      const threshold = parseInt(req.query.threshold as string) || 10;
      const lowStockItems = await this.inventoryService.getLowStockItems(threshold);
      res.json(lowStockItems);
    } catch (error) {
      handleApiError(res, error);
    }
  }
}