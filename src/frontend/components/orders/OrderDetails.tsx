import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useOrder } from 'src/frontend/hooks/useOrder';
import { Button } from 'src/frontend/components/common/Button';
import { Modal } from 'src/frontend/components/common/Modal';
import { Table } from 'src/frontend/components/common/Table';
import { formatDate, formatCurrency } from 'src/shared/utils/index';
import { Order, OrderStatus } from 'src/shared/types/index';

const OrderDetailsContainer = styled.div`
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const OrderInfo = styled.div`
  margin-bottom: 20px;
`;

const CustomerInfo = styled.div`
  margin-bottom: 20px;
`;

const OrderItemsTable = styled.div`
  margin-bottom: 20px;
`;

const FulfillmentStatus = styled.div`
  margin-bottom: 20px;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

export const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { order, loading, error, fulfillOrder, cancelOrder } = useOrder(orderId);
  const [showFulfillModal, setShowFulfillModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (error) {
      // TODO: Implement error handling
      console.error('Error fetching order details:', error);
    }
  }, [error]);

  const handleFulfillOrder = async () => {
    try {
      await fulfillOrder();
      setShowFulfillModal(false);
    } catch (error) {
      // TODO: Implement error handling
      console.error('Error fulfilling order:', error);
    }
  };

  const handleCancelOrder = async () => {
    try {
      await cancelOrder();
      setShowCancelModal(false);
    } catch (error) {
      // TODO: Implement error handling
      console.error('Error cancelling order:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // TODO: Replace with proper loading indicator
  }

  if (!order) {
    return <div>Order not found</div>; // TODO: Implement proper error state UI
  }

  return (
    <OrderDetailsContainer>
      <OrderHeader>
        <h1>Order #{order.id}</h1>
        <div>Status: {order.status}</div>
      </OrderHeader>

      <OrderInfo>
        <h2>Order Information</h2>
        <p>Date: {formatDate(order.orderDate)}</p>
        <p>Total: {formatCurrency(order.totalAmount)}</p>
      </OrderInfo>

      <CustomerInfo>
        <h2>Customer Information</h2>
        <p>Name: {order.customer.name}</p>
        <p>Email: {order.customer.email}</p>
        <h3>Shipping Address</h3>
        <p>{order.shippingAddress.street1}</p>
        {order.shippingAddress.street2 && <p>{order.shippingAddress.street2}</p>}
        <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
        <p>{order.shippingAddress.country}</p>
      </CustomerInfo>

      <OrderItemsTable>
        <h2>Order Items</h2>
        <Table
          columns={[
            { header: 'Product', accessor: 'name' },
            { header: 'Quantity', accessor: 'quantity' },
            { header: 'Price', accessor: 'price', cell: (value) => formatCurrency(value) },
            { header: 'Total', accessor: 'total', cell: (value) => formatCurrency(value) }
          ]}
          data={order.items}
        />
      </OrderItemsTable>

      {order.status === OrderStatus.FULFILLED && (
        <FulfillmentStatus>
          <h2>Fulfillment Information</h2>
          <p>Fulfilled Date: {formatDate(order.fulfilledAt)}</p>
          <p>Tracking Number: {order.trackingNumber}</p>
        </FulfillmentStatus>
      )}

      <ActionButtons>
        {order.status === OrderStatus.PENDING && (
          <Button onClick={() => setShowFulfillModal(true)}>Fulfill Order</Button>
        )}
        {order.status !== OrderStatus.CANCELLED && (
          <Button variant="danger" onClick={() => setShowCancelModal(true)}>Cancel Order</Button>
        )}
      </ActionButtons>

      <Modal
        isOpen={showFulfillModal}
        onClose={() => setShowFulfillModal(false)}
        title="Fulfill Order"
      >
        <p>Are you sure you want to fulfill this order?</p>
        <Button onClick={handleFulfillOrder}>Confirm Fulfillment</Button>
      </Modal>

      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Order"
      >
        <p>Are you sure you want to cancel this order?</p>
        <Button variant="danger" onClick={handleCancelOrder}>Confirm Cancellation</Button>
      </Modal>
    </OrderDetailsContainer>
  );
};