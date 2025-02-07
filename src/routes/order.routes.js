const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleCheck = require('../middleware/roleCheck.middleware');

// Protected routes - require authentication
router.get('/orders/my-orders', 
  authMiddleware, 
  OrderController.getUserOrders
);

router.post('/orders', 
  authMiddleware, 
  OrderController.createOrder
);

// Admin only routes
router.get('/orders', 
  authMiddleware, 
  roleCheck(['ADMIN']), 
  OrderController.getOrders
);

router.get('/orders/:id', 
  authMiddleware, 
  roleCheck(['ADMIN']), 
  OrderController.getOrderById
);

router.patch('/orders/:id/status', 
  authMiddleware, 
  roleCheck(['ADMIN']), 
  OrderController.updateOrderStatus
);

module.exports = router; 