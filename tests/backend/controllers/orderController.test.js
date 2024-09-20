const request = require('supertest');
const { orderController } = require('../../../src/backend/controllers/orderController');
const { Order } = require('../../../src/backend/models/Order');
const { shopifyService } = require('../../../src/backend/services/shopifyService');
const { sendleService } = require('../../../src/backend/services/sendleService');

// Mock the Order model
jest.mock('../../../src/backend/models/Order');

// Mock the shopifyService
jest.mock('../../../src/backend/services/shopifyService');

// Mock the sendleService
jest.mock('../../../src/backend/services/sendleService');

describe('Order Controller', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOrders', () => {
    it('should return all orders', async () => {
      // Mock Order.findAll to return a predefined list of orders
      const mockOrders = [
        { id: 1, customerName: 'John Doe' },
        { id: 2, customerName: 'Jane Smith' },
      ];
      Order.findAll.mockResolvedValue(mockOrders);

      // Call orderController.getOrders with mock request and response
      await orderController.getOrders(mockRequest, mockResponse);

      // Expect response.json to be called with the mocked orders
      expect(mockResponse.json).toHaveBeenCalledWith(mockOrders);
      // Expect response.status to be called with 200
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getOrderById', () => {
    it('should return a specific order by ID', async () => {
      // Mock Order.findByPk to return a predefined order
      const mockOrder = { id: 1, customerName: 'John Doe' };
      Order.findByPk.mockResolvedValue(mockOrder);

      // Create mock request with params.id set to a test order ID
      mockRequest.params = { id: 1 };

      // Call orderController.getOrderById with mock request and response
      await orderController.getOrderById(mockRequest, mockResponse);

      // Expect response.json to be called with the mocked order
      expect(mockResponse.json).toHaveBeenCalledWith(mockOrder);
      // Expect response.status to be called with 200
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('createOrder', () => {
    it('should create a new order', async () => {
      // Mock Order.create to return a new order object
      const mockNewOrder = { id: 3, customerName: 'Alice Johnson' };
      Order.create.mockResolvedValue(mockNewOrder);

      // Mock shopifyService.createOrder to return a Shopify order ID
      const mockShopifyOrderId = 'shopify_123';
      shopifyService.createOrder.mockResolvedValue(mockShopifyOrderId);

      // Create mock request with order data in the body
      mockRequest.body = { customerName: 'Alice Johnson', items: [] };

      // Call orderController.createOrder with mock request and response
      await orderController.createOrder(mockRequest, mockResponse);

      // Expect Order.create to be called with the request body data
      expect(Order.create).toHaveBeenCalledWith(mockRequest.body);

      // Expect shopifyService.createOrder to be called with the new order
      expect(shopifyService.createOrder).toHaveBeenCalledWith(mockNewOrder);

      // Expect response.json to be called with the created order
      expect(mockResponse.json).toHaveBeenCalledWith({ ...mockNewOrder, shopifyOrderId: mockShopifyOrderId });

      // Expect response.status to be called with 201
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });
  });

  describe('fulfillOrder', () => {
    it('should fulfill an order', async () => {
      // Mock Order.findByPk to return a predefined order
      const mockOrder = { id: 1, customerName: 'John Doe', status: 'pending' };
      Order.findByPk.mockResolvedValue(mockOrder);

      // Mock sendleService.createShippingLabel to return a shipping label
      const mockShippingLabel = 'SHIPPING_LABEL_123';
      sendleService.createShippingLabel.mockResolvedValue(mockShippingLabel);

      // Mock shopifyService.fulfillOrder to return a success status
      shopifyService.fulfillOrder.mockResolvedValue(true);

      // Create mock request with params.id set to a test order ID
      mockRequest.params = { id: 1 };

      // Call orderController.fulfillOrder with mock request and response
      await orderController.fulfillOrder(mockRequest, mockResponse);

      // Expect sendleService.createShippingLabel to be called with the order
      expect(sendleService.createShippingLabel).toHaveBeenCalledWith(mockOrder);

      // Expect shopifyService.fulfillOrder to be called with the order and shipping label
      expect(shopifyService.fulfillOrder).toHaveBeenCalledWith(mockOrder, mockShippingLabel);

      // Expect the order's status to be updated to 'fulfilled'
      expect(mockOrder.status).toBe('fulfilled');

      // Expect response.json to be called with the updated order
      expect(mockResponse.json).toHaveBeenCalledWith(mockOrder);

      // Expect response.status to be called with 200
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });
});

// Human tasks:
// TODO: Implement additional test cases for error scenarios
// TODO: Add integration tests for order controller functions
// TODO: Create mock data factory for generating test orders
// TODO: Implement test coverage reporting
// TODO: Add performance tests for order-related operations