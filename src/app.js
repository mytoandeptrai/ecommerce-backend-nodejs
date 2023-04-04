require('dotenv').config();
const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const { errorMiddleware } = require('./middleware/errorMiddleware');
const app = express();

/** Init Middleware (app.use(): middleware) */
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
   express.urlencoded({
      extended: true,
   })
);

/** Init DB */
// level basic
// require('./dbs/init.mongodb.lv0')

// level pro
require('./dbs/init.mongodb');
/** Init Routes */
app.use('/', require('./routes'));
/** Handler error */
app.use(errorMiddleware);

module.exports = app;
