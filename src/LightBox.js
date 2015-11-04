var React = require('react-native');

var  {
	Text,
	Image,
	View,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
	Animated
} = React;

var su = require('./styleUtils');
var LightBoxOverlay = require('./LightBoxOverlay');

var deviceWidth = Dimensions.get('window').width;
var iconImageSize = (deviceWidth - 110) / 3;

var LightBox = React.createClass({
	getOverlayProps: function(index) {
		return {
			imagesArray: this.props.imagesArray,
			onClose: this.onClose,
			index: index
		}
	},

	open: function(index) {
		this.setState({
			isAnimating: true
		}, () => {
			this.props.navigator.push(new LightBoxOverlay({...this.getOverlayProps(index)}));
		})
	},

	onClose: function() {
		this.props.navigator.pop();
	},

	render: function() {
		var imagesArray = this.props.imagesArray;
		return (
			<Animated.View style={styles.images}>
				{imagesArray && imagesArray.length !== 0 && imagesArray.map(function(item, index) {
					return (
						<TouchableOpacity activeOpacity={1} style={styles.iconImage} onPress={this.open.bind(this, index)}>
							<Image style={styles.iconImage} source={{uri: item}} />
						</TouchableOpacity>
					);
				}.bind(this))}
			</Animated.View>
		);
	}
});

var styles = StyleSheet.create({
	images: {
    	flex: 1,
    	flexDirection: 'row',
    	marginLeft: 35
    },

    iconImage: {
    	...su.size(iconImageSize),
    	marginRight: 5,
    	overflow: 'hidden'
    }
});

module.exports = LightBox;