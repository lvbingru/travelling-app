var React = require('react-native');

var {
	StyleSheet,
	TouchableOpacity,
	View,
	Text,
	Image,
	ScrollView,
	Dimensions
} = React;

var deviceWidth = Dimensions.get('window').width;
var RecordJourneyChoosePhoto = require('./RecordJourneyChoosePhoto'); 

var RecordJourneyChooseActivity = React.createClass({
	getInitialState: function() {
		return {
			datas: []
		}
	},

	_gotoNext: function() {
		this.props.navigator.push(new RecordJourneyChoosePhoto());
	},	

	componentDidMount: function() {
		this.setState({
			datas: [{
				title: 'GO!一起去草原撒野',
				date: '9月1日-9月12日'
			}, {
				title: 'GO!一起去草原撒野',
				date: '9月1日-9月12日'
			}, {
				title: 'GO!一起去草原撒野',
				date: '9月1日-9月12日'
			}]
		});
	},

	render: function() {
		return (
			<View style={styles.container}>
				<ScrollView style={styles.scrollContainer}>
					{this.state.datas.map(function(item, index) {
						return (
							<TouchableOpacity activeOpacity={0.9}
								onPress={this._gotoNext}>
								<Image source={{uri: 'http://f.hiphotos.baidu.com/image/pic/item/b64543a98226cffc9b70f24dba014a90f703eaf3.jpg'}}
									style={styles.imageBg}>
									<Text style={styles.titleText}>{item.title}</Text>
									<Text style={styles.dateText}>{item.date}</Text>
								</Image>
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
		flex: 1,
		backgroundColor: '#f3f5f6'
	},

	scrollContainer: {
		position: 'absolute',
		top: 64,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: '#f3f5f6'
	},

	imageBg: {
		width: deviceWidth,
		height: 180,
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center'
	},

	titleText: {
		color: '#fff',
		fontSize: 22,
		marginBottom: 11,
		backgroundColor: 'transparent'
	},

	dateText: {
		color: '#fff',
		fontSize: 13,
		backgroundColor: 'transparent'
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
    	return '选择一次活动';
    }

    renderRightButton(route, navigator, index, navState) {
        var styles = StyleSheet.create({
            rightView: {
            	flex: 1,
            	justifyContent: 'center',
            	alignItems: 'center'
            },

            rightText: {
            	fontSize: 13,
            	color: '#fff',
            	marginRight: 15
            }
        });

        return (
            <TouchableOpacity style={styles.rightView} onPress={() => navigator.push(new RecordJourneyChoosePhoto())}>
                <Text style={styles.rightText}>跳过</Text>
            </TouchableOpacity>
        );
    }

    renderScene() {
    	return (
    		<RecordJourneyChooseActivity />
    	);
    }
}

module.exports = Route;