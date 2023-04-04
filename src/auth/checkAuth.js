'use strict';

const { findById } = require('../services/apiKey.service');

const HEADER = {
   API_KEY: 'x-api-key',
   AUTHORIZATION: 'authorization',
};

const apiKey = async (req, res, next) => {
   try {
      const key = await req.headers[HEADER.API_KEY]?.toString();

      if (!key) {
         return res.status(403).json({
            message: 'Forbidden Error',
         });
      }

      // check Key in database
      const objKey = await findById(key);

      if (!objKey) {
         return res.status(403).json({
            message: 'Forbidden Error',
         });
      }

      req.objKey = objKey;
      return next();
   } catch (error) {}
};

const checkPermission = (permission) => {
   return (req, res, next) => {
      /** detect permission in request */
      if (!req?.objKey?.permissions) {
         return res.status(403).json({
            message: 'Permission Deny',
         });
      }

      /** detect required permission */
      const validPermissions = req.objKey?.permissions?.includes(permission);
      if (!validPermissions) {
         return res.status(403).json({
            message: 'Permission Deny',
         });
      }

      return next();
   };
};

const asyncHandler = (fn) => (req, res, next) =>
   Promise.resolve(fn(req, res, next)).catch((error) => {
      console.log('🚀 ~ file: checkAuth.js:57 ~ error:', error);
      next(error);
   });

module.exports = {
   apiKey,
   checkPermission,
   asyncHandler,
};
