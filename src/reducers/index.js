var {combineReducers, createStore} = require('redux');
var ActionTypes = createStore.ActionTypes;

var {
    SELECT_REGION,
    INVALIDATE_REGION,

    REQUEST_ACTIVITIES,
    RECEIVE_ACTIVITIES,

    REQUEST_MORE_ACTIVITIES,
    RECEIVE_MORE_ACTIVITIES,

    UPDATE_SESSION,
    BUILD_SESSION
} = require('../actions');

function selectedRegion(state, action) {
    state = state || null;

    switch(action.type) {
        case SELECT_REGION:
            return action.region
        default:
            return state
    }
}

function activities(state, action) {
    state = {
        isFetching: false,
        didInvalidate: false,
        items: []
    };

    switch(action.type) {
        case INVALIDATE_REGION:
            return Object.assign({}, state, {
                didInvalidate: true
            })
        case REQUEST_ACTIVITIES:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            })

        case RECEIVE_ACTIVITIES:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                items: action.activities,
                lastUpdated: action.receivedAt
            })
        default:
            return state
    }
}

function activitiesByRegion(state, action) {
    state = state || {};

    switch(action.type) {
        case INVALIDATE_REGION:
        case REQUEST_ACTIVITIES:
        case RECEIVE_ACTIVITIES:
            try {
                return Object.assign({}, state, {
                    [action.region.id]: activities(state[action.region], action)
                });
            } catch(e) {
                console.trace(e);
                throw e;
            }
            
        default:
            return state;
    }
}

function regions(regions, action) {
    regions = regions || [];
    return regions;
}

function session(session, action) {
    session = session || {};

    switch(action.type) {
        case BUILD_SESSION:
            return Object.assign({}, session, {
                user: action.user,
                userstamp: action.userstamp
            });
        case UPDATE_SESSION:
            return Object.assign({}, session, action.session);
        default:
            return session
    }
}

const rootReducer = combineReducers({
    activitiesByRegion,
    selectedRegion,
    regions,
    session,
});

module.exports = rootReducer;
