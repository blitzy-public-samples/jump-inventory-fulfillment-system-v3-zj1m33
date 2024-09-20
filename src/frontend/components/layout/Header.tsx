import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from 'src/frontend/hooks/useAuth';
import { Button } from 'src/frontend/components/common/Button';

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
`;

const NavLink = styled(Link)`
  margin-right: 1rem;
  text-decoration: none;
  color: #333;
  &:hover { color: #007bff; }
`;

const UserName = styled.span`
  margin-right: 1rem;
  font-weight: bold;
`;

const Navigation: React.FC = () => (
  <nav>
    <NavLink to="/dashboard">Dashboard</NavLink>
    <NavLink to="/orders">Orders</NavLink>
    <NavLink to="/inventory">Inventory</NavLink>
    <NavLink to="/products">Products</NavLink>
    <NavLink to="/reports">Reports</NavLink>
  </nav>
);

const UserInfo: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <UserName>{user?.username}</UserName>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
};

export const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <HeaderWrapper>
      <Logo>Inventory Management</Logo>
      <Navigation />
      {user ? <UserInfo /> : <Button as={Link} to="/login">Login</Button>}
    </HeaderWrapper>
  );
};