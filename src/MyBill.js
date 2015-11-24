var React = require('react-native');

var {
	StyleSheet,
	View,
	ScrollView,
	PixelRatio,
	Text,
	Image,
	TouchableOpacity
} = React;

var stylesVar = require('./stylesVar');
var icons = require('./icons');
var {
	Tag
} = require('./widgets');

var MyBill = React.createClass({
	getInitialState: function() {
		return {
			datas: []
		}
	},

	componentDidMount: function() {
		this.setState({
			datas: [{
				title: '云南行',
				publishDate: '2015-01-01 14:00',
				money: '1283.00',
				status: '1'
			}, {
				title: '云南行',
				publishDate: '2015-01-01 14:00',
				money: '1283.00',
				status: '0'
			}]
		});
	},

	_renderTag: function(status) {
		if (status === '1') {
			return (
				<Tag style={styles.tagStyleGray}>已清帐</Tag>
			)
		} else if (status === '0') {
			return (
				<Tag style={styles.tagStyleRed}>待清帐</Tag>
			);
		}
	},

	render: function() {
		return (
			<View style={styles.container}>
				<ScrollView>
					{this.state.datas.map(function(item, index) {
						return (
							<TouchableOpacity style={styles.itemView}>
								<View style={styles.subitemView}>
									<Text style={styles.titleText}>{item.title}</Text>
									<Text style={styles.dateView}>{item.publishDate}</Text>
								</View>
								<View style={styles.subitemView}>
									<View style={styles.moneyView}>
										<Text style={styles.moneyInfo}>共消费</Text>
										<Text style={styles.moneyText}>{' ¥' + item.money}</Text>
									</View>
									<View style={styles.moneyTabView}>
										{this._renderTag(item.status)}
									</View>
								</View>
								<Image style={styles.arrowIcon} source={icons.arrow} />
							</TouchableOpacity>
						);
					}.bind(this))}
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

	tagStyleGray: {
		borderColor: stylesVar('dark-mid'),
        color: stylesVar('dark-mid')
	},

	tagStyleRed: {
		borderColor: '#f03a47',
		color: '#f03a47'
	},

	arrowIcon: {
		marginLeft: 10,
		width: 9,
		height: 15
	},

	subitemView: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'stretch',
		justifyContent: 'space-between'
	},

	moneyView: {
		flex: 1, 
		flexDirection: 'row', 
		alignItems: 'flex-end', 
		justifyContent: 'flex-end',
		marginBottom: 5
	},

	moneyTabView: {
		flex: 1,
		alignItems: 'flex-end'
	},

	moneyInfo: {
		fontSize: 11,
		color: stylesVar('dark-light-little'),
		textAlign: 'right',
		lineHeight: 13
	},

	moneyText: {
		fontSize: 13,
		color: stylesVar('red'),
		textAlign: 'right',
	},

	titleText: {
		flex: 1,
		textAlign: 'left',
		fontSize: 13,
		color: stylesVar('dark'),
		marginBottom: 5
	},

	dateView: {
		flex: 1,
		textAlign: 'left',
		fontSize: 11,
		color: stylesVar('dark-mid')
	},

	itemView: {
		flex: 1,
		height: 65,
		flexDirection: 'row',
		borderBottomWidth: 1 / PixelRatio.get(),
		borderColor: stylesVar('dark-light'),
		paddingVertical: 15,
		paddingLeft: 15,
		paddingRight: 10,
		alignItems: 'center',
		justifyContent: 'center',
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
    	return '我的账单';
    }

    renderScene() {
    	return (
    		<MyBill />
    	);
    }
}

module.exports = Route;