#!/usr/local/bin/node
var fs = require('fs');

var file = fs.openSync(__dirname + '/output', 'a');
var buf = new Buffer(4); // 32 bits.
var outputMessage = '{"success":"yay"}'; // Length: 17.
// Least significant digits go in the "littlest" address in a little-endian
// architecture, which is what my laptop is running on (x86).
buf[0] = 0x11; // 17 in hex.
buf[1] = 0x00;
buf[2] = 0x00;
buf[3] = 0x00;

function log(message) {
    fs.writeSync(file, message);
}

log(process.cwd());

process.stdin.on('readable', function() {
    // Read input as UTF-8 strings. Note the first 4 bytes contain the
    // message length, so we have to re-cast them into a raw Buffer and then
    // read as an unsigned 32-bit integer.
    process.stdin.setEncoding('utf8');
    var chunk = process.stdin.read(4); // Read the first 4 bytes to get length
    var length = new Buffer(chunk).readUInt32LE(0); // Convert to integer
    log('< Received message of ' + length + ' bytes: ');

    // TODO: What if we don't have all the data yet?
    var message = process.stdin.read(length);
    // -- while (chunk !== null) {
    // --     message += chunk;
    // --     chunk - process.stdin.read();
    // -- }
    log(message + '\n');

    process.stdout.write(buf);
    process.stdout.write(outputMessage);
    log('> Sent message: ' + buf + outputMessage + '\n');
});

process.stdin.on('end', function() {
    log('Got "end" event\n');
});

process.stdin.on('close', function() {
    log('Got "close" event\n');
});
