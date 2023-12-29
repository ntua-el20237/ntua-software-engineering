//const express = require('../../backend/node_modules/express');
const express = require('express');
const router = express.Router();
const pool = require('../../backend/connect');

router.get('/', function(req, res) {
	pool.getConnection(function(err, connection) {
	  if (err) {
		res.status(500).json({ status: "failed", error: err });
		console.log("Connection failed", err);
	  } else {
		res.status(200).json({ status: "OK", message: "Connected to Ntuaflix" });
		console.log("Connection successful");
		connection.release();
	  }
	});
  });

module.exports = router;