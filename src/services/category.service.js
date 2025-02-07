const prisma = require('../utils/prisma');

class CategoryService {
  async getCategories(query = {}) {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const total = await prisma.tb_category.count({ where });

    const categories = await prisma.tb_category.findMany({
      where,
      take: parseInt(limit),
      skip: parseInt(skip),
      orderBy: {
        [sortBy]: sortOrder
      },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    return {
      categories,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getCategoryById(id) {
    const category = await prisma.tb_category.findUnique({
      where: { id },
      include: {
        products: true,
        _count: {
          select: { products: true }
        }
      }
    });
    return category;
  }

  async createCategory(data) {
    // Check for existing category name
    const existingCategory = await prisma.tb_category.findFirst({
      where: {
        name: data.name
      }
    });

    if (existingCategory) {
      throw new Error('Category name already exists');
    }

    const category = await prisma.tb_category.create({
      data: {
        name: data.name,
        description: data.description,
        image: data.image
      }
    });

    return category;
  }

  async updateCategory(id, data) {
    // Check if category exists
    const existingCategory = await this.getCategoryById(id);
    if (!existingCategory) {
      return null;
    }

    // Check for name duplication if name is being updated
    if (data.name && data.name !== existingCategory.name) {
      const duplicateName = await prisma.tb_category.findFirst({
        where: {
          name: data.name,
          NOT: {
            id: id
          }
        }
      });

      if (duplicateName) {
        throw new Error('Category name already exists');
      }
    }

    const category = await prisma.tb_category.update({
      where: { id },
      data
    });

    return category;
  }

  async deleteCategory(id) {
    // Check if category has products
    const category = await prisma.tb_category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!category) {
      return null;
    }

    if (category._count.products > 0) {
      throw new Error('Cannot delete category with existing products');
    }

    return await prisma.tb_category.delete({
      where: { id }
    });
  }
}

module.exports = new CategoryService(); 