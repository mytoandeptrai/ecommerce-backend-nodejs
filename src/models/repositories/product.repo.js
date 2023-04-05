'use strict';

const {
   product,
   clothing,
   electronic,
   furniture,
} = require('../../models/product.model');

const findAllDraftForShop = async ({ query, limit, skip }) => {
   return await product
      .find(query)
      .populate('product_shop', 'email name -_id')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
};

module.exports = {
   findAllDraftForShop,
};
