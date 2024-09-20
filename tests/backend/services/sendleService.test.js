// Import required modules and functions
const axios = require('axios');
const sendleService = require('../../../src/backend/services/sendleService');
const sendleConfig = require('../../../src/backend/config/sendle');

// Mock the Sendle configuration and axios
jest.mock('../../../src/backend/config/sendle');
jest.mock('axios');

describe('Sendle Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Reset axios mock
    axios.mockReset();
    
    // Set up default Sendle configuration mock values
    sendleConfig.apiKey = 'test-api-key';
    sendleConfig.apiUrl = 'https://api.sendle.com';
  });

  test('generateShippingLabel generates a valid shipping label', async () => {
    // Mock axios post request with a successful response
    const mockResponse = {
      data: {
        label_url: 'https://sendle.com/labels/123456.pdf',
        tracking_number: 'SENDLE123456',
      },
    };
    axios.post.mockResolvedValue(mockResponse);

    // Mock order data
    const mockOrderData = {
      from: { name: 'Sender', address: '123 Sender St' },
      to: { name: 'Recipient', address: '456 Recipient Ave' },
      parcel: { weight: 1.5, dimensions: { length: 20, width: 15, height: 10 } },
    };

    // Call sendleService.generateShippingLabel with mock order data
    const result = await sendleService.generateShippingLabel(mockOrderData);

    // Assert that axios.post was called with correct parameters
    expect(axios.post).toHaveBeenCalledWith(
      `${sendleConfig.apiUrl}/shipping/labels`,
      mockOrderData,
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': `Bearer ${sendleConfig.apiKey}`,
        }),
      })
    );

    // Assert that the function returns the expected shipping label data
    expect(result).toEqual({
      labelUrl: 'https://sendle.com/labels/123456.pdf',
      trackingNumber: 'SENDLE123456',
    });
  });

  test('getTrackingInfo retrieves tracking information correctly', async () => {
    // Mock axios get request with a successful response
    const mockResponse = {
      data: {
        status: 'in_transit',
        estimated_delivery: '2023-05-15',
        tracking_events: [
          { timestamp: '2023-05-10T10:00:00Z', description: 'Package picked up' },
        ],
      },
    };
    axios.get.mockResolvedValue(mockResponse);

    const mockTrackingNumber = 'SENDLE123456';

    // Call sendleService.getTrackingInfo with a mock tracking number
    const result = await sendleService.getTrackingInfo(mockTrackingNumber);

    // Assert that axios.get was called with correct parameters
    expect(axios.get).toHaveBeenCalledWith(
      `${sendleConfig.apiUrl}/tracking/${mockTrackingNumber}`,
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': `Bearer ${sendleConfig.apiKey}`,
        }),
      })
    );

    // Assert that the function returns the expected tracking information
    expect(result).toEqual({
      status: 'in_transit',
      estimatedDelivery: '2023-05-15',
      trackingEvents: [
        { timestamp: '2023-05-10T10:00:00Z', description: 'Package picked up' },
      ],
    });
  });

  test('handleApiError handles errors correctly', async () => {
    // Mock axios request to throw an error
    const mockError = new Error('API Error');
    mockError.response = { status: 400, data: { message: 'Bad Request' } };
    axios.post.mockRejectedValue(mockError);

    // Mock console.error to capture logged errors
    console.error = jest.fn();

    // Call a Sendle service function that should trigger the error
    await expect(sendleService.generateShippingLabel({})).rejects.toThrow('Sendle API Error: Bad Request');

    // Verify that the error message is logged as expected
    expect(console.error).toHaveBeenCalledWith('Sendle API Error:', expect.any(Error));
  });
});

// Human tasks:
// TODO: Review and potentially expand test cases to cover edge cases and additional scenarios
// TODO: Implement integration tests that use a Sendle sandbox environment for end-to-end testing
// TODO: Set up CI/CD pipeline to run these tests automatically on each commit or pull request