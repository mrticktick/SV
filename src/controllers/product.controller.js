const ProductService = require('../services/product.service');
const ApiResponse = require('../utils/apiResponse');

class ProductController {
  async getProductById(req, res) {
    try {
      const productId = req.params.id;
      const product = await ProductService.getProductById(productId);

      if (!product) {
        return res.status(404).json(
          ApiResponse.error("Product not found", null, 404)
        );
      }

      return res.status(200).json(
        ApiResponse.success(product)
      );

    } catch (error) {
      return res.status(500).json(
        ApiResponse.error("Error fetching product", error)
      );
    }
  }

  async deleteProduct(req, res) {
    try {
      const productId = req.body.productId;
      const deletedProduct = await ProductService.deleteProduct(productId);

      if (!deletedProduct) {
        return res.status(404).json(
          ApiResponse.error("Product not found", null, 404)
        );
      }

      return res.status(200).json(
        ApiResponse.success(null, "Product deleted successfully")
      );

    } catch (error) {
      return res.status(500).json(
        ApiResponse.error("Error deleting product", error)
      );
    }
  }

  async getProducts(req, res) {
    try {
      const result = await ProductService.getProducts(req.query);
      
      return res.status(200).json(
        ApiResponse.success(result)
      );
    } catch (error) {
      return res.status(500).json(
        ApiResponse.error("Error fetching products", error)
      );
    }
  }
}

module.exports = new ProductController(); 