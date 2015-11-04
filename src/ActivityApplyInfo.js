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
var api = require('./api');
var activityApi = require('./api').activity;
var AV = api.AV;
var Partner = api.Partner;

var ActivityApplyInfo = React.createClass({
    getInitialState: function() {
        return {
            type: 0
        }
    },

    componentDidMount: function() {
        var user;
        AV.User.currentAsync().then(function(_user) {
            user = _user;
            return activityApi.fetchApplyInfo(user, this.props.activity);
        }.bind(this)).then(function(partner) {
            this.setState({
                user,
                partner
            })

            this.props.route.setEditable(!partner.isFailed());
        }.bind(this)).catch(console.trace.bind(console));

        this._editSub = this.props.route.emitter.addListener('edit', function() {
            this.props.navigator.push(new ActivityApply({
                partner: this.state.partner,
                activity: this.props.activity
            }))
        }.bind(this));
    },

    componnetWillUnmount: function() {
        this._editSub.remove();
    },

    renderContent: function() {
        var partner = this.state.partner;

        if (partner.get('type') === Partner.SELF_RIDE) {
            return (
                <View style={styles.detailView}>
					<View style={styles.itemView}>
						<Text style={styles.itemLeft}>出行车辆：</Text>
						<Text style={styles.itemRight}>{partner.get('car').model}</Text>
					</View>
					<View style={styles.itemView}>
						<Text style={styles.itemLeft}>牌照：</Text>
						<Text style={styles.itemRight}>{partner.get('car').number}</Text>
					</View>
					<View style={styles.itemView}>
						<Text style={styles.itemLeft}>手机号码：</Text>
						<Text style={styles.itemRight}>{partner.get('phone')}</Text>
					</View>
					<View style={styles.itemView}>
						<Text style={styles.itemLeft}>出行人数：</Text>
						<Text style={styles.itemRight}>
							{'成人' + partner.get('peopleNum') + '／儿童' + partner.get('childNum')}
						</Text>
					</View>
					<View style={styles.itemView}>
						<Text style={styles.itemLeft}>空余座位：</Text>
						<Text style={styles.itemRight}>{partner.get('leftSeats')}</Text>
					</View>
					<View style={styles.itemView}>
						<Text style={styles.itemLeft}>是否愿意搭人：</Text>
						<Text style={styles.itemRight}>{partner.get('share') ? '是': '否'}</Text>
					</View>
				</View>
            );
        } else {
            return (
                <View style={styles.detailView}>
					<View style={styles.itemView}>
						<Text style={styles.itemLeft}>手机号码：</Text>
						<Text style={styles.itemRight}>{partner.get('phone')}</Text>
					</View>
					<View style={styles.itemView}>
						<Text style={styles.itemLeft}>出行人数：</Text>
						<Text style={styles.itemRight}>
							{'成人' + partner.get('peopleNum') + '／儿童' + partner.get('childNum')}
						</Text>
					</View>
					<View style={styles.itemView}>
						<Text style={styles.itemLeft}>是否能驾驶车辆：</Text>
						<Text style={styles.itemRight}>{partner.get('canDrive') ? '是': '否'}</Text>
					</View>
				</View>
            );
        }
    },

    render: function() {
        if (!this.state.user) {
            return null;
        }

        var state = this.state.partner.get('status');
        var stateTag = {
            [Partner.STATUS_IN_REVIEW]: '审核中', [Partner.STATUS_REFUSED]: '审核失败', [Partner.STATUS_APPROVAL]: '通过审核', [Partner.STATUS_CANCELLED]: '取消资格', [Partner.STATUS_CONFIRMED]: '通过审核',
        }[state];

        var tagStyle = this.state.partner.isFailed() ? styles.tagFail : styles.tag;

        return (
            <View style={styles.container}>
				<View style={styles.contentView}>
					<View style={styles.titleView}>
						<Text style={styles.title}>{this.props.activity.get('title')}</Text>
						<View style={styles.tagView}>
							<Tag style={tagStyle}>{stateTag}</Tag>
						</View>
					</View>
					
					{this.renderContent()}
				</View>

				{!this.state.partner.isFailed() && 
				<TouchableOpacity style={styles.bottomView}>
					<Text style={styles.bottomText}>取消报名</Text>
				</TouchableOpacity>}
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

    tagFail: {
        color: stylesVar('red'),
        borderColor: stylesVar('red')
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
var EventEmitter = require('EventEmitter');

class ActivityApplyInfoRoute extends BaseRouteMapper {

    constructor(navigator, activity) {
        super();

        this.navigator = navigator;
        this.activity = activity;

        this.emitter = new EventEmitter();
    }

    renderLeftButton(route, navigator, index, navState) {
        return this._renderBackButton(route, navigator, index, navState);
    }

    renderRightButton(route, navigator, index, navState) {
        if (this.editable === undefined) {
            return null;
        }

        if (!this.editable) {
            return null;
        }

        return (
            <TouchableOpacity onPress={() => this.emitter.emit('edit')} 
				style={styles.rightButton}>
				<Text style={styles.modifyText}>修改</Text>
			</TouchableOpacity>
        );
    }

    setEditable(editable) {
        this.editable = editable;
        this.navigator.forceUpdate();
    }

    get title() {
        return '报名信息'
    }

    renderScene(navigator) {
        return <ActivityApplyInfo navigator={navigator} activity={this.activity} route={this}/>
    }
}

module.exports = ActivityApplyInfoRoute;
