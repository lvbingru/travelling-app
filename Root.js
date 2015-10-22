'use strict';

var React = require('react-native');
var cssVar = require('cssVar');

var SignInView = require('./src/SignInView');
var SignUpView = require('./src/SignUpView');

var ModalExample = require('./ModalExample');
var Onboarding = require('./src/Onboarding');
var config = require('./src/config');
var MainTabPage = require('./src/MainTabPage');
var PlusMenu = require('./src/PlusMenu');

var api = require('./src/api');
var Navbars = require('./src/Navbars');
var {user} = api;

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
    return { offset: new Animated.Value(deviceHeight) }
  },
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
        <Animated.View style={[styles.modal, {transform: [{translateY: this.state.offset}]}]}>
          {this._renderView()}
        </Animated.View>
    )
  }
});

var Home = React.createClass({
  getInitialState: function() {
    return {
      status: 'loading',
      navBar: Navbars.None
    };
  },

  componentDidMount: function() {
    if (config.platform === 'ios') {
      StatusBarIOS.setStyle('light-content');
    }

    var context = this.refs.navigator.navigationContext;
    context.addListener('willfocus', this._ensureNavigationBar);
    AsyncStorage.getItem('userstamp').then(function(userstamp) {
        if (!userstamp) {
          return 'onboarding';
        }

        return user.currentUser().then(function(user) {
          return user ? 'playing' : 'signin'
        }, function(e) {
          return 'signin';
        });
      }, function() {
        return 'onboarding'; 
      }).then(this._replaceRoute);
  },

  componentWillUnmount: function() {
    this._navigationSubscription.remove();
  },

  _ensureNavigationBar: function(e) {
    var route = e ? e.data.route : this.refs.navigator.navigationContext.currentRoute;
    console.log('handle willfocus', route);
    if(['onboarding', 'plus-menu'].indexOf(route.name) !== -1) {
      this.setState({
        navBar: Navbars.None
      });
    } else if (['signin'].indexOf(route.name) !== -1) {
      this.setState({
        navBar: Navbars.Transparent
      });
    } else {
      this.setState({
        navBar: Navbars.Normal
      });
    }
  },

  onStart: function() {
    AsyncStorage.setItem('userstamp', "" + Date.now()).catch(function(e) {
      console.trace(e);
    });

    user.currentUser().then(function(user) {
      return user ? 'playing' : 'signin';
    }, function () {
      return 'signin'
    }).then(this._replaceRoute);
  },

  _replaceRoute: function(status) {
    var route;
    if (status === 'signin') {
        route = {
          title: '登录',
          name: 'signin'
        };
    } else if(status === 'onboarding'){
        route = {
          title: '功能介绍',
          name: 'onboarding'
        };
    } else {
      route = {
          title: '活动',
          name: 'main'
      };
    }
    this.refs.navigator.replace(route);
  },

    render: function() {
      return (
          <View style={styles.container}>
            <Navigator
              ref="navigator"
              navigationBar={this.state.navBar}
              style={styles.container}
              initialRoute={{title: '', name: 'empty'}}
              configureScene={this._configureScene}
              renderScene={this.renderScene}/>

            {this.state.modal && <TopModal view={this.state.modalView} closeModal={() => this.setState({modal: false})}/>}
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
      this.setState({navBar});
    },

    _openModal: function(view) {
      this.setState({
        modal: true,
        modalView: view
      });
    },

    renderScene: function(route, navigator) {
      var _interface = {
        setNavigationBar: this._changeNavigationBar,
        openModal: this._openModal
      };

      if (route.name === 'onboarding') {
        return <Onboarding onStart={this.onStart} {..._interface}/>
      }

      var routeCompMap = {
        'empty': EmptyRoute,
        'signin': SignInView,
        'signup': SignUpView,
        'main': MainTabPage,
      };

      var Component = routeCompMap[route.name];
      return <Component navigator={navigator} style={styles.scene} {..._interface}/>
    }
});

var EmptyRoute = React.createClass({
  render: function() {
    return <View></View>;
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
