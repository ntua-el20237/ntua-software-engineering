const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'pass',
  database: 'ntuaflix',
  port: 3306
});
module.exports = pool;