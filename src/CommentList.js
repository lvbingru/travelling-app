var React = require('react-native');

var {
	View,
	Text,
	Image,
	ListView,
	TouchableOpacity,
	ActivityIndicatorIOS,
	PixelRatio,
	StyleSheet,
	Dimensions
} = React;

var su = require('./styleUtils');
var RefreshableListView = require('react-native-refreshable-listview');
var stylesVar = require('./stylesVar'); 
var activityApi = require('./api').activity;
var LightBox = require('./LightBox');
var AddComment = require('./AddComment');
var icons = require('./icons');

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

var iconImageSize = (deviceWidth - 110) / 3;

var CommentList = React.createClass({
	getInitialState: function() {
		return {
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			})
		}
	},

	componentDidMount: function() {
		activityApi.fetchComments({
			id: this.props.id
		}).then(function(datas) {
			datas = this.state.dataSource.cloneWithRows(datas);

			this.setState({
				dataSource: datas
			});
		}.bind(this), function(e) {
			console.log(e);
		});
	},

	_renderHeaderWrapper: function(refreshingIndicator) {
        if (refreshingIndicator == null) {
            return null;
        }

        var styles = {
            wrap: {
                flex: 1,
                paddingVertical: 15,
                alignItems: 'center',
                justifyContent: 'center'
            },

            loading: {
                fontSize: 9,
                marginBottom: 5,
                color: '#777'
            }
        }

        return (
            <View style={styles.wrap}>
          		<Text style={styles.loading}>刷新活动</Text>
          		<ActivityIndicatorIOS size="small"/>
        	</View>
        );
    },

    _renderSeparator: function(sectionID, rowID, adjacentRowHighlighted) {
    	var styles = {
    		height: 1 / PixelRatio.get(),
    		backgroundColor: stylesVar('dark-light'),
    		marginLeft: 50
    	}
        if (rowID == this.state.dataSource.getRowCount() - 1) {
            return null;
        } else {
            return <View style={styles}/>;
        }
    },

    _loadMore: function() {

    },

    _renderRow: function(data) {
    	return (
    		<CommentItem data={data} navigator={this.props.navigator} fresh={this._onRefresh}/>
    	);
    },

    _onRefresh: function() {

    },

    addComment: function() {
    	this.props.navigator.push(new AddComment({
    		id: this.props.id
    	}))
    },

	render: function() {
		return (
			<View style={styles.container}>
				<RefreshableListView
					renderHeaderWrapper={this._renderHeaderWrapper}
					renderSeparator={this._renderSeparator}
					dataSource={this.state.dataSource}
					onEndReached={this._loadMore}
					renderRow={this._renderRow}
					loadData={this._onRefresh} >
				</RefreshableListView>
				<View style={styles.bottomBar}>
					<TouchableOpacity onPress={this.addComment}>
						<Text style={styles.bottomText}>发表评论</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
});

var CommentItem = React.createClass({
	starHandle: function() {
		//todo
		this.props.fresh();
	},

	renderLikeImage: function() {
		var data = this.props.data;
		if (data.isLike === '1') {
			return <Image style={styles.starIcon} source={icons.likeRed}/>
		} else {
			return (
				<TouchableOpacity onPress={this.starHandle}>
					<Image style={styles.starIcon} source={icons.likeGray}/>
				</TouchableOpacity>
			);
		}
	},

	render: function() {
		var data = this.props.data;
		
		return (
			<View style={styles.row}>
				<View style={styles.user}>
					<Image source={data.user && data.user.avatar ? {uri: data.user.avatar}: icons.avatarPlaceholder} 
						style={styles.avatar}/>
					<View style={styles.username}>
						<Text style={styles.usernameText}>{data.user && data.user.username}</Text>
					</View>
					<Text style={styles.starText}>{data.star}</Text>
					{this.renderLikeImage()}
				</View>
				<Text style={styles.info}>{data.info}</Text>	
				<LightBox imagesArray={data.images} navigator={this.props.navigator}/>
				{data.images.length !== 0 && <View style={styles.separator}></View>}
				<Text style={styles.publishDate}>{data.publishDate}</Text>
			</View>
		);
	}
});

var styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: stylesVar('white'),
		marginTop: 64
	},

	separator: {
		flex: 1,
		height: 11
	},

	row: {
		flex: 1,
		marginHorizontal: 15,
		marginVertical: 15,
		flexDirection: 'column'
	},

	user: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		height: 25
	},

	avatar: {
		...su.size(25, 25),
		borderRadius: 12.5
	},

	username: {
		flex: 1,
		marginLeft: 10,
		height: 25,
		justifyContent: 'center'
	},

	usernameText: {
		color: stylesVar('blue'),
		fontSize: 15,
		fontWeight: '100'
	},
	
	starText: {
		fontWeight: '100',
		fontSize: 11,
		color: stylesVar('dark-mid'),
		marginRight: 5
	},

	starIcon: {
		...su.size(12),
	},

	navBarLeftButton: {
        ...su.size(17, 15),
        marginLeft: 10,
    },

    info: {
    	flex: 1,
    	flexDirection: 'column',
    	marginLeft: 35,
    	marginBottom: 11,
    	color: stylesVar('dark'),
    	fontSize: 15,
    	lineHeight: 18
    },

    publishDate: {
    	flex: 1,
    	flexDirection: 'column',
    	marginLeft: 35,
    	justifyContent: 'center',
    	color: stylesVar('dark-mid-light'),
    	fontWeight: '100',
    	fontSize: 11
    },

    bottomBar: {
    	position: 'absolute',
    	bottom: 0,
    	right: 0,
    	left: 0,
    	height: 50,
    	backgroundColor: stylesVar('white'),
    	borderWidth: 1 / PixelRatio.get(),
    	borderColor: stylesVar('dark-light'),
    	flex: 1,
    	flexDirection: 'row',
    	justifyContent: 'center',
    	alignItems: 'center'
    },

    bottomText: {
    	color: stylesVar('blue'),
    	fontSize: 16,
    	fontWeight: '100'
    }
});

var BaseRouteMapper = require('./BaseRouteMapper');

class CommentListRoute extends BaseRouteMapper {
	constructor(data) {
		super()

		this.id = data.id;
		this.count = data.count;
	}

	renderLeftButton(route, navigator, index, navState) {
        return this._renderBackButton(route, navigator, index, navState);
	}

    get style() {
        return this.styles.navBar;
    }

	get title() {
		return '评论(' + this.count + ')';
	}

	renderScene(navigator) {
		return <CommentList id={this.id} navigator={navigator} />
	}
}

module.exports = CommentListRoute;