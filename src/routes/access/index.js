'use strict';

const express = require('express');
const { asyncHandler } = require('../../auth/checkAuth');
const accessController = require('../../controllers/access.controller');
const { authenticationV2 } = require('../../auth/authUtils');
const router = express.Router();

/** SIGN UP */
router.post('/shop/signup', asyncHandler(accessController.signUp));
router.post('/shop/login', asyncHandler(accessController.login));

/** Authentication for logout */
router.use(authenticationV2);
router.post('/shop/logout', asyncHandler(accessController.logout));
router.post('/shop/handlerRefreshToken', asyncHandler(accessController.handlerRefreshToken));

module.exports = router;
