import React from 'react';
import styled from 'styled-components';
import SummaryWidget from 'src/frontend/components/dashboard/SummaryWidget';
import RecentOrders from 'src/frontend/components/dashboard/RecentOrders';
import InventoryAlerts from 'src/frontend/components/dashboard/InventoryAlerts';
import useOrders from 'src/frontend/hooks/useOrders';
import useInventory from 'src/frontend/hooks/useInventory';
import useAuth from 'src/frontend/hooks/useAuth';

const DashboardContainer = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
`;

const Header = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`;

const WidgetContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { recentOrders, orderStats } = useOrders();
  const { inventoryStats, inventoryAlerts } = useInventory();

  return (
    <DashboardContainer>
      <Header>Welcome, {user?.username}</Header>
      <WidgetContainer>
        <SummaryWidget title="Total Orders" value={orderStats.totalOrders} icon="shopping-cart" />
        <SummaryWidget title="Revenue" value={orderStats.totalRevenue} icon="dollar-sign" />
        <SummaryWidget title="Low Stock Items" value={inventoryStats.lowStockCount} icon="alert-triangle" />
        <SummaryWidget title="Pending Shipments" value={orderStats.pendingShipments} icon="package" />
      </WidgetContainer>
      <ContentContainer>
        <RecentOrders orders={recentOrders} />
        <InventoryAlerts alerts={inventoryAlerts} />
      </ContentContainer>
    </DashboardContainer>
  );
};

export default Dashboard;