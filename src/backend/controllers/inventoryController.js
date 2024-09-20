const { InventoryItem } = require('src/backend/models/InventoryItem');
const { Product } = require('src/backend/models/Product');
const { InventoryAdjustment } = require('src/backend/models/InventoryAdjustment');
const shopifyService = require('src/backend/services/shopifyService');
const logger = require('src/backend/utils/logger');
const { Op } = require('sequelize');

// Controller for handling inventory-related operations

// Get current inventory levels
exports.getInventory = async (req, res) => {
    try {
        // Query the database for all InventoryItems
        const query = {
            include: [{ model: Product, attributes: ['name', 'sku'] }],
            where: {}
        };

        // Apply any filters from query parameters
        if (req.query.sku) {
            query.where['$Product.sku$'] = req.query.sku;
        }
        if (req.query.minQuantity) {
            query.where.quantity = { [Op.gte]: parseInt(req.query.minQuantity) };
        }

        // Paginate results if necessary
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const { count, rows } = await InventoryItem.findAndCountAll({
            ...query,
            limit,
            offset
        });

        // Return inventory data as JSON response
        res.json({
            total: count,
            page,
            totalPages: Math.ceil(count / limit),
            items: rows
        });
    } catch (error) {
        logger.error('Error in getInventory:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update the quantity of a specific inventory item
exports.updateInventoryItem = async (req, res) => {
    try {
        // Extract itemId and newQuantity from request body
        const { itemId, newQuantity } = req.body;

        // Validate input data
        if (!itemId || typeof newQuantity !== 'number') {
            return res.status(400).json({ error: 'Invalid input data' });
        }

        // Find the inventory item by ID
        const item = await InventoryItem.findByPk(itemId);
        if (!item) {
            return res.status(404).json({ error: 'Inventory item not found' });
        }

        // Update the quantity
        const oldQuantity = item.quantity;
        item.quantity = newQuantity;
        await item.save();

        // Create an InventoryAdjustment record
        await InventoryAdjustment.create({
            inventoryItemId: itemId,
            oldQuantity,
            newQuantity,
            userId: req.user.id // Assuming user info is available in req.user
        });

        // Sync updated inventory with Shopify
        await shopifyService.updateInventoryItem(item);

        // Return updated inventory item as JSON response
        res.json(item);
    } catch (error) {
        logger.error('Error in updateInventoryItem:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Perform a batch update of multiple inventory items
exports.batchUpdateInventory = async (req, res) => {
    const transaction = await InventoryItem.sequelize.transaction();
    try {
        // Extract updates array from request body
        const { updates } = req.body;

        // Validate input data
        if (!Array.isArray(updates) || updates.length === 0) {
            return res.status(400).json({ error: 'Invalid input data' });
        }

        const results = [];

        // Iterate through updates
        for (const update of updates) {
            const { itemId, newQuantity } = update;

            // Update each inventory item
            const item = await InventoryItem.findByPk(itemId, { transaction });
            if (item) {
                const oldQuantity = item.quantity;
                item.quantity = newQuantity;
                await item.save({ transaction });

                // Create InventoryAdjustment records
                await InventoryAdjustment.create({
                    inventoryItemId: itemId,
                    oldQuantity,
                    newQuantity,
                    userId: req.user.id
                }, { transaction });

                results.push({ itemId, success: true });
            } else {
                results.push({ itemId, success: false, error: 'Item not found' });
            }
        }

        // Commit transaction
        await transaction.commit();

        // Sync updated inventory with Shopify
        await shopifyService.batchUpdateInventory(updates);

        // Return batch update results as JSON response
        res.json({ results });
    } catch (error) {
        // Rollback transaction in case of error
        await transaction.rollback();
        logger.error('Error in batchUpdateInventory:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Retrieve inventory adjustment history
exports.getInventoryAdjustments = async (req, res) => {
    try {
        const query = {
            include: [{ model: InventoryItem, include: [Product] }],
            where: {}
        };

        // Apply date range filters if provided
        if (req.query.startDate) {
            query.where.createdAt = { [Op.gte]: new Date(req.query.startDate) };
        }
        if (req.query.endDate) {
            query.where.createdAt = { ...query.where.createdAt, [Op.lte]: new Date(req.query.endDate) };
        }

        // Paginate results
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const { count, rows } = await InventoryAdjustment.findAndCountAll({
            ...query,
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        // Return inventory adjustments as JSON response
        res.json({
            total: count,
            page,
            totalPages: Math.ceil(count / limit),
            adjustments: rows
        });
    } catch (error) {
        logger.error('Error in getInventoryAdjustments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Synchronize local inventory with Shopify
exports.syncInventoryWithShopify = async (req, res) => {
    try {
        // Retrieve all local inventory items
        const localInventory = await InventoryItem.findAll({
            include: [{ model: Product, attributes: ['shopifyProductId', 'shopifyVariantId'] }]
        });

        // Call shopifyService to sync inventory
        const syncResults = await shopifyService.syncInventory(localInventory);

        // Update local inventory with any discrepancies
        for (const result of syncResults) {
            if (result.needsUpdate) {
                await InventoryItem.update(
                    { quantity: result.shopifyQuantity },
                    { where: { id: result.itemId } }
                );
            }
        }

        // Log sync results
        logger.info('Inventory sync completed', { syncResults });

        // Return sync results as JSON response
        res.json({ message: 'Inventory sync completed', results: syncResults });
    } catch (error) {
        logger.error('Error in syncInventoryWithShopify:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Human tasks:
// TODO: Implement error handling for edge cases in inventory updates
// TODO: Add unit tests for each controller function
// TODO: Optimize database queries for large inventory datasets
// TODO: Implement caching mechanism for frequently accessed inventory data
// TODO: Add input validation middleware for all routes using this controller