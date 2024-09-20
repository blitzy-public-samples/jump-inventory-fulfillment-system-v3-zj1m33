import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from 'src/frontend/hooks/useAuth';
import { Icon } from 'src/frontend/components/common/Icon';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const SidebarWrapper = styled.aside<{ isCollapsed: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: ${props => props.isCollapsed ? '60px' : '240px'};
  background-color: #2c3e50;
  color: #ecf0f1;
  transition: width 0.3s ease;
  overflow-x: hidden;
  z-index: 1000;
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #ecf0f1;
  cursor: pointer;
  font-size: 1.5rem;
`;

const NavList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 60px 0 0 0;
`;

const NavItem = styled.li<{ isCollapsed: boolean }>`
  padding: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover { background-color: #34495e; }
  a { color: #ecf0f1; text-decoration: none; }
  span { margin-left: 10px; display: ${props => props.isCollapsed ? 'none' : 'inline'}; }
`;

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  const { user } = useAuth();

  const navItems = [
    { icon: 'dashboard', label: 'Dashboard', path: '/', roles: ['admin', 'manager', 'staff'] },
    { icon: 'orders', label: 'Orders', path: '/orders', roles: ['admin', 'manager', 'staff'] },
    { icon: 'inventory', label: 'Inventory', path: '/inventory', roles: ['admin', 'manager', 'staff'] },
    { icon: 'products', label: 'Products', path: '/products', roles: ['admin', 'manager'] },
    { icon: 'reports', label: 'Reports', path: '/reports', roles: ['admin', 'manager'] },
    { icon: 'settings', label: 'Settings', path: '/settings', roles: ['admin'] },
  ];

  return (
    <SidebarWrapper isCollapsed={isCollapsed}>
      <ToggleButton onClick={toggleSidebar}>
        <Icon name={isCollapsed ? 'menu' : 'close'} />
      </ToggleButton>
      <NavList>
        {navItems.map((item) => (
          user && item.roles.includes(user.role) && (
            <NavItem key={item.path} isCollapsed={isCollapsed}>
              <Link to={item.path}>
                <Icon name={item.icon} />
                <span>{item.label}</span>
              </Link>
            </NavItem>
          )
        ))}
      </NavList>
    </SidebarWrapper>
  );
};