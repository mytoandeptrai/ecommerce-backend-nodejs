'use strict';
const { SuccessResponse } = require('../core/success.response');
const CartService = require('../services/cart.service');

class CartController {
   /** MUTATIONS */
   addToCart = async (req, res, next) => {
      const requestBody = {
         ...req.body,
      };
      const result = await CartService.addToCart(requestBody);
      new SuccessResponse({
         message: 'Add to cart successfully',
         metadata: result,
      }).send(res);
   };

   /** update + - cart */
   update = async (req, res, next) => {
      const requestBody = {
         ...req.body,
      };
      const result = await CartService.addToCartV2(requestBody);
      new SuccessResponse({
         message: 'Update cart successfully',
         metadata: result,
      }).send(res);
   };

   delete = async (req, res, next) => {
      const requestBody = {
         ...req.body,
      };
      const result = await CartService.deleteUserCart(requestBody);
      new SuccessResponse({
         message: 'Delete cart successfully',
         metadata: result,
      }).send(res);
   };

   /** QUERIES */

   listToCart = async (req, res, next) => {
      const requestBody = {
         ...req.query,
      };
      const result = await CartService.getListUserCart(requestBody);
      new SuccessResponse({
         message: 'Get List Cart Successfully',
         metadata: result,
      }).send(res);
   };
}

module.exports = new CartController();
