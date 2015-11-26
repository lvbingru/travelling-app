var React = require('react-native');

var {
	StyleSheet,
	TextInput,
	View,
	Text,
	TouchableOpacity
} = React;

var stylesVar = require('./stylesVar');

var RecordJourneyEditContent = React.createClass({
	getInitialState: function() {
		return {
			content: this.props.content
		}
	},

	getContent: function() {
		return this.state.content;
	},

	render: function() {
		return (
			<View style={styles.container}>
				<View>
				<View style={styles.textInputView}>
					<TextInput style={styles.textInput} multiline={true}
						onChangeText={(content) => this.setState({content})}
						value={this.state.content}/>
				</View>
				</View>
			</View>
		);
	}
});

var styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 64,
		bottom: 0,
		left: 0,
		right: 0,
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
	constructor(content, setContent, title) {
        super();

        this.content = content;
        this.setContent = setContent;
        this.titleValue = title;
    }

    renderLeftButton(route, navigator, index, navState) {
        return this._renderBackButton(route, navigator, index, navState);
    }

    renderRightButton(route, navigator, index, navState) {
        return (
            <TouchableOpacity style={styles.topView}
            	onPress={this.getContent.bind(this, navigator)}>
				<Text style={styles.publishText}>确认</Text>
			</TouchableOpacity>
        );
    }

    get title() {
    	return this.titleValue;
    }

    getContent(navigator) {
    	var content = this._root.getContent();
    	this.setContent && this.setContent(content);
    	navigator.pop();
    }

    renderScene(navigator) {
    	return (
    		<RecordJourneyEditContent content={this.content}
    			ref={(component) => this._root = component} />
    	);
    }
}


module.exports = Route;
