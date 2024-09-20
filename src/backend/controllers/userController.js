const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');
const { ROLES } = require('../../shared/constants/roles');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

// Register a new user
exports.register = async (req, res) => {
    try {
        // Validate input data
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            email,
            password: hashedPassword,
            name
        });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

        // Send welcome email
        await emailService.sendWelcomeEmail(newUser.email, newUser.name);

        // Return user data and token
        res.status(201).json({
            message: 'User registered successfully',
            user: { id: newUser._id, email: newUser.email, name: newUser.name },
            token
        });
    } catch (error) {
        logger.error('Error in user registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Authenticate a user and return a token
exports.login = async (req, res) => {
    try {
        // Validate input data
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

        // Return user data and token
        res.json({
            user: { id: user._id, email: user.email, name: user.name },
            token
        });
    } catch (error) {
        logger.error('Error in user login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Retrieve the profile of the authenticated user
exports.getProfile = async (req, res) => {
    try {
        // Get user ID from authenticated request
        const userId = req.user.id;

        // Fetch user data from database
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return user profile data
        res.json(user);
    } catch (error) {
        logger.error('Error in getting user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update the profile of the authenticated user
exports.updateProfile = async (req, res) => {
    try {
        // Get user ID from authenticated request
        const userId = req.user.id;

        // Validate input data
        const { name, email } = req.body;
        if (!name && !email) {
            return res.status(400).json({ message: 'No update data provided' });
        }

        // Update user data in database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { name, email } },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return updated user profile data
        res.json(updatedUser);
    } catch (error) {
        logger.error('Error in updating user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Change the password of the authenticated user
exports.changePassword = async (req, res) => {
    try {
        // Get user ID from authenticated request
        const userId = req.user.id;

        // Validate input data
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current password and new password are required' });
        }

        // Verify current password
        const user = await User.findById(userId);
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password in database
        user.password = hashedPassword;
        await user.save();

        // Return success response
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        logger.error('Error in changing password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Initiate the password reset process
exports.forgotPassword = async (req, res) => {
    try {
        // Validate input email
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate password reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        // Save token to user in database
        await user.save();

        // Send password reset email
        await emailService.sendPasswordResetEmail(user.email, resetToken);

        // Return success response
        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        logger.error('Error in forgot password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Reset the user's password using a valid reset token
exports.resetPassword = async (req, res) => {
    try {
        // Validate input data
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Token and new password are required' });
        }

        // Find user by reset token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired password reset token' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear reset token in database
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        // Return success response
        res.json({ message: 'Password has been reset successfully' });
    } catch (error) {
        logger.error('Error in resetting password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Retrieve all users (admin only)
exports.getAllUsers = async (req, res) => {
    try {
        // Verify admin role
        if (req.user.role !== ROLES.ADMIN) {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        // Fetch all users from database
        const users = await User.find().select('-password');

        // Return list of users
        res.json(users);
    } catch (error) {
        logger.error('Error in getting all users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a user (admin only)
exports.deleteUser = async (req, res) => {
    try {
        // Verify admin role
        if (req.user.role !== ROLES.ADMIN) {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        // Validate user ID
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Delete user from database
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return success response
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        logger.error('Error in deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Human tasks:
// - Implement rate limiting for sensitive operations like login and password reset
// - Add multi-factor authentication support
// - Implement user session management and logout functionality
// - Add audit logging for sensitive user operations
// - Implement password complexity validation
// - Add support for social media login (OAuth)
// - Implement user account lockout after multiple failed login attempts