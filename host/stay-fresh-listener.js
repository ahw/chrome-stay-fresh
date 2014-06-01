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

app.get('/:eventName', function(request, response) {

    var delay = request.query.delay;
    // On an HTTP request, write stuff to stdout to communicate with Chrome.
    var outputMessage = JSON.stringify(request.params.eventName);
    var buf = new Buffer(4); // 32 bits.
    buf.writeInt32LE(outputMessage.length, 0); // Use writeInt32BE if you're running on a big-endian architecture.

    function sendMessageToChrome() {
        process.stdout.write(buf);
        process.stdout.write(outputMessage);
        LOG.info('Sent message on stdout: ' + buf + outputMessage);
    }

    if (delay) {
        LOG.info('Delaying for', delay, 'milliseconds');
        setTimeout(sendMessageToChrome, delay);
    } else {
        sendMessageToChrome();
    }


    // Return a response immediately
    response.send(outputMessage);
});
LOG.info('Starting up StayFresh listener.');
LOG.info('Listening to HTTP/1.1 on port 7700');
LOG.info('Talking to Chrome extension on stdin/stdout');

process.stdin.on('readable', function() {
    // Read input as UTF-8 strings. Note the first 4 bytes contain the
    // message length, so we have to re-cast them into a raw Buffer and then
    // read as an unsigned 32-bit integer.
    process.stdin.setEncoding('utf8');
    var chunk = process.stdin.read(4); // Read the first 4 bytes to get length
    var length = new Buffer(chunk).readUInt32LE(0); // Convert to integer

    // TODO: What if we don't have all the data yet?
    var message = process.stdin.read(length);
    // while (chunk !== null) {
    //     message += chunk;
    //     chunk - process.stdin.read();
    // }
    LOG.info('Received message of ' + length + ' bytes on stdin: ' + message);
});

process.stdin.on('end', function() {
    // Note: "close" is not guaranteed to fire. The "end" event will.
    LOG.info('Got "end" event on stdin. Exiting.');
    process.exit(0); // Exit successfully.
});
