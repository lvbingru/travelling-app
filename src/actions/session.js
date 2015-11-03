const BUILD_SESSION = 'BUILD_SESSION';
const UPDATE_SESSION = 'UPDATE_SESSION';

function buildSession(userstamp, user) {
    return {
        type: BUILD_SESSION,
        userstamp,
        user
    };
}

function updateSession(session) {
    return {
        type: UPDATE_SESSION,
        session
    };
}

module.exports = {
    BUILD_SESSION,
    UPDATE_SESSION,

    buildSession,
    updateSession
};
