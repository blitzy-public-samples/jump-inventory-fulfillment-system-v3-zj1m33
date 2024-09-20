import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useProduct } from 'src/frontend/hooks/useProduct';
import { useInventory } from 'src/frontend/hooks/useInventory';
import { Button } from 'src/frontend/components/common/Button';
import { Input } from 'src/frontend/components/common/Input';
import { Modal } from 'src/frontend/components/common/Modal';
import { Table } from 'src/frontend/components/common/Table';
import { formatCurrency } from 'src/shared/utils/index';
import { Product, InventoryItem } from 'src/shared/types/index';

const ProductDetailsContainer = styled.div`
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProductHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ProductInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
`;

const InventoryInfo = styled.div`
  margin-bottom: 20px;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

export const ProductDetails: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { product, updateProduct, syncWithShopify } = useProduct(productId);
  const { inventoryItems, adjustInventory } = useInventory(productId);
  const [editMode, setEditMode] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);

  useEffect(() => {
    if (product) {
      setEditedProduct(product);
    }
  }, [product]);

  const handleEditProduct = () => {
    setEditMode(true);
  };

  const handleSaveProduct = async () => {
    if (editedProduct) {
      try {
        await updateProduct(editedProduct);
        setEditMode(false);
      } catch (error) {
        console.error('Failed to update product:', error);
        // TODO: Implement proper error handling
      }
    }
  };

  const handleAdjustInventory = () => {
    setShowAdjustModal(true);
  };

  const handleSyncWithShopify = async () => {
    try {
      await syncWithShopify(productId);
      setShowSyncModal(false);
    } catch (error) {
      console.error('Failed to sync with Shopify:', error);
      // TODO: Implement proper error handling
    }
  };

  if (!product || !editedProduct) {
    return <div>Loading...</div>;
  }

  return (
    <ProductDetailsContainer>
      <ProductHeader>
        <h1>{editMode ? <Input value={editedProduct.name} onChange={(e) => setEditedProduct({...editedProduct, name: e.target.value})} /> : product.name}</h1>
        <span>SKU: {product.sku}</span>
      </ProductHeader>

      <ProductInfo>
        <div>
          <h3>Price</h3>
          {editMode ? (
            <Input
              type="number"
              value={editedProduct.price}
              onChange={(e) => setEditedProduct({...editedProduct, price: parseFloat(e.target.value)})}
            />
          ) : (
            formatCurrency(product.price)
          )}
        </div>
        <div>
          <h3>Description</h3>
          {editMode ? (
            <Input
              as="textarea"
              value={editedProduct.description}
              onChange={(e) => setEditedProduct({...editedProduct, description: e.target.value})}
            />
          ) : (
            product.description
          )}
        </div>
      </ProductInfo>

      <InventoryInfo>
        <h3>Inventory</h3>
        <Table
          columns={[
            { header: 'Location', accessor: 'location' },
            { header: 'Quantity', accessor: 'quantity' }
          ]}
          data={inventoryItems}
        />
      </InventoryInfo>

      <ActionButtons>
        {editMode ? (
          <>
            <Button onClick={handleSaveProduct}>Save</Button>
            <Button onClick={() => setEditMode(false)}>Cancel</Button>
          </>
        ) : (
          <Button onClick={handleEditProduct}>Edit</Button>
        )}
        <Button onClick={handleAdjustInventory}>Adjust Inventory</Button>
        <Button onClick={() => setShowSyncModal(true)}>Sync with Shopify</Button>
      </ActionButtons>

      <Modal
        isOpen={showAdjustModal}
        onClose={() => setShowAdjustModal(false)}
        title="Adjust Inventory"
      >
        {/* TODO: Implement inventory adjustment form */}
      </Modal>

      <Modal
        isOpen={showSyncModal}
        onClose={() => setShowSyncModal(false)}
        title="Sync with Shopify"
      >
        <p>Are you sure you want to sync this product with Shopify?</p>
        <Button onClick={handleSyncWithShopify}>Confirm</Button>
        <Button onClick={() => setShowSyncModal(false)}>Cancel</Button>
      </Modal>
    </ProductDetailsContainer>
  );
};