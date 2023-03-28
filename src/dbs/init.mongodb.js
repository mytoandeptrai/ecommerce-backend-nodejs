'use strict';

const mongoose = require('mongoose');
const { countConnect } = require('../helpers/check.connect')
// const { db: { host, name, port } } = require('../configs/config.mongodb');
const connectString = `mongodb+srv://mytoandeptrai:mytoandeptrai@shopdev.sl9twsl.mongodb.net/?retryWrites=true&w=majority`

class Database {
    constructor() {
        this.connect()
    }

    connect(type = 'mongodb') {
        if (1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', {
                color: true
            })
        }
        mongoose.connect(connectString).then(_ => {
            console.log(`Connected to database successfully Pro`)
            countConnect()
        }).catch(err => console.log(`Error connecting`))
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb