const { jest } = require('jest');
const shopifyService = require('../../../src/backend/services/shopifyService');
const { Shopify } = require('@shopify/shopify-api');
const shopifyConfig = require('../../../src/backend/config/shopify');

let mockShopifyClient = null;

// Set up mock Shopify client before all tests
beforeAll(async () => {
  // Create a mock Shopify client
  mockShopifyClient = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };

  // Mock the Shopify.Clients.Rest constructor to return the mock client
  jest.spyOn(Shopify.Clients, 'Rest').mockImplementation(() => mockShopifyClient);

  // Mock necessary Shopify API methods
  // Add more mocked methods as needed for your tests
  mockShopifyClient.get.mockResolvedValue({ body: { products: [] } });
  mockShopifyClient.post.mockResolvedValue({ body: { product: { id: '123' } } });
});

// Clean up mocks after all tests
afterAll(() => {
  // Restore all mocked functions to their original implementation
  jest.restoreAllMocks();
});

describe('Shopify Service', () => {
  test('getProducts should return an array of products', async () => {
    const products = await shopifyService.getProducts();
    expect(Array.isArray(products)).toBe(true);
    expect(mockShopifyClient.get).toHaveBeenCalledWith({
      path: 'products',
    });
  });

  test('createProduct should create a new product', async () => {
    const newProduct = {
      title: 'Test Product',
      body_html: '<p>Test description</p>',
      vendor: 'Test Vendor',
      product_type: 'Test Type',
    };

    const createdProduct = await shopifyService.createProduct(newProduct);
    expect(createdProduct).toHaveProperty('id', '123');
    expect(mockShopifyClient.post).toHaveBeenCalledWith({
      path: 'products',
      data: { product: newProduct },
      type: 'application/json',
    });
  });

  // Add more test cases for other shopifyService functions

});

// Human tasks (to be implemented):
// TODO: Implement additional test cases for error handling scenarios
// TODO: Add integration tests with a Shopify test store if possible