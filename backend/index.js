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

const adminhealth = require('../api/admin/healthcheck'),
	//logout = require('../api/logout'),
	//login = require('../api/login'),
	titlebasics = require('../api/admin/upload/titlebasics'),
	titleakas = require('../api/admin/upload/titleakas'),
	namebasics = require('../api/admin/upload/namebasics'),
	titlecrew = require('../api/admin/upload/titlecrew'),
	titleepisode = require('../api/admin/upload/titleepisode'),
	titleprincipals = require('../api/admin/upload/titleprincipals'),
	titleratings = require('../api/admin/upload/titleratings'),
	resetall = require('../api/admin/resetall');
	/*userMod = require('../api/admin/usermod/<string:username>/<string:password>'),
	userInfo = require('../api/admin/users/<string:username>'),
	title = require('../api/title/<string:titleID>'),
	searchtitle = require('../api/searchtitle'),
	bygenre = require('../api/bygenre'),
	name = require('../api/name/<string:nameID>'),
	searchname = require('../api/searchname')*/ 
const { homedir } = require('os');

// RESTFUL API ROUTES
/*app.use(baseurl+'/', home);
app.use(baseurl+'/login', login);
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
/*app.use(baseurl+'/admin/usermod/<string:username>/<string:password>', userMod);
app.use(baseurl+'/admin/users/<string:username>', userInfo);
app.use(baseurl+'/admin/resetall', resetall);

app.use(baseurl+'/title/<string:titleID>', title);
app.use(baseurl+'/searchtitle', searchtitle);
app.use(baseurl+'/bygenre', bygenre);
app.use(baseurl+'/name/<string:nameID>', name);
app.use(baseurl+'/searchname', searchname);*/

// ROUTES FOR FRONTEND
webapp.use(express.static(path.join(__dirname, '..') + "/frontend/static"));

webapp.use("/", require('./routes/home.routes.js'));
webapp.use("/login", require('./routes/login.routes.js'));
webapp.use("/register", require('./routes/register.routes.js'));
webapp.use("/result", require('./routes/result.routes.js'));
webapp.use("/toppicks", require('./routes/toppicks.routes.js'));
webapp.use("/profile", require('./routes/profile.routes.js'));

module.exports = router;