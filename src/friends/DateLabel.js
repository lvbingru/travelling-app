var React = require('react-native');

var {
    View,
    Text,
    StyleSheet,
} = React;

var stylesVar = require('../stylesVar');
var {
    BaseText
} = require('../widgets');

var Label = React.createClass({
    render: function() {
        return (
            <View style={[styles.wrap, this.props.style]}>
                <View style={styles.label}>
                    <Text style={styles.text}>
                        {this.props.text}
                    </Text>
                </View>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    wrap: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    label: {
        backgroundColor: '#ccc',
        overflow: 'hidden',
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 5
    },

    text: {
        fontSize: 12,
        fontWeight: '400',
        color: 'white'
    }
});

module.exports = Label;
