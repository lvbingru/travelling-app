'use strict';

var React = require('react-native');
var cssVar = require('cssVar');

var SignIn = require('./src/SignIn');
var SignUp = require('./src/SignUp');

var ModalExample = require('./ModalExample');
var Onboarding = require('./src/Onboarding');
var config = require('./src/config');
var HomePage = require('./src/HomePage');
var Onboarding = require('./src/Onboarding');
var NavBar = require('./src/NavBar');

var Dispatcher = require('./src/Dispatcher');

var api = require('./src/api');
var Navbars = require('./src/Navbars');
var {
    user
} = api;

var {
    RefresherListView,
    LoadingBarIndicator
} = require('react-native-refresher');


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

    componentDidMount: function() {
        Dispatcher.addListener('logout', function() {
            this.refs.navigator.resetTo(new SignIn)
        }.bind(this));

        Dispatcher.addListener('onboarding-start', this.onStart.bind(this));

        if (config.platform === 'ios') {
            StatusBarIOS.setStyle('light-content');
        }

        // AsyncStorage.getItem('userstamp').then(function(userstamp) {
        //     if (!userstamp) {
        //         return 'onboarding';
        //     }

        //     return user.currentUser().then(function(user) {
        //         return user ? 'playing' : 'signin'
        //     }, function(e) {
        //         return 'signin';
        //     });
        // }, function() {
        //     return 'onboarding';
        // }).then(this._replaceRoute);

        // var Route = require('./src/FillActivityBrief');
        // var Route = require('./src/FillActivityDetail');
        var Route = require('./src/ActivityFormSummary');
        this.refs.navigator.replace(new Route({startDate: new Date(2015, 9, 10)}));
    },

    componentWillUnmount: function() {
        this._navigationSubscription.remove();
    },

    onStart: function() {
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
            route = new HomePage(this.refs.navigator);
        }

        this.refs.navigator.replace(route);
    },

    render: function() {
        var routeMapper = {
            RightButton(route) {
                    return route.renderRightButton.apply(route, arguments);
                },

                Title(route) {
                    return route.renderTitle.apply(route, arguments);
                },

                Style(route) {
                    return route.style;
                },

                LeftButton(route) {
                    return route.renderLeftButton.apply(route, arguments);
                }
        };

        var navbar = (
            <NavBar
                style={styles.navBar} 
                routeMapper={routeMapper}/>
        );

        return (
            <View style={styles.container}>
            <Navigator
              ref="navigator"
              navigationBar={navbar}
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

    navBarTrasnparent: {
        backgroundColor: 'transparent'
    },

    navBar: {
        backgroundColor: '#0087fa'
    },

    navBarText: {
        fontSize: 16,
        marginVertical: 10,
    },
    navBarTitleText: {
        color: '#fff',
        height: 16,
        marginVertical: 14,
    },
    navBarLeftButton: {
        marginLeft: 10,
        marginVertical: 14,
        width: 17,
        height: 16
    },
    navBarRightButton: {
        paddingRight: 10,
    },
    navBarButtonText: {
        color: '#fff'
    },
    scene: {
        paddingTop: 64
    }
});

module.exports = Home;
