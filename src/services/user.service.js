const prisma = require('../utils/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

  generateTokens(userId, role) {
    const accessToken = jwt.sign(
      { 
        userId,
        role
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { 
        userId,
        role
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    return {
      accessToken,
      refreshToken
    };
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await prisma.tb_token.findFirst({
      where: { userId }
    });

    if (tokenData) {
      return await prisma.tb_token.update({
        where: { id: tokenData.id },
        data: { token: refreshToken }
      });
    }

    return await prisma.tb_token.create({
      data: {
        userId,
        token: refreshToken
      }
    });
  }

  async createUser(data) {
    // Check for existing email
    const existingUser = await prisma.tb_user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await prisma.tb_user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        role: data.role || 'USER'
      }
    });

    // Pass role to generateTokens
    const tokens = this.generateTokens(user.id, user.role);
    
    // Save refresh token
    await this.saveToken(user.id, tokens.refreshToken);

    // Return user data and tokens
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      ...tokens
    };
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

  async login(email, password) {
    const user = await prisma.tb_user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Pass role to generateTokens
    const tokens = this.generateTokens(user.id, user.role);
    
    await this.saveToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      ...tokens
    };
  }

  async logout(refreshToken) {
    if (!refreshToken) {
      throw new Error('Refresh token required');
    }

    // Remove refresh token from database
    const token = await prisma.tb_token.deleteMany({
      where: {
        token: refreshToken
      }
    });

    return token;
  }
}

module.exports = new UserService(); 