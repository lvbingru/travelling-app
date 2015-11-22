var React = require('react-native');
var {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
} = React;

var {BlurView} = require('react-native-blur');
var icons = require('./icons');
var su = require('./styleUtils');

var PlusMenu = React.createClass({
    getInitialState: function() {
        return {
            title: 0,
            content: 0,
        };
    },

    _dismiss: function() {
        this.props.closeModal();
        this.props.onDismiss();
    },

    _setResult: function(result) {
        return function() {
            this.props.closeModal();
            this.props.onResult(result);
        }.bind(this);
    },

    render: function() {
        return (
          <BlurView style={styles.container} blurType="light">
            <TouchableOpacity 
                activeOpacity={0.8} 
                onPress={this._dismiss} style={styles.dismiss}>
                <Image source={icons.dismiss} style={styles.button}/>
            </TouchableOpacity>

            <View style={styles.options}>
                <TouchableOpacity 
                    activeOpacity={0.8} 
                    onPress={this._setResult('route')} 
                    style={styles.option}>
                    <Image source={icons.addRoute} style={styles.button}/>
                    <Text style={styles.baseText}>记录轨迹</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    activeOpacity={0.8} 
                    onPress={this._setResult('activity')} 
                    style={styles.option}>
                    <Image source={icons.newActivity} style={styles.button}/>
                    <Text style={styles.baseText}>发起活动</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    activeOpacity={0.8} 
                    onPress={this._setResult('journey')} 
                    style={styles.option}>
                    <Image source={icons.newJourneyNote} style={styles.button}/>
                    <Text style={styles.baseText}>写游记</Text>
                </TouchableOpacity>
            </View>
          </BlurView>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1
    },

    baseText: {
        color: '#030303'
    },

    dismiss: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center'
    },

    options: {
        position: 'absolute',
        bottom: 110,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center'
    },

    option: {
        marginHorizontal: 20
    },

    button: {
        ...su.size(48),
        marginBottom: 10
    }
});

module.exports = PlusMenu;
