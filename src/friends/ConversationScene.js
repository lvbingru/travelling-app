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

var WebSocketImpl = require('./WebSocketImpl');
var AudioButton = require('./AudioButton');

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
            mode: 'text',
            textMsg: ''
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
        this.state.audioPath = `audio-${shortid.generate()}.aac`;
        AudioRecorder.prepareRecordingAtPath('/' + this.state.audioPath);
        AudioRecorder.startRecording();
        AudioRecorder.onProgress = (data) => {
            log('recording', data.currentTime);
        };

        AudioRecorder.onFinished = (data) => {
            log('Finished recording', data);
            if (this.state.status === 'pre-cancelled') {
                warn('Audio message is cancelled');
                return AudioRecorder.deleteRecording();
            }

            if (data.status !== 'OK') {
                this.state.status = 'error';
                return warn('fail to record');
            }

            this.state.status = 'end';
            var audioPath = this.state.audioPath;
            var url = `file://${RNFS.DocumentDirectoryPath}/${audioPath}`;
            log('audio url', url);

            this.props.onAudioRecorded && this.props.onAudioRecorded({
                ...data,
                name: audioPath,
                type: 'audio/aac',
                uri: url
            });
        };

        AudioRecorder.onError = (data) => {
            error('recording error', data);
        };
    },

    _handleTouchOut: function() {
        log('touch out');
    },

    _handleTouchEnd: function() {
        AudioRecorder.stopRecording();
        this.state.status = 'pre-end';
    },

    _handleTouchCancelled: function() {
        AudioRecorder.stopRecording();
        this.state.status = 'pre-cancelled';
        // this.state.status = null;
        // this.props.onAudioCancelled &&
        // this.props.onAudioCancelled();
    },

    getTextMessage: function() {
        return this.state.textMsg;
    },

    clearTextMessage: function() {
        this.setState({
            textMsg: ''
        });
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
                            value={this.state.textMsg}
                            onChangeText={(textMsg) => this.setState({textMsg})}
                            style={styles.textInput}/>
                    </View>}

                    {this.state.mode === 'audio' &&
                    <AudioButton
                        disabled={this.props.disabled}
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
            dataSource,
            disabled: true
        };
    },

    componentDidMount: function() {
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
            log('message', data);
        });

        rt.on('close', function() {
            log('realtime close');
        });

        rt.on('create', (data) => {
            log('create', data);
        });
    },

    _onRootCreated: function() {
        log('room created');
        this.setState({
            disabled: false
        });
    },

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
        var textMsg = this.refs.bottomBar.getTextMessage();
        this.room.send({
            text: textMsg
        }, {
            type: 'text'
        }, function(data) {
            log('message result', data);
        });
        this.refs.bottomBar.clearTextMessage();
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
            self.room.send({
                url: file.url(),
                objectId: file.id,
                metaData: file.metaData()
            }, {
                type: 'audio'
            }, function(data) {
                log('msg result', data);
            });
        }).catch(e => error(e));
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
                    disabled={this.state.disabled}
                    onAudioRecorded={this._onAudioRecorded}
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
