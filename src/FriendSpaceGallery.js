var React = require('react-native');

var {
	StyleSheet,
	View,
	Image,
	Text,
	ScrollView,
	Dimensions
} = React;

var deviceWidth = Dimensions.get('window').width;
var imageLength = (deviceWidth - 5) / 4 - 5;
var icons = require('./icons');
var stylesVar = require('./stylesVar');

var FriendSpaceGallery = React.createClass({
	getInitialState: function() {
		return {
			datas: []
		}
	},

	componentDidMount: function() {
		this.setState({
			datas: [
				{
					title: '活动标题',
					imageArray: [icons.avatar, icons.avatar, icons.avatar, icons.avatar, icons.avatar, icons.avatar]
				},
				{
					title: '活动标题',
					imageArray: [icons.avatar, icons.avatar]
				},
				{
					title: '活动标题',
					imageArray: [icons.avatar, icons.avatar, icons.avatar, icons.avatar, icons.avatar, icons.avatar]
				},
				{
					title: '活动标题',
					imageArray: [icons.avatar, icons.avatar, icons.avatar, icons.avatar, icons.avatar, icons.avatar]
				}
			]
		});
	},

	render: function() {
		return (
			<ScrollView style={styles.scrollContainer}>
				{this.state.datas.map(function(item, index) {
					return (
						<View style={styles.itemView}>
							<Text style={styles.itemTitle}>{item.title}</Text>
							<View style={styles.imageContainer}>
								{item.imageArray.map(function(subItem, subIndex) {
									return (
										<Image source={subItem} style={styles.itemImage}/>
									)
								})}
							</View>
						</View>
					);
				})}
			</ScrollView>
		);
	}
});

var styles = StyleSheet.create({
	scrollContainer: {
		position: 'absolute',
		top: 64,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: '#f3f5f6'
	},

	itemView: {
		flex: 1,
		backgroundColor: '#fff',
		paddingBottom: 15,
		marginBottom: 20
	},

	itemTitle: {
		fontSize: 13,
		paddingHorizontal: 15,
		marginVertical: 15,
		color: stylesVar('dark')
	},

	imageContainer: {
		marginLeft: 5,
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap'
	},

	itemImage: {
		width: imageLength,
		height: imageLength,
		marginRight: 5,
		marginBottom: 5
	}
});

var BaseRouteMapper = require('./BaseRouteMapper');
class Route extends BaseRouteMapper {
	constructor() {
		super();
	}

	renderLeftButton(route, navigator, index, navState) {
		return this._renderBackButton(route, navigator, index, navState);
	}

	get title() {
		return '全部相册';
	}

	renderScene(navigator) {
		return <FriendSpaceGallery />
	}
}

module.exports = Route;