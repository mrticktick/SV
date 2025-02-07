const prisma = require('../utils/prisma');

class OrderItemService {
  async getOrderItems(orderId) {
    return await prisma.tb_orderItem.findMany({
      where: {
        orderId: orderId
      },
      include: {
        product: true,
        order: {
          select: {
            status: true,
            userId: true
          }
        }
      }
    });
  }

  async getOrderItemById(id) {
    return await prisma.tb_orderItem.findUnique({
      where: { id },
      include: {
        product: true,
        order: {
          select: {
            status: true,
            userId: true
          }
        }
      }
    });
  }

  async updateOrderItem(id, data, userId) {
    // Get the order item with order details
    const existingItem = await prisma.tb_orderItem.findUnique({
      where: { id },
      include: {
        order: true,
        product: true
      }
    });

    if (!existingItem) {
      throw new Error('Order item not found');
    }

    // Check if the order belongs to the user or user is admin
    if (existingItem.order.userId !== userId) {
      throw new Error('Unauthorized to modify this order item');
    }

    // Check if order is still in PENDING status
    if (existingItem.order.status !== 'PENDING') {
      throw new Error('Can only modify items in pending orders');
    }

    // Validate new quantity
    if (data.quantity) {
      // Check product stock
      const availableStock = existingItem.product.stock + existingItem.quantity; // Current stock + current order quantity
      if (data.quantity > availableStock) {
        throw new Error(`Insufficient stock. Available: ${availableStock}`);
      }

      // Calculate stock difference
      const stockDifference = data.quantity - existingItem.quantity;

      // Update in transaction to maintain consistency
      return await prisma.$transaction(async (prisma) => {
        // Update order item
        const updatedItem = await prisma.tb_orderItem.update({
          where: { id },
          data: {
            quantity: data.quantity,
            price: data.price || existingItem.price
          },
          include: {
            product: true
          }
        });

        // Update product stock
        await prisma.tb_product.update({
          where: { id: existingItem.productId },
          data: {
            stock: {
              decrement: stockDifference
            }
          }
        });

        // Update order total
        await prisma.tb_order.update({
          where: { id: existingItem.orderId },
          data: {
            totalAmount: {
              increment: (data.price || existingItem.price) * stockDifference
            }
          }
        });

        return updatedItem;
      });
    }

    // If only updating price
    return await prisma.tb_orderItem.update({
      where: { id },
      data: {
        price: data.price
      },
      include: {
        product: true
      }
    });
  }

  async deleteOrderItem(id, userId) {
    // Get the order item with order details
    const existingItem = await prisma.tb_orderItem.findUnique({
      where: { id },
      include: {
        order: true,
        product: true
      }
    });

    if (!existingItem) {
      throw new Error('Order item not found');
    }

    // Check if the order belongs to the user or user is admin
    if (existingItem.order.userId !== userId) {
      throw new Error('Unauthorized to delete this order item');
    }

    // Check if order is still in PENDING status
    if (existingItem.order.status !== 'PENDING') {
      throw new Error('Can only delete items from pending orders');
    }

    // Delete in transaction to maintain consistency
    return await prisma.$transaction(async (prisma) => {
      // Restore product stock
      await prisma.tb_product.update({
        where: { id: existingItem.productId },
        data: {
          stock: {
            increment: existingItem.quantity
          }
        }
      });

      // Update order total
      await prisma.tb_order.update({
        where: { id: existingItem.orderId },
        data: {
          totalAmount: {
            decrement: existingItem.price * existingItem.quantity
          }
        }
      });

      // Delete the order item
      return await prisma.tb_orderItem.delete({
        where: { id }
      });
    });
  }
}

module.exports = new OrderItemService(); 