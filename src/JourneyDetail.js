var React = require('react-native');

var {
	StyleSheet,
	View,
	Image,
	Text,
	ScrollView,
	Dimensions,
	PixelRatio
} = React;

var deviceWidth = Dimensions.get('window').width;
var cellStyles = require('./journey/JourneyDetailCellStyle');

var icons = require('./icons');
var su = require('./styleUtils');
var stylesVar = require('./stylesVar');


var {
    UserInfo
} = require('./widgets');
var icons = require('./icons');

var JourneyDetail = React.createClass({
	getInitialState: function() {
		return {
			datas: [{
				publishDate: '2015-08-02 13:48',
				address: '北京',
				imageURI: 'http://f.hiphotos.baidu.com/image/pic/item/b64543a98226cffc9b70f24dba014a90f703eaf3.jpg',
				text: '',
			}, {
				publishDate: '2015-08-02 13:48',
				address: '北京',
				imageURI: 'http://f.hiphotos.baidu.com/image/pic/item/b64543a98226cffc9b70f24dba014a90f703eaf3.jpg',
				text: '当离开这个荒芜的社会，进入繁华的沙漠时，一个人的思想就变了。只有在这里，你才能感受到自己的真实，而不是被社会被世俗所束缚的自己，你的思想才能变得丰富起来。',
			}]
		}
	},

	_renderContent: function(imageURI, text) {
		if (imageURI && text) {
			return (
				<View style={[cellStyles.flex1View, {flexDirection: 'column'}]}>
					<Image source={{uri: imageURI}} 
						style={cellStyles.contentImage}
						resizeMode="cover" />
					<Text style={cellStyles.descriptionText}>{text}</Text>
				</View>
			);
		} else if (imageURI) {
			return (
				<View style={styles.flex1View}>
					<Image source={{uri: imageURI}} 
						style={cellStyles.contentImage}
						resizeMode="cover" />
				</View>
			);
		} else if (text) {
			return (
				<View style={styles.flex1View}>
					<Text style={cellStyles.descriptionText}>{text}</Text>
				</View>
			);
		}
	},

	render: function() {
		return (
			<ScrollView style={styles.scrollContainer}>
				<Image source={{uri: 'http://f.hiphotos.baidu.com/image/pic/item/b64543a98226cffc9b70f24dba014a90f703eaf3.jpg'}}
					style={styles.banner}>
					<Image style={styles.bgGray} source={icons.bgGray}>
						<Text style={styles.titleView}>背景图片标题</Text>
						<View style={styles.userView}>
							<UserInfo 
                        		style={styles.info}
                        		username='Komi'
                        		publishDate='2015-09-09 11:12'
                        		avatar={icons.avatar}/>
                        	<View style={styles.numberView}>
                        		<Image style={styles.viewIcon} source={icons.viewWhite} />
                        		<Text style={styles.viewText}>3219</Text>
                        		<Image style={styles.starIcon} source={icons.starWhite} />
                        		<Text style={styles.viewText}>19</Text>
                        	</View>
						</View>
					</Image>
				</Image>
				<Image source={icons.traceImage}
					style={styles.traceImage} />
				<View style={styles.traceView}>
					<View style={styles.traceSubView}>
						<Image source={icons.calendarGray} style={styles.traceIcon}/>
						<View style={styles.traceInfoView}>
							<Text style={styles.traceInfoTitle}>时间：12天</Text>
							<Text style={styles.traceInfoContent}>09月01日 - 09月12日</Text>
						</View>
					</View>
					<View style={styles.separator}></View>
					<View style={styles.traceSubView}>
						<Image source={icons.traceGray} style={styles.traceIcon}/>
						<View style={styles.traceInfoView}>
							<View style={styles.traceInfoKMView}>
								<Text style={styles.traceInfoTitle}>历程：1568</Text>
								<Text style={styles.KMstyle}>KM</Text>
							</View>
							<Text style={styles.traceInfoContent}>北京 - 丽江 - 雪山</Text>
						</View>
					</View>
				</View>
				<Text style={styles.contentView}>
					当离开这个荒芜的社会，进入繁华的沙漠时，一个人的思想就变了。只有在这里，你才能感受到自己的真实，而不是被社会被世俗所束缚的自己，你的思想才能变得丰富起来。
				</Text>
				<View style={styles.separator}></View>
				<View style={styles.height20}></View>
				{this.state.datas.map(function(item, index) {
					return (
						<View style={cellStyles.cellView}>
							<View style={cellStyles.flex1View}>
								<Image source={icons.calendarGreen}
									style={cellStyles.calendarIcon} />
								<Text style={styles.textViewGray}>{item.publishDate}</Text>
							</View>
							<View style={[cellStyles.verticalLine, cellStyles.verticalLine10]}></View>
							<View style={cellStyles.flex1View}>
								<Image source={icons.markBlue} style={cellStyles.calendarIcon} />
								<Text style={styles.textViewBlue}>{item.address}</Text>
							</View>
							<View style={[cellStyles.verticalLine, cellStyles.verticalLine10]}></View>
							{this._renderContent(item.imageURI, item.text)}
							<View style={[cellStyles.verticalLine, cellStyles.verticalLine20]}></View>
						</View>
					);
				}.bind(this))}
			</ScrollView>	
		);
	}
});

var styles = StyleSheet.create({
	contentView: {
		flex: 1,
		paddingHorizontal: 15,
		paddingVertical: 10,
		fontSize: 13,
		lineHeight: 20,
		color: stylesVar('dark-light-little'),
		backgroundColor: '#fff'
	},

	textViewGray: {
		flex: 1,
		fontSize: 11,
		color: stylesVar('dark-mid'),
		marginLeft: 6
	},

	textViewBlue: {
		flex: 1,
		fontSize: 11,
		color: stylesVar('blue'),
		marginLeft: 6
	},

	height20: {
		height: 20,
		flex: 1
	},

	separator: {
		flex: 1,
		height: 1 / PixelRatio.get(),
		backgroundColor: stylesVar('dark-light')
	},

	KMstyle: {
		color: stylesVar('blue'),
		fontSize: 10
	},

	traceInfoKMView: {
		flex: 1,
		flexDirection: 'row'
	},

	traceInfoTitle: {
		flexDirection: 'row',
		color: stylesVar('blue'),
		fontSize: 15,
		marginBottom: 5
	},

	traceInfoContent: {
		flex: 1,
		color: stylesVar('dark-mid'),
		fontSize: 11
	},

	traceSubView: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 13
	},

	traceInfoView: {
		flex: 1,
		flexDirection: 'column'
	},

	traceIcon: {
		width: 32,
		height: 32,
		marginLeft: 5,
		marginRight: 10
	},

	traceImage: {
		width: deviceWidth,
		height: 120
	},

	traceView: {
		flex: 1,
		flexDirection: 'column',
		borderTopWidth: 1 / PixelRatio.get(),
		borderBottomWidth: 1 / PixelRatio.get(),
		borderColor: stylesVar('dark-light'),
		paddingLeft: 10,
		backgroundColor: '#fff'
	},

	viewIcon: {
		width: 20,
		height: 12
	},

	starIcon: {
		width: 18,
		height: 18,
		marginLeft: 15
	},

	viewText: {
		fontSize: 10,
		color: '#fff',
		marginLeft: 5
	},

	bgGray: {
		justifyContent: 'flex-end',
		width: deviceWidth,
		height: 80,
		paddingHorizontal: 15
	},

	scrollContainer: {
		backgroundColor: '#f3f5f6'
	},

	banner: {
		height: 180,
        width: deviceWidth,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.3)'
	},

	titleView: {
		height: 25,
		fontSize: 25,
		color: '#fff'
	},

	userView: {
		height: 45,
		flexDirection: 'row'
	},

	info: {
		flex: 1
	},

	numberView: {
		flex: 1,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'flex-end'
	}
});

var BaseRouteMapper = require('./BaseRouteMapper');
class Route extends BaseRouteMapper {
    constructor() {
        super()
    }

    renderLeftButton(route, navigator, index, navState) {
        function callback() {
            this.refreshDetail && this.refreshDetail(this.activity.id);
            navigator.pop();
        }
        return this._renderBackButton(route, navigator, index, navState, callback.bind(this));
    }

    renderRightButton(route, navigator, index, navState) {
        var {
            wrap,
            navBarRightButton
        } = this.styles;

        var styles = StyleSheet.create({
            iconShare: {
                ...su.size(14, 20)
            },

            navbarRight: {
                height: 44,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center'
            },

            navbarText: {
                fontSize: 10,
                color: stylesVar('white'),
                marginRight: 15,
                marginLeft: 5
            },
        });

        var starIcon = this.starred ? icons.star : icons.starsOpposite;

        return (
            <View style={[wrap, navBarRightButton]}>
                <View style={styles.navbarRight}>
                    <Image style={styles.iconShare} source={icons.share}/>
                </View>
            </View>
        );
    }

    get style() {
        return this.styles.navBarTransparent;
    }

    renderScene(navigator) {
        return <JourneyDetail />;
    }
}

module.exports = Route;
