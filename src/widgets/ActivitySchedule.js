var moment = require('moment');
var React = require('react-native');

var {
    View,
    Text,
    Image,
    StyleSheet
} = React;

var su = require('../styleUtils');
var ActivityRoute = require('./ActivityRoute');
var ActivityPublishDate = require('./ActivityPublishDate');

var ActivitySchedule = React.createClass({

    render: function() {
        var {route} = this.props.data;
        return (
            <View style={[{marginBottom: 10}, this.props.style]}>
                <ActivityRoute style={{marginBottom: 10}} route={route}/>
                <ActivityPublishDate data={this.props.data}/>
            </View>
        );
    }
});

module.exports = ActivitySchedule;
