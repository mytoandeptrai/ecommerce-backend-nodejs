'use strict';

const express = require('express');
const { asyncHandler } = require('../../auth/checkAuth');
const productController = require('../../controllers/product.controller');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

/** Authentication */
router.use(authentication);
router.post('', asyncHandler(productController.createProduct));

module.exports = router;
