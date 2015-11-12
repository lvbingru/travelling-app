var _ = require('underscore');
var React = require('react-native');

var {
    AlertIOS,
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
var AV = require('./api').AV;

var labels = {
    carType: '车辆信息',
    carNumber: '车辆信息',
    phone: '手机号码',
    peopleNum: '成人数量'
}

var ActivityApply = React.createClass({
    getInitialState: function() {
        var origin = this.props.partner;
        var mode = origin ? 'edit' : 'create';
        var state = {
            mode: mode,
            activity: this.props.activity,
            origin: origin,

            applyType: origin ? origin.get('type') : 'selfRide',
            common: origin ? {
                phone: origin.get('phone'),
                peopleNum: origin.get('peopleNum'),
                childNum: origin.get('childNum')
            } : {},

            selfRideDatas: origin && origin.get('type') === 'selfRide' ? {
                carType: origin.get('car').model,
                carNumber: origin.get('car').number,
                leftSeats: origin.get('leftSeats'),
                share: origin.get('share')
            } : {},

            freeRideDatas: origin && origin.get('type') === 'freeRide' ? {
                canDrive: origin.get('canDrive')
            } : {}
        }

        if (state.selfRideDatas.share === undefined) {
            state.selfRideDatas.share = true;
        }

        if (state.freeRideDatas.canDrive === undefined) {
            state.freeRideDatas.canDrive = true;
        }

        return state;
    },

    componentDidMount: function() {
        Promise.all([
            AV.User.currentAsync(),
            this.state.activity.getLeftSeats()
        ]).then(function(values) {
            if (!this.isMounted()) {
                return;
            }

            var [user, leftSeats] = values;
            var phone = user.get('mobilePhoneNumber');
            var common = Object.assign({}, this.state.common, {
                phone
            });

            this.setState({
                user, common, leftSeats
            });
        }.bind(this)).catch(console.trace.bind(console));

        // TODO: edit apply info
        // activityApi.fetchApplyInfo(this.props.id).then(function(datas) {
        // 	this.setState({
        // 		tab: datas.tab || 0,
        // 		selfRideDatas: datas.selfRideDatas || {},
        // 		freeRideDatas: datas.freeRideDatas || {}
        // 	});
        // }.bind(this), function(e) {
        // 	console.log(e);
        // });
    },

    selfRideHandle: function() {
        this.setState({
            applyType: 'selfRide'
        })
    },

    freeRideHandle: function() {
        this.setState({
            applyType: 'freeRide'
        });
    },

    _validate: function(datas) {
        if (this.state.applyType === 'selfRide') {
            var key = _.find(['carType', 'carNumber', 'phone', 'peopleNum'], function(key) {
                return !datas[key]
            });

            if (key) {
                throw new Error(labels[key] + '没有填写');
            }
        } else {
            var key = _.find(['phone', 'peopleNum'], function(key) {
                return !datas[key]
            });
            if (key) {
                throw new Error(labels[key] + '没有填写');
            }
        }

        if (datas.peopleNum == 0) {
            throw new Error('成人数量不能为0');
        }
    },

    _edit: function() {
        var origin = this.state.origin;

        if (this.state.applyType === 'selfRide') {
            var datas = Object.assign({}, this.state.selfRideDatas, this.state.common);
        } else {
            var datas = Object.assign({}, this.state.freeRideDatas, this.state.common);
        }

        try {
            this._validate(datas);
        } catch (e) {
            AlertIOS.alert(e.message);
            return;
        }

        var {
            user,
            applyType
        } = this.state;

        activityApi.editApply(user, this.props.activity, origin, applyType, datas).then(function() {
            this.props.navigator.push(new ActivityApplySuccess);
        }.bind(this), function(e) {
            console.trace(e);
            AlertIOS.alert(e.message);
        });
    },

    _save: function() {
        if (this.state.applyType === 'selfRide') {
            var datas = Object.assign({}, this.state.selfRideDatas, this.state.common);
        } else {
            var datas = Object.assign({}, this.state.freeRideDatas, this.state.common);
        }

        try {
            this._validate(datas);
        } catch (e) {
            AlertIOS.alert(e.message);
            return;
        }

        var {
            user,
            applyType
        } = this.state;

        activityApi.apply(user, this.props.activity, applyType, datas).then(function() {
            this.props.navigator.push(new ActivityApplySuccess);
        }.bind(this), function(e) {
            console.trace(e);
            AlertIOS.alert(e.message);
        });
    },

    submitHandle: function() {
        if (this.state.mode === 'edit') {
            this._edit();
        } else {
            this._save();
        }
    },

    _calLeftSeats: function() {
        var peopleNum = this.state.common.peopleNum || 0;
        var childNum = this.state.common.childNum || 0;
        var leftSeats = this.state.leftSeats - peopleNum - childNum;
        return leftSeats;
    },

    _renderLeftSeats: function() {
        if (this.state.applyType === 'freeRide') {
            return (
                <Text style={[styles.titleText, styles.titleExtra]}>
                	目前空余座位：{this._calLeftSeats()}
                </Text>
            );
        } else {
            return null;
        }
    },

    _changeCommon: function(key) {
        return (value) => {
            this.setState({
                common: Object.assign({}, this.state.common, {
                	[key]: value
                })
            });
        }
    },

    renderCommon: function() {
        return (
            <View>
				<View style={styles.separator}></View>
				<View style={styles.itemView}>
					<View style={styles.subItemViewLast}>
						<Text style={styles.subItemText}>手机号码</Text>
						<TextInput style={styles.subItemEdit} 
							onChangeText={this._changeCommon('phone')}
							value={this.state.common.phone}
							keyboardType='numeric'/>
					</View>
				</View>
				<View style={styles.titleView}>
					<Text style={styles.titleText}>出行人数</Text>
					{this._renderLeftSeats()}
				</View>
				<View style={styles.itemView}>
					<View style={styles.subItemView}>
						<Text style={styles.subItemText}>成人</Text>
						<TextInput style={styles.subItemEdit} 
							onChangeText={this._changeCommon('peopleNum')}
							value={String(this.state.common.peopleNum)} 
							keyboardType='numeric'/>
					</View>
					<View style={styles.subItemViewLast}>
						<Text style={styles.subItemText}>小孩</Text>
						<TextInput style={styles.subItemEdit} 
							onChangeText={this._changeCommon('childNum')}
							value={String(this.state.common.childNum)} 
							keyboardType='numeric'/>
					</View>
				</View>
			</View>
        );
    },

    addCarHandle: function() {
        this.props.navigator.push(new ActivityChooseCar({
            getCarHandle: this.getCarHandle,
            car: this.state.selfRideDatas
        }));
    },

    getCarHandle: function(data) {
        this.setState({
            selfRideDatas: data
        });
    },

    renderContent: function() {
        var type = this.state.applyType;
        if (type === 'selfRide') {
            var datas = this.state.selfRideDatas;
        } else {
            var datas = this.state.freeRideDatas;
        }

        if (type === 'selfRide') {
            return (
                <View>
					<View style={styles.titleView}>
						<Text style={styles.titleText}>车辆信息</Text>
					</View>

					<View style={styles.itemView}>
						<View style={styles.subItemView}>
							<Text style={styles.subItemText}>出行车辆</Text>
							<TouchableOpacity style={styles.subItemContentView} 
								onPress={this.addCarHandle}>
								<Text style={styles.carTypeText}>{datas.carType}</Text>
								<View style={styles.imageView}>
									<Image source={require('image!icon-arrow')} 
										style={styles.iconArrow}/>
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
								onChangeText={(leftSeats) => {
									datas.leftSeats = leftSeats;
									this.setState({selfRideDatas: datas})
								}}
								value={datas.leftSeats} 
								keyboardType='numeric'/>
						</View>
						<View style={styles.subItemViewLast}>
							<Text style={styles.subItemText}>是否愿意搭人</Text>
							<SwitchIOS style={styles.share}
								onValueChange={(share) => {
									this.setState({
										selfRideDatas: Object.assign({}, datas, {share})
									});
								}}
								value={!!this.state.selfRideDatas.share} />
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
									this.setState({
										freeRideDatas: Object.assign({}, datas, {canDrive})
									})
								}}
								value={!!this.state.freeRideDatas.canDrive} />
						</View>
					</View>
				</View>
            );
        }
    },

    render: function() {
        if (!this.state.user) {
            return null;
        }

        return (
            <View style={styles.container}>
				<Tab datas={['自己开车', '搭顺风车']} 
					callbacks={[this.selfRideHandle, this.freeRideHandle]}
					styles={{tabTextFont: {fontSize: 14}}}
					activeTab={this.state.applyType === 'selfRide' ? 0 : 1} />
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

    get title() {
        return '我要报名';
    }

    renderScene(navigator) {
        return <ActivityApply ref={(component) => this._root = component} 
					navigator={navigator} {...this.datas}/>
    }
}

module.exports = ActivityApplyRoute;
