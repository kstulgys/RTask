/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('tmp/database.json');
const lowDB = low(adapter);

function randomAmount(min, max) {
  const precision = 100;
  return Math.floor(Math.random() * ((max - min) * precision - 1 * precision) + 1 * precision) / (1 * precision);
}
// Set some defaults (required if your JSON file is empty)
const pockets = {
  GBP: randomAmount(100, 50000),
  EUR: randomAmount(100, 50000),
  USD: randomAmount(100, 50000),
};

lowDB
  .defaults({
    pockets,
  })
  .write();

module.exports = lowDB;
