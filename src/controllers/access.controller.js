'use strict';

const { Created, SuccessResponse } = require('../core/success.response');
const AccessService = require('../services/access.service');

class AccessController {
   signUp = async (req, res, next) => {
      const result = await AccessService.signUp(req.body);
      new Created({
         message: 'Registered successfully',
         metadata: result,
      }).send(res);
   };
   login = async (req, res, next) => {
      const result = await AccessService.login(req.body);
      new SuccessResponse({
         metadata: result,
      }).send(res);
   };
   logout = async (req, res, next) => {
      const result = await AccessService.logout({ keyStore: req.keyStore });
      new SuccessResponse({
         message: 'Logout successfully',
         metadata: result,
      }).send(res);
   };
   handlerRefreshToken = async (req, res, next) => {
      /** v1
       *  const result = await AccessService.handlerRefreshToken(req.body.refreshToken);
       *  v1
       */
      /** v2: fixed */
      const result = await AccessService.handlerRefreshTokenV2({
         refreshToken: req.refreshToken,
         user: req.user,
         keyStore: req.keyStore,
      });
      new SuccessResponse({
         message: 'Get Token successfully',
         metadata: result,
      }).send(res);
   };
}

module.exports = new AccessController();
