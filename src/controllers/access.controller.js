'use strict';

const AccessService = require('../services/access.service');

class AccessController {
   signUp = async (req, res, next) => {
      try {
         const result = await AccessService.signUp(req.body);
         return res.status(201).json(result);
      } catch (error) {
         next(error);
      }
   };
}

module.exports = new AccessController();
