'use strict';

var React = require('react-native');

var {
    Image,
    PixelRatio,
    StyleSheet,
    TouchableOpacity,
    View
} = React;

var {
    ArrowIcon,
    BaseText,
    BaseTextInput
} = require('../widgets');

var Text = BaseText;
var TextInput = BaseTextInput;

var su = require('../styleUtils');
var stylesVar = require('../stylesVar');

var SimpleField = React.createClass({
    propTypes: {
        onPress: React.PropTypes.func,
        onChange: React.PropTypes.func,
        multiline: React.PropTypes.bool,
        label: React.PropTypes.string.isRequired,
        value: React.PropTypes.string.isRequired,
    },

    getDefaultProps: function() {
        return {
            multiline: false
        };
    },

    render: function() {
        var activeOpacity = this.props.onPress ? 0.8 : null;
        var Container = this.props.onPress ? TouchableOpacity : View;
        var editable = !this.props.onPress;
        var fieldStyle = this.props.multiline ? styles.multiField : styles.field;
        var labelStyle = this.props.multiline ? styles.multiLabel : styles.label;
        // FIXME: hack arrow now
        var arrowStyle = this.props.multiline ? {marginTop: 6} : {};

        return (
            <Container 
                activeOpacity={activeOpacity} 
                onPress={this.props.onPress}
                style={[fieldStyle, this.props.style]}>
                <Text style={[labelStyle, this.props.labelStyle]}>{
                    this.props.label}
                </Text>
                <TextInput 
                    value={this.props.value} 
                    multiline={this.props.multiline}
                    editable={editable}
                    onChangeText={this.props.onChange}
                    style={this.props.multiline ? styles.multiInput : styles.input}/>
                <ArrowIcon style={arrowStyle}/>
            </Container>
        );
    }
});

var fieldBase = {
    flexDirection: 'row',
    paddingRight: 8,
    paddingLeft: 8,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: stylesVar('dark-light')
}

var labelBase = {
    width: 90,
    color: stylesVar('dark-mid')
}

var styles = StyleSheet.create({
    label: {
        ...labelBase    
    },

    multiLabel: {
        ...labelBase,
        lineHeight: 20
    },

    field: {
        ...fieldBase,
        alignItems: 'center',
    },

    multiField: {
        ...fieldBase,
        paddingTop: 10,
        paddingBottom: 10
    },

    input: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
        paddingHorizontal: 8,
        height: 45
    },

    multiInput: {
        flex: 1,
        fontSize: 14,
        paddingHorizontal: 8,
        height: 60
    }
});

module.exports = {
    SimpleField
}
