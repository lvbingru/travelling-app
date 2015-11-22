var React = require('react-native');

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
    Dimensions
} = React;

var icons = require('./icons');
var stylesVar = require('./stylesVar');

var AddComment = React.createClass({
    getInitialState: function() {
        return {
            text: this.props.state || ''
        }
    },

    submitHandle: function() {
        //todo
        var datas = {
            text: this.state.text,
            images: []
        }
        this.props.navigator.pop();
    },

    render: function() {
        return (
            <View style={styles.container}>
				<View>
				<View style={styles.textInputView}>
					<TextInput style={styles.textInput}
						multiline={true}
						onChangeText={(text) => this.setState({text})}
						value={this.state.text}/>
				</View>
				</View>
				<View style={styles.bottomBar}>
					<TouchableOpacity >
						<Image style={styles.faceIcon}
							source={icon.face}/>
					</TouchableOpacity>
					<TouchableOpacity>
						<Image style={styles.pictureIcon}
							source={icons.pictureGray}/>
					</TouchableOpacity>
				</View>
			</View>
        )
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

module.exports = AddCommentRoute;
