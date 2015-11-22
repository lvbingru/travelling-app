var React = require('react-native');
var _ = require('underscore');

var {
	View,
	Text,
	Image,
	TouchableOpacity,
	ScrollView,
	StyleSheet,
	PixelRatio
} = React;

var itemStyles = require('./styles/ItemStyles');
var icons = require('./icons');
var stylesVar = require('./stylesVar');
var itemViewMixins = require('./mixins/ItemViewMixins');
var AddOrEditCar = require('./AddOrEditCar');

var Profile = React.createClass({
	mixins: [
		itemViewMixins
	],

	getInitialState: function() {
		return {
			carArray: [
			]
		}
	},

	componentDidMount: function() {
		this.setState({
			carArray: [{
				carType: '牧马人／2014款',
				carNumber: '京PN8S88'
			}, {
				carType: '牧马人／2014款',
				carNumber: '京PN8S88'
			}, {
				carType: '牧马人／2014款',
				carNumber: '京PN8S88'
			}]
		});
	},

	_addCarCallback: function(car) {
		var carArray = _.clone(this.state.carArray);
		carArray.push(car);
		this.setState({
			carArray: carArray
		})
	},

	_addCar: function() {
		this.props.navigator.push(new AddOrEditCar({
			addCar: this._addCarCallback 
		}));
	},

	_editCarCallback: function(index, car) {
		var carArray = _.clone(this.state.carArray);
		carArray[index] = car;
		this.setState({
			carArray: carArray
		})
	},

	_editCar: function(car, index) {
		this.props.navigator.push(new AddOrEditCar({
			car: car,
			addCar: this._editCarCallback.bind(this, index)
		}));
	},

	_renderCar: function() {
		var lastIndex = this.state.carArray.length - 1;
		
		return (
			<View style={itemStyles.itemView}>
				{this.state.carArray.map(function(item, index) {
					if (index !== lastIndex) {
						return (
							<View>
								{this._renderItemWithArrowText(item.carType, item.carNumber, this._editCar.bind(this, item, index))}
								<View style={itemStyles.separator}></View>
							</View>
						);
					} else {
						return this._renderItemWithArrowText(item.carType, item.carNumber, this._editCar.bind(this, item, index));
					}
				}.bind(this))}
				<TouchableOpacity style={styles.addCarView}
					onPress={this._addCar}>
					<Text style={styles.addCarText}>添加车辆</Text>
				</TouchableOpacity>
			</View>
		);
	},

	render: function() {
		return (
			<View style={styles.container}>
				<ScrollView>
					<View style={itemStyles.separatorBlock}></View>
					<View style={itemStyles.itemView}>
						<View style={[itemStyles.subItemView, styles.avatarView]}>
							<Text style={itemStyles.leftText}>头像</Text>
							<View style={itemStyles.rightView}>
								<Image style={[styles.avatar, itemStyles.marginRight10]} source={icons.avatar} />
								<Image style={itemStyles.arrowIcon} source={icons.arrow} />
							</View>
						</View>
						<View style={itemStyles.separator}></View>
						{this._renderItemWithArrowText('昵称', '叶子')}
						<View style={itemStyles.separator}></View>
						<View style={itemStyles.subItemView}>
							<Text style={itemStyles.leftText}>我的二维码</Text>
							<View style={itemStyles.rightView}>
								<Image style={[styles.codeIcon, itemStyles.marginRight10]} source={icons.code} />
								<Image style={itemStyles.arrowIcon} source={icons.arrow} />
							</View>
						</View>
						<View style={itemStyles.separator}></View>
						{this._renderItemWithArrowText('性别', '女')}
				
						<View style={itemStyles.separator}></View>
						{this._renderItemWithArrowText('年龄', '35')}
						
						<View style={itemStyles.separator}></View>
						{this._renderItemWithArrowText('手机号', '152 1050 8888')}
						
						<View style={itemStyles.separator}></View>
						{this._renderItemWithText('我的等级', '等级1')}
					</View>
					<View style={itemStyles.separatorBlock}></View>
					<View style={itemStyles.itemView}>
						{this._renderItemWithArrowText('取得驾照时间', '2010年10月')}
					</View>
					<View style={itemStyles.separatorBlock}></View>
					{this._renderCar()}
					<View style={itemStyles.separatorBlock}></View>
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

	avatarView: {
		height: 90
	},

	avatar: {
		width: 60,
		height: 60,
		borderRadius: 2
	},

	codeIcon: {
		width: 18,
		height: 18
	},

	addCarView: {
		flex: 1,
		height: 45,
		alignItems: 'center',
		justifyContent: 'center',
		borderTopWidth: 1 / PixelRatio.get(),
		borderColor: stylesVar('dark-light')
	},

	addCarText: {
		fontSize: 16,
		color: stylesVar('blue')
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
    	return '个人资料';
    }

    renderScene() {
    	return (
    		<Profile />
    	);
    }
}

module.exports = Route;