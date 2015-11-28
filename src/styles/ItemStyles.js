var React = require('react-native');

var {
	StyleSheet,
	PixelRatio
} = React;

var stylesVar = require('../stylesVar');

var styles = StyleSheet.create({
	itemView: {
		flex: 1,
		borderTopWidth: 1 / PixelRatio.get(),
		borderBottomWidth: 1 / PixelRatio.get(),
		borderColor: stylesVar('dark-light'),
		backgroundColor: '#fff'
	},

	subItemView: {
		flex: 1,
		flexDirection: 'row',
		marginLeft: 15,
		height: 45,
		justifyContent: 'center',
		alignItems: 'center'
	},

	leftText: {
		flex: 1,
		color: stylesVar('dark'),
		fontSize: 13
	},

	rightText: {
		flex: 1,
		marginRight: 15,
		textAlign: 'right',
		fontSize: 11,
		alignItems: 'center',
		justifyContent: 'center',
		color: stylesVar('dark-light-little')
	},

	separator: {
		flex: 1,
		marginLeft: 10,
		height: 1 / PixelRatio.get(),
		backgroundColor: stylesVar('dark-light')
	},

	separatorBlock: {
		flex: 1,
		height: 20,
		backgroundColor: '#f3f5f6'
	},

	arrowIcon: {
		width: 9,
		height: 15
	},

	marginRight10: {
		marginRight: 10
	},

	rightView: {
		flex: 1,
		height: 45,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		marginRight: 10
	}
});

module.exports = styles;