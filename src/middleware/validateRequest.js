const { validationResult } = require('express-validator');
const ApiResponse = require('../utils/apiResponse');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(
      ApiResponse.error(
        'Validation error',
        errors.array().map(err => err.msg),
        400
      )
    );
  }
  next();
};

module.exports = validateRequest; 