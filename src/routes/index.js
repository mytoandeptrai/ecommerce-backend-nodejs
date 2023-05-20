'use strict';

const express = require('express');
const { apiKey, checkPermission } = require('../auth/checkAuth');
const router = express.Router();

/** Check api key */
// router.use(apiKey);
/** Check permissions */
// router.use(checkPermission('0000'));

router.use('/v1/api/discount', require('./discount'));
router.use('/v1/api/cart', require('./cart'));
router.use('/v1/api/product', require('./product'));
router.use('/v1/api', require('./access'));

module.exports = router;
