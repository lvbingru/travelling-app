var React = require('react-native');

var {
	View,
	Image,
	Text,
	StyleSheet,
	PixelRatio,
	ScrollView,
	TouchableOpacity
} = React;

var {
	Partner
} = require('./api/models');

var activityApi = require('./api').activity;
var stylesVar = require('./stylesVar');
var ActivityModal = require('./ActivityModal');
var {
	Tag,
	ItemInfo,
	UserInfo
}= require('./widgets');

var ActivityManage = React.createClass({
	getInitialState: function() {
		return {
			datas: []
		}
	},

	componentDidMount: function() {
		this.fetchDatas();
	},

	fetchDatas: function() {
		activityApi.fetchManageInfo(this.props.activity).then(function(datas) {
			this.setState({
				datas: datas
			})
		}.bind(this), function(e) {
			console.trace(e);
		});
	},

	renderItemDetail: function(item) {
		if (item.type === Partner.SELF_RIDE) {
			var datas = [{
				title: '出行车辆：',
				content: item.car.model
			}, {
				title: '牌照：',
				content: item.car.number
			}, {
				title: '手机号码：',
				content: item.phone
			}, {
				title: '出行人数：',
				content: '成人' + item.peopleNum + '／' + '儿童' + item.childNum
			}, {
				title: '空余座位：',
				content: item.leftSeats
			}, {
				title: '是否愿意搭人：',
				content: item.share ? '是': '否'
			}];
			return (
				<ItemInfo datas={datas} detailView={styles.detailView}/>
			);
		} else if (item.type === Partner.FREE_RIDE){
			var datas = [{
				title: '手机号码：',
				content: item.phone
			}, {
				title: '出行人数：',
				content: '成人' + item.peopleNum + '／' + '儿童' + item.childNum
			}, {
				title: '是否能驾驶车辆：',
				content: item.canDrive ? '是': '否'
			}]
			return (
				<ItemInfo datas={datas} detailView={styles.detailView} />
			);
		} else {
			console.error('partner type error!');
			return null;
		}
	},

	ensurePeopleNum: function(peopleNum, childNum, id) {
		this._modal.setDatas(true, peopleNum, childNum, id);
	},

	ensurePeopleHandle: function(peopleNum, childNum1, childNum2, id) {
		activityApi.ensureManage(id, peopleNum, childNum1, childNum2).then(function() {
			this.fetchDatas();
		}.bind(this), function(e) {
			console.error(e);
		});
	},

	changeStatus: function(id, status) {
		activityApi.changeManageStatus(id, status).then(function() {
			this.fetchDatas();
		}.bind(this), function(e) {
			console.error(e);
		});
	},

	renderBottom: function(item) {
		if (item.status === Partner.STATUS_APPROVAL) {
			return (
				<View style={styles.bottomView}>
					<TouchableOpacity style={styles.leftView}
						onPress={this.changeStatus.bind(this, item.id, Partner.STATUS_CANCELLED)}>
						<Text style={styles.leftText}>取消活动资格</Text>
					</TouchableOpacity >
					<TouchableOpacity style={styles.rightView}
						onPress={this.ensurePeopleNum.bind(this, item.peopleNum, item.childNum, item.id)}>
						<Text style={styles.rightText}>确认参加人数</Text>
					</TouchableOpacity>
				</View>
			);
		} else if (item.status === Partner.STATUS_IN_REVIEW) {
			return (
				<View style={styles.bottomView}>
					<TouchableOpacity style={styles.leftView}
						onPress={this.changeStatus.bind(this, item.id, Partner.STATUS_REFUSED)}>
						<Text style={styles.leftText}>不同意参加</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.rightView}
						onPress={this.changeStatus.bind(this, item.id, Partner.STATUS_APPROVAL)}>
						<Text style={styles.rightText}>同意参加</Text>
					</TouchableOpacity>
				</View>
			);
		} else {
			return (
				<View style={styles.lineView}></View>
			);
		}
	},

	renderTag: function(status) {
		if (status === Partner.STATUS_IN_REVIEW) {
			return (<Tag key='status' style={styles.tagGreen}>审核中</Tag>);
		} else if (status === Partner.STATUS_REFUSED) {
			return (<Tag key='status' style={styles.tagRed}>未通过审核</Tag>);
		} else if (status === Partner.STATUS_APPROVAL) {
			return (<Tag key='status' style={styles.tagGreen}>已通过审核</Tag>);
		} else if (status === Partner.STATUS_CANCELLED) {
			return (<Tag key='status' style={styles.tagRed}>已取消活动资格</Tag>);
		} else if (status === Partner.STATUS_CONFIRMED) {
			return (<Tag key='status' style={styles.tagGreen}>确认参加</Tag>);
		}
	},

	render: function() {
		var datas = this.state.datas;

		return (
			<View style={styles.container}>
				<ScrollView style={styles.contentView}>
				{datas.map(function(item) {
					return (
						<View style={styles.itemView}>
							<View style={styles.user}>
								<UserInfo style={styles.info}
									username={item.user && item.user.username}
									publishDate={item.user && item.user.publishDate}
									usernameText={styles.usernameText}
									publishDateText={styles.publishDateText}
									avatar={item.user && item.user.avatar ? {uri: item.user.avatar}: require('image!avatar-placeholder')}/>
								<View style={styles.status}>
									{this.renderTag(item.status)}
								</View>
							</View>
							{this.renderItemDetail(item)}
							{this.renderBottom(item)}
							<View style={styles.separator}></View>
						</View>
					);
				}.bind(this))}
				</ScrollView>
				<ActivityModal ref={component => this._modal = component} 
					ensurePeople={this.ensurePeopleHandle} />
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

	contentView: {
		flex: 1,
		flexDirection: 'column',
		backgroundColor: '#f3f5f6'
	},

	itemView: {
		flex: 1,
		flexDirection: 'column',
		backgroundColor: '#fff'
	},

	separator: {
		flex: 1,
		height: 20,
		backgroundColor: '#f3f5f6'
	},

	user: {
		flex: 1,
		flexDirection: 'row',
		paddingTop: 20,
		paddingBottom: 15,
		paddingHorizontal: 15,
		alignItems: 'center',
		borderWidth: 1 / PixelRatio.get(),
		borderColor: stylesVar('dark-light')
	},

	info: {
		flex: 2,
		justifyContent: 'flex-start'
	},

	status: {
		flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
	},

	tagGreen: {
		color: stylesVar('green'),
        borderColor: stylesVar('green')
	},

	tagRed: {
		color: stylesVar('red'),
		borderColor: stylesVar('red')
	},

	usernameText: {
		color: stylesVar('dark')
	},

	publishDateText: {
		color: stylesVar('dark-mid-light')
	},

	bottomView: {
		flex: 1,
		flexDirection: 'row',
		borderWidth: 1 / PixelRatio.get(),
		borderColor: stylesVar('dark-light')
	},

	lineView: {
		flex: 1,
		flexDirection: 'row',
		height: 1 / PixelRatio.get(),
		backgroundColor: stylesVar('dark-light')
	},

	leftView: {
		flex: 1,
		borderRightWidth: 1 / PixelRatio.get(),
		borderRightColor: stylesVar('dark-light'),
		justifyContent: 'center'
	},

	rightView: {
		flex: 1,
		borderRightWidth: 1 / PixelRatio.get(),
		borderRightColor: stylesVar('dark-light'),
		justifyContent: 'center'
	},

	leftText: {
		textAlign: 'center',
		fontSize: 13,
		color: stylesVar('red'),
		fontWeight: '300',
		paddingVertical: 16
	},	

	rightText: {
		flex: 1,
		textAlign: 'center',
		fontSize: 13,
		color: stylesVar('blue'),
		fontWeight: '300',
		paddingVertical: 16 
	},

	detailView: {
		paddingBottom: 20
	}
});

var BaseRouteMapper = require('./BaseRouteMapper');

class ActivityManageRoute extends BaseRouteMapper {
	constructor(data) {
		super();

		this.activity = data.activity;
	}

	renderLeftButton(route, navigator, index, navState) {
		return this._renderBackButton(route, navigator, index, navState);
	}

	get style() {
		return this.styles.navBar;
	}

	get title() {
		return '报名信息'
	}

	renderScene(navigator) {
		return <ActivityManage activity={this.activity} />
	}
}

module.exports = ActivityManageRoute;