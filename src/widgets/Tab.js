var React = require('react-native');

var  {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	PixelRatio
} = React;

var stylesVar = require('../stylesVar');

var Tab = React.createClass({
	getInitialState: function() {
		return {
			activeTab: this.props.activeTab || 0
		}
	},

	pressHandle: function(index) {
		if (this.state.activeTab === index) {
			return false;
		}
		
		this.setState({
			activeTab: index
		}, function() {
			var func = this.props.callbacks && this.props.callbacks[index];
			if (typeof func === 'function') {
				func();
			}
		}.bind(this));
	},

	render: function() {
		var activeTab = parseInt(this.state.activeTab);
		var styleProps = this.props.styles;
		var tabTextFont = {
			fontSize: 10
		};
		if (styleProps && styleProps.tabTextFont) {
			tabTextFont = styleProps.tabTextFont;
		}
		return (
			<View style={styles.tabRow}>
				{this.props.datas && this.props.datas.map(function(item, index) {
					if (activeTab === index) {
						return (
							<TouchableOpacity activeOpacity={1}
								onPress={this.pressHandle.bind(this, index)}
								style={[styles.tabView, styles.tabViewActive]}>
								<Text style={[styles.tabText, tabTextFont, styles.tabTextActive]}>{item}</Text>
							</TouchableOpacity>
						)
					} else {
						return (
							<TouchableOpacity activeOpacity={1} 
								onPress={this.pressHandle.bind(this, index)}
								style={styles.tabView}>
								<Text style={[styles.tabText, tabTextFont]}>{item}</Text>
							</TouchableOpacity>
						)
					}
				}.bind(this))}
			</View>
		);
	}
});

var styles = StyleSheet.create({
	tabRow: {
		flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: stylesVar('dark-light'),
        backgroundColor: '#fff'
	},

	tabView: {
        flex: 1,
        alignItems: 'center',
        height: 44,
        paddingTop: 17,
        paddingBottom: 15
    },

    tabText: {
        color: stylesVar('dark-light-little'),
        fontWeight: "200"
    },

    tabViewActive: {
        borderBottomWidth: 2,
        borderBottomColor: stylesVar('blue'),
        marginBottom: -1 / PixelRatio.get()
    },

    tabTextActive: {
        color: stylesVar('blue')
    }
});

module.exports = Tab;