var React = require('react-native');

var {
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

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

var su = require('./styleUtils');
var {
    Tag,
    UserInfo,
    ActivityRoute,
    ActivityPublishDate,
} = require('./widgets');

var ActivityDetail = React.createClass({
    _renderNavbar: function() {
        return (
            <View style={styles.navbar}>
                    <TouchableOpacity
                        style={styles.navbarLeft}
                        onPress={() => this.props.navigator.pop()}>
                        <Image style={styles.navBarLeftButton} source={require('image!back-icon')}/>
                    </TouchableOpacity>

                    <View style={styles.navbarRight}>
                        <Image style={styles.iconComments} source={require('image!icon-comments')}/>
                        <Text style={styles.navbarText}>127</Text>
                        <Image style={styles.iconStars} source={require('image!icon-stars-o')}/>
                        <Text style={styles.navbarText}>19</Text>
                        <Image style={styles.iconShare} source={require('image!icon-share')}/>
                    </View>
            </View>
        );
    },

    render: function() {
        var moment = require('moment');
        var publishDate = moment('2015-10-08 12:00').toDate();
        var startDate = moment('2015-10-09').toDate();
        var endDate = moment('2015-10-12').toDate();
        console.log(publishDate, startDate, endDate);
        var data = {
            id: 3,
            header: 'http://f.hiphotos.baidu.com/image/pic/item/b64543a98226cffc9b70f24dba014a90f703eaf3.jpg',
            title: 'GO！一起去草原撒野',
            status: 'preparing',
            tags: ['3-5车同行', '行程容易'],
            route: '北京 - 天津 - 石家庄',
            startDate: startDate,
            endDate: endDate,
            publishDate: publishDate,
            user: {
                username: 'Steven'
            },
            stars: 299
        };

        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollContainer}>
                    <Image 
                        source={require('image!banner-activity-placeholder')}
                        style={styles.banner}>
                        <UserInfo 
                            style={styles.info}
                            username="Steven"
                            publishDate={Date.now()}
                            avatar={require('image!avatar-placeholder')}/>
                    </Image>

                    <View style={[styles.section, styles.detail]}>
                        <View style={[styles.row, {paddingVertical: 12}]}>
                            <Text style={styles.title}>{data.title}</Text>
                        </View>
                        <View style={styles.row}>
                            <ActivityRoute route={data.route}/>
                        </View>
                        <View style={styles.row}>
                            <ActivityPublishDate data={data}/>
                        </View>
                        <View style={styles.tags}>
                            {data.tags.map(function(tag) {
                                return <Tag key={tag} style={[styles.tag, {marginRight: 10}]}>{tag}</Tag> 
                            })}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.row}>
                            <Image style={styles.countdown} source={require('image!icon-countdown')}/>
                            <Text style={styles.baseText}>报名倒计时：8天</Text>
                            <Text style={[styles.baseText, styles.gray]}>（截止日期：9月1日12:00）</Text>
                        </View>
                        <View style={[styles.row, {paddingLeft: 0, paddingVertical: 0}]}>
                            <View style={styles.numberLabel}>
                                <Text style={[styles.number, {color: '#61a9da'}]}>2</Text>
                                <Text style={styles.smallGray}>已报名车辆</Text>
                            </View>
                            <View style={styles.separator}></View>
                            <View style={styles.numberLabel}>
                                <Text style={[styles.number, {color: '#f2b658'}]}>12</Text>
                                <Text style={styles.smallGray}>剩余车辆名额</Text>
                            </View>
                            <View style={styles.separator}></View>
                            <View style={styles.numberLabel}>
                                <Text style={[styles.number, {color: '#92c056'}]}>1</Text>
                                <Text style={styles.smallGray}>剩余座位</Text>
                            </View>
                        </View>
                        <View style={[styles.row, {paddingLeft: 0, paddingVertical: 0}]}>
                            <View style={styles.note}>
                                <Image source={require('image!icon-photos')} style={styles.icon}/>
                                <Text style={styles.baseText}>相册</Text>
                                <Text style={styles.gray}>(0)</Text>
                            </View>
                            <View style={[styles.separator, {height: 45}]}></View>
                            <View style={styles.note}>
                                <Image source={require('image!icon-journey')} style={styles.icon}/>
                                <Text style={styles.baseText}>游记</Text>
                                <Text style={styles.gray}>(0)</Text>
                            </View>
                            <View style={[styles.separator, {height: 45}]}></View>
                            <View style={styles.note}>
                                <Image source={require('image!icon-annotations')} style={styles.icon}/>
                                <Text style={styles.baseText}>轨迹</Text>
                                <Text style={styles.gray}>(0)</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                {this._renderNavbar()}

                <View style={styles.bottomBar}>
                    <TouchableOpacity style={styles.information} activeOpacity={0.9}>
                        <Image source={require('image!icon-information')} style={{width: 22, height: 22, marginBottom: 5}}/>
                        <Text style={styles.informationText}>咨询</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.apply} activeOpacity={0.9}>
                        <Text style={styles.applyText}>我要报名</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f5f6'
    },

    scrollContainer: {
        position: 'absolute',
        bottom: 60,
        left: 0,
        right: 0,
        top: 0
    },

    navbar: {
      position: 'absolute',
      backgroundColor: 'transparent',
      top: 20,
      left: 0,
      right: 0,
      height: 44
    },

    navbarText: {
        fontSize: 10,
        color: '#fff',
        marginRight: 20,
        marginLeft: 5
    },

    navbarLeft: {
        position: 'absolute',
        left: 0,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center'
    },

    navBarLeftButton: {
        ...su.size(17, 15),
        marginLeft: 10,
    },

    iconComments: {
        ...su.size(17)
    },

    iconStars: {
        ...su.size(18, 17)
    },

    iconShare: {
        ...su.size(14, 20)
    },

    navbarRight: {
        position: 'absolute',
        right: 10,
        height: 44,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },

    banner: {
        height: 180,
        width: deviceWidth,
    },

    info: {
        position: 'absolute',
        left: 15,
        bottom: 15
    },

    section: {
        borderTopWidth: 1 / PixelRatio.get(),
        borderBottomWidth: 1 / PixelRatio.get(),
        borderColor: '#dbe0e3',
        backgroundColor: '#fff',
        marginBottom: 20
    },

    detail: {
        borderTopWidth: 0,
        paddingLeft: 8
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingLeft: 8,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#f3f5f6'
    },

    title: {
        color: '#030303',
        fontSize: 20
    },

    tag: {
        marginRight: 10,
        color: '#34be9a',
        borderColor: '#34be9a'
    },

    tags: {
        paddingLeft: 8,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },

    countdown: {
        paddingLeft: 8,
        ...su.size(9, 12),
        resizeMode: 'contain'
    },

    gray: {
        color: '#777'
    },

    numberLabel: {
        flex: 1,
        alignItems: 'center',
    },

    separator: {
        width: 1 / PixelRatio.get(),
        backgroundColor: '#f3f5f6',
        height: 90 
    },

    number: {
        fontSize: 40,
        marginBottom: 8
    },

    smallGray: {
        fontSize: 10,
        color: '#9c9b97'
    },

    note: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    icon: {
        ...su.size(24),
        marginRight: 5
    },

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
        backgroundColor: '#34be9a'
    },

    informationText: {
        color: '#fff',
        fontSize: 10
    },

    apply: {
        flex: 3,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0087fa'
    },

    applyText: {
        fontSize: 20,
        color: '#fff'
    }
});

module.exports = ActivityDetail;
