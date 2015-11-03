var {
    activity,
    AV
} = require('../api');

const SELECT_REGION = 'SELECT_REGION';
const INVALIDATE_REGION = 'INVALIDATE_REGION';

const REQUEST_ACTIVITIES = 'REQUEST_ACTIVITIES';
const RECEIVE_ACTIVITIES = 'RECEIVE_ACTIVITIES';

const REQUEST_MORE_ACTIVITIES = 'REQUEST_MORE_ACTIVITIES';
const RECEIVE_MORE_ACTIVITIES = 'RECEIVE_MORE_ACTIVITIES';

function selectedRegion(region) {
    return {
        type: SELECT_REGION,
        region
    };
}

function invalidateRegion(region) {
    return {
        type: INVALIDATE_REGION,
        region
    }
}

function requestActivities(region) {
    return {
        type: REQUEST_ACTIVITIES,
        region
    }
}


function receiveActivities(region, activities) {
    return {
        type: RECEIVE_ACTIVITIES,
        region: region,
        activities: activities,
        receivedAt: Date.now()
    }
}

function fetchActivities(region) {
    return dispatch => {
        dispatch(requestActivities(region));

        var activities, user;
        return AV.User.currentAsync().then(function(_user) {
            user = _user;
            return activity.fetch({
                region: region
            });
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
            setTimeout(function() {
                dispatch(receiveActivities(region, activities));
            }, 2000);
        }, function(e) {
            console.trace(e);
            dispatch(receiveActivities(region, []));
        });
    }
}


function shouldFetchActivities(state, region) {
    const activities = state.activitiesByRegion[region.id];

    if (!activities) {
        return true;
    }

    if (activities.isFetching) {
        return false;
    }

    return posts.didInvalidate;
}


function fetchActivitiesIfNeeded(region) {
    return (dispatch, getState) => {
        if (shouldFetchActivities(getState(), region)) {
            return dispatch(fetchActivities(region));
        }
    }
}

// fetch more activities async

function requestMoreActivities(region, lastActivity) {
    return {
        type: REQUEST_MORE_ACTIVITIES,
        region,
        lastActivity
    }
}

function receiveMoreActivities(region, moreActivities) {
    return {
        type: RECEIVE_MORE_ACTIVITIES,
        region: region,
        moreActivities: moreActivities,
    }
}

function fetchMoreActivities(region, lastActivity) {
    return dispatch => {
        dispatch(requestMoreActivities(region, lastActivity));
        activity.fetch({
            region: region,
            lastActivity: lastActivity
        }).then(function(activities) {
            dispatch(receiveMoreActivities(region, activities));
        });
    }
}

function shouldFetchMoreActivities(state, region) {
    const activities = state.activitiesByRegion[region.id];

    if (!activities) {
        return false;
    }

    if (activities.isFetching) {
        return false;
    }

    if (activities.isFetchingMore) {
        return false
    }

    return true;
}

function fetchMoreActivitiesIfNeeded(region, lastActivity) {
    return (dispatch, getState) => {
        if (shouldFetchMoreActivities(getState(), region)) {
            return dispatch(fetchMoreActivities(region, lastActivity));
        }
    }
}

module.exports = {
    SELECT_REGION,
    INVALIDATE_REGION,

    REQUEST_ACTIVITIES,
    RECEIVE_ACTIVITIES,
    REQUEST_MORE_ACTIVITIES,
    RECEIVE_MORE_ACTIVITIES,

    selectedRegion,
    invalidateRegion,
    fetchActivitiesIfNeeded,
    fetchMoreActivitiesIfNeeded,

    ...require('./session')
};
