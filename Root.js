'use strict';

// FIXME: hack react native packager 给 leancloud-realtime 提供 xmlhttprequest 模块
require('xmlhttprequest');

var React = require('react-native');
var cssVar = require('cssVar');

var SignIn = require('./src/SignIn');
var SignUp = require('./src/SignUp');

var ModalExample = require('./ModalExample');
var Onboarding = require('./src/Onboarding');
var config = require('./src/config'); var HomePage = require('./src/HomePage'); var Onboarding = require('./src/Onboarding'); var NavBar = require('./src/NavBar'); var Dispatcher = require('./src/Dispatcher');
var store = require('./src/store');
var {buildSession} = require('./src/actions');

var debug = require('./src/debug');
var log = debug('Root:log');
var api = require('./src/api');
var AV = api.AV;

var Navbars = require('./src/Navbars');
var {
    user
} = api;

var {
    Animated,
    AppRegistry,
    AsyncStorage,
    StyleSheet,
    Dimensions,
    Text,
    Image,
    myIcon,
    CameraRoll,
    SliderIOS,
    SwitchIOS,
    AlertIOS,
    Modal,
    View,
    Component,
    LayoutAnimation,
    TouchableOpacity,
    ListView,
    TouchableHighlight,
    Navigator,
    TabBarIOS,
    StatusBarIOS,
    NativeModules
} = React;

var API_KEY = '7waqfqbprs7pajbz28mqf6vz';
var API_URL = 'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json';
var PAGE_SIZE = 25;
var PARAMS = '?apikey=' + API_KEY + '&page_limit=' + PAGE_SIZE;
var REQUEST_URL = API_URL + PARAMS;

// FIXME: hack image width
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

var TopModal = React.createClass({
    getInitialState: function() {
        return {
            offset: new Animated.Value(deviceHeight)
        }
    },

    displayName: 'TopModal',

    componentDidMount: function() {
        Animated.timing(this.state.offset, {
            duration: 100,
            toValue: 0
        }).start();
    },

    closeModal: function() {
        Animated.timing(this.state.offset, {
            duration: 100,
            toValue: deviceHeight
        }).start(this.props.closeModal);
    },

    _renderView: function() {
        return React.cloneElement(this.props.view, {
            closeModal: this.closeModal
        });
    },

    render: function() {
        return (
            <Animated.View 
                style={[styles.modal, {transform: [{translateY: this.state.offset}]}]}>
                {this._renderView()}
            </Animated.View>
        )
    }
});

var BaseRouteMapper = require('./src/BaseRouteMapper');

class EmptyRoute extends BaseRouteMapper {
    renderScene(navigator) {
        return null;
    }
}

var Home = React.createClass({
    getInitialState: function() {
        return {
            status: 'loading',
            navBar: Navbars.None
        };
    },

    _testRoute: function() {
        //var route = require('./src/friends/ConversationScene');
        // var route = require('./src/testrealtimemessage');
        // var Route = require('./src/LocalPhotoPicker');
        //var Route = require('./src/LocalPhotoPicker');
        // var Route = require('./src/ActivityApply');
        // var Route = require('./src/TestStretchy');
        // var Route = require('./src/FillActivityBrief');
        // var Route = require('./src/FillActivityDetail');
        // var Route = require('./src/ActivityFormSummary');
        //var Route = require('./src/LocalSeveralPhotoPicker');
        //var Route = require('./src/RecordActivityChoosePhoto');
        //var Route = require('./src/RecordActivityEdit');
        //var Route = require('./src/SystemSettings');
        //var Route = require('./src/Profile');
        var Route = require('./src/FriendSpace');
        //var Route = require('./src/FriendSpaceGallery');
        this.refs.navigator.replace(new Route(new AV.User()));
    },

    _handleChange: function() {
        var state = store.getState();
        var prevSession = this.state.session;
        var session = state.session;

        if (prevSession === session) {
            return;
        }

        this.state.session = session;
        if (!session.userstamp) {
            log('route to onboarding');
            this.refs.navigator.replace(new Onboarding());
        } else if(!session.user) {
            log('route to signin');
            this.refs.navigator.replace(new SignIn());
        } else {
            log('route to playing');
            this._homeRoute = new HomePage(this.refs.navigator);
            this.refs.navigator.replace(this._homeRoute);
        }
    },

    componentDidMount: function() {
        //return this._testRoute();

        Dispatcher.addListener('logout', function() {
            this.refs.navigator.resetTo(new SignIn)
        }.bind(this));

        Dispatcher.addListener('publish-activity:cancel', this._onPublishActivityCancel);
        Dispatcher.addListener('publish-activity:done', this._onPublishActivityDone);

        if (config.platform === 'ios') {
            StatusBarIOS.setStyle('light-content');
        }

        this._unsubscribe = store.subscribe(this._handleChange);

        Promise.all([
            AsyncStorage.getItem("userstamp"),
            AV.User.currentAsync()
        ]).then(function(values) {
            var [userstamp, user] = values;
            store.dispatch(buildSession(userstamp, user));
        });
    },

    componentWilUnmount: function() {
        this._unsubscribe();
    },

    _onPublishActivityCancel: function() {
        this.refs.navigator.popToRoute(this._homeRoute);
    },

    _onPublishActivityDone: function() {
        this.refs.navigator.popToRoute(this._homeRoute);
    },

    _onStart: function() {
        AsyncStorage.setItem('userstamp', "" + Date.now()).catch(function(e) {
            console.trace(e);
        });

        user.currentUser().then(function(user) {
            return user ? 'playing' : 'signin';
        }, function() {
            return 'signin'
        }).then(this._replaceRoute);
    },

    _replaceRoute: function(status) {
        var route;
        if (status === 'signin') {
            route = new SignIn();
        } else if (status === 'onboarding') {
            route = new Onboarding();
        } else {
            route = this._homeRoute = new HomePage(this.refs.navigator);
        }

        this.refs.navigator.replace(route);
    },

    render: function() {
        var routeMapper = {
            RightButton: function(route) {
                return route.renderRightButton.apply(route, arguments);
            },

            Title: function(route) {
                return route.renderTitle.apply(route, arguments);
            },

            Style: function(route) {
                return route.style;
            },

            LeftButton: function(route) {
                return route.renderLeftButton.apply(route, arguments);
            }
        };

        return (
            <View style={styles.container}>
                <Navigator
                  ref="navigator"
                  navigationBar={<NavBar routeMapper={routeMapper}/>}
                  style={styles.container}
                  initialRoute={new EmptyRoute}
                  configureScene={this._configureScene}
                  renderScene={this.renderScene}/>

                {this.state.modal && 
                <View style={[styles.modal, this.state.modalStyle]}>
                    <TopModal 
                        view={this.state.modalView} 
                        closeModal={() => this.setState({modal: false})}/>
                </View>
                }
            </View>
        );
    },

    _configureScene: function(route) {
        if (route.name === 'plus-menu') {
            return Navigator.SceneConfigs.FloatFromBottom;
        } else {
            return Navigator.SceneConfigs.FloatFromRight;
        }
    },

    _changeNavigationBar: function(navBar) {
        this.setState({
            navBar
        });
    },

    _openModal: function(view, style) {
        this.setState({
            modal: true,
            modalStyle: style,
            modalView: view
        });
    },

    renderScene: function(route, navigator) {
        var scene = route.renderScene(navigator);
        if (!scene) {
            return null;
        }

        return React.cloneElement(scene, {
            navigator: navigator,
            setNavigationBar: this._changeNavigationBar,
            openModal: this._openModal,
            style: styles.scene,
            update: this.forceUpdate.bind(this)
        });
    }
});


var style = require("./style");

var styleListView = require("./styleListView");

var styles = StyleSheet.create({
    container: {
        flex: 1
    },

    modal: {
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    },

    icon: {
        fontSize: 20,
        color: 'white',
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderRadius: 4,
        backgroundColor: '#3b5998',
    },

    slider: {
        height: 10,
        margin: 10,
    },
    text: {
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '500',
        margin: 10,
    },

    scene: {
        paddingTop: 64
    }
});

module.exports = Home;
