const Client = require('./structures/Client.js');
const config = require('../config.json');

// clear previous stdout
console.clear();

// create the client instance
const client = new Client().start(config.token);