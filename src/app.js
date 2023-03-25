const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const app = express()

/** Init Middleware (app.use(): middleware) */
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
/** Init DB */

/** Init Routes */

/** Handler error */


module.exports = app