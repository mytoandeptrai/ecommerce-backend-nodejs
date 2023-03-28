'use strict';
const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');

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
            return {
               code: 'xxxx',
               message: 'Conflict',
            };
         }

         const hashPassword = await bcrypt.hash(password, 10);

         const newShop = await shopModel.create({
            name,
            email,
            password: hashPassword,
            roles: [RolesShop.SHOP],
         });

         if (newShop) {
            /** Create privateKey, publicKey
             * privateKey: sign token to give for user ( not save in db)
             * publicKey: verify token ( save in db )
             */

            const { privateKey, publicKey } = crypto.generateKeyPairSync(
               'rsa',
               {
                  modulusLength: 4096,
                  publicKeyEncoding: {
                     type: 'pkcs1',
                     format: 'pem',
                  },
                  privateKeyEncoding: {
                     type: 'pkcs1',
                     format: 'pem',
                  },
               }
            );

            const publicKeyString = await KeyTokenService.createKeyToken({
               userId: newShop._id,
               publicKey,
            });

            if (!publicKeyString) {
               return {
                  code: 'xxxx',
                  message: 'publicKeyString error',
               };
            }

            // const publicKeyObject = crypto.createPublicKey( publicKeyString );
            // const tokens = await createTokenPair(
            //    {
            //       userId: newShop._id,
            //       email,
            //    },
            //    publicKeyString,
            //    privateKey
            // );
            console.log('🚀 ~ file: access.service.js:79 ~ signUp= ~ tokens:', publicKeyString);

            return {
               code: 201,
               metadata: {
                  shop: newShop,
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
}

module.exports = AccessService;
