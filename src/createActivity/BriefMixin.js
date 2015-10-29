var _ = require('underscore');
var React = require('react-native');
var {
    AlertIOS
} = React;

var DatePickerRoute = require('../DatePickerRoute');
var briefLabels = require('./labels').briefLabels;

var BriefMixin = {
    _validateBrief: function() {
        var prop = _.find(_.keys(briefLabels), function(key) {
            return !this.state[key];
        }, this);

        if (prop) {
            throw new Error(briefLabels[prop] + '没有填写');
        }

        if (this.state.title.length > 50) {
            throw new Error('标题不能超50个字');
        }

        if (this.state.route.length > 100) {
            throw new Error('路线不能超过100个字');
        }
    },

    _showDatePickerForStartDate: function() {
        this.props.navigator.push(new DatePickerRoute({
            onResult: this._saveStartDate.bind(this),
            maximumDate: this.state.endDate
        }));
    },

    _saveStartDate: function(date) {
        this.setState({
            startDate: date
        });
    },

    _showDatePickerForEndDate: function() {
        this.props.navigator.push(new DatePickerRoute({
            onResult: this._saveEndDate.bind(this),
            minimumDate: this.state.startDate
        }));
    },

    _saveEndDate: function(date) {
        this.setState({
            endDate: date
        });
    },
}

module.exports = BriefMixin;