const request = require('supertest');
const express = require('express');
const app = require('../backend/server');
const Order = require('../backend/models/Order');
const Product = require('../backend/models/Product');
const InventoryItem = require('../backend/models/InventoryItem');
const shopifyService = require('../backend/services/shopifyService');
const sendleService = require('../backend/services/sendleService');
const db = require('../backend/utils/database');

// Setup test data in the database
async function setupTestData() {
  // Create test products
  const product1 = await Product.create({ name: 'Test Product 1', sku: 'TP1', price: 10.99 });
  const product2 = await Product.create({ name: 'Test Product 2', sku: 'TP2', price: 15.99 });

  // Create test inventory items
  await InventoryItem.create({ productId: product1._id, quantity: 100 });
  await InventoryItem.create({ productId: product2._id, quantity: 50 });

  // Create a test order
  const order = await Order.create({
    orderId: 'TEST123',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    shippingAddress: '123 Test St, Test City, TS 12345',
    orderItems: [
      { productId: product1._id, quantity: 2 },
      { productId: product2._id, quantity: 1 }
    ],
    totalAmount: 37.97,
    status: 'pending'
  });

  return { product1, product2, order };
}

// Clean up test data from the database
async function cleanupTestData() {
  await Order.deleteMany({});
  await Product.deleteMany({});
  await InventoryItem.deleteMany({});
}

describe('Order Fulfillment Integration Tests', () => {
  let testData;

  beforeAll(async () => {
    await db.connect();
    testData = await setupTestData();
  });

  afterAll(async () => {
    await cleanupTestData();
    await db.disconnect();
  });

  it('should retrieve and process a pending order', async () => {
    // Mock Shopify service to return our test order
    jest.spyOn(shopifyService, 'getNewOrders').mockResolvedValue([testData.order]);

    // Mock Sendle service for shipping label generation
    jest.spyOn(sendleService, 'generateShippingLabel').mockResolvedValue({
      trackingNumber: 'TRACK123',
      labelUrl: 'http://example.com/label'
    });

    const response = await request(app)
      .post('/api/process-orders')
      .send();

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Orders processed successfully');

    // Verify order status has been updated
    const updatedOrder = await Order.findOne({ orderId: testData.order.orderId });
    expect(updatedOrder.status).toBe('fulfilled');
    expect(updatedOrder.trackingNumber).toBe('TRACK123');
    expect(updatedOrder.shippingLabelUrl).toBe('http://example.com/label');

    // Verify inventory has been updated
    const updatedInventory1 = await InventoryItem.findOne({ productId: testData.product1._id });
    const updatedInventory2 = await InventoryItem.findOne({ productId: testData.product2._id });
    expect(updatedInventory1.quantity).toBe(98); // 100 - 2
    expect(updatedInventory2.quantity).toBe(49); // 50 - 1
  });

  it('should handle errors during order processing', async () => {
    // Mock Shopify service to throw an error
    jest.spyOn(shopifyService, 'getNewOrders').mockRejectedValue(new Error('Shopify API error'));

    const response = await request(app)
      .post('/api/process-orders')
      .send();

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Error processing orders: Shopify API error');
  });
});

// Human tasks:
// TODO: Review and potentially expand test cases to cover edge cases and error scenarios
// TODO: Implement additional integration tests for other parts of the order fulfillment process
// TODO: Consider adding performance tests to ensure the order fulfillment process meets speed requirements under load