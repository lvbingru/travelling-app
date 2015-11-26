var React = require('react-native');
var {
    StyleSheet,
    Text,
    Image,
    AlertIOS,
    View,
    Component,
    TouchableOpacity,
    ListView,
    TouchableHighlight,
    Navigator,
    TabBarIOS,
    StatusBarIOS,
    NativeModules
} = React;

var icons = require('./icons');
var Icon = require('react-native-vector-icons/Ionicons');
var Navbars = require('./Navbars');
var SpringBoard = NativeModules.SpringBoard;
var ActivityList = require('./Activity');
var Space = require('./Space');
var JourneyTab = require('./JourneyTab');
var PlusMenu = require('./PlusMenu');
var FillActivityBrief = require('./FillActivityBrief');
var FriendsTab = require('./FriendsTab');
var RecordJourneyChooseActivity = require('./RecordJourneyChooseActivity');

console.log(icons.tabActivity);

function emptyFunction() {}

var HomePage = React.createClass({
    statics: {
        title: '<TabBarIOS>',
        description: 'Tab-based navigation.',
    },

    displayName: 'HomePage',

    getInitialState: function() {
        return {
            selectedTab: 'activities',
            notifCount: 0,
            presses: 0,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            loaded: false
        };
    },

    componentDidMount: function() {
        this.props.changeRoute(this.refs[this.state.selectedTab].route);
    },

    gotoIM: function() {
        SpringBoard.gotoIM(function() {
            console.log('goto IM', 'done!');
        });
    },

    _renderContent: function(color: string, pageText: string, num ? : number) {
        return (
            <View style={[style.rootContainer, {backgroundColor: color}]}>
                {this.renderHeader(pageText)}
                <Text style={style.text}>{pageText}</Text>
                <Text style={style.text}>{num} re-renders of the {pageText}</Text>
                <Button onClick={this.gotoIM}>IM</Button>
            </View>
        );
    },

    onTouch: function(data) {
        this.props.navigator.push({
            name: 'NextPage',
            index: 1,
            id: data.id,
            title: data.title,
            content: data.content,
            component: NextPage,
        });
    },

    renderMovie: function(data) {
        return (
            <TouchableHighlight onPress={() => {this.onTouch(data)}} underlayColor="#efefef">
              <View style={styleListView.container}>
                <View style={styleListView.rightContainer}>
                  <Text style={styleListView.title}>{data.title}</Text>
                  <Text style={styleListView.content}>{data.content}</Text>
                </View>
              </View>
            </TouchableHighlight>
        );
    },

    renderHeader: function(title) {
        return (
            <View style={style.headerContainer}>
                <Text style={style.header}>{title}</Text>
            </View>
        )
    },

    _onTabSelect: function(tab) {
        this.setState({
            selectedTab: tab
        }, function() {
            this.props.changeRoute(this.refs[tab].route);
        }.bind(this))
    },

    _onPlusResult: function(result) {
        if (result === 'activity') {
            this.props.navigator.push(new FillActivityBrief);
        } else if (result === 'journey') {
            this.props.navigator.push(new RecordJourneyChooseActivity());
        }
    },

    _onPlusDismiss: function() {
        console.log('modal dismiss');
    },

    _popPlusMenu: function() {
        var view = (
            <PlusMenu 
                onDismiss={this._onPlusDismiss} 
                onResult={this._onPlusResult}/>
        );
        this.props.openModal(view);
    },

    render: function() {
        var containerStyles = [styles.container, this.props.style];
        if (this.state.selectedTab === 'space') {
            containerStyles.push({
                paddingTop: 0
            });
        }

        return (
          <View style={containerStyles}>
            <TabBarIOS barTintColor="#fff">
              <TabBarIOS.Item
                title="活动"
                icon={{uri: 'icon-tab-activity', scale: 2}}
                selectedIcon={{uri: 'icon-tab-activity-active', scale: 2}}
                selected={this.state.selectedTab === 'activities'}
                onPress={() => this._onTabSelect('activities')}>

                <ActivityList
                    ref="activities" 
                    navigator={this.props.navigator}/>

              </TabBarIOS.Item>

              <TabBarIOS.Item
                title="游记"
                icon={{uri: 'icon-tab-journey', scale: 2}}
                selectedIcon={{uri: 'icon-tab-journey-active', scale: 2}}
                selected={this.state.selectedTab === 'journeys'}
                onPress={() => this._onTabSelect('journeys')}>

                  <JourneyTab 
                    ref="journeys" 
                    navigator={this.props.navigator}/>
                    
              </TabBarIOS.Item>

              <TabBarIOS.Item
                onPress={this._popPlusMenu}
                title=""
                icon={{uri: 'icon-tab-plus', scale: 2}}>
              </TabBarIOS.Item>

              <TabBarIOS.Item
                title="朋友"
                selected={this.state.selectedTab === 'friends'}
                icon={{uri: 'icon-tab-friends', scale: 2}}
                selectedIcon={{uri: 'icon-tab-friends-active', scale: 2}}>

                <FriendsTab ref="friends" navigator={this.props.navigator}/>

              </TabBarIOS.Item>
              
              <TabBarIOS.Item
                title="我的"
                icon={{uri: 'icon-tab-space', scale: 2}}
                selectedIcon={{uri: 'icon-tab-space-active', scale: 2}}
                selected={this.state.selectedTab === 'space'}
                onPress={() => this._onTabSelect('space')}>

                <Space 
                  ref="space" 
                  navigator={this.props.navigator}/>

              </TabBarIOS.Item>
            </TabBarIOS>
          </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        backgroundColor: '#0087fa',
        flex: 1
    },
    navBarTransparent: {
        opacity: 0
    }
});

var BaseRouteMapper = require('./BaseRouteMapper');

class HomePageRoute extends BaseRouteMapper {

    constructor(navigator) {
        super();
        this._navigator = navigator;
    }

    get title() {
        return this._route ? this._route.title : '';
    }

    get style() {
        return this._route ? this._route.style : {};
    }

    renderLeftButton(route, navigator, index, navState) {
        return this._route &&
            this._route.renderLeftButton(route, navigator, index, navState);
    }

    renderRightButton(route, navigator, index, navState) {
        return this._route &&
            this._route.renderRightButton(route, navigator, index, navState);
    }

    renderTitle(route, navigator, index, navState) {
        return this._route &&
            this._route.renderTitle(route, navigator, index, navState);
    }

    _changeRoute(route) {
        if (this._route === route) {
            return;
        }

        this._route = route;
        this._navigator.forceUpdate();
    }

    renderScene(navigator) {
        return (
            <HomePage 
                navigator={navigator} 
                changeRoute={this._changeRoute.bind(this)}/>
        );
    }
}

module.exports = HomePageRoute;
