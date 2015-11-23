var React = require('react-native');
var _ = require('underscore');

var {
	View,
	Text,
	Image,
	StyleSheet,
	ListView,
	PixelRatio,
	TouchableOpacity,
	Dimensions,
	Animated
} = React;

var stylesVar = require('./stylesVar');
var activityApi = require('./api').activity;
var deviceWidth = Dimensions.get('window').width;
var TRANSLATEX = deviceWidth * 2 / 3;

var {
	LettersView
} = require('./widgets');

var ChooseCarType = React.createClass({
	getInitialState: function() {
		this.refsObject = {};
		return {
			dataSource: new ListView.DataSource({
    			rowHasChanged: (r1, r2) => { return r1.name !== r2.name || r1.active !== r2.active },
    			sectionHeaderHasChanged: (s1, s2) => { return s1 !== s2 }
    		}),
    		dataSourceCover: new ListView.DataSource({
    			rowHasChanged: (r1, r2) => { return r1 !== r2 },
    			sectionHeaderHasChanged: (s1, s2) => { return s1 !== s2 }
    		}),
    		dataBlob: {},
    		dataBlobCover: {},
    		translateX: new Animated.Value(0)
		}
	},

	componentDidMount: function() {
		activityApi.fetchAllCarType().then(function(dataBlob) {
			this.setState({
				dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob),
				dataBlob: dataBlob,
				dataSourceCover: this.state.dataSourceCover.cloneWithRowsAndSections({})
			});
		}.bind(this), function(e){
			console.error(e);
		});
	},

	pressRow: function(sectionID, rowID) {
		var activeSectionID = this.state.activeSectionID;
		var activeRowID = this.state.activeRowID;
		var dataBlob = _.extend({}, this.state.dataBlob);
		var d = dataBlob[sectionID];
		dataBlob[sectionID] = d.slice();
		var a = d[rowID];
		dataBlob[sectionID][rowID] = _.extend({}, a, {active: true});

		if (activeSectionID && activeRowID) {
			d = dataBlob[activeSectionID];
			dataBlob[activeSectionID] = d.slice();
			a = d[activeRowID];
			dataBlob[activeSectionID][activeRowID] = _.extend({}, a, {active: false});
		}
		
		this.setState({
			dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob),
			dataBlob: dataBlob,
			activeSectionID: sectionID,
			activeRowID: rowID
		}, function() {
			activityApi.fetchSubitemCarType(dataBlob[sectionID][rowID].name).then(function(dataBlobCover) {
				this.setState({
					dataBlobCover: dataBlobCover,
					dataSourceCover: this.state.dataSourceCover.cloneWithRowsAndSections(dataBlobCover)
				})
				Animated.timing(
					this.state.translateX,
					{toValue: 1}
				).start();
			}.bind(this), function(e) {
				console.error(e);
			});
		}.bind(this))
	},

	renderCell: function(rowData, sectionID, rowID, highlightRow) {
		var rowIDstyle = styles.subitemText;
		if (this.state.activeSectionID === sectionID && this.state.activeRowID === rowID) {
			rowIDstyle = [styles.subitemText, styles.activeSubitemText];
		}
		return (
			<TouchableOpacity style={styles.subitemView} activeOpacity={0.9} 
				onPress={this.pressRow.bind(this, sectionID, rowID)}>
				<Text style={rowIDstyle}>{rowData}</Text>
			</TouchableOpacity>
		);
	},

	selectedCarType: function(sectionID, rowID) {
		var carType = this.state.dataBlobCover[sectionID][rowID];
		this.props.setCarType(carType);
		this.props.navigator.pop();
	},

	renderCoverCell: function(rowData, sectionID, rowID, highlightRow) {
		return (
			<TouchableOpacity style={styles.subitemView} reactOpacity={0.9} 
				onPress={this.selectedCarType.bind(this, sectionID, rowID)}>
				<Text style={styles.subitemText}>{rowData}</Text>
			</TouchableOpacity>
		);
	},

	renderSectionHeader: function(sectionData, sectionID) {
		return (
			<View style={styles.titleView} ref={(component) => this.refsObject[sectionID] = component}>
				<Text style={styles.titleText}>{sectionID}</Text>
			</View>
		);
	},

	renderSeparator: function() {
		return (
			<View style={styles.separator}></View>
		);
	},

	measureHandle: function(fx, fy, width, height, px, py) {
		this._root.refs.listviewscroll.scrollTo(fy);
	},

	onLetterPress: function(letter) {
		this.refsObject[letter] && this.refsObject[letter].measure(this.measureHandle);
	},

	render: function() {
		var coverStyles = {
			transform: [{
				translateX: this.state.translateX.interpolate({
					inputRange: [0, 1],
					outputRange: [TRANSLATEX, 0]
				})
			}]
		}
		return (
			<View style={styles.container}>
				<View style={styles.containerView}>
					<ListView
						dataSource={this.state.dataSource}
						renderRow={this.renderCell}
						renderSectionHeader={this.renderSectionHeader}
						style={styles.contentView}
						renderSeparator={this.renderSeparator}
						ref={(component) => this._root = component} />
					<View style={styles.lettersView}>
						<LettersView style={styles.letters} 
							onLetterPress={this.onLetterPress} />
					</View>
				</View>
				<Animated.View style={[styles.coverContainer, coverStyles]} >
					<ListView
						dataSource={this.state.dataSourceCover}
						renderRow={this.renderCoverCell}
						renderSectionHeader={this.renderSectionHeader}
						style={styles.contentView}
						renderSeparator={this.renderSeparator}
						ref={(component) => this._root = component} />
				</Animated.View>
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

	coverContainer: {
		position: 'absolute',
		top: 0,
		width: TRANSLATEX,
		right: 0,
		bottom: 0,
		backgroundColor: '#f3f5f6'
	},

	containerView: {
		flex: 1,
		flexDirection: 'row' 
	},

	contentView: {
		flex: 1,
		flexDirection: 'column',
		borderLeftWidth: 1 / PixelRatio.get(),
		borderRightWidth: 1 / PixelRatio.get(),
		borderColor: stylesVar('dark-light')
	},

	contentCoverView: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0
	},

	lettersView: {
		width: 15,
		paddingHorizontal: 2,
		alignItems: 'center',
		backgroundColor: '#fff'
	},

	letters: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center'
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

	activeSubitemText: {
		color: stylesVar('blue')
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
	constructor(setCarType) {
		super();

		this.setCarType = setCarType;
	}

	renderLeftButton(route, navigator, index, navState) {
		return this._renderBackButton(route, navigator, index, navState);
	}

	get title() {
		return '选择车辆品牌';
	}

	renderScene(navigator) {
		return <ChooseCarType ref={(component) => this._root = component} 
					setCarType={this.setCarType}/>
	}
}

module.exports = ChooseCarTypeRoute;