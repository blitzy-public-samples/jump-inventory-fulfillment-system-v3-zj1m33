import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useInventory } from 'src/frontend/hooks/useInventory';
import Table from 'src/frontend/components/common/Table';
import Button from 'src/frontend/components/common/Button';
import { formatCurrency } from 'src/shared/utils/index';
import { InventoryItem } from 'src/shared/types/index';

const AlertsContainer = styled.div`
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

const InventoryAlerts: React.FC = () => {
  const { getLowStockItems } = useInventory();
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLowStockItems = async () => {
      try {
        const items = await getLowStockItems();
        setLowStockItems(items);
      } catch (err) {
        setError('Failed to fetch low stock items');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLowStockItems();
  }, [getLowStockItems]);

  const columns = [
    { header: 'SKU', accessor: 'sku' },
    { header: 'Product Name', accessor: 'name' },
    { header: 'Current Stock', accessor: 'quantity' },
    { header: 'Reorder Point', accessor: 'reorderPoint' },
    { header: 'Unit Price', accessor: 'price', Cell: ({ value }: { value: number }) => formatCurrency(value) },
    {
      header: 'Actions',
      accessor: 'id',
      Cell: ({ value }: { value: string }) => (
        <>
          <Button onClick={() => handleReorder(value)} size="small">Reorder</Button>
          <Button onClick={() => handleViewDetails(value)} size="small" variant="secondary">View Details</Button>
        </>
      ),
    },
  ];

  const handleReorder = (itemId: string) => {
    // Implement reorder logic
    console.log(`Reorder item with ID: ${itemId}`);
  };

  const handleViewDetails = (itemId: string) => {
    // Implement view details logic
    console.log(`View details for item with ID: ${itemId}`);
  };

  if (isLoading) {
    return <AlertsContainer>Loading inventory alerts...</AlertsContainer>;
  }

  if (error) {
    return <AlertsContainer>Error: {error}</AlertsContainer>;
  }

  return (
    <AlertsContainer>
      <Title>Inventory Alerts</Title>
      {lowStockItems.length > 0 ? (
        <Table
          columns={columns}
          data={lowStockItems}
          onSort={(sortField, sortDirection) => {
            // Implement sorting logic
            console.log(`Sort by ${sortField} in ${sortDirection} order`);
          }}
        />
      ) : (
        <p>No low stock items at the moment.</p>
      )}
    </AlertsContainer>
  );
};

export default InventoryAlerts;