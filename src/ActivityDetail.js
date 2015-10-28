var React = require('react-native');

var {
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

var {
    Tag,
    UserInfo,
    ActivityRoute,
    ActivityPublishDate,
} = require('./widgets');

var ActivityDetail = React.createClass({
    getInitialState: function() {
        return {
            data: {}
        }
    },

    componentDidMount: function() {
        activityApi.fetchDetail().then(function(data) {
            this.setState({
                data: data
            });
        }.bind(this), function(e) {
            console.trace(e);
        });
    },

    renderCenter: function() {
        var status = this.props.status;
        var data = this.state.data;
        if (status === 'preparing') {
            return (
                <View style={styles.section}>
                    <View style={styles.row}>
                        <Image style={styles.countdown} source={require('image!icon-countdown')}/>
                        <Text style={styles.countdownText}>报名倒计时：{data.remainDay}天</Text>
                        <Text style={[styles.countdownText, styles.gray]}>（截止报名时间：{data.deadline}）</Text>
                    </View>
                    <View style={[styles.row, styles.spaceNone]}>
                        <View style={styles.numberLabel}>
                            <Text style={[styles.number, {color: stylesVar('blue-light')}]}>{data.haveCar}</Text>
                            <Text style={styles.smallGray}>已报名车辆</Text>
                        </View>
                        <View style={styles.separator}></View>
                        <View style={styles.numberLabel}>
                            <Text style={[styles.number, {color: stylesVar('orange')}]}>{data.needCar}</Text>
                            <Text style={styles.smallGray}>剩余车辆名额</Text>
                        </View>
                        <View style={styles.separator}></View>
                        <View style={styles.numberLabel}>
                            <Text style={[styles.number, {color: stylesVar('green-light')}]}>{data.remainSeat}</Text>
                            <Text style={styles.smallGray}>剩余座位</Text>
                        </View>
                    </View>
                    <View style={[styles.row, styles.spaceNone]}>
                        <View style={styles.note}>
                            <Image source={require('image!icon-photos')} style={styles.icon}/>
                            <Text style={styles.baseText}>相册</Text>
                            <Text style={styles.gray}>({data.photos})</Text>
                        </View>
                        <View style={[styles.separator, {height: 45}]}></View>
                        <View style={styles.note}>
                            <Image source={require('image!icon-journey')} style={styles.icon}/>
                            <Text style={styles.baseText}>游记</Text>
                            <Text style={styles.gray}>({data.journeys})</Text>
                        </View>
                        <View style={[styles.separator, {height: 45}]}></View>
                        <View style={styles.note}>
                            <Image source={require('image!icon-annotations')} style={styles.icon}/>
                            <Text style={styles.baseText}>轨迹</Text>
                            <Text style={styles.gray}>({data.annotations})</Text>
                        </View>
                    </View>
                </View>
            );
        } else if (status === 'travelling') {
            return (
                <View style={styles.section}>
                    <View style={styles.row}>
                        <Image style={styles.countdown} source={require('image!icon-countdown')}/>
                        <Text style={styles.gray}>活动已结束</Text>
                    </View>
                    <View style={[styles.row, styles.spaceNone]}>
                        <View style={styles.stopCell}>
                            <Image source={require('image!icon-photo-green')} style={styles.iconPhotoGreen}/>
                            <Text style={styles.baseText}>相册
                                <Text style={styles.gray}>({data.photos})</Text>
                            </Text>
                        </View>
                        <View style={[styles.separator, {height: 90}]}></View>
                        <View style={styles.stopCell}>
                            <Image source={require('image!icon-journey-red')} style={styles.iconJourneyRed}/>
                            <Text style={styles.baseText}>游记
                                <Text style={styles.gray}>({data.journeys})</Text>
                            </Text>
                        </View>
                        <View style={[styles.separator, {height: 90}]}></View>
                        <View style={styles.stopCell}>
                            <Image source={require('image!icon-annotation-yello')} style={styles.iconAnnotationYello} />
                            <Text style={styles.baseText}>轨迹
                                <Text style={styles.gray}>({data.annotations})</Text>
                            </Text>
                        </View>
                    </View>
                </View>
            );
        }
    },

    renderBottom: function() {
        var status = this.props.status;
        var isEnter = this.props.isEnter;
        if (status === 'preparing') { //活动没有结束
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
            
        } else if (status === 'travelling') {
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

    render: function() {
        var isSponsor = this.props.isSponsor;
        var data = this.state.data;

        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollContainer}>
                    <Image 
                        source={data.header ? {uri: data.header} : require('image!banner-activity-placeholder')}
                        style={styles.banner}>
                        <UserInfo 
                            style={styles.info}
                            username={data.user && data.user.username}
                            publishDate={data.publishDate}
                            avatar={data.user && data.user.avatar ? {uri: data.user.avatar} : require('image!avatar-placeholder')}/>
                        {isSponsor === '1' && (
                            <View style={styles.manageInfo}>
                                <Image source={require('image!icon-edit-white')} style={styles.iconEditWhite}/>
                                <Text style={[styles.manageText, styles.editText]}>编辑</Text>
                                <Image source={require('image!icon-manage-white')} style={styles.iconManageWhite} />
                                <Text style={styles.manageText}>管理</Text>
                            </View>
                        )}
                    </Image>

                    <View style={[styles.section, styles.detail]}>
                        <View style={[styles.row, {paddingVertical: 12}]}>
                            <Text style={styles.title}>{data.title}</Text>
                        </View>
                        <View style={styles.row}>
                            <ActivityRoute route={data.route}/>
                        </View>
                        <View style={styles.row}>
                            <ActivityPublishDate data={data}/>
                        </View>
                        <View style={styles.tags}>
                            {data.tags && data.tags.map(function(tag) {
                                return <Tag key={tag} style={[styles.tag, {marginRight: 10}]}>{tag}</Tag> 
                            })}
                        </View>
                    </View>
                    {this.renderCenter()}
                    <View style={styles.moreRow}>
                        <Image source={require('image!more-down-gray')} style={styles.moreDownGray} />
                    </View>
                    <View style={styles.moreRow}>
                        <View style={styles.moreLine}></View>
                        <View style={styles.moreTextView}>
                            <Text style={styles.moreText}>继续拖动，查看详情</Text>
                        </View>
                        <View style={styles.moreLine}></View>
                    </View>
                </ScrollView>
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

    scrollContainer: {
        position: 'absolute',
        bottom: 60,
        left: 0,
        right: 0,
        top: 0
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

    tag: {
        marginRight: 10,
        color: stylesVar('green'),
        borderColor: stylesVar('green')
    },

    tags: {
        paddingLeft: 8,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
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
    constructor(data) {
        super()

        this.id = data.id;
        this.status = data.status;
        this.isEnter = data.isEnter;
        this.isSponsor = data.isSponsor;
    }

    renderLeftButton(route, navigator, index, navState) {
        if (index === 0) {
            return null;
        }

        var styles = this.styles;
        return (
            <TouchableOpacity
                onPress={() => navigator.pop()}>
                <Image style={styles.navBarLeftButton} source={require('image!back-icon')}/>
            </TouchableOpacity>
        );
    }

    renderRightButton(route, navigator, index, navState) {
        var navBarRightButton = this.styles.navBarRightButton;
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

        return (
            <View style={navBarRightButton}>
                <View style={styles.navbarRight}>
                    <Image style={styles.iconComments} source={require('image!icon-comments')}/>
                    <Text style={styles.navbarText}>127</Text>
                    <Image style={styles.iconStars} source={require('image!icon-stars-o')}/>
                    <Text style={styles.navbarText}>19</Text>
                    <Image style={styles.iconShare} source={require('image!icon-share')}/>
                </View>
            </View>
        );
    }

    get style() {
        return {
            backgroundColor: 'transparent'
        }
    }

    renderScene() {
        return <ActivityDetail id={this.id} 
                    status={this.status} 
                    isEnter={this.isEnter}
                    isSponsor={this.isSponsor}/>
    }
}

module.exports = ActivityDetailRoute;
