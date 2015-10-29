'use strict';

var _ = require('underscore');
var moment = require('moment');
var React = require('react-native');

var {
    AlertIOS,
    StyleSheet,
    PixelRatio,
    Text,
    TextInput,
    Image,
    View,
    TouchableOpacity,
} = React;

var su = require('./styleUtils');
var stylesVar = require('./stylesVar');
var ActivityCoverInput = require('./ActivityCoverInput');
var FillActivityDetailRoute = require('./FillActivityDetail');

var {
    briefLabels,
    BaseMixin,
    BriefMixin
} = require('./createActivity');
var Labels = briefLabels;

var FillActivityBrief = React.createClass({

    mixins: [BaseMixin, BriefMixin],

    getInitialState: function() {
        return {};
    },

    componentDidMount: function() {
        this.props.events.addListener('next', this._next.bind(this));
    },

    _next: function() {
        try {
            this._validateBrief();
            var brief = _.pick(this.state, _.keys(Labels));
            this.props.navigator.push(new FillActivityDetailRoute(brief));
        } catch(e) {
            AlertIOS.alert(e.message);
        }
    },

    render: function() {
        return (
            <View style={[styles.container, this.props.style]}>
                <ActivityCoverInput 
                    style={styles.section}
                    value={this.state.cover}
                    onChange={(cover) => this.setState({cover})}/>

                <View style={styles.info}>
                    <View style={styles.field}>
                        <Text  style={[styles.label, styles.labelFixed]}>{Labels.title}</Text>
                        <TextInput 
                            value={this.state.title} 
                            style={styles.input} 
                            onChangeText={(title) => this.setState({title})}/>
                        <Image style={styles.arrow} source={require('image!icon-arrow')}/>
                    </View>

                    <View style={styles.field}>
                        <Text style={[styles.label, styles.labelFixed]}>{Labels.route}</Text>
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

                    <Text style={[styles.label, styles.labelFixed]}>{Labels.startDate}</Text>
                        <TextInput 
                            value={this._formatDate(this.state.startDate)} 
                            editable={false}
                        style={styles.input}/>
                        <Image style={styles.arrow} source={require('image!icon-arrow')}/>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={this._showDatePickerForEndDate}
                        style={[styles.field, styles.lastField]}>

                        <Text style={[styles.label, styles.labelFixed]}>{Labels.endDate}</Text>
                        <TextInput 
                            value={this._formatDate(this.state.endDate)} 
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
        backgroundColor: stylesVar('dark-lighter')
    },

    section: {
        marginBottom: 20,
    },

    info: {
        backgroundColor: '#fff',
        paddingLeft: 15,

        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: stylesVar('dark-light'),
        borderTopWidth: 1 / PixelRatio.get(),
        borderTopColor: stylesVar('dark-light')
    },

    labelFixed: {
        width: 60
    },

    label: {
        color: stylesVar('dark-mid')
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
