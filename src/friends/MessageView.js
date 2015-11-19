var React = require('react-native');

var {
    Image,
    PixelRatio,
    View,
    NativeModules,
    StyleSheet
} = React;

var TextMeasurer = NativeModules.TextMeasurer;
var su = require('../styleUtils');
var stylesVar = require('../stylesVar');

var {
    BaseText,
    BaseTouchableOpacity
} = require('../widgets');

var Text = BaseText;
var TouchableOpacity = BaseTouchableOpacity;

var debug = require('../debug');
var log = debug('MessageView:log');
var error = debug('MessageView:error');
var warn = debug('MessageView:warn');

var MSG_FONT_FAMILY = 'Helvetica';
var MSG_FONT_SIZE = 14;
var MSG_PADDING = 8;
var MSG_BORDER_WIDTH = 1 / PixelRatio.get();

var AutosizingText = React.createClass({
    displayName: 'AutosizingText',

    getInitialState: function() {
        return {
            width: null,
            ready: false
        }
    },

    _onLayout: function(e) {
        var layout = e.nativeEvent.layout;
        var self = this;
        var fontSize = MSG_FONT_SIZE;
        TextMeasurer.get(this.props.text.trim(), MSG_FONT_FAMILY, fontSize, len => {
            var _width = len + MSG_PADDING * 2 + MSG_BORDER_WIDTH * 2 + 8;
            this.setState({
                width: Math.min(_width, layout.width),
                multiline: _width > layout.width,
                ready: true
            });
        });
    },

    render() {
        var style = {
            width: this.state.width,
            backgroundColor: 'transparent'
        };

        // hack Text 组件，文字总是莫名其妙的折行，尽管长度并没有超出范围
        var lines = this.state.multiline ? 65535 : 1;

        return (
            <View ref="view" style={this.props.style} onLayout={this._onLayout}>
                <View style={style}>
                    {this.state.ready && 
                    <Text numberOfLines={lines}
                        style={this.props.textStyle} ref="text">
                        {this.props.text.trim()}
                    </Text>}
                </View>
            </View>
        );
    }
});

var barStyles = {
    bar: {
        overflow: 'hidden',
        padding: MSG_PADDING,
        borderWidth: MSG_BORDER_WIDTH,
        borderColor: stylesVar('dark-light'),
        borderRadius: 5,
        backgroundColor: 'white'
    },

    barSelf: {
        backgroundColor: stylesVar('brand-primary')
    }
};

var AudioBar = React.createClass({

    getInitialState: function() {
        return {
            width: 0,
            ready: false
        };
    },

    getDefaultProps: function() {
        return {
            self: false
        };
    },

    _duration: function() {
        var audio = this.props.audio;
        return Math.min(60, Math.round(audio.metaData.duration));
    },

    _onLayout: function(e) {
        if (this.state.ready) {
            return;
        }

        var layout = e.nativeEvent.layout;
        var duration = this._duration();
        var width = layout.width / 4;

        if (duration <= 10) {
            width += layout.width / 2 * duration / 10;
        } else if (duration > 10) {
            width += layout.width / 2;
            width += layout.width / 4 * (duration - 10) / 50;
        }

        log('duration', duration, 'width', width);

        this.setState({
            width: width,
            ready: true
        });
    },

    render: function() {
        var styles = {
            row: {
                flexDirection: 'row',
                alignItems: 'center',
                width: this.state.width
            },
            container: {
                flex: 1,
                alignItems: this.props.self ? 'flex-end' : 'flex-start'
            },
            secs: {
                fontSize: 12,
                fontWeight: "400",
                color: stylesVar('dark-mid'),
                marginHorizontal: 5
            },

            bar: {
                flex: 1,
                height: 34
            }
        };

        log('audioBar styles', styles);

        if (!this.state.ready) {
            return (
                <View ref="view"
                    style={[styles.container, this.props.style]}
                    onLayout={this._onLayout}/>
            );

        }

        if (this.props.self) {
            return (
                <View ref="view"
                    style={[styles.container, this.props.style]}
                    onLayout={this._onLayout}>
                    <View style={styles.row}>
                        <Text style={styles.secs}>{this._duration() + "\""}</Text>
                        <TouchableOpacity style={[barStyles.bar, barStyles.barSelf, styles.bar]}/>
                    </View>
                </View>
            );
        } else {
            return (
                <View ref="view"
                    style={[styles.container, this.props.style]}
                    onLayout={this._onLayout}>
                    <View style={styles.row}>
                        <TouchableOpacity style={[barStyles.bar, styles.bar]}/>
                        <Text style={styles.secs}>{this._duration() + "\""}</Text>
                    </View>
                </View>
            );
        }
    }
});

var MessageView = React.createClass({
    getDefaultProps: function() {
        return {
            self: false
        };
    },

    _renderAudioMessage: function() {
        var message = this.props.message;
        if (this.props.self) {
            return (
                <View style={[styles.msg, styles.self, this.props.style]}>
                    <View style={styles.space}></View>
                    <AudioBar audio={message.content} self={true} style={{marginHorizontal: 8}}/>
                    <Image style={styles.avatar}
                        source={require('image!avatar-placeholder')}/>
                </View>
            );
        } else {
            return (
                <View style={[styles.msg, this.props.style]}>
                    <Image style={styles.avatar}
                        source={require('image!avatar-placeholder')}/>
                    <AudioBar audio={message.content} style={{marginHorizontal: 8}}/>
                    <View style={styles.space}></View>
                </View>
            );
        }
    },

    _renderTextMessage: function() {
        var message = this.props.message;
        if (this.props.self) {
            return (
                <View style={[styles.msg, styles.self, this.props.style]}>
                    <View style={styles.space}></View>
                    <AutosizingText
                        style={[styles.textBox, styles.textBoxSelf]}
                        textStyle={[styles.text, styles.textSelf]}
                        text={this.props.message.content.text}/>
                    <Image style={styles.avatar}
                        source={require('image!avatar-placeholder')}/>
                </View>
            );
        } else {
            return (
                <View style={[styles.msg, this.props.style]}>
                    <Image style={styles.avatar}
                        source={require('image!avatar-placeholder')}/>
                    <AutosizingText
                        style={styles.textBox}
                        textStyle={styles.text}
                        text={this.props.message.content.text}/>
                    <View style={styles.space}></View>
                </View>
            );
        }
    },

    render: function() {
        var message = this.props.message;
        if (message.type === 'audio') {
            return this._renderAudioMessage();
        } else {
            return this._renderTextMessage();
        }
    }
});

var styles = StyleSheet.create({
    msg: {
        flex: 1,
        marginVertical: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginHorizontal: 8,
    },

    self: {
        justifyContent: 'flex-end'
    },

    avatar: {
        ...su.size(36)
    },

    textBox: {
        flex: 1,
        marginHorizontal: 8,
        backgroundColor: 'transparent'
    },

    textBoxSelf: {
        alignItems: 'flex-end'
    },

    text: {
        ...barStyles.bar,
            fontFamily: MSG_FONT_FAMILY,
            fontSize: MSG_FONT_SIZE,
    },

    textSelf: {
        ...barStyles.barSelf,
            color: 'white'
    },

    space: {
        width: 60
    }
});

module.exports = MessageView;
