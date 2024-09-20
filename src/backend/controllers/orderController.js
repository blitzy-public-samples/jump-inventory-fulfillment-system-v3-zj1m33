const { Order, OrderItem, Product, InventoryItem } = require('../models');
const shopifyService = require('../services/shopifyService');
const sendleService = require('../services/sendleService');
const logger = require('../utils/logger');
const errorHandler = require('../middleware/errorHandler');

// Controller for handling order-related operations

// Get orders with optional filtering and pagination
exports.getOrders = async (req, res) => {
  try {
    // Extract query parameters
    const { page = 1, limit = 10, status } = req.query;
    
    // Construct database query
    const query = {};
    if (status) query.status = status;
    
    // Fetch orders from the database
    const orders = await Order.findAndCountAll({
      where: query,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      include: [{ model: OrderItem }],
    });
    
    // Return orders with pagination metadata
    res.json({
      orders: orders.rows,
      totalPages: Math.ceil(orders.count / limit),
      currentPage: page,
    });
  } catch (error) {
    logger.error('Error in getOrders:', error);
    errorHandler(error, req, res);
  }
};

// Get a specific order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // Fetch order from database
    const order = await Order.findByPk(orderId, {
      include: [{ model: OrderItem }],
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    logger.error('Error in getOrderById:', error);
    errorHandler(error, req, res);
  }
};

// Create a new order
exports.createOrder = async (req, res) => {
  const transaction = await Order.sequelize.transaction();
  
  try {
    const { customerInfo, items } = req.body;
    
    // Create new Order record
    const order = await Order.create(customerInfo, { transaction });
    
    // Create associated OrderItem records
    for (const item of items) {
      await OrderItem.create({
        ...item,
        orderId: order.id
      }, { transaction });
      
      // Update inventory levels
      await InventoryItem.decrement('quantity', {
        by: item.quantity,
        where: { productId: item.productId },
        transaction
      });
    }
    
    await transaction.commit();
    res.status(201).json(order);
  } catch (error) {
    await transaction.rollback();
    logger.error('Error in createOrder:', error);
    errorHandler(error, req, res);
  }
};

// Update an existing order
exports.updateOrder = async (req, res) => {
  const transaction = await Order.sequelize.transaction();
  
  try {
    const { orderId } = req.params;
    const updateData = req.body;
    
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Update Order record
    await order.update(updateData, { transaction });
    
    // Update associated OrderItem records if necessary
    if (updateData.items) {
      for (const item of updateData.items) {
        const orderItem = await OrderItem.findOne({
          where: { orderId, productId: item.productId },
          transaction
        });
        
        if (orderItem) {
          const quantityDiff = item.quantity - orderItem.quantity;
          await orderItem.update(item, { transaction });
          
          // Adjust inventory levels
          await InventoryItem.increment('quantity', {
            by: -quantityDiff,
            where: { productId: item.productId },
            transaction
          });
        }
      }
    }
    
    await transaction.commit();
    res.json(order);
  } catch (error) {
    await transaction.rollback();
    logger.error('Error in updateOrder:', error);
    errorHandler(error, req, res);
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  const transaction = await Order.sequelize.transaction();
  
  try {
    const { orderId } = req.params;
    
    const order = await Order.findByPk(orderId, {
      include: [{ model: OrderItem }],
      transaction
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Delete associated OrderItem records and adjust inventory
    for (const item of order.OrderItems) {
      await InventoryItem.increment('quantity', {
        by: item.quantity,
        where: { productId: item.productId },
        transaction
      });
      await item.destroy({ transaction });
    }
    
    // Delete Order record
    await order.destroy({ transaction });
    
    await transaction.commit();
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    await transaction.rollback();
    logger.error('Error in deleteOrder:', error);
    errorHandler(error, req, res);
  }
};

// Process order fulfillment
exports.fulfillOrder = async (req, res) => {
  const transaction = await Order.sequelize.transaction();
  
  try {
    const { orderId } = req.params;
    
    const order = await Order.findByPk(orderId, {
      include: [{ model: OrderItem }],
      transaction
    });
    
    if (!order || order.status === 'fulfilled') {
      return res.status(400).json({ message: 'Order cannot be fulfilled' });
    }
    
    // Generate shipping label
    const shippingLabel = await sendleService.createShippingLabel(order);
    
    // Update order status
    await order.update({ status: 'fulfilled', trackingNumber: shippingLabel.trackingNumber }, { transaction });
    
    // Create fulfillment record in Shopify
    await shopifyService.createFulfillment(order.shopifyOrderId, shippingLabel.trackingNumber);
    
    await transaction.commit();
    res.json({ message: 'Order fulfilled successfully', trackingNumber: shippingLabel.trackingNumber });
  } catch (error) {
    await transaction.rollback();
    logger.error('Error in fulfillOrder:', error);
    errorHandler(error, req, res);
  }
};

// Synchronize orders from Shopify
exports.syncShopifyOrders = async (req, res) => {
  try {
    const shopifyOrders = await shopifyService.getNewOrders();
    const syncResults = { created: 0, updated: 0 };
    
    for (const shopifyOrder of shopifyOrders) {
      const [order, created] = await Order.findOrCreate({
        where: { shopifyOrderId: shopifyOrder.id },
        defaults: {
          // Map Shopify order data to our Order model
          customerInfo: shopifyOrder.customer,
          // ... other fields
        }
      });
      
      if (created) {
        syncResults.created++;
        // Create OrderItems
        for (const lineItem of shopifyOrder.line_items) {
          await OrderItem.create({
            orderId: order.id,
            productId: lineItem.product_id,
            quantity: lineItem.quantity,
            // ... other fields
          });
        }
      } else {
        syncResults.updated++;
        // Update existing order
        await order.update({
          // Update fields as necessary
        });
      }
    }
    
    res.json({ message: 'Shopify orders synced successfully', results: syncResults });
  } catch (error) {
    logger.error('Error in syncShopifyOrders:', error);
    errorHandler(error, req, res);
  }
};

// Human tasks:
// - Implement detailed error handling for each function
// - Add input validation using a validation library like Joi
// - Implement rate limiting for order creation and updates
// - Add logging for important operations and errors
// - Implement unit tests for each controller function
// - Add authentication and authorization checks
// - Optimize database queries for performance
// - Implement caching for frequently accessed order data