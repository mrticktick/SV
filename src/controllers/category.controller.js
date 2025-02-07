const CategoryService = require('../services/category.service');
const ApiResponse = require('../utils/apiResponse');

class CategoryController {
  async getCategories(req, res) {
    try {
      const result = await CategoryService.getCategories(req.query);
      return res.status(200).json(
        ApiResponse.success(result)
      );
    } catch (error) {
      return res.status(500).json(
        ApiResponse.error("Error fetching categories", error)
      );
    }
  }

  async getCategoryById(req, res) {
    try {
      const categoryId = req.params.id;
      const category = await CategoryService.getCategoryById(categoryId);

      if (!category) {
        return res.status(404).json(
          ApiResponse.error("Category not found", null, 404)
        );
      }

      return res.status(200).json(
        ApiResponse.success(category)
      );
    } catch (error) {
      return res.status(500).json(
        ApiResponse.error("Error fetching category", error)
      );
    }
  }

  async createCategory(req, res) {
    try {
      const category = await CategoryService.createCategory(req.body);
      return res.status(201).json(
        ApiResponse.success(category, "Category created successfully")
      );
    } catch (error) {
      if (error.message === 'Category name already exists') {
        return res.status(409).json(
          ApiResponse.error("Category name already exists", null, 409)
        );
      }
      return res.status(500).json(
        ApiResponse.error("Error creating category", error)
      );
    }
  }

  async updateCategory(req, res) {
    try {
      const categoryId = req.params.id;
      const category = await CategoryService.updateCategory(categoryId, req.body);

      if (!category) {
        return res.status(404).json(
          ApiResponse.error("Category not found", null, 404)
        );
      }

      return res.status(200).json(
        ApiResponse.success(category, "Category updated successfully")
      );
    } catch (error) {
      if (error.message === 'Category name already exists') {
        return res.status(409).json(
          ApiResponse.error("Category name already exists", null, 409)
        );
      }
      return res.status(500).json(
        ApiResponse.error("Error updating category", error)
      );
    }
  }

  async deleteCategory(req, res) {
    try {
      const categoryId = req.params.id;
      const category = await CategoryService.deleteCategory(categoryId);

      if (!category) {
        return res.status(404).json(
          ApiResponse.error("Category not found", null, 404)
        );
      }

      return res.status(200).json(
        ApiResponse.success(null, "Category deleted successfully")
      );
    } catch (error) {
      if (error.message === 'Cannot delete category with existing products') {
        return res.status(400).json(
          ApiResponse.error("Cannot delete category with existing products", null, 400)
        );
      }
      return res.status(500).json(
        ApiResponse.error("Error deleting category", error)
      );
    }
  }
}

module.exports = new CategoryController(); 