var React = require('react-native');
var _ = require('underscore');
var async = require('async');

var {
	StyleSheet,
	TouchableOpacity,
	Text,
	TextInput,
	PixelRatio,
	Image,
	View,
	Dimensions,
	ListView
} = React;

var icons = require('./icons');
var stylesVar = require('./stylesVar');
var MutilineInput = require('./MutilineInput');
var deviceWidth = Dimensions.get('window').width;
var RecordActivityChoosePhoto = require('./RecordActivityChoosePhoto');

var RecordActivity = React.createClass({
	getInitialState: function() {
		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => {return r1 !== r2}});
		var dataBlob = this.props.dataBlob;
		var datas = [];
		dataBlob.map(function(item, index) {
			var photo = item.photo;

			datas.push({
				publishDate: this._changeTimestampToDate(photo.timestamp),
				location: photo.location,
				imageURI: photo.image.uri
			});
		}.bind(this));
		return {
			title: "",
			content: "",
			dataBlob: datas,
			dataSource: ds.cloneWithRows(datas)
		}
	},

	_transLocation: function(latitude, longitude) {
		return fetch('http://pelias.mapzen.com/reverse?lat=' + latitude + '&lon=' + longitude).then(function(response) {
			return response.text();
		});
	},

	getActivity: function() {
		return {
			title: this.state.title,
			content: this.state.content,
			dataBlob: this.state.dataBlob
		}
	},

	componentDidMount: function() {
		var datas = _.clone(this.state.dataBlob);
		
		datas.map(function(item, index) {
			if (item.location.latitude && item.location.longitude) {
				this._transLocation(item.location.latitude, item.location.longitude).then(function(results) {
					results = JSON.parse(results);
					var address = results.features[0].properties.text;

					var data = _.extend({}, item, {
						address: address
					})
					var dataBlob = _.clone(this.state.dataBlob);
					dataBlob[index] = data;

					this.setState({
						dataBlob: dataBlob,
						dataSource: this.state.dataSource.cloneWithRows(dataBlob)
					})
				}.bind(this), function(e) {
					console.error(e);
				});
			}	
		}.bind(this));
	},

	editContent: function() {
		this.props.navigator.push(new MutilineInput(this.state.content, this.setContent, '编辑'));
	},

	setContent: function(content) {
		this.setState({content});
	},

	_addImage: function(rowID) {
		this.setState({
			newRowIndex: rowID
		});

		this.props.navigator.push(new RecordActivityChoosePhoto(this._addImageRow));
	},	

	_changeTimestampToDate: function(timestamp) {
		var date = new Date(timestamp*1000);
		var publishDate = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
		return publishDate;
	},

	_addImageRow: function(datas, navigator) {
		var newRowIndex = this.state.newRowIndex;

		navigator.pop();
		async.map(datas, function(itemOrigin, callback) {
			var photo = itemOrigin.photo;

			var item = {
				publishDate: this._changeTimestampToDate(photo.timestamp),
				location: photo.location,
				imageURI: photo.image.uri
			};
			
			if (item.location.latitude && item.location.longitude) {
				this._transLocation(item.location.latitude, item.location.longitude).then(function(results) {
					results = JSON.parse(results);
					var address = results.features[0].properties.text;

					var data = _.extend({}, item, {
						address: address
					});

					callback(null, data);
				}.bind(this), function(e) {
					callback(e);
				});
			} else {
				callback(null, item);
			}	
		}.bind(this), function(err, results) {
			if (err) {
				return;
			}

			var dataBlob = _.clone(this.state.dataBlob);
			dataBlob.splice.apply(dataBlob, [this.state.newRowIndex, 0].concat(results));
			this.setState({
				dataBlob: dataBlob,
				dataSource: this.state.dataSource.cloneWithRows(dataBlob)
			})
		}.bind(this));
	},

	_addText: function(rowID) {
		this.setState({
			newRowIndex: rowID
		});

		this.props.navigator.push(new MutilineInput('', this._addTextRow, '编辑'));
	},

	_addTextRow: function(content) {
		var data = {
			text: content
		}

		var dataBlob = _.clone(this.state.dataBlob);
		dataBlob.splice(this.state.newRowIndex, 0, data);
		this.setState({
			dataBlob: dataBlob,
			dataSource: this.state.dataSource.cloneWithRows(dataBlob)
		});
	},

	_renderRow: function(datas, sectionID, rowID) {
		return <Cell datas={datas} rowID={rowID}
					addImage={this._addImage}
					addText={this._addText}
					setItemValue={this._setItemValue} />
	},

	_setItemValue: function(value, rowID, type) {
		var dataBlob = _.clone(this.state.dataBlob);
		var item = _.clone(dataBlob[rowID]);
		item[type] = value;
		dataBlob[rowID] = item;

		this.setState({
			dataBlob: dataBlob,
			dataSource: this.state.dataSource.cloneWithRows(dataBlob)
		})
	},

	_renderHeader: function() {
		return (
			<View style={styles.itemView}>
				<View style={styles.subItemView}>
					<Text style={styles.subItemText}>标题</Text>
					<TextInput style={styles.subItemEdit} 
						onChangeText={(title) => this.setState({title})}
						value={this.state.title} />
				</View>
				<View style={[styles.subItemView, styles.separator]}>
					<Text style={styles.subItemText}>内容</Text>
					<TouchableOpacity style={styles.subItemContentView} 
						onPress={this.editContent}>
						<Text style={styles.contentText} numberOfLines={1}>
							{this.state.content}
						</Text>
						<View style={styles.imageView}>
							<Image source={icons.arrow} 
								style={styles.iconArrow}/>
						</View>
					</TouchableOpacity>
				</View>
			</View>
		);
	},

	_renderFooter: function() {
		return (
			<Footer getRowID={() => this.state.dataBlob.length} 
				addImage={this._addImage}
				addText={this._addText}/>
		);
	},

	render: function() {
		return (
			<View style={styles.background}>
				<View style={styles.flex1View}>
					<ListView style={styles.displayView} 
						dataSource={this.state.dataSource}
						renderRow={this._renderRow}
						renderHeader={this._renderHeader}
						renderFooter={this._renderFooter}
						automaticallyAdjustContentInsets={false} />
				</View>
			</View>
		);
	}
});

var Footer = React.createClass({
	getInitialState: function() {
		return {
			adding: false
		}
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({
			adding: false
		})
	},

	render: function() {
		if (this.state.adding) {
			return (
				<View style={[styles.footerView, {height: 32}]} >
					<TouchableOpacity onPress={() => this.setState({adding: false})} activeOpacity={1}>
						<Image source={icons.dismissBg}
							style={styles.plusIcon} />
					</TouchableOpacity>
					<TouchableOpacity activeOpacity={1}>
						<Image source={icons.addRoute}
							style={styles.editImage} />
					</TouchableOpacity>
					<TouchableOpacity activeOpacity={1}
						onPress={() => this.props.addImage(this.props.getRowID())}>
						<Image source={icons.addImage}
							style={styles.editImage} />
					</TouchableOpacity>
					<TouchableOpacity activeOpacity={1}
						onPress={() => this.props.addText(this.props.getRowID())}>
						<Image source={icons.addText} style={styles.editImage} />
					</TouchableOpacity>

				</View>
			);
		} else {
			return (
				<View style={styles.footerView} >
					<TouchableOpacity 
						activeOpacity={1}
						onPress={() => this.setState({
							adding: true
						})}>
						<Image source={icons.plusBlue} style={styles.plusIcon} />
					</TouchableOpacity>
				</View>
			);
		}
		
	}
});

var Cell = React.createClass({
	getInitialState: function() {
		var datas = this.props.datas;
		return {
			publishDate: datas.publishDate,
			address: datas.address,
			imageURI: datas.imageURI,
			text: datas.text,
			adding: false
		}
	},

	componentWillReceiveProps: function(nextProps) {
		var datas = nextProps.datas;
		this.setState({
			publishDate: datas.publishDate,
			address: datas.address,
			imageURI: datas.imageURI,
			text: datas.text,
			adding: false
		});
	},

	_renderContent: function() {
		if (this.state.imageURI && this.state.text) {
			return (
				<View style={styles.flex1View}>
					<Image source={{uri: this.state.imageURI}} 
						style={styles.contentImage}
						resizeMode="cover" />
					<Text style={styles.descriptionText}>
						{this.state.text}
					</Text>
				</View>
			);
		} else if (this.state.imageURI) {
			return (
				<View style={styles.flex1View}>
					<Image source={{uri: this.state.imageURI}} 
						style={styles.contentImage}
						resizeMode="cover" />
				</View>
			);
		} else if (this.state.text) {
			return (
				<View style={styles.flex1View}>
					<Text style={styles.descriptionText}>
						{this.state.text}
					</Text>
				</View>
			);
		}
	},

	_changeRowStatus: function() {
		if (this.state.adding) {
			this.setState({
				adding: false
			});
		} else {
			this.setState({
				adding: true
			});
		}
	},

	_renderAddRow: function() {
		if (this.state.adding) {
			return (
				<View style={[styles.flex1View, {height: 32}]} >
					<TouchableOpacity onPress={this._changeRowStatus} activeOpacity={1}>
						<Image source={icons.dismissMid} style={styles.plusIcon} />
					</TouchableOpacity>
					<TouchableOpacity activeOpacity={1}>
						<Image source={icons.addRoute} style={styles.editImage} />
					</TouchableOpacity>
					<TouchableOpacity activeOpacity={1}
						onPress={() => this.props.addImage(this.props.rowID)}>
						<Image source={icons.addImage} style={styles.editImage} />
					</TouchableOpacity>
					<TouchableOpacity activeOpacity={1}
						onPress={() => this.props.addText(this.props.rowID)}>
						<Image source={icons.addText} style={styles.editImage} />
					</TouchableOpacity>
				</View>
			)
		} else {
			return (
				<View style={styles.flex1View} >
					<TouchableOpacity onPress={this._changeRowStatus} activeOpacity={1}>
						<Image source={icons.plusBlue} style={styles.plusIcon} />
					</TouchableOpacity>
				</View>
			)
		}
	},

	render: function() {
		return (
			<View style={styles.cellView}>
				{this._renderAddRow()}
				<View style={[styles.verticalLine, styles.verticalLine10]}></View>
				<View style={styles.flex1View}>
					<Image source={icons.calendarGreen}
						style={styles.calendarIcon} />
					<TextInput onChangeText={(publishDate) => this.props.setItemValue(publishDate, this.props.rowID, 'publishDate')}
						value={this.state.publishDate}
						style={styles.textInputView} />
				</View>
				<View style={[styles.verticalLine, styles.verticalLine10]}></View>
				<View style={styles.flex1View}>
					<Image source={icons.markBlue} style={styles.calendarIcon} />
					<TextInput onChangeText={(address) => this.props.setItemValue(address, this.props.rowID, 'address')}
						value={this.state.address}
						style={styles.textInputView} />
				</View>
				<View style={[styles.verticalLine, styles.verticalLine10]}></View>
				{this._renderContent()}
				<View style={[styles.verticalLine, styles.verticalLine20]}></View>
			</View>
		)
	}
});

var styles = StyleSheet.create({
	background: {
		position: 'absolute',
		top: 64,
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: '#f3f5f6'
	},

	editImage: {
		width: 40,
		height: 40,
		marginLeft: 36,
		marginTop: -4,
		marginBottom: -4
	},

	footerView: {
		flex: 1,
		flexDirection: 'row',
		marginLeft: 15,
		marginBottom: 20,
	},

	textInputView: {
		flex: 1,
		height: 24,
		fontSize: 11,
		color: stylesVar('dark-mid')
	},

	contentImage: {
		width: deviceWidth - 30,
		height: 140 
	},

	descriptionText: {
		flex: 1,
		color: stylesVar('dark-light-little'),
		fontSize: 13,
		lineHeight: 20,
		backgroundColor: '#fff',
		paddingHorizontal: 20,
		paddingTop: 13,
		paddingBottom: 20
	},

	cellView: {
		flex: 1,
		flexDirection: 'column',
		marginHorizontal: 15
	},

	flex1View: {
		flex: 1,
		flexDirection: 'row'
	},

	verticalLine: {
		width: 50,
		marginLeft: 15,
		borderLeftWidth: 1,
		borderColor: stylesVar('dark-mid-light')	
	},

	verticalLine10: {
		height: 10
	},

	verticalLine20: {
		height: 20
	},

	plusIcon: {
		width: 32,
		height: 32
	},

	calendarIcon: {
		width: 24,
		height: 24,
		marginHorizontal: 4
	},

	subItemText: {
        color: stylesVar('dark-mid'),
        fontWeight: '300',
        fontSize: 13,
        width: 48
    },

    subItemEdit: {
        flex: 1,
        color: stylesVar('dark'),
        fontWeight: '300',
        fontSize: 13
    },

    itemView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        borderColor: stylesVar('dark-light'),
        borderWidth: 1 / PixelRatio.get(),
        paddingLeft: 10,
        backgroundColor: '#fff',
        marginBottom: 20
    },

    subItemView: {
        flex: 1,
        flexDirection: 'row',
        height: 45, 
        paddingRight: 15,
        paddingLeft: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },

    separator: {
    	borderTopWidth: 1 / PixelRatio.get(),
        borderColor: stylesVar('dark-light'),
    },

    subItemContentView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    contentText: {
        flex: 1,
        color: stylesVar('dark'),
        fontWeight: '300',
        fontSize: 13
    },

    imageView: {
        width: 20,
        alignItems: 'flex-end'
    },

    iconArrow: {
        width: 9,
        height: 15
    },

    displayView: {
    	flex: 1,
    	backgroundColor: '#f3f5f6'
    },

	topView: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginHorizontal: 15
	},

	publishText: {
		fontSize: 14,
        fontWeight: '300',
        color: '#fff'
	}
});

var BaseRouteMapper = require('./BaseRouteMapper');
class Route extends BaseRouteMapper {
	constructor(datas) {
        super();

        this.datas = datas;
    }

    renderLeftButton(route, navigator, index, navState) {
        return this._renderBackButton(route, navigator, index, navState);
    }

    renderRightButton(route, navigator, index, navState) {
        return (
            <TouchableOpacity style={styles.topView}
            	onPress={this._publishActivity.bind(this)}>
				<Text style={styles.publishText}>发布</Text>
			</TouchableOpacity>
        );
    }

    _publishActivity() {
    	return this._root.getActivity();
    }

    get title() {
    	return '写游记'
    }

    renderScene(navigator) {
    	return (
    		<RecordActivity dataBlob={this.datas} ref={(component) => this._root = component}/>
    	);
    }
}


module.exports = Route;