var React = require('react-native');

var {
    View,
    Image,
    StyleSheet
} = React;

var {
    Line,
    LettersView,
    BaseText,
    BaseTextInput,
    BaseTouchableOpacity
} = require('../widgets');

var icons = require('../icons');

// override default compnents
var Text = BaseText;
var TextInput = BaseTextInput;
var TouchableOpacity = BaseTouchableOpacity;

var su = require('../styleUtils');

var ContactItem = React.createClass({

    render: function() {
        var item = this.props.item;

        return (
            <TouchableOpacity
                style={styles.item} 
                onPress={this.props.onPress}>
                <Image style={styles.avatar} 
                    source={item.avatar || icons.avatarPlaceholder}/>
                <Text style={styles.name}>{item.name}</Text>
            </TouchableOpacity>
        );
    }
});

var styles = StyleSheet.create({
    avatar: {
        borderRadius: 12.5,
        ...su.size(25)
    },

    name: {
        marginLeft: 5
    },

    item: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 16,
        height: 45
    }
});

module.exports = ContactItem;
