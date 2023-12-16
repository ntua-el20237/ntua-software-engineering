const pg = require('pg');
require('dotenv').config();

const config = {
  	user: "root",
	host: "localhost",
  	database: "ntuaflix",
  	password: "pass",
  	port: 9876,
}

const pool = new pg.Pool(config);
module.exports = pool;