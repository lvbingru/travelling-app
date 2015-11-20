var React = require('react-native');

var {
    Text,
    Image,
    View,
    TouchableOpacity
} = React

class ActivityScene extends React.Component {
    render() {
        return <View style={{flex: 1, backgroundColor: '#fff'}}/>;
    } 
}

var BaseRouteMapper = require('./BaseRouteMapper');
var EventEmitter = require('EventEmitter');

class ActivityRoute extends BaseRouteMapper {
    constructor() {
        super(); 
        this.eventEmitter = new EventEmitter();
    } 

    get title() {
        return '活动'
    }

    renderLeftButton(route, navigator, index, navState) {
        return this._renderBackButton(route, navigator, index, navState);
        // if (index === 0) {
        //     return null;
        // }

        // var styles = this.styles;
        // var previousRoute = navState.routeStack[index - 1];
        // return (
        //   <TouchableOpacity
        //     onPress={() => navigator.pop()}>
        //     <Image style={styles.navBarLeftButton} source={require('image!back-icon')}/>
        //   </TouchableOpacity>
        // );
    }

    renderTitle(route, navigator, index, navState) {
        var styles = this.styles;
        return (
          <Text style={[styles.navBarText, styles.navBarTitleText]}>
            {route.title}
          </Text>
        );
    }

    renderScene(navigator) {
        return <ActivityScene navigator={navigator}/>
    }
}

module.exports = ActivityRoute;
