var React = require('react-native');

var {
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    StyleSheet
} = React;

var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

var su = require('./styleUtils');

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var placeholder = require('image!cover-placeholder');
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
            return (
                <Image source={this.props.value} style={styles.cover}>
                    <Image source={require('image!icon-edit')} style={styles.iconEdit}/>
                </Image>
            );
        }
    },

    _showImagePicker: function() {
        var options = {
            title: '选择封面',
            cancelButtonTitle: '取消',
            takePhotoButtonTitle: '拍照',
            chooseFromLibraryButtonTitle: '从手机相册选择',
            maxWidth: 800,
            maxHeight: 800,
            quality: 1,
            allowsEditing: false,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        UIImagePickerManager.showImagePicker(options, function(type, result) {
            console.log('show image picker', arguments);

            if (type === "cancel") {
                console.log('User cancelled image picker');
            } else if (type === 'uri') {
                var source = {
                    uri: result.replace('file://', ''),
                    isStatic: true
                };

                this.props.onChange(source);
            }
        }.bind(this));
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
    },

    iconEdit: {
        ...su.size(32),
        backgroundColor: 'transparent'
    },
}

module.exports = ActivityCoverInput;
