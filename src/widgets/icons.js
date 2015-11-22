var React = require('react-native');

var {
    Image,
    StyleSheet
} = React;

var su = require('../styleUtils');
var icons = require('../icons');

var ArrowIcon = React.createClass({
    render: function() {
        return (
            <Image style={[styles.arrow, this.props.style]}
                source={icons.arrow}/>
        );
    }
});

var PenIcon = React.createClass({
    render: function() {
        return (
            <Image style={[styles.pen, this.props.style]}
                source={icons.edit}/>
        );
    }
});

var styles = StyleSheet.create({
    arrow: {
        ...su.size(9, 15),
        resizeMode: 'contain',
    },

    pen: {
        ...su.size(32),
        backgroundColor: 'transparent'
    },
});

module.exports = {
    ArrowIcon,
    PenIcon
};
