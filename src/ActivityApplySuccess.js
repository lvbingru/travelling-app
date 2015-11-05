var _ = require('underscore');
var React = require('react-native');

var {
	View,
	Text,
	StyleSheet,
	PixelRatio,
	Image,
	TouchableOpacity
} = React;

var stylesVar = require('./stylesVar');

var ActivityApplySuccess = React.createClass({
	sendHandle: function() {
		// TODO: implement IM
	},

	render: function() {
		return (
			<View style={styles.container}>
				<View style={styles.view}>
					<View style={styles.iconView}>
						<Image style={styles.iconImage} source={require('image!ok-green')} />
					</View>
					<Text style={styles.text1}>报名提交成功！</Text>
					<Text style={styles.text2}>请耐心等待审核！</Text>
				</View>
				<View style={styles.finalView}>
					<Text style={styles.text3}>或者，立即给发起人</Text>
				</View>
				<TouchableOpacity onPress={this.sendHandle} style={styles.bottomView}>
					<Text style={styles.bottomText}>发消息</Text>
				</TouchableOpacity>
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
		backgroundColor: '#fff'
	},

	view: {
		marginTop: 75,
		alignItems: 'center',
		justifyContent: 'center'
	},

	iconView: {
		flex: 1,
		height: 61,
		marginBottom: 40,
		justifyContent: 'center'
	},

	iconImage: {
		width: 61,
		height: 61
	},

	text1: {
		flex: 1,
		textAlign: 'center',
		marginBottom: 20,
		fontWeight: '300',
		fontSize: 22,
		height: 22,
		color: stylesVar('dark')
	},

	text2: {
		flex: 1,
		textAlign: 'center',
		fontWeight: '300',
		fontSize: 13,
		height: 13,
		color: stylesVar('dark-light-little')
	},

	text3: {
		flex: 1,
		textAlign: 'center',
		fontWeight: '300',
		fontSize: 11,
		color: stylesVar('dark-light-little')
	},

	finalView: {
		position: 'absolute',
		bottom: 50,
		left: 0,
		right: 0,
		paddingBottom: 20
	},

	bottomView: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		height: 50,
		paddingVertical: 16,
		borderWidth: 1 / PixelRatio.get(),
		borderColor: stylesVar('dark-light')
	},

	bottomText: {
		flex: 1,
		textAlign: 'center',
		fontWeight: '300',
		fontSize: 16,
		color: stylesVar('blue')
	},

	closeText: {
		fontSize: 14,
		fontWeight: '300',
		color: '#fff',
		marginTop: 15
	},

	rightButton: {
		marginRight: 15
	}
});

var BaseRouteMapper = require('./BaseRouteMapper');

class ActivityApplySuccessRoute extends BaseRouteMapper {

	renderRightButton(route, navigator, index, navState) {
		function _close() {
			var routes = navigator.getCurrentRoutes();
			var route = routes[routes.length - 3];
			navigator.popToRoute(route);
		}

		return (
			<TouchableOpacity
				onPress={_close}
				style={styles.rightButton}>
				<Text style={styles.closeText}>关闭</Text>
			</TouchableOpacity>
		);
	}

	get title() {
		return '报名成功'
	}

	renderScene(navigator) {
		return <ActivityApplySuccess/>
	}
}

module.exports = ActivityApplySuccessRoute;