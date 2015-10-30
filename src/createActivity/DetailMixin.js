'use strict'; var _ = require('underscore');
var React = require('react-native');
var DatePickerRoute = require('../DatePickerRoute');
var TextInputRoute = require('../TextInputRoute');
var RoutePicker = require('../RoutePicker');

var Labels = require('./labels').detailLabels;
var ActivityCarsPicker = require('./ActivityCarsPicker');

var DetailMixin = {
    _showDatePickerForEntryDeadline: function() {
        this.props.navigator.push(new DatePickerRoute({
            title: Labels.entryDeadline,
            onResult: this._saveEntryDeadline,
            current: this.state.entryDeadline,
            maximumDate: this.state.startDate
        }))
    },

    _saveEntryDeadline: function(date) {
        this.setState({
            entryDeadline: date
        });
    },

    _showMinCarsPicker: function() {
        var modal = <ActivityCarsPicker onResult={this._save('minCars')}/>;
        this.props.openModal(modal);
    },

    _showMaxCarsPicker: function() {
        var modal = <ActivityCarsPicker onResult={this._save('maxCars')}/>;
        this.props.openModal(modal);
    },

    _editText: function(entry) {
        return function() {
            this.props.navigator.push(new TextInputRoute({
                title: Labels[entry],
                initValue: this.state[entry],
                onResult: this._save(entry)
            }));
        }.bind(this);
    },

    _editRouteMap: function() {
        this.props.navigator.push(new RoutePicker({
            onResult: () => {
                var routeMap = {
                    type: 'placeholder'
                };

                this.setState({
                    routeMap
                });
            }
        }));
    },

    _validateDetail: function() {
        var prop = _.find(_.keys(Labels), function(key) {
            return !this.state[key];
        }, this);

        if (prop) {
            throw new Error(Labels[prop] + '没有填写');
        }

        if (this.state.maxCars < this.state.minCars) {
            throw new Error('最大车辆数太小');
        }
    }
};

module.exports = DetailMixin;
