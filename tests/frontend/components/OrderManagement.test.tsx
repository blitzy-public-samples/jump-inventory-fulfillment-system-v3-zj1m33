import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect, toBeInTheDocument, toHaveTextContent } from '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { OrderManagement } from '../../../src/frontend/components/OrderManagement';
import { orderReducer } from '../../../src/frontend/store/reducers/orderReducer';
import { api } from '../../../src/frontend/services/api';

// Mock the API
jest.mock('../../../src/frontend/services/api');

describe('OrderManagement Component', () => {
  let store;

  beforeEach(() => {
    // Set up mock store
    store = configureStore({
      reducer: {
        orders: orderReducer,
      },
    });

    // Mock API calls
    api.getOrders = jest.fn().mockResolvedValue([]);
    api.fulfillOrder = jest.fn().mockResolvedValue({ success: true });
  });

  test('renders OrderManagement component correctly', async () => {
    const { getByText, queryByText } = render(
      <Provider store={store}>
        <OrderManagement />
      </Provider>
    );

    // Check if 'Order Management' heading is present
    expect(getByText('Order Management')).toBeInTheDocument();

    // Verify presence of order table
    expect(getByText('Order ID')).toBeInTheDocument();
    expect(getByText('Customer')).toBeInTheDocument();
    expect(getByText('Status')).toBeInTheDocument();

    // Check if 'No orders found' message is displayed when no orders are present
    await waitFor(() => {
      expect(getByText('No orders found')).toBeInTheDocument();
    });
  });

  test('filters orders correctly', async () => {
    // Mock API to return sample orders
    const sampleOrders = [
      { id: '1', customer: 'John Doe', status: 'Pending' },
      { id: '2', customer: 'Jane Smith', status: 'Fulfilled' },
    ];
    api.getOrders.mockResolvedValue(sampleOrders);

    const { getByPlaceholderText, getByText, queryByText } = render(
      <Provider store={store}>
        <OrderManagement />
      </Provider>
    );

    // Wait for orders to load
    await waitFor(() => {
      expect(getByText('John Doe')).toBeInTheDocument();
    });

    // Simulate user input in the filter input field
    const filterInput = getByPlaceholderText('Filter orders...');
    fireEvent.change(filterInput, { target: { value: 'John' } });

    // Verify that only matching orders are displayed
    expect(getByText('John Doe')).toBeInTheDocument();

    // Check if non-matching orders are not present in the DOM
    expect(queryByText('Jane Smith')).not.toBeInTheDocument();
  });

  test('sorts orders correctly', async () => {
    // Mock API to return sample orders
    const sampleOrders = [
      { id: '1', customer: 'John Doe', status: 'Pending' },
      { id: '2', customer: 'Jane Smith', status: 'Fulfilled' },
      { id: '3', customer: 'Alice Johnson', status: 'Processing' },
    ];
    api.getOrders.mockResolvedValue(sampleOrders);

    const { getByText, getAllByRole } = render(
      <Provider store={store}>
        <OrderManagement />
      </Provider>
    );

    // Wait for orders to load
    await waitFor(() => {
      expect(getByText('John Doe')).toBeInTheDocument();
    });

    // Simulate click on 'Customer' column header to sort
    fireEvent.click(getByText('Customer'));

    // Verify that orders are sorted in ascending order
    const customerCells = getAllByRole('cell', { name: /John Doe|Jane Smith|Alice Johnson/ });
    expect(customerCells[0]).toHaveTextContent('Alice Johnson');
    expect(customerCells[1]).toHaveTextContent('Jane Smith');
    expect(customerCells[2]).toHaveTextContent('John Doe');

    // Simulate another click on the 'Customer' column header
    fireEvent.click(getByText('Customer'));

    // Verify that orders are sorted in descending order
    const sortedCustomerCells = getAllByRole('cell', { name: /John Doe|Jane Smith|Alice Johnson/ });
    expect(sortedCustomerCells[0]).toHaveTextContent('John Doe');
    expect(sortedCustomerCells[1]).toHaveTextContent('Jane Smith');
    expect(sortedCustomerCells[2]).toHaveTextContent('Alice Johnson');
  });

  test('displays order details modal correctly', async () => {
    // Mock API to return sample orders
    const sampleOrders = [
      { id: '1', customer: 'John Doe', status: 'Pending', items: [{ name: 'Product A', quantity: 2 }] },
    ];
    api.getOrders.mockResolvedValue(sampleOrders);

    const { getByText, queryByText } = render(
      <Provider store={store}>
        <OrderManagement />
      </Provider>
    );

    // Wait for orders to load
    await waitFor(() => {
      expect(getByText('John Doe')).toBeInTheDocument();
    });

    // Simulate click on 'View Details' button for an order
    fireEvent.click(getByText('View Details'));

    // Verify that order details modal is displayed
    expect(getByText('Order Details')).toBeInTheDocument();

    // Check if correct order information is present in the modal
    expect(getByText('Order ID: 1')).toBeInTheDocument();
    expect(getByText('Customer: John Doe')).toBeInTheDocument();
    expect(getByText('Product A')).toBeInTheDocument();
    expect(getByText('Quantity: 2')).toBeInTheDocument();

    // Simulate click on close button
    fireEvent.click(getByText('Close'));

    // Verify that modal is closed
    expect(queryByText('Order Details')).not.toBeInTheDocument();
  });

  test('initiates order fulfillment process correctly', async () => {
    // Mock API to return sample orders
    const sampleOrders = [
      { id: '1', customer: 'John Doe', status: 'Pending', items: [{ name: 'Product A', quantity: 2, barcode: '123456' }] },
    ];
    api.getOrders.mockResolvedValue(sampleOrders);

    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <OrderManagement />
      </Provider>
    );

    // Wait for orders to load
    await waitFor(() => {
      expect(getByText('John Doe')).toBeInTheDocument();
    });

    // Simulate click on 'Fulfill Order' button for an order
    fireEvent.click(getByText('Fulfill Order'));

    // Verify that fulfillment modal is displayed
    expect(getByText('Fulfill Order')).toBeInTheDocument();

    // Simulate barcode scanning process
    const barcodeInput = getByPlaceholderText('Scan barcode');
    fireEvent.change(barcodeInput, { target: { value: '123456' } });
    fireEvent.keyPress(barcodeInput, { key: 'Enter', code: 13, charCode: 13 });

    // Verify that scanned items are marked as fulfilled
    expect(getByText('Product A - Scanned')).toBeInTheDocument();

    // Simulate completion of fulfillment process
    fireEvent.click(getByText('Complete Fulfillment'));

    // Check if api.fulfillOrder is called with correct parameters
    expect(api.fulfillOrder).toHaveBeenCalledWith('1');

    // Verify that success message is displayed
    await waitFor(() => {
      expect(getByText('Order fulfilled successfully')).toBeInTheDocument();
    });

    // Check if order status is updated in the component
    expect(getByText('Fulfilled')).toBeInTheDocument();
  });
});

// Human tasks:
// - Review and update test cases as new features are added to the OrderManagement component
// - Ensure test coverage meets the required threshold (e.g., 80% or as specified in the project requirements)
// - Add more granular tests for edge cases and error scenarios
// - Implement integration tests with actual Redux store and API calls (mocked at the network level)
// - Set up continuous integration to run these tests automatically on each pull request