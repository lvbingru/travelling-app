var React = require('react-native');

var  {
	View,
	StyleSheet,
	Text,
	Image,
	TouchableOpacity,
	ScrollView,
	Dimensions,
	PixelRatio,
	ListView
} = React;

var icons = require('./icons');
var su = require('./styleUtils');
var stylesVar = require('./stylesVar');

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var FriendSpaceGallery = require('./FriendSpaceGallery');

var FriendSpace = React.createClass({
	getInitialState: function() {
		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		return {
			isFriend: true,
			dataBlob: [],
			dataSource: ds.cloneWithRows([]),
			length: 0,
			detailDatas: []
		}
	},

	componentDidMount: function() {
		var dataBlob = [icons.avatar, icons.avatar, icons.avatar, icons.avatar];
		var detailDatas = [{
			publishDate: '2015-08-02 13:48',
			image: icons.avatar,
			content: '活动标题'
		}, {
			publishDate: '2015-08-02 13:48',
			image: icons.avatar,
			content: '活动标题'
		}];

		this.setState({
			dataBlob: dataBlob,
			dataSource: this.state.dataSource.cloneWithRows(dataBlob),
			length: dataBlob.length,
			detailDatas: detailDatas
		})
	},

	_renderRow: function(rowData) {
		return (
			<Image source={rowData} style={styles.photoCell}
				resizeMode="cover" />
		);
	},

	_renderSeparator: function(sectionID, rowID) {
		if (rowID == this.state.length - 1) {
			return null;
		}

		return (
			<View style={styles.separator}></View>
		);
	},

	_renderDetail: function() {
		if (!this.state.isFriend) {
			return null;
		}

		return (
			<View style={styles.detailView}>
				{this.state.detailDatas.map(function(item, index) {
						return (
							<View style={styles.itemDetailView}>
								<View style={styles.detailDate}>
									<Image style={styles.detailDateImage} source={icons.calendarGreen} />
									<Text style={styles.detailDateText}>{item.publishDate}</Text>
								</View>
								<View style={styles.detailContent}>
									<View style={styles.detailLine}></View>
									<View style={styles.detailContentView}>
										<Image style={styles.detailContentImage} source={item.image} />
										<View style={styles.detailContentInfoView}>
											<Text style={styles.detailContentInfoText}>{item.content}</Text>
										</View>
									</View>
								</View>
							</View>
						);
				})}
			</View>
		);
	},	

	_showPhotos: function() {
		this.props.navigator.push(new FriendSpaceGallery());
	},

	render: function() {
		return (
			<View style={styles.container}>
				<ScrollView style={styles.scrollContainer}>
					<Image style={styles.banner} source={icons.spaceHeader} resizeMode='cover'/>
					<View style={styles.user}>
						<Image style={styles.avatar} source={icons.avatar}></Image>
						<Text style={styles.username}>叶子</Text>
						<Image source={icons.levelsBg} resizeMode="contain" style={{height: 16}}>
                  			<Text style={styles.levels}>等级1</Text>
                		</Image>
					</View>
					<View style={styles.activity}>
						<View style={styles.activityItem}>
							<Text style={[styles.activityText, styles.activityBlue]}>21</Text>
							<Text style={styles.activityInfo}>参加活动次数</Text>
						</View>
						<View style={styles.verticalLine}></View>
						<View style={styles.activityItem}>
							<Text style={[styles.activityText, styles.activityOrange]}>30</Text>
							<Text style={styles.activityInfo}>组织活动次数</Text>
						</View>
						<View style={styles.verticalLine}></View>
						<View style={styles.activityItem}>
							<Text style={[styles.activityText, styles.activityGreen]}>132</Text>
							<Text style={styles.activityInfo}>发过游记</Text>
						</View>
					</View>
					<View style={styles.photos}>
						<Text style={styles.photoText}>相册</Text>
						<ListView style={styles.photoListView} 
							horizontal={true}
							dataSource={this.state.dataSource}
							renderRow={this._renderRow}
							renderSeparator={this._renderSeparator}/>
						<TouchableOpacity style={styles.arrowView}
							onPress={this._showPhotos}>
							<Image source={icons.arrow} style={styles.arrowIcon} />
						</TouchableOpacity>
					</View>
					{this._renderDetail()}
				</ScrollView>
				<TouchableOpacity style={styles.bottomView}>
					<Text style={styles.bottomText}>添加好友</Text>
				</TouchableOpacity>
			</View>
		);
	}
});

function avatarStyle() {
    var size = deviceHeight <= 568 ? 48 : 64;
    var border = deviceHeight <= 568 ? 2 : 3
    return {
        ...su.size(size),
            borderRadius: size / 2,
            marginTop: -size / 2,
            borderWidth: border,
            borderColor: '#fff'
    };
}

var styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: '#f3f5f6'
	},

	itemDetailView: {
		flex: 1,
		flexDirection: 'column'
	},

	detailDate: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},

	detailDateImage: {
		width: 24,
		height: 24,
		marginRight: 10
	},

	detailDateText: {
		flex: 1,
		fontSize: 10,
		color: stylesVar('dark-mid')
	},

	detailContent: {
		flex: 1,
		flexDirection: 'row',
		height: 80
	},

	detailLine: {
		marginLeft: 12,
		height: 80,
		width: 1 / PixelRatio.get(),
		backgroundColor: stylesVar('dark-mid-light'),
		marginRight: 22
	},

	detailContentView: {
		flex: 1,
		flexDirection: 'row',
		marginTop: 5,
		marginBottom: 15,
		alignItems: 'center',
		justifyContent: 'center'
	},

	detailContentImage: {
		width: 60,
		height: 60,
		marginRight: 20
	},

	detailContentInfoView: {
		flex: 1,
		height: 60,
		justifyContent: 'center'
	},

	detailContentInfoText: {
		fontSize: 13,
		color: stylesVar('dark')
	},

	detailView: {
		marginHorizontal: 20,
		marginTop: 20,
		flex: 1,
		flexDirection: 'column'
	},

	bottomText: {
		fontSize: 16,
		color: stylesVar('blue')
	},

	bottomView: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		height: 50,
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderTopWidth: 1 / PixelRatio.get(),
		borderBottomWidth: 1 / PixelRatio.get(),
		borderColor: stylesVar('dark-light'),
		backgroundColor: '#fff'
	},

	separator: {
		height: 60,
		width: 10
	},

	photoListView: {
		marginVertical: 15,
		flex: 1
	},

	photoCell: {
		width: 60,
		height: 60
	},

	arrowView: {
		marginHorizontal: 10
	},

	arrowIcon: {
		width: 9,
		height: 15
	},

	photos: {
		marginTop: 20,
		flex: 1,
		flexDirection: 'row',
		backgroundColor: '#fff',
		borderTopWidth: 1 / PixelRatio.get(),
		borderBottomWidth: 1 / PixelRatio.get(),
		borderColor: stylesVar('dark-light'),
		height: 90,
		alignItems: 'center',
		justifyContent: 'center'
	},

	photoText: {
		width: 60,
		color: stylesVar('dark'),
		fontSize: 13,
		textAlign: 'center'
	},

	activityText: {
		flex: 1,
		height: 50,
		paddingTop: 28,
		fontSize: 22
	},

	activityInfo: {
		flex: 1,
		color: stylesVar('dark-light-slight'),
		fontSize: 10
	},	

	activityBlue: {
		color: stylesVar('blue-light')
	},

	activityOrange: {
		color: stylesVar('orange')
	},

	activityGreen: {
		color: stylesVar('green-light')
	},

	verticalLine: {
		height: 90,
		width: 1 / PixelRatio.get(),
		backgroundColor: stylesVar('dark-light')
	},

	activityItem: {
		flex: 1,
		height: 90,
		flexDirection: 'column',
		justifyContent: 'flex-end',
		alignItems: 'center'
	},

	activity: {
		flex: 1,
		flexDirection: 'row',
		borderTopWidth: 1 / PixelRatio.get(),
		borderBottomWidth: 1 / PixelRatio.get(),
		borderColor: stylesVar('dark-light'),
		backgroundColor: '#fff'
	},

	scrollContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 50,
		backgroundColor: '#f3f5f6'
	},

	banner: {
		width: deviceWidth,
		height: deviceHeight <= 568 ? 125 : 180
	},

	user: {
        alignItems: 'center',
        paddingBottom: deviceHeight <= 568 ? 15 : 25,
        backgroundColor: '#fff'
    },

    avatar: avatarStyle(),

    username: {
        fontSize: 17,
        marginVertical: 5,
    },

    levels: {
        fontSize: 10,
        lineHeight: 13,
        textAlign: 'center',
        backgroundColor: 'transparent',
        color: '#fff'
    },
});

var BaseRouteMapper = require('./BaseRouteMapper');
class Route extends BaseRouteMapper {
    get style() {
        return this.styles.navBarTransparent;
    }

    renderLeftButton(route, navigator, index, navState) {
        return this._renderBackButton(route, navigator, index, navState);
    }

    renderScene(navigator) {
        return <FriendSpace />
    }
}

module.exports = Route;