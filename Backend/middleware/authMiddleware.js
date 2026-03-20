const jwt = require('jsonwebtoken');

// AUTHENTICATION
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, 'your_secret_key');
    req.user = decoded; // contains id and role
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// AUTHORIZATION (ROLE CHECK)
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Access denied: insufficient permissions'
      });
    }
    next();
  };
};

module.exports = { authMiddleware, authorize };
