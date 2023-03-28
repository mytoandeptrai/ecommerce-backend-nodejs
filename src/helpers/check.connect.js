'use strict';

const { default: mongoose } = require("mongoose");
const os = require("os");
const process = require("process");
const _SECONDS = 5000;
/** Count connect when user connect to db */
const countConnect = () => {
    const numConnection = mongoose.connections.length;
    console.log('🚀 Number of connections:', numConnection);
}

/** Check over load */
const checkOverLoad = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length;
        const numCores = os.cpus.length;
        const memoryUsed = process.memoryUsage().rss;
        /** Example maximum number of connections based on number of cores */
        const maxConnections = numCores * 5;
        console.log(`Active connections: ${numConnection}`)
        console.log(`Memory usage: ${memoryUsed / 1024 / 1024} MB`)

        if (numConnection > maxConnections) {
            console.log(`Connection overload detected`)
        }

    }, _SECONDS); // Monitor every 5 seconds;
}

module.exports = {
    countConnect,
    checkOverLoad
}