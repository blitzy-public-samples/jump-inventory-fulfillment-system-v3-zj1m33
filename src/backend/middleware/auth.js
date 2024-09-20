const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const awsConfig = require('src/backend/config/aws');
const User = require('src/backend/models/User');
const { ROLES } = require('src/shared/constants/roles');

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to authenticate JWT tokens
const authenticateToken = expressJwt({
  secret: JWT_SECRET,
  algorithms: ['HS256'],
  getToken: function fromHeaderOrQuerystring(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }
});

// Middleware to check if the authenticated user has the required role
const authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (req.user && allowedRoles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
  };
};

// Function to refresh the user's JWT token
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, JWT_SECRET);

    // Find the user in the database
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a new access token
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ accessToken, user: { id: user._id, email: user.email, role: user.role } });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

// Middleware to authenticate users using AWS Cognito
const cognitoAuthenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const idToken = authHeader.split(' ')[1];

  try {
    // Verify the Cognito token
    const cognitoUser = await awsConfig.cognitoIdentityServiceProvider.getUser({
      AccessToken: idToken
    }).promise();

    // Attach the Cognito user information to req.user
    req.user = {
      cognitoUsername: cognitoUser.Username,
      email: cognitoUser.UserAttributes.find(attr => attr.Name === 'email').Value
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid Cognito token' });
  }
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  refreshToken,
  cognitoAuthenticate
};

// Human tasks:
// TODO: Implement proper error handling and logging for authentication failures
// TODO: Set up AWS Cognito configuration in the AWS console
// TODO: Ensure that the JWT_SECRET environment variable is securely set in production
// TODO: Implement token revocation mechanism for logout functionality
// TODO: Add unit tests for each authentication function