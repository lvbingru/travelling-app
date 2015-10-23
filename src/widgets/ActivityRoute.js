var React = require('react-native');

var {
    View,
    Text,
    Image,
    StyleSheet
} = React;

var su = require('../styleUtils');

var ActivityRoute = React.createClass({
    render: function() {
        return (
            <View style={[styles.route, this.props.style]}>
                <Image 
                    style={[styles.icon, {marginRight: 10}]} 
                    source={require('image!icon-mark')}/>
                <Text style={styles.baseText}>{this.props.route}</Text>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {},

    icon: {
        ...su.size(11)
    },

    baseText: {
        fontWeight: '200',
        color: '#030303'
    },

    route: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});

module.exports = ActivityRoute;
