const path = require('path');
const express = require('express'),
 app = express(),
 webapp = express(),
 router = express.Router();
const https = require('https');
const fs = require('fs');
const cors = require('cors');

const PORT = process.env.PORT || 9876;
const baseurl = '/ntuaflix/api';

// TEMPLATE INHERITANCE
const nunjucks = require('nunjucks');	// templating framework

nunjucks.configure(['../frontend/templates/'], {
	autoescape: false,
	express: webapp
})

const key = fs.readFileSync('./certificates/localhost.decrypted.key');
const cert = fs.readFileSync('./certificates/localhost.crt');
const server = https.createServer({ key, cert }, app);
const webserver = https.createServer({ key , cert }, webapp);

// API WEB SERVER
app.get(baseurl, (req,res) => {
	res.end('NTUAFLIX IS UP!');
});

server.listen(PORT, () => {
	console.log(`app listening at: https://localhost:${PORT}${baseurl}`);
});

// MIDDLEWARE FOR CROSS-ORIGIN REQUESTS
app.use(cors());

// WEB SERVER (for frontend)
webserver.listen(98, () => {
	console.log('Web-server is up and runing at: https://localhost:98');
});

const adminhealth = require('../API/admin/healthcheck');
const { homedir } = require('os');

// RESTFUL API ROUTES
app.use(baseurl+'/admin/healthcheck', adminhealth);

// ROUTES FOR FRONTEND
webapp.use(express.static(path.join(__dirname, '..') + "/frontend/static"));

webapp.use("/", require('./routes/home.routes.js'));
webapp.use("/login", require('./routes/login.routes.js'));
webapp.use("/register", require('./routes/register.routes.js'));
webapp.use("/result", require('./routes/result.routes.js'));
webapp.use("/toppicks", require('./routes/toppicks.routes.js'));
webapp.use("/profile", require('./routes/profile.routes.js'));

module.exports = router;