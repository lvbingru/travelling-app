var React = require('react-native');

var {
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

var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var DatePickerRoute = require('./DatePickerRoute');
var su = require('./styleUtils');
var stylesVar = require('./stylesVar');

var CreateActivity = React.createClass({

    getInitialState: function() {
        return {};
    },

    _showCameraRoll: function() {
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
                const source = {
                    uri: result.replace('file://', ''),
                    isStatic: true
                };
                this.setState({
                    cover: source
                });
            }
        }.bind(this));
    },

    _showDatePickerForStartDate: function() {
        this.props.navigator.push(new DatePickerRoute({
            onResult: console.log.bind(console)
        }));
    },

    _showDatePickerForEndDate: function() {
        this.props.navigator.push(new DatePickerRoute({
            onResult: console.log.bind(console)
        }));
    },

    render: function() {
        var coverPlaceholder = require('image!cover-placeholder');

        return (
            <View style={[styles.container, this.props.style]}>
                <TouchableOpacity style={styles.uploadCover} activeOpacity={0.9} onPress={this._showCameraRoll}>
                    {this.state.cover ?
                    <Image source={this.state.cover} style={styles.cover}/> :
                    <Image source={coverPlaceholder} style={styles.coverPlaceholder}/>}
                </TouchableOpacity>

                <View style={styles.info}>
                    <View style={styles.field}>
                        <TextInput 
                            value={this.state.title} 
                            style={styles.input} 
                            placeholder="标题" 
                            onChangeText={(title) => this.setState({title})}/>
                        <Image style={styles.arrow} source={require('image!icon-arrow')}/>
                    </View>
                    <View style={styles.field}>
                        <TextInput 
                            value={this.state.route} 
                            style={styles.input} 
                            placeholder="路线" 
                            onChangeText={(route) => this.setState({route})}/>
                        <Image style={styles.arrow} source={require('image!icon-arrow')}/>
                    </View>
                    <TouchableOpacity style={styles.field}
                        onPress={this._showDatePickerForStartDate}>
                        <TextInput 
                            value={this.state.startDate} 
                            editable={false}
                            style={styles.input} 
                            placeholder="出发时间"/>
                        <Image style={styles.arrow} source={require('image!icon-arrow')}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.field, styles.lastField]} 
                        onPress={this._showDatePickerForEndDate}>
                        <TextInput 
                            value={this.state.endDate} 
                            editable={false}
                            style={styles.input} 
                            placeholder="结束时间"/>
                        <Image style={styles.arrow} source={require('image!icon-arrow')}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e7eaeb'
    },

    uploadCover: {
        backgroundColor: '#fff',
        marginBottom: 20,
        padding: 5,
    },

    cover: {
        width: deviceWidth - 10,
        resizeMode: 'cover',
        height: 145
    },

    coverPlaceholder: {
        width: deviceWidth - 10,
        resizeMode: 'stretch',
        height: 145
    },

    info: {
        backgroundColor: '#fff',
        paddingLeft: 15,

        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#dbe0e3',
        borderTopWidth: 1 / PixelRatio.get(),
        borderTopColor: '#dbe0e3'
    },

    field: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingRight: 8,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#dbe0e3'
    },

    lastField: {
        borderBottomWidth: 0
    },

    input: {
        flex: 1,
        fontSize: 14,
        height: 14
    },

    arrow: {
        ...su.size(9, 15),
        resizeMode: 'contain',
    }
});

var BaseRouteMapper = require('./BaseRouteMapper');

class CreateActivityRoute extends BaseRouteMapper {

    get style() {
        return {
            backgroundColor: stylesVar('brand-primary')
        }
    }

    get title() {
        return '发布活动(1/2)';
    }

    renderLeftButton(route, navigator, index, navState) {
        if (index === 0) {
            return null;
        }

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
        if (index === 0) {
            return null;
        }

        var styles = this.styles;
        return (
            <TouchableOpacity
                style={styles.navBarRightButton}
                activeOpacity={0.8}>
                <Text style={styles.navBarButtonText}>下一步</Text>
            </TouchableOpacity>
        );
    }

    renderScene() {
        return <CreateActivity />
    }
}


module.exports = CreateActivityRoute;
