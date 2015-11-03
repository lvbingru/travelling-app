var React = require('react-native');

var  {
	View,
	Text,
	Image,
	TouchableOpacity,
	PixelRatio,
	StyleSheet,
	TextInput,
	SwitchIOS
} = React;

var Tab = require('./widgets/Tab');
var stylesVar = require('./stylesVar');
var ActivityApplySuccess = require('./ActivityApplySuccess');
var ActivityChooseCar = require('./ActivityChooseCar');
var activityApi = require('./api').activity;

var ActivityApply = React.createClass({
	getInitialState: function() {
		return {
			tab: 0,
			selfRideDatas: {},
			freeRideDatas: {}
		}
	},

	componentDidMount: function() {
		activityApi.fetchApplyInfo(this.props.id).then(function(datas) {
			this.setState({
				tab: datas.tab || 0,
				selfRideDatas: datas.selfRideDatas || {},
				freeRideDatas: datas.freeRideDatas || {}
			});
		}.bind(this), function(e) {
			console.log(e);
		});
	},

	selfRideHandle: function() {
		this.setState({
			tab: 0
		});
	},

	freeRideHandle: function() {
		this.setState({
			tab: 1
		});
	},

	submitHandle: function() {
		if (this.state.tab === 0) {
			var datas = this.state.selfRideDatas;
		} else {
			var datas = this.state.freeRideDatas;
		}
		console.log(datas);

		this.props.navigator.push(new ActivityApplySuccess({id: this.props.id}));
	},

	renderCommon: function() {
		var tab = this.state.tab;
		if (tab === 0) {
			var datas = this.state.selfRideDatas;
		} else {
			var datas = this.state.freeRideDatas;
		}
		return (
			<View>
				<View style={styles.separator}></View>
				<View style={styles.itemView}>
					<View style={styles.subItemViewLast}>
						<Text style={styles.subItemText}>手机号码</Text>
						<TextInput style={styles.subItemEdit} 
							onChangeText={(phone) => {
								datas.phone = phone; 
								if (tab === 0) {
									this.setState({
										selfRideDatas: datas
									});
								} else {
									this.setState({
										freeRideDatas: datas 
									});
								}
							}}
							value={datas.phone} 
							keyboardType='numeric'/>
					</View>
				</View>
				<View style={styles.titleView}>
					<Text style={styles.titleText}>出行人数</Text>
					{(() => {
						if (this.state.tab === 1) {
							return (
								<Text style={[styles.titleText, styles.titleExtra]}>目前空余座位：{datas.emptySeats || 0}</Text>
							);
						}
						return false
					})()}
				</View>
				<View style={styles.itemView}>
					<View style={styles.subItemView}>
						<Text style={styles.subItemText}>成人</Text>
						<TextInput style={styles.subItemEdit} 
							onChangeText={(peopleNum) => {
								datas.peopleNum = peopleNum;
								if (tab === 0) {
									this.setState({
										selfRideDatas: datas
									});
								} else {
									this.setState({
										freeRideDatas: datas
									})
								}
							}}
							value={datas.peopleNum} 
							keyboardType='numeric'/>
					</View>
					<View style={styles.subItemViewLast}>
						<Text style={styles.subItemText}>小孩</Text>
						<TextInput style={styles.subItemEdit} 
							onChangeText={(childNum) => {
								datas.childNum = childNum;
								if (tab === 0) {
									this.setState({
										selfRideDatas: datas
									});
								} else {
									this.setState({
										freeRideDatas: datas
									});
								}
							}}
							value={datas.childNum} 
							keyboardType='numeric'/>
					</View>
				</View>
			</View>
		);
	},

	addCarHandle: function() {
		var carType = this.state.selfRideDatas.carType || '';
		var carNumber = this.state.selfRideDatas.carNumber || '';

		var car = carType && carNumber ? (carType + ' （' + carNumber + '）') : '';
		this.props.navigator.push(new ActivityChooseCar({getCarHandle: this.getCarHandle, car: car}));
	},

	getCarHandle: function(data) {
		var index = data.indexOf(' ');

		if (index != -1) {
			var carType = data.substring(0, index);
			var carNumber = data.substring(index + 2, data.length - 1);
			var datas = this.state.selfRideDatas;
			datas.carType = carType;
			datas.carNumber = carNumber;
			this.setState({
				selfRideDatas: datas
			});
		}
	},

	renderContent: function() {
		var tab = this.state.tab;
		if (tab === 0) {
			var datas = this.state.selfRideDatas;
		} else {
			var datas = this.state.freeRideDatas;
		}
		if (tab === 0) {
			return (
				<View>
					<View style={styles.titleView}>
						<Text style={styles.titleText}>车辆信息</Text>
					</View>
					<View style={styles.itemView}>
						<View style={styles.subItemView}>
							<Text style={styles.subItemText}>出行车辆</Text>
							<TouchableOpacity style={styles.subItemContentView} onPress={this.addCarHandle}>
								<Text style={styles.carTypeText}>{datas.carType}</Text>
								<View style={styles.imageView}>
									<Image source={require('image!icon-arrow')} style={styles.iconArrow}></Image>
								</View>
							</TouchableOpacity>
						</View>
						<View style={styles.subItemViewLast}>
							<Text style={styles.subItemText}>车辆牌照</Text>
							<Text style={styles.subItemNoEdit}>{datas.carNumber}</Text>
						</View>
					</View>
					{this.renderCommon()}
					<View style={styles.separator}></View>
					<View style={styles.itemView}>
						<View style={styles.subItemView}>
							<Text style={styles.subItemText}>空余座位</Text>
							<TextInput style={styles.subItemEdit} 
								onChangeText={(seat) => {
									datas.seat = seat;
									this.setState({selfRideDatas: datas})
								}}
								value={datas.seat} 
								keyboardType='numeric'/>
						</View>
						<View style={styles.subItemViewLast}>
							<Text style={styles.subItemText}>是否愿意搭人</Text>
							<SwitchIOS style={styles.share}
								onValueChange={(share) => {
									datas.share = share;
									this.setState({selfRideDatas: datas})
								}}
								value={datas.share || true} />
						</View>
					</View>
				</View>
			);
		} else {
			return (
				<View>
					{this.renderCommon()}
					<View style={styles.separator}></View>
					<View style={styles.itemView}>
						<View style={styles.subItemViewLast}>
							<Text style={styles.subItemText}>能否驾驶车辆</Text>
							<SwitchIOS style={styles.share}
								onValueChange={(canDrive) => {
									datas.canDrive = canDrive;
									this.setState({freeRideDatas: datas})
								}}
								value={datas.canDrive || true} />
						</View>
					</View>
				</View>
			);
		}
	},

	render: function() {
		return (	
			<View style={styles.container}>
				<Tab datas={['自己开车', '搭顺风车']} 
					callbacks={[this.selfRideHandle, this.freeRideHandle]}
					styles={{tabTextFont: {fontSize: 14}}}
					activeTab={this.state.tab} />
				{this.renderContent()}
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

	titleView: {
		flex: 1,
		flexDirection: 'row',
		paddingHorizontal: 15,
		height: 45
	},

	titleText: {
		flex: 1,
		color: stylesVar('dark-mid'),
		fontSize: 11,
		fontWeight: '300',
		marginTop: 22
	},

	titleExtra: {
		textAlign: 'right'
	},

	itemView: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		borderColor: stylesVar('dark-light'),
		borderWidth: 1 / PixelRatio.get(),
		paddingLeft: 15,
		backgroundColor: '#fff'
	},

	subItemView: {
		flex: 1,
		flexDirection: 'row',
		height: 45,
		borderBottomWidth: 1 / PixelRatio.get(),
		borderColor: stylesVar('dark-light'),
		paddingRight: 15
	},

	subItemViewLast: {
		flex: 1,
		flexDirection: 'row',
		height: 45,
		paddingRight: 15
	},

	subItemText: {
		flex: 2,
		color: stylesVar('dark-mid'),
		fontWeight: '300',
		fontSize: 13,
		marginTop: 16
	},

	subItemContentView: {
		flex: 5,
		flexDirection: 'row'
	},

	subItemContentText: {
		flex: 5,
		color: stylesVar('dark'),
		fontWeight: '300',
		fontSize: 11,
		marginTop: 17
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

	subItemEdit: {
		flex: 5,
		color: stylesVar('dark'),
		fontWeight: '300',
		fontSize: 11
	},

	subItemNoEdit: {
		flex: 5,
		color: stylesVar('dark'),
		fontWeight: '300',
		fontSize: 11,
		paddingTop: 17
	},

	share: {
		height: 30,
		marginTop: 7
	},

	separator: {
		flex: 1,
		height: 20
	},

	submitText: {
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

class ActivityApplyRoute extends BaseRouteMapper {
	constructor(datas) {
		super();

		this.datas = datas;
	}

	renderLeftButton(route, navigator, index, navState) {
		return this._renderBackButton(route, navigator, index, navState);
	}

	renderRightButton(route, navigator, index, navState) {
		return (
			<TouchableOpacity onPress={() => this._root.submitHandle()} style={styles.rightButton}>
				<Text style={styles.submitText}>提交</Text>
			</TouchableOpacity>
		);
	}

	get style() {
		return this.styles.navBar;
	}

	get title() {
		return '我要报名';
	}

	renderScene(navigator) {
		return <ActivityApply ref={(component) => this._root = component} navigator={navigator} {...this.datas}/>
	}
}

module.exports = ActivityApplyRoute;