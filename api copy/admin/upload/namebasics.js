const express = require('express');
const router = express.Router();
const fs = require('fs');
const pool = require('../../../back-end/connect');

var sql = fs.readFileSync('../database/data/INSERT_DATA/truncated_name_basics.sql').toString();

router.get('/', (req, res) => {
	res.send('GET request to resetall endpoint');
});
router.post('/', function(req, res) {
		pool.getConnection(function(err, connection) {
			if(err) {
				res.status(500).json({status:"failed"});
				console.log("connection failed", err);
				connection.release();
			}
			connection.query(sql, function(err) {
				if (err) {
					res.status(500).json({status:"failed"});
					console.log("data not inserted", err);
				}
				else {
					res.status(200).json({status:"OK"});
					console.log("data inserted");
				}
			});
			connection.release();
		});	
});

module.exports = router;