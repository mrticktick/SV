const express = require('express');
const router = express.Router();
const OrderItemController = require('../controllers/orderItem.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleCheck = require('../middleware/roleCheck.middleware');

// Get items for a specific order
router.get('/orders/:orderId/items', 
  authMiddleware, 
  OrderItemController.getOrderItems
);

// Get specific item
router.get('/order-items/:id', 
  authMiddleware, 
  OrderItemController.getOrderItemById
);

// Update item
router.put('/order-items/:id', 
  authMiddleware, 
  OrderItemController.updateOrderItem
);

// Delete item
router.delete('/order-items/:id', 
  authMiddleware, 
  OrderItemController.deleteOrderItem
);

module.exports = router; 