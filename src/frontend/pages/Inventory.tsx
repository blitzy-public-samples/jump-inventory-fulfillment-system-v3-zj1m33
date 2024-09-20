import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { InventoryList } from 'src/frontend/components/inventory/InventoryList';
import { InventoryAdjustment } from 'src/frontend/components/inventory/InventoryAdjustment';
import { Button } from 'src/frontend/components/common/Button';
import { Modal } from 'src/frontend/components/common/Modal';
import { useInventory } from 'src/frontend/hooks/useInventory';
import { useAuth } from 'src/frontend/hooks/useAuth';
import { InventoryItem } from 'src/shared/types/index';

const InventoryPageContainer = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const Inventory: React.FC = () => {
  const { user } = useAuth();
  const { inventoryItems, fetchInventory, syncInventory } = useInventory();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isAdjustmentMode, setIsAdjustmentMode] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleViewItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsAdjustmentMode(false);
    setModalVisible(true);
  };

  const handleAdjustInventory = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsAdjustmentMode(true);
    setModalVisible(true);
  };

  const handleSyncInventory = async () => {
    try {
      await syncInventory();
      // Optionally, show a success message
    } catch (error) {
      // Handle error, show error message
      console.error('Failed to sync inventory:', error);
    }
  };

  return (
    <InventoryPageContainer>
      <Header>
        <h1>Inventory Management</h1>
        <Button onClick={handleSyncInventory}>Sync with Shopify</Button>
      </Header>
      <InventoryList
        items={inventoryItems}
        onViewItem={handleViewItem}
        onAdjustInventory={handleAdjustInventory}
      />
      <Modal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        title={isAdjustmentMode ? 'Adjust Inventory' : 'Item Details'}
      >
        {isAdjustmentMode && selectedItem ? (
          <InventoryAdjustment
            inventoryItem={selectedItem}
            onAdjustment={(adjustedItem) => {
              // Handle the adjusted item, update state or refetch inventory
              setModalVisible(false);
            }}
          />
        ) : (
          // Render InventoryItemDetails component here when it's created
          <div>Item Details Placeholder</div>
        )}
      </Modal>
    </InventoryPageContainer>
  );
};