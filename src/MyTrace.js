var React = require('react-native');

var {
	StyleSheet,
	View,
	Text,
	Image,
	PixelRatio,
	TouchableOpacity,
	ListView
} = React;

var {
	Tab
} = require('./widgets');
var stylesVar = require('./stylesVar');
var icons = require('./icons');

var MyTrace = React.createClass({
	getInitialState: function() {
		return {
			activeTab: 0,
			dataBlob: [],
			dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
		}
	},

	componentDidMount: function() {
		var dataBlob = [{
			title: '最美的时光在路上',
			content: '叶子的轨迹，叶子的轨迹，叶子的轨迹，叶子的轨迹，叶子的轨迹，叶子的轨迹，叶子的轨迹'
		}, {
			title: '最美的时光在路上',
			content: '叶子的轨迹'
		}, {
			title: '最美的时光在路上',
			content: '叶子的轨迹'
		}, {
			title: '最美的时光在路上',
			content: '叶子的轨迹'
		}];

		this.setState({
			dataBlob: dataBlob,
			dataSource: this.state.dataSource.cloneWithRows(dataBlob) 
		});
	},

	_tabCallback: function(index) {
		this.setState({
			activeTab: index
		})
	},

	_renderRow: function(rowData, sectionID, rowID) {
		return (
			<TouchableOpacity style={styles.itemView}>
				<View style={styles.subitemView}>
					<Text style={styles.titleText}>{rowData.title}</Text>
					<Text style={styles.contentText}>{rowData.content}</Text>
				</View>
				<Image style={styles.arrowIcon} source={icons.arrow} />
			</TouchableOpacity>
		);
	},

	_renderSeparator: function(sectionID, rowID) {
		if (rowID == this.state.dataBlob.length - 1) {
			return null;
		}

		return <View style={styles.separator}></View>
	},

	render: function() {
		return (
			<View style={styles.container}>
				<Tab datas={['全部', '我的', '收藏']}
					activeTab={this.state.activeTab}
					callback={[this._tabCallback, this._tabCallback, this._tabCallback]}
					styles={{tabView: styles.tabView}}/>
				<ListView contentContainerStyle={styles.scrollContainer}
					dataSource={this.state.dataSource}
					renderRow={this._renderRow}
					renderSeparator={this._renderSeparator} />
			</View>
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

	separator: {
		flex: 1,
		height: 1 / PixelRatio.get(),
		backgroundColor: stylesVar('dark-light')
	},

	arrowIcon: {
		width: 9,
		height: 15,
		marginLeft: 10
	},

	itemView: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 15,
		paddingHorizontal: 5
	},

	subitemView: {
		flex: 1,
		flexDirection: 'column'
	},

	titleText: {
		flex: 1,
		fontSize: 13,
		color: stylesVar('dark'),
		marginBottom: 8
	},

	contentText: {
		flex: 1,
		fontSize: 11,
		lineHeight: 13,
		color: stylesVar('dark-light-little')
	},

	abView: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0
	},

	scrollContainer: {
		borderTopWidth: 1 / PixelRatio.get(),
		borderBottomWidth: 1 / PixelRatio.get(),
		borderColor: stylesVar('dark-light'),
		paddingLeft: 10,
		backgroundColor: '#fff'
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
    	return '我的轨迹';
    }

    renderScene() {
    	return (
    		<MyTrace />
    	);
    }
}

module.exports = Route;