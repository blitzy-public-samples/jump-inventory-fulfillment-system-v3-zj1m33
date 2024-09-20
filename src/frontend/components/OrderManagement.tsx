import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, MenuItem } from '@material-ui/core';
import { Search, FilterList } from '@material-ui/icons';
import { fetchOrders, updateOrderStatus } from 'src/frontend/store/actions/orderActions';
import Modal from 'src/frontend/components/common/Modal';
import Alert from 'src/frontend/components/common/Alert';
import { Order } from 'src/shared/types/order';
import { ORDER_STATUS } from 'src/shared/constants/orderStatus';
import { makeStyles } from '@material-ui/core/styles';

// Define styles for the component
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  table: {
    minWidth: 650,
  },
  searchBar: {
    marginBottom: theme.spacing(2),
  },
  filterBar: {
    marginBottom: theme.spacing(2),
  },
  actionButton: {
    marginRight: theme.spacing(1),
  },
}));

// Define constant for items per page
const ITEMS_PER_PAGE = 10;

// Define interface for component props
interface OrderManagementProps {}

const OrderManagement: React.FC<OrderManagementProps> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const orders = useSelector((state: any) => state.orders.orders);

  // Initialize state variables
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Fetch orders on component mount
  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        await dispatch(fetchOrders());
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch orders');
        setLoading(false);
      }
    };
    loadOrders();
  }, [dispatch]);

  // Implement search functionality
  const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  }, []);

  // Implement filter functionality
  const handleFilter = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setStatusFilter(event.target.value);
  }, []);

  // Implement order status update functionality
  const handleStatusUpdate = useCallback(async (orderId: string, newStatus: string) => {
    try {
      await dispatch(updateOrderStatus(orderId, newStatus));
      setAlertMessage('Order status updated successfully');
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to update order status');
    }
  }, [dispatch]);

  // Filter and search orders
  const filteredOrders = orders.filter((order: Order) => {
    return (
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (statusFilter === '' || order.status === statusFilter)
    );
  });

  return (
    <div className={classes.root}>
      {/* Render search and filter controls */}
      <TextField
        className={classes.searchBar}
        label="Search Orders"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearch}
        InputProps={{
          startAdornment: <Search />,
        }}
      />
      <TextField
        className={classes.filterBar}
        select
        label="Filter by Status"
        value={statusFilter}
        onChange={handleFilter}
        variant="outlined"
        InputProps={{
          startAdornment: <FilterList />,
        }}
      >
        <MenuItem value="">All</MenuItem>
        {Object.values(ORDER_STATUS).map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </TextField>

      {/* Render table with order data */}
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.slice(0, ITEMS_PER_PAGE).map((order: Order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>
                  <Button
                    className={classes.actionButton}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsModalOpen(true);
                    }}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Render modal for order details and status update */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Order Details"
      >
        {selectedOrder && (
          <div>
            <p>Order ID: {selectedOrder.id}</p>
            <p>Customer: {selectedOrder.customerName}</p>
            <p>Date: {new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
            <p>Status: {selectedOrder.status}</p>
            <TextField
              select
              label="Update Status"
              value={selectedOrder.status}
              onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
              variant="outlined"
              fullWidth
            >
              {Object.values(ORDER_STATUS).map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
          </div>
        )}
      </Modal>

      {/* Render alert for success or error messages */}
      {alertMessage && (
        <Alert
          message={alertMessage}
          type="success"
          onClose={() => setAlertMessage(null)}
        />
      )}
      {error && (
        <Alert
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
};

export default OrderManagement;

// Human tasks:
// - Implement pagination for large numbers of orders
// - Add unit tests for OrderManagement component
// - Implement error boundary for graceful error handling
// - Add accessibility attributes to improve component usability
// - Optimize component performance for large datasets