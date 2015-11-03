var debug = require('debug');

debug.enable('*:*');

debug.useColors = function() {
    return false;
}

module.exports = debug;
