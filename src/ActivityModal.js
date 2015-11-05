var React = require('react-native');

var {
	Modal,
	View,
	Text,
	TextInput,
	StyleSheet,
	PixelRatio,
	TouchableOpacity
} = React;

var stylesVar = require('./stylesVar');

var ActivtyModal = React.createClass({
	getInitialState: function() {
		return {
			peopleNum: this.props.peopleNum || '0',
			childNum1: this.props.childNum || '0',
			childNum2: '0',
			amimated: true,
			transparent: true,
			modalVisible: false,
			id: this.props.id
		}
	},

	setDatas: function(modalVisible, peopleNum, childNum1, id){
		this.setState({
			modalVisible: modalVisible,
			peopleNum: '' + peopleNum,
			childNum1: '' + childNum1,
			id: '' + id
		});
	},

	ensureHandle: function() {
		this.setState({
			modalVisible: false
		}, function() {
			this.props.ensurePeople(this.state.peopleNum.trim(), this.state.childNum1.trim(), this.state.childNum2.trim(), this.state.id);
		}.bind(this))
	},

	cancelHandle: function() {
		this.setState({
			modalVisible: false
		});
	},

	render: function() {
		return (
			<Modal visible={this.state.modalVisible}
				transparent={this.state.transparent}
				animated={this.state.animated} >
				<View style={styles.container}>
				 	<View style={styles.contentView}>
						<Text style={styles.titleView}>确认实际参加人数</Text>
						<View style={styles.itemView}>
							<Text style={styles.leftText}>成人：</Text>
							<TextInput style={styles.rightText}
								onChangeText={(peopleNum) => this.setState({peopleNum})} 
								value={this.state.peopleNum} 
								keyboardType='numeric'/>
						</View>
						<View style={styles.itemView}>
							<Text style={styles.leftText}>儿童(1.4米以上)：</Text>
							<TextInput style={styles.rightText} 
								onChangeText={(childNum1) => this.setState({childNum1})}
								value={this.state.childNum1}
								keyboardType='numeric' />
						</View>
						<View style={styles.itemViewLast}>
							<Text style={styles.leftText}>儿童(1.4米以下)：</Text>
							<TextInput style={styles.rightText}
								onChangeText={(childNum2) => this.setState({childNum2})}
								value={this.state.childNum2}
								keyboardType='numeric' />
						</View>
						<View style={styles.bottomView}>
							<TouchableOpacity style={styles.leftView}
								onPress={this.cancelHandle}>
								<Text style={styles.bottomLeftText}>取消</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.rightView} 
								onPress={this.ensureHandle}>
								<Text style={styles.bottomRightText}>确认</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		)
	}
});

var styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.8)'
	},

	contentView: {
		position: 'absolute',
		top: 100,
		left: 30,
		right: 30,
		flex: 1,
		flexDirection: 'column',
		borderWidth: 1 / PixelRatio.get(),
		borderColor: stylesVar('dark-mid-light'),
		borderRadius: 2 / PixelRatio.get(),
		backgroundColor: '#fff'
	},

	titleView: {
		flex: 1,
		textAlign: 'center',
		fontSize: 16,
		color: stylesVar('dark'),
		paddingVertical: 20
	},

	itemView: {
		flex: 1,
		flexDirection: 'row',
		marginHorizontal: 20,
		borderBottomColor: stylesVar('dark-mid-light'),
		borderBottomWidth: 1 / PixelRatio.get(),
		paddingHorizontal: 10,
		paddingVertical: 10
	},

	itemViewLast: {
		flex: 1,
		flexDirection: 'row',
		marginHorizontal: 20,
		paddingHorizontal: 10,
		paddingVertical: 10,
		marginBottom: 15
	},

	bottomView: {
		flex: 1,
		flexDirection: 'row',
		borderTopWidth: 1 / PixelRatio.get(),
		borderColor: stylesVar('dark-mid-light')
	},

	leftView: {
		flex: 1,
		alignItems: 'center',
		borderRightWidth: 1 / PixelRatio.get(),
		borderColor: stylesVar('dark-mid-light')
	},

	bottomLeftText: {
		fontSize: 16,
		paddingVertical: 17,
		color: stylesVar('dark')
	},

	rightView: {
		flex: 1,
		alignItems: 'center'	
	},

	bottomRightText: {
		fontSize: 16,
		paddingVertical: 17,
		color: stylesVar('blue')
	},

	leftText: {
		flex: 2,
		textAlign: 'left',
		fontSize: 14,
		color: stylesVar('dark-mid'),
		fontWeight: '300'
	},

	rightText: {
		flex: 1,
		textAlign: 'right',
		fontSize: 14,
		height: 14,
		color: stylesVar('dark'),
		fontWeight: '300'
	}
});

module.exports = ActivtyModal;