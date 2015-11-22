var React = require('react-native');

var {
	View,
	Text,
	Image,
	ScrollView,
	StyleSheet,
	PixelRatio
} = React;

var stylesVar = require('./stylesVar');

var SystemSettings = React.createClass({
	render: function() {
		return (
			<View style={styles.container}>
				<ScrollView>
					<View style={styles.separatorBlock}></View>
					<View style={styles.itemView}>
						<View style={styles.subItemView}>
							<Text style={styles.leftText}>新消息通知</Text>
							<Text style={styles.rightText}>已开启</Text>
						</View>
					</View>
					<Text style={styles.infoView}>
						如果你要关闭或开启新消息通知，请在iphone的“设置” - “通知”功能中，找到应用程序“XXX”修改
					</Text>
					<View style={styles.itemView}>
						<View style={styles.subItemView}>
							<Text style={styles.leftText}>意见反馈</Text>
							<View style={styles.rightView}>
								<Image source={require('image!icon-arrow')}
									style={styles.arrowIcon} />
							</View>
						</View>
					</View>
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

	arrowIcon: {
		width: 9,
		height: 15
	},

	rightView: {
		flex: 1,
		alignItems: 'flex-end',
		justifyContent: 'center',
		marginRight: 10
	},

	flex1View: {
		flex: 1
	},

	infoView: {
		flex: 1,
		marginHorizontal: 15,
		marginVertical: 15,
		fontSize: 11,
		color: stylesVar('dark-mid')
	},

	subItemView: {
		flex: 1,
		flexDirection: 'row',
		height: 45,
		justifyContent: 'center',
		alignItems: 'center'
	},

	leftText: {
		flex: 1,
		paddingLeft: 5,
		color: stylesVar('dark'),
		fontSize: 13
	},

	rightText: {
		flex: 1,
		paddingRight: 15,
		textAlign: 'right',
		fontSize: 11,
		color: stylesVar('dark-light-little')
	},

	itemView: {
		flex: 1,
		paddingLeft: 10,
		borderTopWidth: 1 / PixelRatio.get(),
		borderBottomWidth: 1 / PixelRatio.get(),
		borderColor: stylesVar('dark-light'),
		backgroundColor: '#fff'
	},

	separatorBlock: {
		flex: 1,
		height: 20,
		backgroundColor: '#f3f5f6'
	}
});

var BaseRouteMapper = require('./BaseRouteMapper');
class Route extends BaseRouteMapper {
	constructor(nextStep) {
        super();
        
        this.activeTab = 0;
        this.nextStepParent = nextStep;
    }

    renderLeftButton() {
        return this._renderBackButton.apply(this, arguments);
    }

    get title() {
    	return '设置';
    }

    renderScene(navigator) {
    	return (
    		<SystemSettings />
    	);
    }
}

module.exports = Route;