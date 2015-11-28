'use strict';

var debug = require('../debug');
var log = debug('ActivityView:log');
var error = debug('ActivityView:error');

var moment = require('moment');
var React = require('react-native');

var {
    StyleSheet,
    Text,
    Image,
    View,
    TouchableOpacity,
    TouchableHighlight,
    PixelRatio
} = React;

var {
    ActivitySchedule,
    BaseText
} = require('../widgets');

var icons = require('../icons');
var Text = BaseText;

var stylesVar = require('../stylesVar');
var su = require('../styleUtils');
var ActivityTags = require('../ActivityTags');

var ActivityView = React.createClass({

    getInitialState: function() {
        return {}
    },

    render: function() {
        var _activity = this.props.activity;
        var creator = _activity.get('createBy');

        // var avatar = creator.avatar ? {
        // url: creator.avatar
        // } : require('image!avatar-placeholder');
        var avatar = icons.avatarPlaceholder;

        var iconStar = _activity.getStarred() ? icons.star : icons.stars;

        return (
            <TouchableOpacity activeOpacity={0.8} onPress={this.props.onPress}>

                <View style={styles.row}>
                  <View style={styles.brief}>
                    <Image style={styles.bg} source={{uri: _activity.getCover()}}>
                      <View style={styles.info}>
                        <Text style={styles.title}>{_activity.get('title')}</Text>
                        <ActivityTags data={_activity} style={styles.tags}/>
                      </View>
                    </Image>
                  </View>

                  <ActivitySchedule data={_activity} style={{paddingLeft: 16}}/>
                  
                  <View style={styles.user}>
                    <View style={styles.usernameView}>
                      <Image style={styles.avatar} source={avatar}/>
                      <Text style={styles.username}>
                          {creator.get('username') || ""}
                      </Text>
                      <Text style={[styles.publishDate]}>
                          发布于 {moment(_activity.getCreatedAt()).format('YYYY-MM-DD HH:mm')}
                      </Text>
                    </View>
                    <View style={styles.star}>
                      <Image style={styles.iconStar} source={iconStar}/>
                      <Text style={styles.stars}>{_activity.getStars()}</Text>
                    </View>

                  </View>
                </View>
            </TouchableOpacity>
        );
    }
});

var styles = StyleSheet.create({

    baseText: {
        color: stylesVar('dark'),
        fontWeight: '300'
    },

    container: {
        flex: 1,
        backgroundColor: stylesVar('dark-ligher'),
    },

    row: {
        backgroundColor: 'white'
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
        flex: 1,
        flexDirection: 'row',
        borderTopWidth: 1 / PixelRatio.get(),
        borderBottomWidth: 1 / PixelRatio.get(),
        borderColor: stylesVar('dark-light'),
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 15
    },

    usernameView: {
      flex: 1,
      flexDirection: 'row',
      height: 40,
      alignItems: 'center',
      justifyContent: 'flex-start'
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

    star: {
        position: 'absolute',
        right: 15,
        flexDirection: 'row',
        borderLeftWidth: 1 / PixelRatio.get(),
        borderColor: stylesVar('dark-light'),
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },

    iconStar: {
        ...su.size(15, 14),
        marginRight: 5,
        marginLeft: 15
    },

    stars: {
        lineHeight: 14,
        fontSize: 10,
        color: '#96969b'
    }
});

module.exports = ActivityView;
