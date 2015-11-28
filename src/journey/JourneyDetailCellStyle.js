var React = require('react-native');

var {
	StyleSheet,
	Dimensions
} = React;

var deviceWidth = Dimensions.get('window').width;
var stylesVar = require('../stylesVar');

var styles = StyleSheet.create({
	cellView: {
		flex: 1,
		flexDirection: 'column',
		marginHorizontal: 15
	},

	verticalLine: {
		width: 50,
		marginLeft: 15,
		borderLeftWidth: 1,
		borderColor: stylesVar('dark-mid-light')	
	},

	verticalLine10: {
		height: 10
	},

	verticalLine20: {
		height: 20
	},

	flex1View: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},

	calendarIcon: {
		width: 24,
		height: 24,
		marginHorizontal: 4
	},

	textInputView: {
		flex: 1,
		height: 24,
		fontSize: 11,
		color: stylesVar('dark-mid'),
		marginLeft: 6
	},

	descriptionText: {
		flex: 1,
		color: stylesVar('dark-light-little'),
		fontSize: 13,
		lineHeight: 20,
		backgroundColor: '#fff',
		paddingHorizontal: 20,
		paddingTop: 13,
		paddingBottom: 20
	},

	contentImage: {
		width: deviceWidth - 30,
		height: 140 
	}
});

module.exports = styles;