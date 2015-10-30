var React = require('react-native');

var {
    Image,
    StyleSheet
} = React;

var su = require('../styleUtils');

var ArrowIcon = React.createClass({
    render: function() {
        return (
            <Image style={[styles.arrow, this.props.style]}
                source={require('image!icon-arrow')}/>
        );
    }
});

var PenIcon = React.createClass({
    render: function() {
        return (
            <Image style={[styles.pen, this.props.style]}
                source={require('image!icon-edit')}/>
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
