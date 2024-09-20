import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from 'src/frontend/hooks/useAuth';
import Header from 'src/frontend/components/layout/Header';
import Sidebar from 'src/frontend/components/layout/Sidebar';
import Footer from 'src/frontend/components/layout/Footer';
import Dashboard from 'src/frontend/pages/Dashboard';
import Orders from 'src/frontend/pages/Orders';
import Inventory from 'src/frontend/pages/Inventory';
import Products from 'src/frontend/pages/Products';
import Reports from 'src/frontend/pages/Reports';
import Settings from 'src/frontend/pages/Settings';
import Login from 'src/frontend/pages/Login';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContainer>
        <Header />
        <MainContent>
          <Sidebar />
          <ContentArea>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
              <Route path="/inventory" element={<PrivateRoute><Inventory /></PrivateRoute>} />
              <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
              <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
              <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ContentArea>
        </MainContent>
        <Footer />
      </AppContainer>
    </BrowserRouter>
  );
};