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

nunjucks.configure(['../front-end/templates/'], {
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
webapp.use(express.urlencoded({ extended: true }));


// WEB SERVER (for front-end)
webserver.listen(3000, () => {
	console.log('Web-server is up and runing at: https://localhost:3000');
});

const adminhealth = require('../api/admin/healthcheck.js'),
	//logout = require('../api/logout'),
	//login = require('../api/login'),
	titlebasics = require('../api/admin/upload/titlebasics.js'),
	titleakas = require('../api/admin/upload/titleakas.js'),
	namebasics = require('../api/admin/upload/namebasics.js'),
	titlecrew = require('../api/admin/upload/titlecrew.js'),
	titleepisode = require('../api/admin/upload/titleepisode.js'),
	titleprincipals = require('../api/admin/upload/titleprincipals.js'),
	titleratings = require('../api/admin/upload/titleratings.js'),
	resetall = require('../api/admin/resetall.js'),
	title = require('../api/title'),
	//userMod = require('../api/admin/usermod/<string:username>/<string:password>'),
	//userInfo = require('../api/admin/users/<string:username>'),
	searchtitle = require('../api/searchtitle'),
	bygenre = require('../api/bygenre'),
	name = require('../api/name'),
	searchname = require('../api/searchname');
const { homedir } = require('os');

// RESTFUL API ROUTES
/*app.use(baseurl+'/login', login);
app.use(baseurl+'/logout', logout); */

app.use(baseurl+'/admin/healthcheck', adminhealth);
app.use(baseurl+'/admin/upload/titlebasics', titlebasics);
app.use(baseurl+'/admin/upload/namebasics', namebasics);
app.use(baseurl+'/admin/upload/titleakas', titleakas);
app.use(baseurl+'/admin/upload/titlecrew', titlecrew);
app.use(baseurl+'/admin/upload/titleepisode', titleepisode);
app.use(baseurl+'/admin/upload/titleprincipals', titleprincipals);
app.use(baseurl+'/admin/upload/titleratings', titleratings);
app.use(baseurl+'/admin/resetall', resetall);
app.use(baseurl+'/title', title);
//app.use(baseurl+'/admin/usermod/<string:username>/<string:password>', userMod);
//app.use(baseurl+'/admin/users/<string:username>', userInfo);
app.use(baseurl+'/searchtitle', searchtitle);
app.use(baseurl+'/bygenre', bygenre);
app.use(baseurl+'/name', name);
app.use(baseurl+'/searchname', searchname);


// ROUTES FOR front-end
webapp.use(express.static(path.join(__dirname, '../front-end/static')));
webapp.use("/", require('./routes/home.routes.js'));
webapp.use("/login", require('./routes/login.routes.js'));
webapp.use("/register", require('./routes/register.routes.js'));
webapp.use("/result", require('./routes/result.routes.js'));
webapp.use("/toppicks", require('./routes/toppicks.routes.js'));
webapp.use("/profile", require('./routes/profile.routes.js'));

module.exports = router;