var React = require('react-native');
var {
    Image,
    StyleSheet,
    TouchableOpacity,
    View
} = React;

var icons = require('./icons');
var BaseText = require('./widgets').BaseText;
var stylesVar = require('./stylesVar');

class BaseRouteMapper {

    renderRightButton() {
        return null;
    }

    get style() {
        return this.styles.navBar;
    }

    renderLeftButton() {
        return null;
    }

    renderTitle(route, navigator, index, navState) {
        var styles = this.styles;
        return (
            <View style={styles.wrap}>
              <BaseText style={[styles.navBarText]}>
                {route.title}
              </BaseText>
            </View>
        );
    }

    _renderBackButton(route, navigator, index, navState, callback) {
        var styles = this.styles;
        return (
            <View style={styles.wrap}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => callback ? callback() : navigator.pop()}>
                    <Image style={styles.navBarLeftButton} 
                        source={icons.back}/>
                </TouchableOpacity>    
            </View>
        );
    }

    _renderRightButton(text) {
        var styles = this.styles;
        return (
            <TouchableOpacity
              style={[styles.wrap, styles.navBarRightButton]}
              activeOpacity={0.8}>
              <BaseText style={styles.navBarText}>{text}</BaseText>
            </TouchableOpacity>
        );
    }

    renderScene() {
        return null;
    }

    get styles() {
        return styles;
    }
}

var styles = StyleSheet.create({
    wrap: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row'
    },

    left: {
        marginLeft: 10
    },

    right: {
        marginRight: 10
    },

    navBarTransparent: {
        backgroundColor: 'transparent'
    },
    navBar: {
        backgroundColor: stylesVar('bg-primary')
    },

    navBarEmpty: {
        opacity: 0
    },
    
    navBarText: {
        fontSize: 16,
        color: 'white'
    },

    navBarLeftButton: {
        marginLeft: 10,
        width: 18,
        height: 16
    },

    navBarRightButton: {
        marginRight: 10,
    }
});

module.exports = BaseRouteMapper;