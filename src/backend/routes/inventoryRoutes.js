const express = require('express');
const inventoryController = require('../controllers/inventoryController');
const authMiddleware = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

// Route to get all inventory items
router.get('/inventory', 
    authMiddleware.authenticate, 
    rateLimiter.applyLimiter, 
    inventoryController.getInventory
);

// Route to get a specific inventory item by ID
router.get('/inventory/:id', 
    authMiddleware.authenticate, 
    rateLimiter.applyLimiter, 
    inventoryController.getInventoryItem
);

// Route to update a specific inventory item
router.put('/inventory/:id', 
    authMiddleware.authenticate, 
    authMiddleware.authorize(['Admin', 'Warehouse Manager']), 
    rateLimiter.applyLimiter, 
    inventoryController.updateInventoryItem
);

// Route to adjust inventory levels
router.post('/inventory/adjust', 
    authMiddleware.authenticate, 
    authMiddleware.authorize(['Admin', 'Warehouse Manager', 'Warehouse Staff']), 
    rateLimiter.applyLimiter, 
    inventoryController.adjustInventory
);

// Route to get inventory adjustment history
router.get('/inventory/history', 
    authMiddleware.authenticate, 
    authMiddleware.authorize(['Admin', 'Warehouse Manager']), 
    rateLimiter.applyLimiter, 
    inventoryController.getInventoryHistory
);

module.exports = router;

// Human tasks:
// TODO: Implement input validation middleware for request bodies and parameters
// TODO: Add error handling middleware to catch and format errors consistently
// TODO: Consider implementing pagination for inventory list and history endpoints
// TODO: Add caching mechanism for frequently accessed inventory data
// TODO: Implement logging for all inventory-related actions for auditing purposes