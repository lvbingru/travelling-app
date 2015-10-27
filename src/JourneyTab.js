'use strict';

var moment = require('moment');
var React = require('react-native');
var {
  ActivityIndicatorIOS,
  StyleSheet,
  Text,
  Image,
  View,
  Navigator,
  ScrollView,
  TouchableHighlight,
  ListView,
  Dimensions,
} = React;

var RefreshableListView = require('react-native-refreshable-listview');
var Navbars = require('./Navbars');
var {
  UserInfo 
}= require('./widgets');

var su = require('./styleUtils');
var api = require('./api');
var journey = api.journey;

var deviceWidth = Dimensions.get('window').width;

var BaseRouteMapper = require('./BaseRouteMapper');

class JourneyRoute extends BaseRouteMapper {
  get title() {
    return '游记';
  }
}

// FIXME: hack listview for grid
var JourneyTab = React.createClass({
  getInitialState: function() {
    this.route = new JourneyRoute();
    
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    };
  },

  componentDidMount: function() {
    this._fetchData();
  },

  _navbar: function(title) {
    var routeMapper = Object.assign({}, Navbars.NormalRouteMapper);
    var _Title = routeMapper.Title;
    routeMapper.Title = function(route, navigator, index, navState) {
      var _route = Object.assign({}, route);
      _route.title = title;
      return _Title(_route, navigator, index, navState);
    }
    var navbar = React.cloneElement(Navbars.Normal, {
      routeMapper
    });
    return navbar;
  },

  _fetchData: function() {
    return journey.fetch().then(function(data) {
      var dataSource = this.state.dataSource.cloneWithRows(data.results);
      this.setState({
        dataSource: dataSource
      });
    }.bind(this), console.trace.bind(console));
  },

  _renderHeaderWrapper: function(refreshingIndicator) {
    if (refreshingIndicator == null) {
      return null;
    }

    var styles = {
      wrap: {
        width: deviceWidth - 10,
        paddingVertical: 10,
        alignItems: 'center', 
        justifyContent: 'center'
      },

      loading: {
        fontSize: 9,
        marginBottom: 5,
        color: '#777'
      }
    }

    return (
        <View style={styles.wrap}>
          <Text style={styles.loading}>刷新游记</Text>
          <ActivityIndicatorIOS size="small"/>
        </View>
    );
  },

  render: function() {
      return (
        <View style={[{flex: 1}, this.props.style]}>
          <RefreshableListView
            style={styles.list}
            contentContainerStyle={styles.grid}
            dataSource={this.state.dataSource}
            renderHeaderWrapper={this._renderHeaderWrapper}
            renderRow={this._renderItem}
            loadData={this._onRefresh}/>
        </View>
      );
  },

  _onRefresh: function() {
    return this._fetchData();
  },

  _renderItem: function(data) {
      return (
          <Journey style={styles.cell} key={data.id} data={data}/>
      );
  },
});

var Journey = React.createClass({
  getInitialState: function() {
    return {}
  },

  _onTouch: function() {},

  render: function() {
    var data = this.props.data;
    var user = data.user;
    var avatar = user.avatar ? {url: user.avatar} : require('image!avatar-placeholder');

    return (
        <TouchableHighlight style={this.props.style} underlayColor='#f3f5f6'>
          <View>
            <View style={styles.header}>
              <Image style={styles.image} source={{uri: data.header}}>
                <UserInfo 
                  style={styles.info}
                  avatar={avatar} 
                  username={data.user.username} 
                  publishDate={data.publishDate}/>
              </Image>
            </View>

            <View style={styles.extra}>
                <Text style={[styles.title, styles.baseText]}>{data.title}</Text>

                <View style={styles.data}>
                  <Image source={require('image!icon-views')} style={[styles.icon, {marginRight: 4}]}/>
                  <Text style={[styles.small, {marginRight: 12}]}>{data.views}</Text>
                  <Image source={require('image!icon-stars')} style={[styles.icon, {marginRight: 4}]}/>
                  <Text style={styles.small}>{data.stars}</Text>
                </View>
            </View>
          </View>
        </TouchableHighlight>
    );
  }
});

var styles = StyleSheet.create({
      icon: {
        ...su.size(12),
        resizeMode: 'contain'
      },

      baseText: {
        color: '#303030',
        fontWeight: '200'
      },

      list: {
        backgroundColor: '#f3f5f6',
        padding: 5,
      },

      grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flex: 1
      },

      cell: {
        width: (deviceWidth - 10) / 2,
        padding: 5,
      },

      header: {
        flex: 1,
        height: 120,
      },

      image: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      },

      info: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        position: 'absolute',
        left: 10,
        right: 0,
        bottom: 10
      },

      title: {
        textAlign: 'left',
        fontSize: 14,
        marginBottom: 10
      },

      user: {
        flexDirection: 'column'
      },

      avatar: {
        ...su.size(25),
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 12.5,
        marginRight: 10 
      },

      username: {
        color: '#fff',
        fontSize: 12,
        lineHeight: 12,
        marginBottom: 3
      },

      publishDate: {
        color: '#fff',
        fontSize: 9,
        lineHeight: 9,
        marginRight: 10,
        fontWeight: '100'
      },

      extra: {
        padding: 10,
        backgroundColor: '#fff'
      },

      data: {
        alignItems: 'center',
        flexDirection: 'row'
      },

      small: {
        color: '#96969b',
        fontSize: 10
      },

      star: {
        position: 'absolute',
        top: 5,
        right: 15,
        flexDirection: 'row',
      },

      iconStar: {
        ...su.size(15, 14),
        marginRight: 5,
      },

      stars: {
        lineHeight: 14,
        fontSize: 10,
        color: '#96969b'
      }
});

module.exports = JourneyTab;
