var React = require('react-native');
var _ = require('underscore');

var {
    View,
    ListView,
    Image,
    Text,
    CameraRoll,
    TouchableOpacity,
    Dimensions,
    StyleSheet
} = React;

var deviceWidth = Dimensions.get('window').width;
var icons = require('./icons');
var su = require('./styleUtils');
var stylesVar = require('./stylesVar');

var debug = require('./debug');
var log = debug('LocalSeveralPhotoPicker:log');
var warn = debug('LocalSeveralPhotoPicker:warn');
var error = debug('LocalSeveralPhotoPicker:error');

var thumbMargin = 5;
var thumbCols = 4;
var thumbSize = (deviceWidth - (thumbCols + 1) * thumbMargin) / thumbCols;

var CameraRollScene = React.createClass({
    getInitialState: function() {
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        return {
            dataBlob: [],
            dataSource: ds.cloneWithRows([]),
            checkedDataBlob: [],
            checkedDataSource: ds.cloneWithRows([])
        }
    },

    componentDidMount: function() {
        CameraRoll.getPhotos({
            first: 65535
        }, function(data) {
            var photos = data.edges.map(function(item) {
                return {
                    photo: item.node,
                    checked: false
                }
            });

            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(photos),
                dataBlob: photos
            });
        }.bind(this), function(e) {
            console.trace(e);
        });
    },

    pressCellRow: function(rowID) {
        var dataBlob = _.clone(this.state.dataBlob);
        var checkedDataBlob = _.clone(this.state.checkedDataBlob);
        var photo = _.clone(dataBlob[rowID]);
        var checked = photo.checked;
        photo.checked = !photo.checked;
        dataBlob[rowID] = photo;

        var index = _.findIndex(checkedDataBlob, function(item) {
            return item.photo === photo.photo;
        });

        if (checked && index !== -1) {
            checkedDataBlob.splice(index, 1);
        } else if (!checked && index === -1) {
            checkedDataBlob.push({
                photo: photo.photo,
                rowID: rowID
            });
        }

        this.setState({
            dataBlob: dataBlob,
            checkedDataBlob: checkedDataBlob,
            dataSource: this.state.dataSource.cloneWithRows(dataBlob),
            checkedDataSource: this.state.checkedDataSource.cloneWithRows(checkedDataBlob)
        })
    },

    _renderRow: function(photo, sectionID, rowID, highlightRow) {
        return (
            <Cell data={photo}
				onPress={this.pressCellRow.bind(this, rowID)} />
        );
    },

    pressPreviewCell: function(photo) {
        var dataBlob = _.clone(this.state.dataBlob);
        var checkedDataBlob = _.clone(this.state.checkedDataBlob);
        var rowID = photo.rowID;
        var photo_copy = _.clone(dataBlob[rowID]);
        photo_copy.checked = false;
        dataBlob[rowID] = photo_copy;
        var index = _.findIndex(checkedDataBlob, function(item) {
            return item === photo
        });

        if (index !== -1) {
            checkedDataBlob.splice(index, 1);
        }

        this.setState({
            dataBlob: dataBlob,
            checkedDataBlob: checkedDataBlob,
            dataSource: this.state.dataSource.cloneWithRows(dataBlob),
            checkedDataSource: this.state.checkedDataSource.cloneWithRows(checkedDataBlob)
        });
    },

    renderPreviewCell: function(photo) {
        return (
            <PreviewCell data={photo} 
				onPress={this.pressPreviewCell.bind(this, photo)}/>
        )
    },

    getCheckedDatas: function() {
        return this.state.checkedDataBlob
    },

    nextStep: function() {
        var checked = this.state.checkedDataBlob;
        this.props.nextStep && this.props.nextStep(checked, this.props.navigator);
    },

    _renderSeparator: function(sectionID, rowID) {
        if (rowID == this.state.checkedDataBlob.length - 1) {
            return null;
        }

        return (
            <View style={styles.previewSeparator}></View>
        );
    },

    render: function() {
        if (!this.state.dataSource) {
            return null;
        }

        return (
            <View style={styles.background}>
				<ListView
					style={[styles.container, this.props.style]} 
					contentContainerStyle={styles.content}
					dataSource={this.state.dataSource}
					renderRow={this._renderRow}/>
				<View style={styles.bottomView}>
					<View style={styles.displayView}>
						<ListView horizontal={true}
							dataSource={this.state.checkedDataSource}
							renderRow={this.renderPreviewCell}
							renderSeparator={this._renderSeparator} />
					</View>
					<View style={styles.nextStepView}>
						<View style={styles.numberView}>
							<Text style={styles.numberText}>{this.state.checkedDataBlob.length}</Text>
						</View>
						{this.props.nextText && (<TouchableOpacity onPress={this.nextStep}>
							<Text style={styles.nextText}>{this.props.nextText}</Text>
						</TouchableOpacity>)}
					</View>
				</View>
			</View>
        )
    }
});


var Cell = React.createClass({
    getInitialState: function() {
        return {
            checked: this.props.data.checked
        }
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({
            checked: nextProps.data.checked
        })
    },

    render: function() {
        var imageUrl = this.state.checked ? icons.checkedGreen : icons.checkedTrans;

        return (
            <TouchableOpacity
				style={styles.cell}
				onPress={() => this.props.onPress()}
				activeOpacity={1} >
					<Image source={{uri: this.props.data.photo.image.uri}} 
						resizeMode="cover"
						style={[{
							width: thumbSize,
							height: thumbSize 
						}, styles.imageContainer]}/>
					<Image source={imageUrl} 
						style={styles.checkedIcon}/>
			</TouchableOpacity>
        )
    }
});

var PreviewCell = React.createClass({
    getInitialState: function() {
        return {}
    },

    _onLayout: function(e) {
        var layout = e.nativeEvent.layout;
        this.setState({
            layout
        });
    },

    render: function() {
        return (
            <View style={this.props.style}>
				<TouchableOpacity
					style={styles.previewCell}
					activeOpacity={1}
					onLayout={this._onLayout}>
					{this.state.layout &&
						<Image source={{uri: this.props.data.photo.image.uri}} resizeMode="cover" style={[{
							width: this.state.layout.width,
							height: this.state.layout.height
						}, styles.imageContainer]} />						
					}
				</TouchableOpacity>
				<TouchableOpacity onPress={this.props.onPress}>
					<Image source={icons.dismissBg}
						style={styles.iconDismiss} />
				</TouchableOpacity>
			</View>
        );
    }
});

var styles = StyleSheet.create({
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: '#f3f5f6'
    },

    container: {
        flex: 1,
        backgroundColor: '#f3f5f6'
    },

    previewSeparator: {
        width: 8
    },

    content: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        margin: thumbMargin / 2
    },

    cell: {
        overflow: 'hidden',
        backgroundColor: stylesVar('dark-lighter'),
        ...su.size(thumbSize),
        margin: thumbMargin / 2
    },

    imageContainer: {
        alignItems: 'flex-end'
    },

    checkedIcon: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'transparent',
        borderRadius: 12,
        ...su.size(24, 24),
    },

    bottomView: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff'

    },

    displayView: {
        flex: 1,
        flexDirection: 'row',
        height: 64,
        paddingHorizontal: 15,
        paddingBottom: 12
    },

    previewCell: {
        paddingTop: 12,
        width: 40,
        height: 40
    },

    iconDismiss: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: 'transparent',
        marginLeft: 26,
        marginTop: -38
    },

    nextStepView: {
        flexDirection: 'row',
        height: 64,
        alignItems: 'center',
        justifyContent: 'center'
    },

    numberView: {
        width: 25,
        height: 19,
        marginRight: 5,
        backgroundColor: stylesVar('dark-light'),
        alignItems: 'center',
        justifyContent: 'center'
    },

    numberText: {
        color: stylesVar('dark-light-little'),
        fontSize: 11
    },

    nextText: {
        color: stylesVar('blue'),
        fontSize: 13,
        marginRight: 5
    }
});

module.exports = CameraRollScene;
