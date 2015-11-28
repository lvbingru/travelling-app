var React = require('react-native');
var _ = require('underscore');

var {
    View,
    Text,
    Image,
    ListView,
    TextInput,
    TouchableOpacity,
    ActivityIndicatorIOS,
    PixelRatio,
    StyleSheet,
    ScrollView,
    Dimensions
} = React;

var icons = require('./icons');
var stylesVar = require('./stylesVar');
var LocalSeveralPhotoPicker = require('./LocalSeveralPhotoPicker');

var AddComment = React.createClass({
    getInitialState: function() {
        return {
            text: this.props.state || '',
            dataBlob: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            })
        }
    },

    componentDidMount: function() {
        var dataBlob = ['http://f.hiphotos.baidu.com/image/pic/item/b64543a98226cffc9b70f24dba014a90f703eaf3.jpg', 
        'http://f.hiphotos.baidu.com/image/pic/item/b64543a98226cffc9b70f24dba014a90f703eaf3.jpg', 
        'http://f.hiphotos.baidu.com/image/pic/item/b64543a98226cffc9b70f24dba014a90f703eaf3.jpg', 
        'http://f.hiphotos.baidu.com/image/pic/item/b64543a98226cffc9b70f24dba014a90f703eaf3.jpg'];

        this.setState({
            dataBlob: dataBlob,
            dataSource: this.state.dataSource.cloneWithRows(dataBlob)
        });
    },

    submitHandle: function() {
        //todo
        var datas = {
            text: this.state.text,
            images: []
        }
        this.props.navigator.pop();
    },

    _onChooseResult: function(result) {
        console.log(result);
    },

    _choosePhoto: function() {
        this.props.navigator.push(new PhotoRoute(this._onChooseResult));
    },

    pressPreviewCell: function(rowID) {
        var dataBlob = _.clone(this.state.dataBlob);
        dataBlob.splice(rowID, 1);

        this.setState({
            dataBlob: dataBlob,
            dataSource: this.state.dataSource.cloneWithRows(dataBlob)
        })
    },

    _renderCell: function(data, sectionID, rowID) {
        return (
            <PreviewCell source={data} onPress={this.pressPreviewCell.bind(this, rowID)} />
        )
    },

    _renderSeparator: function(sectionID, rowID) {
        if (rowID == this.state.dataBlob.length - 1) {
            return null;
        }
        
        return <View style={styles.separator}></View>
    },

    render: function() {
        return (
            <View style={styles.container}>
				<ScrollView style={styles.scrollView}>
    				<View style={styles.textInputView}>
    					<TextInput style={styles.textInput}
    						multiline={true}
    						onChangeText={(text) => this.setState({text})}
    						value={this.state.text}/>
    				</View>
                    <View style={styles.list}>
                        <ListView horizontal={true}
                            style={styles.listView}
                            dataSource={this.state.dataSource}
                            renderRow={this._renderCell}
                            renderSeparator={this._renderSeparator}/>
                        {this.state.dataBlob.length !== 0 && <Text style={styles.imageNumber}>{this.state.dataBlob.length}</Text>}
                    </View>
				</ScrollView>
				<View style={styles.bottomBar}>
					<TouchableOpacity >
						<Image style={styles.faceIcon}
							source={icons.face}/>
					</TouchableOpacity>
					<TouchableOpacity onPress={this._choosePhoto}>
						<Image style={styles.pictureIcon}
							source={icons.pictureGray}/>
					</TouchableOpacity>
				</View>
			</View>
        )
    }
});

var PreviewCell = React.createClass({
    getInitialState: function() {
        return {}
    },

    _onLayout: function(e) {
        var layout = e.nativeEvent.layout;
        this.setState({layout});
    },

    render: function() {
        return (
            <View>
                <TouchableOpacity
                    style={styles.previewCell}
                    activeOpacity={1}
                    onLayout={this._onLayout}>
                    {this.state.layout &&
                        <Image source={{uri: this.props.source}} resizeMode="cover" style={[{
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
    container: {
        position: 'absolute',
        top: 64,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#f3f5f6'
    },

    imageNumber: {
        paddingLeft: 10,
        paddingRight: 15,
        fontSize: 11,
        color: stylesVar('dark-mid')
    },

    separator: {
        width: 11
    },

    scrollView: {
        flex: 1,
        flexDirection: 'column'
    },

    list: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    listView: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 15,
        paddingVertical: 20
    },

    imageContainer: {
        alignItems: 'flex-end'
    },

    iconDismiss: {
        width: 18,
        height: 18,
        borderRadius: 11,
        backgroundColor: 'transparent',
        marginLeft: 77,
        marginTop: -95
    },

    previewCell: {
        width: 86,
        height: 86
    },

    textInputView: {
        flex: 1,
        height: 150,
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 15
    },

    textInput: {
        flex: 1,
        color: stylesVar('dark'),
        fontWeight: '300',
        fontSize: 16,
        lineHeight: 20,
        height: 120
    },

    bottomBar: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        height: 45,
        paddingHorizontal: 15,
        backgroundColor: stylesVar('white'),
        borderWidth: 1 / PixelRatio.get(),
        borderColor: stylesVar('dark-light'),
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },

    faceIcon: {
        width: 28,
        height: 28,
        marginRight: 15
    },

    pictureIcon: {
        width: 28,
        height: 21
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

class AddCommentRoute extends BaseRouteMapper {
    constructor(data) {
        super()

        this.id = data.id;
    }

    renderLeftButton(route, navigator, index, navState) {
        return this._renderBackButton(route, navigator, index, navState);
    }

    renderRightButton(route, navigator, index, navState) {
        return (
            <TouchableOpacity onPress={() => this._root.submitHandle()} style={styles.rightButton}>
				<Text style={styles.submitText}>发表</Text>
			</TouchableOpacity>
        );
    }

    get style() {
        return this.styles.navBar;
    }

    get title() {
        return '发表评论';
    }

    renderScene(navigator) {
        return <AddComment id={this.id} 
					ref={component => this._root = component}/>
    }
}

class PhotoRoute extends BaseRouteMapper {
    constructor(updateFun) {
        super();

        this.updateFun = updateFun;
    }

    renderLeftButton(route, navigator, index, navState) {
        return this._renderBackButton.apply(this, arguments);
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
        this.updateFun && this.updateFun(datas);
        //todo upload
    }

    renderScene() {
        return (
            <LocalSeveralPhotoPicker ref={(component) => this._root = component}/>
        );
    }
}

module.exports = AddCommentRoute;
