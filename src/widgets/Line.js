var stylesVar = require('../stylesVar');
var React = require('react-native');

var {
    PixelRatio,
    View,
    StyleSheet
} = React;

var Line = React.createClass({
    render: function() {
        return <View style={styles.line}/>
    }
});

var styles = StyleSheet.create({
    line: {
        height: 1 / PixelRatio.get(),
        backgroundColor: stylesVar('dark-light')
    }  
});

module.exports = Line;
