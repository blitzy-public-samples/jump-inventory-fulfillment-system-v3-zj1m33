import express from 'express';
import { ProductController } from 'src/backend/controllers/productController';
import { validateProductInput } from 'src/backend/middleware/validationMiddleware';
import { authMiddleware } from 'src/backend/middleware/authMiddleware';
import { roleMiddleware } from 'src/backend/middleware/roleMiddleware';

const setupProductRoutes = (productController: ProductController): express.Router => {
  const router = express.Router();

  // Apply authentication middleware to all routes
  router.use(authMiddleware);

  // GET /products - Get all products
  router.get('/', roleMiddleware(['ADMIN', 'WAREHOUSE_MANAGER', 'WAREHOUSE_STAFF']), productController.getProducts);

  // GET /products/:id - Get a specific product
  router.get('/:id', roleMiddleware(['ADMIN', 'WAREHOUSE_MANAGER', 'WAREHOUSE_STAFF']), productController.getProductById);

  // POST /products - Create a new product
  router.post('/', validateProductInput, roleMiddleware(['ADMIN', 'WAREHOUSE_MANAGER']), productController.createProduct);

  // PUT /products/:id - Update a product
  router.put('/:id', validateProductInput, roleMiddleware(['ADMIN', 'WAREHOUSE_MANAGER']), productController.updateProduct);

  // DELETE /products/:id - Delete a product
  router.delete('/:id', roleMiddleware(['ADMIN']), productController.deleteProduct);

  // POST /products/sync - Sync products with Shopify
  router.post('/sync', roleMiddleware(['ADMIN']), productController.syncProductsWithShopify);

  // GET /products/:id/inventory - Get inventory for a specific product
  router.get('/:id/inventory', roleMiddleware(['ADMIN', 'WAREHOUSE_MANAGER', 'WAREHOUSE_STAFF']), productController.getProductInventory);

  return router;
};

export default setupProductRoutes;