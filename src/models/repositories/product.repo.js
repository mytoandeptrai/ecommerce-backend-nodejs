'use strict';

const {
   product,
   clothing,
   electronic,
   furniture,
} = require('../../models/product.model');

const { Types } = require('mongoose');
const { getSelectData, unGetSelectData } = require('../../utils');

const queryProduct = async ({ query, limit, skip }) => {
   return await product
      .find(query)
      .populate('product_shop', 'email name -_id')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
};

const findAllDraftForShop = async ({ query, limit, skip }) => {
   return await queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
   return await queryProduct({ query, limit, skip });
};

const publishProductByShop = async ({ product_shop, product_id }) => {
   const foundShop = await product.findOne({
      product_shop: product_shop.toString(),
      _id: product_id.toString(),
   });

   if (!foundShop) {
      return null;
   }

   foundShop.isDraft = false;
   foundShop.isPublish = true;

   /** modifiedCount is told you if update success to be 1 and not success to be 0 */
   const { modifiedCount } = await foundShop.updateOne(foundShop);

   return modifiedCount;
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
   const foundShop = await product.findOne({
      product_shop: product_shop.toString(),
      _id: product_id.toString(),
   });

   if (!foundShop) {
      return null;
   }

   foundShop.isDraft = false;
   foundShop.isPublish = false;

   /** modifiedCount is told you if update success to be 1 and not success to be 0 */
   const { modifiedCount } = await foundShop.updateOne(foundShop);

   return modifiedCount;
};

const searchProductByUser = async ({ keySearch }) => {
   const regexSearch = new RegExp(keySearch);
   const result = await product
      .find(
         {
            isDraft: false,
            $text: { $search: regexSearch },
         },
         {
            score: { $meta: 'textScore' },
         }
      )
      .sort({
         score: { $meta: 'textScore' },
      })
      .lean();

   return result;
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
   const skip = (page - 1) * limit;
   const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
   const products = await product
      .find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(getSelectData(select))
      .lean();

   return products;
};

const findProduct = async ({ product_id, unSelect }) => {
   return await product
      .findById(product_id)
      .select(unGetSelectData(unSelect))
      .lean();
};

const updateProductById = async ({
   productId,
   bodyUpdate,
   model,
   isNew = true,
}) => {
   return await model.findByIdAndUpdate(productId, bodyUpdate, { new: isNew });
};

const getProductById = async (productId) => {
   return await product.findByIdAndUpdate({ _id: productId.toString() }).lean();
};

module.exports = {
   findAllDraftForShop,
   publishProductByShop,
   findAllPublishForShop,
   unPublishProductByShop,
   searchProductByUser,
   findAllProducts,
   findProduct,
   updateProductById,
   getProductById,
};
