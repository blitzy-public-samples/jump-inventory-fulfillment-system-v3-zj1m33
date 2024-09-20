import express from 'express';
import { ShippingController } from 'src/backend/controllers/shippingController';
import { validateShippingInput } from 'src/backend/middleware/validationMiddleware';
import { authMiddleware } from 'src/backend/middleware/authMiddleware';
import { roleMiddleware } from 'src/backend/middleware/roleMiddleware';

const setupShippingRoutes = (shippingController: ShippingController): express.Router => {
  const router = express.Router();

  // Apply authentication middleware to all routes
  router.use(authMiddleware);

  // Generate shipping label
  router.post(
    '/label/:orderId',
    roleMiddleware(['admin', 'warehouse_manager']),
    validateShippingInput,
    shippingController.generateShippingLabel
  );

  // Get tracking information
  router.get(
    '/tracking/:orderId',
    roleMiddleware(['admin', 'warehouse_manager', 'customer_service']),
    shippingController.getTrackingInfo
  );

  // Calculate shipping rates
  router.post(
    '/rates/:orderId',
    roleMiddleware(['admin', 'warehouse_manager']),
    shippingController.calculateShippingRates
  );

  // Validate address
  router.post(
    '/validate-address',
    roleMiddleware(['admin', 'warehouse_manager', 'customer_service']),
    validateShippingInput,
    shippingController.validateAddress
  );

  // Cancel shipment
  router.post(
    '/cancel/:orderId',
    roleMiddleware(['admin', 'warehouse_manager']),
    shippingController.cancelShipment
  );

  return router;
};

export default setupShippingRoutes;