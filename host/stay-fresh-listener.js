#!/usr/local/bin/node
var fs = require('fs');
var Express = require('express');
var Http = require('http');
var Logging = require(__dirname + '/logging');

var LOG = Logging.consoleLogger;
var HTTP_LOG = Logging.requestLogger;

var app = Express();
app.use(HTTP_LOG);
Http.createServer(app).listen(7700);

app.get('/', function(request, response) {
    response.send('yay');
});
LOG.info('Listening on port 7700');

var buf = new Buffer(4); // 32 bits.
var outputMessage = '{"success":"yay"}'; // Length: 17.
// Least significant digits go in the "littlest" address in a little-endian
// architecture, which is what my laptop is running on (x86). Reverse this
// if you're running on a big-endian architecture.
buf[0] = 0x11; // 17 in hex.
buf[1] = 0x00;
buf[2] = 0x00;
buf[3] = 0x00;

process.stdin.on('readable', function() {
    // Read input as UTF-8 strings. Note the first 4 bytes contain the
    // message length, so we have to re-cast them into a raw Buffer and then
    // read as an unsigned 32-bit integer.
    process.stdin.setEncoding('utf8');
    var chunk = process.stdin.read(4); // Read the first 4 bytes to get length
    var length = new Buffer(chunk).readUInt32LE(0); // Convert to integer
    LOG.info('Received message of ' + length + ' bytes');

    // TODO: What if we don't have all the data yet?
    var message = process.stdin.read(length);
    // while (chunk !== null) {
    //     message += chunk;
    //     chunk - process.stdin.read();
    // }
    LOG.info(message);

    process.stdout.write(buf);
    process.stdout.write(outputMessage);
    LOG.info('Sent message: ' + buf + outputMessage);
});

process.stdin.on('end', function() {
    LOG.info('Got "end" event');
});

process.stdin.on('close', function() {
    LOG.info('Got "close" event');
});
