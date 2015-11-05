var {
    Photo,
    Region,
    Activity,
    Partner,
    AV
} = require('./models');

var _ = require('underscore');
var extName = require('ext-name');
var shortid = require('shortid');
var mimetypes = require('../mimetypes');
var rnfs = require('react-native-fs');
var moment = require('moment');
var user = require('./user');

var sms = {
    requestSmsCode: function(phone) {
        // TODO: implement sms api
        return new Promise(function(resolve, reject) {
            resolve();
        });

        // return fetch('https://leancloud.cn/1.1/requestSmsCode', {
        //  method: 'post',
        //  headers: commonHeaders,
        //  body: JSON.stringify({
        //      mobilePhoneNumber: phone
        //  })
        // }).then(function(response) {
        //  var data = JSON.parse(response._bodyInit);
        //  if (response.status === 200) {
        //      return data;
        //  } else {
        //      var e = Error('ERROR ' + data.code + ' ' + data.error);
        //      e.response = response;
        //      e.data = data;
        //      throw e;
        //  }
        // });
    },

    verifySmsCode: function(phone, code) {
        // TODO: implement sms api
        return new Promise(function(resolve, reject) {
            resolve(code == '123456');
        });

        // var url = 'https://leancloud.cn/1.1/requestSmsCode/' + code + '?mobilePhoneNumber=' + phone;
        // return fetch(url, {
        //  method: 'post',
        //  headers: commonHeaders
        // }).then(function(response) {
        //  // return response.status === 200;
        //  return code == '123456';
        // }, function() {
        //  // return false;
        //  return code == '123456';
        // });
    }
};

var activity = {
    PREPARING: Activity.PREPARING,
    TRAVELLING: Activity.TRAVELLING,

    fetch: function(params) {
        // TODO: filter by region
        var _fetchActivities = new Promise(function(resolve, reject) {
            var query = new AV.Query(Activity);
            if (params.latestDate) {
                query.lessThan('createdAt', params.latestDate);
            }

            query.limit(params.limit || 5);
            query.descending('createdAt');
            query.find({
                success: function(activities) {
                    setTimeout(function() {
                        resolve(activities);
                    }, 1000);
                },
                error: reject
            })
        });

        var user, activities;
        return AV.User.currentAsync().then(function(_user) {
            user = _user;
            return _fetchActivities;
        }).then(function(_activities) {
            activities = _activities
            return Promise.all(activities.map(function(activity) {
                var creator = activity.get('createBy');
                return creator.fetch();
            }));
        }).then(function() {
            // stars
            return Promise.all(activities.map(function(activity) {
                return activity.fetchStars().then(function(stars) {
                    activity.setStars(stars);
                    return activity;
                });
            }));
        }).then(function() {
            // starred
            return Promise.all(activities.map(function(activity) {
                return activity.isUserStarred(user).then(function(starred) {
                    activity.setStarred(starred);
                    return activity;
                });
            }));
        }).then(function() {
            return activities;
        });
    },

    editApply: function(user, activity, origin, type, datas) {
        origin.clear();

        origin.set('activity', activity);
        origin.set('user', user);
        origin.set('status', Partner.STATUS_IN_REVIEW);

        origin.set('type', type);
        origin.set('phone', datas.phone);

        if (typeof datas.peopleNum === 'string') {
            datas.peopleNum = parseInt(datas.peopleNum);
        }
        origin.set('peopleNum', datas.peopleNum);

        datas.childNum = datas.childNum || 0;
        if (typeof datas.childNum === 'string') {
            datas.childNum = parseInt(datas.childNum);
        }
        origin.set('childNum', datas.childNum);

        if (type === Partner.SELF_RIDE) {
            origin.set('car', {
                model: datas.carType,
                number: datas.carNumber
            });

            if (typeof datas.leftSeats == 'string') {
                datas.leftSeats = parseInt(datas.leftSeats);
            }
            origin.set('leftSeats', datas.leftSeats || 0);
            origin.set('share', datas.share);
        } else {
            origin.set('canDrive', datas.canDrive);
        }

        return origin.save();
    },

    apply: function(user, activity, type, datas) {
        var query = new AV.Query(Partner);
        query.equalTo('user', user);
        query.equalTo('activity', activity);
        return query.count().then(function(count) {
            if (count > 0) {
                throw new Error('已经报过名了');
            }
        }).then(function() {
            var partner = new Partner();
            partner.set('activity', activity);
            partner.set('user', user);
            partner.set('status', Partner.STATUS_IN_REVIEW);

            partner.set('type', type);
            partner.set('phone', datas.phone);

            if (typeof datas.peopleNum === 'string') {
                datas.peopleNum = parseInt(datas.peopleNum);
            }
            partner.set('peopleNum', datas.peopleNum);

            datas.childNum = datas.childNum || 0;
            if (typeof datas.childNum === 'string') {
                datas.childNum = parseInt(datas.childNum);
            }
            partner.set('childNum', datas.childNum);

            if (type === Partner.SELF_RIDE) {
                partner.set('car', {
                    model: datas.carType,
                    number: datas.carNumber
                });

                if (typeof datas.leftSeats == 'string') {
                    datas.leftSeats = parseInt(datas.leftSeats);
                }
                partner.set('leftSeats', datas.leftSeats || 0);
                partner.set('share', datas.share);
            } else {
                partner.set('canDrive', datas.canDrive);
            }

            return partner.save();
        });
    },

    fetchDetail: function(id) {
        return new Promise(function(resolve, reject) {
            var moment = require('moment');

            var detail1 = {
                id: 5,
                header: 'http://f.hiphotos.baidu.com/image/pic/item/b64543a98226cffc9b70f24dba014a90f703eaf3.jpg',
                title: 'GO！一起去草原撒野',
                status: 'preparing',
                tags: ['3-5车同行', '行程容易'],
                route: '北京 - 天津 - 石家庄',
                startDate: moment('2015-09-03').toDate(),
                endDate: moment('2015-09-10').toDate(),
                publishDate: moment('2015-08-09'),
                user: {
                    username: 'Steven',
                    avatar: 'http://localhost:8081/img/avatar-placeholder.png'
                },
                stars: 299,
                remainDay: 8,
                deadline: '9月1日12:00',
                haveCar: 2,
                needCar: 3,
                remainSeat: 12,
                photos: 2,
                journeys: 2,
                annotations: 3,
                ownCar: '1'
            }

            var detail2 = {
                id: 6,
                header: 'http://f.hiphotos.baidu.com/image/pic/item/b64543a98226cffc9b70f24dba014a90f703eaf3.jpg',
                title: 'GO！一起去草原撒野',
                status: 'preparing',
                tags: ['3-5车同行', '行程容易'],
                route: '北京 - 天津 - 石家庄',
                startDate: moment('2015-09-03').toDate(),
                endDate: moment('2015-09-10').toDate(),
                publishDate: moment('2015-08-09'),
                user: {
                    username: 'Steven',
                    avatar: 'http://localhost:8081/img/avatar-placeholder.png'
                },
                stars: 299,
                remainDay: 8,
                deadline: '9月1日12:00',
                haveCar: 2,
                needCar: 3,
                remainSeat: 12,
                photos: 2,
                journeys: 2,
                annotations: 3,
                ownCar: '0'
            }

            if (id == 5) {
                setTimeout(function() {
                    resolve(detail1);
                }, 0);
            } else {
                setTimeout(function() {
                    resolve(detail2);
                }, 0);
            }
        });
    },
    fetchMoreDetail: {
        fetchRoute: function(query) {
            return new Promise(function(resolve, reject) {
                var datas = {
                    routeImg: 'http://f.hiphotos.baidu.com/image/pic/item/b64543a98226cffc9b70f24dba014a90f703eaf3.jpg',
                    info: '当离开这个荒芜的社会，进入繁华的沙漠时，一个人的思想就变了。只有在这里，你才能感受到自己的真实，而不是被社会被世俗所束缚的自己，你的思想才能变得丰富起来，同样在这里，你才能看到朋友真实的一面。'
                }

                setTimeout(function() {
                    resolve(datas);
                }, 1000);
            });
        },
        fetchDetail: function(query) {
            return new Promise(function(resolve, reject) {
                var datas = {
                    info: '当离开这个荒芜的社会，进入繁华的沙漠时，一个人的思想就变了。只有在这里，你才能感受到自己的真实，而不是被社会被世俗所束缚的自己，你的思想才能变得丰富起来，同样在这里，你才能看到朋友真实的一面。'
                }

                setTimeout(function() {
                    resolve(datas);
                }, 1000);
            });
        },
        fetchTips: function(query) {
            return new Promise(function(resolve, reject) {
                var datas = {
                    participantInfo: '当离开这个荒芜的社会，进入繁华的沙漠时，一个人的思想就变了。只有在这里，你才能感受到自己的真实，而不是被社会被世俗所束缚的自己，你的思想才能变得丰富起来，同样在这里，你才能看到朋友真实的一面。',
                    devInfo: '车辆类型：SUV/4驱SUV\n每车必备：车台/备胎/拖车绳\n车队至少有一套：充气泵/铁锹/维修工具',
                    moneyInfo: '本次活动费用预估1200元，包含汽油费、过路费、住宿费、门票费。'
                }

                setTimeout(function() {
                    resolve(datas);
                }, 1000);
            });
        },
        fetchDanger: function(query) {
            return new Promise(function(resolve, reject) {
                var datas = {
                    info: '当离开这个荒芜的社会，进入繁华的沙漠时，一个人的思想就变了。只有在这里，你才能感受到自己的真实，而不是被社会被世俗所束缚的自己，你的思想才能变得丰富起来，同样在这里，你才能看到朋友真实的一面。\n\n我知道不少人看完电影会问，最后他们走出沙漠了吗？'
                }

                setTimeout(function() {
                    resolve(datas);
                }, 1000);
            });
        }
    },
    fetchComments: function() {
        return new Promise(function(resolve, reject) {
            var datas = [{
                user: {
                    username: '赵鑫',
                    avatar: 'http://localhost:8081/img/avatar-placeholder.png'
                },
                info: '这里的风景真是好棒哦，太美了～',
                publishDate: '下午 22：13',
                star: 180,
                isLike: '1',
                images: []
            }, {
                user: {
                    username: '赵鑫',
                    avatar: 'http://localhost:8081/img/avatar-placeholder.png'
                },
                info: '今天和大家一起好开心，山清水秀好风光好景色，小赵同学是个吃货，以后不想和他一起出去玩。',
                publishDate: '下午 22：13',
                star: 180,
                isLike: '0',
                images: ['http://localhost:8081/img/page1.png', 'http://localhost:8081/img/signin-bg.png', 'http://localhost:8081/img/space-header.png']
            }]

            setTimeout(function() {
                resolve(datas);
            }, 1000);
        });
    },

    fetchApplyInfo: function(user, activity) {
        return new Promise(function(resolve, reject) {
            var query = new AV.Query(Partner);
            query.equalTo('user', user);
            query.equalTo('activity', activity);
            query.first({
                success: resolve,
                error: reject
            });
        });
    },

    fetchManageInfo: function(activity) {
        return new Promise(function(resolve, reject) {
            var query = new AV.Query(Partner);
            query.equalTo('activity', activity);
            query.include('user');

            query.find({
                success: function(partners) {
                    var results = partners.map((item) => {
                        var subItem = item.attributes;
                        var user = subItem.user.attributes;
                        var datas = {
                            id: item.id,
                            user: {
                                username: user.username,
                                avatar: user.avatar,
                                publishDate: item.updatedAt
                            },
                            type: subItem.type,
                            status: subItem.status,
                            car: subItem.car,
                            phone: subItem.phone,
                            peopleNum: subItem.peopleNum,
                            childNum: subItem.childNum,
                            leftSeats: subItem.leftSeats,
                            share: subItem.share,
                            canDrive: subItem.canDrive
                        };
                        return datas;
                    })
                    resolve(results);
                },
                error: function(error) {
                    reject("Error: " + error.code + " " + error.message);
                }
            });
        });
    },

    changeManageStatus: function(id, status) {
        return new Promise(function(resolve, reject) {
            var query = new AV.Query(Partner);
            query.equalTo('objectId', id);
            query.find().then(function(results) {
                results[0].set('status', status);
                return results[0].save();
            }).then(function() {
                resolve('success');
            }, function(e) {
                reject(e);
            })
        });
    },

    ensureManage: function(id, peopleNum, childNum, childNum2) {
        return new Promise(function(resolve, reject) {
            var query = new AV.Query(Partner);
            query.equalTo('objectId', id);
            query.find().then(function(results) {
                results[0].set('status', Partner.STATUS_CONFIRMED);
                results[0].set('peopleNum', parseInt(peopleNum))
                results[0].set('childNum', parseInt(childNum))
                results[0].set('childNum2', parseInt(childNum2))
                return results[0].save();
            }).then(function() {
                resolve('success');
            }, function(e) {
                reject(e);
            })
        });
    },

    publish: function(data) {
        var cover = data.cover;

        var ext = cover.uri.split(/ext=/)[1].toLowerCase();
        var name = shortid.generate() + '.' + ext;
        var file = new AV.File(name, {
            blob: {
                name: name,
                uri: cover.uri,
                type: mimetypes[ext]
            }
        });

        return Promise.all([
            AV.User.currentAsync(),
            file.save()
        ]).then(function(values) {
            var [user, cover] = values;

            delete data.cover;
            var _activity = new Activity();
            _.each(data, function(value, key) {
                _activity.set(key, value);
            });
            var _user = new AV.User();
            _user.id = user.id;
            _activity.set('createBy', _user);
            _activity.set('cover', cover)
            var acl = new AV.ACL();
            acl.setPublicWriteAccess(false);
            acl.setPublicReadAccess(true);
            acl.setWriteAccess(user, true);
            _activity.setACL(acl);
            return _activity.save();
        });
    }
};

var journey = {
    fetch: function() {
        return new Promise(function(resolve, reject) {
            var journeys = [{
                id: 1,
                header: 'http://f.hiphotos.baidu.com/image/pic/item/b64543a98226cffc9b70f24dba014a90f703eaf3.jpg',
                title: '最美的时光在路上',
                views: 1321,
                stars: 21,
                publishDate: Date.now(),
                user: {
                    username: 'Steven'
                }
            }, {
                id: 2,
                header: 'http://f.hiphotos.baidu.com/image/pic/item/b64543a98226cffc9b70f24dba014a90f703eaf3.jpg',
                title: '最美的时光在路上',
                views: 1321,
                stars: 21,
                publishDate: Date.now(),
                user: {
                    username: 'Steven'
                }
            }, {
                id: 3,
                header: 'http://f.hiphotos.baidu.com/image/pic/item/b64543a98226cffc9b70f24dba014a90f703eaf3.jpg',
                title: '最美的时光在路上',
                views: 1321,
                stars: 21,
                publishDate: Date.now(),
                user: {
                    username: 'Steven'
                }
            }, {
                id: 4,
                header: 'http://f.hiphotos.baidu.com/image/pic/item/b64543a98226cffc9b70f24dba014a90f703eaf3.jpg',
                title: '最美的时光在路上',
                views: 1321,
                stars: 21,
                publishDate: Date.now(),
                user: {
                    username: 'Steven'
                }
            }, {
                id: 5,
                header: 'http://f.hiphotos.baidu.com/image/pic/item/b64543a98226cffc9b70f24dba014a90f703eaf3.jpg',
                title: '最美的时光在路上',
                views: 1321,
                stars: 21,
                publishDate: Date.now(),
                user: {
                    username: 'Steven'
                }
            }, {
                id: 6,
                header: 'http://f.hiphotos.baidu.com/image/pic/item/b64543a98226cffc9b70f24dba014a90f703eaf3.jpg',
                title: '最美的时光在路上',
                views: 1321,
                stars: 21,
                publishDate: Date.now(),
                user: {
                    username: 'Steven'
                }
            }];

            setTimeout(function() {
                resolve({
                    results: journeys
                });
            }, 0);
        });
    }
};

var userinfo = {
    fetch: async function() {
        var user = await AV.User.currentAsync();

        return {
            results: {
                username: user.get('username'),
                phone: user.get('mobilePhoneNumber'),
                grade: 1,
                activity: 8,
                journey: 8,
                annotations: 8,
                photos: 8,
                bills: 8,
                avatar: 'http://localhost:8081/img/avatar-placeholder.png'
            }
        }
    }
};


function uploadPhoto(path) {
    console.log(path);
    var file = AV.File.withURL(shortid.generate() + "." + extName(path).ext, path);
    return file.save().then(function(file) {
        var photo = new Photo();
        photo.set('file', file);
        return photo.save();
    });
}

var REGIONS = [{
    tag: 'all',
    name: '全部',
    icon: require('image!icon-region-shanxi')
}, {
    tag: 'beijing',
    name: '北京',
    icon: require('image!icon-region-beijing'),
}, {
    tag: 'hebei',
    name: '河北',
    icon: require('image!icon-region-hebei'),
}, {
    tag: 'shandong',
    name: '山东',
    icon: require('image!icon-region-shandong'),
}, {
    tag: 'tianjin',
    name: '天津',
    icon: require('image!icon-region-tianjin'),
}, {
    tag: 'neimenggu',
    name: '内蒙古',
    icon: require('image!icon-region-neimenggu'),
}];

var _regions, _loadingRegions = false;

function regions() {
    // TODO: fetch regions from leancloud
    // if (_regions) {
    //     return _regions;
    // }

    // if (!_loadingRegions) {
    //     _loadingRegions = true;
    //     var query = new AV.Query(region);
    //     query.find().then(function(regions) {
    //         _regions = regions.map((item) => item.toJSON());
    //     }).finally(function() {
    //         _loadingRegions = false;
    //     });
    // }

    return REGIONS;
}

module.exports = {
    user,
    sms,
    activity,
    userinfo,
    journey,
    uploadPhoto,
    regions,
    Partner,
    AV
};
