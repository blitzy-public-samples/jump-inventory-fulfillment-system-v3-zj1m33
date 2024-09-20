const request = require('supertest');
const inventoryController = require('../../../src/backend/controllers/inventoryController');
const InventoryItem = require('../../../src/backend/models/InventoryItem');
const Product = require('../../../src/backend/models/Product');
const shopifyService = require('../../../src/backend/services/shopifyService');

// Mock functions
jest.mock('../../../src/backend/models/InventoryItem');
jest.mock('../../../src/backend/models/Product');
jest.mock('../../../src/backend/services/shopifyService');

// Helper function to create a mock InventoryItem object
const mockInventoryItem = () => {
  return {
    _id: '123456789',
    productId: 'PROD123',
    quantity: 10,
    location: 'Warehouse A',
    lastUpdated: new Date(),
  };
};

// Helper function to create a mock Product object
const mockProduct = () => {
  return {
    _id: 'PROD123',
    name: 'Test Product',
    description: 'A test product for unit testing',
    price: 19.99,
    category: 'Test Category',
  };
};

describe('Inventory Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllInventoryItems', () => {
    it('should return all inventory items', async () => {
      const mockItems = [mockInventoryItem(), mockInventoryItem()];
      InventoryItem.find.mockResolvedValue(mockItems);

      await inventoryController.getAllInventoryItems(req, res);

      expect(InventoryItem.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockItems);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      InventoryItem.find.mockRejectedValue(error);

      await inventoryController.getAllInventoryItems(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('getInventoryItemById', () => {
    it('should return a specific inventory item', async () => {
      const mockItem = mockInventoryItem();
      req.params.id = mockItem._id;
      InventoryItem.findById.mockResolvedValue(mockItem);

      await inventoryController.getInventoryItemById(req, res);

      expect(InventoryItem.findById).toHaveBeenCalledWith(mockItem._id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockItem);
    });

    it('should return 404 if item not found', async () => {
      req.params.id = 'nonexistent';
      InventoryItem.findById.mockResolvedValue(null);

      await inventoryController.getInventoryItemById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Inventory item not found' });
    });
  });

  describe('createInventoryItem', () => {
    it('should create a new inventory item', async () => {
      const newItem = mockInventoryItem();
      req.body = newItem;
      InventoryItem.create.mockResolvedValue(newItem);

      await inventoryController.createInventoryItem(req, res);

      expect(InventoryItem.create).toHaveBeenCalledWith(newItem);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newItem);
    });

    it('should handle validation errors', async () => {
      const error = new Error('Validation error');
      error.name = 'ValidationError';
      InventoryItem.create.mockRejectedValue(error);

      await inventoryController.createInventoryItem(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Validation error' });
    });
  });

  describe('updateInventoryItem', () => {
    it('should update an existing inventory item', async () => {
      const updatedItem = mockInventoryItem();
      req.params.id = updatedItem._id;
      req.body = { quantity: 15 };
      InventoryItem.findByIdAndUpdate.mockResolvedValue(updatedItem);

      await inventoryController.updateInventoryItem(req, res);

      expect(InventoryItem.findByIdAndUpdate).toHaveBeenCalledWith(
        updatedItem._id,
        req.body,
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedItem);
    });

    it('should return 404 if item not found', async () => {
      req.params.id = 'nonexistent';
      InventoryItem.findByIdAndUpdate.mockResolvedValue(null);

      await inventoryController.updateInventoryItem(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Inventory item not found' });
    });
  });

  describe('deleteInventoryItem', () => {
    it('should delete an existing inventory item', async () => {
      const deletedItem = mockInventoryItem();
      req.params.id = deletedItem._id;
      InventoryItem.findByIdAndDelete.mockResolvedValue(deletedItem);

      await inventoryController.deleteInventoryItem(req, res);

      expect(InventoryItem.findByIdAndDelete).toHaveBeenCalledWith(deletedItem._id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Inventory item deleted successfully' });
    });

    it('should return 404 if item not found', async () => {
      req.params.id = 'nonexistent';
      InventoryItem.findByIdAndDelete.mockResolvedValue(null);

      await inventoryController.deleteInventoryItem(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Inventory item not found' });
    });
  });

  describe('syncInventoryWithShopify', () => {
    it('should sync inventory with Shopify', async () => {
      const mockShopifyInventory = [
        { id: 'SHOP1', quantity: 5 },
        { id: 'SHOP2', quantity: 8 },
      ];
      shopifyService.getInventory.mockResolvedValue(mockShopifyInventory);
      InventoryItem.findOneAndUpdate.mockResolvedValue({});

      await inventoryController.syncInventoryWithShopify(req, res);

      expect(shopifyService.getInventory).toHaveBeenCalled();
      expect(InventoryItem.findOneAndUpdate).toHaveBeenCalledTimes(mockShopifyInventory.length);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Inventory synced successfully' });
    });

    it('should handle errors during sync', async () => {
      const error = new Error('Shopify API error');
      shopifyService.getInventory.mockRejectedValue(error);

      await inventoryController.syncInventoryWithShopify(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error syncing inventory with Shopify' });
    });
  });
});

// Human tasks:
// TODO: Implement additional test cases for edge scenarios
// TODO: Add integration tests for inventory controller with actual database interactions
// TODO: Create mock data generator for more diverse test scenarios