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

var icons = require('./icons');
var su = require('./styleUtils');
var stylesVar = require('./stylesVar');
var {
    detailLabels,
    SimpleField,
    BaseMixin,
    DetailMixin
} = require('./createActivity');

var deviceWidth = Dimensions.get('window').width;
var ActivityFormSummary = require('./ActivityFormSummary');

var DetailEntry = React.createClass({

    render: function() {
        var icon = this.props.ready ? icons.ready : icons.iconAddDetail;

        var style = this.props.ready ? [styles.detailEntry, styles.detailEntryReady] :
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
        return {
            startDate: this.props.data.startDate
        };
    },

    componentDidMount: function() {
        this.props.events.addListener('next', this._next);
    },

    _next: function() {
        try {
            this._validateDetail();
            var detail = _.extend({}, this.props.data, this.state);
            this.props.navigator.push(new ActivityFormSummary(detail));
        } catch (e) {
            AlertIOS.alert(e.message);
        }
    },

    render: function() {
        var {
            minCars,
            maxCars,
            entryDeadline
        } = this.state;

        return (
            <View style={[styles.container, this.props.style]}>
        <View style={styles.section}>
          <SimpleField 
            label={detailLabels.entryDeadline}
            value={this._formatDate(entryDeadline)}
            onPress={this._showDatePickerForEntryDeadline}/>
          <SimpleField 
            label={detailLabels.minCars}
            value={minCars ? minCars + "辆" : ""} 
            onPress={this._showMinCarsPicker}/> 
          <SimpleField 
            label={detailLabels.maxCars}
            style={styles.last}
            value={maxCars ? maxCars + "辆" : ""} 
            onPress={this._showMaxCarsPicker}/> 
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

    last: {
        borderBottomWidth: 0,
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
        return this.styles.navBar;
    }

    get title() {
        return '发布活动(2/2)';
    }

    constructor(data) {
        super();
        this.data = data;
        this.emitter = new EventEmitter();
    }

    renderLeftButton(route, navigator, index, navState) {
        return this._renderBackButton(route, navigator, index, navState);
    }

    renderRightButton(route, navigator, index, navState) {
        return React.cloneElement(this._renderRightButton('下一步'), {
            onPress: this._next.bind(this)
        });
    }

    renderScene() {
        return <FillActivityDetail data={this.data} events={this.emitter}/>
    }

    _next() {
        this.emitter.emit('next');
    }
}

module.exports = FillActivityDetailRoute;
