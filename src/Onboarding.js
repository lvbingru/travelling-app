var React = require('react-native');
var {
    AsyncStorage,
    StyleSheet,
    Dimensions,
    View,
    Image
} = React;

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var BaseRouteMapper = require('./BaseRouteMapper');
var ViewPager = require('react-native-viewpager');
var Button = require('./widgets').Button;
var HomePage = require('./HomePage');

var icons = require('./icons');
var store = require('./store');
var {
    updateSession
} = require('./actions');

var IMGS = [
    icons.page1,
    icons.page2,
    icons.page3,
];

var Onboarding = React.createClass({
    render: function() {

        var dataSource = new ViewPager.DataSource({
            pageHasChanged: (p1, p2) => p1 !== p2,
        });

        return (
            <ViewPager 
              dataSource={dataSource.cloneWithPages(IMGS)} 
              renderPage={this._renderPage}/>
        );
    },

    _onStart: function() {
        var userstamp = Date.now();
        AsyncStorage.setItem('userstamp', String(userstamp)).catch(function(e) {
            console.trace(e);
        });

        store.dispatch(updateSession({
            userstamp: userstamp
        }));
    },

    _renderPage: function(data, pageID) {
        return (
            <Image source={data} style={styles.page}>
              {pageID == IMGS.length - 1&& 
              <View style={styles.buttonWrap}>
                <Button style={styles.button} onPress={this._onStart}>马上出发</Button>
              </View>}
            </Image>
        );
    }
});

var styles = StyleSheet.create({
    page: {
        width: deviceWidth,
        height: deviceHeight
    },
    buttonWrap: {
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        justifyContent: 'center',
        flexDirection: 'row'
    },
    button: {
        borderWidth: 1,
        borderColor: '#fff',
        width: 200,
        textAlign: 'center',
        borderRadius: 6,
    }
});

class OnboardingRoute extends BaseRouteMapper {
    get style() {
        return {
            opacity: 0
        }
    }

    renderScene(navigator) {
        return <Onboarding/>
    }
}

module.exports = OnboardingRoute;
