var {
    createStore,
    applyMiddleware
} = require('redux');

var thunkMiddleware = require('redux-thunk');
// var createLogger = require('redux-logger');
var rootReducer = require('./reducers');

const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware,
    // createLogger
)(createStore);

function configureStore(initialState) {
    return createStoreWithMiddleware(rootReducer, initialState);
}

var store = configureStore({
    selectedRegion: {
        id: 0,
        tag: 'all',
        name: '全部',
        icon: require('image!icon-region-shanxi')
    },

    regions: [{
        id: 1,
        tag: 'all',
        name: '全部',
        icon: require('image!icon-region-shanxi')
    }, {
        id: 2,
        tag: 'beijing',
        name: '北京',
        icon: require('image!icon-region-beijing'),
    }, {
        id: 3,
        tag: 'hebei',
        name: '河北',
        icon: require('image!icon-region-hebei'),
    }, {
        id: 4,
        tag: 'shandong',
        name: '山东',
        icon: require('image!icon-region-shandong'),
    }, {
        id: 5,
        tag: 'tianjin',
        name: '天津',
        icon: require('image!icon-region-tianjin'),
    }, {
        id: 6,
        tag: 'neimenggu',
        name: '内蒙古',
        icon: require('image!icon-region-neimenggu'),
    }],

    activitiesByRegion: {},

    session: {
        user: null,
        userstamp: null
    }
});

module.exports = store;
