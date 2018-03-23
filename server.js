const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const winston = require('winston');
const expressWinston = require('express-winston');
const enrouten = require('express-enrouten');
const cors = require('cors');
const config = require('./config/development');

// ==================================
// SET UP
// ==================================
require('./lib/scripts');

app.use(expressWinston.logger({
	transports: [
		new winston.transports.Console({
			json: false,
			colorize: true
		})
	],
	meta: false,
	expressFormat: true,
	colorize: true
}));

app.use(cors());

var port = process.env.PORT || 8080;

// extract all the data from POST to the app backend
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({
	type: 'application/json'
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(enrouten({
	directory: 'app/controllers'
}));

// init app
app.listen(port);

// shout out to the user
winston.info('Starting application on port', port);

winston.info('Available roles: ', config.roles)

global._roles = config.roles;

// make app available
exports = module.exports = app;