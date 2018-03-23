var winston = require('winston');
var config = require('../config/development');

winston.add(winston.transports.File, config.logger);