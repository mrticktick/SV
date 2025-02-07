const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');
const { createProductValidation, updateProductValidation } = require('../middleware/productValidation');
const authMiddleware = require('../middleware/auth.middleware');
const roleCheck = require('../middleware/roleCheck.middleware');

// Public routes
router.get('/products', ProductController.getProducts);
router.get('/products/:id', ProductController.getProductById);

// Protected routes - allow both ADMIN and USER roles
router.post('/products', 
  authMiddleware, 
  roleCheck(['ADMIN', 'USER']), // Allow both roles
  createProductValidation, 
  ProductController.createProduct
);

router.put('/products/:id', 
  authMiddleware, 
  roleCheck(['ADMIN', 'USER']), // Allow both roles
  updateProductValidation, 
  ProductController.updateProduct
);

router.delete('/products/:id', 
  authMiddleware, 
  roleCheck(['ADMIN']), // Only ADMIN can delete
  ProductController.deleteProduct
);

// Delete product
router.post('/delete-product', ProductController.deleteProduct);

// Add other routes here

module.exports = router; 