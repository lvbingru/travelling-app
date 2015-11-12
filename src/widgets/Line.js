var stylesVar = require('../stylesVar');
var React = require('react-native');

var {
    PixelRatio,
    View,
    StyleSheet
} = React;

var Line = React.createClass({
    statics: {
        HEIGHT: 1 / PixelRatio.get()
    },

    render: function() {
        return <View style={styles.line}/>
    }
});

var styles = StyleSheet.create({
    line: {
        height: Line.HEIGHT,
        backgroundColor: stylesVar('dark-light')
    }  
});

module.exports = Line;
