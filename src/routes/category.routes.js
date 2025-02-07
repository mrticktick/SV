const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/category.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleCheck = require('../middleware/roleCheck.middleware');

// Public routes
router.get('/categories', CategoryController.getCategories);
router.get('/categories/:id', CategoryController.getCategoryById);

// Protected routes - require admin access
router.post('/categories', 
  authMiddleware, 
  roleCheck(['ADMIN']), 
  CategoryController.createCategory
);

router.put('/categories/:id', 
  authMiddleware, 
  roleCheck(['ADMIN']), 
  CategoryController.updateCategory
);

router.delete('/categories/:id', 
  authMiddleware, 
  roleCheck(['ADMIN']), 
  CategoryController.deleteCategory
);

module.exports = router; 