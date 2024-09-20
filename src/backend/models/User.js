const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');
const { encrypt } = require('../utils/encryption');

const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: String,
  createdAt: Date,
  updatedAt: Date,
  lastLogin: String,
  isActive: Boolean,
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  // Check if password is modified
  if (!this.isModified('password')) return next();

  try {
    // Generate salt
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    // Hash password
    const hashedPassword = await bcrypt.hash(this.password, salt);
    // Set hashed password
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Compare provided password with stored hash
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    // Use bcrypt to compare candidatePassword with stored hash
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Generate JWT token for user authentication
UserSchema.methods.generateAuthToken = function() {
  // Create payload with user id and role
  const payload = {
    id: this._id,
    role: this.role
  };
  // Sign token with JWT_SECRET
  return jwt.sign(payload, JWT_SECRET);
};

// Encrypt sensitive user data before saving
UserSchema.methods.encryptSensitiveData = function() {
  // Encrypt email if modified
  if (this.isModified('email')) {
    this.email = encrypt(this.email);
  }
  // Encrypt username if modified
  if (this.isModified('username')) {
    this.username = encrypt(this.username);
  }
};

const User = mongoose.model('User', UserSchema);

// Create a new user in the database
async function createUser(userData) {
  try {
    // Create new User instance with userData
    const user = new User(userData);
    // Save user to database
    await user.save();
    // Return saved user object
    return user;
  } catch (error) {
    throw error;
  }
}

// Find a user by their email address
async function findUserByEmail(email) {
  try {
    // Query database for user with matching email
    return await User.findOne({ email });
  } catch (error) {
    throw error;
  }
}

module.exports = {
  User,
  createUser,
  findUserByEmail
};

// Human tasks:
// TODO: Implement password complexity requirements in the pre-save hook
// TODO: Add method for updating user's last login timestamp
// TODO: Implement password reset functionality using resetPasswordToken and resetPasswordExpires fields
// TODO: Add validation for email format and uniqueness
// TODO: Implement role-based access control checks