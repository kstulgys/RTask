/* eslint-disable @typescript-eslint/no-var-requires */
const config = require('./config');
const createDB = require('./createDB');

const db = createDB(config);
module.exports = db;
