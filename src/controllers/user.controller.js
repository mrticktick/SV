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
      const user = await UserService.createUser(req.body);
      return res.status(201).json(
        ApiResponse.success(user, "User created successfully")
      );
    } catch (error) {
      if (error.code === 'P2002') {
        return res.status(400).json(
          ApiResponse.error("Email or username already exists", null, 400)
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
}

module.exports = new UserController(); 