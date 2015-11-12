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
    BaseTextInput,
    BaseTouchableOpacity
} = require('../widgets');

var ContactItem = require('./ContactItem');

// override default compnents
var Text = BaseText;
var TextInput = BaseTextInput;
var TouchableOpacity = BaseTouchableOpacity;

var debug = require('../debug');
var log = debug('Contact:log');
var warn = debug('Contact:warn');
var error = debug('Contact:error');

var data = [{
    name: '云南行圈子'
}, {
    name: '四川行圈子'
}]

var GroupContactScene = React.createClass({

    getInitialState: function() {
        var dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });

        return {
            dataSource
        };
    },

    componentDidMount: function() {
        var dataSource = this.state.dataSource;
        dataSource = dataSource.cloneWithRows(data);
        this.setState({
            dataSource
        });
    },

    _renderRow: function(item, sectionID, rowID, highlightRow) {
        return <ContactItem item={item}/>
    },

    _renderSeparator: function() {
        return (
            <View style={{paddingLeft: 8}}>
                <Line/>
            </View>
        );
    },

    render: function() {
        return (
            <View style={[styles.container, this.props.style]}>
                <View ref="content" style={styles.container}>
                    <ListView
                        ref="listview"
                        renderSeparator={this._renderSeparator}
                        renderRow={this._renderRow}
                        dataSource={this.state.dataSource}/>
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

    icon: {
        ...su.size(18)
    }
});

var BaseRouteMapper = require('../BaseRouteMapper');

class Route extends BaseRouteMapper {

    constructor(params) {
        super();
        params = params || {};
        this.params = params;
    }

    get title() {
        return this.params.circle ? '圈子' : '群聊';
    }

    renderLeftButton(route, navigator, index, navState) {
        return this._renderBackButton(route, navigator, index, navState);
    }

    renderRightButton(route, navigator, index, navState) {
        var styles = this.styles;
        var icon = {
            ...su.size(18, 18),
        };

        return (
            <TouchableOpacity 
              style={[styles.wrap, styles.right]}>
                <Image style={icon} source={require('image!icon-conv-plus')}/>
            </TouchableOpacity>
        );
    }

    renderScene() {
        return (
            <GroupContactScene/>
        );
    }
}

module.exports = Route;
