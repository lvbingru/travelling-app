var React = require('react-native');

var {
    Animated,
    ActivityIndicatorIOS,
    ListView,
    StyleSheet,
    Dimensions,
    PixelRatio,
    ScrollView,
    Image,
    View,
} = React;

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

var icons = require('../icons');
var su = require('../styleUtils');
var stylesVar = require('../stylesVar');
var activityApi = require('../api').activity;
var userApi = require('../api').user;
var {
    Line,
    LettersView,
    BaseText,
    BaseTextInput,
    BaseTouchableOpacity
} = require('../widgets');

// override default compnents
var Text = BaseText;
var TextInput = BaseTextInput;
var TouchableOpacity = BaseTouchableOpacity;

var ContactItem = require('./ContactItem');
var GroupContact = require('./GroupContactScene');

var debug = require('../debug');
var log = debug('Contact:log');
var warn = debug('Contact:warn');
var error = debug('Contact:error');

var DATA = {
    'top': [{
        name: 'search'
    }, {
        name: 'circle'
    }, {
        name: 'group'
    }],

    'A': [{
        name: 'Allen'
    }, {
        name: 'Allen'
    }, {
        name: 'Allen'
    }, {
        name: 'Allen'
    }, {
        name: 'Allen'
    }],

    'B': [{
        name: 'Byron'
    }],

    'C': [{
        name: 'Chris'
    }],

    'D': [{
        name: 'Dante'
    }],

    'E': [{
        name: 'Elina'
    }],

    'F': [{
        name: 'Franky'
    }],

    'G': [{
        name: 'GameBoy'
    }],

    'H': [{
        name: 'Hitler'
    }],

    'I': [{
        name: 'Ivy'
    }],

    'J': [{
        name: 'Jack'
    }],

    'K': [{
        name: 'Kitty'
    }],

    'L': [{
        name: 'Lucky'
    }],

    'M': [{
        name: 'Moledy'
    }],

    'N': [{
        name: 'Nancy'
    }]
}

var ContactScene = React.createClass({

    getInitialState: function() {
        var dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
            sectionHeaderHasChanged: (section1, section2) => section1 !== section2
        });

        return {
            dataSource
        };
    },

    componentDidMount: function() {
        var dataSource = this.state.dataSource;
        dataSource = dataSource.cloneWithRowsAndSections(DATA, Object.keys(DATA), null);

        this.setState({
            data: DATA,
            dataSource
        });
    },

    _renderSearchBar: function() {
        return (
            <View style={styles.item}>
                <Image
                    source={icons.search}
                    resizeMode="contain"
                    style={{...su.size(24, 18)}}/>
                <TextInput
                    style={[styles.searchInput, styles.name]}
                    placeholder="搜索"/>
            </View>
        );
    },

    _toCircleContacts: function() {
        this.props.navigator.push(new GroupContact({
            circle: true
        }));
    },

    _toGroupContacts: function() {
        this.props.navigator.push(new GroupContact);
    },

    _renderCircleItem: function() {
        return (
            <TouchableOpacity
                onPress={this._toCircleContacts}
                style={styles.item}>
                <Image
                    source={icons.circle}
                    style={{...su.size(24)}}/>
                <Text style={styles.name}>圈子</Text>
            </TouchableOpacity>
        );
    },

    _renderGroupItem: function() {
        return (
            <TouchableOpacity
                onPress={this._toGroupContacts}
                style={styles.item}>
                <Image
                    source={icons.group}
                    style={{...su.size(24)}}/>
                <Text style={styles.name}>群聊</Text>
            </TouchableOpacity>
        );
    },

    _renderRow: function(item, sectionID, rowID, highlightRow) {
        if (sectionID !== 'top') {
            return <ContactItem item={item}/>
        }

        if (item.name === 'search') {
            return this._renderSearchBar();
        } else if (item.name === 'circle') {
            return this._renderCircleItem();
        } else if (item.name === 'group') {
            return this._renderGroupItem();
        }
    },

    _renderSectionHeader: function(sectionData, sectionID) {
        if (sectionID === 'top') {
            return null;
        }

        return (
            <View style={styles.sectionHeader}>
                <Text>{sectionID}</Text>
            </View>
        );
    },

    _renderSeparator: function(sectionID) {
        return (
            <View style={{paddingLeft: sectionID === 'top' ? 0 : 8}}>
                <Line/>
            </View>
        );
    },

    _handleLetterPress: function(letter) {
        // TODO: 对接数据接口
        var data = this.state.data;

        console.log(letter);
        var index = LettersView.LETTERS.indexOf(letter);
        var dataByLetter = this.state.data[letter];
        while (index >= 0 && !dataByLetter) {
            index--;
            letter = LettersView.LETTERS[index];
            dataByLetter = this.state.data[letter];
        }

        if (!dataByLetter) {
            return warn('no data of letter');
        }

        var offsetY = 0;
        for (var i = 0; i < index; i++) {
            // FIXME: magic number
            offsetY += 30;
            var letter = LettersView.LETTERS[i];
            var dataByLetter = data[letter];
            offsetY += dataByLetter.length * 45 + (dataByLetter.length - 1) * Line.HEIGHT;
        }

        offsetY += 3 * (45 + Line.HEIGHT);

        console.log(letter, index, offsetY);
        this.refs.content.measure((fx, fy, width, height, px, py) => {
            console.log(fx, fy, width, height, px, py);
            var scrollHeight = this._getScrollHeight();
            offsetY = Math.min(scrollHeight - height, offsetY);
            this.refs.listview.getScrollResponder().scrollWithoutAnimationTo(offsetY);
        });
    },

    _getScrollHeight: function() {
        var data = this.state.data;
        var height = 0;
        for (var i = 0; i < LettersView.LETTERS.length; i++) {
            var letter = LettersView.LETTERS[i];
            var dataByLetter = data[letter];
            if (dataByLetter) {
                height += 30;
                height += dataByLetter.length * 45 + (dataByLetter.length - 1) * Line.HEIGHT;
            }
        }

        return height + 3 * 45 + 2 * Line.HEIGHT;
    },

    render: function() {
        return (
            <View style={[styles.container, this.props.style]}>
                <View ref="content" style={styles.container}>
                    <ListView
                        ref="listview"
                        renderSectionHeader={this._renderSectionHeader}
                        renderSeparator={this._renderSeparator}
                        renderRow={this._renderRow}
                        dataSource={this.state.dataSource}/>

                    <View style={styles.letters}>
                        <LettersView 
                            ref={(v) => this.lettersView = v}
                            onLetterPress={this._handleLetterPress}/>
                    </View>
                </View>
            </View>
        )
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: stylesVar('dark-lighter') 
    },

    avatar: {
        borderRadius: 12.5,
        ...su.size(25)
    },

    name: {
        marginLeft: 5
    },

    item: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 16,
        height: 45
    },

    searchInput: {
        flex: 1
    },

    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: stylesVar('dark-lighter'),
        paddingLeft: 16,
        height: 30,
    },

    letters: {
        position: 'absolute',
        backgroundColor: 'transparent',
        justifyContent: 'center',
        top: 0,
        right: 0,
        bottom: 0,
    }
});

var BaseRouteMapper = require('../BaseRouteMapper');

class Route extends BaseRouteMapper {

    get title() {
        return '通讯录';
    }

    renderLeftButton(route, navigator, index, navState) {
        return this._renderBackButton(route, navigator, index, navState);
    }

    renderScene() {
        return (
            <ContactScene/>
        );
    }

    renderRightButton(route, navigator, index, navState) {
        var styles = this.styles;
        var icon = {
            ...su.size(18, 18),
        };

        return (
            <TouchableOpacity 
              style={[styles.wrap, styles.right]}>
                <Image
                    style={icon}
                    source={icons.plusConv}/>
            </TouchableOpacity>
        );
    }
}

module.exports = Route;
