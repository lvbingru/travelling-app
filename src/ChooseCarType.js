var React = require('react-native');

var {
	View,
	Text,
	Image,
	StyleSheet,
	ListView,
	PixelRatio,
	TouchableOpacity
} = React;

var stylesVar = require('./stylesVar');

var ChooseCarType = React.createClass({
	getInitialState: function() {
		return {
			dataSource: new ListView.DataSource({
    			rowHasChanged: (r1, r2) => r1 !== r2,
    			sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    		}),
		}
	},

	componentDidMount: function() {
		//todo get datas
		var dataBlob = {
			'A': [
				'阿尔法罗密欧',
				'阿斯顿·马丁',
				'一汽-大众奥迪',
				'阿斯顿·马丁'
			],
			'B': [
				'阿尔法罗密欧',
				'阿斯顿·马丁',
				'一汽-大众奥迪',
				'阿斯顿·马丁'
			],
			'C': [
				'阿尔法罗密欧',
				'阿斯顿·马丁',
				'一汽-大众奥迪',
				'阿斯顿·马丁'
			],
			'D': [
				'阿尔法罗密欧',
				'阿斯顿·马丁',
				'一汽-大众奥迪',
				'阿斯顿·马丁'
			],
			'E': [
				'阿尔法罗密欧',
				'阿斯顿·马丁',
				'一汽-大众奥迪',
				'阿斯顿·马丁'
			],
			'F': [
				'阿尔法罗密欧',
				'阿斯顿·马丁',
				'一汽-大众奥迪',
				'阿斯顿·马丁'
			]
		}
		this.setState({
			dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob)
		});
	},

	renderCell: function(rowData, sectionID, rowID, highlightRow) {
		return (
			<TouchableOpacity style={styles.subitemView}>
				<Text style={styles.subitemText}>{rowData}</Text>
			</TouchableOpacity>
		);
	},

	renderSectionHeader: function(sectionData, sectionID) {
		return (
			<View style={styles.titleView}>
				<Text style={styles.titleText}>{sectionID}</Text>
			</View>
		);
	},

	renderSeparator: function() {
		return (
			<View style={styles.separator}></View>
		);
	},

	render: function() {
		return (
			<View style={styles.container}>
				<ListView
					dataSource={this.state.dataSource}
					renderRow={this.renderCell}
					renderSectionHeader={this.renderSectionHeader}
					style={styles.contentView}
					renderSeparator={this.renderSeparator} />
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

	contentView: {
		flex: 1,
		flexDirection: 'column'
	},

	titleView: {
		flex: 1,
		paddingLeft: 15,
		height: 30,
		paddingTop: 10,
		borderBottomWidth: 1 / PixelRatio.get(),
		borderTopWidth: 1 / PixelRatio.get(),
		borderColor: stylesVar('dark-light'),
		backgroundColor: '#f3f5f6'
	},

	titleText: {
		fontSize: 10,
		fontWeight: '300',
		color: stylesVar('dark')
	},

	subitemView: {
		flex: 1,
		flexDirection: 'column',
		paddingLeft: 15,
		paddingTop: 16,
		height: 45,
		backgroundColor: '#fff'
	},

	subitemText: {
		fontSize: 13,
		color: stylesVar('dark'),
		fontWeight: '300'
	},

	separator: {
		flex: 1,
		height: 1 / PixelRatio.get(),
		backgroundColor: stylesVar('dark-light'),
		borderLeftWidth: 10,
		borderColor: '#fff'
	}
});

var BaseRouteMapper = require('./BaseRouteMapper');

class ChooseCarTypeRoute extends BaseRouteMapper {
	constructor() {
		super();
	}

	renderLeftButton(route, navigator, index, navState) {
		return this._renderBackButton(route, navigator, index, navState);
	}

	get title() {
		return '选择车辆品牌';
	}

	renderScene(navigator) {
		return <ChooseCarType ref={(component) => this._root = component} />
	}
}

module.exports = ChooseCarTypeRoute;