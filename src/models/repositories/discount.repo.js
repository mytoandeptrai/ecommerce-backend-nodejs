'use strict';

const { discount } = require('../../models/discount.model');
const { unGetSelectData, getSelectData } = require('../../utils');

const findAllDiscountCodeUnSelect = async ({
   limit = 50,
   sort = 'ctime',
   page = 1,
   filter,
   unSelect,
   model,
}) => {
   const skip = (page - 1) * limit;
   const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
   const results = await model
      .find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(unGetSelectData(unSelect))
      .lean();

   return results;
};

const findAllDiscountCodeSelect = async ({
   limit = 50,
   sort = 'ctime',
   page = 1,
   filter,
   select,
   model,
}) => {
   const skip = (page - 1) * limit;
   const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
   const results = await model
      .find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(getSelectData(select))
      .lean();

   return results;
};

const checkDiscountExists = async ({ model, filter }) => {
   const foundDiscount = await model.findOne(filter).lean();
   return foundDiscount;
};

module.exports = {
   findAllDiscountCodeUnSelect,
   findAllDiscountCodeSelect,
   checkDiscountExists,
};
