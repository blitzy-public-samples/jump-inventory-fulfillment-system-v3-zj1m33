import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useOrders } from 'src/frontend/hooks/useOrders';
import { Table } from 'src/frontend/components/common/Table';
import { Button } from 'src/frontend/components/common/Button';
import { Input } from 'src/frontend/components/common/Input';
import { Select } from 'src/frontend/components/common/Select';
import { formatDate, formatCurrency } from 'src/shared/utils/index';
import { Order, OrderStatus } from 'src/shared/types/index';

const OrderListContainer = styled.div`
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

export const OrderList: React.FC = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  });
  const [sorting, setSorting] = useState({ field: 'createdAt', direction: 'desc' });
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  const { orders, totalPages, isLoading, error } = useOrders(filters, sorting, pagination);

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (field: string) => {
    setSorting(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const columns = [
    {
      header: 'Order ID',
      accessor: 'id',
      sortable: true,
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      sortable: true,
      cell: (value: string) => formatDate(value),
    },
    {
      header: 'Customer',
      accessor: 'customerName',
      sortable: true,
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
    },
    {
      header: 'Total',
      accessor: 'total',
      sortable: true,
      cell: (value: number) => formatCurrency(value),
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (value: string) => (
        <Button onClick={() => console.log(`View order ${value}`)}>View</Button>
      ),
    },
  ];

  return (
    <OrderListContainer>
      <FilterContainer>
        <Input
          placeholder="Search orders"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
        <Select
          options={Object.values(OrderStatus)}
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          placeholder="Filter by status"
        />
        <Input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
        />
        <Input
          type="date"
          value={filters.dateTo}
          onChange={(e) => handleFilterChange('dateTo', e.target.value)}
        />
      </FilterContainer>

      {isLoading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <Table
            data={orders}
            columns={columns}
            onSort={handleSortChange}
            sortField={sorting.field}
            sortDirection={sorting.direction}
          />
          <Pagination>
            <Button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <span>{`Page ${pagination.page} of ${totalPages}`}</span>
            <Button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === totalPages}
            >
              Next
            </Button>
          </Pagination>
        </>
      )}
    </OrderListContainer>
  );
};