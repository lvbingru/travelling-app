var moment = require('moment');
var React = require('react-native');

var {
    View,
    Text,
    Image,
    StyleSheet
} = React;

var icons = require('../icons');
var su = require('../styleUtils');

var ActivityPublishDate = React.createClass({
    _formatDate: function(date) {
        date = moment(date);
        if (date.year() === moment().year()) {
          return date.format('MM-DD');
        } else {
          return date.format('YYYY-MM-DD');
        }
    },

    render: function() {
        var _activity = this.props.data;
        var startDate = new Date(_activity.get('startDate'));
        var endDate = new Date(_activity.get('endDate'));

        var days = Math.floor((endDate.getTime() - startDate.getTime()) / (3600 * 1000 * 24)) + 1;
        if (days > 1) {
          var duration = "（" + days + "天" + (days-1) + "晚）";
        } else {
          var duration = "（" + days + "天）";
        }

        return (
          <View style={[styles.date, this.props.style]}>
            <Image style={[styles.icon, {marginRight: 10}]}
                source={icons.calendar}/>
            <Text style={styles.baseText}>
              {this._formatDate(startDate)} ~ {this._formatDate(endDate)}
            </Text>
            <Text style={[styles.baseText, styles.duration]}>{duration}</Text>
          </View>
        );
    },
});

var styles = StyleSheet.create({
    icon: {
        ...su.size(11)
    },

    baseText: {
        fontWeight: '200',
        color: '#030303'
    },

    date: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    duration: {
        color: '#96969b'
    },
});

module.exports = ActivityPublishDate;
