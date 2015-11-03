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
var fetchMoreDetail = require('./api').activity.fetchMoreDetail;
var Tab = require('./widgets/Tab');
var CommentList = require('./CommentList');

var {
    UserInfo,
    ActivityRoute,
    ActivityPublishDate,
} = require('./widgets');

var ActivityMoreDetail = React.createClass({
    getInitialState: function() {
        return {
            datas: {},
            translateY: 0,
            tab: '0'
        }
    },

    componentDidMount: function() {
        this.routeHandle();
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
                        <TouchableOpacity style={styles.information} activeOpacity={0.9}>
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

    scrollHandle: function(e) {
        e = e.nativeEvent;
        var height = e.contentOffset.y + e.layoutMeasurement.height;
        var contentHeight = e.contentSize.height;
        console.log(height);
        if (height >= contentHeight) {
            this.setState({
                translateY: -contentHeight
            });
            console.log('scroll to bottom');
        }
    },

    routeHandle: function(){
        fetchMoreDetail.fetchRoute({
            id: this.props.id
        }).then(function(datas) {
            this.setState({
                datas: datas,
                tab: 0
            });
        }.bind(this), function(e) {
            console.log(e);
        })
    },

    detailHandle: function() {
        fetchMoreDetail.fetchDetail({
            id: this.props.id
        }).then(function(datas) {
            this.setState({
                datas: datas,
                tab: 1
            });
        }.bind(this), function(e) {
            console.log(e);
        });
    },

    tipsHandle: function() {
        fetchMoreDetail.fetchTips({
            id: this.props.id
        }).then(function(datas) {
            this.setState({
                datas: datas,
                tab: 2
            });
        }.bind(this), function(e) {
            console.log(e);
        });
    },

    dangerHandle: function() {
        fetchMoreDetail.fetchDanger({
            id: this.props.id
        }).then(function(datas) {
            this.setState({
                datas: datas,
                tab: 3
            });
        }.bind(this), function(e) {
            console.log(e);
        });
    },

    renderContent: function() {
        var datas = this.state.datas;
        var tab = this.state.tab;
        
        if (tab === 0) {
            return (
                <View>
                    <Image source={datas.routeImg ? {uri: datas.routeImg} : require('image!banner-activity-placeholder')} 
                        style={styles.banner}/>
                    <View style={styles.contentRow}>
                        <Text style={styles.text}>{datas.info}</Text>
                    </View>
                </View>
            );
        } else if (tab === 1 || tab === 3) {
            return (
                <View style={styles.contentRow}>
                    <Text style={styles.text}>{datas.info}</Text>
                </View>
            );
        } else if (tab === 2) {
            return (
                <View>
                    <View style={styles.contentRow}>
                        <Text style={styles.titleText}>参与者要求</Text>
                        <Text style={styles.text}>{datas.participantInfo}</Text>
                    </View>
                    <View style={styles.separator}></View>
                    <View style={styles.contentRow}>
                        <Text style={styles.titleText}>装备要求</Text>
                        <Text style={styles.text}>{datas.devInfo}</Text>
                    </View>
                    <View style={styles.separator}></View>
                    <View style={styles.contentRow}>
                        <Text style={styles.titleText}>费用说明</Text>
                        <Text style={styles.text}>{datas.moneyInfo}</Text>
                    </View>
                </View>
            );
        }
    },

    render: function() {
        var isSponsor = this.props.isSponsor;
        var data = this.state.data;

        return (
            <View style={styles.container}>
                <Animated.View style={[styles.partContainer, {transform: [{translateY: this.state.translateY}]}]} >
                <ScrollView style={styles.scrollContainer} >
                    <Tab datas={['路线说明', '详细行程', '注意事项', '风险提示']}
                        callbacks={[this.routeHandle, this.detailHandle, this.tipsHandle, this.dangerHandle]} />
                    {this.renderContent()}
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
        backgroundColor: '#f3f5f6',
        paddingTop: 64
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
        flex: 1,
        width: deviceWidth
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

    contentRow: {
        flex: 1,
        paddingHorizontal: 15,
        justifyContent: 'center',
        marginBottom: 10
    },

    text: {
        color: stylesVar('dark-light-little'),
        lineHeight: 25,
        fontSize: 13,
        fontWeight: '100'
    },

    titleText: {
        color: stylesVar('dark'),
        lineHeight: 30,
        fontSize: 16,
        fontWeight: '300'
    },

    separator: {
        flex: 1,
        width: deviceWidth,
        height: 1 / PixelRatio.get(),
        backgroundColor: stylesVar('dark-light')
    }
});

var BaseRouteMapper = require('./BaseRouteMapper');

class ActivityMoreDetailRoute extends BaseRouteMapper {
    constructor(data) {
        super()

        this.id = data.id;
        this.status = data.status;
        this.isEnter = data.isEnter;
        this.isSponsor = data.isSponsor;
        this.resetScrollHandle = data.resetScrollHandle;
    }

    renderLeftButton(route, navigator, index, navState) {
        return this._renderBackButton(route, navigator, index, navState, function() {
            this.resetScrollHandle();
            navigator.pop();
        }.bind(this));
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
                    <TouchableOpacity activeOpacity={1} onPress={this.commentHandle.bind(this, navigator)}>
                        <Image style={styles.iconComments} source={require('image!icon-comments')}/>
                    </TouchableOpacity>
                    <Text style={styles.navbarText}>127</Text>
                    <Image style={styles.iconStars} source={require('image!icon-stars-o')}/>
                    <Text style={styles.navbarText}>19</Text>
                    <Image style={styles.iconShare} source={require('image!icon-share')}/>
                </View>
            </View>
        );
    }

    commentHandle(navigator) {
        navigator.push(new CommentList({
            id: this.id,
            count: 127
        }))
    }

    get style() {
        return this.styles.navBar;
    }

    renderScene() {
        return <ActivityMoreDetail id={this.id} 
                    status={this.status} 
                    isEnter={this.isEnter}
                    isSponsor={this.isSponsor}/>
    }
}

module.exports = ActivityMoreDetailRoute;