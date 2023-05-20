'use strict';
const { NotFoundError } = require('../core/error.response');
const { getProductById } = require('../models/repositories/product.repo');
const { cart } = require('../models/cart.model');

/**
 * Cart services
 * 1 - Add product to cart [User]
 * 2 - Reduce product quantity [User]
 * 3 - Increase product quantity [User]
 * 4 - Get list to cart [User]
 * 5 - Delete cart [User]
 * 6 - Cancel cart item [User]
 */

class CartService {
   static async createUserCart({ userId, product }) {
      const query = { cart_userId: userId, cart_state: 'active' };
      const updateOrInsert = {
         $addToSet: {
            cart_products: product,
         },
      };
      const options = {
         upsert: true,
         new: true,
      };

      return await cart.findOneAndUpdate(query, updateOrInsert, options);
   }

   static async updateUserCartQuantity({ userId, product }) {
      const { productId, quantity } = product;
      /** check product Id has exited in array mongo db */
      const query = {
         cart_userId: userId,
         cart_state: 'active',
         'cart_products.productId': productId ,
      };
      
      /** update correctly the founded product quantity */
      const updateSet = {
         $inc: {
            'cart_products.$.quantity': quantity ,
         },
      };

      const options = {
         upsert: true,
         new: true,
      };

      return await cart.findOneAndUpdate(query, updateSet, options);
   }

   static async addToCart({ userId, product = {} }) {
      /** check cart exist */
      const userCart = await cart.findOne({ cart_userId: userId });
      if (!userCart) {
         return await CartService.createUserCart({ userId, product });
      }

      /** check if cart empty ([]) */
      if (!userCart.cart_products.length) {
         userCart.cart_products = [product];
         return await userCart.save();
      }

      /** check if cart item has existed -> update cart item */
      return await CartService.updateUserCartQuantity({ userId, product });
   }

   /** update cart functionality */
   /*
   shop_order_ids: [
    {
        shopId,
        item_products: [
            {
                quantity, price, shopId, old_quantity, productId
            }
        ]
    }
   ]
   */

   static async addToCartV2({ userId, shop_order_ids }) {
      const { productId, quantity, old_quantity } =
         shop_order_ids[0]?.item_products[0];
      /** check exist product */
      const foundProduct = await getProductById(productId);
      if (!foundProduct) {
         throw new NotFoundError('Product not existed');
      }

      /** check foundProduct with product_shop === shop order Id is not */
      if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
         throw new NotFoundError('Product does not belong to the shop');
      }

      if (quantity === 0) {
         // deleted this cart
      }

      return await CartService.updateUserCartQuantity({
         userId,
         product: {
            productId,
            quantity: quantity - old_quantity,
         },
      });
   }

   static async deleteUserCart({ userId, productId }) {
      const query = { cart_userId: userId, cart_state: 'active' };
      const updateSet = {
         $pull: {
            cart_products: {
               productId,
            },
         },
      };

      const deletedCart = await cart.updateOne(query, updateSet);

      return deletedCart;
   }

   static async getListUserCart({ userId }) {
      return await cart.findOne({ cart_userId: +userId }).lean();
   }
}

module.exports = CartService;
