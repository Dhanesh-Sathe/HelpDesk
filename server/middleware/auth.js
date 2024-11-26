// server/middleware/auth.js
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      console.log('No token provided');
      throw new Error('No token');
    }
    console.log('Token:', token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded);

    req.user = decoded;
    next();
  } catch (err) {
    console.error('Authentication Error:', err.message);
    res.status(401).json({ message: 'Authentication required' });
  }
};


module.exports = auth;