var React = require('react-native');
var {
    Animated,
    ActivityIndicatorIOS,
    ListView,
    StyleSheet,
    Dimensions,
    PixelRatio,
    ScrollView,
    TouchableHighlight,
    Image,
    View,
} = React;

var RNFS = require('react-native-fs');

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

var keyMirror = require('keyMirror');

var shortid = require('shortid');
var {
    AudioRecorder,
    AudioPlayer
} = require('react-native-audio');

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

var Text = BaseText;
var TextInput = BaseTextInput;
var TouchableOpacity = BaseTouchableOpacity;

var ContactItem = require('./ContactItem');

// override default compnents
var Text = BaseText;
var TextInput = BaseTextInput;
var TouchableOpacity = BaseTouchableOpacity;

var debug = require('../debug');
var log = debug('Contact:log');
var warn = debug('Contact:warn');
var error = debug('Contact:error');

var AudioButton = React.createClass({

    statics: {
        styles: StyleSheet.create({
            wrap: {
                flex: 1,
                height: 28,
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
        }),

        THREHOLD: 40,

        States: keyMirror({
            INITIALIZED: null,
            TOUCH_IN: null,
            TOUCH_OUT: null,
            RELEASE: null
        })
    },

    getInitialState: function() {
        return {
            touchState: AudioButton.States.INITIALIZED,
            size: null
        };
    },

    _performTransition: function(curTouchState, nextTouchState) {
        log(curTouchState, nextTouchState);
        if (curTouchState === nextTouchState) {
            return;
        }

        if (nextTouchState === AudioButton.States.TOUCH_OUT) {
            this.props.handleTouchOut && this.props.handleTouchOut();
        }

        if (nextTouchState === AudioButton.States.TOUCH_IN) {
            this.props.handleTouchIn && this.props.handleTouchIn();
        }

        if (nextTouchState === AudioButton.States.RELEASE) {
            if (curTouchState === AudioButton.States.TOUCH_IN) {
                this.props.handleTouchEnd &&
                    this.props.handleTouchEnd();
            } else if (curTouchState === AudioButton.States.TOUCH_OUT) {
                this.props.handleTouchCancelled &&
                    this.props.handleTouchCancelled();
            }
        }
    },

    _responderGrant: function(e) {
        this._performTransition(this.state.touchState, AudioButton.States.TOUCH_IN);
        this.setState({
            touchState: AudioButton.States.TOUCH_IN
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
            locationY >= -AudioButton.THREHOLD &&
            locationY <= this.state.size.height;

        var nextTouchState = touchIsIn ?
            AudioButton.States.TOUCH_IN :
            AudioButton.States.TOUCH_OUT;

        var curTouchState = this.state.touchState;
        this._performTransition(curTouchState, nextTouchState);
        this.setState({
            touchState: nextTouchState
        });
    },

    _responderEnd: function(e) {
        var nextTouchState = AudioButton.States.RELEASE;
        var curTouchState = this.state.touchState;
        this._performTransition(curTouchState, nextTouchState);
        this.setState({
            touchState: nextTouchState
        });
    },

    _isRecording: function() {
        return this.state.touchState === AudioButton.States.TOUCH_IN ||
            this.state.touchState === AudioButton.States.TOUCH_OUT;
    },

    render: function() {
        var styles = AudioButton.styles;
        var wrapStyle = [styles.wrap];
        if (this._isRecording()) {
            wrapStyle.push(styles.highlight);
        }
        wrapStyle.push(this.props.style);

        var buttonText = this._isRecording() ? '松开 结束' : '按住 说话';

        return (
            <View
                ref="view"
                onStartShouldSetResponder={() => true}
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

var BottomBar = React.createClass({

    statics: {
        styles: StyleSheet.create({
            row: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                height: 44
            },

            bar: {
                backgroundColor: stylesVar('bg-gray')
            },

            icon: {
                ...su.size(28),
                    resizeMode: 'contain',
                    marginHorizontal: 5
            },

            inputWrap: {
                flex: 1,
                justifyContent: 'center',
                marginRight: 5
            },

            textInput: {
                height: 28,
                paddingHorizontal: 6,
                backgroundColor: 'white',
                borderWidth: 1 / PixelRatio.get(),
                borderColor: '#c8c8cd',
                borderRadius: 5
            }
        })
    },

    getInitialState: function() {
        return {
            mode: 'text'
        }
    },

    _toggleMode: function() {
        this.setState({
            mode: this.state.mode === 'audio' ? 'text' : 'audio'
        });
    },

    _handleTouchIn: function() {
        log('touch in');
        if (this.state.status === 'recording') {
            return;
        }

        if (this.state.status === 'playing') {
            AudioPlayer.stop();
        }

        this.state.status = 'recording';
        this.state.audioPath = `/audio-${shortid.generate()}.caf`;
        AudioRecorder.prepareRecordingAtPath(this.state.audioPath);
        AudioRecorder.startRecording();
        AudioRecorder.onProgress = (data) => {
            log('recording', data.currentTime);
        };

        AudioRecorder.onFinished = (data) => {
            log(`Finished recording`)
        };
    },

    _handleTouchOut: function() {
        log('touch out');
    },

    _handleTouchEnd: function() {
        AudioRecorder.stopRecording();
        this.state.status = 'playing';
        var url = 'file://' + RNFS.DocumentDirectoryPath + this.state.audioPath;
        log('url', url);
        AudioPlayer.playWithUrl(url);
    },

    _handleTouchCancelled: function() {
        AudioRecorder.stopRecording();
        this.state.status = null;
    },

    render: function() {
        var styles = BottomBar.styles;

        return (
            <View style={this.props.style}>
                <View style={[styles.row, styles.bar]}>
                    <TouchableOpacity
                        onPress={this._toggleMode}>
                        <Image style={styles.icon}
                            source={require('image!icon-switch-to-audio')}/>
                    </TouchableOpacity>

                    {this.state.mode === 'text' &&
                    <View style={styles.inputWrap}>
                        <TextInput
                            onSubmitEditing={this.props.onSubmitEditing}
                            onBlur={this.props.onBlur}
                            onFocus={this.props.onFocus}
                            style={styles.textInput}/>
                    </View>}

                    {this.state.mode === 'audio' &&
                    <AudioButton
                        handleTouchIn={this._handleTouchIn}
                        handleTouchOut={this._handleTouchOut}
                        handleTouchEnd={this._handleTouchEnd}
                        handleTouchCancelled={this._handleTouchCancelled}/>}

                    <TouchableOpacity>
                        <Image style={styles.icon}
                            source={require('image!icon-expression')}/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image style={styles.icon}
                            source={require('image!icon-send-media')}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
});

var ConversationScene = React.createClass({

    getInitialState: function() {
        var dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });

        return {
            dataSource
        };
    },

    componentDidMount: function() {},

    _onFocus: function() {
        setImmediate(() => {
            let scrollResponder = this.refs.scrollView.getScrollResponder();
            scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
                React.findNodeHandle(this.refs.bottomBar),
                60, //additionalOffset, FIXME: magic number
                true
            );
        });
    },

    _onBlur: function() {
        log('on blur');
        this.refs.scrollView.scrollTo(0);
    },

    _onSubmit: function() {
        log('on submit');
        this.refs.scrollView.scrollTo(0);

        // TODO: send message
    },

    _onLongPress: function() {

    },

    render: function() {
        return (
            <ScrollView ref="scrollView"
                scrollEnabled={false}
                contentContainerStyle={[styles.container]}
                style={[styles.container, this.props.style]}>
                <ListView
                    dataSource={this.state.dataSource}
                    style={styles.content}/>
                <BottomBar
                    onLongPress={this._onLongPress}
                    ref="bottomBar"
                    style={styles.bottomBar}
                    onSubmitEditing={this._onSubmit}
                    onFocus={this._onFocus} onBlur={this._onBlur}/>
            </ScrollView>
        )
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: stylesVar('dark-lighter')
    },

    row: {
        flexDirection: 'row'
    },

    content: {
        flex: 1,
        backgroundColor: stylesVar('dark-lighter')
    },

    bottomBar: {
        borderTopWidth: 1 / PixelRatio.get(),
        borderTopColor: '#b9bbbc',
    }
});

var BaseRouteMapper = require('../BaseRouteMapper');

class Route extends BaseRouteMapper {

    constructor(creator) {
        super();
        this.creator = creator;
    }

    get title() {
        return this.creator.get('nickname') || this.creator.get('username');
    }

    renderLeftButton(route, navigator, index, navState) {
        return this._renderBackButton(route, navigator, index, navState);
    }

    renderScene() {
        return (
            <ConversationScene creator={this.creator}/>
        );
    }
}

module.exports = Route;
