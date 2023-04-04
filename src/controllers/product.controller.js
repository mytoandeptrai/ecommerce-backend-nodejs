const { SuccessResponse } = require('../core/success.response');
const ProductService = require('../services/product.service');

class ProductController {
   createProduct = async (req, res, next) => {
      const requestBody = {
         ...req.body,
         product_shop: req.user.userId,
      };
      const result = await ProductService.createProduct(
         req.body.product_type,
         requestBody
      );
      new SuccessResponse({
         message: 'Create new product successfully',
         metadata: result,
      }).send(res);
   };
}

module.exports = new ProductController();
