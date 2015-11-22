var React = require('react-native');
var _ = require('underscore');

var {
	View,
	Text,
	Image,
	StyleSheet,
	ScrollView,
	PixelRatio,
	TouchableOpacity
} = React;

var icons = require('./icons');
var stylesVar = require('./stylesVar');
var AddOrEditCar = require('./AddOrEditCar');

var ActivityChooseCar = React.createClass({
	getInitialState: function() {
		var carArray = [{
			carType: '牧马人／2014款',
			carNumber: '京PN8S88'
		}, {
			carType: '牧马人／2015款',
			carNumber: '京PN8S88'
		}, {
			carType: '牧马人／2016款',
			carNumber: '京PN8S88'
		}];
		var chooseIndex = 0;
		var car = this.props.car;
		if (car) {
			chooseIndex = (function() {
				var length = carArray.length;
				for (var i = 0; i < length; i++) {
					if (car.carType == carArray[i].carType && car.carNumber == carArray[i].carNumber) {
						return i
					}
				}

				return 0
			}(this))
		}
		return {
			carArray: carArray,
			chooseIndex: chooseIndex
		};
	},

	changeChooseState: function(index) {
		this.setState({
			chooseIndex: index
		})
	},

	getChooseCar: function() {
		return this.state.carArray[this.state.chooseIndex];
	},

	editHandle: function() {
		this.props.navigator.push(new AddOrEditCar({
			car: this.state.carArray[this.state.chooseIndex],
			addCar: this.editCar
		}))
	},

	editCar: function(car) {
		var carArray = _.clone(this.state.carArray);
		carArray[this.state.chooseIndex] = car;

		this.setState({
			carArray: carArray
		})
	},

	addCar: function(car) {
		var carArray = _.clone(this.state.carArray);
		carArray.push(car);

		this.setState({
			carArray: carArray
		})
	},

	addHandle: function() {
		this.props.navigator.push(new AddOrEditCar({addCar: this.addCar}));
	},

	renderChooseImage: function(index) {
		if (index === this.state.chooseIndex) {
			return (
				<View style={styles.okView}>
					<Image style={styles.okImage}
						source={icons.ready} />
				</View>
			);
		}
	},

	render: function() {
		var lastIndex = this.state.carArray.length - 1;
		return (
			<View style={styles.container}>
				<ScrollView style={styles.content}>		
					<View style={styles.contentView}>	
					{this.state.carArray.map(function(item, index) {
						var itemStyle = lastIndex === index ?  styles.itemLast : styles.item;
						return (
							<TouchableOpacity style={itemStyle} activeOpacity={1} 
								onPress={this.changeChooseState.bind(this, index)}>
								<Text style={styles.text}>{item.carType + ' （' + item.carNumber + '）'}</Text>
								{this.renderChooseImage(index)}
							</TouchableOpacity>	
						);
					}.bind(this))}
					</View>
				</ScrollView>
				<TouchableOpacity onPress={this.addHandle} style={styles.bottomView}>
					<Text style={styles.bottomText}>添加车辆</Text>
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
		backgroundColor: '#f3f5f6'
	},

	content: {
		paddingTop: 20,
		backgroundColor: '#f3f5f6',
		borderWidth: 1 / PixelRatio.get(),
		borderColor: stylesVar('dark-light')
	},

	contentView: {
		backgroundColor: '#fff'
	},

	item: {
		flex: 1,
		flexDirection: 'row',
		height: 45,
		marginLeft: 15,
		borderBottomWidth: 1 / PixelRatio.get(),
		borderColor: stylesVar('dark-light')
	},

	itemLast: {
		flex: 1,
		flexDirection: 'row',
		height: 45,
		marginLeft: 15
	},

	text: {
		flex: 4,
		textAlign: 'left',
		fontWeight: '300',
		fontSize: 15,
		paddingTop: 15
	},

	okView: {
		flex: 1,
		alignItems: 'flex-end',
		marginRight: 15
	},

	okImage: {
		width: 18,
		height: 12,
		marginVertical: 17
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
	},

	editText: {
		fontSize: 14,
        fontWeight: '300',
        color: '#fff',
        marginTop: 15
	}
});

var BaseRouteMapper = require('./BaseRouteMapper');

class ActivityChooseCarRoute extends BaseRouteMapper {
	constructor(data) {
		super();

		this.getCarHandle = data.getCarHandle;
		this.car = data.car;
	}

	renderLeftButton(route, navigator, index, navState) {
		var callback = function() {
			var data = this._root.getChooseCar();
			this.getCarHandle(data);
			navigator.pop();
		}.bind(this);

		return this._renderBackButton(route, navigator, index, navState, callback);
	}

	renderRightButton(route, navigator, index, navState) {
        return (
            <TouchableOpacity onPress={() => {this._root.editHandle()}} style={styles.rightButton}>
				<Text style={styles.editText}>编辑</Text>
			</TouchableOpacity>
        );
    }

	get title() {
		return '选择出行车辆';
	}

	renderScene(navigator) {
		return <ActivityChooseCar ref={(component) => this._root = component} car={this.car} />
	}
}

module.exports = ActivityChooseCarRoute;