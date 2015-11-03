var React = require('react-native');

var {
    View,
    StyleSheet
} = React;

var {
    Tag
} = require('./widgets');

var {
    activity
} = require('./api');

var stylesVar = require('./stylesVar');

var ActivityTags = React.createClass({

    getDefaultProps: function() {
        return {
            showState: true
        };
    },

    render: function() {
        var _activity = this.props.data;

        var tags = [
            <Tag style={[styles.tag, this.props.tagStyle]} 
                key='tag-cars'>{_activity.getCarsTag()}</Tag>,
            <Tag style={[styles.tag, this.props.tagStyle]}
                key='tag-route'>{_activity.getRouteTag()}</Tag>,
        ];

        if (this.props.showState) {
            if (_activity.getState() === activity.PREPARING) {
                var stateTag = <Tag key='tag-state' style={styles.tagHot}>火热报名中</Tag>;
            } else {
                var stateTag = <Tag key='tag-state' style={styles.tagDue}>报名已截止</Tag>;
            }
            tags = [stateTag].concat(tags);
        }

        return (
            <View style={[styles.tags, this.props.style]}>{tags}</View>
        );
    }
});

var styles = StyleSheet.create({
    tags: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    tag: {
        marginRight: 5,
    },

    tagHot: {
        marginRight: 5,
        borderColor: '#f03a47',
        backgroundColor: '#f03a47'
    },

    tagDue: {
        marginRight: 5,
        borderColor: stylesVar('green'),
        backgroundColor: stylesVar('green')
    }
})

module.exports = ActivityTags;
