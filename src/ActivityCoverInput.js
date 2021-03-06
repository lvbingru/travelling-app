var React = require('react-native');

var {
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    StyleSheet
} = React;

var LocalPhotoPicker = require('./LocalPhotoPicker');

var icons = require('./icons');
var su = require('./styleUtils');
var {
    PenIcon
} = require('./widgets');

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var placeholder = icons.coverPlaceholder;
var placeholderSize = {
    width: 722,
    height: 332
}
var placeholderMargin = 5;
var placeholderSizeIndeed = {
    width: deviceWidth - placeholderMargin * 2,
    height: (deviceWidth - placeholderMargin * 2) / placeholderSize.width * placeholderSize.height
}

var ActivityCoverInput = React.createClass({

    displayName: "ActivityCoverInput",

    _renderCover: function() {
        if (!this.props.value) {
            return (
                <Image source={placeholder} style={styles.placeholder}/>
            );
        } else {
            var photo = this.props.value;
            return (
                <Image source={{uri: photo.uri}} style={styles.cover}>
                    <PenIcon/>
                </Image>
            );
        }
    },

    _showImagePicker: function() {
        this.props.navigator.push(new LocalPhotoPicker({
            onResult: (photo) => {
                this.props.onChange(photo);
            }
        }));
    },

    render: function() {
        return (
            <TouchableOpacity
                style={[styles.container, this.props.style]}
                activeOpacity={0.9}
                onPress={this._showImagePicker}>
                {this._renderCover()}
            </TouchableOpacity>
        );
    }
});

var styles = {
    container: {
        backgroundColor: '#fff'
    },

    placeholder: {
        margin: placeholderMargin,
        resizeMode: 'stretch',
        ...placeholderSizeIndeed,
    },

    cover: {
        alignItems: 'center',
        justifyContent: 'center',
        width: deviceWidth,
        height: deviceWidth * 9 / 16,
        resizeMode: 'cover',
    }
}

module.exports = ActivityCoverInput;
