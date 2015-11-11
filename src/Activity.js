'use strict';

var debug = require('./debug');
var log = debug('ActivityTab:log');
var error = debug('ActivityTab:error');

var moment = require('moment');
var React = require('react-native');

var {
    ActivityIndicatorIOS,
    StyleSheet,
    Text,
    Image,
    View,
    TouchableOpacity,
    TouchableHighlight,
    ListView
} = React;

var Subscribable = require('Subscribable');

var {
    BlurView
} = require('react-native-blur');
var RefreshableListView = require('react-native-refreshable-listview');
var su = require('./styleUtils');
var Navbars = require('./Navbars');
var ActivityDetail = require('./ActivityDetail');

var AV = require('avoscloud-sdk');
var {
    activity,
    regions,
} = require('./api');

var initialRegion = regions()[0];

var {
    ActivitySchedule,
    BaseText
} = require('./widgets');
var Text = BaseText;
var ActivityTags = require('./ActivityTags');
var ActivityView = require('./activity/ActivityView');

var BaseRouteMapper = require('./BaseRouteMapper');
var EventEmitter = require('EventEmitter');

class ActivityListRoute extends BaseRouteMapper {

    constructor(navigator) {
        super();

        this._emitter = new EventEmitter();
        this._navigator = navigator;
        this._filterEnabled = false;
        this._region = initialRegion;
    }

    on() {
        this._emitter.addListener.apply(this._emitter, arguments);
    }

    get title() {
        return '活动';
    }

    setRegion(region) {
        this._region = region;
        this._filterEnabled = false;
        this._navigator.forceUpdate();
    }

    _hideRegions() {
        this._filterEnabled = false;
        this._navigator.forceUpdate();
    }

    _toggleRegions() {
        if (this._filterEnabled) {
            this._emitter.emit('regions-cancel');
            this._filterEnabled = false;
        } else {
            this._emitter.emit('regions-show');
            this._filterEnabled = true;
        }

        this._navigator.forceUpdate();
    }

    renderLeftButton(route, navigator, index, navState) {
        var styles = this.styles;
        var filterIcon = {
            ...su.size(15, 20),
                marginRight: 5
        }

        return (
            <TouchableOpacity 
              activeOpacity={0.8} 
              style={[styles.wrap, styles.left]} 
              onPress={this._toggleRegions.bind(this)}>
                <Image style={filterIcon} source={require('image!icon-annotation')}/>
                <Text style={styles.navBarText}>
                  {this._filterEnabled ? '取消' : this._region.name}
                </Text>
            </TouchableOpacity>
        );
    }
}


var ActivityList = React.createClass({

    mixins: [Subscribable.Mixin],

    getInitialState: function() {
        this.route = new ActivityListRoute(this.props.navigator);
        this.activitiesObjects = {};

        return {
            activities: [],
            filterShown: false,
            region: initialRegion,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
        };
    },

    componentDidMount: function() {
        this.addListenerOn(this.route._emitter, 'regions-show', function() {
            this.setState({
                filterShown: true
            });
        }, this);;

        this.addListenerOn(this.route._emitter, 'regions-cancel', function() {
            this.setState({
                filterShown: false
            });
        }, this);

        this.refs.list.handleRefresh();
    },

    _hideRegions: function() {
        this.route._hideRegions();
        this.setState({
            filterShown: false
        });
    },

    _renderSeparator: function(sectionID, rowID, adjacentRowHighlighted) {
        if (rowID == this.state.dataSource.getRowCount() - 1) {
            return null;
        } else {
            return <View style={{height: 20, backgroundColor: 'transparent'}}/>;
        }
    },

    _loadMore: function() {
        if (this.state.loadingMore) {
            return error('Invalid operation, loading now');
        }

        this.setState({
            loadingMore: true
        });

        log('load more data');
        var region = this.state.region;

        var lastActivity = this.state.activities[this.state.activities.length - 1];
        return activity.fetch({
            region: region ? region.tag : null,
            latestDate: lastActivity.getCreatedAt()
        }).then(function(_activities) {
            if (_activities.length === 0) {
                return error('No more activities');
            }

            var activities = this.state.activities.concat(_activities);
            log('activities: ', activities.map((item) => item.id).join(','));
            var dataSource = this.state.dataSource.cloneWithRows(activities);
            this.setState({
                dataSource: dataSource,
                activities: activities
            });
        }.bind(this), function(e) {
            console.trace(e);
            error(e);
        }).finally(function() {
            this.setState({
                loadingMore: false
            });
        }.bind(this));
    },

    _onRegionSelect: function(region) {
        this.route.setRegion(region);
        this.state.region = region;
        this._hideRegions();
        this.refs.list.handleRefresh();
    },

    _renderRegionCell: function(item) {
        return (
            <TouchableOpacity style={regionsStyle.cell} 
              activeOpacity={0.8}
              onPress={this._onRegionSelect.bind(this, item)} key={item.tag}> 
              <View style={regionsStyle.region}>
                <Image style={regionsStyle.image} source={item.icon}/>
                <Text style={regionsStyle.regionName}>{item.name}</Text>
              </View>
            </TouchableOpacity>
        );
    },

    _renderFooter: function() {
        if (!this.state.loadingMore) {
            return null;
        }

        return (
            <View style={indicatorStyles.wrap}>
                <Text style={indicatorStyles.loading}>加载活动</Text>
                <ActivityIndicatorIOS size="small"/>
            </View>
        );
    },

    _renderHeaderWrapper: function(refreshingIndicator) {
        if (refreshingIndicator == null) {
            return null;
        }

        return (
            <View style={indicatorStyles.wrap}>
                <Text style={indicatorStyles.loading}>刷新更多</Text>
                <ActivityIndicatorIOS size="small"/>
            </View>
        );
    },

    render: function() {
        return (
            <View style={[styles.container, this.props.style]}>
                <RefreshableListView
                  scrollEventThrottle={16}
                  ref="list"
                  renderHeaderWrapper={this._renderHeaderWrapper}
                  renderSeparator={this._renderSeparator}
                  dataSource={this.state.dataSource}
                  renderFooter={this._renderFooter}
                  onEndReached={this._loadMore}
                  renderRow={this._renderRow}
                  loadData={this._refresh}/>

                {this.state.filterShown &&
                <TouchableOpacity activeOpacity={1} style={regionsStyle.popup} onPress={this._hideRegions}>
                  <BlurView style={{flex: 1}} blurType="light">
                    <View style={regionsStyle.grid}>
                      <View style={regionsStyle.row}>
                        {regions().slice(0, 3).map(this._renderRegionCell)}
                      </View>
                      <View style={regionsStyle.row}>
                        {regions().slice(3).map(this._renderRegionCell)}
                      </View>
                    </View>
                  </BlurView>
                </TouchableOpacity>}
          </View>
        );
    },

    _refresh: function() {
        return activity.fetch({
            region: this.state.region
        }).then(function(activities) {
            log('activities:', activities.map((item) => item.attributes));
            var dataSource = this.state.dataSource.cloneWithRows(activities);
            this.setState({
                dataSource: dataSource,
                activities: activities
            });
        }.bind(this));
    },

    refreshDetail: function(id) {
        this.activitiesObjects[id].forceUpdate();
    },

    _toDetail: function(activity) {
        this.props.navigator.push(new ActivityDetail({
            activity
        }, this.props.navigator, this.refreshDetail));
    },

    _renderRow: function(_activity) {
        return (
            <ActivityView key={'activity-' + _activity.id} ref={component => this.activitiesObjects[_activity.id] = component}
                activity={_activity} onPress={() => this._toDetail(_activity)}/>
        );
    }
});

var indicatorStyles = StyleSheet.create({
    wrap: {
        flex: 1,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },

    loading: {
        fontSize: 9,
        marginBottom: 5,
        color: '#777'
    }
})

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f5f6',
    },

    icon: {
        ...su.size(11)
    },

    baseText: {
        color: '#303030',
        fontWeight: '200'
    },

    toolbar: {
        backgroundColor: '#F5FCFF',
        height: 50
    },

    listView: {
        flex: 1,
        marginTop: 44,
        backgroundColor: '#f3f5f6',
    }
});

var regionsStyle = StyleSheet.create({
    popup: {
        position: 'absolute',
        backgroundColor: 'transparent',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },

    grid: {
        backgroundColor: '#0087fa',
        padding: 20,
        paddingBottom: 10
    },

    row: {
        flexDirection: 'row',
        paddingBottom: 25
    },

    cell: {
        flex: 1
    },

    region: {
        alignItems: 'center'
    },

    image: {
        ...su.size(60),
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 30,
        marginBottom: 10
    },

    regionName: {
        color: 'white'
    }
});

module.exports = ActivityList;
