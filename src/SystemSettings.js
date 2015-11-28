var React = require('react-native');

var {
	View,
	Text,
	Image,
	ScrollView,
	StyleSheet,
	PixelRatio,
	TouchableOpacity,
	AlertIOS
} = React;

var api = require('./api');
var user = api.user;
var store = require('./store');
var {updateSession} = require('./actions');

var stylesVar = require('./stylesVar');
var icons = require('./icons');
var itemStyles = require('./styles/ItemStyles');
var itemViewMixins = require('./mixins/ItemViewMixins');

var SystemSettings = React.createClass({
	mixins: [
		itemViewMixins
	],

	_logout: function() {
        user.logout().then(function() {
            store.dispatch(updateSession({
                user: null
            }));
        }, function(e) {
            console.trace(e);
            return AlertIOS.alert(e.reason);
        });
    },

	render: function() {
		return (
			<View style={styles.container}>
				<ScrollView>
					<View style={itemStyles.separatorBlock}></View>
					<View style={itemStyles.itemView}>
						{this._renderItemWithText('新消息通知', '已开启')}
					</View>
					<Text style={styles.infoView}>
						如果你要关闭或开启新消息通知，请在iphone的“设置” - “通知”功能中，找到应用程序“XXX”修改
					</Text>

					<View style={itemStyles.itemView}>
						{this._renderItemWithArrowText('意见反馈')}
					</View>
					<View style={itemStyles.separatorBlock}></View>
					<View style={itemStyles.itemView}>
						{this._renderItemWithText('版本更新', '已是最新版本')}
						<View style={itemStyles.separator}></View>

						{this._renderItemWithArrowText('喜欢城外？去打分吧')}
						<View style={itemStyles.separator}></View>

						{this._renderItemWithArrowText('关于城外', '1.3.4')}
						<View style={itemStyles.separator}></View>

						{this._renderItemWithArrowText('特别说明')}
					</View>
				</ScrollView>
				<View style={styles.bottomView}>
					<TouchableOpacity style={styles.bottomBar} 
						activeOpacity={0.9}
						onPress={this._logout} >
						<Text style={styles.exitText}>退出登录</Text>
					</TouchableOpacity>
				</View>
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

	bottomBar: {
		flex: 1,
		height: 50,
		borderColor: stylesVar('dark-light'),
		borderTopWidth: 1 / PixelRatio.get(),
		borderBottomWidth: 1 / PixelRatio.get(),
		alignItems: 'center',
		justifyContent: 'center'
	},

	infoView: {
		flex: 1,
		marginHorizontal: 15,
		marginTop: 12,
		marginBottom: 20,
		fontSize: 11,
		color: stylesVar('dark-mid')
	},
	
	bottomView: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: '#fff'
	},

	exitText: {
		color: stylesVar('red'),
		fontSize: 16
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
    	return '设置';
    }

    renderScene() {
    	return (
    		<SystemSettings />
    	);
    }
}

module.exports = Route;