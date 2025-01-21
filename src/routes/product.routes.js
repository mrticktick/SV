const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');

// Get product by ID
router.get('/product/:id', ProductController.getProductById);

// Delete product
router.post('/delete-product', ProductController.deleteProduct);

// Get product list
router.get('/products', ProductController.getProducts);

// Add other routes here

module.exports = router; 