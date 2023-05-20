'use strict';

const express = require('express');
const { asyncHandler } = require('../../auth/checkAuth');
const cartController = require('../../controllers/cart.controller');
const { authenticationV2 } = require('../../auth/authUtils');
const router = express.Router();

/** Authentication */
router.use(authenticationV2);

/** MUTATIONS */
router
   .route('')
   .post(asyncHandler(cartController.addToCart))
   .delete(asyncHandler(cartController.delete));

router.post('/update', asyncHandler(cartController.update));

/** QUERIES */
router.get('', asyncHandler(cartController.listToCart));

module.exports = router;
