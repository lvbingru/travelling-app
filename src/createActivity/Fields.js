'use strict';

var React = require('react-native');

var {
    Image,
    PixelRatio,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
} = React;

var su = require('../styleUtils');
var stylesVar = require('../stylesVar');

var SimpleField = React.createClass({
    propTypes: {
        onPress: React.PropTypes.func,
        onChange: React.PropTypes.func,
        label: React.PropTypes.string.isRequired,
        value: React.PropTypes.string.isRequired,
    },

    render: function() {
        var activeOpacity = this.props.onPress ? 0.8 : 1;
        var editable = !this.props.onPress;
        return (
            <TouchableOpacity 
                activeOpacity={this.props.activeOpacity} 
                onPress={this.props.onPress}
                style={[styles.field, this.props.style]}>
                <Text style={[styles.label, this.props.labelStyle]}>{
                    this.props.label}
                </Text>
                <TextInput 
                    value={this.props.value} 
                    editable={editable}
                    style={styles.input}/>
                <Image style={styles.arrow} source={require('image!icon-arrow')}/>
            </TouchableOpacity>
        );
    }
});

var styles = StyleSheet.create({
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

module.exports = {
    SimpleField
}
