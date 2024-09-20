import express from 'express';
import { OrderController } from 'src/backend/controllers/orderController';
import { validateOrderInput } from 'src/backend/middleware/validationMiddleware';
import { authMiddleware } from 'src/backend/middleware/authMiddleware';
import { roleMiddleware } from 'src/backend/middleware/roleMiddleware';

const setupOrderRoutes = (orderController: OrderController): express.Router => {
  const router = express.Router();

  // Apply authentication middleware to all routes
  router.use(authMiddleware);

  // GET /orders - Get all orders
  router.get(
    '/',
    roleMiddleware(['admin', 'warehouse_manager']),
    orderController.getOrders
  );

  // GET /orders/:id - Get a specific order
  router.get(
    '/:id',
    roleMiddleware(['admin', 'warehouse_manager', 'warehouse_staff']),
    orderController.getOrderById
  );

  // POST /orders - Create a new order
  router.post(
    '/',
    validateOrderInput,
    roleMiddleware(['admin', 'warehouse_manager']),
    orderController.createOrder
  );

  // PUT /orders/:id - Update an existing order
  router.put(
    '/:id',
    validateOrderInput,
    roleMiddleware(['admin', 'warehouse_manager']),
    orderController.updateOrder
  );

  // POST /orders/:id/fulfill - Fulfill an order
  router.post(
    '/:id/fulfill',
    roleMiddleware(['admin', 'warehouse_manager', 'warehouse_staff']),
    orderController.fulfillOrder
  );

  // POST /orders/sync - Sync orders with Shopify
  router.post(
    '/sync',
    roleMiddleware(['admin']),
    orderController.syncOrdersWithShopify
  );

  return router;
};

export default setupOrderRoutes;