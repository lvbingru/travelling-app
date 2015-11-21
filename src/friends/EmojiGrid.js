var React = require('react-native');

var {
    View,
    ListView,
    StyleSheet,
    Text,
    Dimensions,
} = React;

var deviceWidth = Dimensions.get('window').width;

var ViewPager = require('react-native-viewpager');
var Emoji = require('react-native-emoji');

var {
    BaseText,
    BaseTouchableOpacity
} = require('../widgets');

var Text = BaseText;
var TouchableOpacity = BaseTouchableOpacity;

var su = require('../styleUtils');

var EmojiPageIndicator = require('./EmojiPageIndicator');

var PADDING_HORIZONTAL = 8;
var EMOJI_SIZE = (deviceWidth - PADDING_HORIZONTAL * 2) / 8;

var EMOJIS = {
    'smile': '微笑',
    'heart_eyes': '色',
    'no_mouth': '发呆',
    'sunglasses': '得意',
    'sob': '流泪',
    'sleeping': '睡',
    'disappointed_relieved': '大哭',
    'rage': '发怒',
    'stuck_out_tongue': '调皮',
    'laughing': '大笑',
    'astonished': '惊讶',
    'frowning': '难过',
    'sweat': '汗',
    'confounded': '抓狂',
    'yum': '愉快',
    'kissing': '亲亲',
    'broken_heart': '心碎',
    'ok_hand': 'OK',
    '+1': '强',
    '-1': '弱'
};

var EmojiGridPage = React.createClass({
    _handlePress: function(emoji) {
        var name = EMOJIS[emoji];
        this.props.onPress(emoji, name);
    },

    render: function() {
        return (
            <View style={styles.page} key={'page-' + (this.props.page + 1)}>
                {Object.keys(EMOJIS).map(emoji => {
                    return (
                        <TouchableOpacity style={styles.cell}
                            onPress={this._handlePress.bind(this, emoji)}>
                            <Text style={{fontSize: Math.min(16, EMOJI_SIZE/2)}}>
                                <Emoji name={emoji}/>
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    }
});

var PageIndicator = React.createClass({
    render: function() {
        return (
            <View style={styles.indicators}>
                <EmojiPageIndicator {...this.props}/>
            </View>
        );
    }
});

var EmojiGrid = React.createClass({

    mixins: [require('NativeMethodsMixin')],

    statics: {
        HEIGHT: EMOJI_SIZE * 3 + 20
    },

    _emitEmoji: function(emoji, name) {
        this.props.emojiEmitter.emit('emoji', {
            name,
            emoji
        })
    },

    _renderPage: function(emojiCollection) {
        return (
            <EmojiGridPage
                style={this.props.style}
                onPress={(emoji, name) => this._emitEmoji(emoji, name)}
                emojiCollection={emojiCollection}/>
        );
    },

    _renderPageIndicator: function() {
        return <PageIndicator/>;
    },

    render: function() {
        var dataSource = new ViewPager.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });

        dataSource = dataSource.cloneWithPages([0]);

        return (
            <ViewPager autoPlay={false}
                renderPageIndicator={this._renderPageIndicator}
                renderPage={this._renderPage}
                dataSource={dataSource}>
            </ViewPager>
        );
    }
});

var styles = StyleSheet.create({
    page: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: PADDING_HORIZONTAL
    },

    cell: {
        alignItems: 'center',
        justifyContent: 'center',
        ...su.size(EMOJI_SIZE)
    },

    indicators: {
        height: 20,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

module.exports = EmojiGrid;
