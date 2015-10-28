'use strict';

var _ = require('underscore');
var moment = require('moment');
var React = require('react-native');

var {
    AlertIOS,
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

var su = require('./styleUtils');
var stylesVar = require('./stylesVar');
var DatePickerRoute = require('./DatePickerRoute');
var FillActivityDetailRoute = require('./FillActivityDetail');

var Labels = {
    cover: '封面',
    title: '标题',
    route: '路线',
    startDate: '出发时间',
    endDate: '结束时间',
};

var FillActivityBrief = React.createClass({

    getInitialState: function() {
        return {};
    },

    componentDidMount: function() {
        this.props.events.addListener('next', this._next.bind(this));
    },

    _next: function() {
        var prop = _.find(_.keys(Labels), function(key) {
            return !this.state[key];
        }, this);

        if (prop) {
            return AlertIOS.alert(Labels[prop] + '没有填写');
        }

        var brief = _.pick(this.state, _.keys(Labels));
        this.props.navigator.push(new FillActivityDetailRoute(brief));
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
                var source = {
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
            onResult: this._saveStartDate.bind(this),
            maximumDate: this.state.endDate
        }));
    },

    _saveStartDate: function(date) {
        this.setState({
            startDate: date
        });
    },

    _showDatePickerForEndDate: function() {
        this.props.navigator.push(new DatePickerRoute({
            onResult: this._saveEndDate.bind(this),
            minimumDate: this.state.startDate
        }));
    },

    _saveEndDate: function(date) {
        this.setState({
            endDate: date
        });
    },

    _getStartDate: function() {
        var date = this.state.startDate;
        return date ? moment(date).format('YYYY-MM-DD') : "";
    },

    _getEndDate: function() {
        var date = this.state.endDate;
        return date ? moment(date).format('YYYY-MM-DD') : "";
    },

    _renderCover: function() {
        if (!this.state.cover) {
            var coverPlaceholder = require('image!cover-placeholder');
            return (
                <Image source={coverPlaceholder} style={styles.coverPlaceholder}/>
            );
        } else {
            return (
                <Image source={this.state.cover} style={styles.cover}>
                        <Image source={require('image!icon-edit')} style={styles.iconEdit}/>
                </Image>
            );
        }
    },

    render: function() {

        return (
            <View style={[styles.container, this.props.style]}>
                <TouchableOpacity
                    style={styles.coverSection}
                    activeOpacity={0.9}
                    onPress={this._showCameraRoll}>
                    {this._renderCover()}
                </TouchableOpacity>

                <View style={styles.info}>
                    <View style={styles.field}>
                        <Text style={styles.label}>{Labels.title}</Text>
                        <TextInput 
                            value={this.state.title} 
                            style={styles.input} 
                            onChangeText={(title) => this.setState({title})}/>
                        <Image style={styles.arrow} source={require('image!icon-arrow')}/>
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>{Labels.route}</Text>
                        <TextInput 
                            value={this.state.route} 
                            style={styles.input} 
                            onChangeText={(route) => this.setState({route})}/>
                        <Image style={styles.arrow} source={require('image!icon-arrow')}/>
                    </View>

                    <TouchableOpacity 
                        style={styles.field}
                        activeOpacity={0.8}
                        onPress={this._showDatePickerForStartDate}>

                        <Text style={styles.label}>{Labels.startDate}</Text>
                        <TextInput 
                            value={this._getStartDate()} 
                            editable={false}
                        style={styles.input}/>
                        <Image style={styles.arrow} source={require('image!icon-arrow')}/>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={this._showDatePickerForEndDate}
                        style={[styles.field, styles.lastField]}>

                        <Text style={styles.label}>{Labels.endDate}</Text>
                        <TextInput 
                            value={this._getEndDate()} 
                            editable={false}
                            style={styles.input}/>
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

    coverSection: {
        backgroundColor: '#fff',
        marginBottom: 20,
    },

    iconEdit: {
        ...su.size(32),
        backgroundColor: 'transparent'
    },

    cover: {
        alignItems: 'center',
        justifyContent: 'center',
        width: deviceWidth,
        resizeMode: 'cover',
        height: 145
    },

    coverPlaceholder: {
        width: deviceWidth - 10,
        resizeMode: 'stretch',
        height: 145,
        margin: 5
    },

    info: {
        backgroundColor: '#fff',
        paddingLeft: 15,

        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#dbe0e3',
        borderTopWidth: 1 / PixelRatio.get(),
        borderTopColor: '#dbe0e3'
    },

    label: {
        width: 60,
        color: stylesVar('dark-light')
    },

    field: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 8,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: stylesVar('dark-lighter')
    },

    lastField: {
        borderBottomWidth: 0
    },

    input: {
        flex: 1,
        fontSize: 14,
        paddingHorizontal: 8,
        height: 45
    },

    arrow: {
        ...su.size(9, 15),
        resizeMode: 'contain',
    }
});

var EventEmitter = require('EventEmitter');
var BaseRouteMapper = require('./BaseRouteMapper');

class FillActivityBriefRoute extends BaseRouteMapper {

    get style() {
        return {
            backgroundColor: stylesVar('brand-primary')
        }
    }

    get title() {
        return '发布活动(1/2)';
    }

    constructor() {
        super();
        this.emitter = new EventEmitter();
    }

    renderLeftButton(route, navigator, index, navState) {
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
        var styles = this.styles;
        return (
            <TouchableOpacity
                style={styles.navBarRightButton}
                onPress={this._next.bind(this)}
                activeOpacity={0.8}>
                <Text style={styles.navBarButtonText}>下一步</Text>
            </TouchableOpacity>
        );
    }

    renderScene() {
        return <FillActivityBrief events={this.emitter}/>
    }

    _next() {
        this.emitter.emit('next');
    }
}


module.exports = FillActivityBriefRoute;
