/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('database.json');
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

// Add a post
// db.get('posts')
//   .push({id: 1, title: 'lowdb is awesome'})
//   .write();

// // Set a user using Lodash shorthand syntax
// db.set('user.name', 'typicode').write();

// // Increment count
// db.update('count', n => n + 1).write();

module.exports = lowDB;
