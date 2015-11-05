var React = require('react-native');

var {
    View,
    DatePickerIOS,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity
} = React;

var ParallaxView = require('react-native-parallax-view');

var TestScene = React.createClass({
    render: function() {

        var coverPlaceholder = 'http://f.hiphotos.baidu.com/image/pic/item/b64543a98226cffc9b70f24dba014a90f703eaf3.jpg';
        return (
            <ParallaxView
                style={styles.container}
                backgroundSource={{uri: coverPlaceholder}}
                windowHeight={180}
                header={(
                        <Text style={styles.header}>
                            Header Content
                        </Text>
                    )}>
              <View style={{height: 1000, backgroundColor: '#CCC'}}>
              </View>
            </ParallaxView>
        )
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
});

var BaseRouteMapper = require('./BaseRouteMapper');

class Route extends BaseRouteMapper {

    get style() {
        return this.styles.navBarEmpty;
    }

    renderScene() {
        return (
            <TestScene />
        );
    }
}

module.exports = Route;
