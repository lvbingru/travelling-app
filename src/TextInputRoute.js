var React = require('react-native');

var {
    View,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet
} = React;

var stylesVar = require('./stylesVar');

var TextInputScene = React.createClass({

    displayName: 'TextInputScene',

    getInitialState: function() {
        return {
            value: this.props.initValue || ''
        };
    },

    componentDidMount: function() {
        this._subscribe = this.props.navbar.addListener('save', function() {
            this.props.onResult(this.state.value);
            this.props.navigator.pop();
        }.bind(this));
    },

    componentWillUnmount: function() {
        this._subscribe.remove();
    },

    render: function() {
        return (
            <View style={[styles.container, this.props.style]}>
                <TextInput 
                    autoFocus={true}
                    multiline={true} 
                    style={styles.textInput}
                    onChangeText={(value) => this.setState({value})} 
                    value={this.state.value}/>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: stylesVar('bg-gray')
    },

    textInput: {
        backgroundColor: 'white',
        padding: 10,
        height: 95,
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: stylesVar('dark-lighter'),
        borderBottomWidth: 1,
        borderBottomColor: stylesVar('dark-lighter'),
    }
});

var BaseRouteMapper = require('./BaseRouteMapper');
var EventEmitter = require('EventEmitter');

class TextInputRoute extends BaseRouteMapper {

    constructor(params) {
        super();
        this.params = params;
        this.emitter = new EventEmitter();
    }

    get title() {
        return this.params.title || "输入文字";
    }

    _onSave() {
        this.emitter.emit('save');
    }

    renderLeftButton(route, navigator, index, navState) {
        return this._renderBackButton(route, navigator, index, navState);
    }

    renderRightButton(route, navigator, index, navState) {
        return React.cloneElement(this._renderRightButton('确认'), {
            onPress: this._onSave.bind(this)
        })
    }

    renderScene() {
        return (
            <TextInputScene 
                navbar={this.emitter}
                initValue={this.params.initValue}
                onResult={this.params.onResult}/>
        );
    }
}

module.exports = TextInputRoute;
