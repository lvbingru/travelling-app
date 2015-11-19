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

var EMOJI_COLLECTION = [[
    'smile', 'laughing', 'blush', 'smiley', 'relaxed',
    'smirk', 'heart_eyes', 'kissing_heart',

    'flushed', 'relieved', 'grin', 'wink',
    'grinning', 'kissing', 'stuck_out_tongue', 'sleeping',

    'worried', 'open_mouth', 'grimacing', 'confused',
    'expressionless', 'unamused', 'sweat', 'disappointed_relieved'
]];

var EmojiGridPage = React.createClass({
    render: function() {
        return (
            <View style={styles.page} key={'page-' + (this.props.page + 1)}>
                {this.props.emojiCollection.map(name => {
                    return (
                        <TouchableOpacity style={styles.cell}
                            onPress={name => this.props.onPress(name)}>
                            <Text style={{fontSize: Math.min(16, EMOJI_SIZE/2)}}>
                                <Emoji name={name}/>
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
    _renderPage: function(emojiCollection) {
        return (
            <EmojiGridPage
                onPress={name => this.props.onPress(name)}
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

        dataSource = dataSource.cloneWithPages(EMOJI_COLLECTION);

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
