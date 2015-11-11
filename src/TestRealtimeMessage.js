var shortid = require('shortid');
var React = require('react-native');

var {
    View,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet
} = React;

var realtime = require('leancloud-realtime');
var stylesVar = require('./stylesVar');

var EventEmitter = require('EventEmitter');

class WebSocketImpl extends WebSocket {

    constructor(url, protocols) {
        super(url, protocols);
        this._emitter = new EventEmitter();
    }

    addEventListener(eventType, listener) {
        return this._emitter.addListener(eventType, listener);
    }

    onopen() {
        this._emitter.emit('open', {});
    }

    onmessage(event) {
        this._emitter.emit('message', event);
    }

    onclose(event) {
        this._emitter.emit('close', event);
    }

    onerror(error) {
        this._emitter.emit('error', error);
    }
}

var clientId = 'hello'
var TestView = React.createClass({

    displayName: 'TestView',

    getInitialState: function() {
        return {};
    },

    componentDidMount: function() {
        realtime.config({
            WebSocket: WebSocketImpl
        });

        var rt = realtime({
            appId: '5jqgy6q659ljyldiik70cev6d8n7t1ixolt6rd7k6p1n964d',
            clientId: clientId
        })

        rt.on('open', function() {
            console.log('realtime open');
        });

        rt.on('message', function(data) {
            console.log('message', data);
        });

        rt.on('close', function() {
            console.log('realtime close');
        });
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
        backgroundColor: stylesVar('bg-gray')
    }
});

var BaseRouteMapper = require('./BaseRouteMapper');
var EventEmitter = require('EventEmitter');

class Route extends BaseRouteMapper {
    renderScene() {
        return (
            <TestView/>
        );
    }
};

module.exports = Route;
