const { body } = require('express-validator');
const validateRequest = require('./validateRequest');

const createProductValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Product name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Product name must be between 2 and 100 characters'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters'),

    body('price')
        .notEmpty()
        .withMessage('Price is required')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number')
        .custom((value) => {
            // Ensure price has maximum 2 decimal places
            if (!/^\d+(\.\d{1,2})?$/.test(value.toString())) {
                throw new Error('Price can only have up to 2 decimal places');
            }
            return true;
        }),

    body('stock')
        .notEmpty()
        .withMessage('Stock is required')
        .isInt({ min: 0 })
        .withMessage('Stock must be a positive integer'),

    validateRequest
];

const updateProductValidation = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Product name must be between 2 and 100 characters'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters'),

    body('price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number')
        .custom((value) => {
            if (!/^\d+(\.\d{1,2})?$/.test(value.toString())) {
                throw new Error('Price can only have up to 2 decimal places');
            }
            return true;
        }),

    body('stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Stock must be a positive integer'),

    validateRequest
];

module.exports = {
    createProductValidation,
    updateProductValidation
}; 