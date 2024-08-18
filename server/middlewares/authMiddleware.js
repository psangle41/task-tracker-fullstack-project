const jwt = require('jsonwebtoken');
const ErrorCodes = require('../utils/errorCodes');
const jwt_secrete_key = require('../config/tokenConfig');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json(ErrorCodes.UNAUTHORIZED);
  }
  jwt.verify(token, jwt_secrete_key, (err, user) => {
    if (err) {
      return res.status(403).json(ErrorCodes.UNAUTHORIZED);
    }
    req.userId = user.userId;
    next();
  });
};

module.exports = authenticateToken;
