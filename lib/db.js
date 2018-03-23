var mongoose = require('mongoose');
var config = require('../config/development');
var winston = require('winston');

var mongoDB = config.db.url;
winston.info('Trying to connect to: ', mongoDB);

mongoose.connect(mongoDB, config.db.options);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', winston.error.bind(winston, 'MongoDB connection error:'));
db.once('open', function callback() {
	winston.info('db connection open');
});