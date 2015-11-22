var _ = require('underscore');
var shortid = require('shortid');

var React = require('react-native');

var {
    View,
    Dimensions,
    DatePickerIOS,
    StyleSheet,
    Text,
    Image,
    CameraRoll,
    ListView,
    TouchableOpacity
} = React;

var AV = require('avoscloud-sdk');
var Photo = AV.Object.extend("Photo");

var deviceWidth = Dimensions.get('window').width;
var su = require('./styleUtils');
var stylesVar = require('./stylesVar');

var thumbMargin = 5;
var thumbCols = 4;
var thumbSize = (deviceWidth - (thumbCols + 1) * thumbMargin) / thumbCols;

var CameraRollScene = React.createClass({

    getInitialState: function() {
        return {};
    },

    componentDidMount: function() {
        CameraRoll.getPhotos({
            first: 65535
        }, function(data) {
            console.log(data);
            var photos = data.edges.map(function(item) {
                return item.node.image
            });
            var dataSource = new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            });
            this.setState({
                dataSource: dataSource.cloneWithRows(photos)
            });
        }.bind(this), function(e) {
            console.trace(e);
        });
    },

    _upload: function(photo) {
        var image = photo.node.image;
        var ext = image.uri.split(/ext=/)[1];
        var name = shortid.generate() + '.' + ext;
        var file = new AV.File(name, {
            blob: image 
        });

        file.save().then(console.log.bind(console), console.trace.bind(console));
    },

    _renderRow: function(photo) {
        return <Cell source={{uri: photo.uri}} 
                    onPress={() => {
                        this.props.onResult(photo);
                        this.props.navigator.pop();
                    }}/>
    },

    render: function() {
        if (!this.state.dataSource) {
            return null;
        }

        return (
            <ListView style={[styles.container, this.props.style]}
                contentContainerStyle={styles.content}
                dataSource={this.state.dataSource}
                renderRow={this._renderRow}/>
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
                onPress={this.props.onPress}
                onLayout={this._onLayout}
                activeOpacity={0.8}>
                {this.state.layout &&
                    <Image source={this.props.source} resizeMode="cover" style={{
                        width: this.state.layout.width,
                        height: this.state.layout.height
                    }}/>}
            </TouchableOpacity>
        );
    }
});


var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
    }
});

var BaseRouteMapper = require('./BaseRouteMapper');
var EventEmitter = require('EventEmitter');

class Route extends BaseRouteMapper {

    constructor(params) {
        super();
        this.title = params.title || "本地相册";
        this._onResult = params.onResult;
    }

    emit() {
        this.emitter.apply(this.emitter, arguments);
    }

    renderLeftButton() {
        return this._renderBackButton.apply(this, arguments);
    }

    renderScene() {
        return (
            <CameraRollScene route={this} onResult={this._onResult}/>
        );
    }
}

module.exports = Route;
