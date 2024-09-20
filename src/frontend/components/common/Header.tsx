import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem } from '@material-ui/core';
import { Menu as MenuIcon, AccountCircle, Notifications } from '@material-ui/icons';
import { useAppSelector, useAppDispatch } from '../../store';
import { logout } from '../../store/actions/userActions';
import { useAuth } from '../../hooks/useAuth';
import { Logo } from '../common/Logo';

// Define the props interface for the Header component
interface HeaderProps {
  isAuthenticated: boolean;
}

const Header: React.FC<HeaderProps> = (props) => {
  // State for managing the user menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();

  // Handle opening the user menu
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle closing the user menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle user logout
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Mobile menu icon */}
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <Logo />

        {/* App title */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          My App
        </Typography>

        {/* Navigation items */}
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/about">About</Button>
        <Button color="inherit" component={Link} to="/contact">Contact</Button>

        {isAuthenticated && (
          <>
            {/* Notifications icon */}
            <IconButton color="inherit">
              <Notifications />
            </IconButton>

            {/* User menu */}
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose} component={Link} to="/profile">Profile</MenuItem>
              <MenuItem onClick={handleClose} component={Link} to="/settings">Settings</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        )}

        {!isAuthenticated && (
          <Button color="inherit" component={Link} to="/login">Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;

// Human tasks:
// TODO: Implement responsive design for mobile devices
// TODO: Add accessibility attributes (aria-labels, roles) to improve screen reader support
// TODO: Implement internationalization (i18n) for multi-language support
// TODO: Add unit tests for the Header component
// TODO: Implement error boundary to catch and handle potential errors in the component