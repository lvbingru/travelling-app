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

var su = require('../styleUtils');
var stylesVar = require('../stylesVar');
var activityApi = require('../api').activity;
var userApi = require('../api').user;
var {
    Line,
    LettersView,
    BaseText,
    BaseTouchableOpacity
} = require('../widgets');

// override default compnents
var Text = BaseText;
var TouchableOpacity = BaseTouchableOpacity;

var debug = require('../debug');
var log = debug('Contact:log');
var warn = debug('Contact:warn');
var error = debug('Contact:error');

var DATA = {
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
            dataSource
        });

        this.sectionHeaders = {};
    },

    _renderRow: function(item) {
        return (
            <TouchableOpacity style={styles.item}>
                <Image style={styles.avatar} 
                    source={require('image!avatar-placeholder')}/>
                <Text style={styles.name}>{item.name}</Text>
            </TouchableOpacity>
        );
    },

    _cacheSectionHeader: function(sectionID, comp) {
        var key = 'section-' + sectionID;
        this.sectionHeaders[key] = comp;
    },

    _renderSectionHeader: function(sectionData, sectionID) {
        return (
            <View ref={this._cacheSectionHeader.bind(this, sectionID)} style={styles.sectionHeader}>
                <Text>{sectionID}</Text>
            </View>
        );
    },

    _renderSeparator: function() {
        return <Line/>;
    },

    _handleLetterPress: function(letter) {
        if (letter === '#') {
            // TODO: jump to number
            return;
        }

        console.log(letter);
        var sectionHeader = this.sectionHeaders['section-' + letter]
        var index = LettersView.LETTERS.indexOf(letter);
        while (index >= 0 && !sectionHeader) {
            index--;
            letter = LettersView.LETTERS[index];
            sectionHeader = this.sectionHeaders['section-' + letter]
        }

        if (!sectionHeader) {
            return warn('Section header not found.');
        }

        console.log(letter);

        var self = this;
        sectionHeader.measure((fx, fy, width, height, px, py) => {
            console.log(fx, fy, width, height, px, py);
            this.refs.listview.getScrollResponder().scrollTo(fy);
        });
    },

    render: function() {
        return (
            <View style={[styles.container, this.props.style]}>
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
        )
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },

    avatar: {
        borderRadius: 12.5,
        ...su.size(25)
    },

    name: {
        marginLeft: 5
    },

    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 16,
        height: 45
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
}

module.exports = Route;
