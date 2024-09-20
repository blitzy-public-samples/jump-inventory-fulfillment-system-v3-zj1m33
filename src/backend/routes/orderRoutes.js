const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

// Route to get all orders
router.get('/', [authMiddleware, rateLimiter], orderController.getOrders);

// Route to get a specific order by ID
router.get('/:id', authMiddleware, orderController.getOrderById);

// Route to create a new order
router.post('/', authMiddleware, orderController.createOrder);

// Route to update an existing order
router.put('/:id', authMiddleware, orderController.updateOrder);

// Route to delete an order
router.delete('/:id', authMiddleware, orderController.deleteOrder);

// Route to fulfill an order
router.post('/:id/fulfill', authMiddleware, orderController.fulfillOrder);

module.exports = router;

// Human tasks:
// TODO: Implement input validation middleware for each route
// TODO: Add error handling middleware to catch and process any errors
// TODO: Implement role-based access control for different order operations
// TODO: Add logging middleware to track API usage and performance
// TODO: Consider implementing caching for frequently accessed order data