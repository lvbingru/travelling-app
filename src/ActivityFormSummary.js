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

var ActivityFormSummaryScene = React.createClass({

    mixins: [BaseMixin, BriefMixin, DetailMixin],

    getInitialState() {
        return {
            ...this.props.data
        };
    },
    
    render: function() {
        return (
            <ScrollView style={[styles.container, this.props.style]}>
                <ActivityCoverInput 
                    style={styles.section}
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
            </ScrollView>            
        );
    }
});

var FillActivityDetail = React.createClass({

    getInitialState: function() {
        return {};
    },

    componentDidMount: function() {
        this.props.events.addListener('next', this._next.bind(this));
    },

    _showDatePickerForEntryDeadline: function() {
        this.props.navigator.push(new DatePickerRoute({
            title: labels.entryDeadline,
            onResult: this._saveEntryDeadline.bind(this),
            maximumDate: this.props.brief.startDate
        }));
    },

    _saveEntryDeadline: function(date) {
        this.setState({
            entryDeadline: date
        });
    },

    _showMinCarsPicker: function() {
        var modal = <ActivityCarsPicker onResult={this._save('maxCars')}/>;
        this.props.openModal(modal);
    },

    _showMaxCarsPicker: function() {
        var modal = <ActivityCarsPicker onResult={this._save('maxCars')}/>;
        this.props.openModal(modal);
    },

    _next: function() {
        var prop = _.find(_.keys(labels), function(key) {
            return !this.state[key];
        }, this);

        if (prop) {
            return AlertIOS.alert(labels[prop] + '没有填写');
        }

        if (this.state.maxCars < this.state.minCars) {
            return AlertIOS.alert('最大车辆数太小');
        }

        var detail = _.extend({}, this.props.brief, this.state);
        console.log(detail);
    },

    _save: function(key) {
        return function(value) {
            var partial = {};
            partial[key] = String(value);
            this.setState(partial);
        }.bind(this)
    },

    _edit: function(entry) {
        var navigator = this.props.navigator;
        if (entry === 'routeMap') {
            return navigator.push(new RoutePicker({
                onResult: () => {
                    var routeMap = {
                        type: 'placeholder'
                    };
                    this.setState({routeMap});
                }
            }));
        }

        navigator.push(new TextInputRoute({
            title: labels[entry],
            initValue: this.state[entry],
            onResult: this._save(entry)
        }));
    },

    _formatDate: function(date) {
        return date ? moment(date).format('YYYY-MM-DD') : '';
    },

    render: function() {
        var {
            minCars,
            maxCars
        } = this.state;

        return (
            <View style={[styles.container, this.props.style]}>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: stylesVar('dark-lighter')
    },

    section: {
        marginBottom: 20
    },

    formGroup: {
        backgroundColor: 'white',
        paddingLeft: 8,
        borderTopWidth: 1,
        borderTopColor: stylesVar('dark-lighter'),
        borderBottomWidth: 1,
        borderBottomColor: stylesVar('dark-lighter'),
    },

    label: {
        width: 90,
        color: stylesVar('dark-mid')
    },

    field: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 8,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: stylesVar('dark-light')
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
    },

    details: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: 10
    },

    detailEntry: {
        width: (deviceWidth - 60) / 2,
        ...su.margin(0, 10, 10),
        backgroundColor: '#fff',
        borderWidth: 1 / PixelRatio.get(),
        borderColor: stylesVar('dark-light'),
        paddingVertical: 20,
        paddingLeft: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },

    detailEntryReady: {
        borderWidth: 1 / PixelRatio.get(),
        borderColor: stylesVar('brand-primary'),
    },

    detailEntryIcon: {
        ...su.size(18),
        resizeMode: 'contain',
        marginRight: 9
    },

    detailEntryText: {
        color: stylesVar('dark-mid')
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
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigator.pop()}>
                    <Image style={styles.navBarLeftButton} source={require('image!back-icon')}/>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}>
                    <Text style={styles.navBarButtonText}>取消</Text>
                </TouchableOpacity>
            </View>
        );
    }

    renderRightButton(route, navigator, index, navState) {
        var styles = this.styles;
        return (
            <TouchableOpacity
                style={styles.navBarRightButton}
                onPress={this._publish.bind(this)}
                activeOpacity={0.8}>
                <Text style={styles.navBarButtonText}>发布</Text>
            </TouchableOpacity>
        );
    }

    renderScene() {
        return <ActivityFormSummaryScene data={this.data} events={this.emitter}/>
    }

    _publish() {
        this.emitter.emit('publish');
    }
}

module.exports = ActivityFormSummaryRoute;
