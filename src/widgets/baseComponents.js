var React = require('react-native');

var {
    Text,
    TextInput,
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
            <TextInput {...this.props} 
                style={[styles.textInput, this.props.style]}/>
        );
    }
});

var styles = StyleSheet.create({
    text: {
        color: stylesVar('dark'),
        fontWeight: '300'
    },

    textInput: {
        color: stylesVar('dark'),
        fontWeight: '300'
    }
});

module.exports = {
    BaseText,
    BaseTextInput
};

