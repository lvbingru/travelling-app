var React = require('react-native');

var {
	StyleSheet,
	View,
	Image,
	ListView
} = React;

var {
	Tab
} = require('./widgets');

var RefreshableListView = require('react-native-refreshable-listview');
var ActivityView = require('./activity/ActivityView');
var Subscribable = require('Subscribable');
var ActivityMixin = require('./activity/ActivityMixin');
var {
    activity
} = require('./api');

var MyActivity = React.createClass({
	mixins: [
		Subscribable.Mixin,
		ActivityMixin
	],

	getInitialState: function() {
		this.activitiesObjects = {};

		return {
			activeTab: 0,
			activities: [],
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			})
		}
	},

	componentDidMount: function() {
        this.refs.list.handleRefresh();
    },

    _refresh: function() {
        return activity.fetch({
        	region: this.state.region
        }).then(function(activities) {
            var dataSource = this.state.dataSource.cloneWithRows(activities);
            this.setState({
                dataSource: dataSource,
                activities: activities
            });
        }.bind(this));
    },

    _tabCallback: function(index) {
    	this.setState({
    		activeTab: index
    	}, function(){
    		this.refs.list.handleRefresh();
    	}.bind(this));
    },

	render: function() {
		return (
			<View style={styles.container}>
				<Tab datas={["全部", "参加", "发起", "收藏"]}
					activeTab={this.state.activeTab}
					callbacks={[this._tabCallback, this._tabCallback, this._tabCallback, this._tabCallback]}
					styles={{tabView: styles.tabView}} />
				<RefreshableListView
                    style={{flex: 1, marginTop: 44}}
                    scrollEventThrottle={16}
                    ref="list"
                    renderHeaderWrapper={this._renderHeaderWrapper}
                    renderSeparator={this._renderSeparator}
                    dataSource={this.state.dataSource}
                    renderFooter={this._renderFooter}
                    onEndReached={this._loadMore}
                    renderRow={this._renderRow}
                    loadData={this._refresh}/>
			</View>
		)
	}
});

var styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 64,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: '#f3f5f6'
	},

	tabView: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0
	}
});

var BaseRouteMapper = require('./BaseRouteMapper');
class Route extends BaseRouteMapper {
	constructor() {
        super();
    }

    renderLeftButton() {
        return this._renderBackButton.apply(this, arguments);
    }

    get title() {
    	return '活动';
    }

    renderScene() {
    	return (
    		<MyActivity />
    	);
    }
}

module.exports = Route;