var React = require('react-native');
var {
    StyleSheet,
    Text
} = React;

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
          <Text style={[styles.navBarText, styles.navBarTitleText]}>
            {route.title}
          </Text>
        );
    }

    renderScene() {
        return null;
    }

    get styles() {
        return StyleSheet.create({
            navBarTrasnparent: {
                backgroundColor: 'transparent'
            },
            navBar: {
                backgroundColor: stylesVar('brand-primary')
            },
            navBarText: {
                fontSize: 16,
                marginVertical: 10,
            },
            navBarTitleText: {
                color: '#fff',
                height: 20,
                marginVertical: 12,
                fontSize: 16,
            },
            navBarLeftButton: {
                marginLeft: 10,
                marginVertical: 14,
                width: 17,
                height: 16
            },
            navBarRightButton: {
                marginRight: 10,
            },
            navBarButtonText: {
                height: 20,
                fontSize: 16,
                marginVertical: 12,
                color: '#fff'
            }
        });
    }
}

module.exports = BaseRouteMapper;
