const prisma = require('../utils/prisma');
const bcrypt = require('bcrypt');

class UserService {
  async getUsers(query = {}) {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where = {};
    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const total = await prisma.tb_user.count({ where });

    const users = await prisma.tb_user.findMany({
      where,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password from response
      },
      take: parseInt(limit),
      skip: parseInt(skip),
      orderBy: {
        [sortBy]: sortOrder
      }
    });

    return {
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getUserById(id) {
    return await prisma.tb_user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }

  async createUser(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.tb_user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        role: data.role || 'USER', // Default role
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return user;
  }

  async updateUser(id, data) {
    // Check if user exists
    const existingUser = await this.getUserById(id);
    if (!existingUser) {
      return null;
    }

    // Check for email duplication if email is being updated
    if (data.email && data.email !== existingUser.email) {
      const duplicateEmail = await prisma.tb_user.findFirst({
        where: {
          email: data.email,
          NOT: {
            id: id
          }
        }
      });

      if (duplicateEmail) {
        throw new Error('Email already exists');
      }
    }

    // Hash password if it's being updated
    const updateData = { ...data };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const user = await prisma.tb_user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password from response
      }
    });

    return user;
  }

  async deleteUser(id) {
    const user = await this.getUserById(id);
    if (!user) {
      return null;
    }
    return await prisma.tb_user.delete({
      where: { id }
    });
  }
}

module.exports = new UserService(); 