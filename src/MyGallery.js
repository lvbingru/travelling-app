var React = require('react-native');

var {
	StyleSheet,
	View,
	Image,
	ScrollView,
	Dimensions,
	TouchableOpacity,
	Text
} = React;

var deviceWidth = Dimensions.get('window').width;
var cellWidth = (deviceWidth - 15) / 2 - 15; 

var stylesVar = require('./stylesVar');
var icons = require('./icons');
var MyGalleryDetail = require('./MyGalleryDetail');

var MyGallery = React.createClass({
	getInitialState: function() {
		return {
			datas: []
		}
	},

	componentDidMount: function() {
		this.updateDatas();
	},

	updateDatas: function() {
		this.setState({
			datas: [{
				image: icons.page1,
				title: '活动标题',
				total: 12
			}, {
				image: icons.page1,
				title: '活动标题',
				total: 112
			}, {
				image: icons.page1,
				title: '活动标题',
				total: 12
			}, {
				image: icons.page1,
				title: '活动标题',
				total: 12
			}, {
				image: icons.page1,
				title: '活动标题',
				total: 123
			}, {
				image: icons.page1,
				title: '活动标题',
				total: 234
			}, {
				image: icons.page1,
				title: '活动标题',
				total: 12
			}]
		});
	},

	render: function() {
		return (
			<View style={styles.container}>
				<ScrollView contentContainerStyle={styles.scrollContainer}>
					{this.state.datas.map(function(item, index) {
						return (
							<TouchableOpacity onPress={() => this.props.navigator.push(new MyGalleryDetail())}
								style={styles.itemView}
								activeOpacity={0.9}>
								<Image style={styles.imageView} source={item.image} resizeMode='cover'>
									<Text style={styles.totalStyle}>{item.total}</Text>
								</Image>
								<Text style={styles.titleText}>{item.title}</Text>
								<Image style={styles.decoration} source={icons.photosDecoration} resizeMode='cover'/>
							</TouchableOpacity>
						);
					}.bind(this))}
				</ScrollView>
			</View>
		);
	}
});

var styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 64,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: '#f3f5f6'
	},

	totalStyle: {
		marginTop: 10,
		marginRight: 10,
		paddingVertical: 4,
		paddingHorizontal: 5,
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
		fontSize: 11,
		color: '#fff'
	},

	decoration: {
		width: cellWidth,
		height: 5
	},

	titleText: {
		paddingVertical: 15,
		paddingLeft: 10,
		fontSize: 13,
		color: stylesVar('dark-light-little')
	},

	imageView: {
		width: cellWidth,
		height: cellWidth,
		flex: 1,
		alignItems: 'flex-end'
	},

	itemView: {
		width: cellWidth,
		marginRight: 15,
		marginBottom: 15,
		backgroundColor: '#fff'
	},

	scrollContainer: {
		flexDirection: 'row',
		paddingTop: 15,
		paddingLeft: 15,
		flexWrap: 'wrap'
	}
});

var BaseRouteMapper = require('./BaseRouteMapper');
class Route extends BaseRouteMapper {
	constructor() {
        super();
    }

    renderLeftButton() {
        return this._renderBackButton.apply(this, arguments);
    }

    get title() {
    	return '我的活动相册';
    }

    renderScene() {
    	return (
    		<MyGallery />
    	);
    }
}

module.exports = Route;