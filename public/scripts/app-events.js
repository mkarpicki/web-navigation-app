angular.module('navigationApp').value('events', {

    MAP_EVENT: 0,
    POSITION_EVENT: 1,
    NAVIGATION_STATE_EVENT: 2,

    MAP_EVENT_TYPES: {

        OVERWRITE_START_POINT: 0,
        ADD_WAY_POINT: 1,
        OVERWRITE_DESTINATION_POINT: 2,
        AVOID_AREA: 3
    },

    POSITION_EVENT_TYPES: {

        CHANGE: 0,
        ERROR: 1
    },

    NAVIGATION_STATE_EVENT_TYPES: {
        NAVIGATION_ON: 0,
        NAVIGATION_OFF: 1
    }

});
