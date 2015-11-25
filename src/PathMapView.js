/**
 * Created by lvbingru on 11/25/15.
 */

import React, {InteractionManager, Component, PropTypes, View, Text, requireNativeComponent, NativeModules,StyleSheet} from 'react-native';
const BaiduMap = requireNativeComponent('RCTBaiduMap');
const BaiduLocation = NativeModules.BaiduLocationObserver;

const propTypes = {}

const defaultProps = {}

export default class PathMapView extends Component {
    constructor(props) {
        super(props);

      let locationArray = props.locationArray;

      // ---test---
      if (locationArray == nil) {
        BaiduLocation.loadRecordLocation((r)=>{
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
