var moment = require('moment');
var shortid = require('shortid');
var React = require('react-native');

var {
    View,
    Image,
    ListView,
    PixelRatio,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet
} = React;

var {
    BaseText
} = require('./widgets');

// override default Text Component
var Text = BaseText;

var stylesVar = require('./stylesVar');
var su = require('./styleUtils');

var clientId = 'hello'

var ConversationListView = React.createClass({

    displayName: 'ConversationListView',

    getInitialState: function() {
        return {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            })
        }
    },

    componentDidMount: function() {
        var dataSource = this.state.dataSource.cloneWithRows([{
            nickname: 'hello',
            message: 'Anywhere you are, I am near. Anytime you whisper my name, you\'ll see. How every single promise I keep.',
            time: new Date(),
            avatar: require('image!avatar-placeholder')
        }, {
            nickname: 'hello',
            message: 'what?',
            time: new Date(2015, 10, 11),
            avatar: require('image!avatar-placeholder')
        }, {
            nickname: 'hello',
            message: 'what?',
            time: new Date(2015, 9, 10),
            avatar: require('image!avatar-placeholder')
        }]);

        this.setState({
            dataSource
        });
    },

    _isToday: function(date) {
        var today = moment().startOf('day');
        var messageDay = moment(date).startOf('day');
        return today.diff(messageDay) === 0;
    },

    _isYesterday: function(date) {
        var yesterday = moment().startOf('day').subtract(1, 'days');
        var messageDay = moment(date).startOf('day');
        return yesterday.diff(messageDay) === 0;
    },

    _getMessageDate: function(date) {
        if (this._isToday(date)) {
            return moment(date).format('HH:mm');
        } else if (this._isYesterday(date)) {
            return '昨天 ' + moment(date).format('HH:mm');
        } else {
            return moment(date).format('YY/MM/DD');
        }
    },

    _renderItem: function(conv) {
        return (
            <View style={[styles.row, styles.conv]}>
                <Image style={styles.avatar} source={conv.avatar}/>
                <View>
                    <Text>{conv.nickname}</Text>
                    <Text numberOfLines={1} 
                        style={styles.message}>
                        {conv.message}
                    </Text>
                </View>
                <Text style={styles.time}>{this._getMessageDate(conv.time)}</Text>
            </View>
        )
    },

    _renderSeparator: function(sectionID, rowID, adjacentRowHighlighted) {
        return (
            <View style={styles.separator}></View>
        );
    },

    render: function() {
        return (
            <ListView
                dataSource={this.state.dataSource}
                renderSeparator={this._renderSeparator}
                renderRow={this._renderItem}/>
        );
    }
});

var FriendsTab = React.createClass({

    displayName: 'FriendsTab',

    getInitialState: function() {
        this.route = new Route();
        return {};
    },

    componentDidMount: function() {
        
    },

    render: function() {
        return (
            <View style={[styles.container, this.props.style]}>
                <ConversationListView/>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: stylesVar('bg-gray')
    },

    avatar: {
        ...su.size(40),
            marginRight: 16,
            borderRadius: 16,
    },

    separator: {
        height: 1 / PixelRatio.get(),
        backgroundColor: stylesVar('dark-light'),
    },

    conv: {
        padding: 16
    },

    row: {
        flexDirection: 'row'
    },

    message: {
        overflow: 'hidden',
        color: stylesVar('dark-mid'),
    },

    time: {
        fontSize: 10,
        color: stylesVar('dark-mid'),
        position: 'absolute',
        top: 18,
        right: 10
    }
});

var BaseRouteMapper = require('./BaseRouteMapper');
var EventEmitter = require('EventEmitter');

class Route extends BaseRouteMapper {

    get title() {
        return '朋友';
    }

    renderScene() {
        return (
            <FriendsTab/>
        );
    }

    renderLeftButton(route, navigator, index, navState) {
        var styles = this.styles;
        var icon = {
            ...su.size(17, 22),
        }

        var ContactRoute = require('./friends/ContactScene');

        return (
            <TouchableOpacity 
              activeOpacity={0.8} 
              onPress={() => navigator.push(new ContactRoute)}
              style={[styles.wrap, styles.left]}>
                <Image style={icon} source={require('image!icon-contact')}/>
            </TouchableOpacity>
        );
    }

    renderRightButton(route, navigator, index, navState) {
        var styles = this.styles;
        var icon = {
            ...su.size(18, 18),
        }

        return (
            <TouchableOpacity 
              activeOpacity={0.8} 
              style={[styles.wrap, styles.right]}>
                <Image style={icon} source={require('image!icon-conv-plus')}/>
            </TouchableOpacity>
        );
    }
};

module.exports = FriendsTab;
