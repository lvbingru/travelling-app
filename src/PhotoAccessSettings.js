var React = require('react-native');

var {
	View,
	Text,
	Image,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	PixelRatio
} = React;

var stylesVar = require('./stylesVar');
var icons = require('./icons');

var PhotoAccessSettings = React.createClass({
	getInitialState: function() {
		return {
			checkedIndex: this.props.checkedIndex || 0
		}
	},

	_renderItem: function(index, title) {
		return (
			<TouchableOpacity style={styles.itemView} 
				onPress={this._press.bind(this, index)}
				activeOpacity={0.9}>
				<Text style={styles.titleView}>{title}</Text>
				{index === this.state.checkedIndex && <Image source={icons.ready} style={styles.imageView} />}
			</TouchableOpacity>
		)
	},

	_press: function(index) {
		this.setState({
			checkedIndex: index
		});
	},

	render: function() {
		return (
			<View style={styles.container}>
				<ScrollView contentContainerStyle={styles.scrollContainer}>
					{this._renderItem(0, '允许所有人可见')}
					<View style={styles.separator}></View>
					{this._renderItem(1, '只允许圈子内的人可见')}
					<View style={styles.separator}></View>
					{this._renderItem(2, '任何人不可见')}
				</ScrollView>
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

	itemView: {
		flex: 1,
		flexDirection: 'row',
		paddingLeft: 5,
		paddingRight: 15,
		height: 45,
		alignItems: 'center',
		justifyContent: 'center'
	},

	imageView: {
		width: 18,
		height: 12
	},

	separator: {
		flex: 1,
		height: 1 / PixelRatio.get(),
		backgroundColor: stylesVar('dark-light')
	},

	titleView: {
		flex: 1,
		fontSize: 13,
		color: stylesVar('dark')
	},

	scrollContainer: {
		marginTop: 20,
		flexDirection: 'column',
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
    	return '设置权限';
    }

    renderScene() {
    	return (
    		<PhotoAccessSettings />
    	);
    }
}

module.exports = Route;