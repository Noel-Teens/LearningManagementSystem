const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt');
const User = require('../modules/auth/user.model');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, secret);

    req.user = await User.findById(decoded.id);

    if (!req.user) {
        return res.status(401).json({ success: false, error: 'User not found' });
    }

    if (!req.user.isActive) {
        return res.status(401).json({ success: false, error: 'User account is deactivated' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }
};
