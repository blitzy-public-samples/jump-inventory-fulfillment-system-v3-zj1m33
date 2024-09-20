import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useInventory } from 'src/frontend/hooks/useInventory';
import Table from 'src/frontend/components/common/Table';
import Button from 'src/frontend/components/common/Button';
import Input from 'src/frontend/components/common/Input';
import Select from 'src/frontend/components/common/Select';
import Modal from 'src/frontend/components/common/Modal';
import { formatCurrency } from 'src/shared/utils/index';
import { InventoryItem } from 'src/shared/types/index';

const InventoryListContainer = styled.div`
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

export const InventoryList: React.FC = () => {
  const [filters, setFilters] = useState({});
  const [sorting, setSorting] = useState({ field: 'name', direction: 'asc' });
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [modalState, setModalState] = useState({ isOpen: false, type: '', item: null });

  const { inventoryItems, totalPages, isLoading, error, fetchInventory } = useInventory();

  useEffect(() => {
    fetchInventory(filters, sorting, pagination);
  }, [filters, sorting, pagination]);

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

  const handlePageChange = (newPage: number) => {
    setPagination(prevPagination => ({ ...prevPagination, page: newPage }));
  };

  const handleAddItem = () => {
    setModalState({ isOpen: true, type: 'add', item: null });
  };

  const handleEditItem = (item: InventoryItem) => {
    setModalState({ isOpen: true, type: 'edit', item });
  };

  const handleDeleteItem = (item: InventoryItem) => {
    setModalState({ isOpen: true, type: 'delete', item });
  };

  const handleAdjustQuantity = (item: InventoryItem) => {
    setModalState({ isOpen: true, type: 'adjust', item });
  };

  const columns = [
    { header: 'Name', accessor: 'name', sortable: true },
    { header: 'SKU', accessor: 'sku', sortable: true },
    { header: 'Quantity', accessor: 'quantity', sortable: true },
    { header: 'Price', accessor: 'price', sortable: true, cell: (value: number) => formatCurrency(value) },
    { header: 'Last Counted', accessor: 'lastCounted', sortable: true },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (value: string, item: InventoryItem) => (
        <>
          <Button onClick={() => handleEditItem(item)}>Edit</Button>
          <Button onClick={() => handleDeleteItem(item)}>Delete</Button>
          <Button onClick={() => handleAdjustQuantity(item)}>Adjust Quantity</Button>
        </>
      ),
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <InventoryListContainer>
      <FilterContainer>
        <Input
          placeholder="Search by name or SKU"
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
        <Select
          options={[
            { value: 'all', label: 'All' },
            { value: 'low_stock', label: 'Low Stock' },
            { value: 'out_of_stock', label: 'Out of Stock' },
          ]}
          onChange={(value) => handleFilterChange('stockStatus', value)}
        />
      </FilterContainer>

      <Table
        columns={columns}
        data={inventoryItems}
        onSort={handleSortChange}
        sortField={sorting.field}
        sortDirection={sorting.direction}
      />

      <Pagination>
        <Button
          disabled={pagination.page === 1}
          onClick={() => handlePageChange(pagination.page - 1)}
        >
          Previous
        </Button>
        <span>{`Page ${pagination.page} of ${totalPages}`}</span>
        <Button
          disabled={pagination.page === totalPages}
          onClick={() => handlePageChange(pagination.page + 1)}
        >
          Next
        </Button>
      </Pagination>

      <ActionButtons>
        <Button onClick={handleAddItem}>Add Item</Button>
      </ActionButtons>

      <Modal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, type: '', item: null })}
        title={
          modalState.type === 'add' ? 'Add Item' :
          modalState.type === 'edit' ? 'Edit Item' :
          modalState.type === 'delete' ? 'Delete Item' :
          modalState.type === 'adjust' ? 'Adjust Quantity' : ''
        }
      >
        {/* Modal content will be implemented based on the modalState.type */}
        {/* This is where you would render forms for adding, editing, deleting, or adjusting quantity */}
      </Modal>
    </InventoryListContainer>
  );
};