const OrderItemService = require('../services/orderItem.service');
const ApiResponse = require('../utils/apiResponse');

class OrderItemController {
  async getOrderItems(req, res) {
    try {
      const { orderId } = req.params;
      const items = await OrderItemService.getOrderItems(orderId);
      
      return res.status(200).json(
        ApiResponse.success(items)
      );
    } catch (error) {
      return res.status(500).json(
        ApiResponse.error("Error fetching order items", error)
      );
    }
  }

  async getOrderItemById(req, res) {
    try {
      const { id } = req.params;
      const item = await OrderItemService.getOrderItemById(id);

      if (!item) {
        return res.status(404).json(
          ApiResponse.error("Order item not found", null, 404)
        );
      }

      return res.status(200).json(
        ApiResponse.success(item)
      );
    } catch (error) {
      return res.status(500).json(
        ApiResponse.error("Error fetching order item", error)
      );
    }
  }

  async updateOrderItem(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      const item = await OrderItemService.updateOrderItem(id, req.body, userId);

      return res.status(200).json(
        ApiResponse.success(item, "Order item updated successfully")
      );
    } catch (error) {
      if (error.message.includes('Unauthorized') || 
          error.message.includes('Can only modify')) {
        return res.status(403).json(
          ApiResponse.error(error.message, null, 403)
        );
      }
      if (error.message.includes('Insufficient stock')) {
        return res.status(400).json(
          ApiResponse.error(error.message, null, 400)
        );
      }
      return res.status(500).json(
        ApiResponse.error("Error updating order item", error)
      );
    }
  }

  async deleteOrderItem(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      await OrderItemService.deleteOrderItem(id, userId);

      return res.status(200).json(
        ApiResponse.success(null, "Order item deleted successfully")
      );
    } catch (error) {
      if (error.message.includes('Unauthorized') || 
          error.message.includes('Can only delete')) {
        return res.status(403).json(
          ApiResponse.error(error.message, null, 403)
        );
      }
      return res.status(500).json(
        ApiResponse.error("Error deleting order item", error)
      );
    }
  }
}

module.exports = new OrderItemController(); 