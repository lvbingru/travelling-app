var React = require('react-native');

var {
	StyleSheet,
	View,
	Image,
	ListView,
	Dimensions,
	TouchableOpacity,
	PixelRatio,
	Text
} = React;

var deviceWidth = Dimensions.get('window').width;
var su = require('./styleUtils');
var stylesVar = require('./stylesVar');
var icons = require('./icons');
var PhotoAccessSettings = require('./PhotoAccessSettings');
var LocalSeveralPhotoPicker = require('./LocalSeveralPhotoPicker');

var thumbMargin = 5;
var thumbCols = 4;
var thumbSize = (deviceWidth - (thumbCols + 1) * thumbMargin) / thumbCols;
var LightBoxOverlay = require('./LightBoxOverlay');

var MyGalleryDetail = React.createClass({
    getInitialState: function() {
        return {
        	dataBlob: [],
        	dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})
        }
    },

    componentDidMount: function() {
    	this._updateDatas();
    },

    _updateDatas: function() {
    	var dataBlob = ['http://localhost:8081/img/page1.png', 'http://localhost:8081/img/signin-bg.png', 'http://localhost:8081/img/space-header.png'];
    	this.setState({
    		dataBlob: dataBlob,
    		dataSource: this.state.dataSource.cloneWithRows(dataBlob)
    	});
    },

    _renderRow: function(photo, sectionID, rowID) {
        return <Cell source={photo} onPress={this._onPressImage.bind(this, rowID)}/>
    },

    _onPressImage: function(index) {
    	this.props.navigator.push(new LightBoxOverlay({
    		imagesArray: this.state.dataBlob,
    		onClose: this._onClose,
    		index: index
    	}));
    },

    _onClose: function() {
    	this.props.navigator.pop();
    },	

    render: function() {
        if (this.state.dataBlob.length === 0) {
            return null;
        }

        return (
        	<View style={styles.background}>
            	<ListView style={styles.container}
                	contentContainerStyle={styles.content}
                	dataSource={this.state.dataSource}
                	renderRow={this._renderRow}/>
                <TouchableOpacity onPress={() => this.props.navigator.push(new PhotoRoute(this._updateDatas))}
                	style={styles.bottomView}>
                	<Text style={styles.bottomText}>添加照片</Text>
                </TouchableOpacity>
            </View>
        )
    }
});

var Cell = React.createClass({
    getInitialState: function() {
        return {}
    },

    _onLayout: function(e) {
        var layout = e.nativeEvent.layout;
        this.setState({layout});
    },

    render: function() {
        return (
            <TouchableOpacity
                style={styles.cell}
                onLayout={this._onLayout}
                activeOpacity={0.9}
                onPress={this.props.onPress}>
                {this.state.layout && <Image source={{uri: this.props.source}} resizeMode="cover" style={{
                    width: this.state.layout.width,
                    height: this.state.layout.height
                    }}/>}
            </TouchableOpacity>
        );
    }
});


var styles = StyleSheet.create({
	background: {
		position: 'absolute',
		top: 64,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: stylesVar('#f3f5f6')
	},

	bottomView: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		height: 50,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		borderTopWidth: 1 / PixelRatio.get(),
		borderColor: stylesVar('dark-light')
	},

	bottomText: {
		color: stylesVar('blue'),
		fontSize: 16
	},

    container: {
    	position: 'absolute',
    	top: 0,
    	bottom: 50,
    	left: 0,
    	right: 0,
    	backgroundColor: '#f3f5f6'
    },

    content: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        margin: thumbMargin / 2
    },

    cell: {
        backgroundColor: stylesVar('dark-lighter'),
        ...su.size(thumbSize),
        margin: thumbMargin / 2
    },

    submitText: {
        fontSize: 14,
        fontWeight: '300',
        color: '#fff',
        marginTop: 15
    },

    rightButton: {
        marginRight: 15
    }
});

var BaseRouteMapper = require('./BaseRouteMapper');
class Route extends BaseRouteMapper {
	constructor(title) {
        super();
        this.titleValue = '活动标题'
    }

    renderLeftButton() {
        return this._renderBackButton.apply(this, arguments);
    }

    renderRightButton(route, navigator, index, navState) {
        return (
            <TouchableOpacity onPress={() => navigator.push(new PhotoAccessSettings())}
            	style={styles.rightButton}>
				<Text style={styles.submitText}>设置权限</Text>
			</TouchableOpacity>
        );
    }

    get title() {
    	return this.titleValue;
    }

    renderScene() {
    	return (
    		<MyGalleryDetail />
    	);
    }
}

class PhotoRoute extends BaseRouteMapper {
	constructor(updateFun) {
		super();

		this.updateFun = updateFun;
	}

	renderLeftButton(route, navigator, index, navState) {
		function callback() {
			this.updateFun && this.updateFun();
			navigator.pop();
		}

        return this._renderBackButton.apply(this, arguments, callback);
    }

    renderRightButton(route, navigator, index, navState) {
        return (
            <TouchableOpacity
            	style={styles.rightButton}
            	onPress={this._upload.bind(this)}>
				<Text style={styles.submitText}>上传</Text>
			</TouchableOpacity>
        );
    }

    get title() {
    	return '相册';
    }

    _upload() {
    	var datas = this._root.getCheckedDatas();
    	//todo upload
    }

    renderScene() {
    	return (
    		<LocalSeveralPhotoPicker ref={(component) => this._root = component}/>
    	);
    }
}

module.exports = Route;