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
  BriefMixin,
  SimpleField
} = require('./createActivity');

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
      var brief = _.pick(this.state, _.keys(briefLabels));
      this.props.navigator.push(new FillActivityDetailRoute(brief));
    } catch (e) {
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
          <SimpleField
            label={briefLabels.title}
            value={this.state.title}
            labelStyle={styles.label}
            onChange={this._save('title')}/>

          <SimpleField
            label={briefLabels.route}
            value={this.state.route}
            labelStyle={styles.label}
            onChange={this._save('route')}/>

          <SimpleField
            label={briefLabels.startDate}
            value={this.state.startDate}
            labelStyle={styles.label}
            onPress={this._showDatePickerForStartDate}
            onChange={this._save('startDate')}/>

          <SimpleField
            label={briefLabels.endDate}
            value={this.state.endDate}
            labelStyle={styles.label}
            style={styles.last}
            onPress={this._showDatePickerForEndDate}
            onChange={this._save('endDate')}/>
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

  label: {
    width: 60
  },

  last: {
    borderBottomWidth: 0
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
