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

var activityApi = require('./api').activity;
var stylesVar = require('./stylesVar');
var su = require('./styleUtils');

var Mixin = {
    renderBottom: function() {
        var _activity = this.state.activity;
        var state = _activity.getState();
        var isSponsor = this.state.user.id === _activity.getCreator().id;
        // TODO: fetch user relation
        var isEnter = isSponsor || false;

        if (state === activityApi.PREPARING) { //活动没有结束
            if (!isEnter) { //没有报名
                return (
                    <View style={styles.bottomBar}>
                        <TouchableOpacity style={styles.information} activeOpacity={0.8}>
                            <Image source={require('image!icon-information')} style={styles.iconInformation}/>
                            <Text style={styles.informationText}>咨询楼主</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.apply}
                            activeOpacity={0.8} 
                            onPress={this._applyActivity}>
                            <Text style={styles.applyText}>我要报名</Text>
                        </TouchableOpacity>
                    </View>
                );
            } else { //已经报名
                return (
                    <View style={styles.bottomBar}>
                        <TouchableOpacity style={[styles.information, styles.activityCircle]} activeOpacity={0.8}>
                            <Image source={require('image!icon-activity-circle-trans')} style={styles.iconActivityCircle}/>
                            <Text style={styles.informationText}>活动圈子</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.apply} activeOpacity={0.8}>
                            <Text style={styles.applyText}>我的报名信息</Text>
                        </TouchableOpacity>
                    </View>
                );
            }
        } else if (state === activityApi.TRAVELLING) {
            if (!isEnter) {
                return (
                    <View style={styles.bottomBar}>
                        <TouchableOpacity style={styles.information} activeOpacity={0.8}>
                            <Image source={require('image!icon-information')} style={styles.iconInformation} />
                            <Text style={styles.informationText}>咨询楼主</Text>
                        </TouchableOpacity>
                    </View>
                );
            } else {
                return (
                    <View style={styles.bottomBar}>
                        <TouchableOpacity style={[styles.information, styles.blueLight]} activeOpacity={0.8}>
                            <Image source={require('image!icon-activity-circle-trans')} style={styles.iconActivityCircle} />
                            <Text style={styles.informationText}>活动圈子</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.information, styles.green]} activeOpacity={0.8}>
                            <Image source={require('image!icon-picture-trans')} style={styles.iconPictureTrans} />
                            <Text style={styles.informationText}>分享照片</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.information, styles.red]} activeOpacity={0.8}>
                            <Image source={require('image!icon-journey-trans')} style={styles.iconJourneyTrans} />
                            <Text style={styles.informationText}>写游记</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.information, styles.orange]} activeOpacity={0.8}>
                            <Image source={require('image!icon-annotation-trans')} style={styles.iconAnnotationTrans} />
                            <Text style={styles.informationText}>上传轨迹</Text>
                        </TouchableOpacity>
                    </View>
                );
            }
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
