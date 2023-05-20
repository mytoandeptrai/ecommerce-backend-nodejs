'use strict';

const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.service');

const HEADER = {
   API_KEY: 'x-api-key',
   AUTHORIZATION: 'authorization',
   CLIENT_ID: 'x-client-id',
   REFRESHTOKEN: 'x-rtoken-id',
};

const createTokenPair = async (payload, publicKey, privateKey) => {
   try {
      const accessToken = await JWT.sign(payload, publicKey, {
         expiresIn: '2 days',
      });

      const refreshToken = await JWT.sign(payload, privateKey, {
         expiresIn: '7 days',
      });

      /** Verify */
      JWT.verify(accessToken, publicKey, (error, decode) => {
         if (error) {
            console.error(`error verifying, ${error}`);
         } else {
            console.log(`decode verify: ${decode}`);
         }
      });

      return { accessToken, refreshToken };
   } catch (error) {}
};

const authenticationV2 = asyncHandler(async (req, res, next) => {
   /**
    * 1: Check userId missing??
    * 2: Get Access Token
    * 3: Verify Access Token
    * 4: Check User In DB
    * 5?: Check keyStore with this userId
    * 6: OK all -> return next()
    */

   /** 1 */
   const userId = req.headers[HEADER.CLIENT_ID];
   if (!userId) throw new AuthFailureError('Invalid Request');
   /** 2 */
   const keyStore = await findByUserId(userId);
   if (!keyStore) throw new NotFoundError('Not Found Key Store');

   /** 3 */
   if (req.headers[HEADER.REFRESHTOKEN]) {
      try {
         const refreshToken = req.headers[HEADER.REFRESHTOKEN];
         const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
         if (decodeUser?.userId !== userId)
            throw new AuthFailureError('Invalid User');

         req.keyStore = keyStore;
         req.user = decodeUser;
         req.refreshToken = refreshToken;
         return next();
      } catch (error) {
         throw error;
      }
   }

   const verifyAccessToken = req.headers[HEADER.AUTHORIZATION];
   if (!verifyAccessToken) throw new AuthFailureError('Invalid Request');

   /** 4 + 5 */
   try {
      const decodeUser = JWT.verify(verifyAccessToken, keyStore.publicKey);
      if (decodeUser?.userId !== userId)
         throw new AuthFailureError('Invalid User');

      req.keyStore = keyStore;
      req.user = decodeUser;
      return next();
   } catch (error) {
      throw error;
   }
});

const authentication = asyncHandler(async (req, res, next) => {
   /**
    * 1: Check userId missing??
    * 2: Get Access Token
    * 3: Verify Access Token
    * 4: Check User In DB
    * 5?: Check keyStore with this userId
    * 6: OK all -> return next()
    */

   /** 1 */
   const userId = req.headers[HEADER.CLIENT_ID];
   if (!userId) throw new AuthFailureError('Invalid Request');

   /** 2 */
   const keyStore = await findByUserId(userId);
   if (!keyStore) throw new NotFoundError('Not Found Key Store');

   /** 3 */
   const verifyAccessToken = req.headers[HEADER.AUTHORIZATION];
   if (!verifyAccessToken) throw new AuthFailureError('Invalid Request');

   /** 4 + 5 */
   try {
      const decodeUser = JWT.verify(verifyAccessToken, keyStore.publicKey);
      if (decodeUser?.userId !== userId)
         throw new AuthFailureError('Invalid User');

      req.keyStore = keyStore;
      req.user = decodeUser;
      return next();
   } catch (error) {
      throw error;
   }
});

const verifyJWT = async (token, keySecret) => {
   return await JWT.verify(token, keySecret);
};

module.exports = {
   createTokenPair,
   authentication,
   authenticationV2,
   verifyJWT,
};
