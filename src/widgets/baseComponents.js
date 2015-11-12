var React = require('react-native');

var {
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet
} = React;

var stylesVar = require('../stylesVar');

var BaseText = React.createClass({
    render: function() {
        return (
            <Text {...this.props} style={[styles.text, this.props.style]}>
                {this.props.children}
            </Text>
        );
    }
});

var BaseTextInput = React.createClass({
    render: function() {
        return (
            <TextInput 
                {...this.props}
                style={[styles.textInput, this.props.style]}/>
        );
    }
});

var BaseTouchableOpacity = React.createClass({
    
    displayName: 'BaseTouchableOpacity',

    render: function() {
        return (
            <TouchableOpacity
                {...this.props}
                activeOpacity={this.props.activeOpacity || 0.8}/>
        );
    }
});

var styles = StyleSheet.create({
    text: {
        fontSize: 14,
        color: stylesVar('dark'),
        fontWeight: '300'
    },

    textInput: {
        fontSize: 14,
        color: stylesVar('dark'),
        fontWeight: '300'
    }
});

module.exports = {
    BaseText,
    BaseTouchableOpacity,
    BaseTextInput
};

