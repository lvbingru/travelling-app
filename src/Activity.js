'use strict';

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
var api = require('./api');
var activity = api.activity;

var BaseRouteMapper = require('./BaseRouteMapper');
var EventEmitter = require('EventEmitter');

var REGIONS = [{
    id: 0,
    tag: 'all',
    name: '全部',
    icon: require('image!icon-region-shanxi')
}, {
    id: 1,
    tag: 'beijing',
    name: '北京',
    icon: require('image!icon-region-beijing'),
}, {
    id: 2,
    tag: 'hebei',
    name: '河北',
    icon: require('image!icon-region-hebei'),
}, {
    id: 3,
    tag: 'shandong',
    name: '山东',
    icon: require('image!icon-region-shandong'),
}, {
    id: 4,
    tag: 'tianjin',
    name: '天津',
    icon: require('image!icon-region-tianjin'),
}, {
    id: 5,
    tag: 'neimenggu',
    name: '内蒙古',
    icon: require('image!icon-region-neimenggu'),
}];

class ActivityListRoute extends BaseRouteMapper {

    constructor(navigator) {
        super();

        this._emitter = new EventEmitter();
        this._navigator = navigator;
        this._filterEnabled = false;
        this._region = REGIONS[0];
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
        var styles = StyleSheet.create({
            regionFilter: {
                marginVertical: 12,
                marginLeft: 10,
            },
            regionFilterInner: {
                alignItems: 'center',
                flexDirection: 'row'
            },
            filterIcon: {
                ...su.size(15, 20),
                    marginRight: 5
            },
            region: {
                color: '#fff',
                fontSize: 14
            }
        });

        return (
            <TouchableOpacity 
              activeOpacity={0.8} 
              style={styles.regionFilter} 
              onPress={this._toggleRegions.bind(this)}>

              <View style={styles.regionFilterInner}>
                <Image style={styles.filterIcon} source={require('image!icon-annotation')}/>
                <Text style={styles.region}>
                  {this._filterEnabled ? '取消' : this._region.name}
                </Text>
              </View>
            </TouchableOpacity>
        );
    }
}

Object.assign(ActivityListRoute, EventEmitter.prototype);

var {
    ActivitySchedule,
    Tag
} = require('./widgets');


var ActivityList = React.createClass({

    getInitialState: function() {
        try {
          this.route = new ActivityListRoute(this.props.navigator);
        } catch(e) {
          console.trace(e);
        }

        return {
            filterShown: false,
            region: REGIONS[0],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
        };
    },

    componentDidMount: function() {
        try {
          this._fetchData({
              region: this.state.region
          });

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
        } catch(e) {
          console.trace(e);
        }
    },

    _fetchData: function(region) {
        return activity.fetch({
            region: region ? region.tag : null
        }).then(function(data) {
            var dataSource = this.state.dataSource.cloneWithRows(data.results);
            this.setState({
                dataSource: dataSource
            });
        }.bind(this), function(e) {
            console.trace(e);
        });
    },

    _hideRegions: function() {
        this.route._hideRegions();
        this.setState({
            filterShown: false
        });
    },

    _renderHeaderWrapper: function(refreshingIndicator) {
        if (refreshingIndicator == null) {
            return null;
        }

        var styles = {
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
        }

        return (
            <View style={styles.wrap}>
          <Text style={styles.loading}>刷新活动</Text>
          <ActivityIndicatorIOS size="small"/>
        </View>
        );
    },

    _renderSeparator: function(sectionID, rowID, adjacentRowHighlighted) {
        if (rowID == this.state.dataSource.getRowCount() - 1) {
            return null;
        } else {
            return <View style={{height: 20, backgroundColor: 'transparent'}}/>;
        }
    },

    _loadMore: function() {
        console.log('load more data');
    },

    _onRegionSelect: function(region) {
        this.state.region = region;
        this.route.setRegion(region);
        this.setState({
            filterShown: false
        });
        this._fetchData(region);
    },

    _renderRegionCell: function(item) {
        return (
            <TouchableOpacity style={regions.cell} 
              activeOpacity={0.8}
              onPress={this._onRegionSelect.bind(this, item)} key={item.tag}> 
              <View style={regions.region}>
                <Image style={regions.image} source={item.icon}/>
                <Text style={regions.regionName}>{item.name}</Text>
              </View>
            </TouchableOpacity>
        );
    },

    render: function() {
        return (
          <View style={[styles.container, this.props.style]}>
                <RefreshableListView
                  renderHeaderWrapper={this._renderHeaderWrapper}
                  renderSeparator={this._renderSeparator}
                  dataSource={this.state.dataSource}
                  onEndReached={this._loadMore}
                  renderRow={this._renderRow}
                  loadData={this._onRefresh}/>

                {this.state.filterShown &&
                <TouchableOpacity activeOpacity={1} style={regions.popup} onPress={this._hideRegions}>
                  <BlurView style={{flex: 1}} blurType="light">
                    <View style={regions.grid}>
                      <View style={regions.row}>
                        {REGIONS.slice(0, 3).map(this._renderRegionCell)}
                      </View>
                      <View style={regions.row}>
                        {REGIONS.slice(3).map(this._renderRegionCell)}
                      </View>
                    </View>
                  </BlurView>
                </TouchableOpacity>}
          </View>
        );
    },

    _onRefresh: function() {
        return this._fetchData(this.state.region);
    },

    _renderRow: function(data) {
        return (
            <Activity 
                key={data.id} 
                data={data} 
                onPress={() => {
                    this.props.navigator.push(new ActivityDetail(data.id));
                }
            }/>
        );
    },
});

var Activity = React.createClass({
    getInitialState: function() {
        return {}
    },

    _renderTags: function() {
        var data = this.props.data;

        var tags = data.tags.map(function(tag) {
            return (<Tag style={styles.tag} key={tag}>{tag}</Tag>);
        });

        if (data.status === activity.PREPARING) {
            tags = [<Tag key={activity.PREPARING} style={styles.tagHot}>火热报名中</Tag>].concat(tags);
        } else {
            tags = [<Tag key={activity.TRAVELLING} style={styles.tagDue}>报名已截止</Tag>].concat(tags);
        }

        return (
            <View style={styles.tags}>{tags}</View>
        );
    },

    render: function() {
        var data = this.props.data;
        var user = data.user;
        var avatar = user.avatar ? {
            url: user.avatar
        } : require('image!avatar-placeholder');

        return (
            <TouchableHighlight underlayColor='#f3f5f6' onPress={this.props.onPress}>
                <View style={styles.row}>
                  <View style={styles.brief}>
                    <Image style={styles.bg} source={{uri: data.header}}>
                      <View style={styles.info}>
                        <Text style={styles.title}>{data.title}</Text>
                        {this._renderTags(data)}
                      </View>
                    </Image>
                  </View>

                  <ActivitySchedule data={data} style={{paddingLeft: 16}}/>
                  
                  <View style={styles.user}>
                    <Image style={styles.avatar} source={avatar}/>
                    <Text style={[styles.username, styles.baseText]}>{data.user.username}</Text>
                    <Text style={[styles.publishDate]}>发布于 {moment(data.publishDate).format('YYYY-MM-DD HH:mm')}</Text>

                    <View style={styles.star}>
                      <Image style={styles.iconStar} source={data.starred ? require('image!icon-starred') : require('image!icon-star')}/>
                      <Text style={[styles.baseText, styles.stars]}>{data.stars}</Text>
                    </View>
                  </View>
                </View>
            </TouchableHighlight>
        );
    }
});

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
        flexDirection: 'row',
        alignItems: 'center'
    },

    tag: {
        marginRight: 5,
    },

    tagHot: {
        marginRight: 5,
        borderColor: '#f03a47',
        backgroundColor: '#f03a47'
    },

    tagDue: {
        marginRight: 5,
        borderColor: '#34be9a',
        backgroundColor: '#34be9a'
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

var regions = StyleSheet.create({
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
