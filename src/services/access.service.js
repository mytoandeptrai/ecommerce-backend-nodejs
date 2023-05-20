'use strict';
const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair, verifyJWT } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const {
   BadRequestError,
   ErrorResponse,
   AuthFailureError,
   ForbiddenError,
} = require('../core/error.response');
const { findByEmail } = require('./shop.service');

const RolesShop = {
   SHOP: 'SHOP',
   WRITER: 'WRITER',
   EDITOR: 'EDITOR',
   ADMIN: 'ADMIN',
};

class AccessService {
   static signUp = async ({ name, email, password }) => {
      try {
         /** check existed email */

         const existedShop = await shopModel.findOne({ email }).lean();
         if (existedShop) {
            throw new BadRequestError('Error: Shop already exists');
         }

         const hashPassword = await bcrypt.hash(password, 10);

         const newShop = await shopModel.create({
            name,
            email,
            password: hashPassword,
            roles: [RolesShop.SHOP],
         });

         if (newShop) {
            /** Create privateKey, publicKey with algorithms crypto
             * privateKey: sign token to give for user ( not save in db)
             * publicKey: verify token ( save in db )
             */

            // const { privateKey, publicKey } = crypto.generateKeyPairSync(
            //    'rsa',
            //    {
            //       modulusLength: 4096,
            //       publicKeyEncoding: {
            //          type: 'pkcs1',
            //          format: 'pem',
            //       },
            //       privateKeyEncoding: {
            //          type: 'pkcs1',
            //          format: 'pem',
            //       },
            //    }
            // );

            // create privateKey with standards way
            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');

            const { _id: userId } = newShop;

            // const keyStore = await KeyTokenService.createKeyToken({
            //    userId,
            //    publicKey,
            //    privateKey,
            // });

            // if (!keyStore) {
            //    return {
            //       code: 'xxxx',
            //       message: 'keyStore error',
            //    };
            // }

            /** Create token pair */
            const tokens = await createTokenPair(
               { userId, email },
               publicKey,
               privateKey
            );

            return {
               code: 201,
               metadata: {
                  shop: getInfoData({
                     fields: ['_id', 'name', 'email'],
                     object: newShop,
                  }),
                  tokens,
               },
            };
         }

         return {
            code: 200,
            metadata: null,
         };
      } catch (error) {
         return {
            code: '',
            message: error.message,
            status: 'error',
         };
      }
   };

   /**
    * 1: Check Email
    * 2: Match Password
    * 3: Create Access Token And Refresh Token and Save In Db
    * 4: Generate tokens
    * 5: Get Data then return login
    */
   static login = async ({ email, password, refreshToken = null }) => {
      /** 1 */
      const foundShop = await findByEmail({ email });

      if (!foundShop) {
         throw new BadRequestError('Shop not registered!');
      }

      /** 2 */
      const match = bcrypt.compare(password, foundShop.password);
      if (!match) throw new AuthFailureError('Authentication failed');

      /** 3 */
      const privateKey = crypto.randomBytes(64).toString('hex');
      const publicKey = crypto.randomBytes(64).toString('hex');
      const { _id: userId } = foundShop;

      /** 4 */
      const tokens = await createTokenPair(
         { userId, email },
         publicKey,
         privateKey
      );

      await KeyTokenService.createKeyToken({
         userId,
         publicKey,
         privateKey,
         refreshToken: tokens.refreshToken,
      });

      return {
         shop: getInfoData({
            fields: ['_id', 'name', 'email'],
            object: foundShop,
         }),
         tokens,
      };
   };

   static logout = async ({ keyStore }) => {
      const delKey = await KeyTokenService.removeKeyById(keyStore._id);
      return delKey;
   };

   /**
    * Check token used
    * Usage: use when accessToken expired and we need to use refreshToken to get a new accessToken
    */
   static handlerRefreshToken = async (refreshToken) => {
      /** detect if token is already used */
      const foundToken = await KeyTokenService.findByRefreshTokenUsed(
         refreshToken
      );

      /** if yes */
      if (foundToken) {
         /** decode to watch this token is existed */
         const { userId, email } = await verifyJWT(
            refreshToken,
            foundToken.privateKey
         );

         /** simple way: delete all token in keystore */
         await KeyTokenService.deleteKeyById(userId);
         throw new ForbiddenError(
            'Something went wrong happened !! please re-login'
         );
      }

      /** if no */
      const holderToken = await KeyTokenService.findByRefreshToken(
         refreshToken
      );

      if (!holderToken) throw new AuthFailureError('Shop is not registered!');

      /** verify token */
      const { userId, email } = await verifyJWT(
         refreshToken,
         holderToken.privateKey
      );

      /** check userId */
      const foundShop = await findByEmail({ email });
      if (!foundShop) throw new AuthFailureError('Shop is not registered 2!');

      /** Create double tokens */
      const tokens = await createTokenPair(
         { userId, email },
         holderToken.publicKey,
         holderToken.privateKey
      );

      /** Update token */
      await holderToken.updateOne({
         $set: {
            refreshToken: tokens.refreshToken,
         },
         $addToSet: {
            refreshTokensUsed:
               refreshToken /** update previous refreshToken to refreshTokensUsed */,
         },
      });
      return {
         user: { userId, email },
         tokens,
      };
   };

   static handlerRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {
      const { userId, email } = user;

      if (keyStore.refreshTokensUsed.includes(refreshToken)) {
         /** simple way: delete all token in keystore */
         await KeyTokenService.deleteKeyById(userId);
         throw new ForbiddenError(
            'Something went wrong happened !! please re-login'
         );
      }

      if (keyStore.refreshToken !== refreshToken)
         throw new AuthFailureError('Shop is not registered!');

      /** check userId */
      const foundShop = await findByEmail({ email });
      if (!foundShop) throw new AuthFailureError('Shop is not registered 2!');

      /** Create double tokens */
      const tokens = await createTokenPair(
         { userId, email },
         keyStore.publicKey,
         keyStore.privateKey
      );

      /** Update token */
      await keyStore.updateOne({
         $set: {
            refreshToken: tokens.refreshToken,
         },
         $addToSet: {
            refreshTokensUsed:
               refreshToken /** update previous refreshToken to refreshTokensUsed */,
         },
      });
      return {
         user,
         tokens,
      };
   };
}

module.exports = AccessService;
