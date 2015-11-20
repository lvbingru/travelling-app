'use strict';

var _ = require('underscore');
var moment = require('moment');
var React = require('react-native');

var {
    AlertIOS,
    PickerIOS,
    StyleSheet,
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

var icons = require('./icons');
var su = require('./styleUtils');
var stylesVar = require('./stylesVar');
var TextInputRoute = require('./TextInputRoute');
var ActivityCoverInput = require('./ActivityCoverInput');
var RoutePicker = require('./RoutePicker');
var DatePickerRoute = require('./DatePickerRoute');
var {
    labels,
    BaseMixin,
    BriefMixin,
    DetailMixin,
    SimpleField
} = require('./createActivity');

var {
    ArrowIcon,
    PenIcon,
    BaseText,
    BaseTextInput
} = require('./widgets');

var Dispatcher = require('./Dispatcher');

var {
    user,
    uploadPhoto,
    activity
} = require('./api');

Text = BaseText;
TextInput = BaseTextInput;

var RouteField = React.createClass({
    statics: {
        styles: StyleSheet.create({
            label: {
                color: stylesVar('dark-mid'),
                flex: 1,
            },

            bar: {
                height: 45,
                paddingLeft: 16,
                paddingRight: 8,
                flexDirection: 'row',
                alignItems: 'center'
            },

            routeMap: {
                ...su.size(deviceWidth, 135),
                    resizeMode: 'cover',
                    justifyContent: 'center',
                    alignItems: 'center'
            }
        })
    },

    render: function() {
        return (
            <TouchableOpacity activeOpacity={0.8} 
                onPress={this.props.onPress}
                style={this.props.style}>
                <View style={RouteField.styles.bar}>
                    <Text style={RouteField.styles.label}>
                        选择{labels.routeMap}
                    </Text>
                    <ArrowIcon/>
                </View>
                {/*TODO: real route previewer*/}
                <Image style={RouteField.styles.routeMap}
                    source={icons.spaceHeader}>
                    <PenIcon/>
                </Image>
            </TouchableOpacity>
        );
    }
});

var ActivityFormSummaryScene = React.createClass({

    mixins: [BaseMixin, BriefMixin, DetailMixin],

    getInitialState() {
        return {
            ...this.props.data
        };
    },

    componentDidMount: function() {
        this._publishSub = this.props.events.addListener('publish', this._publish);
        this._cancelSub = this.props.events.addListener('cancel', this._cancel);
    },

    componentWillUnmount: function() {
        this._publishSub.remove();
        this._cancelSub.remove();
    },

    _publish: function() {
        try {
            this._validateBrief();
            this._validateDetail();
            var _activity = _.extend({}, this.state);
            // TODO: save routeMap & cover;
            delete _activity.routeMap;
            // delete _activity.cover;
            console.log(_activity);
            activity.publish(_activity).then(function() {
                AlertIOS.alert('发布成功');
                Dispatcher.emit('publish-activity:done');
            }, function(e) {
                AlertIOS.alert(e.message);
            });
        } catch (e) {
            console.trace(e);
            AlertIOS.alert(e.message);
        }
    },

    _cancel: function() {
        Dispatcher.emit('publish-activity:cancel');
    },

    render: function() {
        return (
            <ScrollView style={[styles.container, this.props.style]}>
                <ActivityCoverInput 
                    style={styles.section}
                    navigator={this.props.navigator}
                    value={this.state.cover}
                    onChange={(cover) => this.setState({cover})}/>

                <View style={[styles.section, styles.formGroup]}>
                    <SimpleField
                        label={labels.title}
                        value={this.state.title}
                        onChange={this._save('title')}/>

                    <SimpleField
                        value={this.state.route}
                        label={labels.route}
                        onChange={this._save('route')}/>

                    <SimpleField
                        label={labels.startDate}
                        value={this._formatDate(this.state.startDate)} 
                        onPress={this._showDatePickerForStartDate}/>

                    <SimpleField
                        label={labels.endDate}
                        value={this._formatDate(this.state.endDate)}
                        style={styles.lastField}
                        onPress={this._showDatePickerForEndDate}/>
                </View>

                <View style={[styles.section, styles.formGroup]}>
                    <SimpleField
                        label={labels.entryDeadline}
                        value={this._formatDate(this.state.entryDeadline)} 
                        onPress={this._showDatePickerForEntryDeadline}/>
                    <SimpleField
                        label={labels.minCars}
                        value={this.state.minCars && String(this.state.minCars) + '辆'}
                        onPress={this._showMinCarsPicker}/>
                    <SimpleField
                        label={labels.maxCars}
                        value={this.state.maxCars && String(this.state.maxCars) + '辆'}
                        style={styles.lastField}
                        onPress={this._showMaxCarsPicker}/>
                </View>

                <View style={[styles.section, styles.formGroup, {paddingLeft: 0}]}>
                    <RouteField onPress={this._editRouteMap}/>
                    <SimpleField
                        multiline={true}
                        label={labels.routeDesc}
                        style={[styles.lastField, {paddingLeft: 16}]}
                        value={this.state.routeDesc}
                        onPress={this._editText('routeDesc')}/>
                </View>

                <View style={[styles.section, styles.formGroup]}>
                    {this._renderMultilineField('partnerRequirements')}
                    {this._renderMultilineField('equipementRequirements')}
                    {this._renderMultilineField('costDesc')}
                    {this._renderMultilineField('riskPrompt', true)}
                </View>
            </ScrollView>
        );
    },

    _renderMultilineField: function(key, last) {
        return (
            <SimpleField
                multiline={true}
                label={labels[key]}
                style={last ? styles.lastField : null}
                value={this.state[key]}
                onPress={this._editText(key)}/>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: stylesVar('dark-lighter')
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    section: {
        marginBottom: 20
    },

    formGroup: {
        backgroundColor: 'white',
        paddingLeft: 8,
        borderTopWidth: 1,
        borderTopColor: stylesVar('dark-light'),
        borderBottomWidth: 1,
        borderBottomColor: stylesVar('dark-light'),
    },

    label: {
        width: 90,
        color: stylesVar('dark-mid')
    },

    lastField: {
        borderBottomWidth: 0
    }
});

var EventEmitter = require('EventEmitter');
var BaseRouteMapper = require('./BaseRouteMapper');

class ActivityFormSummaryRoute extends BaseRouteMapper {

    get style() {
        return {
            backgroundColor: stylesVar('brand-primary')
        }
    }

    get title() {
        return '活动信息确认';
    }

    constructor(data) {
        super();
        this.data = data;
        this.emitter = new EventEmitter();
    }

    renderLeftButton(route, navigator, index, navState) {
        var styles = this.styles;
        return (
            <View style={styles.wrap}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigator.pop()}>
                    <Image style={[styles.navBarLeftButton, {margin: 0}]}
                        source={icons.back}/>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{marginLeft: 5}}
                    onPress={() => this.emitter.emit('cancel')}
                    activeOpacity={0.8}>
                    <Text style={[styles.navBarText, {height: 16, margin: 0}]}>取消</Text>
                </TouchableOpacity>
            </View>
        );
    }


    renderRightButton(route, navigator, index, navState) {
        return React.cloneElement(this._renderRightButton('发布'), {
            onPress: this._publish.bind(this)
        });
    }

    renderScene() {
        return <ActivityFormSummaryScene data={this.data} events={this.emitter}/>
    }

    _publish() {
        this.emitter.emit('publish');
    }
}

module.exports = ActivityFormSummaryRoute;
