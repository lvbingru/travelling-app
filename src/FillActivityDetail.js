'use strict';

var React = require('react-native');

var {
    AlertIOS,
    StyleSheet,
    CameraRoll,
    Dimensions,
    DatePickerIOS,
    PixelRatio,
    ScrollView,
    Text,
    TextInput,
    Image,
    View,
    TouchableOpacity,
} = React;

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

var su = require('./styleUtils');
var stylesVar = require('./stylesVar');

var FillActivityDetail = React.createClass({

    getInitialState: function() {
        return {};
    },

    componentDidMount: function() {
        this.props.events.addListener('next', this._next.bind(this));
    },

    _next: function() {
        console.log('next');
    },

    render: function() {
        return (
            <View style={[styles.container, this.props.style]}>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e7eaeb'
    },

    info: {
        backgroundColor: '#fff',
        paddingLeft: 15,

        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#dbe0e3',
        borderTopWidth: 1 / PixelRatio.get(),
        borderTopColor: '#dbe0e3'
    },

    label: {
        width: 60,
        color: stylesVar('dark-light')
    },

    field: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 8,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: stylesVar('dark-lighter')
    },

    lastField: {
        borderBottomWidth: 0
    },

    input: {
        flex: 1,
        fontSize: 14,
        paddingHorizontal: 8,
        height: 45
    },

    arrow: {
        ...su.size(9, 15),
        resizeMode: 'contain',
    }
});

var EventEmitter = require('EventEmitter');
var BaseRouteMapper = require('./BaseRouteMapper');

class FillActivityDetailRoute extends BaseRouteMapper {

    get style() {
        return {
            backgroundColor: stylesVar('brand-primary')
        }
    }

    get title() {
        return '发布活动(2/2)';
    }

    constructor(brief) {
        super();
        this.brief = brief;
        this.emitter = new EventEmitter();
    }

    renderLeftButton(route, navigator, index, navState) {
        var styles = this.styles;
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigator.pop()}>
                <Image style={styles.navBarLeftButton} source={require('image!back-icon')}/>
            </TouchableOpacity>
        );
    }

    renderRightButton(route, navigator, index, navState) {
        var styles = this.styles;
        return (
            <TouchableOpacity
                style={styles.navBarRightButton}
                onPress={this._next.bind(this)}
                activeOpacity={0.8}>
                <Text style={styles.navBarButtonText}>下一步</Text>
            </TouchableOpacity>
        );
    }

    renderScene() {
        return <FillActivityDetail brief={this.brief} events={this.emitter}/>
    }

    _next() {
        this.emitter.emit('next');
    }
}

module.exports = FillActivityDetailRoute;
