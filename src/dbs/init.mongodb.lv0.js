'use strict';
const mongoose = require('mongoose');

const connectString = `mongodb+srv://mytoandeptrai:mytoandeptrai@shopdev.sl9twsl.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(connectString).then(_ => console.log(`Connected to ${connectString} successfully`)).catch(err => console.log(`Error connecting`))

module.exports = mongoose