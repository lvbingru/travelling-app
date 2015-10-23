var moment = require('moment');
var React = require('react-native');

var {
    View,
    Image,
    Text,
    PixelRatio,
    StyleSheet
} = React;

var su = require('../styleUtils');

var UserInfo = React.createClass({
    render: function() {
        var avatar = this.props.avatar;
        var username = this.props.username;
        var publishDate = this.props.publishDate;

        return (
            <View style={[styles.container, this.props.style]}>
                <Image source={avatar} style={styles.avatar}/>
                <View>
                    <Text style={styles.username}>{username}</Text>
                    <Text style={styles.publishDate}>
                        {moment(publishDate).format('YYYY-MM-DD HH:mm')}
                    </Text>
                </View>
            </View>
        );
    }
});

var AVATAR_SIZE = 30;

var styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },

    avatar: {
        ...su.size(AVATAR_SIZE),
        borderWidth: 1 / PixelRatio.get(),
        borderColor: '#fff',
        borderRadius: AVATAR_SIZE / 2,
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
    }
});

module.exports = UserInfo;
