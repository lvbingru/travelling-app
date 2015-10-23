var React = require('react-native');

var {
    View,
    DatePickerIOS,
    StyleSheet
} = React;

var DatepickerScene = React.createClass({

    getInitialState: function() {
        return {
            date: new Date()
        }
    },

    render: function() {
        return (
            <View style={[styles.container, this.props.style]}>
                <DatePickerIOS
                    date={this.state.date}
                    mode="date"
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
    }
});

module.exports = DatepickerScene;
