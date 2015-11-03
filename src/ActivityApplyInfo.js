var React = require('react-native');

var {
	View,
	Image,
	Text,
	StyleSheet,
	PixelRatio,
	TouchableOpacity
} = React;

var stylesVar = require('./stylesVar');
var Tag = require('./widgets/Tag');
var ActivityApply = require('./ActivityApply');

var ActivityApplyInfo = React.createClass({
	getInitialState: function() {
		return {
			activityTitle: '最美的时光在路上',
			status: '审核中',
			carType: '牧马人／2014款',
			carNumber: '京PN8S88',
			phone: '152 1050 9888',
			peopleNumber: '成人2/儿童0',
			seat: '2',
			share: '1',
			canDrive: '1'
		}
	},

	getDatas: function() {
		var index = this.state.peopleNumber.indexOf('/');
		var peopleNum = this.state.peopleNumber.substring(0, index);
		var childNum = this.state.peopleNumber.substring(index + 1);
		return {
			carType: '牧马人／2014款',
			carNumber: '京PN8S88',
			phone: '152 1050 9888',
			peopleNum: peopleNum,
			childNum: childNum,
			seat: 2,
			share: '1',
			canDrive: '1'
		}
	},

	renderContent: function(){
		var ownCar = this.props.ownCar;

		if (ownCar === '1') {
			return (
				<View style={styles.detailView}>
					<View style={styles.itemView}>
						<Text style={styles.itemLeft}>出行车辆：</Text>
						<Text style={styles.itemRight}>{this.state.carType}</Text>
					</View>
					<View style={styles.itemView}>
						<Text style={styles.itemLeft}>牌照：</Text>
						<Text style={styles.itemRight}>{this.state.carNumber}</Text>
					</View>
					<View style={styles.itemView}>
						<Text style={styles.itemLeft}>手机号码：</Text>
						<Text style={styles.itemRight}>{this.state.phone}</Text>
					</View>
					<View style={styles.itemView}>
						<Text style={styles.itemLeft}>出行人数：</Text>
						<Text style={styles.itemRight}>{this.state.peopleNumber}</Text>
					</View>
					<View style={styles.itemView}>
						<Text style={styles.itemLeft}>空余座位：</Text>
						<Text style={styles.itemRight}>{this.state.seat}</Text>
					</View>
					<View style={styles.itemView}>
						<Text style={styles.itemLeft}>是否愿意搭人：</Text>
						<Text style={styles.itemRight}>{this.state.share === '1' ? '是': '否'}</Text>
					</View>
				</View>
			);
		} else {
			return (
				<View style={styles.detailView}>
					<View style={styles.itemView}>
						<Text style={styles.itemLeft}>手机号码：</Text>
						<Text style={styles.itemRight}>{this.state.phone}</Text>
					</View>
					<View style={styles.itemView}>
						<Text style={styles.itemLeft}>出行人数：</Text>
						<Text style={styles.itemRight}>{this.state.peopleNumber}</Text>
					</View>
					<View style={styles.itemView}>
						<Text style={styles.itemLeft}>是否能驾驶车辆：</Text>
						<Text style={styles.itemRight}>{this.state.canDrive === '1' ? '是': '否'}</Text>
					</View>
				</View>
			);
		}
	},

	render: function() {
		return (	
			<View style={styles.container}>
				<View style={styles.contentView}>
					<View style={styles.titleView}>
						<Text style={styles.title}>{this.state.activityTitle}</Text>
						<View style={styles.tagView}>
							<Tag key={this.state.status} style={styles.tag}>{this.state.status}</Tag>
						</View>
					</View>
					{this.renderContent()}
				</View>
				<TouchableOpacity style={styles.bottomView}>
					<Text style={styles.bottomText}>取消报名</Text>
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

	contentView: {
		backgroundColor: '#fff'
	},

	titleView: {
		flex: 1,
		flexDirection: 'column',
		paddingTop: 25,
		paddingBottom: 20,
		borderColor: '#f3f5f6',
		borderBottomWidth: 1 / PixelRatio.get()
	},

	title: {
		flex: 1,
		fontWeight: '300',
		textAlign: 'center',
		fontSize: 16,
		color: stylesVar('dark')
	},

	tagView: {
		flex: 1,
        paddingTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
	},

	tag: {
		color: stylesVar('green'),
        borderColor: stylesVar('green')
	},

	detailView: {
		flex: 1,
		flexDirection: 'column',
		paddingTop: 10,
		paddingBottom: 40,
		borderColor: '#f3f5f6',
		borderBottomWidth: 1 / PixelRatio.get()
	},

	itemView: {
		flex: 1,
		flexDirection: 'row'
	},

	itemLeft: {
		flex: 2,
		textAlign: 'right',
		fontSize: 13,
		color: stylesVar('dark-mid'),
		lineHeight: 30,
		fontWeight: '300'
	},

	itemRight: {
		flex: 3,
		textAlign: 'left',
		paddingLeft: 22,
		lineHeight: 30,
		fontWeight: '300',
		fontSize: 13,
		color: stylesVar('dark')
	},

	bottomView: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		height: 50,
		paddingVertical: 16,
		borderWidth: 1 / PixelRatio.get(),
		borderColor: stylesVar('dark-light'),
		backgroundColor: '#fff'
	},

	bottomText: {
		flex: 1,
		textAlign: 'center',
		fontWeight: '300',
		fontSize: 16,
		color: stylesVar('red')
	},

	rightButton: {
		marginRight: 15
	},

	modifyText: {
		fontSize: 14,
		fontWeight: '300',
		color: '#fff',
		marginTop: 15
	}
});

var BaseRouteMapper = require('./BaseRouteMapper');

class ActivityApplyInfoRoute extends BaseRouteMapper {
	constructor(data) {
		super();

		this.ownCar = data.ownCar;
	}

	renderLeftButton(route, navigator, index, navState) {
        return this._renderBackButton(route, navigator, index, navState);
    }

    renderRightButton(route, navigator, index, navState) {
		return (
			<TouchableOpacity onPress={() => {
				var datas = this._root.getDatas();
				navigator.push(new ActivityApply(datas));
			}} style={styles.rightButton}>
				<Text style={styles.modifyText}>修改</Text>
			</TouchableOpacity>
		);
	}

	get style() {
		return this.styles.navBar;
	}

	get title() {
		return '报名信息'
	}

	renderScene(navigator) {
		return <ActivityApplyInfo ref={(component) => this._root = component} navigator={navigator} ownCar={this.ownCar}/>
	}
}

module.exports = ActivityApplyInfoRoute;