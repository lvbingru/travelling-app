var React = require('react-native');
var {
    View,
    Text,
    PixelRatio,
    StyleSheet
} = React;

var su = require('../styleUtils');

var Tag = React.createClass({
    render: function() {
        return (
            <Text key={this.props.key} 
                style={[styles.tag, this.props.style]}>
                {this.props.children}
            </Text>
        );
    }
});

var styles = StyleSheet.create({
    tag: {
        fontSize: 10,
        color: '#fff',
        borderRadius: 3,
        borderWidth: 1 / PixelRatio.get(),
        borderColor: '#fff',
        overflow: 'hidden',
        // FIXME: hack tag height!
        lineHeight: 12,
        ...su.padding(2, 4)
    }
})

module.exports = Tag;