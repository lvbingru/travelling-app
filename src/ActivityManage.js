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
		activityApi.fetchManageInfo().then(function(datas) {
			this.setState({
				datas: datas
			})
		}.bind(this), function(e) {
			console.trace(e);
		});
	},

	renderItemDetail: function(item) {
		if (item.hasCar === '1') {
			var datas = [{
				title: '出行车辆：',
				content: item.carType
			}, {
				title: '牌照：',
				content: item.carNumber
			}, {
				title: '手机号码：',
				content: item.phone
			}, {
				title: '出行人数：',
				content: '成人' + item.peopleNum + '／' + '儿童' + item.childNum
			}, {
				title: '空余座位：',
				content: item.seat
			}, {
				title: '是否愿意搭人：',
				content: item.share === '1' ? '是': '否'
			}];
			return (
				<ItemInfo datas={datas} detailView={styles.detailView}/>
			);
		} else {
			var datas = [{
				title: '手机号码：',
				content: item.phone
			}, {
				title: '出行人数：',
				content: '成人' + item.peopleNum + '／' + '儿童' + item.childNum
			}, {
				title: '是否能驾驶车辆：',
				content: item.canDrive === '1' ? '是': '否'
			}]
			return (
				<ItemInfo datas={datas} detailView={styles.detailView} />
			);
		}
	},

	ensurePeopleNum: function(peopleNum, childNum) {
		this._modal.setDatas(true, peopleNum, childNum);
	},

	ensurePeopleHandle: function() {
		//todo
		this.fetchDatas();
	},

	renderBottom: function(item) {
		if (item.status === '1') {
			return (
				<View style={styles.bottomView}>
					<TouchableOpacity style={styles.leftView}>
						<Text style={styles.leftText}>取消活动资格</Text>
					</TouchableOpacity >
					<TouchableOpacity style={styles.rightView}
						onPress={this.ensurePeopleNum.bind(this, item.peopleNum, item.childNum)}>
						<Text style={styles.rightText}>确认参加人数</Text>
					</TouchableOpacity>
				</View>
			);
		} else if (item.status === '0') {
			return (
				<View style={styles.bottomView}>
					<TouchableOpacity style={styles.leftView}>
						<Text style={styles.leftText}>不同意参加</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.rightView}>
						<Text style={styles.rightText}>同意参加</Text>
					</TouchableOpacity>
				</View>
			);
		} else if(item.status === '2') {
			return (
				<View style={styles.lineView}></View>
			);
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
									{(item.status === '1' || item.status === '2')? (<Tag key='status' style={styles.tag}>已通过审核</Tag>): null}
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

	tag: {
		color: stylesVar('green'),
        borderColor: stylesVar('green')
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
		return <ActivityManage navigator={navigator}/>
	}
}

module.exports = ActivityManageRoute;