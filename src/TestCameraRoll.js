var shortid = require('shortid');
var _ = require('underscore');
var React = require('react-native');

var AV = require('avoscloud-sdk');

var Photo = AV.Object.extend("Photo");

var {
    View,
    DatePickerIOS,
    StyleSheet,
    Text,
    Image,
    CameraRoll,
    ListView,
    TouchableOpacity
} = React;

var CameraRollScene = React.createClass({

    getInitialState: function() {
        return {};
    },

    componentDidMount: function() {
        CameraRoll.getPhotos({
            first: 65535
        }, function(data) {
            console.log(data);
            var dataSource = new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            })
            this.setState({
                dataSource: dataSource.cloneWithRows(data.edges)
            });
        }.bind(this), function(e) {
            console.trace(e);
        })
    },

    _upload: function(photo) {
        var image = photo.node.image;
        var ext = image.uri.split(/ext=/)[1];
        var name = shortid.generate() + '.' + ext;
        var file = new AV.File(name, {
            blob: {
                name: name,
                uri: image.uri,
                type: 'image/jpeg'
            }
        });

        file.save().then(console.log.bind(console), console.trace.bind(console));
    },

    _renderRow: function(photo) {
        return (
            <TouchableOpacity onPress={this._upload.bind(this, photo)}>
                <Image style={styles.image} 
                    source={{uri: photo.node.image.uri}}/>
            </TouchableOpacity>
        );
    },

    render: function() {
        if (!this.state.dataSource) {
            return null;
        }

        return (
            <ListView style={styles.container}
                contentContainerStyle={styles.content}
                dataSource={this.state.dataSource}
                renderRow={this._renderRow}/>
        )
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
        flexWrap: 'wrap'
    },

    image: {
        margin: 5,
        width: 90,
        height: 90,
        resizeMode: 'cover'
    }
});

var BaseRouteMapper = require('./BaseRouteMapper');

class Route extends BaseRouteMapper {

    get style() {
        return this.styles.navBarEmpty;
    }

    renderScene() {
        return (
            <CameraRollScene/>
        );
    }
}

module.exports = Route;
