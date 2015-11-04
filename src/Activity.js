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

Object.assign(ActivityListRoute, EventEmitter.prototype);

var {
    ActivitySchedule,
    Tag
} = require('./widgets');

var ActivityTags = require('./ActivityTags');


var ActivityList = React.createClass({

    getInitialState: function() {
        this.route = new ActivityListRoute(this.props.navigator);

        return {
            activities: [],
            filterShown: false,
            region: initialRegion,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
        };
    },

    componentWillUnmount: function() {
        // this._navSub.remove();
        // this._unsubscribe();
    },

    componentDidMount: function() {
        this.route.on('regions-show', function() {
            this.setState({
                filterShown: true
            });
        }.bind(this));

        this.route.on('regions-cancel', function() {
            this.setState({
                filterShown: false
            });
        }.bind(this));

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
        }.bind(this), error).finally(function() {
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
                  ref="list"
                  automaticallyAdjustContentInsets={false}
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

    _toDetail: function(activity) {
        this.props.navigator.push(new ActivityDetail({
            activity
        }, this.props.navigator));
    },

    _renderRow: function(_activity) {
        return (
            <Activity key={'activity-' + _activity.id}
                data={_activity} onPress={() => this._toDetail(_activity)}/>
        );
    }
});

var Activity = React.createClass({

    getInitialState: function() {
        return {
            creator: new AV.User(),
            currentUser: new AV.User(),
            starred: false,
            stars: 0
        }
    },

    componentDidMount: function() {
        log('Cmponent Activity mount');
    },

    render: function() {
        var _activity = this.props.data;
        log('activity data', _activity);
        var creator = _activity.get('createBy');

        // var avatar = creator.avatar ? {
        // url: creator.avatar
        // } : require('image!avatar-placeholder');
        var avatar = require('image!avatar-placeholder');

        // TODO: use real cover
        var coverPlaceholder = 'http://f.hiphotos.baidu.com/image/pic/item/b64543a98226cffc9b70f24dba014a90f703eaf3.jpg';
        // TODO: fetch starred
        var iconStar = _activity.getStarred() ? require('image!icon-star') : require('image!icon-stars');

        return (
            <TouchableHighlight underlayColor='#f3f5f6' onPress={this.props.onPress}>
                <View style={styles.row}>
                  <View style={styles.brief}>
                    <Image style={styles.bg} source={{uri: coverPlaceholder}}>
                      <View style={styles.info}>
                      <Text style={styles.title}>{_activity.get('title')}</Text>
                      <ActivityTags data={_activity} style={styles.tags}/>
                      </View>
                    </Image>
                  </View>

                  <ActivitySchedule data={_activity} style={{paddingLeft: 16}}/>
                  
                  <View style={styles.user}>
                    <Image style={styles.avatar} source={avatar}/>
                    <Text style={[styles.username, styles.baseText]}>
                        {creator.get('username') || ""}
                    </Text>
                    <Text style={[styles.publishDate]}>
                        发布于 {moment(_activity.getCreatedAt()).format('YYYY-MM-DD HH:mm')}
                    </Text>

                    <View style={styles.star}>
                      <Image style={styles.iconStar} source={iconStar}/>
                      <Text style={[styles.baseText, styles.stars]}>{_activity.getStars()}</Text>
                    </View>
                  </View>
                </View>
            </TouchableHighlight>
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
    icon: {
        ...su.size(11)
    },

    baseText: {
        color: '#303030',
        fontWeight: '200'
    },

    container: {
        flex: 1,
        backgroundColor: '#f3f5f6',
    },

    row: {
        backgroundColor: '#fff'
    },

    brief: {
        height: 180,
        marginBottom: 10
    },

    bg: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },

    info: {
        backgroundColor: 'transparent',
        paddingLeft: 16,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0
    },

    title: {
        textAlign: 'left',
        fontSize: 20,
        color: '#fff',
        marginBottom: 10
    },

    tags: {
        marginBottom: 15,
    },

    user: {
        paddingBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 16
    },

    avatar: {
        ...su.size(25),
            borderRadius: 12.5,
            marginRight: 10
    },

    username: {
        fontSize: 12,
        // FIXME: hack 
        lineHeight: 15,
        marginRight: 10
    },

    publishDate: {
        fontSize: 10,
        lineHeight: 15,
        marginRight: 10,
        fontWeight: '100',
        color: '#96969b'
    },

    toolbar: {
        backgroundColor: '#F5FCFF',
        height: 50
    },

    listView: {
        flex: 1,
        marginTop: 44,
        backgroundColor: '#f3f5f6',
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
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 30,
        ...su.size(60),
        marginBottom: 10
    },

    regionName: {
        color: '#fff'
    }
});

module.exports = ActivityList;
