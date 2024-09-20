const express = require('express');
const { login, logout, register, forgotPassword, resetPassword, updateProfile, changePassword, getUsers, getUserById, deleteUser } = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

// User login route
router.post('/login', rateLimiter, login);

// User logout route
router.post('/logout', authenticate, logout);

// User registration route
router.post('/register', rateLimiter, register);

// Forgot password route
router.post('/forgot-password', rateLimiter, forgotPassword);

// Reset password route
router.post('/reset-password', rateLimiter, resetPassword);

// Update user profile route
router.put('/profile', authenticate, updateProfile);

// Change password route
router.put('/change-password', authenticate, changePassword);

// Get all users route (admin only)
router.get('/', authenticate, authorize(['admin']), getUsers);

// Get user by ID route (admin only)
router.get('/:id', authenticate, authorize(['admin']), getUserById);

// Delete user route (admin only)
router.delete('/:id', authenticate, authorize(['admin']), deleteUser);

module.exports = router;

// Human tasks:
// TODO: Implement additional security measures such as CSRF protection
// TODO: Add input validation middleware for each route
// TODO: Implement logging for each route access and error
// TODO: Consider adding routes for user account verification if needed
// TODO: Review and adjust rate limiting settings based on application needs