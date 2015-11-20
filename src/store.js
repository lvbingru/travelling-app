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
    session: {
        user: null,
        userstamp: null
    }
});

module.exports = store;
