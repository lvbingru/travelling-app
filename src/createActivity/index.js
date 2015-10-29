var labels = require('./labels');
var BaseMixin = require('./BaseMixin');
var BriefMixin = require('./BriefMixin');
var DetailMixin = require('./DetailMixin');
var fields = require('./Fields');

module.exports = {
    ...labels,
    ...fields,
    BaseMixin,
    BriefMixin,
    DetailMixin
};
