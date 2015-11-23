var React = require('react-native');

var {
    TouchableHighlight,
    View,
    Image,
    Text,
    StyleSheet
} = React;

var {
    UserInfo 
} = require('../widgets');

var icons = require('../icons');
var su = require('../styleUtils');

var JourneyView = React.createClass({
    getInitialState: function() {
        return {}
    },

    _onTouch: function() {},

    render: function() {
        var data = this.props.data;
        var user = data.user;
        var avatar = user.avatar ? {url: user.avatar} : icons.avatarPlaceholder;

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
                      <Image source={icons.views} style={[styles.icon, {marginRight: 4}]}/>
                      <Text style={[styles.small, {marginRight: 12}]}>{data.views}</Text>
                      <Image source={icons.stars} style={[styles.icon, {marginRight: 4}]}/>
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

module.exports = JourneyView;