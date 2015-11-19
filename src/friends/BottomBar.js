var React = require('react-native');
var {
    Animated,
    ListView,
    StyleSheet,
    PixelRatio,
    Image,
    View,
} = React;

var RNFS = require('react-native-fs');

var shortid = require('shortid');
var {
    AudioRecorder,
    AudioPlayer
} = require('react-native-audio');

var su = require('../styleUtils');
var stylesVar = require('../stylesVar');

var {
    BaseText,
    BaseTextInput,
    BaseTouchableOpacity
} = require('../widgets');

// override default compnents
var Text = BaseText;
var TextInput = BaseTextInput;
var TouchableOpacity = BaseTouchableOpacity;

var debug = require('../debug');
var log = debug('Friends/BottomBar:log');
var warn = debug('Friends/BottomBar:warn');
var error = debug('Friends/BottomBar:error');

var AudioButton = require('./AudioButton');
var EmojiGrid = require('./EmojiGrid');

var styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40
    },

    bar: {
        backgroundColor: stylesVar('bg-gray')
    },

    icon: {
        ...su.size(24),
            resizeMode: 'contain',
            marginHorizontal: 5
    },

    inputWrap: {
        flex: 1,
        justifyContent: 'center',
        marginRight: 5
    },

    textInput: {
        height: 32,
        paddingHorizontal: 6,
        backgroundColor: 'white',
        borderWidth: 1 / PixelRatio.get(),
        borderColor: '#c8c8cd',
        borderRadius: 5
    }
});

var BottomBar = React.createClass({

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
    },

    getTextMessage: function() {
        return this.state.textMsg;
    },

    clearTextMessage: function() {
        this.setState({
            textMsg: ''
        });
    },

    _showExpressions: function() {

    },

    _insertEmoji: function(emoji) {},

    render: function() {
        var icon = this.state.mode === 'text' ?
            require('image!icon-switch-to-audio') :
            require('image!icon-keyboard');

        return (
            <Animated.View style={this.props.style}>
                <View style={[styles.row, styles.bar]}>
                    <TouchableOpacity
                        onPress={this._toggleMode}>
                        <Image style={styles.icon} source={icon}/>
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
                            onPress={this._showExpressions}
                            source={require('image!icon-expression')}/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image style={styles.icon}
                            source={require('image!icon-send-media')}/>
                    </TouchableOpacity>
                </View>
                
                <EmojiGrid onPress={this._insertEmoji}/>
            </Animated.View>
        );
    }
});

module.exports = BottomBar;
