import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, IconButton } from '@material-ui/core';
import { Dashboard, Inventory, LocalShipping, Assessment, Settings, ChevronLeft, ChevronRight } from '@material-ui/icons';
import { useAuth } from '../../hooks/useAuth';
import { useSelector, useDispatch } from '../../store';
import { toggleSidebar } from '../../store/actions/userActions';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { title: 'Dashboard', icon: Dashboard, path: '/', roles: ['admin', 'warehouse_manager', 'warehouse_staff'] },
  { title: 'Orders', icon: LocalShipping, path: '/orders', roles: ['admin', 'warehouse_manager', 'warehouse_staff'] },
  { title: 'Inventory', icon: Inventory, path: '/inventory', roles: ['admin', 'warehouse_manager'] },
  { title: 'Reports', icon: Assessment, path: '/reports', roles: ['admin', 'warehouse_manager'] },
  { title: 'Settings', icon: Settings, path: '/settings', roles: ['admin'] }
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  // Initialize state for sidebar width
  const [sidebarWidth, setSidebarWidth] = useState(240);

  // Get current user role from useAuth hook
  const { user } = useAuth();
  const userRole = user?.role;

  // Get current location using useLocation hook
  const location = useLocation();

  // Get sidebar state from Redux store
  const isSidebarOpen = useSelector((state) => state.user.isSidebarOpen);
  const dispatch = useDispatch();

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

  // Implement useEffect for sidebar width animation
  useEffect(() => {
    setSidebarWidth(isSidebarOpen ? 240 : 60);
  }, [isSidebarOpen]);

  // Add click handler for sidebar toggle
  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <Drawer
      variant="permanent"
      open={isSidebarOpen}
      onClose={onClose}
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: sidebarWidth,
          boxSizing: 'border-box',
          transition: 'width 0.2s ease-in-out',
        },
      }}
    >
      <div>
        <IconButton onClick={handleToggleSidebar}>
          {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </div>
      <Divider />
      <List>
        {filteredMenuItems.map((item) => (
          <ListItem
            button
            key={item.title}
            component={NavLink}
            to={item.path}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>
              <item.icon />
            </ListItemIcon>
            <ListItemText primary={item.title} sx={{ opacity: isSidebarOpen ? 1 : 0 }} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;

// Human tasks:
// TODO: Implement responsive design for mobile devices
// TODO: Add unit tests for the Sidebar component
// TODO: Consider adding keyboard navigation support for accessibility
// TODO: Implement user preferences for sidebar open/closed state persistence