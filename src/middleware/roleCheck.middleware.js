const ApiResponse = require('../utils/apiResponse');

const roleCheck = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user.role;
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json(
          ApiResponse.error('Access forbidden: Insufficient permissions', null, 403)
        );
      }
      
      next();
    } catch (error) {
      return res.status(403).json(
        ApiResponse.error('Access forbidden', error, 403)
      );
    }
  };
};

module.exports = roleCheck; 