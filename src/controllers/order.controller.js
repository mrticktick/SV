const OrderService = require('../services/order.service');
const ApiResponse = require('../utils/apiResponse');

class OrderController {
  async getOrders(req, res) {
    try {
      const result = await OrderService.getOrders(req.query);
      return res.status(200).json(
        ApiResponse.success(result)
      );
    } catch (error) {
      return res.status(500).json(
        ApiResponse.error("Error fetching orders", error)
      );
    }
  }

  async getOrderById(req, res) {
    try {
      const orderId = req.params.id;
      const order = await OrderService.getOrderById(orderId);

      if (!order) {
        return res.status(404).json(
          ApiResponse.error("Order not found", null, 404)
        );
      }

      return res.status(200).json(
        ApiResponse.success(order)
      );
    } catch (error) {
      return res.status(500).json(
        ApiResponse.error("Error fetching order", error)
      );
    }
  }

  async createOrder(req, res) {
    try {
      const userId = req.user.userId; // From auth middleware
      const order = await OrderService.createOrder(userId, req.body);
      
      return res.status(201).json(
        ApiResponse.success(order, "Order created successfully")
      );
    } catch (error) {
      if (error.message.includes('Product not found') || 
          error.message.includes('Insufficient stock')) {
        return res.status(400).json(
          ApiResponse.error(error.message, null, 400)
        );
      }
      return res.status(500).json(
        ApiResponse.error("Error creating order", error)
      );
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const order = await OrderService.updateOrderStatus(id, status);

      return res.status(200).json(
        ApiResponse.success(order, "Order status updated successfully")
      );
    } catch (error) {
      return res.status(500).json(
        ApiResponse.error("Error updating order status", error)
      );
    }
  }

  async getUserOrders(req, res) {
    try {
      const userId = req.user.userId; // From auth middleware
      const result = await OrderService.getUserOrders(userId, req.query);
      
      return res.status(200).json(
        ApiResponse.success(result)
      );
    } catch (error) {
      return res.status(500).json(
        ApiResponse.error("Error fetching user orders", error)
      );
    }
  }
}

module.exports = new OrderController(); 