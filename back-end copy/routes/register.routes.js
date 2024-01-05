const path = require('path')
const express = require('express')
const router = express.Router();

router.get("/", function(req, res) {
	res.render(path.join(__dirname, '../..') + "/front-end/templates/register.html");
});

module.exports = router;