'use strict';

var _ = require('underscore');
var React = require('react-native');
var {
  PickerIOS,
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
} = React;

var stylesVar = require('./stylesVar');
var su = require('./styleUtils');

var RANGE = _.range(5).map((n) => n + 1);

var ActivityCarsPicker = React.createClass({
    getInitialState: function() {
        return {
            value: 1
        };
    },

    _dismiss: function() {
        this.props.closeModal();
        this.props.onDismiss && this.props.onDismiss();
    },

    _setResult: function(result) {
        this.props.closeModal();
        this.props.onResult(result);
    },

    _onValueChange: function(value) {
        this.setState({
            value: value
        });
    },

    _onPress: function(e) {
        if (e.currentTarget !== e.target) {
            return; 
        }

        this._dismiss();
    },

    render: function() {
        return (
          <TouchableOpacity
            onPress={this._onPress}
            activeOpacity={0.8}
            style={styles.container}>

            <View style={styles.wrap}>
                <View style={styles.buttons}>
                    <TouchableOpacity 
                        onPress={() =>  this._dismiss()}
                        activeOpacity={0.8}
                        style={styles.btnLink}>
                        <Text style={styles.cancelText}>取消</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this._setResult(this.state.value)}
                        activeOpacity={0.8}
                        style={styles.btnLink}>
                        <Text style={styles.confirmText}>确认</Text>
                    </TouchableOpacity>
                </View>

                <PickerIOS 
                    style={styles.picker}
                    onValueChange={(value) => this.setState({value})}
                    selectedValue={this.state.value}>
                    {RANGE.map((count) => {
                        return (
                            <PickerIOS.Item
                                style={{flex: 1, width: 100}}
                                key={'cars_' + count}
                                value={count}
                                label={count + '辆'}
                            />
                        );
                    })}
                </PickerIOS>
            </View>
          </TouchableOpacity>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent'
    },

    wrap: {
        backgroundColor: '#fff',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
          height: 3,
          width: 0
        }
    },

    buttons: {
        borderBottomWidth: 1,
        borderBottomColor: stylesVar('dark-lighter'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 8
    },

    btnLink: {
        height: 45,
        paddingHorizontal: 6,
        justifyContent: 'center',
        alignItems: 'center'
    },

    cancelText: {
        color: stylesVar('dark-mid')
    },

    confirmText: {
        color: stylesVar('brand-primary')
    },

    picker: {
        flex: 1,
        flexDirection: 'column'
    }
});

module.exports = ActivityCarsPicker;
