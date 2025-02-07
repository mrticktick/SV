const prisma = require('../utils/prisma');

class OrderService {
  async getOrders(query = {}) {
    const { page = 1, limit = 10, search, status, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where = {};
    if (search) {
      where.OR = [
        { id: { contains: search } },
        { user: { username: { contains: search, mode: 'insensitive' } } }
      ];
    }
    if (status) {
      where.status = status;
    }

    const total = await prisma.tb_order.count({ where });

    const orders = await prisma.tb_order.findMany({
      where,
      take: parseInt(limit),
      skip: parseInt(skip),
      orderBy: {
        [sortBy]: sortOrder
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        },
        items: {
          include: {
            product: true
          }
        }
      }
    });

    return {
      orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getOrderById(id) {
    return await prisma.tb_order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        },
        items: {
          include: {
            product: true
          }
        }
      }
    });
  }

  async createOrder(userId, data) {
    // Calculate total amount from items
    let totalAmount = 0;
    
    // Verify products and calculate total
    for (const item of data.items) {
      const product = await prisma.tb_product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      totalAmount += product.price * item.quantity;
    }

    // Create order with items in a transaction
    const order = await prisma.$transaction(async (prisma) => {
      // Create the order
      const newOrder = await prisma.tb_order.create({
        data: {
          userId,
          status: 'PENDING',
          totalAmount,
          address: data.address,
          phone: data.phone,
          note: data.note,
          items: {
            create: data.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }))
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      // Update product stock
      for (const item of data.items) {
        await prisma.tb_product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      return newOrder;
    });

    return order;
  }

  async updateOrderStatus(id, status) {
    const order = await prisma.tb_order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // If order is cancelled, restore product stock
    if (status === 'CANCELLED') {
      await prisma.$transaction(async (prisma) => {
        for (const item of order.items) {
          await prisma.tb_product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity
              }
            }
          });
        }
      });
    }

    return order;
  }

  async getUserOrders(userId, query = {}) {
    const { page = 1, limit = 10, status } = query;
    const skip = (page - 1) * limit;

    const where = { userId };
    if (status) {
      where.status = status;
    }

    const total = await prisma.tb_order.count({ where });

    const orders = await prisma.tb_order.findMany({
      where,
      take: parseInt(limit),
      skip: parseInt(skip),
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    return {
      orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}

module.exports = new OrderService(); 