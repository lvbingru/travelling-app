var React = require('react-native');

var {
    Image,
    Text,
    View,
    StyleSheet,
    TouchableOpacity
} = React;

var Tabs = require('react-native-tabs');
var stylesVar = require('./stylesVar');

var StaticPage = React.createClass({
    render: function() {
        return <View style={{flex: 1}}/>
    }
});

var RoutePickerScene = React.createClass({
    _onTabSelect: function() {
        console.log(arguments);
    },

    _onResult: function() {
        this.props.onResult();
        this.props.navigator.pop();
    },

    render: function() {
        return (
            <View style={[styles.container, this.props.style]}>
                <TouchableOpacity 
                    onPress={this._onResult}
                    activeOpacity={0.8} 
                    style={styles.button}>
                    <Text style={styles.buttonText}>选择轨迹</Text>
                </TouchableOpacity>
            </View>
        );
    }
});

var BaseRouteMapper = require('./BaseRouteMapper');

class RoutePickerRoute extends BaseRouteMapper {

    constructor(params) {
        super();
        this.params = params;
    }

    get style() {
        return {
            backgroundColor: stylesVar('brand-primary')
        }
    }

    get title() {
        return '轨迹';
    }

    renderLeftButton(route, navigator, index, navState) {
        var styles = this.styles;
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigator.pop()}>
            <Image style={styles.navBarLeftButton} source={require('image!back-icon')}/>
          </TouchableOpacity>
        );
    }

    renderScene() {
        return <RoutePickerScene onResult={this.params.onResult}/>
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },

    button: {
        backgroundColor: stylesVar('brand-primary'),
        height: 45,
        margin: 20,
        borderRadius: 6,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        color: 'white'
    }
});

module.exports = RoutePickerRoute;