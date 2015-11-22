var React = require('react-native');
var {
	View,
	Text,
	Image,
	TouchableOpacity
} = React;

var itemStyles = require('../styles/ItemStyles');
var icons = require('../icons');

var mixins = {
	_renderItemWithText: function(name, text) {
		return (
			<View style={itemStyles.subItemView}>
				<Text style={itemStyles.leftText}>{name}</Text>
				<Text style={itemStyles.rightText}>{text || ''}</Text>
			</View>
		);
	},

	_renderItemWithArrowText: function(name, text, callback) {
		if (callback) {
			return (
				<View style={itemStyles.subItemView}>
					<Text style={itemStyles.leftText}>{name}</Text>
					<TouchableOpacity style={itemStyles.rightView}
						onPress={callback}>
						<Text style={[itemStyles.rightText, itemStyles.marginRight10]}>{text || ''}</Text>
						<Image style={itemStyles.arrowIcon} source={icons.arrow} />
					</TouchableOpacity>
				</View>
			);
		} else {
			return (
				<View style={itemStyles.subItemView}>
					<Text style={itemStyles.leftText}>{name}</Text>
					<View style={itemStyles.rightView}>
						<Text style={[itemStyles.rightText, itemStyles.marginRight10]}>{text || ''}</Text>
						<Image style={itemStyles.arrowIcon} source={icons.arrow} />
					</View>
				</View>
			);	
		}
	}
}

module.exports = mixins;