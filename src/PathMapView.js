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

      //console.log(props.locationArray);

      // ---test---
      if (!props.locationArray) {
        BaiduLocation.loadRecordLocation((r)=>{
          //console.log(r.locations);
          this.setState({
            locationArray : r.locations,
          })
        });
      }

      // ---test---
      this.state = {
          locationArray : [],
      };
    }

    componentDidMount() {
      setTimeout(()=> {
        this.setState({
          locationArray : this.props.locationArray,
        });
      }, 0.3);
    }

    render() {
        return (
            <View style={[styles.container]}>
                <BaiduMap style={[styles.map]} locationArray = {this.state.locationArray}/>
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
    paddingTop : 64,
  },

  map : {
    flex: 1,
    alignSelf : 'stretch',
  }

});

var BaseRouteMapper = require('./BaseRouteMapper');

class Route extends BaseRouteMapper {

  constructor(params) {
    super();
    params = params || {};
    this.params = params;
  }

  get title() {
    return this.params.username + '的足迹';
  }

  renderLeftButton(route, navigator, index, navState) {
    return this._renderBackButton(route, navigator, index, navState);
  }

  renderRightButton(route, navigator, index, navState) {
    var styles = this.styles;
    var icon0 = {
      ...su.size(18, 18),
    };
    var icon1 = {
      ...su.size(14, 20),
    };

    return (
      <View style = {{flex:1, flexDirection:'row', alignSelf:'stretch'}}>
        <TouchableOpacity
          style={[styles.wrap, styles.right]}
          onPress = {()=>{}}
        >
          <Image style={icon0} source={icons.starsOpposite}/>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.wrap, styles.right]}
          onPress = {()=>{}}
        >
          <Image style={icon1} source={icons.share}/>
        </TouchableOpacity>
      </View>
    );
  }

  renderScene() {
    return (
      <PathMapView {...this.params}/>
    );
  }
}

module.exports = Route;
