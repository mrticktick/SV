const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');
const { createProductValidation, updateProductValidation } = require('../middleware/productValidation');

// Get product by ID
router.get('/product/:id', ProductController.getProductById);

// Delete product
router.post('/delete-product', ProductController.deleteProduct);

// Get product list
router.get('/products', ProductController.getProducts);

// Create new product with validation
router.post('/products', createProductValidation, ProductController.createProduct);

// Update product
router.put('/products/:id', updateProductValidation, ProductController.updateProduct);

// Add other routes here

module.exports = router; 