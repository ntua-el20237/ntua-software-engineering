//const express = require('../../backend/node_modules/express');
const express = require('express');
const router = express.Router();
const pool = require('../../backend/connect');

router.get('/', function(req, res) {
	pool.connect(function(err, client, release) {
		if(err) {
		        res.status(500).json({status:"failed", "dbconnection":"root://pass:root@localhost:9876/ntuaflix"});
                        console.log("connection failed", err);
  		}
		else {
			res.status(200).json({status:"OK", "dbconnection":"root://root:pass@localhost:9876/ntuaflix"});
                       	console.log("connection successful");
		}
		release();
	});
});

module.exports = router;