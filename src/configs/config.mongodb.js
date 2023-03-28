'use strict';

/** Level 0 */

// const config = {
//     app: {
//         port: 3000,

//     },
//     db: {
//         host: 'localhost',
//         port: 27017,
//         name: 'db'
//     }
// }

/** Level 1 */

const dev = {
    app: {
        port: process.env.DEV_APP_PORT,

    },
    db: {
        host: process.env.DEV_DB_HOST,
        port: process.env.DEV_DB_PORT,
        name: process.env.DEV_DB_NAME
    }
}

const production = {
    app: {
        port: process.env.PRO_APP_PORT,

    },
    db: {
        host: process.env.PRO_DB_HOST,
        port: process.env.PRO_DB_PORT,
        name: process.env.PRO_DB_NAME
    }
}

const config = {
    dev, production
}

const env = process.env.NODE_ENV || 'dev'

module.exports = config[env]