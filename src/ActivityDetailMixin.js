var React = require('react-native');

var {
    Animated,
    ActivityIndicatorIOS,
    StyleSheet,
    Dimensions,
    PixelRatio,
    ScrollView,
    Text,
    Image,
    View,
    TouchableOpacity,
    TouchableHighlight
} = React;

var ActivityApply = require('./ActivityApply');
var ActivityApplyInfo = require('./ActivityApplyInfo');

var activityApi = require('./api').activity;
var stylesVar = require('./stylesVar');
var su = require('./styleUtils');
var icons = require('./icons');

var {
    BaseTouchableOpacity
} = require('./widgets');

var Conversation = require('./friends/ConversationScene');

// override default components
var TouchableOpacity = BaseTouchableOpacity;
var RecordJourneyChoosePhoto = require('./RecordJourneyChoosePhoto');

var Mixin = {
    _apply: function() {
        var activity = this.state.activity;
        this.props.navigator.push(new ActivityApply({
            activity
        }));
    },

    _viewApplyInfo: function() {
        this.props.navigator.push(new ActivityApplyInfo(this.props.navigator, this.state.activity));
    },

    _contactCreator: function() {
        this.props.navigator.push(new Conversation(this.state.activity.getCreator()));
    },

    _recordActivity: function() {
        this.props.navigator.push(new RecordJourneyChoosePhoto());
    },

    renderBottom: function() {
        try {
            var _activity = this.state.activity;
            var state = _activity.getState();
            var isSponsor = this.state.user.id === _activity.getCreator().id;
            // TODO: fetch user relation
            var isEnter = this.state.isEnter;

            if (state === activityApi.PREPARING) { //活动没有结束
                if (!isEnter) { //没有报名
                    return (
                        <View style={styles.bottomBar}>
                            <TouchableOpacity
                                onPress={this._contactCreator}
                                style={styles.information}>
                                <Image source={icons.information} 
                                    style={styles.iconInformation}/>
                                <Text style={styles.informationText}>咨询楼主</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.apply}
                                onPress={this._apply}>
                                <Text style={styles.applyText}>我要报名</Text>
                            </TouchableOpacity>
                        </View>
                    );
                } else { //已经报名
                    return (
                        <View style={styles.bottomBar}>
                        <TouchableOpacity
                            style={[styles.information, styles.activityCircle]}>
                            <Image source={icons.activityCircleTrans}
                                style={styles.iconActivityCircle}/>
                            <Text style={styles.informationText}>活动圈子</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={this._viewApplyInfo}
                            style={styles.apply}>
                            <Text style={styles.applyText}>我的报名信息</Text>
                        </TouchableOpacity>
                    </View>
                    );
                }
            } else if (state === activityApi.TRAVELLING) {
                if (!isEnter) {
                    return (
                        <View style={styles.bottomBar}>
                        <TouchableOpacity 
                            onPress={this._contactCreator}
                            style={styles.information}>
                            <Image source={icons.information}
                                style={styles.iconInformation} />
                            <Text style={styles.informationText}>咨询楼主</Text>
                        </TouchableOpacity>
                    </View>
                    );
                } else {
                    return (
                        <View style={styles.bottomBar}>
                        <TouchableOpacity style={[styles.information, styles.blueLight]}>
                            <Image source={icons.activityCircleTrans}
                                style={styles.iconActivityCircle} />
                            <Text style={styles.informationText}>活动圈子</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.information, styles.green]}>
                            <Image source={icons.pictureTrans}
                                style={styles.iconPictureTrans} />
                            <Text style={styles.informationText}>分享照片</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.information, styles.red]} activeOpacity={0.8}
                            onPress={this._recordActivity}>
                            <Image source={icons.journeyTrans} style={styles.iconJourneyTrans} />
                            <Text style={styles.informationText}>写游记</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.information, styles.orange]}>
                            <Image source={icons.annotationTrans}
                                style={styles.iconAnnotationTrans} />
                            <Text style={styles.informationText}>上传轨迹</Text>
                        </TouchableOpacity>
                    </View>
                    );
                }
            }
        } catch (e) {
            console.trace(e);
        }
    }
};

var styles = StyleSheet.create({
    bottomBar: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },

    information: {
        flex: 1,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: stylesVar('green')
    },

    iconInformation: {
        width: 22,
        height: 22,
        marginBottom: 5
    },

    informationText: {
        color: stylesVar('white'),
        fontSize: 10
    },

    blueLight: {
        backgroundColor: stylesVar('blue-light')
    },

    iconActivityCircle: {
        width: 22,
        height: 22,
        marginBottom: 5
    },

    green: {
        backgroundColor: stylesVar('green')
    },

    iconPictureTrans: {
        ...su.size(22, 16),
            marginBottom: 5
    },

    red: {
        backgroundColor: stylesVar('red')
    },

    iconJourneyTrans: {
        ...su.size(16, 18),
            marginBottom: 5
    },

    orange: {
        backgroundColor: stylesVar('orange')
    },

    iconAnnotationTrans: {
        ...su.size(15, 20),
            marginBottom: 5
    },

    apply: {
        flex: 3,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: stylesVar('blue')
    },

    applyText: {
        fontSize: 20,
        color: stylesVar('white')
    }
});

module.exports = Mixin;
