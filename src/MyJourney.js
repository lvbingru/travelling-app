var React = require('react-native');

var {
	ActivityIndicatorIOS,
  	StyleSheet,
  	Text,
  	View,
  	ScrollView,
  	ListView,
  	Dimensions
} = React;

var {
	Tab
} = require('./widgets');

var JourneyView = require('./journey/JourneyView');

var deviceWidth = Dimensions.get('window').width;
var journey = require('./api').journey;

var RefreshableListView = require('react-native-refreshable-listview');

var MyJourney = React.createClass({
	getInitialState: function() {
		return {
			activeTab: 0,
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			})
		}
	},

	componentDidMount: function() {
    	this._fetchData();
  	},

  	_fetchData: function() {
    	return journey.fetch().then(function(data) {
     		var dataSource = this.state.dataSource.cloneWithRows(data.results);
      		this.setState({
        		dataSource: dataSource
      		});
    	}.bind(this), console.trace.bind(console));
  	},

  	_renderHeaderWrapper: function(refreshingIndicator) {
    	if (refreshingIndicator == null) {
      		return null;
    	}

    	var styles = {
      		wrap: {
        		width: deviceWidth - 10,
        		paddingVertical: 10,
        		alignItems: 'center', 
        		justifyContent: 'center'
      		},

      		loading: {
        		fontSize: 9,
        		marginBottom: 5,
        		color: '#777'
      		}
    	}

    	return (
        	<View style={styles.wrap}>
         		<Text style={styles.loading}>刷新游记</Text>
          		<ActivityIndicatorIOS size="small"/>
        	</View>
    	);
  	},

  	_tabCallback: function(index) {
  		this.setState({
  			activeTab: index
  		}, function() {
  			this._fetchData();
  		}.bind(this));
  	},

	render: function() {
		return (
			<View style={styles.container}>
				<Tab datas={["全部", "我的", "收藏"]}
					activeTab={this.state.activeTab}
					callbacks={[this._tabCallback, this._tabCallback, this._tabCallback]}
					styles={{tabView: styles.tabView}} />

				<RefreshableListView
            		style={styles.list}
            		contentContainerStyle={styles.grid}
           		 	dataSource={this.state.dataSource}
            		renderHeaderWrapper={this._renderHeaderWrapper}
            		renderRow={this._renderItem}
            		loadData={this._onRefresh}/>
			</View>
		);
	},

	_onRefresh: function() {
    	return this._fetchData();
  	},

  	_renderItem: function(data) {
      	return (
          	<JourneyView style={styles.cell} key={data.id} data={data}/>
      	);
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
	},

	list: {
		marginTop: 44,
        backgroundColor: '#f3f5f6',
        padding: 5
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start'
    },

    cell: {
        width: (deviceWidth - 10) / 2,
        padding: 5,
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
    	return '我的游记';
    }

    renderScene() {
    	return (
    		<MyJourney />
    	);
    }
}

module.exports = Route;