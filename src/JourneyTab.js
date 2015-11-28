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

var icons = require('./icons');
var su = require('./styleUtils');
var api = require('./api');
var journey = api.journey;

var deviceWidth = Dimensions.get('window').width;
var JourneyView = require('./journey/JourneyView');

var BaseRouteMapper = require('./BaseRouteMapper');
var JourneyDetail = require('./JourneyDetail');

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

  _gotoDetail: function() {
    this.props.navigator.push(new JourneyDetail());
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
          <JourneyView style={styles.cell} key={data.id} data={data} gotoDetail={this._gotoDetail}/>
      );
  },
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
        alignItems: 'flex-start'
      },

      cell: {
        width: (deviceWidth - 10) / 2,
        padding: 5,
      }
});

module.exports = JourneyTab;
