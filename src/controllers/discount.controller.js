'use strict';
const { SuccessResponse } = require('../core/success.response');
const DiscountService = require('../services/discount.service');

class DiscountController {
   /** MUTATIONS */

   createDiscountCode = async (req, res, next) => {
      const requestBody = {
         ...req.body,
         shopId: req.user.userId,
      };
      const result = await DiscountService.createDiscountCode(requestBody);
      new SuccessResponse({
         message: 'Create Code Generations',
         metadata: result,
      }).send(res);
   };

   /** QUERIES */

   getAllDiscountCodesByShop = async (req, res, next) => {
      const requestBody = {
         ...req.query,
         shopId: req.user.userId,
      };
      const result = await DiscountService.getAllDiscountCodesByShop(
         requestBody
      );
      new SuccessResponse({
         message: 'Get Discount Code Successfully',
         metadata: result,
      }).send(res);
   };

   getAllDiscountCodesWithProduct = async (req, res, next) => {
      const requestBody = {
         ...req.query,
      };
      const result = await DiscountService.getAllDiscountCodesWithProduct(
         requestBody
      );
      new SuccessResponse({
         message: 'Get Discount Code Successfully',
         metadata: result,
      }).send(res);
   };

   getDiscountAmount = async (req, res, next) => {
      const requestBody = {
         ...req.body,
      };
      const result = await DiscountService.getDiscountAmount(requestBody);
      new SuccessResponse({
         message: 'Get Discount Code Successfully',
         metadata: result,
      }).send(res);
   };
}

module.exports = new DiscountController();
