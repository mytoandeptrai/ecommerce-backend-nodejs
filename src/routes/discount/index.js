'use strict';

const express = require('express');
const { asyncHandler } = require('../../auth/checkAuth');
const discountController = require('../../controllers/discount.controller');
const { authenticationV2 } = require('../../auth/authUtils');
const router = express.Router();

/** QUERIES */
router.post('/amount', asyncHandler(discountController.getDiscountAmount));
router.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodesWithProduct));

/** Authentication */
router.use(authenticationV2);

/** MUTATIONS */
router.post('', asyncHandler(discountController.createDiscountCode));

/** QUERIES */
router.get('', asyncHandler(discountController.getAllDiscountCodesByShop));

module.exports = router;
