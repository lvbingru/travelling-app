var React = require('react-native');
var _ = require('underscore');

var {
	View,
	Text,
	Image,
	StyleSheet,
	PixelRatio,
	TextInput,
	TouchableOpacity
} = React;

var icons = require('./icons');
var stylesVar = require('./stylesVar');
var ChooseCarType = require('./ChooseCarType');

var AddOrEditCar = React.createClass({
	getInitialState: function() {
		return {
			car: this.props.car || {}
		}
	},

	chooseCarType: function() {
		this.props.navigator.push(new ChooseCarType(this.setCarType));
	},

	getCar: function() {
		return this.state.car;
	},

	setCarType: function(carType) {
		var car = _.clone(this.state.car);
		car.carType = carType;
		this.setState({car});
	},

	setCarNumber: function(carNumber) {
		var car = _.clone(this.state.car);
		car.carNumber = carNumber;
		this.setState({car});
	},

	render: function() {
		var car = this.state.car;

		return (
			<View style={styles.container}>
				<View>
					<View style={styles.itemView}>
						<View style={styles.subItemView}>
							<Text style={styles.subItemText}>出行车辆</Text>
							<TouchableOpacity style={styles.subItemContentView} 
								onPress={this.chooseCarType}>
								<Text style={styles.carTypeText}>{car.carType}</Text>
								<View style={styles.imageView}>
									<Image source={icons.arrow} 
										style={styles.iconArrow}/>
								</View>
							</TouchableOpacity>
						</View>
						<View style={styles.subItemViewLast}>
							<Text style={styles.subItemText}>车辆牌照</Text>
							<TextInput style={styles.subItemEdit} 
								onChangeText={this.setCarNumber}
								value={car.carNumber}/>
						</View>
					</View>
				</View>
				<TouchableOpacity style={styles.bottomView}>
					<Text style={styles.bottomText}>删除</Text>
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

	itemView: {
		flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        borderColor: stylesVar('dark-light'),
        borderWidth: 1 / PixelRatio.get(),
        paddingLeft: 15,
        backgroundColor: '#fff',
        marginTop: 20
	},

	subItemView: {
		flex: 1,
        flexDirection: 'row',
        height: 45,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderColor: stylesVar('dark-light'),
        paddingRight: 15
	},

	subItemContentView: {
		flex: 5,
        flexDirection: 'row'
	},

	subItemText: {
		flex: 2,
        color: stylesVar('dark-mid'),
        fontWeight: '300',
        fontSize: 13,
        marginTop: 16
	},

	carTypeText: {
		flex: 4,
        color: stylesVar('dark'),
        fontWeight: '300',
        fontSize: 11,
        marginTop: 17
	},

	imageView: {
		flex: 1,
        alignItems: 'flex-end'
	},

	iconArrow: {
		width: 9,
        height: 15,
        marginTop: 15
	},

	subItemViewLast: {
		flex: 1,
        flexDirection: 'row',
        height: 45,
        paddingRight: 15
	},

	subItemEdit: {
        flex: 5,
        color: stylesVar('dark'),
        fontWeight: '300',
        fontSize: 11
    },

    bottomView: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		height: 50,
		paddingVertical: 16,
		backgroundColor: '#fff',
		borderWidth: 1 / PixelRatio.get(),
		borderColor: stylesVar('dark-light')
	},

	bottomText: {
		flex: 1,
		textAlign: 'center',
		fontWeight: '300',
		fontSize: 16,
		color: stylesVar('red')
	},

	editText: {
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

class AddOrEditCarRoute extends BaseRouteMapper {
	constructor(data) {
		super();

		this.car = data && data.car;
		this.addCar = data && data.addCar;
	}

	renderLeftButton(route, navigator, index, navState) {
		return this._renderBackButton(route, navigator, index, navState);
	}

	renderRightButton(route, navigator, index, navState) {
        return (
            <TouchableOpacity style={styles.rightButton}
            	onPress={this.saveHandle.bind(this, navigator)}>
				<Text style={styles.editText}>保存</Text>
			</TouchableOpacity>
        );
    }

    saveHandle(navigator) {
    	var car = this._root.getCar();
    	this.addCar(car);
    	navigator.pop();
    }

	get title() {
		return '添加/编辑车辆';
	}

	renderScene(navigator) {
		return <AddOrEditCar ref={(component) => this._root = component} car={this.car} />
	}
}

module.exports = AddOrEditCarRoute;