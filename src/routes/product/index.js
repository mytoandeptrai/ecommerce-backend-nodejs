'use strict';

const express = require('express');
const { asyncHandler } = require('../../auth/checkAuth');
const productController = require('../../controllers/product.controller');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

/** Authentication */
router.use(authentication);

/** MUTATIONS */
router.post('', asyncHandler(productController.createProduct));

/** QUERIES */
router.get('/drafts/all', asyncHandler(productController.getAllDraftForShop));

module.exports = router;
