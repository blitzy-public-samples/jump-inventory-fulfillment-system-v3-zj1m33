import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { api } from 'src/frontend/services/api';
import { API_BASE_URL } from 'src/frontend/config/constants';

// Create a new instance of MockAdapter for axios
const mock = new MockAdapter(axios);

describe('API Service', () => {
  beforeEach(() => {
    // Reset the mock adapter and clear all mocked requests
    mock.reset();
  });

  afterEach(() => {
    // Reset the mock adapter and clear all mocked requests
    mock.reset();
  });

  test('should make a successful GET request', async () => {
    // Mock a GET request to '/test' endpoint
    const mockData = { message: 'Success' };
    mock.onGet(`${API_BASE_URL}/test`).reply(200, mockData);

    // Call api.get('/test')
    const response = await api.get('/test');

    // Assert that the response matches the mocked data
    expect(response.data).toEqual(mockData);

    // Assert that the request was made with the correct method and URL
    expect(mock.history.get[0].url).toBe(`${API_BASE_URL}/test`);
  });

  test('should make a successful POST request', async () => {
    // Mock a POST request to '/test' endpoint
    const mockData = { id: 1, message: 'Created' };
    const postData = { data: 'test' };
    mock.onPost(`${API_BASE_URL}/test`, postData).reply(201, mockData);

    // Call api.post('/test', { data: 'test' })
    const response = await api.post('/test', postData);

    // Assert that the response matches the mocked data
    expect(response.data).toEqual(mockData);

    // Assert that the request was made with the correct method, URL, and data
    expect(mock.history.post[0].url).toBe(`${API_BASE_URL}/test`);
    expect(JSON.parse(mock.history.post[0].data)).toEqual(postData);
  });

  test('should handle API errors correctly', async () => {
    // Mock a GET request to '/error' endpoint that returns a 500 error
    mock.onGet(`${API_BASE_URL}/error`).reply(500, { message: 'Internal Server Error' });

    // Call api.get('/error') and expect it to throw an error
    await expect(api.get('/error')).rejects.toThrow('Request failed with status code 500');

    // Assert that the error message and status code match the mocked error
    try {
      await api.get('/error');
    } catch (error) {
      expect(error.response.status).toBe(500);
      expect(error.response.data.message).toBe('Internal Server Error');
    }
  });

  test('should add authorization header to requests', async () => {
    // Mock a GET request to '/auth-test' endpoint
    mock.onGet(`${API_BASE_URL}/auth-test`).reply(200);

    // Set a mock token in localStorage
    const mockToken = 'mock-token';
    localStorage.setItem('token', mockToken);

    // Call api.get('/auth-test')
    await api.get('/auth-test');

    // Assert that the request was made with the correct authorization header
    expect(mock.history.get[0].headers['Authorization']).toBe(`Bearer ${mockToken}`);

    // Clean up
    localStorage.removeItem('token');
  });

  test('should handle 401 errors and refresh token', async () => {
    // Mock a GET request to '/protected' endpoint that returns a 401 error
    mock.onGet(`${API_BASE_URL}/protected`).replyOnce(401);

    // Mock a POST request to '/refresh-token' endpoint
    const newToken = 'new-mock-token';
    mock.onPost(`${API_BASE_URL}/refresh-token`).reply(200, { token: newToken });

    // Mock a retry of the original GET request
    const protectedData = { message: 'Protected data' };
    mock.onGet(`${API_BASE_URL}/protected`).reply(200, protectedData);

    // Set initial token
    localStorage.setItem('token', 'old-mock-token');

    // Call api.get('/protected')
    const response = await api.get('/protected');

    // Assert that the refresh token request was made
    expect(mock.history.post.some(req => req.url === `${API_BASE_URL}/refresh-token`)).toBeTruthy();

    // Assert that the original request was retried with the new token
    expect(response.data).toEqual(protectedData);
    expect(localStorage.getItem('token')).toBe(newToken);

    // Clean up
    localStorage.removeItem('token');
  });
});

// Human tasks:
// - Implement additional tests for PUT and DELETE requests
// - Add tests for specific API endpoints (e.g., order management, inventory updates)
// - Implement tests for rate limiting and request throttling
// - Add tests for handling network errors and timeouts
// - Implement tests for cancelling requests
// - Add tests for file upload functionality if applicable