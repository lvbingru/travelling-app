var _ = require('underscore');
var moment = require('moment');
var mimeTypes = require('../mimetypes');

var AppID = '5jqgy6q659ljyldiik70cev6d8n7t1ixolt6rd7k6p1n964d';
var AppKey = 'bm0vszz9zd521yw8l40k6wdh6vsqq5aht92fdohlgzvwrgl4';

var AV = require('avoscloud-sdk');
AV.initialize(AppID, AppKey);

var PrevFile = AV.File;

/*
 * FIXME: 暂时修改 leancloud 保存文件的方法，以支持在 react-native 中上传本地文件。
 * react-native 目前不支持直接上传二进制文件包括 base64 数据，但是 react-native 能
 * 在底层获取 uri 属性并将 uri 自动转换为文件
 * 详情可以看这个 issue 的讨论: https://github.com/facebook/react-native/issues/201
 * 
 * 注意: 修改之后，File 的创建方法只支持下面这一种:
 *
 * ```js
 * var file = new AV.File({
 *   blob: {
 *       name: name,
 *       uri: uri,
 *       type: 'image/jpeg'
 *   }
 * });
 * ```
 */
var File = function(name, data, type) {
    this._name = name;
    this._metaData = {
        owner: 'unknown'
    };

    // Guess the content type from the extension if we need to.
    var extension = /\.([^.]*)$/.exec(name);
    if (extension) {
        extension = extension[1].toLowerCase();
    }
    var guessedType = type || mimeTypes[extension] || "text/plain";
    this._guessedType = guessedType;

    if (data && data.blob) {
        this._source = AV.Promise.as(data.blob, guessedType);
    }
}

AV.File = File;

File.prototype = _.extend({}, PrevFile.prototype, {
    save: function(options) {
        var options = null;
        var saveOptions = {};
        if (arguments.length === 1) {
            options = arguments[0];
        } else if (arguments.length === 2) {
            saveOptions = arguments[0];
            options = arguments[1];
        }
        var self = this;
        if (!self._previousSave) {
            if (self._source) {
                // 替换原来的上传文件的实现方法
                // var upload = require('./browserify-wrapper/upload');
                var upload = _upload;
                upload(self, AV, saveOptions);
            } else if (self._url && self._metaData['__source'] == 'external') {
                //external link file.
                var data = {
                    name: self._name,
                    ACL: self._acl,
                    metaData: self._metaData,
                    mime_type: self._guessedType,
                    url: self._url
                };
                self._previousSave = AV._request("files", self._name, null, 'POST', data).then(function(response) {
                    self._name = response.name;
                    self._url = response.url;
                    self.id = response.objectId;
                    if (response.size) {
                        self._metaData.size = response.size;
                    }
                    return self;
                });
            }
        }
        return self._previousSave._thenRunCallbacks(options);
    }
});

function _upload(file) {
    file._previousSave = file._source.then(function(base64, type) {
        file._base64 = base64;
        return file._qiniuToken(type);
    }).then(function(response) {
        file._url = response.url;
        file._bucket = response.bucket;
        file.id = response.objectId;
        //Get the uptoken to upload files to qiniu.
        var uptoken = response.token;
        var formdata = new FormData();
        formdata.append('file', file._base64);
        formdata.append('token', uptoken);
        formdata.append('key', file._qiniu_key);
        return fetch('http://up.qiniu.com', {
            method: 'post',
            body: formdata
        }).then(function() {
            console.log(arguments);
            delete file._qiniu_key;
            delete file._base64;
            return file;
        }, function(e) {
            file.destroy();
            throw e;
        });
    });
}

AV.File.prototype.save = function(options) {
    var options = null;
    var saveOptions = {};
    if (arguments.length === 1) {
        options = arguments[0];
    } else if (arguments.length === 2) {
        saveOptions = arguments[0];
        options = arguments[1];
    }
    var self = this;
    if (!self._previousSave) {
        if (self._source) {
            // 替换原来的上传文件的实现方法
            // var upload = require('./browserify-wrapper/upload');
            var upload = _upload;
            upload(self, AV, saveOptions);
        } else if (self._url && self._metaData['__source'] == 'external') {
            //external link file.
            var data = {
                name: self._name,
                ACL: self._acl,
                metaData: self._metaData,
                mime_type: self._guessedType,
                url: self._url
            };
            self._previousSave = AV._request("files", self._name, null, 'POST', data).then(function(response) {
                self._name = response.name;
                self._url = response.url;
                self.id = response.objectId;
                if (response.size) {
                    self._metaData.size = response.size;
                }
                return self;
            });
        }
    }
    return self._previousSave._thenRunCallbacks(options);
}

var debug = require('../debug')('api:log');
var warn = require('../debug')('api:warn');
var error = require('../debug')('api:error');

_.extend(AV.User.prototype, {
    
});

var Photo = AV.Object.extend("Photo");
var Region = AV.Object.extend("Region");
var Partner = AV.Object.extend("Partner", {
    isFailed: function() {
        var state = this.get('status');
        return state === Partner.STATUS_REFUSED || state === Partner.STATUS_CANCELLED;
    }
}, {
    SELF_RIDE: 'selfRide',
    FREE_RIDE: 'freeRide',

    STATUS_IN_REVIEW: 'in-review',
    STATUS_REFUSED: 'refused',
    STATUS_APPROVAL: 'approval',
    STATUS_CANCELLED: 'cancelled',
    STATUS_CONFIRMED: 'confirmed'
});

var Activity = AV.Object.extend("Activity", {
    getCarsTag: function() {
        var minCars = this.get('minCars');
        var maxCars = this.get('maxCars');
        if (minCars === maxCars) {
            var carsTag = minCars + '车同行';
        } else {
            var carsTag = minCars + '-' + maxCars + '车同行';
        }
        return carsTag;
    },

    getRouteTag: function() {
        // TODO: 这个tag是怎么来的？
        var routeTag = '行车容易';
        return routeTag;
    },

    getCover: function() {
        var FALLBACK = 'http://f.hiphotos.baidu.com/image/pic/item/b64543a98226cffc9b70f24dba014a90f703eaf3.jpg';
        var cover = this.get('cover');
        return cover && cover.url() ? cover.thumbnailURL(960, 480) : FALLBACK;
    },

    _ensureAppCache: function() {
        if (!this._appCache) {
            this._appCache = {};
        }
    },

    setStars: function(stars) {
        this._ensureAppCache();
        this._appCache.stars = stars;
    },

    getStars: function() {
        this._ensureAppCache();
        return this._appCache.stars;
    },

    setStarred: function(starred) {
        this._ensureAppCache();
        this._appCache.starred = starred;
    },

    getStarred: function() {
        this._ensureAppCache();
        return this._appCache.starred;
    },

    getState: function() {
        var now = moment().startOf('day').toDate();
        if (now <= this.get('entryDeadline')) {
            return Activity.PREPARING
        } else {
            return Activity.TRAVELLING
        }
    },

    getLeftSeats: function() {
        var query = new AV.Query(Partner);
        query.equalTo('activity', this);
        query.notEqualTo('status', Partner.STATUS_CONFIRMED);
        return new Promise(function(resolve, reject) {
            query.find({
                success: function(partners) {
                    var selfRidePartners = _.filter(partners, (partner) => {
                        return partner.get('type') === Partner.SELF_RIDE;
                    });

                    var freeRidePartners = _.filter(partners, (partner) => {
                        return partner.get('type') === Partner.FREE_RIDE;
                    });

                    var totalSeats = _.reduce(selfRidePartners, (memo, partner) => {
                        return memo + partner.get('leftSeats');
                    }, 0);

                    var seats = _.reduce(freeRidePartners, (memo, partner) => {
                        return memo + (partner.get('peopleNum') || 0) +
                            (partner.get('childNum') || 0);
                    }, 0);

                    resolve(totalSeats - seats);
                },

                reject: reject
            });
        });
    },

    getCreator: function() {
        return this.get('createBy');
    },

    daysLeftForApply: function() {
        var deadline = this.get('entryDeadline');
        var now = new Date();
        return Math.ceil((deadline - now) / 24 / 3600 / 1000) + 1;
    },

    fetchStars: function() {
        var query = AV.Relation.reverseQuery('_User', 'starredActivities', this);
        return new Promise(function(resolve, reject) {
            query.count({
                success: function(count) {
                    debug('users', count);
                    resolve(count);
                },

                error: function(e) {
                    error('fail to fetch stars');
                    error(e);
                    resolve(0);
                }
            });
        });
    },

    isUserApplied: function(user) {
        var query = new AV.Query(Partner);
        query.equalTo('user', user);
        query.equalTo('activity', this);
        return query.count().then(function(count) {
            return count > 0;
        });
    },

    isUserStarred: function(user) {
        var id = this.id;
        return new Promise(function(resolve, reject) {
            var query = user.relation('starredActivities').query();
            query.equalTo('objectId', id);
            query.count({
                success: function(count) {
                    debug('count', count);
                    resolve(count === 1);
                },

                error: function(e) {
                    error('fail to detect star');
                    error(e);
                    resolve(false);
                }
            });
        });
    },

    addPartner: function(user) {
        var partner = new Partner();
        partner.set('activity', this);
        partner.set('user', user);
        return partner.save();
    }
}, {
    PREPARING: 'preparing',
    TRAVELLING: 'travelling'
});


module.exports = {
    Photo,
    Region,
    Activity,
    Partner,
    AV
};
