const jwt = require('jsonwebtoken');
const { User } = require('../models')
require('dotenv').config();

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    try {
      const user = await User.findByPk((decoded.id));
      if (!user || user.tokenVersion !== decoded.tokenVersion) {
        return res.status(401).json({ error: 'Token revoked' });
      }
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ error: 'Token expired' });
        }
        return res.status(401).json({ error: 'Invalid token' });
      }
      req.userId = (decoded.id);
      next();
    } catch (error) {
      console.error('Error verifying token:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}

module.exports = verifyToken;
