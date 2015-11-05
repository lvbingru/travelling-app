var {
    Activity,
    AV
} = require('./models');

var shortid = require('shortid');

var React = require('react-native');
var NativeModules = React.NativeModules;
var UserApi = NativeModules.UserApi;

function currentUser() {
    return AV.User.currentAsync();
    // return new Promise(function(resolve, reject) {
    // 	UserApi.currentUser(function(e, user) {
    // 		if (e) {
    // 			reject(e);
    // 		} else {
    // 			resolve(user);
    // 		}
    // 	});
    // });
}

function signup(phone, password) {
    return AV.User.signUp('u' + shortid.generate(), password, {
        mobilePhoneNumber: phone
    });

    // return new Promise(function(resolve, reject) {
    // 	UserApi.signup(phone, password, function(e, user) {
    // 		if (e) {
    // 			reject(e);
    // 		} else {
    // 			resolve(user);
    // 		}
    // 	});
    // });
}

function signin(phone, password) {
    return AV.User.logInWithMobilePhone(phone, password)

    // return new Promise(function(resolve, reject) {
    // 	UserApi.signin(phone, password, function(e, user) {
    // 		if (e) {
    // 			reject(e);
    // 		} else {
    // 			resolve(user);
    // 		}
    // 	});
    // });
}

function logout() {
    return AV.User.logOut();

    // return new Promise(function(resolve, reject) {
    // 	UserApi.logout(function(e) {
    // 		if (e) {
    // 			reject(e);
    // 		} else {
    // 			resolve();
    // 		}
    // 	});
    // });
}

function starActivity(activity) {
    return AV.User.currentAsync().then(function(user) {
        user.relation('starredActivities').add(activity);
        return user.save();
    });
}

function unstarActivity(activity) {
    return AV.User.currentAsync().then(function(user) {
        user.relation('starredActivities').remove(activity);
        return user.save();
    });
}

module.exports = {
    currentUser,
    signup,
    signin,
    logout,
    starActivity,
    unstarActivity
};
