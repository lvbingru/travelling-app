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

// FIXME: 暂时使用这个 private api
var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
var dismissKeyboard = require('dismissKeyboard');
var Subscribable = require('Subscribable');
var EventEmitter = require('EventEmitter');

var {
    humanDate
} = require('../utils');

var api = require('../api');
var {
    AV
} = api;
var RNFS = require('react-native-fs');

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

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

// override default compnents
var Text = BaseText;
var TextInput = BaseTextInput;
var TouchableOpacity = BaseTouchableOpacity;

var debug = require('../debug');
var log = debug('Contact:log');
var warn = debug('Contact:warn');
var error = debug('Contact:error');

var DateLabel = require('./DateLabel');
var ContactItem = require('./ContactItem');
var MessageView = require('./MessageView');
var WebSocketImpl = require('./WebSocketImpl');
var AudioButton = require('./AudioButton');
var BottomBar = require('./BottomBar');

var EmojiGrid = require('./EmojiGrid');

var ConversationScene = React.createClass({

    mixins: [Subscribable.Mixin],

    getInitialState: function() {
        this.emojiEmitter = new EventEmitter();
        var dateSection = this._getDateSection();
        this.messages = {
            [dateSection]: []
        };
        var dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
            sectionHeaderHasChanged: (section1, section2) => section1 !== section2
        });

        dataSource = dataSource.cloneWithRowsAndSections(
            this.messages, Object.keys(this.messages));

        return {
            dataSource,
            extHeight: new Animated.Value(0),
                disabled: true
        };
    },

    _resetExt: function() {
        log('reset ext views');
        if (this.state.animation) {
            this.state.animation.stop();
            this.state.animation = null;
        }
        this.state.extHeight.setValue(0);
        this.state.expressionShown = false;
    },

    _handleKeyboardEvent: function(e) {
        this._resetExt();
        var scrollResponder = this.refs.scrollView.getScrollResponder();
        scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
            React.findNodeHandle(this.refs.bottomBar),
            64, //additionalOffset, FIXME: magic number
            true
        );
    },

    _onKeyboardDidHide: function(e) {
        this.refs.scrollView.scrollWithoutAnimationTo(0)
        this.refs.scrollView.setNativeProps({
            scrollEnabled: false
        });
    },

    _onKeyboardWillHide: function(e) {
        this.refs.scrollView.scrollWithoutAnimationTo(0)
        this.refs.scrollView.setNativeProps({
            scrollEnabled: false
        });
    },

    componentDidMount: function() {
        this._enableScroll(false);
        this.addListenerOn(RCTDeviceEventEmitter, 'keyboardWillShow', this._handleKeyboardEvent);
        this.addListenerOn(RCTDeviceEventEmitter, 'keyboardDidShow', this._handleKeyboardEvent);
        this.addListenerOn(RCTDeviceEventEmitter, 'keyboardWillHide', this._onKeyboardWillHide);
        // this.addListenerOn(RCTDeviceEventEmitter, 'keyboardDidHide', this._onKeyboardDidHide);

        var realtime = require('leancloud-realtime');

        realtime.config({
            WebSocket: WebSocketImpl
        });

        var rt = realtime({
            appId: '5jqgy6q659ljyldiik70cev6d8n7t1ixolt6rd7k6p1n964d',
            clientId: 'yangchen'
        });

        var self = this;

        rt.on('open', () => {
            log('realtime open');

            rt.conv('5649cfb360b2ed36205025e0', function(room) {
                self.room = room;
                self._onRootCreated();
            });
        });

        rt.on('message', function(data) {
            // FIXME: fix state
            if (!self.room) {
                return warn('room not fetched!');
            }

            if (data.cid !== self.room.id) {
                return;
            }

            self._handleMessage(data);
        });

        rt.on('receipt', function(data) {
            log('message receipt', data);
        });

        rt.on('close', function() {
            log('realtime close');
        });

        rt.on('create', (data) => {
            log('create', data);
        });
    },

    _handleMessage: function(data) {
        var message = {
            id: data.id,
            uid: data.fromPeerId,
            type: data.msg.type,
            content: data.msg,
            timestamp: data.timestamp
        };
        log('new message', message);
        this._appendMessage(message);
    },

    _getDateSection: function() {
        if (!this.messages || Object.keys(this.messages).length === 0) {
            return String(Date.now());
        }

        var lastDate = Number(Object.keys(this.messages).slice(-1)[0]);
        var now = Date.now();
        if (now - lastDate <= 1000 * 3600 * 3) {
            return String(lastDate);
        } else {
            return String(Date.now());
        }
    },

    _onRootCreated: function() {
        log('room created');
        this.setState({
            disabled: false
        });
    },

    _onSubmit: function() {
        log('on text submit');
        this.refs.scrollView.scrollTo(0);
        var textMsg = this.refs.bottomBar.getTextMessage();
        this.room.send({
            text: textMsg
        }, {
            type: 'text'
        }, function(data) {
            log('message result', data);
            var message = {
                uid: 'yangchen',
                type: 'text',
                content: {
                    text: textMsg,
                },
                timestamp: data.t,
                id: data.uid
            }
            this._appendMessage(message);
        }.bind(this));
        this.refs.bottomBar.clearTextMessage();
    },

    _appendMessage: function(message) {
        var section = this._getDateSection();
        var messages = this.messages[section] || [];
        messages = messages.concat([message]);
        this.messages[section] = messages;

        var dataSource = this.state.dataSource.cloneWithRowsAndSections(
            this.messages, Object.keys(this.messages));

        this.setState({
            dataSource
        });
    },

    _onAudioRecorded: function(audio) {
        var file = new AV.File(audio.name, {
            blob: audio
        }, audio.type);

        file.metaData('size', audio.size);
        file.metaData('format', audio.type);
        file.metaData('duration', audio.duration);

        var self = this;
        file.save().then(function() {
            log('send audio message');
            var data = file.toJSON();
            var messageContent = {
                url: file.url(),
                objectId: file.id,
                metaData: file.metaData()
            }
            self.room.send(messageContent, {
                type: 'audio'
            }, function(data) {
                log('audio message result', data);
                var message = {
                    uid: 'yangchen',
                    type: 'audio',
                    content: {
                        ...messageContent,
                    },
                    id: data.uid,
                    timestamp: data.t
                }
                this._appendMessage(message);
            }.bind(self));
        }).catch(e => error(e));
    },

    _renderMessage: function(message) {
        // FIXME: fix current user id
        return (
            <MessageView
                message={message}
                key={'message-' + message.id}
                self={message.uid === 'yangchen'}/>
        );
    },

    _renderSectionHeader: function(sectionData, sectionID) {
        var date = new Date(Number(sectionID));
        return (<DateLabel style={{marginVertical: 5}} text={humanDate(date)}/>);
    },

    _enableScroll: function(enabled) {
        this.refs.scrollView.setNativeProps({
            scrollEnabled: enabled
        });
    },

    _toggleEmoji: function() {
        if (this.state.animation) {
            return warn('Invalid operation, animating now');
        }

        if (this.state.expressionShown) {
            log('hide expressions');
            this.state.animation = Animated.timing(this.state.extHeight, {
                toValue: 0,
                duration: 200
            }).start(function(result) {
                if (!result.finished) {
                    return warn('Animation has been stopped!');
                }

                log('ExpressionsView is hidden');
                this.state.animation = null;
                this.state.expressionShown = false;
            }.bind(this));
        } else {
            log('show expressions');
            this.state.animation = Animated.timing(this.state.extHeight, {
                toValue: EmojiGrid.HEIGHT,
                duration: 200
            }).start(function(result) {
                if (!result.finished) {
                    return warn('Animation has been stopped!');
                }

                log('ExpressionsView is shown');
                this.state.animation = null;
                this.state.expressionShown = true;
            }.bind(this));
        }
    },

    _onExpressionBtnPress: function() {
        dismissKeyboard();
        this._toggleEmoji();
    },

    _handleModeChange: function(mode) {
        this.state.animation = Animated.timing(this.state.extHeight, {
            toValue: 0,
            duration: 200
        }).start(function(result) {
            if (!result.finished) {
                return warn('animation');
            }

            this.state.animation = null;
            this.state.expressionShown = false;
        }.bind(this));
    },

    render: function() {
        return (
            <ScrollView ref="scrollView"
                scrollEnabled={false}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps={true}
                contentContainerStyle={[styles.container]}
                style={[styles.container, this.props.style]}>
                <ListView
                    renderScrollComponent={props => {
                        props.stickyHeaderIndices = [];
                        return <ScrollView {...props}/>
                    }}
                    renderRow={this._renderMessage}
                    renderSectionHeader={this._renderSectionHeader}
                    dataSource={this.state.dataSource}
                    style={styles.content}/>

                <BottomBar ref="bottomBar"
                    style={styles.bottomBar}
                    emojiEmitter={this.emojiEmitter}
                    onModeChange={this._handleModeChange}
                    disabled={this.state.disabled}
                    onAudioRecorded={this._onAudioRecorded}
                    onExpressionBtnPress={this._onExpressionBtnPress}
                    onSubmitEditing={this._onSubmit} />

                <Animated.View ref="ext"
                    style={{overflow: 'hidden',
                        height: this.state.extHeight}}>
                    <EmojiGrid ref="emojiGrid"
                        emojiEmitter={this.emojiEmitter}/>
                </Animated.View>
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
