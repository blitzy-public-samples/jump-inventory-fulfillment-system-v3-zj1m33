import express from 'express';
import { InventoryController } from 'src/backend/controllers/inventoryController';
import { validateInventoryInput } from 'src/backend/middleware/validationMiddleware';
import { authMiddleware } from 'src/backend/middleware/authMiddleware';
import { roleMiddleware } from 'src/backend/middleware/roleMiddleware';

const setupInventoryRoutes = (inventoryController: InventoryController): express.Router => {
  const router = express.Router();

  // Apply authentication middleware to all routes
  router.use(authMiddleware);

  // GET /inventory - Get all inventory items
  router.get(
    '/',
    roleMiddleware(['admin', 'warehouse_manager', 'warehouse_staff']),
    inventoryController.getInventory
  );

  // GET /inventory/:id - Get a specific inventory item
  router.get(
    '/:id',
    roleMiddleware(['admin', 'warehouse_manager', 'warehouse_staff']),
    inventoryController.getInventoryItemById
  );

  // POST /inventory/adjust - Adjust inventory quantity
  router.post(
    '/adjust',
    validateInventoryInput,
    roleMiddleware(['admin', 'warehouse_manager']),
    inventoryController.adjustInventory
  );

  // POST /inventory/transfer - Transfer inventory between locations
  router.post(
    '/transfer',
    validateInventoryInput,
    roleMiddleware(['admin', 'warehouse_manager']),
    inventoryController.transferInventory
  );

  // POST /inventory/sync - Sync inventory with Shopify
  router.post(
    '/sync',
    roleMiddleware(['admin']),
    inventoryController.syncInventoryWithShopify
  );

  // GET /inventory/low-stock - Get low stock items
  router.get(
    '/low-stock',
    roleMiddleware(['admin', 'warehouse_manager']),
    inventoryController.getLowStockItems
  );

  return router;
};

export default setupInventoryRoutes;