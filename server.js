const https = require('https');
const path = require('path');
const fs = require('fs');

const options = {
    cert: fs.readFileSync(path.resolve(__dirname, './cert.pem')),
    key: fs.readFileSync(path.resolve(__dirname, './key.pem'))
};

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 9000;

const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

// const database = require('./config/database');
// mongoose.connect(database.localUrl);

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride('X-HTTP-Method-Override'));

app.set('view engine', 'ejs');

// required for passport
app.use(session({ secret: 'CIS550_Final_Project' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


require('./routes.js')(app, passport);

const server = https.createServer(options, app)
server.listen(port);
console.log("App listening on port " + port);
