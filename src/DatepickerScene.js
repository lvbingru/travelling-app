var React = require('react-native');

var {
    View,
    DatePickerIOS,
    StyleSheet,
    Text,
    TouchableOpacity
} = React;

var DatepickerScene = React.createClass({

    getInitialState: function() {
        return {
            date: new Date()
        }
    },

    _onSave: function() {

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

                <TouchableOpacity activeOpacity={0.8} onPress={this._onSave} style={styles.save}>
                    <Text style={styles.saveText}>确定</Text>
                </TouchableOpacity>
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

module.exports = DatepickerScene;
