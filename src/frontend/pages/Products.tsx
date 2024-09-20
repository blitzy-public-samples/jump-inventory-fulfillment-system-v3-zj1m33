import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ProductList from 'src/frontend/components/products/ProductList';
import ProductDetails from 'src/frontend/components/products/ProductDetails';
import Button from 'src/frontend/components/common/Button';
import Modal from 'src/frontend/components/common/Modal';
import useProducts from 'src/frontend/hooks/useProducts';
import useAuth from 'src/frontend/hooks/useAuth';
import { Product } from 'src/shared/types/index';

const ProductsPageContainer = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const Products: React.FC = () => {
  const { user } = useAuth();
  const { products, fetchProducts, addProduct, updateProduct, deleteProduct, syncProducts } = useProducts();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'add'>('view');

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setModalMode('view');
    setModalVisible(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setModalMode('edit');
    setModalVisible(true);
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setModalMode('add');
    setModalVisible(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        fetchProducts(); // Refresh the product list
      } catch (error) {
        console.error('Failed to delete product:', error);
        // TODO: Implement proper error handling
      }
    }
  };

  const handleSyncProducts = async () => {
    try {
      await syncProducts();
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error('Failed to sync products:', error);
      // TODO: Implement proper error handling
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  const handleProductSave = async (product: Product) => {
    try {
      if (modalMode === 'add') {
        await addProduct(product);
      } else if (modalMode === 'edit' && selectedProduct) {
        await updateProduct(selectedProduct.id, product);
      }
      fetchProducts(); // Refresh the product list
      handleModalClose();
    } catch (error) {
      console.error('Failed to save product:', error);
      // TODO: Implement proper error handling
    }
  };

  return (
    <ProductsPageContainer>
      <Header>
        <h1>Products</h1>
        <div>
          <Button onClick={handleAddProduct}>Add Product</Button>
          <Button onClick={handleSyncProducts}>Sync with Shopify</Button>
        </div>
      </Header>
      <ProductList
        products={products}
        onViewProduct={handleViewProduct}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
      />
      <Modal isOpen={modalVisible} onClose={handleModalClose}>
        <ProductDetails
          product={selectedProduct}
          mode={modalMode}
          onSave={handleProductSave}
          onCancel={handleModalClose}
        />
      </Modal>
    </ProductsPageContainer>
  );
};

export default Products;