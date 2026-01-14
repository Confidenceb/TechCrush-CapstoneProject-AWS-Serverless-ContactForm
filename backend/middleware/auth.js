const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied - No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log('=== AUTH MIDDLEWARE ===');
    console.log('Token decoded:', decoded);
    
    // Ensure we always have the user ID available
    // Support both 'id' and 'userId' for backwards compatibility
    req.user = {
      id: decoded.id || decoded.userId,
      userId: decoded.userId || decoded.id,
      email: decoded.email,
      name: decoded.name
    };
    
    console.log('req.user set to:', req.user);
    
    next();
  } catch (err) {
    console.log('Token verification failed:', err.message);
    res.status(400).json({ message: 'Invalid token' });
  }
}

module.exports = auth;