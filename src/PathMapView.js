/**
 * Created by lvbingru on 11/25/15.
 */

import React, {Image, Component, PropTypes, View, Text, requireNativeComponent, NativeModules,StyleSheet, TouchableOpacity} from 'react-native';
const BaiduMap = requireNativeComponent('RCTBaiduMap');
const BaiduLocation = NativeModules.BaiduLocationObserver;
const su = require('./styleUtils');
const icons = require('./icons');

const propTypes = {}

const defaultProps = {}

class PathMapView extends Component {
    constructor(props) {
        super(props);

      let locationArray = props.locationArray;

      // ---test---
      if (!locationArray) {
        BaiduLocation.loadRecordLocation((r)=>{
          console.log(r);
          this.setState({
            locationArray : r.locations,
          })
        });
      }
      // ---test---

        this.state = {
          locationArray : locationArray,
        };
    }

    render() {
        return (
            <View style={[styles.container]}>
                <BaiduMap style={[styles.container]} locationArray = {this.state.locationArray}/>
            </View>
        );
    }
}

PathMapView.propTypes = propTypes;
PathMapView.defaultProps = defaultProps;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf : 'stretch',
  },

});

var BaseRouteMapper = require('./BaseRouteMapper');

class Route extends BaseRouteMapper {

  constructor(params) {
    super();
    params = params || {};
    this.params = params;
  }

  get title() {
    return 'xxx的足迹';
  }

  renderLeftButton(route, navigator, index, navState) {
    return this._renderBackButton(route, navigator, index, navState);
  }

  renderRightButton(route, navigator, index, navState) {
    var styles = this.styles;
    var icon = {
      ...su.size(18, 18),
    };

    return (
      <TouchableOpacity
        style={[styles.wrap, styles.right]}>
        <Image style={icon} source={icons.share}/>
      </TouchableOpacity>
    );
  }

  renderScene() {
    return (
      <PathMapView {...this.params}/>
    );
  }
}

module.exports = Route;
