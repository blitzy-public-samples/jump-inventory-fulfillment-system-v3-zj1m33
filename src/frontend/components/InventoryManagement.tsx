import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Grid, Paper, TextField, Button } from '@material-ui/core';
import { Search, Add } from '@material-ui/icons';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Alert from '../components/common/Alert';
import { fetchInventory, updateInventoryItem } from '../store/actions/inventoryActions';
import { useInventory } from '../hooks/useInventory';
import { formatCurrency } from '../utils/formatters';
import { validateInventoryItem } from '../utils/validators';
import { InventoryItem } from '../../shared/types/inventory';

const InventoryManagement: React.FC = () => {
  // Initialize state variables
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

  // Fetch inventory data using custom hook
  const { inventory, loading, error } = useInventory();
  const dispatch = useDispatch();

  // Define handleSearch function to filter inventory items
  const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  }, []);

  // Define handleEdit function to open edit modal for selected item
  const handleEdit = useCallback((item: InventoryItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  }, []);

  // Define handleUpdate function to update inventory item
  const handleUpdate = useCallback((updatedItem: InventoryItem) => {
    const validationError = validateInventoryItem(updatedItem);
    if (validationError) {
      setAlertMessage(validationError);
      setAlertSeverity('error');
      return;
    }

    dispatch(updateInventoryItem(updatedItem));
    setIsModalOpen(false);
    setSelectedItem(null);
    setAlertMessage('Inventory item updated successfully');
    setAlertSeverity('success');
  }, [dispatch]);

  // Define handleAdd function to open add new item modal
  const handleAdd = useCallback(() => {
    setSelectedItem(null);
    setIsModalOpen(true);
  }, []);

  // Filter inventory items based on search query
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Define table columns
  const columns = [
    { field: 'sku', headerName: 'SKU', width: 120 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'quantity', headerName: 'Quantity', width: 120 },
    { field: 'price', headerName: 'Price', width: 120, renderCell: (params: any) => formatCurrency(params.value) },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params: any) => (
        <Button variant="outlined" color="primary" onClick={() => handleEdit(params.row)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <Paper style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Inventory Management
      </Typography>

      {/* Search bar and Add button */}
      <Grid container spacing={2} alignItems="center" style={{ marginBottom: '20px' }}>
        <Grid item xs={10}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <Search />,
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleAdd}
          >
            Add Item
          </Button>
        </Grid>
      </Grid>

      {/* Inventory table */}
      {loading ? (
        <Typography>Loading inventory...</Typography>
      ) : error ? (
        <Typography color="error">Error loading inventory: {error}</Typography>
      ) : (
        <Table columns={columns} rows={filteredInventory} />
      )}

      {/* Edit/Add modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? 'Edit Inventory Item' : 'Add Inventory Item'}
        content={
          <InventoryItemForm
            item={selectedItem || { sku: '', name: '', quantity: 0, price: 0 }}
            onSubmit={handleUpdate}
          />
        }
      />

      {/* Alert messages */}
      <Alert
        message={alertMessage}
        severity={alertSeverity}
        onClose={() => setAlertMessage('')}
      />

      {/* Human tasks */}
      {/* 
        TODO: Implement the following tasks:
        - Implement barcode scanning functionality for quick inventory updates
        - Add export functionality for inventory data
        - Implement batch update feature for multiple inventory items
        - Implement real-time inventory updates using WebSocket connection
        - Add inventory history tracking and display functionality
        - Implement inventory forecasting based on historical data
      */}
    </Paper>
  );
};

export default InventoryManagement;