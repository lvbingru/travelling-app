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
    Labels,
    BaseMixin,
    BriefMixin,
    DetailMixin
} = require('./createActivity');

var ActivityFormSummaryScene = React.createClass({

    mixins: [BaseMixin, BriefMixin, DetailMixin],

    getInitialState() {
        return {
            ...this.props.summary
        };
    },
    
    render: function() {
        return (
            <View style={[styles.container, this.props.style]}>
                <ActivityCoverInput 
                    style={styles.section}
                    value={this.state.cover}
                    onChange={(cover) => this.setState({cover})}/>

                <View style={[styles.section, styles.formGroup]}>
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
                        activeOpacity={0.8} 
                        onPress={this._showDatePickerForStartDate}
                        style={styles.field}>
                        <Text style={styles.label}>{Labels.startDate}</Text>
                        <TextInput 
                            value={this.state.startDate} 
                            style={styles.input} 

                            editable={false}/>
                        <Image style={styles.arrow} source={require('image!icon-arrow')}/>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={[styles.field, styles.lastField]}>
                        <Text style={styles.label}>{Labels.endDate}</Text>
                        <TextInput 
                            value={this.state.endDate} 
                            style={styles.input} 
                            editable={false}/>
                        <Image style={styles.arrow} source={require('image!icon-arrow')}/>
                    </TouchableOpacity>
                </View>

                <View style={[styles.section, styles.formGroup]}>
                    <View style={styles.field}>
                        <Text style={styles.label}>标题</Text>
                        <TextInput 
                            value={this.state.title} 
                            style={styles.input} 
                            onChangeText={(title) => this.setState({title})}/>
                        <Image style={styles.arrow} source={require('image!icon-arrow')}/>
                    </View>
                    <View style={styles.field}>
                        <Text style={styles.label}>标题</Text>
                        <TextInput 
                            value={this.state.title} 
                            style={styles.input} 
                            onChangeText={(title) => this.setState({title})}/>
                        <Image style={styles.arrow} source={require('image!icon-arrow')}/>
                    </View>
                </View>

            </View>            
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
            title: Labels.entryDeadline,
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
        var modal = <ActivityCarsPicker onResult={this._save('minCars')}/>;
        this.props.openModal(modal);
    },

    _showMaxCarsPicker: function() {
        var modal = <ActivityCarsPicker onResult={this._save('maxCars')}/>;
        this.props.openModal(modal);
    },

    _next: function() {
        var prop = _.find(_.keys(Labels), function(key) {
            return !this.state[key];
        }, this);

        if (prop) {
            return AlertIOS.alert(Labels[prop] + '没有填写');
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
            title: Labels[entry],
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

    constructor(summary) {
        super();
        this.summary = summary;
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
        return <ActivityFormSummaryScene summary={this.summary} events={this.emitter}/>
    }

    _publish() {
        this.emitter.emit('publish');
    }
}

module.exports = ActivityFormSummaryRoute;
