var AV = require('avoscloud-sdk');
var _ = require('underscore');
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

var icons = require('./icons');
var su = require('./styleUtils');
var stylesVar = require('./stylesVar');
var fetchMoreDetail = require('./api').activity.fetchMoreDetail;
var Tab = require('./widgets/Tab');
var userApi = require('./api').user;
var CommentList = require('./CommentList');

var {
    UserInfo,
    ActivityRoute,
    ActivityPublishDate,
} = require('./widgets');

var ActivityDetailMixin = require('./ActivityDetailMixin');

var ActivityMoreDetail = React.createClass({

    mixins: [ActivityDetailMixin],

    getInitialState: function() {
        return {
            activity: this.props.activity,
            datas: {},
            translateY: 0,
            tab: 0
        }
    },

    componentWillUnmount: function() {
        this._navSub.remove();
    },

    componentDidMount: function() {
        this.scrollHandleCopy = this.scrollHandle;

        var navigator = this.props.navigator;
        var self = this;
        this._navSub = navigator.navigationContext.addListener('didfocus', (e) => {
            if (self.props.route !== e.data.route) {
                return;
            }

            self._refresh();
        });

        this._refresh();
    },

    _refresh: function() {
        var activity = this.state.activity;
        var user, isEnter;
        AV.User.currentAsync().then(function(_user) {
            user = _user;
            return activity.isUserApplied(user);
        }).then(function(applied) {
            isEnter = applied;
            this.setState({
                isEnter,
                user
            });
        }.bind(this)).catch(function(e) {
            console.trace(e);
        });
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

    renderContent: function() {
        var _activity = this.props.activity;
        var datas = this.state.datas;
        var tab = this.state.tab;

        if (tab === 0) {
            // TODO: 显示轨迹图
            return (
                <View>
                    <Image source={icons.activityCoverPlaceholder} 
                        style={styles.banner}/>
                    <View style={styles.contentRow}>
                        <Text style={styles.text}>{_activity.get('route')}</Text>
                    </View>
                </View>
            );
        } else if (tab === 1) {
            return (
                <View>
                    <View style={styles.contentRow}>
                        <Text style={styles.text}>{_activity.get('routeDesc')}</Text>
                    </View>
                </View>
            );
        } else if (tab === 3) {
            return (
                <View style={styles.contentRow}>
                    <Text style={styles.text}>{_activity.get('riskPrompt')}</Text>
                   </View>
            );
        } else if (tab === 2) {
            return (
                <View>
                    <View style={styles.contentRow}>
                        <Text style={styles.titleText}>参与者要求</Text>
                        <Text style={styles.text}>{_activity.get('partnerRequirements')}</Text>
                    </View>
                    <View style={styles.separator}></View>
                    <View style={styles.contentRow}>
                        <Text style={styles.titleText}>装备要求</Text>
                        <Text style={styles.text}>{_activity.get('equipmentRequirements')}</Text>
                    </View>
                    <View style={styles.separator}></View>
                    <View style={styles.contentRow}>
                        <Text style={styles.titleText}>费用说明</Text>
                        <Text style={styles.text}>{_activity.get('costDesc')}</Text>
                    </View>
                </View>
            );
        }
    },

    render: function() {
        if (!this.state.user) {
            return null;
        }
        
        var isSponsor = this.props.isSponsor;
        var data = this.state.data;

        var callbacks = _.range(4).map(function(tab) {
            return () => this.setState({tab});
        }, this);

        return (
            <View style={styles.container}>
                <Animated.View style={[styles.partContainer, {transform: [{translateY: this.state.translateY}]}]} >
                <ScrollView style={styles.scrollContainer} >
                    <Tab datas={['路线说明', '详细行程', '注意事项', '风险提示']}
                        callbacks={callbacks}
                        activeTab={this.state.tab} />
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

        this.activity = data.activity;
        this.stars = this.activity.getStars();
        this.starred = this.activity.getStarred();
        this.refreshStar = data.refreshStar;
    }

    renderLeftButton(route, navigator, index, navState) {
        return this._renderBackButton(route, navigator, index, navState, function() {
            this.refreshStar && this.refreshStar();
            navigator.pop();
        }.bind(this));
    }

    _toggleStar(navigator) {
        if (!this.starred) {
            userApi.starActivity(this.activity).then(function() {
                this.stars++;
                this.activity.setStars(this.stars);
                this.starred = true;
                this.activity.setStarred(true);
                navigator.forceUpdate();
            }.bind(this), function(e) {
                console.trace(e);
            });
        } else {
            userApi.unstarActivity(this.activity).then(function() {
                this.stars--;
                this.activity.setStars(this.stars);
                this.starred = false;
                this.activity.setStarred(false);
                navigator.forceUpdate();
            }.bind(this), function(e) {
                console.trace(e);
            });
        }
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
                marginRight: 5,
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
        var starIcon = this.starred ? icons.star : icons.starsOpposite;

        return (
            <View style={navBarRightButton}>
                <View style={styles.navbarRight}>
                    <TouchableOpacity activeOpacity={1} onPress={this.commentHandle.bind(this, navigator)}>
                        <Image style={styles.iconComments} source={icons.comments}/>
                    </TouchableOpacity>
                    <Text style={styles.navbarText}>127</Text>

                    <TouchableOpacity activeOpacity={0.8} onPress={this._toggleStar.bind(this, navigator)}>
                        <Image style={styles.iconStars} source={starIcon}/>
                    </TouchableOpacity>
                    <Text style={styles.navbarText}>{this.stars}</Text>

                    <Image style={styles.iconShare} source={icons.share}/>
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

    renderScene() {
        return <ActivityMoreDetail activity={this.activity} route={this}/>
    }
}

module.exports = ActivityMoreDetailRoute;
