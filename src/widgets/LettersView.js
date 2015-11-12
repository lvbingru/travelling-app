var React = require('react-native');

var {
    StyleSheet,
    View
} = React;

var {
    BaseText,
    BaseTouchableOpacity
} = require('./baseComponents');

// override default compnents
var Text = BaseText;
var TouchableOpacity = BaseTouchableOpacity;

var su = require('../styleUtils');
var stylesVar = require('../stylesVar');

var LETTERS = [
    'A', 'B', 'C', 'D', 'E', 'F',
    'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T',
    'U', 'V', 'W', 'X', 'Y', 'Z', '#'
];

var LettersView = React.createClass({

    getDefaultProps: function() {
        return {
            letters: LETTERS
        }
    },

    statics: {
        LETTERS: LETTERS,
    },

    render: function() {
        return (
            <View style={[styles.letters, this.props.style]}>
                {this.props.letters.map((letter) => {
                    return (
                        <TouchableOpacity 
                            onPress={() => this.props.onLetterPress(letter)}>
                            <Text style={styles.letter}>{letter}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        )
    }
});

var styles = StyleSheet.create({
    letters: {},

    letter: {
        fontFamily: 'Arial',
        color: stylesVar('blue'),
        fontSize: 9,
        textAlign: 'center',
        width: 12
    }
});

module.exports = LettersView;
