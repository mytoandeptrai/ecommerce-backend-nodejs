const { SuccessResponse } = require('../core/success.response');
const ProductService = require('../services/product.service');
const ProductServiceV2 = require('../services/product.service.xxx');

class ProductController {
   /** MUTATIONS */

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

   updateProduct = async (req, res, next) => {
      const productId = req.params.productId;
      const requestBody = {
         ...req.body,
         product_shop: req.user.userId,
      };
      const result = await ProductServiceV2.updateProduct(
         req.body.product_type,
         productId,
         requestBody
      );
      new SuccessResponse({
         message: 'Update product successfully',
         metadata: result,
      }).send(res);
   };

   publishProductByShop = async (req, res, next) => {
      const requestBody = {
         product_id: req.params.id,
         product_shop: req.user.userId,
      };
      const result = await ProductServiceV2.publishProductByShop(requestBody);
      new SuccessResponse({
         message: 'Publishing product successfully',
         metadata: result,
      }).send(res);
   };

   unPublishProductByShop = async (req, res, next) => {
      const requestBody = {
         product_id: req.params.id,
         product_shop: req.user.userId,
      };
      const result = await ProductServiceV2.unPublishProductByShop(requestBody);
      new SuccessResponse({
         message: 'UnPublishing product successfully',
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

   getAllPublishForShop = async (req, res, next) => {
      const requestQuery = {
         ...req.query,
         product_shop: req.user.userId,
      };

      const result = await ProductServiceV2.findAllPublishForShop(requestQuery);
      new SuccessResponse({
         message: 'Get list public product successfully',
         metadata: result,
      }).send(res);
   };

   getListSearchProduct = async (req, res, next) => {
      const result = await ProductServiceV2.getListSearchProduct(req.params);
      new SuccessResponse({
         message: 'Get list search product successfully',
         metadata: result,
      }).send(res);
   };

   findAllProducts = async (req, res, next) => {
      const result = await ProductServiceV2.findAllProducts(req.query);
      new SuccessResponse({
         message: 'Get all products successfully',
         metadata: result,
      }).send(res);
   };

   findProduct = async (req, res, next) => {
      const product_id = req.params.product_id;
      const result = await ProductServiceV2.findProduct({ product_id });
      new SuccessResponse({
         message: 'Get all products successfully',
         metadata: result,
      }).send(res);
   };
}

module.exports = new ProductController();
