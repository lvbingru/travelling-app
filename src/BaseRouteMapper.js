var React = require('react-native');
var {
    Text,
    StyleSheet
} = React;

class BaseRouteMapper {

    get title() {
        return "";
    }

    get style() {
        return this.styles.navBar;
    }

    renderRightButton() {
        return null;
    }

    renderLeftButton() {
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
                backgroundColor: '#0087fa'
            },
            navBarText: {
                fontSize: 16,
                marginVertical: 10,
            },
            navBarTitleText: {
                color: '#fff',
                height: 16,
                fontSize: 16,
                marginVertical: 14,
            },
            navBarLeftButton: {
                marginLeft: 10,
                marginVertical: 14,
                width: 17,
                height: 16
            },
            navBarRightButton: {
                paddingRight: 10,
            },
            navBarButtonText: {
                color: '#fff'
            }
        });
    }
}

module.exports = BaseRouteMapper;
