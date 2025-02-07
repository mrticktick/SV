const jwt = require('jsonwebtoken');
const ApiResponse = require('../utils/apiResponse');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(
        ApiResponse.error('Access token is required', null, 401)
      );
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = decoded;
    
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json(
        ApiResponse.error('Token has expired', null, 401)
      );
    }
    
    return res.status(401).json(
      ApiResponse.error('Invalid token', null, 401)
    );
  }
};

module.exports = authMiddleware; 