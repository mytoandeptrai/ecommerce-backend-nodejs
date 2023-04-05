const { SuccessResponse } = require('../core/success.response');
const ProductService = require('../services/product.service');
const ProductServiceV2 = require('../services/product.service.xxx');

class ProductController {
   /** MUTATION */
   createProduct = async (req, res, next) => {
      const requestBody = {
         ...req.body,
         product_shop: req.user.userId,
      };
      /**
       * ProductService with Factory Pattern
         const result = await ProductService.createProduct(
            req.body.product_type,
            requestBody
         );
       */
      /** ProductService with Factory + Strategy pattern */
      const result = await ProductServiceV2.createProduct(
         req.body.product_type,
         requestBody
      );
      new SuccessResponse({
         message: 'Create new product successfully',
         metadata: result,
      }).send(res);
   };

   /** QUERIES */
   getAllDraftForShop = async (req, res, next) => {
      const requestQuery = {
         ...req.query,
         product_shop: req.user.userId,
      };

      const result = await ProductServiceV2.findAllDraftForShop(requestQuery);
      new SuccessResponse({
         message: 'Get list draft product successfully',
         metadata: result,
      }).send(res);
   };
}

module.exports = new ProductController();
