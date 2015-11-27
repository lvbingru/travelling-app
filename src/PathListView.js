/**
 * Created by lvbingru on 11/27/15.
 */

import React, {ActivityIndicatorIOS, AsyncStorage, NativeModules,StyleSheet, Component, PropTypes, View, Text, ListView, Image, TouchableHighlight} from 'react-native';
const su = require('./styleUtils');
const icons = require('./icons');
const Tab = require('./widgets/Tab');
const PathMapView = require('./PathMapView');
//var {user} = require('./api');

var {
  AV, UserPath,
  } = require('./api/models');

const propTypes = {}

const defaultProps = {}

class PathListView extends Component {
    constructor(props) {
        super(props);

      this.allPathArray = [[],[],[]];

      const user = AV.User.current();
      const userID = user&&user.id?user.id:"0";
      const username = user&&user.username?user.username:"未登录用户";

      var query = new AV.Query(UserPath);
      query.equalTo("userID", userID);
      query.find({
        success: (results)=> {
          for (var i = 0; i < results.length; i++) {
            const path = results[i];
            const name = path.get("name");
            const username = path.get("username");
            const locations = path.get("locations");
            const type = path.get("type");
            const userID = path.get("userID");

            const data ={
              name : name,
              username: username,
              userID : userID,
              type : type,
              locations : locations,
            }

            if (type === "me") {
              this.allPathArray[1].push(data);
            }
            else if (type === "fav") {
              this.allPathArray[2].push(data);
            }
            this.allPathArray[0].push(data);
          }
          this.updateView();
        },
        error: (error)=> {
          alert("Error: " + error.code + " " + error.message);
        }
      });

      // 根据用户id生成记录的的key
      const key = "userPath"+userID;

      // 读取记录
      let unSyncPath = [];
      AsyncStorage.getItem(key, (err, result)=>{
        if (result) {
          unSyncPath = JSON.parse(result)
        }

        unSyncPath.forEach((el)=>{
          let path = {...el, username:username, userID:userID, uploading: false,}

          this.allPathArray[0].push(path);
          this.allPathArray[1].push(path);
          this.updateView();
        })
      });

        this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.state = {
            tabIndex : 0,
        };
    }

    updateView() {
      this.setState({
        tabIndex: this.state.tabIndex,
      })
    }

    render() {
      const path = this.allPathArray[this.state.tabIndex]
      const dataSource = this.dataSource.cloneWithRows(path)

      return (
            <View style={[styles.container]}>
              <Tab datas={['全部', '我的', '收藏']}
                   callbacks={[0,1,2].map((el,index)=>{
                      return (()=>{
                        this.setState({
                          tabIndex: index,
                        })
                      })
                   })}
                   styles={{tabTextFont: {fontSize: 14}}}
                   activeTab={this.state.tabIndex}
              />
              <ListView
                dataSource={dataSource}
                renderRow={(rowData, sectionID, rowID) => this.renderRowPost(rowData, sectionID, rowID)}
                horizontal = {false}
                showsVerticalScrollIndicator = {true}
                removeClippedSubviews = {true}
                contentContainerStyle = {[styles.listView]}
                automaticallyAdjustContentInsets = {false}
              />
            </View>
        );
    }

  renderRowPost(rowData, sectionID, rowID) {
    return (
      <TouchableHighlight
        underlayColor = {'eeeeee'}
        onPress = {()=>{
            if(rowData.needSync) {
              let data = this.allPathArray[this.state.tabIndex][rowID];
                data.uploading = true;
                this.updateView();

                var userPath = new UserPath();
                userPath.set("name", rowData.name);
                userPath.set("username", rowData.username);
                userPath.set("userID", rowData.userID);
                userPath.set("locations", rowData.locations);
                userPath.set("type", "me");

                userPath.save(null, {
                    success: (post)=>{

                    data.needSync = false;
                    this.updateView();

                    // 删除本地数据
                    const user = AV.User.current();
                    const userID = user&&user.id?user.id:"0";
                    const key = "userPath"+userID;
                    AsyncStorage.getItem(key, (err, result)=>{

                      let array = [];
                      const data = JSON.parse(result);

                      data.forEach((el)=>{
                        if(el.id !== rowData.id) {
                            array.push(el);
                        }
                        AsyncStorage.setItem(key, JSON.stringify(array));
                      })
                    });
                },
                error: (post, error) => {
                  // 失败之后执行其他逻辑
                  // error 是 AV.Error 的实例，包含有错误码和描述信息.
                  alert('Failed to create new object, with error message: ' + error.message);
                }
});
            }
            else {
              this.props.navigator.push(
                new PathMapView({locationArray:rowData.locations, username : rowData.username})
              )
            }
        }}
      >
        <View style ={styles.row}>
          <View style = {styles.txtView}>
            <Text style={styles.txtTitle}>
              {rowData.name}
            </Text>
            <Text style={styles.txtDetail}>
              {(rowData.username)+"的轨迹"}
            </Text>
          </View>
          {
            rowData.needSync?(
              <ActivityIndicatorIOS
                hidesWhenStopped = {false}
                style = {styles.indicator}
                animating = {rowData.uploading}/>)
              :(<Image style={styles.arrow}
                                        source={icons.arrow}/>)

          }
        </View>
      </TouchableHighlight>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf : 'stretch',
    paddingTop : 64,
  },

  listView : {
    flex: 1,
    alignSelf : 'stretch',
  },

  row : {
    height : 65,
    flexDirection : 'row',
    alignItems : 'center',
    borderBottomWidth : 1,
    borderBottomColor : 'dbe0e3',
    marginLeft : 10,
  },

  arrow : {
    width : 8,
    height : 14,
    margin : 10,
  },

  indicator : {
    margin : 10,
    width : 20,
    height : 20,
  },

  txtView : {
    flex : 1,
  },

  txtTitle: {
    fontSize: 14,
    color : '303030',
  },

  txtDetail :{
    fontSize: 12,
    color : '737373',
    marginTop : 9,
  },
});

PathListView.propTypes = propTypes;
PathListView.defaultProps = defaultProps;

var BaseRouteMapper = require('./BaseRouteMapper');

class Route extends BaseRouteMapper {

  constructor(params) {
    super();
    params = params || {};
    this.params = params;
  }

  get title() {
    return '轨迹';
  }

  renderLeftButton(route, navigator, index, navState) {
    return this._renderBackButton(route, navigator, index, navState);
  }

  renderScene() {
    return (
      <PathListView {...this.params}/>
    );
  }
}

module.exports = Route;
