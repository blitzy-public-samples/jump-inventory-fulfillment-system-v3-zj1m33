import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useProducts } from 'src/frontend/hooks/useProducts';
import Table from 'src/frontend/components/common/Table';
import Button from 'src/frontend/components/common/Button';
import Input from 'src/frontend/components/common/Input';
import Select from 'src/frontend/components/common/Select';
import Modal from 'src/frontend/components/common/Modal';
import { formatCurrency } from 'src/shared/utils/index';
import { Product } from 'src/shared/types/index';

const ProductListContainer = styled.div`
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 10px;
`;

const ProductList: React.FC = () => {
  const [filters, setFilters] = useState({});
  const [sorting, setSorting] = useState({ field: 'name', direction: 'asc' });
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [modalState, setModalState] = useState({ isOpen: false, type: '', product: null });

  const { products, totalPages, isLoading, error } = useProducts(filters, sorting, pagination);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prevFilters => ({ ...prevFilters, [field]: value }));
    setPagination(prevPagination => ({ ...prevPagination, page: 1 }));
  };

  const handleSortChange = (field: string) => {
    setSorting(prevSorting => ({
      field,
      direction: prevSorting.field === field && prevSorting.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prevPagination => ({ ...prevPagination, page }));
  };

  const handleAddProduct = () => {
    setModalState({ isOpen: true, type: 'add', product: null });
  };

  const handleEditProduct = (product: Product) => {
    setModalState({ isOpen: true, type: 'edit', product });
  };

  const handleDeleteProduct = (product: Product) => {
    setModalState({ isOpen: true, type: 'delete', product });
  };

  const handleSyncWithShopify = () => {
    setModalState({ isOpen: true, type: 'sync', product: null });
  };

  const columns = [
    { header: 'Name', accessor: 'name', sortable: true },
    { header: 'SKU', accessor: 'sku', sortable: true },
    { header: 'Price', accessor: 'price', sortable: true, cell: (value: number) => formatCurrency(value) },
    { header: 'Stock', accessor: 'stock', sortable: true },
    { header: 'Actions', accessor: 'actions', cell: (_, product: Product) => (
      <>
        <Button onClick={() => handleEditProduct(product)}>Edit</Button>
        <Button onClick={() => handleDeleteProduct(product)}>Delete</Button>
      </>
    )},
  ];

  return (
    <ProductListContainer>
      <FilterContainer>
        <Input
          placeholder="Search products"
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
        <Select
          options={[
            { value: 'all', label: 'All Categories' },
            // Add more category options here
          ]}
          onChange={(value) => handleFilterChange('category', value)}
        />
      </FilterContainer>

      <Table
        columns={columns}
        data={products}
        onSort={handleSortChange}
        sortField={sorting.field}
        sortDirection={sorting.direction}
      />

      <Pagination>
        {/* Implement pagination controls here */}
      </Pagination>

      <ActionButtons>
        <Button onClick={handleAddProduct}>Add Product</Button>
        <Button onClick={handleSyncWithShopify}>Sync with Shopify</Button>
      </ActionButtons>

      <Modal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, type: '', product: null })}
      >
        {/* Implement modal content based on modalState.type */}
      </Modal>
    </ProductListContainer>
  );
};

export default ProductList;