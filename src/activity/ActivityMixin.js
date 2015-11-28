var React = require('react-native');

var {
	StyleSheet,
	View,
	Text,
	ActivityIndicatorIOS
} = React;

var debug = require('../debug');
var log = debug('ActivityTab:log');
var warn = debug('ActivityTab:warn');
var error = debug('ActivityTab:error');
var ActivityView = require('./ActivityView');
var ActivityDetail = require('../ActivityDetail');
var {
    activity
} = require('../api');

var indicatorStyles = StyleSheet.create({
    wrap: {
        flex: 1,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },

    loading: {
        fontSize: 9,
        marginBottom: 5,
        color: '#777'
    }
});

var ActivityMixin = {
	_renderFooter: function() {
        if (!this.state.loadingMore) {
            return null;
        }

        return (
            <View style={indicatorStyles.wrap}>
                <Text style={indicatorStyles.loading}>加载活动</Text>
                <ActivityIndicatorIOS size="small"/>
            </View>
        );
    },

    _toDetail: function(activity) {
        this.props.navigator.push(new ActivityDetail({
            activity
        }, this.props.navigator, this.refreshDetail));
    },

    _renderHeaderWrapper: function(refreshingIndicator) {
        if (refreshingIndicator == null) {
            return null;
        }

        return (
            <View style={indicatorStyles.wrap}>
                <Text style={indicatorStyles.loading}>刷新更多</Text>
                <ActivityIndicatorIOS size="small"/>
            </View>
        );
    },

    _renderSeparator: function(sectionID, rowID, adjacentRowHighlighted) {
        if (rowID == this.state.dataSource.getRowCount() - 1) {
            return null;
        } else {
            return <View style={{height: 20, backgroundColor: 'transparent'}}/>;
        }
    },

    _loadMore: function() {
        if (this.state.loadingMore) {
            return error('Invalid operation, loading now');
        }

        var region = this.state.region;
        var lastActivity = this.state.activities[this.state.activities.length - 1];
        if (!lastActivity) {
            return warn('no existed activity');
        }


        log('load more data');
        this.setState({
            loadingMore: true
        });
        return activity.fetch({
            region: region ? region.tag : null,
            latestDate: lastActivity.getCreatedAt()
        }).then(function(_activities) {
            if (_activities.length === 0) {
                return error('No more activities');
            }

            var activities = this.state.activities.concat(_activities);
            log('activities: ', activities.map((item) => item.id).join(','));
            var dataSource = this.state.dataSource.cloneWithRows(activities);
            this.setState({
                dataSource: dataSource,
                activities: activities
            });
        }.bind(this), function(e) {
            console.trace(e);
            error(e);
        }).finally(function() {
            this.setState({
                loadingMore: false
            });
        }.bind(this));
    },

    _renderRow: function(_activity) {
        return (
            <ActivityView key={'activity-' + _activity.id}
                activity={_activity}
                ref={component => this.activitiesObjects[_activity.id] = component}
                onPress={() => this._toDetail(_activity)}/>
        );
    }
}

module.exports = ActivityMixin;