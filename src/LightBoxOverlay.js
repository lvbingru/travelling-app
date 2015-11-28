var React = require('react-native');
var Swiper = require('react-native-swiper')

var  {
	Image,
	View,
	Dimensions,
	StatusBarIOS,
	StyleSheet
} = React;

var WINDOW_WIDTH = Dimensions.get('window').width;
var WINDOW_HEIGHT = Dimensions.get('window').height;

var LightBoxOverlay = React.createClass({
	close: function() {
		this.props.onClose();
	},

	render: function() {
		var {
			imagesArray,
			index
		} = this.props;

		return (
				<Swiper style={styles.wrapper}
					dot={<View style={{backgroundColor:'rgba(255,255,255,.3)', width: 13, height: 13,borderRadius: 7, marginLeft: 7, marginRight: 7,}} />}
					activeDot={<View style={{backgroundColor: '#fff', width: 13, height: 13, borderRadius: 7, marginLeft: 7, marginRight: 7}} />}
					paginationStyle={{bottom: 70}}
					index={index}
					loop={false}>
					{imagesArray && imagesArray.length !== 0 && imagesArray.map(function(item) {
						return (<View style={styles.slide}><Image style={styles.images} source={{uri: item}} resizeMode='contain' /></View>)
					}.bind(this))}
				</Swiper>
		)
	}
});

var styles = StyleSheet.create({
	wrapper: {

	},

	images: {
		flex: 1
	},

	slide: {
		flex: 1,
    	backgroundColor: '#000',
	}
});

var BaseRouteMapper = require('./BaseRouteMapper');

class LightBoxOverlayRoute extends BaseRouteMapper {
	constructor(data) {
		super()
		this.data = data
	}

	renderLeftButton(route, navigator, index, navState) {
		return this._renderBackButton(route, navigator, index, navState);
	}

	get style() {
        return this.styles.navBarTransparent;
    }

	renderScene() {
		return <LightBoxOverlay {...this.data} />
	}
}

module.exports = LightBoxOverlayRoute;