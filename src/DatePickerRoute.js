var React = require('react-native');

var {
    View,
    DatePickerIOS,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity
} = React;

var DatepickerScene = React.createClass({

    propTypes: {
        minimumDate: React.PropTypes.instanceOf(Date),
        maximumDate: React.PropTypes.instanceOf(Date),
        current: React.PropTypes.instanceOf(Date),
    },

    statics: {
        getInitialDate: function(min, max, current) {
            var date = current || new Date;
            if (min && date < min) {
                date = min;
            } else if (max && date > max) {
                date = max;
            }
            return date;
        }
    },

    getInitialState: function() {
        var min = this.props.minimumDate;
        var max = this.props.maximumDate;
        var current = this.props.current;

        return {
            date: DatepickerScene.getInitialDate(min, max, current)
        }
    },

    componentDidMount: function() {
        this.props.navbar.addListener('save', this._handleSave.bind(this));
    },

    _handleSave: function() {
        this.props.onResult(this.state.date);
        this.props.navigator.pop();
    },

    render: function() {
        return (
            <View style={[styles.container, this.props.style]}>
                <DatePickerIOS
                    date={this.state.date}
                    mode="date"
                    minimumDate={this.props.minimumDate}
                    maximumDate={this.props.maximumDate}
                    timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
                    onDateChange={(date) => {this.setState({date})}}
                    minuteInterval={10}/>
            </View>
        )
    }
});


var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },

    save: {
        margin: 10,
        borderRadius: 6,
        backgroundColor: 'transparent',
        overflow: 'hidden'
    },

    saveText: {
        paddingVertical: 10,
        backgroundColor: '#0087fa',
        color: '#fff',
        textAlign: 'center'
    }
});

var BaseRouteMapper = require('./BaseRouteMapper');
var EventEmitter = require('EventEmitter');

class DatePickerRoute extends BaseRouteMapper {

    constructor(params) {
        super();
        this.params = params;
        this.emitter = new EventEmitter();
    }

    get title() {
        return this.params.title || "选择时间";
    }

    _onSave() {
        this.emitter.emit('save');
    }

    renderLeftButton(route, navigator, index, navState) {
        var styles = this.styles;
        return (
            <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigator.pop()}>
            <Image
                style={styles.navBarLeftButton} 
                source={require('image!back-icon')}/>
          </TouchableOpacity>
        );
    }

    renderRightButton(route, navigator, index, navState) {
        var styles = this.styles;
        return (
            <TouchableOpacity 
            activeOpacity={0.8} 
            style={styles.navBarRightButton}
            onPress={this._onSave.bind(this)}>
            <Text style={styles.navBarButtonText}>确认</Text>
          </TouchableOpacity>
        );
    }

    renderScene() {
        return (
            <DatepickerScene 
                navbar={this.emitter}
                maximumDate={this.params.maximumDate}
                minimumDate={this.params.minimumDate}
                current={this.params.current}
                onResult={this.params.onResult}/>
        );
    }
}

module.exports = DatePickerRoute;
