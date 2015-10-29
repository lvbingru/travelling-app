var labels = require('./labels');

var BaseMixin = require('./BaseMixin');
var BriefMixin = require('./BriefMixin');
var DetailMixin = require('./DetailMixin');

module.exports = {
    ...labels,
    BaseMixin,
    BriefMixin,
    DetailMixin
};
