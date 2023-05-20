'use strict';
const {
   BadRequestError,
   ErrorResponse,
   AuthFailureError,
   ForbiddenError,
   NotFoundError,
} = require('../core/error.response');
const discountModel = require('../models/discount.model');
const { product } = require('../models/product.model');
const {
   findAllDiscountCodeUnSelect,
   checkDiscountExists,
} = require('../models/repositories/discount.repo');
const { findAllProducts } = require('../models/repositories/product.repo');
const { convertToObjectIdMongodb } = require('../utils');

/**
 * Discount services
 * 1 - Generate discount code [Shop ( only for products of shop ) | Admin ( for all products )]
 * 2 - Get discount amount [User]
 * 3 - Get all discount codes [User | Shop]
 * 4 - Verify discount code [User]
 * 5 - Delete discount code [Shop | Admin]
 * 6 - Cancel discount code [User]
 */

class DiscountService {
   /** MUTATIONS */
   static async createDiscountCode(payload) {
      const {
         code,
         start_date,
         end_date,
         is_active,
         shopId,
         min_order_value,
         product_ids,
         applies_to,
         name,
         description,
         type,
         value,
         max_value,
         max_uses,
         uses_count,
         max_uses_per_user,
         users_used,
      } = payload;

      if (new Date(start_date) >= new Date(end_date)) {
         throw new BadRequestError('Start date must be before end_date!');
      }

      /** create index for discount code */
      const foundDiscount = await discountModel
         .findOne({
            discount_code: code,
            discount_shopId: shopId.toString(),
         })
         .lean();

      if (foundDiscount && foundDiscount.discount_is_active) {
         throw new BadRequestError('Discount exists !');
      }

      const newDiscount = await discountModel.create({
         discount_name: name,
         discount_description: description,
         discount_type: type,
         discount_code: code,
         discount_value: value,
         discount_min_order_value: min_order_value || 0,
         discount_max_value: max_value,
         discount_start_date: new Date(start_date),
         discount_end_date: new Date(end_date),
         discount_max_uses: max_uses,
         discount_uses_count: uses_count,
         discount_users_used: users_used,
         discount_shopId: shopId,
         discount_max_uses_per_user: max_uses_per_user,
         discount_is_active: is_active,
         discount_applies_to: applies_to,
         discount_product_ids: applies_to === 'all' ? [] : product_ids,
      });

      return newDiscount;
   }

   static async updateDiscountCode(discountId, bodyUpdate) {}

   static async deleteDiscountCode({ shopId, codeId }) {
      const deleted = await discountModel.findOneAndDelete({
         discount_code: codeId,
         discount_shopId: shopId.toString(),
      });

      return deleted;
   }

   static async cancelDiscountCode({ codeId, shopId, userId }) {
      const foundDiscount = await checkDiscountExists({
         model: discountModel,
         filter: {
            discount_code: codeId,
            discount_shopId: shopId.toString(),
         },
      });

      if (!foundDiscount) {
         throw new NotFoundError('Discount does not exist!');
      }

      const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
         $pull: {
            discount_users_used: userId,
         },
         $inc: {
            discount_max_uses: 1,
            discount_uses_count: -1,
         },
      });

      return result;
   }

   /** QUERIES */

   /** get all discount codes available with products */
   static async getAllDiscountCodesWithProduct({
      code,
      shopId,
      userId,
      limit,
      page,
   }) {
      /** create index for discount code */
      const foundDiscount = await discountModel
         .findOne({
            discount_code: code.toString(),
            discount_shopId: shopId.toString(),
         })
         .lean();

      if (!foundDiscount && !foundDiscount.discount_is_active) {
         throw new NotFoundError('Discount does not exist!');
      }

      const { discount_applies_to, discount_product_ids } = foundDiscount;

      let products;
      if (discount_applies_to === 'all') {
         /** get all products */
         products = await findAllProducts({
            filter: {
               product_shop: shopId.toString(),
               isPublish: true,
            },
            limit: +limit,
            page: +page,
            sort: 'ctime',
            select: ['product_name'],
         });
      }

      if (discount_applies_to === 'specific') {
         /** get the products by ids */
         products = await findAllProducts({
            filter: {
               _id: {
                  $in: discount_product_ids,
               },
               isPublish: true,
            },
            limit: +limit,
            page: +page,
            sort: 'ctime',
            select: ['product_name'],
         });
      }

      return products;
   }

   /** get all discount code of shop */
   static async getAllDiscountCodesByShop(payload) {
      const { limit, page, shopId } = payload;
      const discounts = await findAllDiscountCodeUnSelect({
         limit: +limit,
         page: +page,
         filter: {
            discount_shopId: shopId.toString(),
            discount_is_active: true,
         },
         unSelect: ['__v', 'discount_shopId'],
         model: discountModel,
      });

      return discounts;
   }

   /** apply discount code
    *  products = [{productId, shopId, quantity, name, price}, {productId, shopId, quantity, name, price}]
    */
   static async getDiscountAmount({ codeId, userId, shopId, products }) {
      const foundDiscount = await checkDiscountExists({
         model: discountModel,
         filter: {
            discount_code: codeId,
            discount_shopId: shopId.toString(),
         },
      });

      if (!foundDiscount) {
         throw new NotFoundError('Discount does not exist!');
      }

      const {
         discount_is_active,
         discount_max_uses,
         discount_start_date,
         discount_end_date,
         discount_min_order_value,
         discount_users_used,
         discount_type,
         discount_max_uses_per_user,
         discount_value
      } = foundDiscount;

      if (!discount_is_active) {
         throw new NotFoundError('Discount expired!');
      }

      if (!discount_max_uses) {
         throw new NotFoundError('Discount are out!');
      }

      // if (
      //    new Date() < new Date(discount_start_date) ||
      //    new Date() > new Date(discount_end_date)
      // ) {
      //    throw new NotFoundError('Discount code has been expired!');
      // }

      let totalOrder = 0;
      /** check xem co gia tri toi thieu hay khong */
      if (discount_min_order_value > 0) {
         /** get total */
         totalOrder = products.reduce((acc, product) => {
            return acc + (product.quantity * product.price);
         }, 0);

         if (totalOrder < discount_min_order_value) {
            throw new NotFoundError(
               `Discount requires a minimum order value of ${discount_min_order_value}!`
            );
         }
      }

      if (discount_max_uses_per_user > 0) {
         const userUseDiscount = discount_users_used.includes(userId);

         if (userUseDiscount) {
            throw new ForbiddenError('You used this discount code before');
         }
      }

      /** check discount la fixed_amount hay percentage */
      const amount =
         discount_type === 'fixed_amount'
            ? discount_value
            : totalOrder * (discount_value / 100);

      return {
         totalOrder,
         discount: amount,
         totalPrice: totalOrder - amount,
      };
   }
}

module.exports = DiscountService;
