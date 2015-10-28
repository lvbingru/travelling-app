'use strict';

var moment = require('moment');
var React = require('react-native');

var {
    AlertIOS,
    PickerIOS,
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

var su = require('./styleUtils');
var stylesVar = require('./stylesVar');
var ActivityCarsPicker = require('./ActivityCarsPicker');
var DatePickerRoute = require('./DatePickerRoute');

var Labels = {
    entryDeadline: '报名截止日期',
    minCars: '最少车辆数量',
    maxCars: '最大车辆数量'
}

var DetailEntry = React.createClass({
    render: function() {
        <TouchableOpacity activeOpacity={0.8} style={styles.detailEntry}>
            <Image style={styles.detailEntryIcon} source={require('image!icon-add-detail')}/>
            <Text>this.props.label</Text>
        </TouchableOpacity>
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
        console.log('next');
    },

    _save: function(key) {
        return function(value) {
            var partial = {};
            partial[key] = String(value);
            this.setState(partial);
        }.bind(this)
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
                <View style={styles.section}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={this._showDatePickerForEntryDeadline}
                        style={styles.field}>

                        <Text style={[styles.label, styles.labelFixed]}>{Labels.entryDeadline}</Text>
                        <TextInput 
                            value={this._formatDate(this.state.entryDeadline)} 
                            editable={false}
                            style={styles.input}/>
                        <Image style={styles.arrow} source={require('image!icon-arrow')}/>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={this._showMinCarsPicker}
                        style={styles.field}>

                        <Text style={[styles.label, styles.labelFixed]}>{Labels.minCars}</Text>
                        <TextInput 
                            value={minCars ? minCars + "辆" : ""} 
                            editable={false}
                            style={styles.input}/>
                        <Image style={styles.arrow} source={require('image!icon-arrow')}/>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={this._showMaxCarsPicker}
                        style={[styles.field, styles.lastField]}>

                        <Text style={[styles.label, styles.labelFixed]}>{Labels.maxCars}</Text>
                        <TextInput 
                            value={maxCars ? maxCars + "辆" : ""} 
                            editable={false}
                            style={styles.input}/>
                        <Image style={styles.arrow} source={require('image!icon-arrow')}/>
                    </TouchableOpacity>
                </View>

                <View style={styles.details}>
                </View>
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
        marginTop: 20,
        marginBottom: 30,
        borderTopWidth: 1 / PixelRatio.get(),
        borderTopColor: stylesVar('dark-light'),
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: stylesVar('dark-light'),
        backgroundColor: '#fff',
        paddingLeft: 15
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

    detailEntry: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1 / PixelRatio.get(),
        borderColor: stylesVar('dark-light')
    },

    detailEntryIcon: {
        ...su.size(18)
    }
});

var EventEmitter = require('EventEmitter');
var BaseRouteMapper = require('./BaseRouteMapper');

class FillActivityDetailRoute extends BaseRouteMapper {

    get style() {
        return {
            backgroundColor: stylesVar('brand-primary')
        }
    }

    get title() {
        return '发布活动(2/2)';
    }

    constructor(brief) {
        super();
        this.brief = brief;
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
        return <FillActivityDetail brief={this.brief} events={this.emitter}/>
    }

    _next() {
        this.emitter.emit('next');
    }
}

module.exports = FillActivityDetailRoute;
