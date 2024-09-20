import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Stepper, Step, StepLabel, Button, Grid, Paper } from '@material-ui/core';
import { CheckCircle, Error } from '@material-ui/icons';
import { fulfillOrder, updateOrderStatus } from '../store/actions/orderActions';
import { updateInventory } from '../store/actions/inventoryActions';
import { generateShippingLabel } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { BarcodeScanner } from '../components/common/BarcodeScanner';
import { Alert } from '../components/common/Alert';
import { Order, OrderItem } from '../../shared/types/order';
import { OrderStatus } from '../../shared/constants/orderStatus';

const FulfillmentProcess: React.FC = (props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [scannedItems, setScannedItems] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const dispatch = useDispatch();
  const { user } = useAuth();
  const order: Order = useSelector((state: any) => state.orders.currentOrder);

  const steps = ['Verify Items', 'Pack Order', 'Generate Shipping Label', 'Confirm Fulfillment'];

  // Handle barcode scanning
  const handleScan = useCallback((barcode: string) => {
    const matchingItem = order.items.find(item => item.sku === barcode);
    if (matchingItem && !scannedItems.includes(barcode)) {
      setScannedItems(prev => [...prev, barcode]);
      if (scannedItems.length + 1 === order.items.length) {
        setActiveStep(prev => prev + 1);
      }
    } else {
      setError('Invalid item scanned or item already scanned');
    }
  }, [order.items, scannedItems]);

  // Handle order fulfillment
  const handleFulfillment = async () => {
    try {
      // Generate shipping label
      const shippingLabel = await generateShippingLabel(order);

      // Update order status
      await dispatch(updateOrderStatus(order.id, OrderStatus.Fulfilled));

      // Update inventory
      await Promise.all(order.items.map(item =>
        dispatch(updateInventory(item.sku, -item.quantity))
      ));

      // Fulfill order
      await dispatch(fulfillOrder(order.id, shippingLabel));

      setSuccessMessage('Order fulfilled successfully');
      setActiveStep(0);
      setScannedItems([]);
    } catch (err) {
      setError('Error fulfilling order. Please try again.');
    }
  };

  // Render step content
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <Typography variant="h6">Scan items to verify:</Typography>
            <BarcodeScanner onScan={handleScan} />
            <Typography>
              Scanned: {scannedItems.length} / {order.items.length} items
            </Typography>
          </>
        );
      case 1:
        return <Typography>Pack the order according to packing guidelines.</Typography>;
      case 2:
        return <Typography>Generating shipping label...</Typography>;
      case 3:
        return (
          <>
            <Typography variant="h6">Order Summary:</Typography>
            {order.items.map((item: OrderItem) => (
              <Typography key={item.sku}>
                {item.name} - Quantity: {item.quantity}
              </Typography>
            ))}
            <Button variant="contained" color="primary" onClick={handleFulfillment}>
              Confirm Fulfillment
            </Button>
          </>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Paper style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Order Fulfillment Process
      </Typography>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div style={{ marginTop: '20px' }}>
        {getStepContent(activeStep)}
      </div>
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}
    </Paper>
  );
};

export default FulfillmentProcess;

// Human tasks:
// TODO: Implement error handling for API calls
// TODO: Add unit tests for the FulfillmentProcess component
// TODO: Optimize performance for handling large orders
// TODO: Implement accessibility features for screen readers
// TODO: Implement rollback mechanism in case of partial failure during fulfillment