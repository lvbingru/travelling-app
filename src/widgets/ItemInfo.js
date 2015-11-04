var React = require('react-native');

var {
	View,
	Text,
	StyleSheet,
	PixelRatio
} = React;

var stylesVar = require('../stylesVar');

var ItemInfo = React.createClass({
	render: function() {
		var detailView = this.props.detailView;
	  	var style = detailView ? [styles.detailView, detailView] : styles.detailView;
		return (
			<View style={style}>
				{this.props.datas.map(function(item) {
					return (
						<View style={styles.itemView}>
							<Text style={styles.itemLeft}>{item.title}</Text>
							<Text style={styles.itemRight}>{item.content}</Text>
						</View>
					);
				})}
			</View>
		);
	}
});

var styles = StyleSheet.create({
	detailView: {
		flex: 1,
		flexDirection: 'column',
		paddingTop: 10,
		paddingBottom: 40,
		borderColor: '#f3f5f6',
		borderRightWidth: 1 / PixelRatio.get(),
		borderLeftWidth: 1 / PixelRatio.get(),
		borderLeftWidth: 1 / PixelRatio.get()
	},

	itemView: {
		flex: 1,
		flexDirection: 'row'
	},

	itemLeft: {
		flex: 2,
		textAlign: 'right',
		fontSize: 13,
		color: stylesVar('dark-mid'),
		lineHeight: 30,
		fontWeight: '300'
	},

	itemRight: {
		flex: 3,
		textAlign: 'left',
		paddingLeft: 22,
		lineHeight: 30,
		fontWeight: '300',
		fontSize: 13,
		color: stylesVar('dark')
	}
});

module.exports = ItemInfo;