var React = require('react-native');
var {
    StyleSheet,
    PixelRatio,
    Text,
    View,
} = React;

var keyMirror = require('keyMirror');

var debug = require('../debug');
var log = debug('AudioButton:log');
var warn = debug('AudioButton:warn');
var error = debug('AudioButton:error');

var su = require('../styleUtils');
var stylesVar = require('../stylesVar');

var THREHOLD = 40;

var States = keyMirror({
    INITIALIZED: null,
    TOUCH_IN: null,
    TOUCH_OUT: null,
    RELEASE: null
});

var AudioButton = React.createClass({

    getInitialState: function() {
        return {
            touchState: States.INITIALIZED,
            size: null
        };
    },

    getDefaultProps: function() {
        return {
            disabled: false
        }
    },

    _performTransition: function(curTouchState, nextTouchState) {
        log(curTouchState, nextTouchState);
        if (curTouchState === nextTouchState) {
            return;
        }

        if (nextTouchState === States.TOUCH_OUT) {
            this.props.handleTouchOut && this.props.handleTouchOut();
        }

        if (nextTouchState === States.TOUCH_IN) {
            this.props.handleTouchIn && this.props.handleTouchIn();
        }

        if (nextTouchState === States.RELEASE) {
            if (curTouchState === States.TOUCH_IN) {
                this.props.handleTouchEnd &&
                    this.props.handleTouchEnd();
            } else if (curTouchState === States.TOUCH_OUT) {
                this.props.handleTouchCancelled &&
                    this.props.handleTouchCancelled();
            }
        }
    },

    _responderGrant: function(e) {
        this._performTransition(this.state.touchState, States.TOUCH_IN);
        this.setState({
            touchState: States.TOUCH_IN
        });
    },

    _responderMove: function(e) {
        this.refs.view.measure((fx, fy, width, height) => {
            this.state.size = {
                width: width,
                height: height
            };
        });

        if (!this.state.size) {
            return;
        }

        var locationX = e.nativeEvent.locationX;
        var locationY = e.nativeEvent.locationY;

        var touchIsIn = locationX >= 0 &&
            locationX <= this.state.size.width &&
            locationY >= -THREHOLD &&
            locationY <= this.state.size.height;

        var nextTouchState = touchIsIn ?
            States.TOUCH_IN :
            States.TOUCH_OUT;

        var curTouchState = this.state.touchState;
        this._performTransition(curTouchState, nextTouchState);
        this.setState({
            touchState: nextTouchState
        });
    },

    _responderEnd: function(e) {
        var nextTouchState = States.RELEASE;
        var curTouchState = this.state.touchState;
        this._performTransition(curTouchState, nextTouchState);
        this.setState({
            touchState: nextTouchState
        });
    },

    _isRecording: function() {
        return this.state.touchState === States.TOUCH_IN ||
            this.state.touchState === States.TOUCH_OUT;
    },

    render: function() {
        var wrapStyle = [styles.wrap];
        if (this._isRecording()) {
            wrapStyle.push(styles.highlight);
        }
        wrapStyle.push(this.props.style);

        var buttonText = this._isRecording() ? '松开 结束' : '按住 说话';

        return (
            <View
                ref="view"
                onStartShouldSetResponder={() => !this.props.disabled}
                onResponderTimernationRequest={() => true}
                onResponderGrant={this._responderGrant}
                onResponderMove={this._responderMove}
                onResponderRelease={this._responderEnd}
                onResponderTerminate={this._responderEnd}
                style={wrapStyle}>
                <Text style={[styles.input, styles.audioText]}>
                    {buttonText}
                </Text>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    wrap: {
        flex: 1,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: stylesVar('bg-gray'),
        borderWidth: 1 / PixelRatio.get(),
        borderColor: '#c8c8cd',
        borderRadius: 5
    },

    highlight: {
        backgroundColor: stylesVar('dark-mid'),
        borderColor: stylesVar('dark-mid'),
    }
});

module.exports = AudioButton;
