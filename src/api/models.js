var _ = require('underscore');
var moment = require('moment');
var mimeTypes = require('../mimetypes');

var AppID = '5jqgy6q659ljyldiik70cev6d8n7t1ixolt6rd7k6p1n964d';
var AppKey = 'bm0vszz9zd521yw8l40k6wdh6vsqq5aht92fdohlgzvwrgl4';

var AV = require('avoscloud-sdk');
AV.initialize(AppID, AppKey);

var debug = require('../debug')('api:log');
var warn = require('../debug')('api:warn');
var error = require('../debug')('api:error');

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

var UserPath = AV.Object.extend("UserPath", {

}, {

});

module.exports = {
    Photo,
    Region,
    Activity,
    Partner,
    AV,
  UserPath,
};
