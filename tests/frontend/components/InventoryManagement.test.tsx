import React from 'react';
import { Provider } from 'react-redux';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { configureStore } from '@reduxjs/toolkit';
import InventoryManagement from '../../../src/frontend/components/InventoryManagement';
import inventoryReducer from '../../../src/frontend/store/reducers/inventoryReducer';
import { InventoryItem } from '../../../src/shared/types/inventory';

// Mock API service
jest.mock('../../../src/frontend/services/api', () => ({
  fetchInventory: jest.fn(),
  addInventoryItem: jest.fn(),
  updateInventoryItem: jest.fn(),
  deleteInventoryItem: jest.fn(),
}));

// Helper function to render component with Redux store
const renderWithRedux = (
  component: React.ReactElement,
  initialState = {}
) => {
  const store = configureStore({
    reducer: { inventory: inventoryReducer },
    preloadedState: initialState,
  });
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

// Mock inventory data
const mockInventoryData: InventoryItem[] = [
  { id: '1', name: 'Item 1', quantity: 10, price: 9.99 },
  { id: '2', name: 'Item 2', quantity: 5, price: 14.99 },
  { id: '3', name: 'Item 3', quantity: 15, price: 7.99 },
];

describe('InventoryManagement', () => {
  it('renders correctly', () => {
    renderWithRedux(<InventoryManagement />, { inventory: { items: mockInventoryData } });
    
    // Check if the component title is displayed
    expect(screen.getByText('Inventory Management')).toBeInTheDocument();
    
    // Verify that the inventory table is rendered
    expect(screen.getByRole('table')).toBeInTheDocument();
    
    // Check if the 'Add Item' button is present
    expect(screen.getByText('Add Item')).toBeInTheDocument();
  });

  it('search functionality works as expected', () => {
    renderWithRedux(<InventoryManagement />, { inventory: { items: mockInventoryData } });
    
    // Find the search input field
    const searchInput = screen.getByPlaceholderText('Search inventory...');
    
    // Type a search query into the input field
    fireEvent.change(searchInput, { target: { value: 'Item 1' } });
    
    // Verify that the inventory table updates with filtered results
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument();
  });

  it('add new inventory item modal opens on button click', () => {
    renderWithRedux(<InventoryManagement />);
    
    // Find and click the 'Add Item' button
    const addButton = screen.getByText('Add Item');
    fireEvent.click(addButton);
    
    // Verify that the add item modal is displayed
    expect(screen.getByText('Add New Inventory Item')).toBeInTheDocument();
  });

  it('edit inventory item functionality works correctly', () => {
    renderWithRedux(<InventoryManagement />, { inventory: { items: mockInventoryData } });
    
    // Find and click the edit button for a specific inventory item
    const editButton = screen.getAllByText('Edit')[0];
    fireEvent.click(editButton);
    
    // Verify that the edit modal opens with pre-filled data
    expect(screen.getByText('Edit Inventory Item')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Item 1')).toBeInTheDocument();
    
    // Modify the item details
    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'Updated Item 1' } });
    
    // Submit the form
    const submitButton = screen.getByText('Save Changes');
    fireEvent.click(submitButton);
    
    // Verify that the inventory table updates with the new data
    expect(screen.getByText('Updated Item 1')).toBeInTheDocument();
  });

  it('delete inventory item functionality works as expected', () => {
    renderWithRedux(<InventoryManagement />, { inventory: { items: mockInventoryData } });
    
    // Find and click the delete button for a specific inventory item
    const deleteButton = screen.getAllByText('Delete')[0];
    fireEvent.click(deleteButton);
    
    // Verify that a confirmation modal appears
    expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
    
    // Confirm the deletion
    const confirmButton = screen.getByText('Yes, Delete');
    fireEvent.click(confirmButton);
    
    // Verify that the item is removed from the inventory table
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
  });

  it('pagination works correctly', () => {
    const manyItems = Array.from({ length: 25 }, (_, i) => ({
      id: `${i + 1}`,
      name: `Item ${i + 1}`,
      quantity: 10,
      price: 9.99,
    }));
    renderWithRedux(<InventoryManagement />, { inventory: { items: manyItems } });
    
    // Verify that pagination controls are displayed
    expect(screen.getByText('Next')).toBeInTheDocument();
    
    // Click on the next page button
    fireEvent.click(screen.getByText('Next'));
    
    // Verify that the inventory table updates with the next page of items
    expect(screen.getByText('Item 21')).toBeInTheDocument();
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
  });

  it('sorting functionality works as expected', () => {
    renderWithRedux(<InventoryManagement />, { inventory: { items: mockInventoryData } });
    
    // Click on a column header to sort
    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);
    
    // Verify that the inventory table updates with sorted data
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Item 1');
    expect(rows[3]).toHaveTextContent('Item 3');
    
    // Click again to reverse sort order
    fireEvent.click(nameHeader);
    
    // Verify that the inventory table updates with reverse sorted data
    const updatedRows = screen.getAllByRole('row');
    expect(updatedRows[1]).toHaveTextContent('Item 3');
    expect(updatedRows[3]).toHaveTextContent('Item 1');
  });
});

// Human tasks:
// - Review and potentially expand test coverage for edge cases
// - Implement integration tests with actual API calls (if not covered elsewhere)
// - Consider adding performance tests for large datasets
// - Ensure accessibility testing is included (e.g., using jest-axe)