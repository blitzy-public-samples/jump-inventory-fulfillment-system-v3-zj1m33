const axios = require('axios');
const config = require('./config/shopify');
const logger = require('../utils/logger');
const Order = require('../models/Order');
const Product = require('../models/Product');
const InventoryItem = require('../models/InventoryItem');

const SHOPIFY_API_VERSION = config.SHOPIFY_API_VERSION;
const SHOPIFY_SHOP_URL = config.SHOPIFY_SHOP_URL;
const SHOPIFY_ACCESS_TOKEN = config.SHOPIFY_ACCESS_TOKEN;

// Creates and configures an Axios instance for Shopify API requests
const createShopifyClient = () => {
  // Create a new Axios instance
  const client = axios.create({
    // Set the base URL using SHOPIFY_SHOP_URL and SHOPIFY_API_VERSION
    baseURL: `${SHOPIFY_SHOP_URL}/admin/api/${SHOPIFY_API_VERSION}`,
    // Set default headers including Authorization with SHOPIFY_ACCESS_TOKEN
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN
    }
  });

  // Return the configured Axios instance
  return client;
};

// Retrieves unfulfilled orders from Shopify
const fetchUnfulfilledOrders = async () => {
  try {
    // Create Shopify client using createShopifyClient()
    const client = createShopifyClient();
    
    // Make GET request to Shopify API for unfulfilled orders
    const response = await client.get('/orders.json?status=unfulfilled');
    
    // Handle pagination if necessary
    let orders = response.data.orders;
    while (response.headers.link && response.headers.link.includes('next')) {
      const nextUrl = response.headers.link.split('<')[1].split('>')[0];
      const nextResponse = await client.get(nextUrl);
      orders = [...orders, ...nextResponse.data.orders];
      response.headers = nextResponse.headers;
    }
    
    // Return array of unfulfilled orders
    return orders;
  } catch (error) {
    // Log any errors that occur
    logger.error('Error fetching unfulfilled orders:', error);
    throw error;
  }
};

// Synchronizes unfulfilled orders from Shopify to local database
const syncOrders = async () => {
  try {
    // Fetch unfulfilled orders using fetchUnfulfilledOrders()
    const unfulfilledOrders = await fetchUnfulfilledOrders();
    
    // Iterate through fetched orders
    for (const order of unfulfilledOrders) {
      // For each order, check if it exists in local database
      let existingOrder = await Order.findOne({ shopifyOrderId: order.id });
      
      if (!existingOrder) {
        // If order doesn't exist, create new Order instance and save to database
        existingOrder = new Order({
          shopifyOrderId: order.id,
          orderNumber: order.order_number,
          customerEmail: order.email,
          totalPrice: order.total_price,
          lineItems: order.line_items,
          shippingAddress: order.shipping_address,
          // Add other relevant fields
        });
        await existingOrder.save();
        logger.info(`New order synced: ${order.order_number}`);
      } else {
        // If order exists, update its details if necessary
        existingOrder.totalPrice = order.total_price;
        existingOrder.lineItems = order.line_items;
        // Update other fields as needed
        await existingOrder.save();
        logger.info(`Order updated: ${order.order_number}`);
      }
    }
    
    // Log synchronization results
    logger.info(`Order synchronization completed. ${unfulfilledOrders.length} orders processed.`);
  } catch (error) {
    // Handle any errors that occur during synchronization
    logger.error('Error synchronizing orders:', error);
    throw error;
  }
};

// Updates the status of an order in Shopify
const updateOrderStatus = async (orderId, status) => {
  try {
    // Create Shopify client using createShopifyClient()
    const client = createShopifyClient();
    
    // Prepare order update payload with new status
    const payload = {
      order: {
        id: orderId,
        status: status
      }
    };
    
    // Make PUT request to Shopify API to update order
    const response = await client.put(`/orders/${orderId}.json`, payload);
    
    // Log the result of the update operation
    logger.info(`Order ${orderId} status updated to ${status}`);
    
    // Return the updated order object
    return response.data.order;
  } catch (error) {
    // Handle and log any errors that occur
    logger.error(`Error updating order ${orderId} status:`, error);
    throw error;
  }
};

// Synchronizes inventory levels between local database and Shopify
const syncInventory = async () => {
  try {
    // Fetch all inventory items from local database
    const inventoryItems = await InventoryItem.find();
    
    // Create Shopify client using createShopifyClient()
    const client = createShopifyClient();
    
    // For each inventory item, prepare update payload
    for (const item of inventoryItems) {
      const payload = {
        inventory_item_id: item.shopifyInventoryItemId,
        location_id: item.locationId,
        available: item.quantity
      };
      
      // Make API call to Shopify to update inventory levels
      await client.post('/inventory_levels/set.json', payload);
      
      // Log results of each inventory update
      logger.info(`Inventory updated for item ${item.shopifyInventoryItemId}`);
    }
    
    logger.info('Inventory synchronization completed.');
  } catch (error) {
    // Handle any errors that occur during synchronization
    logger.error('Error synchronizing inventory:', error);
    throw error;
  }
};

// Retrieves all products from Shopify
const fetchProducts = async () => {
  try {
    // Create Shopify client using createShopifyClient()
    const client = createShopifyClient();
    
    // Make GET request to Shopify API for all products
    const response = await client.get('/products.json');
    
    // Handle pagination if necessary
    let products = response.data.products;
    while (response.headers.link && response.headers.link.includes('next')) {
      const nextUrl = response.headers.link.split('<')[1].split('>')[0];
      const nextResponse = await client.get(nextUrl);
      products = [...products, ...nextResponse.data.products];
      response.headers = nextResponse.headers;
    }
    
    // Return array of product objects
    return products;
  } catch (error) {
    // Log any errors that occur
    logger.error('Error fetching products:', error);
    throw error;
  }
};

// Synchronizes products from Shopify to local database
const syncProducts = async () => {
  try {
    // Fetch all products using fetchProducts()
    const shopifyProducts = await fetchProducts();
    
    // Iterate through fetched products
    for (const product of shopifyProducts) {
      // For each product, check if it exists in local database
      let existingProduct = await Product.findOne({ shopifyProductId: product.id });
      
      if (!existingProduct) {
        // If product doesn't exist, create new Product instance and save to database
        existingProduct = new Product({
          shopifyProductId: product.id,
          title: product.title,
          description: product.body_html,
          price: product.variants[0].price,
          // Add other relevant fields
        });
        await existingProduct.save();
        logger.info(`New product synced: ${product.title}`);
      } else {
        // If product exists, update its details if necessary
        existingProduct.title = product.title;
        existingProduct.description = product.body_html;
        existingProduct.price = product.variants[0].price;
        // Update other fields as needed
        await existingProduct.save();
        logger.info(`Product updated: ${product.title}`);
      }
    }
    
    // Log synchronization results
    logger.info(`Product synchronization completed. ${shopifyProducts.length} products processed.`);
  } catch (error) {
    // Handle any errors that occur during synchronization
    logger.error('Error synchronizing products:', error);
    throw error;
  }
};

module.exports = {
  fetchUnfulfilledOrders,
  syncOrders,
  updateOrderStatus,
  syncInventory,
  fetchProducts,
  syncProducts
};

// Human tasks:
// TODO: Implement error handling strategies for API rate limits and temporary outages
// TODO: Add unit tests for each function in the shopifyService
// TODO: Implement a caching mechanism to reduce API calls and improve performance
// TODO: Set up a webhook listener for real-time updates from Shopify
// TODO: Implement retry logic for failed API requests
// TODO: Add support for bulk operations to handle large datasets more efficiently