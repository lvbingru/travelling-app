'use strict';

var _ = require('underscore');
var moment = require('moment');
var React = require('react-native');
var {
    AlertIOS,
    StyleSheet,
    Dimensions,
    PixelRatio,
    ScrollView,
    Text,
    TextInput,
    Image,
    View,
    TouchableOpacity,
} = React;

var su = require('./styleUtils');
var stylesVar = require('./stylesVar');
var {
    detailLabels,
    BaseMixin,
    DetailMixin
} = require('./createActivity');

var deviceWidth = Dimensions.get('window').width;

var DetailEntry = React.createClass({

    render: function() {
        var icon = this.props.ready ? 
                    require('image!icon-ready') :
                    require('image!icon-add-detail');

        var style = this.props.ready ? 
                        [styles.detailEntry, styles.detailEntryReady]:
                        styles.detailEntry;
        return (
            <TouchableOpacity 
                onPress={this.props.onPress}
                activeOpacity={0.6} 
                style={style}>
                <Image style={styles.detailEntryIcon} source={icon}/>
                <Text style={styles.detailEntryText}>{this.props.label}</Text>
            </TouchableOpacity>
        );
    }
});

var FillActivityDetail = React.createClass({

    mixins: [BaseMixin, DetailMixin],

    getInitialState: function() {
        return {};
    },

    componentDidMount: function() {
        this.props.events.addListener('next', this._next.bind(this));
    },

    _next: function() {
        try {
            this._validateDetail();
            var detail = _.extend({}, this.props.brief, this.state);
        } catch(e) {
            AlertIOS.alert(e.message);
        }
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

                        <Text style={[styles.label, styles.labelFixed]}>{detailLabels.entryDeadline}</Text>
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

                        <Text style={[styles.label, styles.labelFixed]}>{detailLabels.minCars}</Text>
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

                        <Text style={[styles.label, styles.labelFixed]}>{detailLabels.maxCars}</Text>
                        <TextInput 
                            value={maxCars ? maxCars + "辆" : ""} 
                            editable={false}
                            style={styles.input}/>
                        <Image style={styles.arrow} source={require('image!icon-arrow')}/>
                    </TouchableOpacity>
                </View>

                <View style={styles.details}>
                    <DetailEntry 
                        onPress={this._editRouteMap}
                        label={"选择" + detailLabels.routeMap}
                        ready={!!this.state.routeMap}/>
                    <DetailEntry 
                        onPress={this._editText('routeDesc')} 
                        label={detailLabels.routeDesc} 
                        ready={!!this.state.routeDesc}/>
                    <DetailEntry 
                        onPress={this._editText('partnerRequirements')}
                        label={detailLabels.partnerRequirements} 
                        ready={!!this.state.partnerRequirements}/>
                    <DetailEntry 
                        onPress={this._editText('equipementRequirements')}
                        label={detailLabels.equipementRequirements}
                        ready={!!this.state.equipementRequirements}/>
                    <DetailEntry
                        onPress={this._editText('costDesc')}
                        label={detailLabels.costDesc}
                        ready={!!this.state.costDesc}/>
                    <DetailEntry
                        onPress={this._editText('riskPrompt')}
                        label={detailLabels.riskPrompt}
                        ready={!!this.state.riskPrompt}/>
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
        marginBottom: 20,
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
