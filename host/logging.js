var Bunyan = require('bunyan');
var RequestLogger = require('bunyan-request-logger');

var loggerConfig = {
    name: 'stayfresh',
    streams: [{
        type: 'rotating-file',
        path: __dirname + '/../log/stayfresh.log',
        count: 7,
        period: '1d' // Others: 1h, 1w, 1m, 1y. See https://github.com/trentm/node-bunyan#stream-type-rotating-file
    }],
    level: 'debug'
    // format: ':method :url :status-code'
};

var LOG = Bunyan.createLogger(loggerConfig);
var HTTP_LOG = RequestLogger(loggerConfig);

module.exports.consoleLogger = LOG;
module.exports.requestLogger = HTTP_LOG.requestLogger();
