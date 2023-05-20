'use strict';

const _ = require('lodash');
const { Types } = require('mongoose');

const getInfoData = ({ fields = [], object = {} }) => {
   return _.pick(object, fields);
};

const getSelectData = (select = []) => {
   return Object.fromEntries(select.map((el) => [el, 1]));
};

const unGetSelectData = (select = []) => {
   return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefinedObject = (obj) => {
   Object.keys(obj).forEach((key) => {
      if (obj[key] === null || obj[key] === undefined) {
         delete obj[key];
      }
   });

   return obj;
};

/**
const a = {
   c: {
      d: 1,
      e: 2,
   },
};

-> collection: db.collection.updateOne({
   `c.d`: 1,
   `c.e`: 2
})

*/
const updateNestedObjectParser = (obj) => {
   const final = {};
   Object.keys(obj).forEach((k) => {
      if (typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
         const response = updateNestedObjectParser(obj[k]);
         Object.keys(response).forEach((a) => {
            final[`${k}.${a}`] = response[a];
         });
      } else {
         final[k] = obj[k];
      }
   });

   return final;
};

const convertToObjectIdMongodb = (id) => Types.ObjectId(id);

module.exports = {
   getInfoData,
   getSelectData,
   unGetSelectData,
   removeUndefinedObject,
   updateNestedObjectParser,
   convertToObjectIdMongodb,
};
