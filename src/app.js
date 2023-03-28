require('dotenv').config();
const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const app = express();

/** Init Middleware (app.use(): middleware) */
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());

/** Init DB */

// level basic
// require('./dbs/init.mongodb.lv0')

// level pro
require('./dbs/init.mongodb');

/** Init Routes */
app.use('/', require('./routes'));
/** Handler error */

module.exports = app;
