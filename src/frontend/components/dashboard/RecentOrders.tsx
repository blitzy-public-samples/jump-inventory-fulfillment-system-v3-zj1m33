import React from 'react';
import styled from 'styled-components';
import { useOrders } from 'src/frontend/hooks/useOrders';
import { Table } from 'src/frontend/components/common/Table';
import { Button } from 'src/frontend/components/common/Button';
import { formatDate, formatCurrency } from 'src/shared/utils/index';
import { Order } from 'src/shared/types/index';

const RecentOrdersContainer = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-top: 20px;
`;

const Title = styled.h2`
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  color: #333333;
`;

export const RecentOrders: React.FC = () => {
  const { orders, loading, error } = useOrders();

  const columns = [
    { header: 'Order ID', accessor: 'id' },
    { header: 'Date', accessor: 'orderDate', cell: (value: string) => formatDate(value) },
    { header: 'Customer', accessor: 'customerName' },
    { header: 'Total', accessor: 'totalAmount', cell: (value: number) => formatCurrency(value) },
    { header: 'Status', accessor: 'status' },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (value: string) => (
        <>
          <Button onClick={() => handleViewDetails(value)}>View Details</Button>
          <Button onClick={() => handleFulfill(value)}>Fulfill</Button>
        </>
      ),
    },
  ];

  const handleViewDetails = (orderId: string) => {
    // Implement view details logic
    console.log(`View details for order ${orderId}`);
  };

  const handleFulfill = (orderId: string) => {
    // Implement fulfill logic
    console.log(`Fulfill order ${orderId}`);
  };

  if (loading) {
    return <div>Loading recent orders...</div>;
  }

  if (error) {
    return <div>Error loading recent orders: {error.message}</div>;
  }

  return (
    <RecentOrdersContainer>
      <Title>Recent Orders</Title>
      <Table columns={columns} data={orders} />
    </RecentOrdersContainer>
  );
};