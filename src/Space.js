'use strict';

var React = require('react-native');
var {
    // TODO: adapt for android
    AlertIOS,
    StyleSheet,
    Text,
    Image,
    View,
    ScrollView,
    TouchableHighlight,
    TouchableOpacity,
    Dimensions,
} = React;

// FIXME: hack image width
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

console.log('device height', deviceHeight);

var icons = require('./icons');
var su = require('./styleUtils');
var BaseRouteMapper = require('./BaseRouteMapper');
var MyActivity = require('./MyActivity');

var store = require('./store');
var {updateSession} = require('./actions');

var api = require('./api');
var user = api.user
var fetchInfo = api.userinfo;
var debug = require('./debug');
var log = debug('SpaceTab:log');

var SystemSettings = require('./SystemSettings');
var Profile = require('./Profile');

var Entry = React.createClass({
    getInitialState: function() {
        return {}
    },

    render: function() {
        return (
            <TouchableOpacity 
                activeOpacity={0.8} 
                style={[styles.item, this.props.style]} 
                onPress={this.props.onPress}>

                <Image source={this.props.icon} style={styles.icon}/>
                <Text style={styles.baseText}>{this.props.label}</Text>
                <View style={styles.entry}>
                    <Text style={styles.badge}>{this.props.count}</Text>
                    <Image source={icons.arrow} style={styles.arrow}/>
                </View>
            </TouchableOpacity>
        );
    }
});

class SpaceRoute extends BaseRouteMapper {
    get title() {
        return '个人中心'
    }

    get style() {
        return this.styles.navBarEmpty;
    }
}

var Space = React.createClass({

    getInitialState: function() {
        this.route = new SpaceRoute();

        return {
            title: 0,
            content: 0,
            info: {}
        };
    },

    componentDidMount: function() {
        this.fetchData();
    },

    componentWillUnmout: function() {
        log('Space tab will mount!');
    },

    _goto: function(entry) {
        return function() {
            if (entry === 'activity') {
                this.props.navigator.push(new MyActivity());
            }
        }.bind(this);
    },

    fetchData: function() {
        fetchInfo.fetch()
            .then((response) => {
                this.setState({
                    info: response.results
                })
            })
            .done();
    },

    _logout: function() {
        user.logout().then(function() {
            store.dispatch(updateSession({
                user: null
            }));
        }, function(e) {
            console.trace(e);
            return AlertIOS.alert(e.reason);
        });
    },

    _systemSettings: function() {
        this.props.navigator.push(new SystemSettings());
    },

    _profile: function() {
        this.props.navigator.push(new Profile());
    },

    render: function() {
        var info = this.state.info;
        var avatar = info.avatar ? {
            uri: info.avatar
        } : icons.avatarPlaceholder;

        return (
            <View style={styles.container}>
              <Image style={styles.banner} source={icons.spaceHeader}>
                <View style={styles.links}>
                  <TouchableOpacity activeOpacity={0.8} style={styles.link}
                    onPress={this._profile}>
                    <Text style={styles.linkText}>个人资料</Text>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.8} style={styles.link}
                    onPress={this._systemSettings}>
                    <Text style={styles.linkText}>设置</Text>
                  </TouchableOpacity>
                </View>
              </Image>

              <View style={styles.user}>
                <Image style={styles.avatar} source={avatar}></Image>
                <Text style={styles.username}>{info.username || ''}</Text>
                <Image source={icons.levelsBg} resizeMode="contain" style={{height: 16}}>
                  <Text style={styles.levels}>等级 {info.grade}</Text>
                </Image>
              </View>

              <View style={styles.items}>
                <Entry label='活动' onPress={this._goto('activity')}
                    icon={icons.activity} count={info.activity || ''}/>
                <Entry label='游记' icon={icons.journey} count={info.journey || ''}/>
                <Entry label='轨迹' icon={icons.annotations} count={info.annotations || ''}/>
                <Entry label='相册' icon={icons.photos} count={info.photos || ''}/>
                <Entry label='账单' icon={icons.bills} count={info.bills || ''} style={styles.last}/>
              </View>

              <TouchableOpacity style={{margin: 20}} 
                activeOpacity={0.9} onPress={this._logout}>
                <Text style={styles.logout}>退出</Text>
              </TouchableOpacity>
            </View>
        );
    }
});

function avatarStyle() {
    var size = deviceHeight <= 568 ? 48 : 64;
    var border = deviceHeight <= 568 ? 2 : 3
    return {
        ...su.size(size),
            borderRadius: size / 2,
            marginTop: -size / 2,
            borderWidth: border,
            borderColor: '#fff'
    };
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },

    banner: {
        width: deviceWidth,
        height: deviceHeight <= 568 ? 125 : 180
    },

    links: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 30,
    },

    link: {
        backgroundColor: 'transparent',
        marginRight: 15,
    },

    linkText: {
        color: '#fff'
    },

    user: {
        alignItems: 'center',
        marginBottom: deviceHeight <= 568 ? 15 : 25,
    },

    avatar: avatarStyle(),

    username: {
        fontSize: 17,
        marginVertical: 5,
    },

    levels: {
        fontSize: 10,
        lineHeight: 13,
        textAlign: 'center',
        backgroundColor: 'transparent',
        color: '#fff'
    },

    logout: {
        flex: 1,
        paddingVertical: 10,
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        overflow: 'hidden',
        borderRadius: 6,
        backgroundColor: '#0087fa',
    },

    baseText: {
        color: '#303030'
    },

    items: {
        borderTopWidth: 1,
        borderTopColor: '#dbe0e3',
        borderBottomWidth: 1,
        borderBottomColor: '#dbe0e3',
        paddingLeft: 10
    },

    item: {
        ...su.padding(10, 10, 10, 5),
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: '#dbe0e3'
    },

    last: {
        borderBottomWidth: 0
    },

    badge: {
        fontSize: 12,
        backgroundColor: '#dbe0e3',
        borderRadius: 3,
        color: '#737373',
        width: 25,
        marginRight: 15,
        textAlign: 'center',
        paddingVertical: 2
    },

    entry: {
        // FIXME: hack
        height: 24,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        right: 10,
    },

    icon: {
        ...su.size(24),
            marginRight: 10
    },

    arrow: {
        ...su.size(8, 15),
    },
});

module.exports = Space;
