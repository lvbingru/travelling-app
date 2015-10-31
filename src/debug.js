var debug = require('debug');

debug.enable('ActivityTab:*');

debug.useColors = function() {
    return false;
}

module.exports = debug;
