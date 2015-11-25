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
  AlertIOS,
  requireNativeComponent,
  NativeModules,
} = React;

const BaiduLocation = NativeModules.BaiduLocationObserver;
let PathMapView = require('./PathMapView');

var {BlurView} = require('react-native-blur');
var icons = require('./icons');
var su = require('./styleUtils');

var PlusMenu = React.createClass({
  getInitialState: function () {

    BaiduLocation.loadRecordLocation((r)=>{
      this.setState({
        recordState : r.state,
      })
    });

    return {
      title: 0,
      content: 0,
      recordState: 0,
      recordName: null,
      popRecordMenu: false,
    };
  },

  _dismiss: function () {
    this.props.closeModal();
    this.props.onDismiss();
  },

  _setResult: function (result) {
    return function () {
      if (result == 'route') {
        this.onRecord();
      }
      else {
        this.props.closeModal();
        this.props.onResult(result);
      }

    }.bind(this);
  },

  render: function () {
    let stateName = "记录轨迹";
    if (this.state.recordState === 1) {
      stateName = "正在记录";
    }
    else if(this.state.recordState == 2) {
      stateName = "已暂停";
    }

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
            <Text style={styles.baseText}>{stateName}</Text>
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
        {
          this.state.popRecordMenu ? (
            <View style={styles.popMenu}>
              <TouchableOpacity
                style={styles.popMenuRow}
                onPress={this.stopRecord}
              >
                <Image />
                <Text>停止记录 保存轨迹</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.popMenuRow}
                onPress={this.state.recordState === 1 ? this.pauseRecord:this.continueRecord}
              >
                <Image />
                <Text>{this.state.recordState === 1 ? "暂停记录,稍后继续" : "继续记录"}</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      </BlurView>
    );
  },

  onRecord: function () {
    const {recordState} = this.state;

    if (recordState === 0) {
      AlertIOS.alert(
        '输入轨迹名称',
        '最美的时光在路上',
        [
          {text: '取消'},
          {
            text: '确认', onPress: (v) => {


            BaiduLocation.startRecordLocation({key:"1"});

            this.setState({
              recordState: 1,
              recordName: v,
            })
          }
          },
        ],
        'plain-text'
      )
    }
    else if (recordState == 1 || recordState === 2) {
      this.setState({
        popRecordMenu: true,
      })
    }
  },

  stopRecord: function() {
    BaiduLocation.stopRecordLocation((callBack)=>{console.log(callBack)});

    this.setState({
      recordState: 0,
      popRecordMenu: false,
    })
  },

  pauseRecord : function() {
    BaiduLocation.pauseRecordLocation();
    this.setState({
      recordState: 2,
      popRecordMenu: false,
    })
  },

  continueRecord : function() {
    BaiduLocation.continueRecordLocation();
    this.setState({
      recordState: 1,
      popRecordMenu: false,
    })
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
    },

    popMenu : {
      position : 'absolute',
      left : 0,
      bottom : 0,
      right : 0,
      height : 500,
      backgroundColor : 'rgba(234,234,234,0.9)',
    },

    popMenuRow: {
      height : 40,
      flexDirection: 'row',
      alignItems: 'center',
      padding : 3,
      borderBottomColor : '777777',
      borderBottomWidth : 1,
    },
});

module.exports = PlusMenu;
