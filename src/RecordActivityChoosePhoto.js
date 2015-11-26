var React = require('react-native');
var {
	StyleSheet,
	View,
	Text,
	TouchableOpacity
} = React;

var styles = StyleSheet.create({
	tabView: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},

	subTabView: {
		flex: 1,
		borderBottomWidth: 2,
		borderColor: 'transparent',
		paddingTop: 5,
		paddingBottom: 7,
		paddingHorizontal: 8
	},

	tab: {
		color: '#fff',
		fontSize: 13
	},

	activeTab: {
		borderColor: '#fff'
	}
});

var CameraRollScene = require('./LocalSeveralPhotoPicker');

var BaseRouteMapper = require('./BaseRouteMapper');
class Route extends BaseRouteMapper {
	constructor(datas) {
        super();
        
        this.activeTab = 0;
        this.nextStepParent = datas && datas.nextStep;
    }

    renderLeftButton() {
        return this._renderBackButton.apply(this, arguments);
    }

    pressTab(index, navigator) {
    	this.activeTab = index;
    	navigator.forceUpdate();
    }

    renderTitle(route, navigator, index, navState) {
    	var tab1Style = styles.subTabView;
    	var tab2Style = styles.subTabView;

    	if (this.activeTab === 0) {
    		tab1Style = [styles.subTabView, styles.activeTab];
    	} else {
    		tab2Style = [styles.subTabView, styles.activeTab];
    	}

    	return (
    		<View style={styles.tabView}>
    			<TouchableOpacity activeOpacity={1}
    				style={tab1Style}
    				onPress={this.pressTab.bind(this, 0, navigator)}>
    				<Text style={styles.tab}>本地相册</Text>
    			</TouchableOpacity>
    			<TouchableOpacity activeOpacity={1} 
    				style={tab2Style}
    				onPress={this.pressTab.bind(this, 1, navigator)}>
    				<Text style={styles.tab}>活动相册</Text>
    			</TouchableOpacity>
    		</View>
    	);
    }

    nextStep(datas, navigator) {
        var RecordActivityEdit = require('./RecordActivityEdit');
    	navigator.push(new RecordActivityEdit(datas));
    }

    renderScene(navigator) {
    	return (
    		<CameraRollScene route={this} nextStep={this.nextStepParent || this.nextStep} nextText='下一步'/>
    	);
    }
}

module.exports = Route;