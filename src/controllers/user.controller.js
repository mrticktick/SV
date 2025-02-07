const UserService = require('../services/user.service');
const ApiResponse = require('../utils/apiResponse');

class UserController {
  async getUsers(req, res) {
    try {
      const result = await UserService.getUsers(req.query);
      return res.status(200).json(
        ApiResponse.success(result)
      );
    } catch (error) {
      return res.status(500).json(
        ApiResponse.error("Error fetching users", error)
      );
    }
  }

  async getUserById(req, res) {
    try {
      const userId = req.params.id;
      const user = await UserService.getUserById(userId);

      if (!user) {
        return res.status(404).json(
          ApiResponse.error("User not found", null, 404)
        );
      }

      return res.status(200).json(
        ApiResponse.success(user)
      );
    } catch (error) {
      return res.status(500).json(
        ApiResponse.error("Error fetching user", error)
      );
    }
  }

  async createUser(req, res) {
    try {
      const result = await UserService.createUser(req.body);
      
      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', result.refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        // secure: true, // uncomment in production with HTTPS
      });

      return res.status(201).json(
        ApiResponse.success({
          user: result.user,
          accessToken: result.accessToken
        }, "User created successfully")
      );

    } catch (error) {
      if (error.message === 'Email already exists') {
        return res.status(409).json(
          ApiResponse.error("Email already exists", null, 409)
        );
      }
      return res.status(500).json(
        ApiResponse.error("Error creating user", error)
      );
    }
  }

  async updateUser(req, res) {
    try {
      const userId = req.params.id;
      const updateData = req.body;

      const user = await UserService.updateUser(userId, updateData);

      if (!user) {
        return res.status(404).json(
          ApiResponse.error("User not found", null, 404)
        );
      }

      return res.status(200).json(
        ApiResponse.success(user, "User updated successfully")
      );
    } catch (error) {
      if (error.code === 'P2002') {
        return res.status(400).json(
          ApiResponse.error("Email or username already exists", null, 400)
        );
      }
      return res.status(500).json(
        ApiResponse.error("Error updating user", error)
      );
    }
  }

  async deleteUser(req, res) {
    try {
      const userId = req.params.id;
      const user = await UserService.deleteUser(userId);

      if (!user) {
        return res.status(404).json(
          ApiResponse.error("User not found", null, 404)
        );
      }

      return res.status(200).json(
        ApiResponse.success(null, "User deleted successfully")
      );
    } catch (error) {
      return res.status(500).json(
        ApiResponse.error("Error deleting user", error)
      );
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json(
          ApiResponse.error("Email and password are required", null, 400)
        );
      }

      const result = await UserService.login(email, password);

      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', result.refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        // secure: true, // uncomment in production with HTTPS
      });

      return res.status(200).json(
        ApiResponse.success({
          user: result.user,
          accessToken: result.accessToken
        }, "Login successful")
      );

    } catch (error) {
      if (error.message === 'User not found' || error.message === 'Invalid password') {
        return res.status(401).json(
          ApiResponse.error("Invalid email or password", null, 401)
        );
      }

      return res.status(500).json(
        ApiResponse.error("Login failed", error)
      );
    }
  }

  async logout(req, res) {
    try {
      const { refreshToken } = req.cookies;
      
      await UserService.logout(refreshToken);

      // Clear refresh token cookie
      res.clearCookie('refreshToken');

      return res.status(200).json(
        ApiResponse.success(null, "Logout successful")
      );

    } catch (error) {
      return res.status(500).json(
        ApiResponse.error("Logout failed", error)
      );
    }
  }
}

module.exports = new UserController(); 