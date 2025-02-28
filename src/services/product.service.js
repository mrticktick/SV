const _ = require('lodash');
const prisma = require('../utils/prisma');

class ProductService {
  async getProductById(id) {
    return await prisma.tb_product.findUnique({
      where: { id }
    });
  }

  async deleteProduct(id) {
    const product = await this.getProductById(id);
    if (!product) {
      return null;
    }
    return await prisma.tb_product.delete({
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
    const total = await prisma.tb_product.count({ where });

    // Get products
    const products = await prisma.tb_product.findMany({
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

  async createProduct(data) {
    // Check for existing product with same name
    const existingProduct = await prisma.tb_product.findFirst({
      where: {
        name: data.name
      }
    });

    if (existingProduct) {
      throw new Error('Product name already exists');
    }

    const price = Number(parseFloat(data.price).toFixed(2));
    
    const product = await prisma.tb_product.create({
      data: {
        name: data.name,
        description: data.description,
        price: price,
        stock: parseInt(data.stock),
        typeId: data.typeId,
      }
    });

    return product;
  }

  async updateProduct(id, data) {
    // Check if product exists
    const existingProduct = await this.getProductById(id);
    if (!existingProduct) {
      return null;
    }

    // Check for name duplication if name is being updated
    if (data.name && data.name !== existingProduct.name) {
      const duplicateName = await prisma.tb_product.findFirst({
        where: {
          name: data.name,
          NOT: {
            id: id
          }
        }
      });

      if (duplicateName) {
        throw new Error('Product name already exists');
      }
    }

    // Convert price and stock if provided
    const updateData = {
      ...data,
      ...(data.price && { price: Number(parseFloat(data.price).toFixed(2)) }),
      ...(data.stock && { stock: parseInt(data.stock) })
    };

    const product = await prisma.tb_product.update({
      where: { id },
      data: updateData
    });

    return product;
  }

  // Add other product-related methods here
}

module.exports = new ProductService(); 