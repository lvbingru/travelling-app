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
  Animated,
  AsyncStorage,

} = React;

var {
  AV
  } = require('./api/models');

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
      popAnim: new Animated.Value(0),
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
      <BlurView style={styles.container} blurType="xlight">
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
          (
            <Animated.View
              style={[styles.popMenu,
               {bottom : this.state.popAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-popMenuHeight, 0]
                })}]}
            >
              <TouchableOpacity
                style = {styles.popMenuDismissRow}
                onPress={()=>{ this.animatedPopView(0)}}
              />
              <View style = {styles.popContent}>
                <TouchableOpacity
                  style={styles.popMenuRow}
                  onPress={this.stopRecord}
                >
                  <Image
                    source = {icons.stop}
                    style = {styles.imgRecord}
                  />
                  <Text style = {styles.txtRecord}>停止记录 保存轨迹</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.popMenuRow}
                  onPress={this.state.recordState === 1 ? this.pauseRecord:this.continueRecord}
                >
                  <Image
                    source = {this.state.recordState === 1 ? icons.pause:icons.continue}
                    style = {styles.imgRecord}
                  />
                  <Text style={styles.txtRecord}>{this.state.recordState === 1 ? "暂停记录,稍后继续" : "继续记录"}</Text>
                </TouchableOpacity>

              </View>

            </Animated.View>
          )
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


            BaiduLocation.startRecordLocation({name:v});

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
      this.animatedPopView(1);
      //this.setState({
      //  popAnim : new Animated.Value(1),
      //})
    }
  },

  animatedPopView(toValue) {
    Animated.timing(
      this.state.popAnim,
      {toValue: toValue, duration: 100}
    ).start();
  },

  stopRecord: function() {
    BaiduLocation.stopRecordLocation(
      (r)=>{
        // 根据用户id生成记录的的key
        AV.User.currentAsync().then(
          (user)=>{
            const key = "userPath"+[user&&user.id?user.id:"0"];

            // 读取旧的记录
            let unSyncPath = [];
            AsyncStorage.getItem(key, (err, result)=>{
              if (result) {
                unSyncPath = JSON.parse(result)
              }
              // 增加一条记录并保存
              const {locations,name} = r;
              unSyncPath.push({
                locations : locations,
                name : name,
                id : (new Date()).getTime(),
                needSync : true,
              })
              AsyncStorage.setItem(key,  JSON.stringify(unSyncPath), (err)=>{
              })
            });
          }
        )
      }
    );

    this.setState({
      recordState: 0,
    })
    this.animatedPopView(0);
  },

  pauseRecord : function() {
    BaiduLocation.pauseRecordLocation();
    this.setState({
      recordState: 2,
    })
    this.animatedPopView(0);
  },

  continueRecord : function() {
    BaiduLocation.continueRecordLocation();
    this.setState({
      recordState: 1,
    })
    this.animatedPopView(0);
  }

});

const popMenuHeight = Dimensions.get('window').height;

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
      right : 0,
      bottom : 0,
      height : popMenuHeight,
      backgroundColor : 'transparent',
      //backgroundColor : 'rgba(234,234,234,0.9)',
    },

    popMenuDismissRow :{
      position : 'absolute',
      left : 0,
      bottom : 0,
      right : 0,
      top : 0,
    },

    popMenuRow: {
      height : 44,
      flexDirection: 'row',
      alignItems: 'center',
      padding : 15,
      borderBottomColor : 'd9d9d9',
      borderBottomWidth : 1,
      backgroundColor: 'white',
    },

    txtRecord : {
      color : '737373',
      fontSize : 17,
      paddingLeft : 11
    },

    imgRecord : {

    },

    popContent :{
      position : 'absolute',
      bottom : 312,
      left : 0,
      right : 0,
    },
});

module.exports = PlusMenu;
