var AppID = '5jqgy6q659ljyldiik70cev6d8n7t1ixolt6rd7k6p1n964d';
var AppKey = 'bm0vszz9zd521yw8l40k6wdh6vsqq5aht92fdohlgzvwrgl4';

var AV = require('avoscloud-sdk');
AV.initialize(AppID, AppKey);


var _ = require('underscore');
var extName = require('ext-name');
var shortid = require('shortid');
var rnfs = require('react-native-fs');
var moment = require('moment');
var user = require('./user');

var Photo = AV.Object.extend("Photo");
var Activity = AV.Object.extend("Activity");

var commonHeaders = {
    'X-LC-Id': AppID,
    'X-LC-Key': AppKey,
    'Content-Type': 'application/json'
}

var sms = {
    requestSmsCode: function(phone) {
        // TODO: implement sms api
        return new Promise(function(resolve, reject) {
            resolve();
        });

        // return fetch('https://leancloud.cn/1.1/requestSmsCode', {
        // 	method: 'post',
        // 	headers: commonHeaders,
        // 	body: JSON.stringify({
        // 		mobilePhoneNumber: phone
        // 	})
        // }).then(function(response) {
        // 	var data = JSON.parse(response._bodyInit);
        // 	if (response.status === 200) {
        // 		return data;
        // 	} else {
        // 		var e = Error('ERROR ' + data.code + ' ' + data.error);
        // 		e.response = response;
        // 		e.data = data;
        // 		throw e;
        // 	}
        // });
    },

    verifySmsCode: function(phone, code) {
        // TODO: implement sms api
        return new Promise(function(resolve, reject) {
            resolve(code == '123456');
        });

        // var url = 'https://leancloud.cn/1.1/requestSmsCode/' + code + '?mobilePhoneNumber=' + phone;
        // return fetch(url, {
        // 	method: 'post',
        // 	headers: commonHeaders
        // }).then(function(response) {
        // 	// return response.status === 200;
        // 	return code == '123456';
        // }, function() {
        // 	// return false;
        // 	return code == '123456';
        // });
    }
};

var activity = {
    PREPARING: 'preparing',
    TRAVELLING: 'travelling',

    publish: function(data) {
    	var _activity = new Activity();
    	_.each(data, function(value, key) {
    		_activity.set(key, value instanceof Date ? value.getTime() : value);
    	});

    	return AV.User.currentAsync().then(function(user) {
    		var _user = new AV.User();
    		_user.id = user.id;
    		_activity.set('createBy', _user);
    		var acl = new AV.ACL();
    		acl.setPublicWriteAccess(false);
    		acl.setWriteAccess(user, true);
    		_activity.setACL(acl);
    		return _activity.save();
    	})
    },

    fetch: function(params) {
        // TOOD: implement activity query api

        return new Promise(function(resolve, reject) {
            var publishDate = moment('2015-10-08 12:00').toDate();
            var startDate = moment('2015-10-09').toDate();
            var endDate = moment('2015-10-12').toDate();
            console.log(publishDate, startDate, endDate);

            var data = {
                results: [{
                    id: 1,
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
                }, {
                    id: 2,
                    header: 'http://f.hiphotos.baidu.com/image/pic/item/b64543a98226cffc9b70f24dba014a90f703eaf3.jpg',
                    title: 'GO！一起去草原撒野',
                    status: 'travelling',
                    tags: ['3-5车同行', '行程容易'],
                    route: '北京 - 天津 - 石家庄',
                    startDate: startDate,
                    endDate: endDate,
                    publishDate: publishDate,
                    user: {
                        username: 'Steven'
                    },
                    stars: 299
                }, {
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
                }]
            }

            var region = params.region;
            if (region && region !== 'all') {
                data.results.splice(0, 2);
            }

            setTimeout(function() {
                resolve(data);
            }, 0);
        });

        // return fetch("https://api.leancloud.cn/1.1/classes/Activity", {
        // 	headers: commonHeaders,
        // 	params: {
        // 		region: region
        // 	}
        // }).then(function(response) {
        //     if (response.status === 200) {
        // 		return response.json();
        //     } else {
        // 		var e = Error('ERROR ' + data.code + ' ' + data.error);
        // 		e.response = response;
        // 		e.data = data;
        // 		throw e;
        //     }
        // });
    },
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

module.exports = {
    user,
    sms,
    activity,
    userinfo,
    journey,
    uploadPhoto
};
