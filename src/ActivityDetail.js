var AV = require('avoscloud-sdk');
var moment = require('moment');
var React = require('react-native');

var {
    Animated,
    ActivityIndicatorIOS,
    StyleSheet,
    Dimensions,
    PixelRatio,
    ScrollView,
    Text,
    Image,
    View,
    TouchableOpacity,
    TouchableHighlight
} = React;

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

var su = require('./styleUtils');
var stylesVar = require('./stylesVar');
var activityApi = require('./api').activity;
var userApi = require('./api').user;
var ActivityMoreDetail = require('./ActivityMoreDetail');
var ActivityTags = require('./ActivityTags');
var CommentList = require('./CommentList');

var {
    Tag,
    UserInfo,
    ActivityRoute,
    ActivityPublishDate,
} = require('./widgets');

var debug = require('debug');
var log = debug('ActivityDetail:log');
var error = debug('ActivityDetail:error');

var ActivityEntries = React.createClass({
    renderCountdown: function() {
        var _activity = this.props.activity;

        return (
            <View style={styles.row}>
                <Image style={styles.countdown} source={require('image!icon-countdown')}/>
                <Text style={styles.countdownText}>
                    报名倒计时：{_activity.daysLeftForApply()}天
                </Text>
                <Text style={[styles.countdownText, styles.gray]}>
                    （截止报名时间：{moment(_activity.get('entryDeadline')).format('YYYY-MM-DD')}）
                </Text>
            </View>
        );
    },

    renderSupplies: function() {
        var _activity = this.props.activity;
        var data = {};

        return (
            <View style={[styles.row, styles.spaceNone]}>
                <View style={styles.numberLabel}>
                    {/* TODO: fetch cars */}
                    <Text style={[styles.number, {color: stylesVar('blue-light')}]}>{data.haveCar || 0}</Text>
                    <Text style={styles.smallGray}>已报名车辆</Text>
                </View>
                <View style={styles.separator}></View>
                <View style={styles.numberLabel}>
                    {/* TODO: fetch cars */}
                    <Text style={[styles.number, {color: stylesVar('orange')}]}>{data.needCar || 0}</Text>
                    <Text style={styles.smallGray}>剩余车辆名额</Text>
                </View>
                <View style={styles.separator}></View>
                <View style={styles.numberLabel}>
                    {/* TODO: seats? */}
                    <Text style={[styles.number, {color: stylesVar('green-light')}]}>{data.remainSeat || 0}</Text>
                    <Text style={styles.smallGray}>剩余座位</Text>
                </View>
            </View>
        );
    },

    renderUserEntries: function() {
        var _activity = this.props.activity;
        var data = {};

        if (_activity.getState() === activityApi.PREPARING) {
            return (
                <View style={[styles.row, styles.spaceNone]}>
                    <View style={styles.note}>
                        <Image source={require('image!icon-photos')} style={styles.icon}/>
                        <Text style={styles.baseText}>相册</Text>
                        <Text style={styles.gray}>({data.photos || 0})</Text>
                    </View>
                    <View style={[styles.separator, {height: 45}]}></View>
                    <View style={styles.note}>
                        <Image source={require('image!icon-journey')} style={styles.icon}/>
                        <Text style={styles.baseText}>游记</Text>
                        <Text style={styles.gray}>({data.journeys || 0})</Text>
                    </View>
                    <View style={[styles.separator, {height: 45}]}></View>
                    <View style={styles.note}>
                        <Image source={require('image!icon-annotations')} style={styles.icon}/>
                        <Text style={styles.baseText}>轨迹</Text>
                        <Text style={styles.gray}>({data.annotations || 0})</Text>
                    </View>
                </View>
            );
        } else if (_activity.getState() === activityApi.TRAVELLING) {
            return (
                <View style={[styles.row, styles.spaceNone]}>
                        <View style={styles.stopCell}>
                            <Image source={require('image!icon-photo-green')} style={styles.iconPhotoGreen}/>
                            <Text style={styles.baseText}>相册
                                <Text style={styles.gray}>({data.photos || 0})</Text>
                            </Text>
                        </View>
                        <View style={[styles.separator, {height: 90}]}></View>
                        <View style={styles.stopCell}>
                            <Image source={require('image!icon-journey-red')} style={styles.iconJourneyRed}/>
                            <Text style={styles.baseText}>游记
                                <Text style={styles.gray}>({data.journeys || 0})</Text>
                            </Text>
                        </View>
                        <View style={[styles.separator, {height: 90}]}></View>
                        <View style={styles.stopCell}>
                            <Image source={require('image!icon-annotation-yello')} style={styles.iconAnnotationYello} />
                            <Text style={styles.baseText}>轨迹
                                <Text style={styles.gray}>({data.annotations || 0})</Text>
                            </Text>
                        </View>
                </View>
            );
        }
    },

    render: function() {
        return (
            <View style={styles.section}>
                {this.renderCountdown()}
                {this.props.activity.getState() === activityApi.PREPARING &&
                    this.renderSupplies()}
                {this.renderUserEntries()}
            </View>
        )
    }
});

var ActivityDetail = React.createClass({
    getInitialState: function() {
        var activity = this.props.activity;
        return {
            activity: activity,
            data: {},
            translateY: 0
        }
    },

    componentDidMount: function() {
        this.scrollHandleCopy = this.scrollHandle;
    },

    renderBottom: function() {
        var _activity = this.state.activity;
        var state = _activity.getState();
        // var isEnter = this.props.isEnter;
        var isEnter = '0';
        if (state === activityApi.PREPARING) { //活动没有结束
            if (isEnter === '0') { //没有报名
                return (
                    <View style={styles.bottomBar}>
                        <TouchableOpacity style={styles.information} activeOpacity={0.9}>
                            <Image source={require('image!icon-information')} style={styles.iconInformation}/>
                            <Text style={styles.informationText}>咨询楼主</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.apply} activeOpacity={0.9}>
                            <Text style={styles.applyText}>我要报名</Text>
                        </TouchableOpacity>
                    </View>
                );
            } else if (isEnter === '1') {//已经报名
                return (
                    <View style={styles.bottomBar}>
                        <TouchableOpacity style={styles.information, styles.activityCircle} activeOpacity={0.9}>
                            <Image source={require('image!icon-activity-circle-trans')} style={styles.iconActivityCircle}/>
                            <Text style={styles.informationText}>活动圈子</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.apply} activeOpacity={0.9}>
                            <Text style={styles.applyText}>我的报名信息</Text>
                        </TouchableOpacity>
                    </View>
                );
            }
        } else if (state === activityApi.TRAVELLING) {
            if (isEnter === '0') {
                return (
                    <View style={styles.bottomBar}>
                        <TouchableOpacity style={styles.information} activeOpacity={0.9}>
                            <Image source={require('image!icon-information')} style={styles.iconInformation} />
                            <Text style={styles.informationText}>咨询楼主</Text>
                        </TouchableOpacity>
                    </View>
                );
            } else if (isEnter === '1') {
                return (
                    <View style={styles.bottomBar}>
                        <TouchableOpacity style={[styles.information, styles.blueLight]} activeOpacity={0.9}>
                            <Image source={require('image!icon-activity-circle-trans')} style={styles.iconActivityCircle} />
                            <Text style={styles.informationText}>活动圈子</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.information, styles.green]} activeOpacity={0.9}>
                            <Image source={require('image!icon-picture-trans')} style={styles.iconPictureTrans} />
                            <Text style={styles.informationText}>分享照片</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.information, styles.red]} activeOpacity={0.9}>
                            <Image source={require('image!icon-journey-trans')} style={styles.iconJourneyTrans} />
                            <Text style={styles.informationText}>写游记</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.information, styles.orange]} activeOpacity={0.9}>
                            <Image source={require('image!icon-annotation-trans')} style={styles.iconAnnotationTrans} />
                            <Text style={styles.informationText}>上传轨迹</Text>
                        </TouchableOpacity>
                    </View>
                );
            }
        }
    },

    scrollHandle: function(e) {
        e = e.nativeEvent;
        var height = e.contentOffset.y + e.layoutMeasurement.height;
        var contentHeight = e.contentSize.height;

        if (height >= contentHeight) {
            console.log('scroll to bottom');
            
            this.scrollHandle = null;
            this.props.navigator.push(new ActivityMoreDetail({
                id: this.props.id, 
                status: this.props.status, 
                isEnter: this.props.isEnter,
                isSponsor: this.props.isSponsor,
                resetScrollHandle: this.resetScrollHandle
            }))
        }
    },

    resetScrollHandle: function() {
        this.scrollHandle = this.scrollHandleCopy;
    },

    render: function() {
        var isSponsor = this.props.isSponsor;
        var data = this.state.data;
        var _activity = this.state.activity;
        var creator = _activity.get('createBy');
        // TOOD: use real avatar
        var creatorAvatar = require('image!avatar-placeholder');
        // var cover = _activity.get('cover');
        // TODO: use real cover
        var coverPlaceholder = 'http://f.hiphotos.baidu.com/image/pic/item/b64543a98226cffc9b70f24dba014a90f703eaf3.jpg';
        var cover = coverPlaceholder;

        return (
            <View style={styles.container}>
                <Animated.View style={[styles.partContainer, {transform: [{translateY: this.state.translateY}]}]} >
                <ScrollView style={styles.scrollContainer} 
                    onScroll={this.scrollHandle}
                    scrollEventThrottle={16}
                    onScrollAnimationEnd={this.scrollEndHandle}>

                    <Image source={{uri: cover}} style={styles.banner}>
                        <UserInfo 
                            style={styles.info}
                            username={creator.get('username')}
                            publishDate={_activity.getCreatedAt()}
                            avatar={creatorAvatar}/>
                        {isSponsor === '1' && (
                            <View style={styles.manageInfo}>
                                <Image source={require('image!icon-edit-white')} 
                                    style={styles.iconEditWhite}/>
                                <Text style={[styles.manageText, styles.editText]}>编辑</Text>
                                <Image source={require('image!icon-manage-white')}
                                    style={styles.iconManageWhite} />
                                <Text style={styles.manageText}>管理</Text>
                            </View>
                        )}
                    </Image>

                    <View style={[styles.section, styles.detail]}>
                        <View style={[styles.row, {paddingVertical: 12}]}>
                            <Text style={styles.title}>{_activity.get('title')}</Text>
                        </View>
                        <View style={styles.row}>
                            <ActivityRoute route={_activity.get('route')}/>
                        </View>
                        <View style={styles.row}>
                            <ActivityPublishDate data={_activity}/>
                        </View>
                        <ActivityTags style={styles.tags} data={_activity} 
                            tagStyle={styles.tag} showState={false}/>
                    </View>

                    <ActivityEntries activity={this.state.activity}/>

                    <View style={styles.moreRow}>
                        <Image source={require('image!more-down-gray')}
                            style={styles.moreDownGray} />
                    </View>
                    <View style={styles.moreRow}>
                        <View style={styles.moreLine}></View>
                        <View style={styles.moreTextView}>
                            <Text style={styles.moreText}>继续拖动，查看详情</Text>
                        </View>
                        <View style={styles.moreLine}></View>
                    </View>
                </ScrollView>
                </Animated.View>  

                {this.renderBottom()}
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f5f6'
    },

    partContainer: {
        flex: 1,
        backgroundColor: '#f3f5f6'
    },

    scrollContainer: {
        position: 'absolute',
        bottom: 60,
        left: 0,
        right: 0,
        top: 0
    },

    tag: {
        borderColor: stylesVar('green'),
        color: stylesVar('green')
    },

    baseText: {
        color: stylesVar('dark'),
        fontWeight: '200',
        fontSize: 15
    },

    countdownText: {
        color: stylesVar('dark'),
        fontWeight: '200',
        fontSize: 12
    },

    navbar: {
        position: 'absolute',
        backgroundColor: 'transparent',
        top: 20,
        left: 0,
        right: 0,
        height: 44
    },

    navbarText: {
        fontSize: 10,
        color: stylesVar('white'),
        marginRight: 20,
        marginLeft: 5
    },

    navbarLeft: {
        position: 'absolute',
        left: 0,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center'
    },

    navBarLeftButton: {
        ...su.size(17, 15),
        marginLeft: 10,
    },

    
    banner: {
        height: 180,
        width: deviceWidth,
    },

    info: {
        position: 'absolute',
        left: 15,
        bottom: 15
    },

    manageInfo: {
        position: 'absolute',
        right: 15,
        bottom: 15,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        height: 30
    },

    manageText: {
        color: stylesVar('white'),
        fontSize: 14
    },

    iconEditWhite: {
        ...su.size(14),
        marginRight: 5
    },

    iconManageWhite: {
        ...su.size(17),
        marginRight: 5
    },

    editText: {
        marginRight: 15
    },

    section: {
        borderTopWidth: 1 / PixelRatio.get(),
        borderBottomWidth: 1 / PixelRatio.get(),
        borderColor: stylesVar('dark-light'),
        backgroundColor: stylesVar('white'),
        marginBottom: 20
    },

    detail: {
        borderTopWidth: 0,
        paddingLeft: 8
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingLeft: 8,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#f3f5f6'
    },

    spaceNone: {
        paddingLeft: 0, 
        paddingVertical: 0
    },

    title: {
        color: '#030303',
        fontSize: 20
    },

    tags: {
        marginLeft: 8,
        marginVertical: 8,
    },

    countdown: {
        marginLeft: 8,
        marginRight: 10,
        ...su.size(9, 12),
        resizeMode: 'contain'
    },

    gray: {
        color: stylesVar('dark-mid')
    },

    numberLabel: {
        flex: 1,
        alignItems: 'center',
    },

    separator: {
        width: 1 / PixelRatio.get(),
        backgroundColor: '#f3f5f6',
        height: 90
    },

    number: {
        fontSize: 40,
        marginBottom: 8
    },

    smallGray: {
        fontSize: 10,
        color: stylesVar('dark-light-slight')
    },

    note: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    stopCell: {
        flex: 1,
        height: 90,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 17
    },

    iconPhotoGreen: {
        ...su.size(27, 30),
        marginBottom: 12
    },

    iconJourneyRed: {
        ...su.size(22, 30),
        marginBottom: 12
    },

    iconAnnotationYello: {
        ...su.size(23, 30),
        marginBottom: 12
    },

    icon: {
        ...su.size(24),
            marginRight: 5
    },

    bottomBar: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },

    information: {
        flex: 1,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: stylesVar('green')
    },

    iconInformation: {
        width: 22, 
        height: 22, 
        marginBottom: 5
    },

    informationText: {
        color: stylesVar('white'),
        fontSize: 10
    },

    blueLight: {
        backgroundColor: stylesVar('blue-light')
    },

    iconActivityCircle: {
        width: 22,
        height: 22,
        marginBottom: 5
    },

    green: {
        backgroundColor: stylesVar('green')
    },

    iconPictureTrans: {
        ...su.size(22, 16),
        marginBottom: 5
    },

    red: {
        backgroundColor: stylesVar('red')
    },

    iconJourneyTrans: {
        ...su.size(16, 18),
        marginBottom: 5
    },

    orange: {
        backgroundColor: stylesVar('orange')
    },

    iconAnnotationTrans: {
        ...su.size(15, 20),
        marginBottom: 5
    },

    apply: {
        flex: 3,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: stylesVar('blue')
    },

    applyText: {
        fontSize: 20,
        color: stylesVar('white')
    },

    moreRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 15,
        paddingRight: 15,
        marginBottom: 8
    },

    moreDownGray: {
        marginTop: 25,
        ...su.size(14)
    },

    moreTextView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    moreText: {
        fontSize: 10,
        color: stylesVar('dark-mid')
    },

    moreLine: {
        flex: 1,
        height: 1 / PixelRatio.get(),
        backgroundColor: stylesVar('dark-light')
    }
});

var BaseRouteMapper = require('./BaseRouteMapper');

class ActivityDetailRoute extends BaseRouteMapper {
    constructor(data, navigator) {
        super()

        this.navigator = navigator;

        this.activity = data.activity;
        this.stars = this.activity.getStars();
        this.starred = this.activity.getStarred();
    }

    _toggleStar() {
        if (!this.starred) {
            userApi.starActivity(this.activity).then(function() {
                this.stars++;
                this.starred = true;
                this.navigator.forceUpdate();
            }.bind(this), function(e) {
                console.trace(e);
            });
        } else {
            userApi.unstarActivity(this.activity).then(function() {
                this.stars--;
                this.starred = false;
                this.navigator.forceUpdate();
            }.bind(this), function(e) {
                console.trace(e);
            });
        }
    }

    renderLeftButton(route, navigator, index, navState) {
        return this._renderBackButton(route, navigator, index, navState);
    }

    renderRightButton(route, navigator, index, navState) {
        var {
            wrap,
            navBarRightButton
        } = this.styles;

        var styles = StyleSheet.create({
            iconComments: {
                ...su.size(17)
            },

            iconStars: {
                ...su.size(18, 17)
            },

            iconShare: {
                ...su.size(14, 20)
            },

            navbarRight: {
                height: 44,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center'
            },

            navbarText: {
                fontSize: 10,
                color: stylesVar('white'),
                marginRight: 15,
                marginLeft: 5
            },
        });

        var starIcon = this.starred ? require('image!icon-star') : require('image!icon-stars-o');

        return (
            <View style={[wrap, navBarRightButton]}>
                <View style={styles.navbarRight}>
                    <TouchableOpacity activeOpacity={0.8} onPress={this.commentHandle.bind(this, navigator)}>
                        <Image style={styles.iconComments} source={require('image!icon-comments')}/>
                    </TouchableOpacity>
                    <Text style={styles.navbarText}>127</Text>

                    <TouchableOpacity activeOpacity={0.8} onPress={this._toggleStar.bind(this)}>
                        <Image style={styles.iconStars} source={starIcon}/>
                    </TouchableOpacity>
                    <Text style={styles.navbarText}>{this.stars}</Text>

                    <Image style={styles.iconShare} source={require('image!icon-share')}/>
                </View>
            </View>
        );
    }

    commentHandle(navigator) {
        navigator.push(new CommentList({
            id: this.activity.id,
            count: 127
        }));
    }

    get style() {
        return this.styles.navBarTransparent;
    }

    renderScene() {
        return <ActivityDetail activity={this.activity}/>;
    }
}

module.exports = ActivityDetailRoute;
