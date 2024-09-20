import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Paper, Typography, Button } from '@material-ui/core';
import { AddCircle, LocalShipping, Assessment } from '@material-ui/icons';
import { Table } from '../components/common/Table';
import { fetchRecentOrders } from '../store/actions/orderActions';
import { fetchLowStockItems } from '../store/actions/inventoryActions';
import { useAuth } from '../hooks/useAuth';
import { getOrdersFulfilledToday } from '../services/api';
import { Order } from '../../shared/types/order';
import { InventoryItem } from '../../shared/types/inventory';

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  // Initialize state variables
  const [unfulfilledOrdersCount, setUnfulfilledOrdersCount] = useState<number>(0);
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);
  const [ordersFulfilledToday, setOrdersFulfilledToday] = useState<number>(0);

  // Use useAuth hook to get current user information
  const { user } = useAuth();

  // Use useSelector to get recent orders and low stock items from Redux store
  const recentOrders = useSelector((state: any) => state.orders.recentOrders);
  const lowStockItemsFromStore = useSelector((state: any) => state.inventory.lowStockItems);

  // Use useDispatch to dispatch actions for fetching recent orders and low stock items
  const dispatch = useDispatch();

  // Implement useEffect to fetch data on component mount
  useEffect(() => {
    dispatch(fetchRecentOrders());
    dispatch(fetchLowStockItems());

    // Fetch orders fulfilled today
    const fetchOrdersFulfilledToday = async () => {
      const count = await getOrdersFulfilledToday();
      setOrdersFulfilledToday(count);
    };
    fetchOrdersFulfilledToday();

    // Calculate unfulfilled orders count
    setUnfulfilledOrdersCount(recentOrders.filter((order: Order) => !order.fulfilled).length);

    // Set low stock items
    setLowStockItems(lowStockItemsFromStore);
  }, [dispatch, recentOrders, lowStockItemsFromStore]);

  // Reusable component for displaying summary information
  const SummaryWidget: React.FC<{ title: string; value: number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <Paper style={{ padding: '1rem', textAlign: 'center' }}>
      {icon}
      <Typography variant="h6">{title}</Typography>
      <Typography variant="h4">{value}</Typography>
    </Paper>
  );

  // Reusable component for quick action buttons
  const QuickActionButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
    <Button
      variant="contained"
      color="primary"
      startIcon={icon}
      onClick={onClick}
      fullWidth
      style={{ marginBottom: '1rem' }}
    >
      {label}
    </Button>
  );

  return (
    <Grid container spacing={3}>
      {/* Render summary widgets */}
      <Grid item xs={12} sm={4}>
        <SummaryWidget title="Unfulfilled Orders" value={unfulfilledOrdersCount} icon={<LocalShipping />} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <SummaryWidget title="Low Stock Items" value={lowStockItems.length} icon={<Assessment />} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <SummaryWidget title="Orders Fulfilled Today" value={ordersFulfilledToday} icon={<AddCircle />} />
      </Grid>

      {/* Render Recent Orders table */}
      <Grid item xs={12} md={8}>
        <Paper style={{ padding: '1rem' }}>
          <Typography variant="h6" gutterBottom>Recent Orders</Typography>
          <Table
            data={recentOrders}
            columns={[
              { header: 'Order ID', accessor: 'id' },
              { header: 'Customer', accessor: 'customerName' },
              { header: 'Total', accessor: 'total' },
              { header: 'Status', accessor: 'status' },
            ]}
          />
        </Paper>
      </Grid>

      {/* Render Inventory Alerts list */}
      <Grid item xs={12} md={4}>
        <Paper style={{ padding: '1rem' }}>
          <Typography variant="h6" gutterBottom>Inventory Alerts</Typography>
          {lowStockItems.map((item) => (
            <Typography key={item.id} variant="body2" gutterBottom>
              {item.name} - {item.quantity} left
            </Typography>
          ))}
        </Paper>
      </Grid>

      {/* Render Quick Action buttons */}
      <Grid item xs={12}>
        <Paper style={{ padding: '1rem' }}>
          <Typography variant="h6" gutterBottom>Quick Actions</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <QuickActionButton icon={<AddCircle />} label="New Order" onClick={() => {/* TODO: Implement navigation */}} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <QuickActionButton icon={<LocalShipping />} label="Manage Inventory" onClick={() => {/* TODO: Implement navigation */}} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <QuickActionButton icon={<Assessment />} label="View Reports" onClick={() => {/* TODO: Implement navigation */}} />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard;

// TODO: Human tasks
// - Implement actual navigation logic for quick action buttons
// - Add error handling for API calls and data fetching
// - Implement pagination for Recent Orders table if needed
// - Add unit tests for the Dashboard component and its child components
// - Optimize performance by implementing memoization for child components if necessary