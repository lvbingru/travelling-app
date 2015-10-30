var React = require('react-native');
var {
    StyleSheet,
    View
} = React;

var Text = require('./widgets').BaseText;

var stylesVar = require('./stylesVar');

class BaseRouteMapper {

    renderRightButton() {
        return null;
    }

    get style() {
        return {};
    }

    renderLeftButton() {
        return null;
    }

    renderTitle() {
        return null;
    }

    renderTitle(route, navigator, index, navState) {
        var styles = this.styles;
        return (
            <View style={styles.wrap}>
              <Text style={[styles.navBarText]}>
                {route.title}
              </Text>
            </View>
        );
    }

    renderScene() {
        return null;
    }

    get styles() {
        return StyleSheet.create({
            wrap: {
                flex: 1,
                justifyContent: 'center'
            },

            navBarTrasnparent: {
                backgroundColor: 'transparent'
            },
            navBar: {
                backgroundColor: stylesVar('brand-primary')
            },
            navBarText: {
                fontSize: 16,
                color: 'white'
            },
            navBarLeftButton: {
                marginLeft: 10,
                width: 17,
                height: 16
            },

            navBarRightButton: {
                marginRight: 10,
            }
        });
    }
}

module.exports = BaseRouteMapper;
