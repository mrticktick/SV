const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ProductService {
  async getProductById(id) {
    return await prisma.product.findUnique({
      where: { id }
    });
  }

  async deleteProduct(id) {
    const product = await this.getProductById(id);
    if (!product) {
      return null;
    }
    return await prisma.product.delete({
      where: { id }
    });
  }

  async getProducts(query = {}) {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get total count for pagination
    const total = await prisma.product.count({ where });

    // Get products
    const products = await prisma.product.findMany({
      where,
      take: parseInt(limit),
      skip: parseInt(skip),
      orderBy: {
        [sortBy]: sortOrder
      }
    });

    return {
      products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Add other product-related methods here
}

module.exports = new ProductService(); 