'use strict';

const { Types } = require('mongoose');
const keyTokenModel = require('../models/keystore.model');

class KeyTokenService {
   static createKeyToken = async ({
      userId,
      publicKey,
      privateKey,
      refreshToken,
   }) => {
      try {
         /** level 0 */
         // const tokens = await keyTokenModel.create({
         //    user: userId,
         //    publicKey,
         //    privateKey,
         // });

         /** level higher */

         const filter = {
               user: userId,
            },
            update = {
               publicKey,
               privateKey,
               refreshTokensUsed: [],
               refreshToken,
            },
            options = {
               upsert: true,
               new: true,
            };

         const tokens = await keyTokenModel.findOneAndUpdate(
            filter,
            update,
            options
         );

         return tokens ? tokens.publicKey : null;
      } catch (error) {
         return error;
      }
   };

   static findByUserId = async (userId) => {
      return await keyTokenModel.findOne({ user: userId.toString() }).lean();
   };

   static removeKeyById = async (id) => {
      return await keyTokenModel.findOneAndDelete({ _id: id });
   };

   static findByRefreshTokenUsed = async (refreshToken) => {
      return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();
   };

   static findByRefreshToken = async (refreshToken) => {
      return await keyTokenModel.findOne({ refreshToken: refreshToken });
   };

   static deleteKeyById = async (userId) => {
      return await keyTokenModel.deleteOne({ user: userId });
   };
}

module.exports = KeyTokenService;
