const Database = require('better-sqlite3');
const db = new Database('db/community-chest.sqlite3');
console.log('Database loaded successfully');

module.exports = db;

